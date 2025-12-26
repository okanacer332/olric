package com.logbase.admin.controller;

import com.logbase.admin.model.User;
import com.logbase.admin.model.UserActivity;
import com.logbase.admin.repository.UserActivityRepository;
import com.logbase.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final UserActivityRepository activityRepository;

    /**
     * Dashboard overview stats.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime weekAgo = now.minusDays(7);

        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);

        List<User> allUsers = userRepository.findAll();
        Map<String, Long> planDistribution = allUsers.stream()
                .collect(Collectors.groupingBy(
                        u -> u.getPlan() != null ? u.getPlan() : "FREE",
                        Collectors.counting()
                ));
        stats.put("planDistribution", planDistribution);
        
        long premiumUsers = planDistribution.getOrDefault("PREMIUM", 0L);
        stats.put("premiumUsers", premiumUsers);
        stats.put("conversionRate", totalUsers > 0 ? (double) premiumUsers / totalUsers * 100 : 0);

        long activeToday = activityRepository.countByActionAndTimestampBetween("LOGIN", todayStart, now);
        stats.put("activeToday", activeToday);

        long newUsersWeek = allUsers.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(weekAgo))
                .count();
        stats.put("newUsersWeek", newUsersWeek);

        return ResponseEntity.ok(stats);
    }

    /**
     * Paginated user list.
     */
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String plan
    ) {
        Sort sort = Sort.by("createdAt").descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<User> usersPage;

        if (search != null && !search.isEmpty()) {
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
     * User growth chart data.
     */
    @GetMapping("/analytics/growth")
    public ResponseEntity<List<Map<String, Object>>> getUserGrowth(
            @RequestParam(defaultValue = "30") int days
    ) {
        List<User> allUsers = userRepository.findAll();
        LocalDate startDate = LocalDate.now().minusDays(days);

        List<Map<String, Object>> growth = startDate.datesUntil(LocalDate.now().plusDays(1))
                .map(date -> {
                    LocalDateTime dayStart = date.atStartOfDay();
                    LocalDateTime dayEnd = date.atTime(LocalTime.MAX);
                    
                    long count = allUsers.stream()
                            .filter(u -> u.getCreatedAt() != null && 
                                    u.getCreatedAt().isAfter(dayStart) && 
                                    u.getCreatedAt().isBefore(dayEnd))
                            .count();
                    
                    Map<String, Object> point = new HashMap<>();
                    point.put("date", date.toString());
                    point.put("count", count);
                    return point;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(growth);
    }

    /**
     * Geographic distribution.
     */
    @GetMapping("/analytics/geo")
    public ResponseEntity<Map<String, Long>> getGeoDistribution() {
        List<User> allUsers = userRepository.findAll();
        Map<String, Long> geo = allUsers.stream()
                .filter(u -> u.getCountry() != null && !u.getCountry().isEmpty())
                .collect(Collectors.groupingBy(User::getCountry, Collectors.counting()));
        return ResponseEntity.ok(geo);
    }

    /**
     * Recent activity feed.
     */
    @GetMapping("/activity")
    public ResponseEntity<List<UserActivity>> getActivity(
            @RequestParam(defaultValue = "50") int limit
    ) {
        Page<UserActivity> activities = activityRepository
                .findAllByOrderByTimestampDesc(PageRequest.of(0, limit));
        return ResponseEntity.ok(activities.getContent());
    }
}
