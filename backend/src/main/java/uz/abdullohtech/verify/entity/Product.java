package uz.abdullohtech.verify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String specs; // Store JSON string

    @Column(name = "warranty_period", nullable = false)
    private String warrantyPeriod;

    @Column(name = "supplier_name")
    private String supplierName;

    @Column(name = "supplier_phone")
    private String supplierPhone;

    @Column(name = "supplier_inn")
    private String supplierInn;

    @Column(name = "receiver_name")
    private String receiverName;

    @Column(name = "receiver_phone")
    private String receiverPhone;

    @Column(name = "receiver_inn")
    private String receiverInn;

    @Column(name = "manufacturer")
    private String manufacturer;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Category {
        ELECTRONICS,
        PRINTER,
        FURNITURE,
        TEXTILE
    }
}
