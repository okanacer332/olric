package com.logbase.admin.repository;

import com.logbase.admin.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    Page<User> findByEmailContainingIgnoreCase(String email, Pageable pageable);
    Page<User> findByPlan(String plan, Pageable pageable);
    long countByPlan(String plan);
}
