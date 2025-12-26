package com.logbase.server.controller;

import com.logbase.server.model.User;
import com.logbase.server.model.UserActivity;
import com.logbase.server.repository.UserRepository;
import com.logbase.server.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Admin Dashboard API endpoints.
 * Requires ADMIN or SUPER_ADMIN role.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserRepository userRepository;
    private final AdminAnalyticsService analyticsService;

    /**
     * Get dashboard overview stats.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        log.info("Admin: Fetching dashboard stats");
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    /**
     * Get paginated user list.
     */
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String plan,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        log.info("Admin: Fetching users - page={}, size={}, search={}", page, size, search);

        Sort sort = sortDir.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<User> usersPage;

        if (search != null && !search.isEmpty()) {
            // Simple search by email contains
            usersPage = userRepository.findByEmailContainingIgnoreCase(search, pageRequest);
        } else if (plan != null && !plan.isEmpty()) {
            usersPage = userRepository.findByPlan(plan, pageRequest);
        } else {
            usersPage = userRepository.findAll(pageRequest);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("users", usersPage.getContent());
        response.put("totalElements", usersPage.getTotalElements());
        response.put("totalPages", usersPage.getTotalPages());
        response.put("currentPage", page);

        return ResponseEntity.ok(response);
    }

    /**
     * Get user detail.
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserDetail(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id);
        
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user.get());
    }

    /**
     * Update user (plan, role, status).
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable String id,
            @RequestBody Map<String, Object> updates
    ) {
        Optional<User> optUser = userRepository.findById(id);
        
        if (optUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optUser.get();

        if (updates.containsKey("plan")) {
            user.setPlan((String) updates.get("plan"));
        }
        if (updates.containsKey("role")) {
            user.setRole((String) updates.get("role"));
        }

        userRepository.save(user);
        log.info("Admin: Updated user {} - {}", id, updates);

        return ResponseEntity.ok(user);
    }

    /**
     * Get user growth chart data.
     */
    @GetMapping("/analytics/growth")
    public ResponseEntity<List<Map<String, Object>>> getUserGrowth(
            @RequestParam(defaultValue = "30") int days
    ) {
        return ResponseEntity.ok(analyticsService.getUserGrowth(days));
    }

    /**
     * Get geographic distribution.
     */
    @GetMapping("/analytics/geo")
    public ResponseEntity<Map<String, Long>> getGeographicDistribution() {
        return ResponseEntity.ok(analyticsService.getGeographicDistribution());
    }

    /**
     * Get recent activity feed.
     */
    @GetMapping("/activity")
    public ResponseEntity<List<UserActivity>> getRecentActivity(
            @RequestParam(defaultValue = "50") int limit
    ) {
        return ResponseEntity.ok(analyticsService.getRecentActivity(limit));
    }
}
