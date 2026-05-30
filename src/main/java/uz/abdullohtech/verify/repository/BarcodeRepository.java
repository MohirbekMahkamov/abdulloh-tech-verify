package uz.abdullohtech.verify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import uz.abdullohtech.verify.entity.Barcode;

import java.util.Optional;

@Repository
public interface BarcodeRepository extends JpaRepository<Barcode, Long> {
    Optional<Barcode> findByCode(String code);
    boolean existsByCode(String code);

    @Query("SELECT COALESCE(SUM(b.scanCount), 0) FROM Barcode b")
    long sumScanCount();
}
