package com.logbase.server.service;

import com.logbase.server.model.SmartItem;
import com.logbase.server.repository.SmartItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Optional;

/**
 * Service for preventing duplicate SmartItems.
 * Uses multiple strategies to detect duplicates:
 * 1. Email message ID (originalEmailId) - unique per email
 * 2. Content hash (emailHash) - composite of key fields
 * 
 * DESIGN: Provider-agnostic - works with any email source.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailDeduplicator {

    private final SmartItemRepository smartItemRepository;

    /**
     * Checks if a SmartItem already exists and either returns the existing one
     * or prepares the new item for insertion with proper deduplication fields.
     * 
     * @param item The SmartItem to check/prepare
     * @param userId The user ID
     * @param originalEmailId The message ID from the email provider
     * @param emailProvider The provider name (GMAIL, OUTLOOK)
     * @return Optional containing existing item if duplicate, empty if new
     */
    public Optional<SmartItem> checkAndPrepare(SmartItem item, String userId, 
                                                String originalEmailId, String emailProvider) {
        // Generate content hash
        String hash = generateContentHash(item);
        
        // First check: by email message ID (fastest, most reliable)
        if (originalEmailId != null && !originalEmailId.isEmpty()) {
            Optional<SmartItem> existingByEmailId = smartItemRepository
                .findByUserIdAndOriginalEmailId(userId, originalEmailId);
            if (existingByEmailId.isPresent()) {
                log.debug("Duplicate found by emailId: {}", originalEmailId);
                return existingByEmailId;
            }
        }
        
        // Second check: by content hash (catches different email IDs for same content)
        Optional<SmartItem> existingByHash = smartItemRepository
            .findByUserIdAndEmailHash(userId, hash);
        if (existingByHash.isPresent()) {
            log.debug("Duplicate found by contentHash: {}", hash);
            return existingByHash;
        }
        
        // Not a duplicate - prepare the item
        item.setUserId(userId);
        item.setOriginalEmailId(originalEmailId);
        item.setEmailHash(hash);
        item.setEmailProvider(emailProvider);
        
        return Optional.empty();
    }
    
    /**
     * Checks if item is duplicate and saves if not.
     * Returns true if saved, false if duplicate.
     */
    public boolean saveIfNotDuplicate(SmartItem item, String userId,
                                       String originalEmailId, String emailProvider) {
        Optional<SmartItem> existing = checkAndPrepare(item, userId, originalEmailId, emailProvider);
        
        if (existing.isPresent()) {
            log.info("Skipping duplicate item: {} - {} - {}", 
                item.getCategory(), item.getVendor(), item.getDate());
            return false;
        }
        
        try {
            smartItemRepository.save(item);
            log.info("Saved new item: {} - {} - {}", 
                item.getCategory(), item.getVendor(), item.getDate());
            return true;
        } catch (Exception e) {
            // Unique index violation - another thread saved it
            if (e.getMessage() != null && e.getMessage().contains("duplicate key")) {
                log.debug("Concurrent duplicate detected, skipping");
                return false;
            }
            throw e;
        }
    }

    /**
     * Generates a content hash based on key fields that identify a unique transaction.
     * Same transaction from different emails (e.g., confirmation + reminder) = same hash.
     * 
     * Hash components:
     * - category
     * - vendor (normalized)
     * - date
     * - amount (if present)
     * - referenceCode (if present)
     */
    public String generateContentHash(SmartItem item) {
        StringBuilder sb = new StringBuilder();
        
        // Required fields
        sb.append(normalize(item.getCategory())).append("|");
        sb.append(normalize(item.getVendor())).append("|");
        sb.append(normalize(item.getDate())).append("|");
        
        // Optional fields that make items unique
        if (item.getAmount() != null) {
            sb.append(String.format("%.2f", item.getAmount())).append("|");
        }
        if (item.getReferenceCode() != null && !item.getReferenceCode().isEmpty()) {
            sb.append(normalize(item.getReferenceCode())).append("|");
        }
        
        // For travel: include departure/arrival
        if ("TRAVEL".equals(item.getCategory())) {
            sb.append(normalize(item.getDeparture())).append("|");
            sb.append(normalize(item.getArrival())).append("|");
        }
        
        return sha256(sb.toString());
    }
    
    private String normalize(String input) {
        if (input == null) return "";
        return input.toLowerCase()
            .replaceAll("\\s+", "")  // Remove all whitespace
            .replaceAll("[^a-z0-9]", ""); // Keep only alphanumeric
    }
    
    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash).substring(0, 16); // First 16 chars is enough
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 is always available
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
