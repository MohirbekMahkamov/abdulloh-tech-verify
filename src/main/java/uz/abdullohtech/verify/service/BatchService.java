package uz.abdullohtech.verify.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.abdullohtech.verify.dto.BatchRequest;
import uz.abdullohtech.verify.entity.Batch;
import uz.abdullohtech.verify.entity.Product;
import uz.abdullohtech.verify.repository.BatchRepository;
import uz.abdullohtech.verify.repository.ProductRepository;

import java.util.List;

@Service
@Transactional
public class BatchService {

    private final BatchRepository batchRepository;
    private final ProductRepository productRepository;

    public BatchService(BatchRepository batchRepository, ProductRepository productRepository) {
        this.batchRepository = batchRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Batch getBatchById(Long id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partiya topilmadi, ID: " + id));
    }

    public Batch createBatch(BatchRequest request) {
        if (batchRepository.findByBatchCode(request.getBatchCode()).isPresent()) {
            throw new IllegalArgumentException("Ushbu partiya kodi allaqachon mavjud: " + request.getBatchCode());
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Mahsulot topilmadi, ID: " + request.getProductId()));

        Batch batch = Batch.builder()
                .batchCode(request.getBatchCode())
                .product(product)
                .productionDate(request.getProductionDate())
                .totalCount(request.getTotalCount())
                .isoStandardStatus(request.getIsoStandardStatus())
                .build();

        return batchRepository.save(batch);
    }

    public Batch updateBatch(Long id, BatchRequest request) {
        Batch batch = getBatchById(id);

        batchRepository.findByBatchCode(request.getBatchCode())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new IllegalArgumentException("Ushbu partiya kodi allaqachon mavjud: " + request.getBatchCode());
                    }
                });

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Mahsulot topilmadi, ID: " + request.getProductId()));

        batch.setBatchCode(request.getBatchCode());
        batch.setProduct(product);
        batch.setProductionDate(request.getProductionDate());
        batch.setTotalCount(request.getTotalCount());
        batch.setIsoStandardStatus(request.getIsoStandardStatus());

        return batchRepository.save(batch);
    }

    public void deleteBatch(Long id) {
        Batch batch = getBatchById(id);
        batchRepository.delete(batch);
    }
}
