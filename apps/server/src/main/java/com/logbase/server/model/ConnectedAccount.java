package com.logbase.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * ConnectedAccount
 * Bu bir "Value Object" olarak tasarlanmıştır.
 * Tek başına var olamaz, mutlaka bir User'a ait olmalıdır.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectedAccount {

    // Hangi servis? (GOOGLE, MICROSOFT)
    private AuthProvider provider;

    // Sağlayıcıdaki benzersiz ID'si (örn: Google'ın sub değeri)
    private String providerUserId;

    // Bağlanan hesabın mail adresi (örn: is.maili@sirket.com)
    private String email;

    // OAuth Access Token (Hassas veri)
    // Prod ortamında bu alanın şifreli (Encrypted) tutulması önerilir.
    private String accessToken;

    // Token yenilemek için gerekli (Hassas veri)
    private String refreshToken;

    // Token ne zaman ölecek? (Epoch seconds veya Timestamp)
    private Long tokenExpiry;

    // Son senkronizasyon ne zaman yapıldı?
    private LocalDateTime lastSyncTime;

    // Son senkronizasyon durumu (SUCCESS, FAILED, IN_PROGRESS)
    private String syncStatus;

    // Hata durumunda mesajı buraya yazarız
    private String lastErrorMessage;
}