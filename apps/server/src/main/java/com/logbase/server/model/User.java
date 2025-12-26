package com.logbase.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * User Primitive
 * Sistemdeki kimliği (Identity) temsil eder.
 * "Black Box" prensibine göre, dış dünya kullanıcının veritabanında nasıl tutulduğunu bilmez.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    // Giriş yaparken kullanılan ana mail adresi.
    // @Indexed(unique = true) sayesinde aynı mail ile ikinci kayıt açılamaz.
    @Indexed(unique = true)
    private String email;

    private String name;

    // Profil resmi (Google/Outlook'tan gelen)
    private String avatarUrl;

    // Kullanıcının sistemdeki rolü (USER, ADMIN)
    // Varsayılan olarak "USER" atanmalı.
    @Builder.Default
    private String role = "USER";

    // Kullanıcının abonelik planı (FREE, PREMIUM)
    // Varsayılan olarak "FREE" atanmalı.
    @Builder.Default
    private String plan = "FREE";

    // --- Embedded İlişki ---
    // Kullanıcının bağladığı tüm dış hesaplar burada liste olarak tutulur.
    // "Single Responsibility": User sınıfı kimliği, bu liste ise veri kaynaklarını yönetir.
    @Builder.Default
    private List<ConnectedAccount> connectedAccounts = new ArrayList<>();

    // --- Auditing Alanları ---
    // Spring Data bu alanları otomatik doldurur (@EnableMongoAuditing gerekir)

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // --- Admin Analytics Fields ---
    private LocalDateTime lastLoginAt;
    private Integer totalSessions;
    private Long totalTimeSpent; // seconds
    private Integer emailsSynced;
    private String country;
    private String city;
    private String registeredIp;
    private String referralSource;

    /**
     * Helper Method: Black Box Tasarım
     * Dışarıdan listeye doğrudan erişip add() yapmak yerine,
     * bu metot üzerinden ekleme yapmak daha güvenlidir.
     * Var olan hesabı günceller veya yenisini ekler.
     */
    public void addOrUpdateConnectedAccount(ConnectedAccount newAccount) {
        // Varsa eskisini sil (veya güncelle)
        this.connectedAccounts.removeIf(acc ->
                acc.getProvider() == newAccount.getProvider() &&
                        acc.getProviderUserId().equals(newAccount.getProviderUserId())
        );
        // Yenisini ekle
        this.connectedAccounts.add(newAccount);
    }
}