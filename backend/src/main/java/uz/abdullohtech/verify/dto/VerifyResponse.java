package uz.abdullohtech.verify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyResponse {

    private String status; // ORIGINAL, INVALID
    private ProductDetails product;
    private List<String> certificates;
    private DealerDetails dealer;
    private BatchDetails batch;
    private ScanDetails scanInfo;
    private String manufacturer;
    private LogisticsDetails supplier;
    private LogisticsDetails receiver;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LogisticsDetails {
        private String name;
        private String phone;
        private String inn;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductDetails {
        private String name;
        private String category;
        private String warranty;
        private Map<String, Object> specs;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DealerDetails {
        private String name;
        private String region;
        private String contactInfo;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BatchDetails {
        private String batchCode;
        private LocalDate productionDate;
        private Integer totalCount;
        private Boolean isoStandardStatus;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ScanDetails {
        private Integer totalScans;
        private LocalDateTime lastScannedAt;
        private LocalDateTime firstScannedAt;
    }
}
