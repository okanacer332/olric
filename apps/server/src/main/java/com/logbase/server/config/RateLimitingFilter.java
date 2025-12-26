package com.logbase.server.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiting filter to prevent abuse.
 * Limits: 60 requests per minute per IP for auth endpoints.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    // IP -> Rate limit bucket
    // Simple LRU Cache implementation to prevent memory leaks
    private final Map<String, Bucket> buckets = java.util.Collections.synchronizedMap(
        new java.util.LinkedHashMap<String, Bucket>(1000, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(java.util.Map.Entry<String, Bucket> eldest) {
                return size() > 10000; // Limit to 10k active IPs
            }
        }
    );

    // Configuration
    private static final int AUTH_REQUESTS_PER_MINUTE = 20;
    private static final int API_REQUESTS_PER_MINUTE = 100;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String clientIp = getClientIP(request);
        String path = request.getRequestURI();
        
        // Different limits for auth vs general API
        Bucket bucket;
        if (path.startsWith("/api/auth")) {
            bucket = buckets.computeIfAbsent(clientIp + ":auth", k -> createAuthBucket());
        } else if (path.startsWith("/api/")) {
            bucket = buckets.computeIfAbsent(clientIp + ":api", k -> createApiBucket());
        } else {
            // No rate limiting for non-API paths
            filterChain.doFilter(request, response);
            return;
        }

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\",\"status\":429}");
        }
    }

    private Bucket createAuthBucket() {
        Bandwidth limit = Bandwidth.classic(AUTH_REQUESTS_PER_MINUTE, 
                Refill.greedy(AUTH_REQUESTS_PER_MINUTE, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createApiBucket() {
        Bandwidth limit = Bandwidth.classic(API_REQUESTS_PER_MINUTE, 
                Refill.greedy(API_REQUESTS_PER_MINUTE, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
