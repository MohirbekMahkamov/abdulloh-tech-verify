package uz.abdullohtech.verify.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.abdullohtech.verify.dto.VerifyResponse;
import uz.abdullohtech.verify.entity.Barcode;
import uz.abdullohtech.verify.entity.ScanLog;
import uz.abdullohtech.verify.repository.BarcodeRepository;
import uz.abdullohtech.verify.repository.ScanLogRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class VerificationService {

    private final BarcodeRepository barcodeRepository;
    private final ScanLogRepository scanLogRepository;
    private final ObjectMapper objectMapper;

    public VerificationService(BarcodeRepository barcodeRepository,
                               ScanLogRepository scanLogRepository,
                               ObjectMapper objectMapper) {
        this.barcodeRepository = barcodeRepository;
        this.scanLogRepository = scanLogRepository;
        this.objectMapper = objectMapper;
    }

    public VerifyResponse verifyBarcode(String code, String ipAddress, String userAgent) {
        OptionalBarcodeWrapper barcodeWrapper = findBarcodeAndLog(code, ipAddress, userAgent);
        
        if (barcodeWrapper.barcode == null) {
            return VerifyResponse.builder()
                    .status("INVALID")
                    .build();
        }

        Barcode barcode = barcodeWrapper.barcode;
        ScanLog scanLog = barcodeWrapper.scanLog;

        // Parse specifications
        Map<String, Object> specsMap = new HashMap<>();
        try {
            specsMap = objectMapper.readValue(barcode.getProduct().getSpecs(), new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            specsMap.put("error", "Xususiyatlarni o'qishda xatolik");
            specsMap.put("raw", barcode.getProduct().getSpecs());
        }

        // Fetch scan history details
        LocalDateTime firstScan = barcode.getLastScannedAt() == null ? LocalDateTime.now() : barcode.getCreatedAt();
        // Since we logged this scan, if total scan is 1, then this scan is the first scan
        int totalScans = barcode.getScanCount();

        VerifyResponse.ProductDetails productDetails = VerifyResponse.ProductDetails.builder()
                .name(barcode.getProduct().getName())
                .category(barcode.getProduct().getCategory().name())
                .warranty(barcode.getProduct().getWarrantyPeriod())
                .specs(specsMap)
                .build();

        VerifyResponse.DealerDetails dealerDetails = null;
        if (barcode.getDealer() != null) {
            dealerDetails = VerifyResponse.DealerDetails.builder()
                    .name(barcode.getDealer().getName())
                    .region(barcode.getDealer().getRegion())
                    .contactInfo(barcode.getDealer().getContactInfo())
                    .build();
        }

        VerifyResponse.BatchDetails batchDetails = null;
        if (barcode.getBatch() != null) {
            batchDetails = VerifyResponse.BatchDetails.builder()
                    .batchCode(barcode.getBatch().getBatchCode())
                    .productionDate(barcode.getBatch().getProductionDate())
                    .totalCount(barcode.getBatch().getTotalCount())
                    .isoStandardStatus(barcode.getBatch().getIsoStandardStatus())
                    .build();
        }

        VerifyResponse.ScanDetails scanDetails = VerifyResponse.ScanDetails.builder()
                .totalScans(totalScans)
                .lastScannedAt(barcode.getLastScannedAt())
                .firstScannedAt(firstScan)
                .build();

        return VerifyResponse.builder()
                .status("ORIGINAL")
                .product(productDetails)
                .certificates(Arrays.asList("ISO 9001:2015", "CE"))
                .dealer(dealerDetails)
                .batch(batchDetails)
                .scanInfo(scanDetails)
                .build();
    }

    private OptionalBarcodeWrapper findBarcodeAndLog(String code, String ipAddress, String userAgent) {
        OptionalBarcodeWrapper wrapper = new OptionalBarcodeWrapper();
        barcodeRepository.findByCode(code).ifPresent(barcode -> {
            barcode.setScanCount(barcode.getScanCount() + 1);
            barcode.setLastScannedAt(LocalDateTime.now());
            barcodeRepository.save(barcode);

            ScanLog log = ScanLog.builder()
                    .barcode(barcode)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .build();
            scanLogRepository.save(log);

            wrapper.barcode = barcode;
            wrapper.scanLog = log;
        });
        return wrapper;
    }

    private static class OptionalBarcodeWrapper {
        Barcode barcode;
        ScanLog scanLog;
    }
}
