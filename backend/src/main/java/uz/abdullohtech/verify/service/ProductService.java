package uz.abdullohtech.verify.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.abdullohtech.verify.dto.ProductRequest;
import uz.abdullohtech.verify.entity.Product;
import uz.abdullohtech.verify.repository.ProductRepository;

import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final BarcodeService barcodeService;

    public ProductService(ProductRepository productRepository, BarcodeService barcodeService) {
        this.productRepository = productRepository;
        this.barcodeService = barcodeService;
    }

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mahsulot topilmadi, ID: " + id));
    }

    public Product createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .category(request.getCategory())
                .specs(request.getSpecs())
                .warrantyPeriod(request.getWarrantyPeriod())
                .supplierName(request.getSupplier() != null ? request.getSupplier().getName() : null)
                .supplierPhone(request.getSupplier() != null ? request.getSupplier().getPhone() : null)
                .supplierInn(request.getSupplier() != null ? request.getSupplier().getInn() : null)
                .receiverName(request.getReceiver() != null ? request.getReceiver().getName() : null)
                .receiverPhone(request.getReceiver() != null ? request.getReceiver().getPhone() : null)
                .receiverInn(request.getReceiver() != null ? request.getReceiver().getInn() : null)
                .manufacturer(request.getManufacturer() != null ? request.getManufacturer() : "Xenor-X")
                .build();
        Product savedProduct = productRepository.save(product);
        
        // Auto generate EAN-13 barcode
        barcodeService.generateBarcode(savedProduct.getId(), null, null);
        
        return savedProduct;
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setSpecs(request.getSpecs());
        product.setWarrantyPeriod(request.getWarrantyPeriod());
        product.setSupplierName(request.getSupplier() != null ? request.getSupplier().getName() : null);
        product.setSupplierPhone(request.getSupplier() != null ? request.getSupplier().getPhone() : null);
        product.setSupplierInn(request.getSupplier() != null ? request.getSupplier().getInn() : null);
        product.setReceiverName(request.getReceiver() != null ? request.getReceiver().getName() : null);
        product.setReceiverPhone(request.getReceiver() != null ? request.getReceiver().getPhone() : null);
        product.setReceiverInn(request.getReceiver() != null ? request.getReceiver().getInn() : null);
        product.setManufacturer(request.getManufacturer() != null ? request.getManufacturer() : "Xenor-X");
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
