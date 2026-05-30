package uz.abdullohtech.verify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerifyRequest {

    @NotBlank(message = "Shtrix-kod bo'sh bo'lmasligi kerak")
    @Pattern(regexp = "^\\d{13}$", message = "Shtrix-kod EAN-13 formatida (13 ta raqam) bo'lishi shart")
    private String code;
}
