package com.logbase.server.service.email;

import com.logbase.server.model.RawEmail;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Microsoft Outlook implementation of EmailProvider.
 * Uses Microsoft Graph API to fetch emails.
 * 
 * Requirements:
 * - Azure AD App Registration with Mail.Read permission
 * - Valid access token with offline_access scope
 */
@Component
@Slf4j
public class OutlookProvider implements EmailProvider {

    private static final String PROVIDER_NAME = "OUTLOOK";
    private static final String GRAPH_API_BASE = "https://graph.microsoft.com/v1.0";
    
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String getProviderName() {
        return PROVIDER_NAME;
    }

    @Override
    public List<RawEmail> fetchEmails(String accessToken, String searchQuery, int maxResults) {
        List<RawEmail> emails = new ArrayList<>();
        
        try {
            // Build request headers
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Build Graph API URL with search filter
            // Microsoft Graph uses OData $filter and $search syntax
            String url = GRAPH_API_BASE + "/me/messages"
                    + "?$top=" + maxResults
                    + "&$select=id,subject,from,receivedDateTime,bodyPreview,body"
                    + "&$orderby=receivedDateTime desc"
                    + "&$search=\"" + escapeODataSearch(searchQuery) + "\"";
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> messages = (List<Map<String, Object>>) response.getBody().get("value");
                
                if (messages != null) {
                    for (Map<String, Object> msg : messages) {
                        try {
                            RawEmail email = parseMessage(msg);
                            emails.add(email);
                        } catch (Exception e) {
                            log.warn("Failed to parse Outlook message: {}", e.getMessage());
                        }
                    }
                }
            }
            
            log.info("Outlook: Fetched {} emails", emails.size());
            
        } catch (Exception e) {
            log.error("Outlook fetch error: {}", e.getMessage(), e);
        }

        return emails;
    }

    @Override
    public boolean validateToken(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    GRAPH_API_BASE + "/me", 
                    HttpMethod.GET, 
                    entity, 
                    Map.class);
            
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String buildSearchQuery() {
        // Microsoft Graph search query syntax is different from Gmail
        // Uses natural language search within the $search parameter
        return "flight OR booking OR reservation OR payment OR receipt OR invoice OR " +
               "order OR shipped OR delivered OR subscription OR renewal OR ticket OR " +
               "uçuş OR rezervasyon OR ödeme OR fatura OR sipariş OR kargo OR abonelik";
    }

    private RawEmail parseMessage(Map<String, Object> msg) {
        String messageId = (String) msg.get("id");
        String subject = (String) msg.getOrDefault("subject", "No Subject");
        String receivedDateTime = (String) msg.get("receivedDateTime");
        String bodyPreview = (String) msg.getOrDefault("bodyPreview", "");
        
        // Extract sender
        String sender = "Unknown";
        Map<String, Object> fromField = (Map<String, Object>) msg.get("from");
        if (fromField != null) {
            Map<String, Object> emailAddress = (Map<String, Object>) fromField.get("emailAddress");
            if (emailAddress != null) {
                String name = (String) emailAddress.get("name");
                String address = (String) emailAddress.get("address");
                sender = name != null ? name + " <" + address + ">" : address;
            }
        }
        
        // Extract body content
        String body = bodyPreview;
        Map<String, Object> bodyField = (Map<String, Object>) msg.get("body");
        if (bodyField != null) {
            String content = (String) bodyField.get("content");
            if (content != null) {
                body = cleanContent(content);
            }
        }
        
        // Convert receivedDateTime to simpler format
        String date = receivedDateTime != null ? receivedDateTime.substring(0, 10) : "";
        
        return RawEmail.builder()
                .messageId(messageId)
                .providerName(PROVIDER_NAME)
                .subject(subject)
                .sender(sender)
                .senderDomain(RawEmail.extractDomain(sender))
                .body(body)
                .date(date)
                .snippet(bodyPreview.length() > 200 ? bodyPreview.substring(0, 200) : bodyPreview)
                .build();
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
    
    private String escapeODataSearch(String query) {
        // Escape special characters for OData $search
        return query.replace("\"", "\\\"");
    }
}
