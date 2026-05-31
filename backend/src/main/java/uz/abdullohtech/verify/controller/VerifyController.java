package uz.abdullohtech.verify.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.abdullohtech.verify.dto.VerifyRequest;
import uz.abdullohtech.verify.dto.VerifyResponse;
import uz.abdullohtech.verify.entity.Product;
import uz.abdullohtech.verify.service.VerificationService;
import uz.abdullohtech.verify.service.ProductService;

import uz.abdullohtech.verify.entity.AdminUser;
import uz.abdullohtech.verify.repository.AdminUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/verify")
public class VerifyController {

    private final VerificationService verificationService;
    private final ProductService productService;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public VerifyController(VerificationService verificationService, 
                            ProductService productService,
                            AdminUserRepository adminUserRepository,
                            PasswordEncoder passwordEncoder) {
        this.verificationService = verificationService;
        this.productService = productService;
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/health-ping")
    public ResponseEntity<Map<String, String>> healthPing() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getPublicProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping
    public ResponseEntity<VerifyResponse> verifyBarcode(@Valid @RequestBody VerifyRequest request, HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        String userAgent = servletRequest.getHeader("User-Agent");
        VerifyResponse response = verificationService.verifyBarcode(request.getCode(), ipAddress, userAgent);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{code}")
    public ResponseEntity<VerifyResponse> verifyBarcodeByGet(@PathVariable String code, HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        String userAgent = servletRequest.getHeader("User-Agent");
        VerifyResponse response = verificationService.verifyBarcode(code, ipAddress, userAgent);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/db-setup")
    public ResponseEntity<Map<String, String>> dbSetup() {
        try {
            if (adminUserRepository.findByEmail("admin@abdulloh.tech").isEmpty()) {
                AdminUser admin = new AdminUser();
                admin.setEmail("admin@abdulloh.tech");
                admin.setPasswordHash(passwordEncoder.encode("Admin123!"));
                admin.setFullName("Abdulloh Admin");
                admin.setRole("ROLE_ADMIN");
                adminUserRepository.save(admin);
                return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Admin user created successfully"));
            } else {
                AdminUser admin = adminUserRepository.findByEmail("admin@abdulloh.tech").get();
                admin.setPasswordHash(passwordEncoder.encode("Admin123!"));
                adminUserRepository.save(admin);
                return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Admin user password reset successfully"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "ERROR", "message", e.getMessage()));
        }
    }

    @GetMapping("/db-cleanup")
    public ResponseEntity<Map<String, String>> dbCleanup() {
        try {
            List<uz.abdullohtech.verify.entity.Product> products = productService.getAllProducts();
            int cleaned = 0;
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            for (uz.abdullohtech.verify.entity.Product product : products) {
                try {
                    @SuppressWarnings("unchecked")
                    java.util.Map<String, Object> specs = mapper.readValue(product.getSpecs(), java.util.Map.class);
                    if (specs.containsKey("_logistics")) {
                        specs.remove("_logistics");
                        product.setSpecs(mapper.writeValueAsString(specs));
                        productService.updateProduct(product.getId(), 
                            new uz.abdullohtech.verify.dto.ProductRequest(
                                product.getName(),
                                product.getCategory(),
                                product.getSpecs(),
                                product.getWarrantyPeriod(),
                                product.getManufacturer(),
                                product.getSupplierName() != null ? new uz.abdullohtech.verify.dto.ProductRequest.SupplierDetails(product.getSupplierName(), product.getSupplierPhone(), product.getSupplierInn()) : null,
                                product.getReceiverName() != null ? new uz.abdullohtech.verify.dto.ProductRequest.ReceiverDetails(product.getReceiverName(), product.getReceiverPhone(), product.getReceiverInn()) : null
                            )
                        );
                        cleaned++;
                    }
                } catch (Exception ignored) {}
            }
            return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Cleaned " + cleaned + " products"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "ERROR", "message", e.getMessage()));
        }
    }
}
