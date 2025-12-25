package com.logbase.server.controller;

import com.logbase.server.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
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

    // YENİ: Dashboard URL'ini çekiyoruz
    @Value("${app.dashboard.url}")
    private String dashboardUrl;

    /**
     * Dynamically builds the Google OAuth callback URI based on the incoming request.
     * - Production (api.okanacer.xyz) → https://api.okanacer.xyz/api/auth/callback/google
     * - Development (localhost) → http://localhost:8080/api/auth/callback/google
     */
    private String buildCallbackUri(HttpServletRequest request) {
        String serverName = request.getServerName();
        
        // Production domain detection
        if (serverName.equals("api.okanacer.xyz") || serverName.endsWith(".okanacer.xyz")) {
            return "https://api.okanacer.xyz/api/auth/callback/google";
        }
        
        // Development fallback
        int serverPort = request.getServerPort();
        String scheme = request.getScheme();
        if (serverPort == 80 || serverPort == 443) {
            return scheme + "://" + serverName + "/api/auth/callback/google";
        }
        return scheme + "://" + serverName + ":" + serverPort + "/api/auth/callback/google";
    }

    @GetMapping("/login/{provider}")
    public void initiateLogin(
            @PathVariable String provider,
            @RequestParam(required = false) String redirectUrl,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        if ("google".equalsIgnoreCase(provider)) {
            // Use provided redirectUrl or fall back to configured dashboardUrl
            String stateParam = (redirectUrl != null && !redirectUrl.isEmpty()) ? redirectUrl : dashboardUrl;
            
            // URL encode the state parameter to handle special characters
            String encodedState = java.net.URLEncoder.encode(stateParam, java.nio.charset.StandardCharsets.UTF_8);
            
            // Dynamically build callback URI based on request origin
            String callbackUri = buildCallbackUri(request);
            
            String url = "https://accounts.google.com/o/oauth2/v2/auth" +
                    "?client_id=" + googleClientId +
                    "&redirect_uri=" + java.net.URLEncoder.encode(callbackUri, java.nio.charset.StandardCharsets.UTF_8) +
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
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        try {
            // Build the same callback URI that was used in the initial OAuth request
            String callbackUri = buildCallbackUri(request);
            String token = authService.processLogin(provider, code, callbackUri);

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