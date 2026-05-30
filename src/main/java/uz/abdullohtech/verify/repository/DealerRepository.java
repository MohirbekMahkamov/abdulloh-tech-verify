package uz.abdullohtech.verify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.abdullohtech.verify.entity.Dealer;

@Repository
public interface DealerRepository extends JpaRepository<Dealer, Long> {
}
