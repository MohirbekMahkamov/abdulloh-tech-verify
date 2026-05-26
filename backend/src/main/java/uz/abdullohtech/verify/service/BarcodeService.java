package uz.abdullohtech.verify.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import uz.abdullohtech.verify.entity.Barcode;
import uz.abdullohtech.verify.entity.Batch;
import uz.abdullohtech.verify.entity.Dealer;
import uz.abdullohtech.verify.entity.Product;
import uz.abdullohtech.verify.repository.BarcodeRepository;
import uz.abdullohtech.verify.repository.BatchRepository;
import uz.abdullohtech.verify.repository.DealerRepository;
import uz.abdullohtech.verify.repository.ProductRepository;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
@Transactional
public class BarcodeService {

    private final BarcodeRepository barcodeRepository;
    private final ProductRepository productRepository;
    private final BatchRepository batchRepository;
    private final DealerRepository dealerRepository;

    public BarcodeService(BarcodeRepository barcodeRepository,
                          ProductRepository productRepository,
                          BatchRepository batchRepository,
                          DealerRepository dealerRepository) {
        this.barcodeRepository = barcodeRepository;
        this.productRepository = productRepository;
        this.batchRepository = batchRepository;
        this.dealerRepository = dealerRepository;
    }

    @Transactional(readOnly = true)
    public List<Barcode> getAllBarcodes() {
        return barcodeRepository.findAll();
    }

    public static boolean isValidEAN13(String code) {
        if (code == null || !code.matches("\\d{13}")) {
            return false;
        }
        int sum = 0;
        for (int i = 0; i < 12; i++) {
            int digit = Character.getNumericValue(code.charAt(i));
            sum += (i % 2 == 0) ? digit : digit * 3;
        }
        int checkDigit = (10 - (sum % 10)) % 10;
        return checkDigit == Character.getNumericValue(code.charAt(12));
    }

    public Map<String, Object> uploadBarcodes(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Yuklangan fayl bo'sh");
        }

        List<String> errors = new ArrayList<>();
        List<Barcode> savedBarcodes = new ArrayList<>();
        Set<String> processedCodes = new HashSet<>();
        int duplicateCount = 0;

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            // Skip header row if present
            if (rows.hasNext()) {
                rows.next();
            }

            int rowIdx = 1;
            while (rows.hasNext()) {
                rowIdx++;
                Row row = rows.next();

                // Read cells
                Cell codeCell = row.getCell(0);
                Cell productCell = row.getCell(1);
                Cell batchCell = row.getCell(2);
                Cell dealerCell = row.getCell(3);

                if (codeCell == null) continue;

                String code = getCellValueAsString(codeCell).trim();
                if (code.isEmpty()) continue;

                // 1. EAN-13 Validation
                if (!isValidEAN13(code)) {
                    errors.add("Qator " + rowIdx + ": Shtrix-kod noto'g'ri EAN-13 formatida: " + code);
                    continue;
                }

                // 2. Excel internal duplicate check
                if (processedCodes.contains(code)) {
                    errors.add("Qator " + rowIdx + ": Faylning o'zida takrorlangan shtrix-kod: " + code);
                    continue;
                }

                // 3. Database duplicate check
                if (barcodeRepository.existsByCode(code)) {
                    duplicateCount++;
                    continue;
                }

                processedCodes.add(code);

                // 3. Product check
                if (productCell == null) {
                    errors.add("Qator " + rowIdx + ": Mahsulot ID ko'rsatilmagan");
                    continue;
                }
                Long productId = getCellValueAsLong(productCell);
                Optional<Product> productOpt = productRepository.findById(productId);
                if (productOpt.isEmpty()) {
                    errors.add("Qator " + rowIdx + ": Mahsulot topilmadi (ID: " + productId + ")");
                    continue;
                }

                // 4. Batch check (Optional)
                Batch batch = null;
                if (batchCell != null) {
                    Long batchId = getCellValueAsLong(batchCell);
                    if (batchId != null) {
                        Optional<Batch> batchOpt = batchRepository.findById(batchId);
                        if (batchOpt.isPresent()) {
                            batch = batchOpt.get();
                        } else {
                            errors.add("Qator " + rowIdx + ": Partiya topilmadi (ID: " + batchId + "). Shtrix-kod partiyasiz qo'shildi.");
                        }
                    }
                }

                // 5. Dealer check (Optional)
                Dealer dealer = null;
                if (dealerCell != null) {
                    Long dealerId = getCellValueAsLong(dealerCell);
                    if (dealerId != null) {
                        Optional<Dealer> dealerOpt = dealerRepository.findById(dealerId);
                        if (dealerOpt.isPresent()) {
                            dealer = dealerOpt.get();
                        } else {
                            errors.add("Qator " + rowIdx + ": Diler topilmadi (ID: " + dealerId + "). Shtrix-kod dilersiz qo'shildi.");
                        }
                    }
                }

                Barcode barcode = Barcode.builder()
                        .code(code)
                        .product(productOpt.get())
                        .batch(batch)
                        .dealer(dealer)
                        .isActive(true)
                        .scanCount(0)
                        .build();

                savedBarcodes.add(barcode);
            }

            if (!savedBarcodes.isEmpty()) {
                barcodeRepository.saveAll(savedBarcodes);
            }

        } catch (IOException e) {
            throw new RuntimeException("Excel faylini o'qishda xatolik yuz berdi: " + e.getMessage());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("successCount", savedBarcodes.size());
        result.put("duplicateCount", duplicateCount);
        result.put("errors", errors);
        return result;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        CellType cellType = cell.getCellType();
        if (cellType == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (cellType == CellType.NUMERIC) {
            // Check if it is represented as a double but represents an EAN-13 integer
            double val = cell.getNumericCellValue();
            return String.format("%.0f", val);
        } else if (cellType == CellType.BOOLEAN) {
            return String.valueOf(cell.getBooleanCellValue());
        }
        return "";
    }

    private Long getCellValueAsLong(Cell cell) {
        if (cell == null) return null;
        CellType cellType = cell.getCellType();
        if (cellType == CellType.NUMERIC) {
            return (long) cell.getNumericCellValue();
        } else if (cellType == CellType.STRING) {
            try {
                return Long.parseLong(cell.getStringCellValue().trim());
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    public String generateEAN13Code() {
        Random random = new Random();
        String codeWithoutCheckDigit;
        String fullCode;
        int attempts = 0;
        
        do {
            StringBuilder sb = new StringBuilder("478");
            for (int i = 0; i < 9; i++) {
                sb.append(random.nextInt(10));
            }
            codeWithoutCheckDigit = sb.toString();
            
            // Calculate EAN-13 check digit
            int sum = 0;
            for (int i = 0; i < 12; i++) {
                int digit = Character.getNumericValue(codeWithoutCheckDigit.charAt(i));
                sum += (i % 2 == 0) ? digit : digit * 3;
            }
            int checkDigit = (10 - (sum % 10)) % 10;
            fullCode = codeWithoutCheckDigit + checkDigit;
            attempts++;
        } while (barcodeRepository.existsByCode(fullCode) && attempts < 100);
        
        return fullCode;
    }

    public Barcode generateBarcode(Long productId, Long batchId, Long dealerId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Mahsulot topilmadi"));
                
        Batch batch = null;
        if (batchId != null) {
            batch = batchRepository.findById(batchId).orElse(null);
        }
        
        Dealer dealer = null;
        if (dealerId != null) {
            dealer = dealerRepository.findById(dealerId).orElse(null);
        }
        
        String code = generateEAN13Code();
        
        Barcode barcode = Barcode.builder()
                .code(code)
                .product(product)
                .batch(batch)
                .dealer(dealer)
                .isActive(true)
                .scanCount(0)
                .build();
                
        return barcodeRepository.save(barcode);
    }

    public List<Barcode> generateBarcodes(Long productId, Integer count, Long batchId, Long dealerId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Mahsulot topilmadi"));
                
        Batch batch = null;
        if (batchId != null) {
            batch = batchRepository.findById(batchId).orElse(null);
        }
        
        Dealer dealer = null;
        if (dealerId != null) {
            dealer = dealerRepository.findById(dealerId).orElse(null);
        }
        
        List<Barcode> list = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            String code = generateEAN13Code();
            Barcode barcode = Barcode.builder()
                    .code(code)
                    .product(product)
                    .batch(batch)
                    .dealer(dealer)
                    .isActive(true)
                    .scanCount(0)
                    .build();
            list.add(barcode);
        }
        
        return barcodeRepository.saveAll(list);
    }
}

