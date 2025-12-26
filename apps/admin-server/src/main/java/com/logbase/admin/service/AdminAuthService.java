package com.logbase.admin.service;

import com.logbase.admin.model.AdminUser;
import com.logbase.admin.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminAuthService implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Authenticate admin with username and password.
     */
    public String authenticate(String username, String password) {
        Optional<AdminUser> optAdmin = adminUserRepository.findByUsername(username);
        
        if (optAdmin.isEmpty()) {
            throw new RuntimeException("Invalid username or password");
        }

        AdminUser admin = optAdmin.get();

        if (!admin.isActive()) {
            throw new RuntimeException("Account is disabled");
        }

        if (!passwordEncoder.matches(password, admin.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }

        // Update last login
        admin.setLastLoginAt(LocalDateTime.now());
        adminUserRepository.save(admin);

        log.info("Admin {} logged in", username);
        return jwtService.generateToken(admin.getUsername(), admin.getRole());
    }

    /**
     * Seed initial admin users on startup.
     */
    @Override
    public void run(String... args) {
        seedAdminUser("okan.acer", "mersin.acer33", "Okan Acer", "SUPER_ADMIN");
        seedAdminUser("meltem.gonen", "mersin.acer33", "Meltem Gönen", "ADMIN");
    }

    private void seedAdminUser(String username, String password, String displayName, String role) {
        if (!adminUserRepository.existsByUsername(username)) {
            AdminUser admin = AdminUser.builder()
                    .username(username)
                    .passwordHash(passwordEncoder.encode(password))
                    .displayName(displayName)
                    .role(role)
                    .active(true)
                    .build();
            adminUserRepository.save(admin);
            log.info("Created admin user: {} ({})", username, role);
        }
    }
}
