package com.logbase.server.config;

import com.logbase.server.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList; // Rol yönetimi basitleştirildi

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userId;

        // 1. Header kontrolü: "Bearer " ile başlamıyorsa geç
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Token'ı ayıkla
        jwt = authHeader.substring(7);

        try {
            userId = jwtService.extractUserId(jwt); // Token bozuksa burada hata fırlatır

            // 3. Kullanıcı daha önce authenticate olmamışsa
            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Token geçerli mi?
                if (jwtService.isTokenValid(jwt)) {

                    // Not: Burada veritabanından User çekmiyoruz! (Performans için)
                    // Token geçerliyse işlem tamamdır.

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userId, // Principal olarak User ID dönüyoruz
                            null,
                            new ArrayList<>() // İleride Authorities (Roller) buraya eklenebilir
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // 4. Güvenlik bağlamına (Context) kullanıcıyı oturt
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token hatalıysa sessizce devam et, SecurityConfig zaten 403 verecek
            logger.error("JWT Authentication Failed: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}