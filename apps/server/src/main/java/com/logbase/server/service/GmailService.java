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
import com.logbase.server.model.AuthProvider;
import com.logbase.server.model.ConnectedAccount;
import com.logbase.server.model.SmartItem;
import com.logbase.server.model.User;
import com.logbase.server.repository.SmartItemRepository;
import com.logbase.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class GmailService {

    private static final String APPLICATION_NAME = "LogBase-Server";
    private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    private final GeminiService geminiService;
    private final SmartItemRepository smartItemRepository;
    private final SyncManager syncManager;
    private final UserRepository userRepository; // EKLENDİ: Token'ı buradan çekeceğiz

    /**
     * DIŞ DÜNYADAN ÇAĞRILAN TEK METOD.
     * Artık sadece userId alıyor. Token'ı kendisi buluyor.
     */
    public void syncEmails(String userId) {
        // Asenkron başlat (Fire and Forget - Şimdilik)
        CompletableFuture.runAsync(() -> {
            try {
                // 1. Kullanıcıyı Bul
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found: " + userId));

                // 2. Google Token'ını Çek
                String accessToken = getGoogleAccessToken(user);

                if (accessToken == null) {
                    syncManager.updateStatus(userId, "Google account not linked.", 0);
                    return;
                }

                // 3. İşlemi Başlat
                performSync(accessToken, userId);

            } catch (Exception e) {
                log.error("Sync başlatma hatası", e);
                syncManager.updateStatus(userId, "Error: " + e.getMessage(), 0);
            }
        });
    }

    private void performSync(String accessToken, String userId) {
        try {
            syncManager.updateStatus(userId, "Connecting to Deep Scan...", 5);

            // Google Credentials Oluştur (Sadece Access Token ile)
            GoogleCredentials credentials = GoogleCredentials.create(new AccessToken(accessToken, null));

            Gmail service = new Gmail.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JSON_FACTORY,
                    new HttpCredentialsAdapter(credentials))
                    .setApplicationName(APPLICATION_NAME)
                    .build();

            // KAPSAYICI SORGU (Senin Orijinal Sorgun)
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
                    .setMaxResults(200L) // Limit 200
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

            // --- EMAILLERI İNDİRME DÖNGÜSÜ ---
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

                    // Temizlik
                    String cleanBody = rawBody.replaceAll("\\<.*?\\>", " ")
                            .replaceAll("\\s+", " ")
                            .trim();

                    // Çok uzun mailleri kırp (Token limiti yememek için)
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
                    log.warn("Mail okuma hatası (Atlanıyor): {}", e.getMessage());
                }
            }

            // --- AI ANALİZ DÖNGÜSÜ (Batch Processing) ---
            int batchSize = 15;
            int totalBatches = (int) Math.ceil((double) allBatchData.size() / batchSize);

            syncManager.updateStatus(userId, "AI Deep Analysis starting...", 50);

            for (int i = 0; i < totalBatches; i++) {
                int start = i * batchSize;
                int end = Math.min(start + batchSize, allBatchData.size());
                List<Map<String, String>> batch = allBatchData.subList(start, end);

                int currentProgress = 50 + (int)((double)(i + 1) / totalBatches * 45);
                syncManager.updateStatus(userId, "AI analyzing context " + (i + 1) + "/" + totalBatches + "...", currentProgress);

                // Gemini'ye sor
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
            log.error("Sync Error", e);
            syncManager.updateStatus(userId, "Critical Error: " + e.getMessage(), 0);
        }
    }

    // --- YARDIMCI METODLAR ---

    /**
     * User objesinin içindeki ConnectedAccounts listesini tarar,
     * GOOGLE sağlayıcısını bulup AccessToken'ı döner.
     */
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