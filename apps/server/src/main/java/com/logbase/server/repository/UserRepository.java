package com.logbase.server.repository;

import com.logbase.server.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Find user by email.
     */
    Optional<User> findByEmail(String email);

    /**
     * Search users by email (admin panel).
     */
    Page<User> findByEmailContainingIgnoreCase(String email, Pageable pageable);

    /**
     * Filter users by plan (admin panel).
     */
    Page<User> findByPlan(String plan, Pageable pageable);

    /**
     * Filter users by role (admin panel).
     */
    Page<User> findByRole(String role, Pageable pageable);

    /**
     * Count users by plan.
     */
    long countByPlan(String plan);
}