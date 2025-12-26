package com.logbase.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Tracks individual user actions for analytics and activity logs.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_activity")
@CompoundIndex(name = "user_time_idx", def = "{'userId': 1, 'timestamp': -1}")
public class UserActivity {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String sessionId;

    /**
     * Action types:
     * LOGIN, LOGOUT, PAGE_VIEW, SYNC_START, SYNC_COMPLETE,
     * CATEGORY_VIEW, PROFILE_VIEW, SETTINGS_CHANGE
     */
    private String action;

    // Additional context about the action
    private Map<String, Object> metadata;

    private String page; // URL path
    private String category; // TRAVEL, FINANCE, etc.

    // Location info
    private String ipAddress;
    private String userAgent;
    private String country;
    private String city;

    // Device info
    private String device; // desktop, mobile, tablet
    private String browser;
    private String os;

    @Indexed
    private LocalDateTime timestamp;
}
