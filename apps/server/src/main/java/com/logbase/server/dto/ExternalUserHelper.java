package com.logbase.server.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExternalUserHelper {
    // Google/Microsoft'tan ne aldık?
    private String providerUserId; // sub
    private String email;
    private String name;
    private String avatarUrl;

    // Tokenlar
    private String accessToken;
    private String refreshToken;
    private Long tokenExpirySeconds;
}