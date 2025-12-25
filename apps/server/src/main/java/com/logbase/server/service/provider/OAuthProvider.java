package com.logbase.server.service.provider;

import com.logbase.server.dto.ExternalUserHelper;
import com.logbase.server.model.AuthProvider;

public interface OAuthProvider {
    // Hangi sağlayıcı? (GOOGLE, MICROSOFT)
    AuthProvider getProviderName();

    // Kod'u ver, Kullanıcıyı ve Tokenları al
    ExternalUserHelper authenticate(String code);
}