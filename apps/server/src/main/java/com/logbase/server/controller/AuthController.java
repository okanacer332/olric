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
    public void initiateLogin(@PathVariable String provider, HttpServletResponse response) throws IOException {
        if ("google".equalsIgnoreCase(provider)) {
            String url = "https://accounts.google.com/o/oauth2/v2/auth" +
                    "?client_id=" + googleClientId +
                    "&redirect_uri=" + googleRedirectUri +
                    "&response_type=code" +
                    "&scope=email profile https://www.googleapis.com/auth/gmail.readonly" +
                    "&access_type=offline" +
                    "&prompt=consent";

            response.sendRedirect(url);
        }
    }

    @GetMapping("/callback/{provider}")
    public void handleCallback(
            @PathVariable String provider,
            @RequestParam String code,
            HttpServletResponse response
    ) throws IOException {
        try {
            String token = authService.processLogin(provider, code);

            // DÜZELTME: Artık localhost:3000'e değil, Dashboard URL'ine (3001) gönderiyoruz!
            response.sendRedirect(dashboardUrl + "?success=true&user=" + token);

        } catch (Exception e) {
            e.printStackTrace();
            // Hata olursa yine Dashboard'un login sayfasına veya Landing'e atabilirsin
            // Şimdilik Dashboard'a hata koduyla atalım
            response.sendRedirect(dashboardUrl + "?error=auth_failed");
        }
    }
}