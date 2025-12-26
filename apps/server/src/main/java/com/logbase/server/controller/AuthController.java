package com.logbase.server.controller;

import com.logbase.server.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    // Google OAuth Config
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    // Microsoft OAuth Config
    @Value("${microsoft.client.id:}")
    private String microsoftClientId;
    
    @Value("${microsoft.tenant:common}")
    private String microsoftTenant;

    // Dashboard URL for redirects
    @Value("${app.dashboard.url}")
    private String dashboardUrl;

    /**
     * Dynamically builds OAuth callback URI based on request origin.
     */
    private String buildCallbackUri(HttpServletRequest request, String provider) {
        String serverName = request.getServerName();
        String path = "/api/auth/callback/" + provider;
        
        // Production domain detection
        if (serverName.equals("api.okanacer.xyz") || serverName.endsWith(".okanacer.xyz")) {
            return "https://api.okanacer.xyz" + path;
        }
        
        // Development fallback
        int serverPort = request.getServerPort();
        String scheme = request.getScheme();
        if (serverPort == 80 || serverPort == 443) {
            return scheme + "://" + serverName + path;
        }
        return scheme + "://" + serverName + ":" + serverPort + path;
    }

    /**
     * Validates redirect URL against allowlist to prevent open redirect attacks.
     * SECURITY: Only allows redirects to known, trusted domains.
     */
    private boolean isValidRedirectUrl(String url) {
        if (url == null || url.isEmpty()) {
            return false;
        }
        try {
            java.net.URI uri = new java.net.URI(url);
            String host = uri.getHost();
            if (host == null) {
                return false;
            }
            // Allowlist of trusted domains
            return host.equals("okanacer.xyz") 
                || host.equals("www.okanacer.xyz")
                || host.equals("localhost")
                || host.endsWith(".okanacer.xyz");
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping("/login/{provider}")
    public void initiateLogin(
            @PathVariable String provider,
            @RequestParam(required = false) String redirectUrl,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        // SECURITY: Validate redirect URL against allowlist
        String stateParam;
        if (redirectUrl != null && !redirectUrl.isEmpty() && isValidRedirectUrl(redirectUrl)) {
            stateParam = redirectUrl;
        } else {
            stateParam = dashboardUrl;
        }
        String encodedState = URLEncoder.encode(stateParam, StandardCharsets.UTF_8);
        String callbackUri = buildCallbackUri(request, provider.toLowerCase());

        if ("google".equalsIgnoreCase(provider)) {
            // Google OAuth 2.0
            String url = "https://accounts.google.com/o/oauth2/v2/auth" +
                    "?client_id=" + googleClientId +
                    "&redirect_uri=" + URLEncoder.encode(callbackUri, StandardCharsets.UTF_8) +
                    "&response_type=code" +
                    "&scope=email profile https://www.googleapis.com/auth/gmail.readonly" +
                    "&access_type=offline" +
                    "&prompt=consent" +
                    "&state=" + encodedState;
            response.sendRedirect(url);
            
        } else if ("microsoft".equalsIgnoreCase(provider)) {
            // Microsoft OAuth 2.0 (Azure AD)
            if (microsoftClientId == null || microsoftClientId.isEmpty()) {
                response.sendRedirect(dashboardUrl + "/dashboard?error=microsoft_not_configured");
                return;
            }
            
            String url = "https://login.microsoftonline.com/" + microsoftTenant + "/oauth2/v2.0/authorize" +
                    "?client_id=" + microsoftClientId +
                    "&redirect_uri=" + URLEncoder.encode(callbackUri, StandardCharsets.UTF_8) +
                    "&response_type=code" +
                    "&scope=openid profile email offline_access https://graph.microsoft.com/Mail.Read" +
                    "&state=" + encodedState;
            response.sendRedirect(url);
            
        } else {
            response.sendRedirect(dashboardUrl + "/dashboard?error=unknown_provider");
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
            String callbackUri = buildCallbackUri(request, provider.toLowerCase());
            String token = authService.processLogin(provider, code, callbackUri);

            // Decode state to get redirect URL
            String redirectUrl = (state != null && !state.isEmpty()) 
                ? URLDecoder.decode(state, StandardCharsets.UTF_8) 
                : dashboardUrl;

            // Redirect to dashboard with auth token
            response.sendRedirect(redirectUrl + "/dashboard?success=true&user=" + token);

        } catch (Exception e) {
            log.error("OAuth callback error for provider " + provider, e);
            String redirectUrl = (state != null && !state.isEmpty()) 
                ? URLDecoder.decode(state, StandardCharsets.UTF_8) 
                : dashboardUrl;
            response.sendRedirect(redirectUrl + "/dashboard?error=auth_failed&provider=" + provider);
        }
    }
    
    /**
     * Gets connected providers for current user.
     */
    @GetMapping("/connections")
    public java.util.Map<String, Object> getConnections(@RequestParam String userId) {
        // TODO: Implement proper connection listing
        return java.util.Map.of(
            "userId", userId,
            "providers", java.util.List.of("GOOGLE") // Placeholder
        );
    }
}