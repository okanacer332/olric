package com.logbase.admin.repository;

import com.logbase.admin.model.UserActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface UserActivityRepository extends MongoRepository<UserActivity, String> {
    Page<UserActivity> findAllByOrderByTimestampDesc(Pageable pageable);
    long countByActionAndTimestampBetween(String action, LocalDateTime start, LocalDateTime end);
    List<UserActivity> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
}
