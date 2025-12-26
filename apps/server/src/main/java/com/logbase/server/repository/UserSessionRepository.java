package com.logbase.server.repository;

import com.logbase.server.model.UserSession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserSessionRepository extends MongoRepository<UserSession, String> {

    // Find active session
    Optional<UserSession> findBySessionIdAndActiveTrue(String sessionId);

    // Get user's sessions
    List<UserSession> findByUserIdOrderByStartTimeDesc(String userId);

    // Count sessions in date range
    long countByStartTimeBetween(LocalDateTime start, LocalDateTime end);

    // Get sessions by country
    List<UserSession> findByCountry(String country);

    // Active sessions count
    long countByActiveTrue();
}
