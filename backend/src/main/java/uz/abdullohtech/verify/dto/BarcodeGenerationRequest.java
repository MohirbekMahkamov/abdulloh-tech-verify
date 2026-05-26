package uz.abdullohtech.verify.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BarcodeGenerationRequest {

    @NotNull(message = "Mahsulot ID kiritilishi shart")
    private Long productId;

    private Integer count; // optional (used for batch generation)

    private Long batchId; // optional

    private Long dealerId; // optional
}
