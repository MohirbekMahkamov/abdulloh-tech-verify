package uz.abdullohtech.verify.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.abdullohtech.verify.dto.DealerRequest;
import uz.abdullohtech.verify.entity.Dealer;
import uz.abdullohtech.verify.repository.DealerRepository;

import java.util.List;

@Service
@Transactional
public class DealerService {

    private final DealerRepository dealerRepository;

    public DealerService(DealerRepository dealerRepository) {
        this.dealerRepository = dealerRepository;
    }

    @Transactional(readOnly = true)
    public List<Dealer> getAllDealers() {
        return dealerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Dealer getDealerById(Long id) {
        return dealerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Diler topilmadi, ID: " + id));
    }

    public Dealer createDealer(DealerRequest request) {
        Dealer dealer = Dealer.builder()
                .name(request.getName())
                .region(request.getRegion())
                .contactInfo(request.getContactInfo())
                .isActive(request.getIsActive())
                .build();
        return dealerRepository.save(dealer);
    }

    public Dealer updateDealer(Long id, DealerRequest request) {
        Dealer dealer = getDealerById(id);
        dealer.setName(request.getName());
        dealer.setRegion(request.getRegion());
        dealer.setContactInfo(request.getContactInfo());
        dealer.setIsActive(request.getIsActive());
        return dealerRepository.save(dealer);
    }

    public void deleteDealer(Long id) {
        Dealer dealer = getDealerById(id);
        dealerRepository.delete(dealer);
    }
}
