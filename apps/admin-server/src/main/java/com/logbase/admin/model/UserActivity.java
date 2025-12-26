package com.logbase.admin.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * UserActivity from main application (read-only).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_activity")
public class UserActivity {
    @Id
    private String id;
    private String userId;
    private String sessionId;
    private String action;
    private Map<String, Object> metadata;
    private String page;
    private String category;
    private String ipAddress;
    private String userAgent;
    private String country;
    private String city;
    private String device;
    private String browser;
    private String os;
    private LocalDateTime timestamp;
}
