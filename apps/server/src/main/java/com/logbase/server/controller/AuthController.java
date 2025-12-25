package com.logbase.server.controller;

import com.logbase.server.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${google.redirect.uri}")
    private String googleRedirectUri;

    // YENİ: Dashboard URL'ini çekiyoruz
    @Value("${app.dashboard.url}")
    private String dashboardUrl;

    @GetMapping("/login/{provider}")
    public void initiateLogin(
            @PathVariable String provider,
            @RequestParam(required = false) String redirectUrl,
            HttpServletResponse response
    ) throws IOException {
        if ("google".equalsIgnoreCase(provider)) {
            // Use provided redirectUrl or fall back to configured dashboardUrl
            String stateParam = (redirectUrl != null && !redirectUrl.isEmpty()) ? redirectUrl : dashboardUrl;
            
            // URL encode the state parameter to handle special characters
            String encodedState = java.net.URLEncoder.encode(stateParam, java.nio.charset.StandardCharsets.UTF_8);
            
            String url = "https://accounts.google.com/o/oauth2/v2/auth" +
                    "?client_id=" + googleClientId +
                    "&redirect_uri=" + googleRedirectUri +
                    "&response_type=code" +
                    "&scope=email profile https://www.googleapis.com/auth/gmail.readonly" +
                    "&access_type=offline" +
                    "&prompt=consent" +
                    "&state=" + encodedState;

            response.sendRedirect(url);
        }
    }

    @GetMapping("/callback/{provider}")
    public void handleCallback(
            @PathVariable String provider,
            @RequestParam String code,
            @RequestParam(required = false) String state,
            HttpServletResponse response
    ) throws IOException {
        try {
            String token = authService.processLogin(provider, code);

            // Use the state parameter to determine redirect URL if provided
            // Otherwise fall back to configured dashboard URL
            String redirectUrl;
            if (state != null && !state.isEmpty()) {
                // URL decode the state parameter
                redirectUrl = java.net.URLDecoder.decode(state, java.nio.charset.StandardCharsets.UTF_8);
            } else {
                redirectUrl = dashboardUrl;
            }

            // Always redirect to /dashboard path with auth params
            response.sendRedirect(redirectUrl + "/dashboard?success=true&user=" + token);

        } catch (Exception e) {
            e.printStackTrace();
            // On error, redirect to dashboard with error parameter
            String redirectUrl = (state != null && !state.isEmpty()) 
                ? java.net.URLDecoder.decode(state, java.nio.charset.StandardCharsets.UTF_8) 
                : dashboardUrl;
            response.sendRedirect(redirectUrl + "/dashboard?error=auth_failed");
        }
    }
}