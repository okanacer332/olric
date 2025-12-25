package com.logbase.server.service.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.logbase.server.dto.ExternalUserHelper;
import com.logbase.server.model.AuthProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * Microsoft OAuth 2.0 Provider using Azure AD.
 * Handles authentication and token exchange for Outlook/Microsoft accounts.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MicrosoftOAuthProvider implements OAuthProvider {

    @Value("${microsoft.client.id:}")
    private String clientId;

    @Value("${microsoft.client.secret:}")
    private String clientSecret;

    @Value("${microsoft.tenant:common}")
    private String tenant;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public AuthProvider getProviderName() {
        return AuthProvider.MICROSOFT;
    }

    @Override
    public ExternalUserHelper authenticate(String code, String redirectUri) {
        if (clientId == null || clientId.isEmpty()) {
            throw new RuntimeException("Microsoft OAuth not configured. Set microsoft.client.id and microsoft.client.secret");
        }

        try {
            // Step 1: Exchange code for tokens
            String tokenEndpoint = "https://login.microsoftonline.com/" + tenant + "/oauth2/v2.0/token";

            // DEBUG: Log what we're sending (remove in production)
            log.info("=== MICROSOFT TOKEN EXCHANGE DEBUG ===");
            log.info("Token Endpoint: {}", tokenEndpoint);
            log.info("Client ID: {}", clientId);
            log.info("Client Secret: {}...", clientSecret != null && clientSecret.length() > 5 ? clientSecret.substring(0, 5) : "NULL");
            log.info("Redirect URI: {}", redirectUri);
            log.info("Code (first 20 chars): {}", code != null && code.length() > 20 ? code.substring(0, 20) : code);
            log.info("======================================");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("code", code);
            params.add("grant_type", "authorization_code");
            params.add("redirect_uri", redirectUri);
            // Note: scope is NOT needed in token exchange, only in authorize request
            // params.add("scope", "openid profile email offline_access https://graph.microsoft.com/Mail.Read");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
            ResponseEntity<String> tokenResponse = restTemplate.postForEntity(tokenEndpoint, request, String.class);

            JsonNode tokenRoot = objectMapper.readTree(tokenResponse.getBody());
            String accessToken = tokenRoot.path("access_token").asText();
            String refreshToken = tokenRoot.path("refresh_token").asText(null);
            long expiresIn = tokenRoot.path("expires_in").asLong();

            log.info("Microsoft token exchange successful");

            // Step 2: Get user info from Microsoft Graph
            String userInfoEndpoint = "https://graph.microsoft.com/v1.0/me";
            HttpHeaders authHeaders = new HttpHeaders();
            authHeaders.setBearerAuth(accessToken);
            HttpEntity<String> entity = new HttpEntity<>(authHeaders);

            ResponseEntity<String> userResponse = restTemplate.exchange(userInfoEndpoint, HttpMethod.GET, entity, String.class);
            JsonNode userNode = objectMapper.readTree(userResponse.getBody());

            String email = userNode.path("mail").asText();
            if (email == null || email.isEmpty()) {
                // Fallback to userPrincipalName for personal Microsoft accounts
                email = userNode.path("userPrincipalName").asText();
            }

            String displayName = userNode.path("displayName").asText();
            String id = userNode.path("id").asText();

            log.info("Microsoft user retrieved: {}", email);

            return ExternalUserHelper.builder()
                    .providerUserId(id)
                    .email(email)
                    .name(displayName)
                    .avatarUrl(null) // Microsoft Graph requires separate call for photo
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenExpirySeconds(System.currentTimeMillis() / 1000 + expiresIn)
                    .build();

        } catch (Exception e) {
            log.error("Microsoft Authentication Failed: {}", e.getMessage(), e);
            throw new RuntimeException("Microsoft Authentication Failed: " + e.getMessage());
        }
    }
}
