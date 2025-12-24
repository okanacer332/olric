package com.logbase.server.controller;

import com.logbase.server.model.SmartItem;
import com.logbase.server.repository.SmartItemRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard") // DİKKAT: Endpoint burada başlıyor
public class DashboardController {

    private final SmartItemRepository smartItemRepository;

    public DashboardController(SmartItemRepository smartItemRepository) {
        this.smartItemRepository = smartItemRepository;
    }

    @GetMapping("/items")
    public List<SmartItem> getAllItems(@RequestParam String userId) {
        return smartItemRepository.findByUserId(userId);
    }

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats(@RequestParam String userId) {
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