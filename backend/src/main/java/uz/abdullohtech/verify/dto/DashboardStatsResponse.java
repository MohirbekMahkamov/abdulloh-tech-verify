package uz.abdullohtech.verify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    private long totalProducts;
    private long totalBatches;
    private long totalDealers;
    private long totalBarcodes;
    private long totalScans;
    private List<RecentScan> recentScans;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentScan {
        private String barcode;
        private String productName;
        private LocalDateTime scannedAt;
        private String ipAddress;
        private String userAgent;
    }
}
