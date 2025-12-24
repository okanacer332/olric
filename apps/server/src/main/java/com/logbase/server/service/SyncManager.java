package com.logbase.server.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SyncManager {
    // Kullanıcı ID -> İlerleme Durumu (0 ile 100 arası veya durum mesajı)
    private final ConcurrentHashMap<String, SyncStatus> statusMap = new ConcurrentHashMap<>();

    public void updateStatus(String userId, String message, int progress) {
        statusMap.put(userId, new SyncStatus(message, progress));
    }

    public SyncStatus getStatus(String userId) {
        return statusMap.getOrDefault(userId, new SyncStatus("Idle", 0));
    }

    public void clearStatus(String userId) {
        statusMap.remove(userId);
    }

    // Durum Modeli (Inner Class)
    public static class SyncStatus {
        public String message;
        public int progress; // 0 - 100

        public SyncStatus(String message, int progress) {
            this.message = message;
            this.progress = progress;
        }
    }
}