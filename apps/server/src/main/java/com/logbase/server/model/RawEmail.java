package com.logbase.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Normalized email representation that works across all providers.
 * Maps Gmail and Outlook messages to a common format.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawEmail {
    
    /**
     * Unique message ID from the provider.
     * Gmail: Message ID, Outlook: Message ID
     */
    private String messageId;
    
    /**
     * Provider name: "GMAIL" or "OUTLOOK"
     */
    private String providerName;
    
    /**
     * Email subject line
     */
    private String subject;
    
    /**
     * Sender email address or display name
     */
    private String sender;
    
    /**
     * Extracted domain from sender (e.g., "booking.com")
     */
    private String senderDomain;
    
    /**
     * Plain text email body (HTML stripped)
     */
    private String body;
    
    /**
     * Email received date in ISO format
     */
    private String date;
    
    /**
     * Email snippet/preview (first ~200 chars)
     */
    private String snippet;
    
    /**
     * Extracts domain from sender email.
     */
    public static String extractDomain(String sender) {
        if (sender == null) return null;
        
        // Handle format: "Name <email@domain.com>"
        int ltIndex = sender.indexOf('<');
        int gtIndex = sender.indexOf('>');
        if (ltIndex >= 0 && gtIndex > ltIndex) {
            sender = sender.substring(ltIndex + 1, gtIndex);
        }
        
        int atIndex = sender.lastIndexOf('@');
        if (atIndex < 0) return null;
        
        return sender.substring(atIndex + 1).toLowerCase();
    }
}
