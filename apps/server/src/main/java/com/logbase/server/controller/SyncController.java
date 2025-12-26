package com.logbase.server.controller;

import com.logbase.server.service.GmailService;
import com.logbase.server.service.SyncManager;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sync")
public class SyncController {

    private final SyncManager syncManager;
    private final GmailService gmailService;

    public SyncController(SyncManager syncManager, GmailService gmailService) {
        this.syncManager = syncManager;
        this.gmailService = gmailService;
    }

    /**
     * Get current sync status for the authenticated user.
     * SECURITY: userId is extracted from JWT token, not request parameter.
     */
    @GetMapping("/status")
    public SyncManager.SyncStatus getStatus(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return syncManager.getStatus(userId);
    }

    /**
     * Start email synchronization for the authenticated user.
     * SECURITY: userId is extracted from JWT token, not request parameter.
     * This is called when user clicks "Synchronize Email" button.
     */
    @PostMapping("/start")
    public ResponseEntity<?> startSync(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        // Start sync asynchronously
        gmailService.syncEmails(userId);
        return ResponseEntity.ok(Map.of(
            "status", "started",
            "message", "Email synchronization started"
        ));
    }
}