package com.logbase.server.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.GmailScopes; // Gmail İzinleri
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleAuthService {

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    @Value("${google.redirect.uri}")
    private String redirectUri;

    // !!! BURASI ÇOK ÖNEMLİ !!!
    // Hem Gmail okuma izni (GmailScopes.GMAIL_READONLY)
    // Hem de Mail adresini öğrenme izni (userinfo.email) ekliyoruz.
    private static final List<String> SCOPES = Arrays.asList(
            GmailScopes.GMAIL_READONLY,
            "https://www.googleapis.com/auth/userinfo.email"
    );

    private GoogleAuthorizationCodeFlow flow;

    public GoogleAuthorizationCodeFlow getFlow() throws GeneralSecurityException, IOException {
        if (flow == null) {
            flow = new GoogleAuthorizationCodeFlow.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    clientId,
                    clientSecret,
                    SCOPES) // Listeyi buraya veriyoruz
                    .setAccessType("offline")
                    .build();
        }
        return flow;
    }

    public String getAuthorizationUrl(String userId) throws GeneralSecurityException, IOException {
        return getFlow().newAuthorizationUrl()
                .setRedirectUri(redirectUri)
                .setState(userId)
                .set("prompt", "consent") // DÜZELTME: .setPrompt yerine .set("prompt", ...) kullanıyoruz
                .build();
    }

    public String getRedirectUri() {
        return redirectUri;
    }
}