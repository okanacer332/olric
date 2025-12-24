package com.logbase.server.controller;

import com.logbase.server.service.SyncManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sync")
public class SyncController {

    private final SyncManager syncManager;

    public SyncController(SyncManager syncManager) {
        this.syncManager = syncManager;
    }

    @GetMapping("/status")
    public SyncManager.SyncStatus getStatus(@RequestParam("userId") String userId) {
        return syncManager.getStatus(userId);
    }
}