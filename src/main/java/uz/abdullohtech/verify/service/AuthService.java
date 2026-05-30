package uz.abdullohtech.verify.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uz.abdullohtech.verify.dto.LoginRequest;
import uz.abdullohtech.verify.dto.LoginResponse;
import uz.abdullohtech.verify.entity.AdminUser;
import uz.abdullohtech.verify.repository.AdminUserRepository;
import uz.abdullohtech.verify.security.JwtTokenProvider;

@Service
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public LoginResponse login(LoginRequest request) {
        AdminUser adminUser = adminUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Noto'g'ri email yoki parol"));

        if (!passwordEncoder.matches(request.getPassword(), adminUser.getPasswordHash())) {
            throw new IllegalArgumentException("Noto'g'ri email yoki parol");
        }

        String token = tokenProvider.generateToken(adminUser.getEmail());

        return LoginResponse.builder()
                .token(token)
                .user(LoginResponse.UserDetails.builder()
                        .email(adminUser.getEmail())
                        .fullName(adminUser.getFullName())
                        .role(adminUser.getRole())
                        .build())
                .build();
    }
}
