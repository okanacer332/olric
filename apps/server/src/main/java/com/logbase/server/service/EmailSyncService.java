package com.logbase.server.service;

import com.logbase.server.model.*;
import com.logbase.server.repository.UserRepository;
import com.logbase.server.service.email.EmailProvider;
import com.logbase.server.service.email.GmailProvider;
import com.logbase.server.service.email.OutlookProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * Unified Email Sync Service that supports multiple email providers.
 * Handles both Gmail and Outlook through the EmailProvider abstraction.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailSyncService {

    private static final int MAX_EMAILS = 300;
    private static final int AI_BATCH_SIZE = 15;

    private final GmailProvider gmailProvider;
    private final OutlookProvider outlookProvider;
    private final GeminiService geminiService;
    private final EmailDeduplicator emailDeduplicator;
    private final SyncManager syncManager;
    private final UserRepository userRepository;

    /**
     * Syncs emails from all connected providers for a user.
     */
    public void syncAllProviders(String userId) {
        CompletableFuture.runAsync(() -> {
            try {
                User user = userRepository.findByEmail(userId)
                        .orElseThrow(() -> new RuntimeException("User not found: " + userId));

                List<ConnectedAccount> accounts = user.getConnectedAccounts();
                if (accounts == null || accounts.isEmpty()) {
                    syncManager.updateStatus(userId, "No email accounts connected.", 100);
                    return;
                }

                int totalAccounts = accounts.size();
                int currentAccount = 0;

                for (ConnectedAccount account : accounts) {
                    currentAccount++;
                    String accountLabel = account.getProvider() + " (" + currentAccount + "/" + totalAccounts + ")";
                    
                    if (account.getProvider() == AuthProvider.GOOGLE) {
                        syncProvider(userId, account.getAccessToken(), gmailProvider, accountLabel);
                    } else if (account.getProvider() == AuthProvider.MICROSOFT) {
                        syncProvider(userId, account.getAccessToken(), outlookProvider, accountLabel);
                    }
                }

                syncManager.updateStatus(userId, "All accounts synced!", 100);
            } catch (Exception e) {
                log.error("Sync error for user {}: {}", userId, e.getMessage(), e);
                syncManager.updateStatus(userId, "Error: " + e.getMessage(), 0);
            }
        });
    }

    /**
     * Syncs emails from a specific provider.
     */
    public void syncProvider(String userId, AuthProvider provider) {
        CompletableFuture.runAsync(() -> {
            try {
                User user = userRepository.findByEmail(userId)
                        .orElseThrow(() -> new RuntimeException("User not found: " + userId));

                Optional<ConnectedAccount> account = user.getConnectedAccounts().stream()
                        .filter(a -> a.getProvider() == provider)
                        .findFirst();

                if (account.isEmpty()) {
                    syncManager.updateStatus(userId, "No " + provider + " account connected.", 0);
                    return;
                }

                EmailProvider emailProvider = provider == AuthProvider.GOOGLE ? gmailProvider : outlookProvider;
                syncProvider(userId, account.get().getAccessToken(), emailProvider, provider.name());

            } catch (Exception e) {
                log.error("Sync error: {}", e.getMessage(), e);
                syncManager.updateStatus(userId, "Error: " + e.getMessage(), 0);
            }
        });
    }

    private void syncProvider(String userId, String accessToken, EmailProvider provider, String label) {
        try {
            syncManager.updateStatus(userId, "Connecting to " + label + "...", 5);

            // Validate token
            if (!provider.validateToken(accessToken)) {
                syncManager.updateStatus(userId, label + " token expired. Please reconnect.", 0);
                return;
            }

            // Fetch emails
            String query = provider.buildSearchQuery();
            syncManager.updateStatus(userId, "Searching " + label + " emails...", 10);
            
            List<RawEmail> emails = provider.fetchEmails(accessToken, query, MAX_EMAILS);
            
            if (emails.isEmpty()) {
                syncManager.updateStatus(userId, "No relevant emails found in " + label, 100);
                return;
            }

            log.info("{}: Found {} emails for user {}", provider.getProviderName(), emails.size(), userId);
            syncManager.updateStatus(userId, "Found " + emails.size() + " emails in " + label, 20);

            // Convert to format expected by GeminiService
            List<Map<String, String>> emailData = new ArrayList<>();
            for (RawEmail email : emails) {
                Map<String, String> data = new HashMap<>();
                data.put("messageId", email.getMessageId());
                data.put("subject", email.getSubject());
                data.put("sender", email.getSender());
                data.put("date", email.getDate());
                data.put("snippet", email.getBody());
                emailData.add(data);
            }

            // AI Analysis in batches
            int totalBatches = (int) Math.ceil((double) emailData.size() / AI_BATCH_SIZE);
            int savedCount = 0;
            int duplicateCount = 0;

            for (int i = 0; i < totalBatches; i++) {
                int start = i * AI_BATCH_SIZE;
                int end = Math.min(start + AI_BATCH_SIZE, emailData.size());
                List<Map<String, String>> batch = emailData.subList(start, end);

                int progress = 20 + (int)((double)(i + 1) / totalBatches * 75);
                syncManager.updateStatus(userId, "AI analyzing " + label + " (" + (i+1) + "/" + totalBatches + ")", progress);

                List<SmartItem> items = geminiService.analyzeBatch(batch);

                if (items != null) {
                    for (int j = 0; j < items.size(); j++) {
                        SmartItem item = items.get(j);
                        String emailId = batch.size() > j ? batch.get(j).get("messageId") : null;

                        boolean saved = emailDeduplicator.saveIfNotDuplicate(
                                item, userId, emailId, provider.getProviderName());

                        if (saved) savedCount++;
                        else duplicateCount++;
                    }
                }
            }

            log.info("{}: Saved {} items, {} duplicates for user {}", 
                    provider.getProviderName(), savedCount, duplicateCount, userId);
            syncManager.updateStatus(userId, label + " complete: " + savedCount + " new items", 95);

        } catch (Exception e) {
            log.error("Provider sync error: {}", e.getMessage(), e);
            syncManager.updateStatus(userId, "Error syncing " + label + ": " + e.getMessage(), 0);
        }
    }

    /**
     * Gets the list of connected providers for a user.
     */
    public List<String> getConnectedProviders(String userId) {
        Optional<User> user = userRepository.findByEmail(userId);
        if (user.isEmpty() || user.get().getConnectedAccounts() == null) {
            return List.of();
        }

        return user.get().getConnectedAccounts().stream()
                .map(a -> a.getProvider().name())
                .toList();
    }
}
