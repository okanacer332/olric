package com.logbase.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "smart_items")
public class SmartItem {
    @Id
    private String id;
    private String userId;

    // Kategori: TRAVEL, FINANCE, SHOPPING, EVENT, SUBSCRIPTION
    private String category;

    // Ortak Alanlar
    private String title;       // Örn: "Netflix", "Istanbul Trip", "Zara Order"
    private String description; // Örn: "Premium Plan", "Flight to IST", "2 Items"
    private String vendor;      // Satıcı veya Kurum (THY, Apple, Garanti BBVA)
    private String date;        // İşlem/Etkinlik tarihi (YYYY-MM-DD)
    private Double amount;      // Tutar
    private String currency;    // Para birimi (TRY, USD, EUR)

    // Detay Alanları (Kategoriye göre dolacak)
    private String status;      // Shopping: "Delivered", Travel: "Confirmed"
    private String referenceCode; // PNR, Sipariş No, Kargo Takip No

    // Abonelikler için
    private String billingCycle; // "Monthly", "Yearly"

    // Seyahat için
    private String departure;
    private String arrival;

    private String originalEmailId; // Tekrar taramamak için
}