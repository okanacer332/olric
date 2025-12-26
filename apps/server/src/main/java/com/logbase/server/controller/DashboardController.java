package com.logbase.server.controller;

import com.logbase.server.model.SmartItem;
import com.logbase.server.repository.SmartItemRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final SmartItemRepository smartItemRepository;

    public DashboardController(SmartItemRepository smartItemRepository) {
        this.smartItemRepository = smartItemRepository;
    }

    /**
     * Get all items for the authenticated user.
     * SECURITY: userId is extracted from JWT token, not request parameter.
     */
    @GetMapping("/items")
    public List<SmartItem> getAllItems(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return smartItemRepository.findByUserId(userId);
    }

    /**
     * Get dashboard stats for the authenticated user.
     * SECURITY: userId is extracted from JWT token, not request parameter.
     */
    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        List<SmartItem> allItems = smartItemRepository.findByUserId(userId);

        Map<String, Object> response = new HashMap<>();

        Map<String, List<SmartItem>> grouped = allItems.stream()
                .collect(Collectors.groupingBy(item -> item.getCategory() != null ? item.getCategory() : "OTHER"));

        response.put("travel_count", grouped.getOrDefault("TRAVEL", List.of()).size());
        response.put("finance_total", grouped.getOrDefault("FINANCE", List.of()).stream().mapToDouble(i -> i.getAmount() != null ? i.getAmount() : 0).sum());
        response.put("shopping_count", grouped.getOrDefault("SHOPPING", List.of()).size());
        response.put("events_count", grouped.getOrDefault("EVENT", List.of()).size());
        response.put("subscription_count", grouped.getOrDefault("SUBSCRIPTION", List.of()).size());

        double monthlySubs = grouped.getOrDefault("SUBSCRIPTION", List.of()).stream()
                .mapToDouble(i -> i.getAmount() != null ? i.getAmount() : 0).sum();
        response.put("subscription_monthly_cost", monthlySubs);

        return response;
    }
}