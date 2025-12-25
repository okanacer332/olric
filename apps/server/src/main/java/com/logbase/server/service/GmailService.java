package com.logbase.server.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.ListMessagesResponse;
import com.google.api.services.gmail.model.Message;
import com.google.api.services.gmail.model.MessagePart;
import com.google.api.services.gmail.model.MessagePartHeader;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.logbase.server.config.CategoryDefinitions;
import com.logbase.server.model.AuthProvider;
import com.logbase.server.model.ConnectedAccount;
import com.logbase.server.model.SmartItem;
import com.logbase.server.model.User;
import com.logbase.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * Gmail Email Sync Service.
 * 
 * DESIGN PRINCIPLES:
 * - Uses comprehensive search queries from CategoryDefinitions
 * - Integrates EmailDeduplicator to prevent duplicate items
 * - Provider name: "GMAIL" (for future Outlook support)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GmailService {

    private static final String APPLICATION_NAME = "Olric-Server";
    private static final String PROVIDER_NAME = "GMAIL";
    private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    
    // Maximum emails to fetch per sync
    private static final long MAX_EMAILS = 300L;
    // Batch size for AI analysis
    private static final int AI_BATCH_SIZE = 15;

    private final GeminiService geminiService;
    private final EmailDeduplicator emailDeduplicator;
    private final SyncManager syncManager;
    private final UserRepository userRepository;

    /**
     * Main entry point for email synchronization.
     * Runs asynchronously to not block the caller.
     */
    public void syncEmails(String userId) {
        CompletableFuture.runAsync(() -> {
            try {
                // 1. Find user and get Google token
                User user = userRepository.findByEmail(userId)
                        .orElseThrow(() -> new RuntimeException("User not found: " + userId));

                String accessToken = getGoogleAccessToken(user);
                if (accessToken == null) {
                    syncManager.updateStatus(userId, "Google account not linked.", 0);
                    return;
                }

                // 2. Perform sync
                performSync(accessToken, userId);

            } catch (Exception e) {
                log.error("Sync initialization error", e);
                syncManager.updateStatus(userId, "Error: " + e.getMessage(), 0);
            }
        });
    }

    private void performSync(String accessToken, String userId) {
        try {
            syncManager.updateStatus(userId, "Connecting to Gmail...", 5);

            // Build Gmail client
            GoogleCredentials credentials = GoogleCredentials.create(new AccessToken(accessToken, null));
            Gmail service = new Gmail.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JSON_FACTORY,
                    new HttpCredentialsAdapter(credentials))
                    .setApplicationName(APPLICATION_NAME)
                    .build();

            // Use comprehensive search query
            String query = CategoryDefinitions.buildCombinedSearchQuery();
            log.info("Gmail search query: {}", query);
            
            syncManager.updateStatus(userId, "Searching for relevant emails...", 10);

            ListMessagesResponse response = service.users().messages().list("me")
                    .setQ(query)
                    .setMaxResults(MAX_EMAILS)
                    .execute();

            List<Message> messages = response.getMessages();

            if (messages == null || messages.isEmpty()) {
                syncManager.updateStatus(userId, "No relevant emails found.", 100);
                return;
            }

            int totalEmails = messages.size();
            log.info("Found {} candidate emails for user {}", totalEmails, userId);
            syncManager.updateStatus(userId, "Found " + totalEmails + " candidates. Processing...", 15);

            // Fetch full email content
            List<Map<String, String>> allEmailData = new ArrayList<>();
            Map<String, String> emailIdMap = new HashMap<>(); // Map index to messageId
            int downloadedCount = 0;

            for (Message msg : messages) {
                try {
                    Message fullMsg = service.users().messages().get("me", msg.getId())
                            .setFormat("full")
                            .execute();

                    String subject = "No Subject";
                    String from = "Unknown";
                    String date = "";

                    if (fullMsg.getPayload().getHeaders() != null) {
                        for (MessagePartHeader h : fullMsg.getPayload().getHeaders()) {
                            String headerName = h.getName();
                            if ("Subject".equalsIgnoreCase(headerName)) subject = h.getValue();
                            else if ("From".equalsIgnoreCase(headerName)) from = h.getValue();
                            else if ("Date".equalsIgnoreCase(headerName)) date = h.getValue();
                        }
                    }

                    String rawBody = getEmailBody(fullMsg.getPayload());
                    String cleanBody = cleanEmailContent(rawBody);

                    Map<String, String> data = new HashMap<>();
                    data.put("messageId", msg.getId());
                    data.put("subject", subject);
                    data.put("snippet", cleanBody);
                    data.put("sender", from);
                    data.put("date", date);
                    allEmailData.add(data);
                    emailIdMap.put(String.valueOf(allEmailData.size()), msg.getId());

                    downloadedCount++;
                    int progress = 15 + (int)((double)downloadedCount / totalEmails * 35);
                    syncManager.updateStatus(userId, 
                        "Extracting content (" + downloadedCount + "/" + totalEmails + ")", progress);

                } catch (Exception e) {
                    log.warn("Failed to read email (skipping): {}", e.getMessage());
                }
            }

            log.info("Downloaded {} emails successfully", allEmailData.size());

            // AI Analysis in batches
            int totalBatches = (int) Math.ceil((double) allEmailData.size() / AI_BATCH_SIZE);
            int savedCount = 0;
            int duplicateCount = 0;

            syncManager.updateStatus(userId, "AI Deep Analysis starting...", 50);

            for (int i = 0; i < totalBatches; i++) {
                int start = i * AI_BATCH_SIZE;
                int end = Math.min(start + AI_BATCH_SIZE, allEmailData.size());
                List<Map<String, String>> batch = allEmailData.subList(start, end);

                int currentProgress = 50 + (int)((double)(i + 1) / totalBatches * 45);
                syncManager.updateStatus(userId, 
                    "AI analyzing batch " + (i + 1) + "/" + totalBatches + "...", currentProgress);

                // Get AI analysis
                List<SmartItem> foundItems = geminiService.analyzeBatch(batch);

                if (foundItems != null && !foundItems.isEmpty()) {
                    for (int j = 0; j < foundItems.size(); j++) {
                        SmartItem item = foundItems.get(j);
                        
                        // Get the original email ID (approximate - match by index in batch)
                        String emailId = batch.size() > j ? batch.get(j).get("messageId") : null;
                        
                        // Use deduplicator to save
                        boolean saved = emailDeduplicator.saveIfNotDuplicate(
                            item, userId, emailId, PROVIDER_NAME);
                        
                        if (saved) {
                            savedCount++;
                        } else {
                            duplicateCount++;
                        }
                    }
                }
            }

            log.info("Sync complete: {} saved, {} duplicates skipped", savedCount, duplicateCount);
            syncManager.updateStatus(userId, 
                "Deep Scan Completed! " + savedCount + " new items found.", 100);

        } catch (Exception e) {
            log.error("Sync Error", e);
            syncManager.updateStatus(userId, "Critical Error: " + e.getMessage(), 0);
        }
    }

    // --- Helper Methods ---

    private String getGoogleAccessToken(User user) {
        if (user.getConnectedAccounts() == null) return null;

        Optional<ConnectedAccount> googleAccount = user.getConnectedAccounts().stream()
                .filter(acc -> acc.getProvider() == AuthProvider.GOOGLE)
                .findFirst();

        return googleAccount.map(ConnectedAccount::getAccessToken).orElse(null);
    }

    private String getEmailBody(MessagePart part) {
        String body = "";
        if (part.getBody() != null && part.getBody().getData() != null) {
            return new String(Base64.getUrlDecoder().decode(part.getBody().getData()));
        }
        if (part.getParts() != null) {
            for (MessagePart subPart : part.getParts()) {
                String mimeType = subPart.getMimeType();
                if ("text/plain".equals(mimeType)) {
                    return getEmailBody(subPart);
                } else if ("text/html".equals(mimeType)) {
                    body = getEmailBody(subPart);
                } else if (mimeType != null && mimeType.startsWith("multipart/")) {
                    String found = getEmailBody(subPart);
                    if (!found.isEmpty()) return found;
                }
            }
        }
        return body;
    }

    /**
     * Cleans email content by removing HTML tags and normalizing whitespace.
     * Truncates to prevent token limit issues.
     */
    private String cleanEmailContent(String rawBody) {
        if (rawBody == null) return "";
        
        String cleaned = rawBody
            .replaceAll("<[^>]*>", " ")  // Remove HTML tags
            .replaceAll("&nbsp;", " ")    // Remove HTML entities
            .replaceAll("&amp;", "&")
            .replaceAll("&lt;", "<")
            .replaceAll("&gt;", ">")
            .replaceAll("\\s+", " ")      // Normalize whitespace
            .trim();
        
        // Truncate to prevent token limit issues (keep first 3000 chars)
        if (cleaned.length() > 3000) {
            cleaned = cleaned.substring(0, 3000);
        }
        
        return cleaned;
    }
}