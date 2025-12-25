package com.logbase.server.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // API olduğu için CSRF'e ihtiyacımız yok
                .csrf(csrf -> csrf.disable())

                // CORS Ayarları (Frontend'e izin ver)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // URL Yetkilendirmeleri
                .authorizeHttpRequests(auth -> auth
                        // Bu endpointler herkese açık (Login işlemleri ve sync durumu)
                        .requestMatchers("/api/auth/**", "/api/sync/**", "/api/dashboard/**", "/error").permitAll()
                        // Diğer her şey için token şart!
                        .anyRequest().authenticated()
                )

                // Stateless Session (Sunucu RAM'inde session tutma)
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Filtremizi devreye al
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Hem Landing Page hem Dashboard erişebilsin (local + production)
        configuration.setAllowedOrigins(List.of(
            "http://localhost:3000", 
            "http://localhost:3001",
            "https://okanacer.xyz",
            "https://www.okanacer.xyz"
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}