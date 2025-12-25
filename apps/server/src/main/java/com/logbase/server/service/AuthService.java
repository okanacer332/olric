package com.logbase.server.service;

import com.logbase.server.dto.ExternalUserHelper;
import com.logbase.server.model.AuthProvider;
import com.logbase.server.model.ConnectedAccount;
import com.logbase.server.model.User;
import com.logbase.server.repository.UserRepository;
import com.logbase.server.service.provider.OAuthProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final Map<AuthProvider, OAuthProvider> providerMap;

    // CONSTRUCTOR INJECTION (En Garanti Yöntem)
    public AuthService(UserRepository userRepository, JwtService jwtService, List<OAuthProvider> providers) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        // Listeyi Map'e burada çeviriyoruz. providerMap artık 'final' olabilir.
        this.providerMap = providers.stream()
                .collect(Collectors.toMap(OAuthProvider::getProviderName, Function.identity()));
    }

    @Transactional
    public String processLogin(String providerName, String code) {
        AuthProvider providerType;
        try {
            providerType = AuthProvider.valueOf(providerName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Geçersiz sağlayıcı: " + providerName);
        }

        OAuthProvider provider = providerMap.get(providerType);

        if (provider == null) {
            throw new IllegalArgumentException("Sağlayıcı bulunamadı: " + providerName);
        }

        ExternalUserHelper externalUser = provider.authenticate(code);

        User user = userRepository.findByEmail(externalUser.getEmail())
                .orElseGet(() -> createNewUser(externalUser));

        updateConnectedAccount(user, externalUser, providerType);
        userRepository.save(user);

        return jwtService.generateToken(user);
    }

    private User createNewUser(ExternalUserHelper externalUser) {
        return User.builder()
                .email(externalUser.getEmail())
                .name(externalUser.getName())
                .avatarUrl(externalUser.getAvatarUrl())
                .role("USER")
                .build();
    }

    private void updateConnectedAccount(User user, ExternalUserHelper external, AuthProvider type) {
        ConnectedAccount account = ConnectedAccount.builder()
                .provider(type)
                .providerUserId(external.getProviderUserId())
                .email(external.getEmail())
                .accessToken(external.getAccessToken())
                .refreshToken(external.getRefreshToken())
                .tokenExpiry(external.getTokenExpirySeconds())
                .lastSyncTime(LocalDateTime.now())
                .syncStatus("CONNECTED")
                .build();

        if (account.getRefreshToken() == null && user.getConnectedAccounts() != null) {
            user.getConnectedAccounts().stream()
                    .filter(a -> a.getProvider() == type && a.getProviderUserId().equals(external.getProviderUserId()))
                    .findFirst()
                    .ifPresent(existing -> account.setRefreshToken(existing.getRefreshToken()));
        }
        user.addOrUpdateConnectedAccount(account);
    }
}