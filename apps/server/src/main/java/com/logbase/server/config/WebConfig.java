package com.logbase.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Tüm endpointleri dışarı aç
                .allowedOrigins(
                        "http://localhost:3000",      // Yeni Landing Page (Web)
                        "http://localhost:3001",      // Yeni Dashboard (App)
                        "http://localhost:8080",      // Backend'in kendisi (Test için)
                        frontendUrl                   // Config dosyasından gelen (Yedek)
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}