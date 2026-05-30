package uz.abdullohtech.verify.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Email kiritilishi shart")
    @Email(message = "Noto'g'ri email formati")
    private String email;

    @NotBlank(message = "Parol kiritilishi shart")
    private String password;
}
