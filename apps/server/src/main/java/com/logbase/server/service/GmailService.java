package com.logbase.server.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.*;
import com.logbase.server.model.SmartItem;
import com.logbase.server.repository.SmartItemRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class GmailService {

    private static final String APPLICATION_NAME = "LogBase-Server";
    private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Collections.singletonList("https://www.googleapis.com/auth/gmail.readonly");

    private final GeminiService geminiService;
    private final SmartItemRepository smartItemRepository;
    private final SyncManager syncManager;
    private GoogleAuthorizationCodeFlow flow;

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    @Value("${google.redirect.uri}")
    private String redirectUri;

    public GmailService(GeminiService geminiService, SmartItemRepository smartItemRepository, SyncManager syncManager) {
        this.geminiService = geminiService;
        this.smartItemRepository = smartItemRepository;
        this.syncManager = syncManager;
    }

    // --- OAUTH AKIŞI BAŞLANGICI ---

    private GoogleAuthorizationCodeFlow getFlow() throws IOException, GeneralSecurityException {
        if (flow == null) {
            GoogleClientSecrets.Details web = new GoogleClientSecrets.Details();
            web.setClientId(clientId);
            web.setClientSecret(clientSecret);
            GoogleClientSecrets secrets = new GoogleClientSecrets().setWeb(web);

            flow = new GoogleAuthorizationCodeFlow.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JSON_FACTORY,
                    secrets,
                    SCOPES)
                    .setAccessType("offline")
                    .build();
        }
        return flow;
    }

    public String getAuthorizationUrl() throws IOException, GeneralSecurityException {
        return getFlow().newAuthorizationUrl()
                .setRedirectUri(redirectUri)
                .setState("auth_init") // State artık userId taşımıyor
                .build();
    }

    /**
     * Google'dan gelen kodu işler, maili bulur ve sync başlatır.
     */
    public String handleGoogleCallbackAndSync(String code) throws IOException, GeneralSecurityException {
        // 1. Token Al
        GoogleTokenResponse response = getFlow().newTokenRequest(code)
                .setRedirectUri(redirectUri)
                .execute();

        String accessToken = response.getAccessToken();

        // 2. Kullanıcının Mail Adresini Öğren (Profil Sorgusu)
        Gmail service = new Gmail.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                request -> request.getHeaders().setAuthorization("Bearer " + accessToken))
                .setApplicationName(APPLICATION_NAME)
                .build();

        Profile profile = service.users().getProfile("me").execute();
        String realEmail = profile.getEmailAddress();

        // 3. Arka Planda Senkronizasyonu Başlat (Deep Scan)
        syncUserEmails(accessToken, realEmail);

        return realEmail;
    }

    // --- DEEP SCAN SYNC MANTIĞI (Senin Gönderdiğin Kod) ---

    public void syncUserEmails(String accessToken, String userId) {
        CompletableFuture.runAsync(() -> {
            try {
                performSync(accessToken, userId);
            } catch (Exception e) {
                e.printStackTrace();
                syncManager.updateStatus(userId, "Error: " + e.getMessage(), 0);
            }
        });
    }

    private void performSync(String accessToken, String userId) {
        try {
            syncManager.updateStatus(userId, "Connecting to Deep Scan...", 5);

            Gmail service = new Gmail.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JSON_FACTORY,
                    request -> request.getHeaders().setAuthorization("Bearer " + accessToken))
                    .setApplicationName(APPLICATION_NAME)
                    .build();

            // KAPSAYICI SORGU
            String query = "(" +
                    "subject:(flight OR ucus OR bilet OR ticket OR booking OR rezervasyon OR confirmation OR onay OR 'your trip' OR seyahat) OR " +
                    "subject:(fatura OR receipt OR invoice OR payment OR odeme OR islem OR dekont) OR " +
                    "subject:(order OR siparis OR kargo OR delivery OR gonderi OR paket) OR " +
                    "subject:(subscription OR abonelik OR renewal OR yenileme OR plan) OR " +
                    "subject:(konser OR concert OR biletix OR passo OR etkinlik)" +
                    ") newer_than:1y";

            syncManager.updateStatus(userId, "Searching for relevant emails...", 10);

            ListMessagesResponse response = service.users().messages().list("me")
                    .setQ(query)
                    .setMaxResults(200L)
                    .execute();

            List<Message> messages = response.getMessages();

            if (messages == null || messages.isEmpty()) {
                syncManager.updateStatus(userId, "No relevant emails found via Deep Scan", 100);
                return;
            }

            int totalEmails = messages.size();
            syncManager.updateStatus(userId, "Found " + totalEmails + " candidates. Extracting content...", 15);

            List<Map<String, String>> allBatchData = new ArrayList<>();
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
                            if ("Subject".equalsIgnoreCase(h.getName())) subject = h.getValue();
                            else if ("From".equalsIgnoreCase(h.getName())) from = h.getValue();
                            else if ("Date".equalsIgnoreCase(h.getName())) date = h.getValue();
                        }
                    }

                    String rawBody = getEmailBody(fullMsg.getPayload());

                    String cleanBody = rawBody.replaceAll("\\<.*?\\>", " ")
                            .replaceAll("\\s+", " ")
                            .trim();

                    if (cleanBody.length() > 2500) {
                        cleanBody = cleanBody.substring(0, 2500);
                    }

                    Map<String, String> data = new HashMap<>();
                    data.put("subject", subject);
                    data.put("snippet", cleanBody);
                    data.put("sender", from);
                    data.put("date", date);
                    allBatchData.add(data);

                    downloadedCount++;
                    int progress = 15 + (int)((double)downloadedCount / totalEmails * 35);
                    syncManager.updateStatus(userId, "Extracting email contents (" + downloadedCount + "/" + totalEmails + ")", progress);

                } catch (Exception e) {
                    System.out.println("Mail okuma hatası: " + e.getMessage());
                }
            }

            int batchSize = 15;
            int totalBatches = (int) Math.ceil((double) allBatchData.size() / batchSize);

            syncManager.updateStatus(userId, "AI Deep Analysis starting...", 50);

            for (int i = 0; i < totalBatches; i++) {
                int start = i * batchSize;
                int end = Math.min(start + batchSize, allBatchData.size());
                List<Map<String, String>> batch = allBatchData.subList(start, end);

                int currentProgress = 50 + (int)((double)(i + 1) / totalBatches * 45);
                syncManager.updateStatus(userId, "AI analyzing context " + (i + 1) + "/" + totalBatches + "...", currentProgress);

                List<SmartItem> foundItems = geminiService.analyzeBatch(batch);

                if (foundItems != null && !foundItems.isEmpty()) {
                    for (SmartItem item : foundItems) {
                        item.setUserId(userId);
                        smartItemRepository.save(item);
                    }
                }
            }
            syncManager.updateStatus(userId, "Deep Scan Completed!", 100);

        } catch (Exception e) {
            e.printStackTrace();
            syncManager.updateStatus(userId, "Critical Error: " + e.getMessage(), 0);
        }
    }

    private String getEmailBody(MessagePart part) {
        String body = "";
        if (part.getBody() != null && part.getBody().getData() != null) {
            return new String(Base64.getUrlDecoder().decode(part.getBody().getData()));
        }
        if (part.getParts() != null) {
            for (MessagePart subPart : part.getParts()) {
                if (subPart.getMimeType().equals("text/plain")) {
                    return getEmailBody(subPart);
                } else if (subPart.getMimeType().equals("text/html")) {
                    body = getEmailBody(subPart);
                } else if (subPart.getMimeType().startsWith("multipart/")) {
                    String found = getEmailBody(subPart);
                    if (!found.isEmpty()) return found;
                }
            }
        }
        return body;
    }
}