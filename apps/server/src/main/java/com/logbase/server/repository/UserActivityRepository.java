package com.logbase.server.repository;

import com.logbase.server.model.UserActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface UserActivityRepository extends MongoRepository<UserActivity, String> {

    // Get recent activity for a user
    List<UserActivity> findByUserIdOrderByTimestampDesc(String userId, Pageable pageable);

    // Get all recent activity (for admin feed)
    Page<UserActivity> findAllByOrderByTimestampDesc(Pageable pageable);

    // Get activity in date range
    List<UserActivity> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    // Count by action type
    long countByAction(String action);

    // Count by action in date range
    long countByActionAndTimestampBetween(String action, LocalDateTime start, LocalDateTime end);

    // Get activity by action type
    List<UserActivity> findByActionOrderByTimestampDesc(String action, Pageable pageable);

    // Count unique users in date range
    @Query(value = "{'timestamp': {$gte: ?0, $lte: ?1}}", count = true)
    long countByTimestampRange(LocalDateTime start, LocalDateTime end);
}
