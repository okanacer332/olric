package com.logbase.server.controller;

import com.logbase.server.service.GmailService;
import com.logbase.server.service.SyncManager;
import org.springframework.http.ResponseEntity;
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
     * Get current sync status for a user.
     */
    @GetMapping("/status")
    public SyncManager.SyncStatus getStatus(@RequestParam("userId") String userId) {
        return syncManager.getStatus(userId);
    }

    /**
     * Start email synchronization for a user.
     * This is called when user clicks "Synchronize Email" button.
     */
    @PostMapping("/start")
    public ResponseEntity<?> startSync(@RequestParam("userId") String userId) {
        // Start sync asynchronously
        gmailService.syncEmails(userId);
        return ResponseEntity.ok(Map.of(
            "status", "started",
            "message", "Email synchronization started"
        ));
    }
}