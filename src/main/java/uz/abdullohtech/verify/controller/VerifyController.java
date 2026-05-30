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

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/verify")
public class VerifyController {

    private final VerificationService verificationService;
    private final ProductService productService;

    public VerifyController(VerificationService verificationService, ProductService productService) {
        this.verificationService = verificationService;
        this.productService = productService;
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
        
        if ("INVALID".equals(response.getStatus())) {
            return ResponseEntity.status(404).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{code}")
    public ResponseEntity<VerifyResponse> verifyBarcodeByGet(@PathVariable String code, HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        String userAgent = servletRequest.getHeader("User-Agent");
        VerifyResponse response = verificationService.verifyBarcode(code, ipAddress, userAgent);
        
        if ("INVALID".equals(response.getStatus())) {
            return ResponseEntity.status(404).body(response);
        }
        return ResponseEntity.ok(response);
    }
}
