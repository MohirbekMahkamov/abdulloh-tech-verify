package uz.abdullohtech.verify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.abdullohtech.verify.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
