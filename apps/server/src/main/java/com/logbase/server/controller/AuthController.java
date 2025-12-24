package com.logbase.server.controller;

import com.logbase.server.service.GmailService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final GmailService gmailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public AuthController(GmailService gmailService) {
        this.gmailService = gmailService;
    }

    // 1. ADIM: Login (Parametresiz)
    // Kullanıcı butona basınca direkt buraya gelir, biz de Google'a yollarız.
    @GetMapping("/login")
    public void login(HttpServletResponse response) {
        try {
            String url = gmailService.getAuthorizationUrl();
            response.sendRedirect(url);
        } catch (Exception e) {
            e.printStackTrace();
            try {
                response.sendRedirect(frontendUrl + "?error=login_init_failed");
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    // 2. ADIM: Google Callback
    // Google'dan kodu alırız, maili buluruz, sync başlatırız ve Dashboard'a atarız.
    @GetMapping("/google-success")
    public void callback(@RequestParam("code") String code, HttpServletResponse response) {
        try {
            // Service: Kodu Token'a çevir -> Profil'den Maili Bul -> Sync Başlat -> Maili Döndür
            String email = gmailService.handleGoogleCallbackAndSync(code);

            System.out.println("Login Başarılı! Yönlendiriliyor: " + email);

            // Dashboard'a parametre olarak maili ekleyip yolluyoruz
            response.sendRedirect(frontendUrl + "?user=" + email + "&success=true");

        } catch (Exception e) {
            e.printStackTrace();
            try {
                response.sendRedirect(frontendUrl + "?error=auth_failed");
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }
}