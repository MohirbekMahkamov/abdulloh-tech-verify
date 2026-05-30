package uz.abdullohtech.verify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.abdullohtech.verify.entity.Product.Category;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Nomi bo'sh bo'lmasligi kerak")
    private String name;

    @NotNull(message = "Kategoriya kiritilishi shart")
    private Category category;

    @NotBlank(message = "Texnik xususiyatlari (specs) bo'sh bo'lmasligi kerak (JSON formatda)")
    private String specs;

    @NotBlank(message = "Kafolat muddati bo'sh bo'lmasligi kerak")
    private String warrantyPeriod;
}
