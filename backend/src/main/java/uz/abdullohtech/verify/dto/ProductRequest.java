package uz.abdullohtech.verify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.abdullohtech.verify.entity.Product.Category;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductRequest {

    @NotBlank(message = "Nomi bo'sh bo'lmasligi kerak")
    private String name;

    @NotNull(message = "Kategoriya kiritilishi shart")
    private Category category;

    @NotBlank(message = "Texnik xususiyatlari (specs) bo'sh bo'lmasligi kerak (JSON formatda)")
    private String specs;

    @NotBlank(message = "Kafolat muddati bo'sh bo'lmasligi kerak")
    private String warrantyPeriod;

    private String manufacturer;
    private SupplierDetails supplier;
    private ReceiverDetails receiver;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SupplierDetails {
        private String name;
        private String phone;
        private String inn;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReceiverDetails {
        private String name;
        private String phone;
        private String inn;
    }
}
