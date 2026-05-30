package uz.abdullohtech.verify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DealerRequest {

    @NotBlank(message = "Diler nomi bo'sh bo'lmasligi kerak")
    private String name;

    @NotBlank(message = "Hudud bo'sh bo'lmasligi kerak")
    private String region;

    @NotBlank(message = "Aloqa ma'lumotlari bo'sh bo'lmasligi kerak")
    private String contactInfo;

    @NotNull(message = "Faollik holati kiritilishi shart")
    private Boolean isActive;
}
