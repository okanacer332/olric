package com.logbase.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Tracks user sessions for duration and engagement analytics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_sessions")
public class UserSession {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String sessionId; // UUID

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long duration; // seconds

    // Pages visited during session
    private List<String> pagesVisited;
    private Integer pageCount;

    // Device info
    private String device; // desktop, mobile, tablet
    private String browser;
    private String os;

    // Location
    private String country;
    private String city;
    private Double latitude;
    private Double longitude;

    // Session status
    private boolean active;
}
