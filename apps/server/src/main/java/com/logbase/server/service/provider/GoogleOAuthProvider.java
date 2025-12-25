package com.logbase.server.service.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.logbase.server.dto.ExternalUserHelper;
import com.logbase.server.model.AuthProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class GoogleOAuthProvider implements OAuthProvider {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    // Redirect URI from configuration - supports both dev and production
    @Value("${google.redirect.uri}")
    private String redirectUri;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public AuthProvider getProviderName() {
        return AuthProvider.GOOGLE;
    }

    @Override
    public ExternalUserHelper authenticate(String code) {
        // 1. Adım: Code -> Token değişimi
        String tokenEndpoint = "https://oauth2.googleapis.com/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("client_id", clientId);
        map.add("client_secret", clientSecret);
        map.add("code", code);
        map.add("grant_type", "authorization_code");
        map.add("redirect_uri", redirectUri);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
        ResponseEntity<String> tokenResponse = restTemplate.postForEntity(tokenEndpoint, request, String.class);

        // 2. Adım: Token ile Kullanıcı Bilgisi Çekme
        try {
            JsonNode root = objectMapper.readTree(tokenResponse.getBody());
            String accessToken = root.path("access_token").asText();
            String refreshToken = root.path("refresh_token").asText(null); // İlk login değilse gelmeyebilir
            long expiresIn = root.path("expires_in").asLong();

            // Google User Info API
            String userInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo";
            HttpHeaders authHeaders = new HttpHeaders();
            authHeaders.setBearerAuth(accessToken);
            HttpEntity<String> entity = new HttpEntity<>(authHeaders);

            ResponseEntity<String> userResponse = restTemplate.exchange(userInfoEndpoint, HttpMethod.GET, entity, String.class);
            JsonNode userNode = objectMapper.readTree(userResponse.getBody());

            return ExternalUserHelper.builder()
                    .providerUserId(userNode.path("sub").asText())
                    .email(userNode.path("email").asText())
                    .name(userNode.path("name").asText())
                    .avatarUrl(userNode.path("picture").asText())
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenExpirySeconds(System.currentTimeMillis() / 1000 + expiresIn)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Google Authentication Failed: " + e.getMessage());
        }
    }
}