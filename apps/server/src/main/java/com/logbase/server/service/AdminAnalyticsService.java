package com.logbase.server.service;

import com.logbase.server.model.User;
import com.logbase.server.model.UserActivity;
import com.logbase.server.repository.UserActivityRepository;
import com.logbase.server.repository.UserRepository;
import com.logbase.server.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for admin analytics and dashboard metrics.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminAnalyticsService {

    private final UserRepository userRepository;
    private final UserActivityRepository activityRepository;
    private final UserSessionRepository sessionRepository;

    /**
     * Get dashboard overview stats.
     */
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime weekAgo = now.minusDays(7);
        LocalDateTime monthAgo = now.minusDays(30);

        // Total users
        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);

        // Users by plan
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

        // Active today (simplified - users who logged in today)
        long activeToday = activityRepository.countByActionAndTimestampBetween("LOGIN", todayStart, now);
        stats.put("activeToday", activeToday);

        // Active this week
        long activeWeek = activityRepository.countByActionAndTimestampBetween("LOGIN", weekAgo, now);
        stats.put("activeWeek", activeWeek);

        // New users this week
        long newUsersWeek = allUsers.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(weekAgo))
                .count();
        stats.put("newUsersWeek", newUsersWeek);

        // Active sessions
        stats.put("activeSessions", sessionRepository.countByActiveTrue());

        return stats;
    }

    /**
     * Get user growth data for charts.
     */
    public List<Map<String, Object>> getUserGrowth(int days) {
        List<User> allUsers = userRepository.findAll();
        LocalDate startDate = LocalDate.now().minusDays(days);

        return startDate.datesUntil(LocalDate.now().plusDays(1))
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
    }

    /**
     * Get geographic distribution.
     */
    public Map<String, Long> getGeographicDistribution() {
        List<User> allUsers = userRepository.findAll();
        return allUsers.stream()
                .filter(u -> u.getCountry() != null && !u.getCountry().isEmpty())
                .collect(Collectors.groupingBy(User::getCountry, Collectors.counting()));
    }

    /**
     * Get recent activity feed.
     */
    public List<UserActivity> getRecentActivity(int limit) {
        return activityRepository.findAllByOrderByTimestampDesc(PageRequest.of(0, limit)).getContent();
    }
}
