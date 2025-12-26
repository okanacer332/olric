package com.logbase.server.service;

import com.logbase.server.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // application.properties dosyasına: jwt.secret=COK_GIZLI_VE_UZUN_BIR_RASTGELE_STRING_KEY_BURAYA_YAZILMALI_EN_AZ_256_BIT
    @Value("${jwt.secret}")
    private String secretKey;

    // Token geçerlilik süresi (7 gün)
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7;

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());
        claims.put("plan", user.getPlan()); // Include subscription plan in token

        return createToken(claims, user.getId());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject) // Token'ın asıl sahibi (User ID)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    // Token'dan UserID'yi (Subject) çıkarma
    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Token geçerli mi?
    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // Token'dan rolü çıkarma
    public String extractRole(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("role", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private javax.crypto.SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }
}