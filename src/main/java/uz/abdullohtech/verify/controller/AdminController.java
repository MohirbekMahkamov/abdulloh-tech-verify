package uz.abdullohtech.verify.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uz.abdullohtech.verify.dto.*;
import uz.abdullohtech.verify.entity.Barcode;
import uz.abdullohtech.verify.entity.Batch;
import uz.abdullohtech.verify.entity.Dealer;
import uz.abdullohtech.verify.entity.Product;
import uz.abdullohtech.verify.repository.BarcodeRepository;
import uz.abdullohtech.verify.repository.BatchRepository;
import uz.abdullohtech.verify.repository.DealerRepository;
import uz.abdullohtech.verify.repository.ProductRepository;
import uz.abdullohtech.verify.repository.ScanLogRepository;
import uz.abdullohtech.verify.service.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AuthService authService;
    private final ProductService productService;
    private final BatchService batchService;
    private final DealerService dealerService;
    private final BarcodeService barcodeService;
    
    // Repos for stats
    private final ProductRepository productRepository;
    private final BatchRepository batchRepository;
    private final DealerRepository dealerRepository;
    private final BarcodeRepository barcodeRepository;
    private final ScanLogRepository scanLogRepository;

    public AdminController(AuthService authService,
                           ProductService productService,
                           BatchService batchService,
                           DealerService dealerService,
                           BarcodeService barcodeService,
                           ProductRepository productRepository,
                           BatchRepository batchRepository,
                           DealerRepository dealerRepository,
                           BarcodeRepository barcodeRepository,
                           ScanLogRepository scanLogRepository) {
        this.authService = authService;
        this.productService = productService;
        this.batchService = batchService;
        this.dealerService = dealerService;
        this.barcodeService = barcodeService;
        this.productRepository = productRepository;
        this.batchRepository = batchRepository;
        this.dealerRepository = dealerRepository;
        this.barcodeRepository = barcodeRepository;
        this.scanLogRepository = scanLogRepository;
    }

    // --- Authentication ---
    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // --- Dashboard Stats ---
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        long totalProducts = productRepository.count();
        long totalBatches = batchRepository.count();
        long totalDealers = dealerRepository.count();
        long totalBarcodes = barcodeRepository.count();
        long totalScans = barcodeRepository.sumScanCount();

        List<DashboardStatsResponse.RecentScan> recentScans = scanLogRepository.findRecentScans(PageRequest.of(0, 10))
                .stream()
                .map(log -> DashboardStatsResponse.RecentScan.builder()
                        .barcode(log.getBarcode().getCode())
                        .productName(log.getBarcode().getProduct().getName())
                        .scannedAt(log.getScannedAt())
                        .ipAddress(log.getIpAddress())
                        .userAgent(log.getUserAgent())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(DashboardStatsResponse.builder()
                .totalProducts(totalProducts)
                .totalBatches(totalBatches)
                .totalDealers(totalDealers)
                .totalBarcodes(totalBarcodes)
                .totalScans(totalScans)
                .recentScans(recentScans)
                .build());
    }

    // --- Products CRUD ---
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // --- Batches CRUD ---
    @GetMapping("/batches")
    public ResponseEntity<List<Batch>> getAllBatches() {
        return ResponseEntity.ok(batchService.getAllBatches());
    }

    @PostMapping("/batches")
    public ResponseEntity<Batch> createBatch(@Valid @RequestBody BatchRequest request) {
        return ResponseEntity.ok(batchService.createBatch(request));
    }

    @PutMapping("/batches/{id}")
    public ResponseEntity<Batch> updateBatch(@PathVariable Long id, @Valid @RequestBody BatchRequest request) {
        return ResponseEntity.ok(batchService.updateBatch(id, request));
    }

    @DeleteMapping("/batches/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable Long id) {
        batchService.deleteBatch(id);
        return ResponseEntity.noContent().build();
    }

    // --- Dealers CRUD ---
    @GetMapping("/dealers")
    public ResponseEntity<List<Dealer>> getAllDealers() {
        return ResponseEntity.ok(dealerService.getAllDealers());
    }

    @PostMapping("/dealers")
    public ResponseEntity<Dealer> createDealer(@Valid @RequestBody DealerRequest request) {
        return ResponseEntity.ok(dealerService.createDealer(request));
    }

    @PutMapping("/dealers/{id}")
    public ResponseEntity<Dealer> updateDealer(@PathVariable Long id, @Valid @RequestBody DealerRequest request) {
        return ResponseEntity.ok(dealerService.updateDealer(id, request));
    }

    @DeleteMapping("/dealers/{id}")
    public ResponseEntity<Void> deleteDealer(@PathVariable Long id) {
        dealerService.deleteDealer(id);
        return ResponseEntity.noContent().build();
    }

    // --- Barcodes ---
    @GetMapping("/barcodes")
    public ResponseEntity<List<Barcode>> getAllBarcodes() {
        return ResponseEntity.ok(barcodeService.getAllBarcodes());
    }

    @PostMapping("/barcodes/upload")
    public ResponseEntity<Map<String, Object>> uploadBarcodes(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(barcodeService.uploadBarcodes(file));
    }

    @PostMapping("/barcodes/generate")
    public ResponseEntity<Barcode> generateBarcode(@Valid @RequestBody BarcodeGenerationRequest request) {
        return ResponseEntity.ok(barcodeService.generateBarcode(
                request.getProductId(),
                request.getBatchId(),
                request.getDealerId()
        ));
    }

    @PostMapping("/barcodes/generate-batch")
    public ResponseEntity<List<Barcode>> generateBarcodes(@Valid @RequestBody BarcodeGenerationRequest request) {
        int count = request.getCount() != null ? request.getCount() : 1;
        return ResponseEntity.ok(barcodeService.generateBarcodes(
                request.getProductId(),
                count,
                request.getBatchId(),
                request.getDealerId()
        ));
    }
}

