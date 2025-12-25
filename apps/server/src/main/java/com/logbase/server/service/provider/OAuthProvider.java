package com.logbase.server.service.provider;

import com.logbase.server.dto.ExternalUserHelper;
import com.logbase.server.model.AuthProvider;

public interface OAuthProvider {
    // Hangi sağlayıcı? (GOOGLE, MICROSOFT)
    AuthProvider getProviderName();

    // Kod'u ver, Kullanıcıyı ve Tokenları al
    // redirectUri: The callback URI used in the initial OAuth request (must match for token exchange)
    ExternalUserHelper authenticate(String code, String redirectUri);
}