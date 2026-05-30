package uz.abdullohtech.verify.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BatchRequest {

    @NotBlank(message = "Partiya kodi bo'sh bo'lmasligi kerak")
    private String batchCode;

    @NotNull(message = "Mahsulot tanlanishi shart")
    private Long productId;

    @NotNull(message = "Ishlab chiqarilgan sana kiritilishi shart")
    private LocalDate productionDate;

    @NotNull(message = "Mahsulotlar soni kiritilishi shart")
    @Min(value = 1, message = "Mahsulotlar soni kamida 1 ta bo'lishi kerak")
    private Integer totalCount;

    @NotNull(message = "ISO standarti holati kiritilishi shart")
    private Boolean isoStandardStatus;
}
