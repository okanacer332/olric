package com.logbase.server.controller;

import com.logbase.server.model.User;
import com.logbase.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * User Profile Controller
 * Provides endpoints for user profile data including subscription plan.
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * Get user profile by email.
     * Used by frontend to fetch user's subscription plan.
     * 
     * Note: This is a public endpoint for session initialization.
     * Sensitive data should not be exposed here.
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            // Return default FREE plan for unknown users
            Map<String, Object> defaultResponse = new HashMap<>();
            defaultResponse.put("email", email);
            defaultResponse.put("plan", "FREE");
            return ResponseEntity.ok(defaultResponse);
        }
        
        User user = userOpt.get();
        
        // Return only non-sensitive profile data
        Map<String, Object> response = new HashMap<>();
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("plan", user.getPlan() != null ? user.getPlan() : "FREE");
        response.put("avatarUrl", user.getAvatarUrl());
        
        return ResponseEntity.ok(response);
    }
}
