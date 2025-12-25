package com.logbase.server.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.ContentMaker;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import com.logbase.server.config.CategoryDefinitions;
import com.logbase.server.model.SmartItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Enhanced Gemini AI Service for email analysis.
 * Features:
 * - Multi-stage analysis (filter -> classify -> extract)
 * - Detailed category-specific prompts
 * - Confidence scoring
 * - Provider-agnostic design
 */
@Service
@Slf4j
public class GeminiService {

    private static final String PROJECT_ID = "logbase-dev";
    private static final String LOCATION = "us-central1";
    private static final String MODEL_NAME = "gemini-2.0-flash-001";

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    /**
     * Analyzes a batch of emails and extracts SmartItems.
     * Uses comprehensive prompts with worldwide vendor knowledge.
     */
    public List<SmartItem> analyzeBatch(List<Map<String, String>> emails) {
        if (emails == null || emails.isEmpty()) return new ArrayList<>();

        try (VertexAI vertexAI = new VertexAI(PROJECT_ID, LOCATION)) {

            // 1. Prepare email data
            StringBuilder inputsBuilder = new StringBuilder();
            int counter = 1;
            for (Map<String, String> email : emails) {
                String cleanSnippet = email.get("snippet") != null
                        ? email.get("snippet").replaceAll("\\s+", " ").trim()
                        : "";

                // Pre-detect category by sender for hint
                String senderHint = CategoryDefinitions.detectCategoryBySender(email.get("sender"));

                inputsBuilder.append("EMAIL_").append(counter).append(":\n");
                inputsBuilder.append("  SENDER: ").append(email.get("sender")).append("\n");
                inputsBuilder.append("  SUBJECT: ").append(email.get("subject")).append("\n");
                inputsBuilder.append("  DATE: ").append(email.get("date")).append("\n");
                if (senderHint != null) {
                    inputsBuilder.append("  SENDER_HINT: Known ").append(senderHint).append(" sender\n");
                }
                inputsBuilder.append("  CONTENT: ").append(cleanSnippet).append("\n");
                inputsBuilder.append("---\n");
                counter++;
            }

            // 2. Build comprehensive prompt
            String prompt = buildAnalysisPrompt(inputsBuilder.toString());

            // 3. Call Gemini
            GenerativeModel model = new GenerativeModel(MODEL_NAME, vertexAI);
            GenerateContentResponse response = model.generateContent(ContentMaker.fromMultiModalData(prompt));
            String responseText = ResponseHandler.getText(response);

            // 4. Parse response
            String cleanJson = responseText
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            if (cleanJson.startsWith("json")) cleanJson = cleanJson.substring(4).trim();
            if (cleanJson.isEmpty() || cleanJson.equals("[]") || cleanJson.equals("{}")) {
                return new ArrayList<>();
            }

            List<SmartItem> items = objectMapper.readValue(cleanJson, new TypeReference<List<SmartItem>>() {});
            log.info("Extracted {} items from {} emails", items.size(), emails.size());
            return items;

        } catch (Exception e) {
            log.error("Gemini Analysis Error: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Builds a comprehensive analysis prompt with detailed category definitions.
     */
    private String buildAnalysisPrompt(String emailData) {
        return """
            # ROLE
            You are an expert Email Data Extraction AI. Your task is to analyze emails and extract REAL transactions, bookings, and commitments into structured data.
            
            # CRITICAL RULES
            1. ONLY extract CONFIRMED transactions (confirmations, receipts, tickets)
            2. IGNORE marketing emails, promotions, newsletters, abandoned cart reminders
            3. IGNORE "plan your trip", "flight deals", "recommended for you" emails
            4. Each email should produce AT MOST ONE item (avoid duplicates)
            5. If unsure, set confidence lower but still extract
            
            # CATEGORY DEFINITIONS (COMPREHENSIVE)
            
            ## TRAVEL
            **What to extract:** Confirmed flight bookings, hotel reservations, train/bus tickets, car rentals, ride receipts
            **Known senders:** Turkish Airlines, Pegasus, Emirates, Booking.com, Expedia, Airbnb, Uber, Obilet, TCDD
            **Key patterns:** PNR, Booking Reference, Confirmation Number, E-Ticket, Check-in, Itinerary
            **Languages:**
            - EN: flight, booking, reservation, itinerary, boarding pass, hotel confirmation
            - TR: uçuş, bilet, rezervasyon, check-in, biniş kartı, otel rezervasyonu, seyahat
            **Extract fields:**
            - vendor: Airline/Hotel/Service name
            - title: Destination or trip description
            - date: Travel date (YYYY-MM-DD)
            - referenceCode: PNR or booking number
            - departure: Origin city/airport (for flights)
            - arrival: Destination city/airport (for flights)
            - amount: Cost if shown
            - status: "Confirmed", "Checked-in", "Completed"
            **IGNORE:** "Cheap flights to...", "Dream destinations", "Where to next?"
            
            ## FINANCE
            **What to extract:** Bank transaction notifications, payment receipts, credit card statements, money transfers, refunds
            **Known senders:** Garanti BBVA, İş Bankası, Akbank, Yapı Kredi, PayPal, Wise, Revolut, Chase, HSBC
            **Key patterns:** Payment of, Transaction, Dekont, Ekstre, Transfer, Ödeme, Receipt
            **Languages:**
            - EN: payment, receipt, invoice, statement, transaction, transfer, refund, withdrawal
            - TR: ödeme, fatura, dekont, ekstre, havale, EFT, harcama, işlem, iade
            **Extract fields:**
            - vendor: Bank or payment service name
            - title: Transaction description
            - date: Transaction date (YYYY-MM-DD)
            - amount: Transaction amount (REQUIRED - look for patterns like "₺500", "$100", "100 TL")
            - currency: TRY, USD, EUR, GBP
            - status: "Completed", "Pending", "Refunded"
            **IGNORE:** "Loan offers", "Credit limit increase", "Investment opportunity"
            
            ## SHOPPING
            **What to extract:** Order confirmations, shipping notifications, delivery confirmations
            **Known senders:** Trendyol, Hepsiburada, Amazon, N11, Yurtiçi Kargo, Aras Kargo, UPS, FedEx
            **Key patterns:** Order #, Sipariş No, Shipped, Delivered, Kargoya verildi, Teslim edildi
            **Languages:**
            - EN: order, shipped, delivered, tracking, package, dispatch
            - TR: sipariş, kargo, teslim, takip, paket, gönderim
            **Extract fields:**
            - vendor: Store/Marketplace name
            - title: Product description or "Order"
            - date: Order/Delivery date (YYYY-MM-DD)
            - referenceCode: Order number or tracking number
            - amount: Order total if shown
            - status: "Ordered", "Shipped", "Delivered", "Returned"
            **IGNORE:** "Items in your cart", "You might like", "Flash sale"
            
            ## EVENT
            **What to extract:** Confirmed tickets for concerts, movies, sports, appointments
            **Known senders:** Biletix, Passo, Ticketmaster, Eventbrite, CGV, hospitals
            **Key patterns:** Ticket, E-Ticket, Admission, Your tickets for, Randevu
            **Languages:**
            - EN: ticket, event, concert, show, match, appointment, confirmed
            - TR: bilet, etkinlik, konser, maç, randevu, onaylandı
            **Extract fields:**
            - vendor: Venue or event organizer
            - title: Event name
            - date: Event date (YYYY-MM-DD)
            - referenceCode: Ticket number
            - status: "Confirmed", "Attended"
            **IGNORE:** "Upcoming events near you", "Don't miss out"
            
            ## SUBSCRIPTION
            **What to extract:** Subscription confirmations, renewal notices, billing receipts
            **Known senders:** Netflix, Spotify, Apple, Google, Microsoft, Adobe, YouTube Premium
            **Key patterns:** Subscription, Renewed, Billing, Your plan, Monthly, Yearly, Aylık, Yıllık
            **Languages:**
            - EN: subscription, renewal, billing, membership, premium, trial ending
            - TR: abonelik, yenileme, ödeme, üyelik, Premium
            **Extract fields:**
            - vendor: Service name
            - title: Plan name (e.g., "Premium Plan")
            - date: Billing date (YYYY-MM-DD)
            - amount: Subscription cost
            - currency: Currency code
            - billingCycle: "Monthly" or "Yearly"
            - status: "Active", "Renewed", "Cancelled"
            **IGNORE:** "Upgrade to premium", "Special offer for you"
            
            # OUTPUT FORMAT
            Return ONLY a valid JSON array. No markdown, no explanation.
            Each item must have:
            - category: One of TRAVEL, FINANCE, SHOPPING, EVENT, SUBSCRIPTION
            - vendor: Company/service name
            - title: Brief description
            - date: YYYY-MM-DD format
            - confidence: 0.0 to 1.0 (how certain you are this is a real transaction)
            
            Optional fields based on category:
            - amount, currency, status, referenceCode
            - departure, arrival (for TRAVEL)
            - billingCycle (for SUBSCRIPTION)
            
            Example output:
            [
              {"category": "TRAVEL", "vendor": "Turkish Airlines", "title": "Istanbul to London", "date": "2024-03-15", "departure": "IST", "arrival": "LHR", "referenceCode": "ABC123", "status": "Confirmed", "confidence": 0.95},
              {"category": "FINANCE", "vendor": "Garanti BBVA", "title": "Credit Card Payment", "date": "2024-03-10", "amount": 1500.00, "currency": "TRY", "status": "Completed", "confidence": 0.90}
            ]
            
            If no valid items found, return: []
            
            # INPUT EMAILS
            """ + emailData;
    }
}