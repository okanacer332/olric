package com.logbase.server.service.email;

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
import com.logbase.server.model.RawEmail;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Gmail implementation of EmailProvider.
 * Uses Gmail API to fetch and normalize emails.
 */
@Component
@Slf4j
public class GmailProvider implements EmailProvider {

    private static final String PROVIDER_NAME = "GMAIL";
    private static final String APPLICATION_NAME = "Olric-Server";
    private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @Override
    public String getProviderName() {
        return PROVIDER_NAME;
    }

    @Override
    public List<RawEmail> fetchEmails(String accessToken, String searchQuery, int maxResults) {
        List<RawEmail> emails = new ArrayList<>();
        
        try {
            Gmail service = buildGmailService(accessToken);
            
            ListMessagesResponse response = service.users().messages().list("me")
                    .setQ(searchQuery)
                    .setMaxResults((long) maxResults)
                    .execute();

            List<Message> messages = response.getMessages();
            if (messages == null || messages.isEmpty()) {
                return emails;
            }

            for (Message msg : messages) {
                try {
                    Message fullMsg = service.users().messages().get("me", msg.getId())
                            .setFormat("full")
                            .execute();

                    RawEmail email = parseMessage(msg.getId(), fullMsg);
                    emails.add(email);
                } catch (Exception e) {
                    log.warn("Failed to fetch email {}: {}", msg.getId(), e.getMessage());
                }
            }

            log.info("Gmail: Fetched {} emails", emails.size());
            
        } catch (Exception e) {
            log.error("Gmail fetch error: {}", e.getMessage(), e);
        }

        return emails;
    }

    @Override
    public boolean validateToken(String accessToken) {
        try {
            Gmail service = buildGmailService(accessToken);
            service.users().getProfile("me").execute();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String buildSearchQuery() {
        return CategoryDefinitions.buildCombinedSearchQuery();
    }

    private Gmail buildGmailService(String accessToken) throws Exception {
        GoogleCredentials credentials = GoogleCredentials.create(new AccessToken(accessToken, null));
        return new Gmail.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                new HttpCredentialsAdapter(credentials))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    private RawEmail parseMessage(String messageId, Message fullMsg) {
        String subject = "No Subject";
        String sender = "Unknown";
        String date = "";

        if (fullMsg.getPayload().getHeaders() != null) {
            for (MessagePartHeader h : fullMsg.getPayload().getHeaders()) {
                String name = h.getName();
                if ("Subject".equalsIgnoreCase(name)) subject = h.getValue();
                else if ("From".equalsIgnoreCase(name)) sender = h.getValue();
                else if ("Date".equalsIgnoreCase(name)) date = h.getValue();
            }
        }

        String body = getEmailBody(fullMsg.getPayload());
        String cleanBody = cleanContent(body);

        return RawEmail.builder()
                .messageId(messageId)
                .providerName(PROVIDER_NAME)
                .subject(subject)
                .sender(sender)
                .senderDomain(RawEmail.extractDomain(sender))
                .body(cleanBody)
                .date(date)
                .snippet(cleanBody.length() > 200 ? cleanBody.substring(0, 200) : cleanBody)
                .build();
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

    private String cleanContent(String raw) {
        if (raw == null) return "";
        String cleaned = raw
                .replaceAll("<[^>]*>", " ")
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("\\s+", " ")
                .trim();
        return cleaned.length() > 3000 ? cleaned.substring(0, 3000) : cleaned;
    }
}
