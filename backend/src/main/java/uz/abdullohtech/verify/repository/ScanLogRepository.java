package uz.abdullohtech.verify.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import uz.abdullohtech.verify.entity.ScanLog;

import java.util.List;

@Repository
public interface ScanLogRepository extends JpaRepository<ScanLog, Long> {
    
    @Query("SELECT s FROM ScanLog s ORDER BY s.scannedAt DESC")
    List<ScanLog> findRecentScans(Pageable pageable);
}
