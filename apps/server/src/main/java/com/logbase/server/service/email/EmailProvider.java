package com.logbase.server.service.email;

import com.logbase.server.model.RawEmail;
import java.util.List;

/**
 * Provider-agnostic interface for email services.
 * Implementations: GmailProvider, OutlookProvider
 */
public interface EmailProvider {
    
    /**
     * Returns the provider name (e.g., "GMAIL", "OUTLOOK")
     */
    String getProviderName();
    
    /**
     * Fetches emails matching the search query.
     * 
     * @param accessToken User's OAuth access token for this provider
     * @param searchQuery Provider-specific search query
     * @param maxResults Maximum number of emails to fetch
     * @return List of normalized RawEmail objects
     */
    List<RawEmail> fetchEmails(String accessToken, String searchQuery, int maxResults);
    
    /**
     * Validates if the access token is still valid.
     */
    boolean validateToken(String accessToken);
    
    /**
     * Gets the appropriate search query for this provider.
     * Each provider has different query syntax.
     */
    String buildSearchQuery();
}
