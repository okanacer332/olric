package com.logbase.admin.service;

import com.logbase.admin.model.AdminUser;
import com.logbase.admin.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminAuthService implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Read default password from environment variable (optional)
    @Value("${admin.default.password:}")
    private String defaultAdminPassword;

    // In-memory/local brute-force protection
    private final java.util.Map<String, java.util.concurrent.atomic.AtomicInteger> failedAttempts = new java.util.concurrent.ConcurrentHashMap<>();
    private final java.util.Map<String, LocalDateTime> lockouts = new java.util.concurrent.ConcurrentHashMap<>();
    
    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCKOUT_MINUTES = 15;

    /**
     * Authenticate admin with username and password.
     */
    public String authenticate(String username, String password) {
        // 1. Check if locked out
        if (isAccountLocked(username)) {
            throw new RuntimeException("Account is locked due to too many failed attempts. Try again in " + LOCKOUT_MINUTES + " minutes.");
        }

        Optional<AdminUser> optAdmin = adminUserRepository.findByUsername(username);
        
        if (optAdmin.isEmpty()) {
            // Use constant-time comparison to prevent timing attacks
            passwordEncoder.matches(password, "$2a$10$dummyhashtopreventtimingattacks");
            recordFailedAttempt(username);
            throw new RuntimeException("Invalid username or password");
        }

        AdminUser admin = optAdmin.get();

        if (!admin.isActive()) {
            throw new RuntimeException("Account is disabled");
        }

        if (!passwordEncoder.matches(password, admin.getPasswordHash())) {
            recordFailedAttempt(username);
            throw new RuntimeException("Invalid username or password");
        }

        // Login successful - reset attempts
        resetFailedAttempts(username);

        // Update last login
        admin.setLastLoginAt(LocalDateTime.now());
        adminUserRepository.save(admin);

        log.info("Admin {} logged in", username);
        return jwtService.generateToken(admin.getUsername(), admin.getRole());
    }

    private void recordFailedAttempt(String username) {
        int attempts = failedAttempts.computeIfAbsent(username, k -> new java.util.concurrent.atomic.AtomicInteger(0)).incrementAndGet();
        if (attempts >= MAX_ATTEMPTS) {
            lockouts.put(username, LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES));
            failedAttempts.remove(username); // Reset attempts so they count from 0 after lockout expires (or simply lock is enough)
            log.warn("Account {} locked due to too many failed attempts", username);
        }
    }

    private void resetFailedAttempts(String username) {
        failedAttempts.remove(username);
        lockouts.remove(username);
    }

    private boolean isAccountLocked(String username) {
        if (lockouts.containsKey(username)) {
            LocalDateTime unlockTime = lockouts.get(username);
            if (LocalDateTime.now().isBefore(unlockTime)) {
                return true;
            } else {
                // Lock expired
                lockouts.remove(username);
                return false;
            }
        }
        return false;
    }

    /**
     * Seed initial admin users on startup.
     * Passwords are read from environment variables or generated randomly.
     */
    @Override
    public void run(String... args) {
        seedAdminUser("okan.acer", "Okan Acer", "SUPER_ADMIN");
        seedAdminUser("meltem.gonen", "Meltem Gönen", "ADMIN");
    }

    private void seedAdminUser(String username, String displayName, String role) {
        if (!adminUserRepository.existsByUsername(username)) {
            // Use environment variable password or generate a secure random one
            String password;
            if (defaultAdminPassword != null && !defaultAdminPassword.isEmpty()) {
                password = defaultAdminPassword;
                log.info("Created admin user: {} ({}) with password from environment", username, role);
            } else {
                // Generate secure random password
                password = UUID.randomUUID().toString().substring(0, 16);
                log.warn("SECURITY: Created admin user {} with temporary password: {} - CHANGE THIS IMMEDIATELY!", 
                         username, password);
            }
            
            AdminUser admin = AdminUser.builder()
                    .username(username)
                    .passwordHash(passwordEncoder.encode(password))
                    .displayName(displayName)
                    .role(role)
                    .active(true)
                    .build();
            adminUserRepository.save(admin);
        }
    }
}

