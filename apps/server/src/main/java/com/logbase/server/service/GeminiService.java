package com.logbase.server.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.ContentMaker;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import com.logbase.server.model.SmartItem;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final String PROJECT_ID = "logbase-dev"; // ID'yi kontrol et
    private static final String LOCATION = "us-central1";
    private static final String MODEL_NAME = "gemini-2.0-flash-001";

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public List<SmartItem> analyzeBatch(List<Map<String, String>> emails) {
        if (emails == null || emails.isEmpty()) return new ArrayList<>();

        try (VertexAI vertexAI = new VertexAI(PROJECT_ID, LOCATION)) {

            // 1. Veri Hazırlığı
            StringBuilder inputsBuilder = new StringBuilder();
            int counter = 1;
            for (Map<String, String> email : emails) {
                // Snippet temizliği (çok fazla boşluk varsa sil)
                String cleanSnippet = email.get("snippet") != null
                        ? email.get("snippet").replaceAll("\\s+", " ").trim()
                        : "";

                inputsBuilder.append("EMAIL_ID_").append(counter).append(":\n");
                inputsBuilder.append("   - FROM: ").append(email.get("sender")).append("\n");
                inputsBuilder.append("   - SUBJECT: ").append(email.get("subject")).append("\n");
                inputsBuilder.append("   - SNIPPET: ").append(cleanSnippet).append("\n");
                inputsBuilder.append("   - DATE: ").append(email.get("date")).append("\n");
                inputsBuilder.append("--------------------------------------------------\n");
                counter++;
            }

            // 2. GELİŞMİŞ "FORENSIC ANALYST" PROMPTU
            StringBuilder prompt = new StringBuilder();

            prompt.append("ROLE: You are an expert Forensic Financial Data Analyst. Your job is to extract HIDDEN structured data from raw email metadata.\n\n");

            prompt.append("TASK: Analyze the provided emails. Decide if each email represents a REAL TRANSACTION or COMMITMENT. If yes, categorize it. If it is marketing/spam, IGNORE it.\n\n");

            prompt.append("--- CATEGORY DEFINITIONS (STRICT) ---\n");
            prompt.append("1. TRAVEL: Confirmed bookings ONLY. Flights, Hotels, Trains, Bus. (Keywords: PNR, Ticket #, Reservation Confirmed). IGNORE: 'Flight Offers', 'Plan your trip'.\n");
            prompt.append("2. SHOPPING: Physical item orders. (Keywords: Order #, Shipped, Delivered, Kargo, Sipariş, Teslim). IGNORE: 'Items in your cart', 'Recommendations'.\n");
            prompt.append("3. SUBSCRIPTION: Recurring digital services. (Keywords: Renewed, Invoice for, Premium, Membership, Abonelik). Look for 'Monthly' or 'Yearly' cycle.\n");
            prompt.append("4. EVENT: Tickets for specific dates. (Keywords: Concert, Cinema, Match, Appointment, Randevu). Must have a future or past specific date.\n");
            prompt.append("5. FINANCE: Bank notifications for SPENDING or TRANSFERS. Credit card statements. (Keywords: Harcama, Payment, Statement, Dekont). IGNORE: 'Loan offers', 'Campaigns'.\n\n");

            prompt.append("--- EXTRACTION RULES ---\n");
            prompt.append("- VENDOR: Extract the real company name (e.g., from 'Amazon.com <no-reply@amazon.com>' -> 'Amazon').\n");
            prompt.append("- AMOUNT: Look for patterns like 'Total: 100 TL', 'Tutar: 50.00 USD'. If uncertain or 0, leave null. Do NOT guess.\n");
            prompt.append("- CURRENCY: Detect 'TL', 'TRY', 'USD', 'EUR', '€', '$'. Default to user's local if unknown but look for context.\n");
            prompt.append("- DATE: Convert the email date to YYYY-MM-DD format.\n");
            prompt.append("- LANGUAGE: Emails can be in English or Turkish. Handle 'Sipariş', 'Fatura', 'Uçuş' synonyms correctly.\n\n");

            prompt.append("--- OUTPUT FORMAT ---\n");
            prompt.append("Return ONLY a valid JSON Array. Do not include markdown formatting like ```json ... ```.\n");
            prompt.append("Example:\n");
            prompt.append("[\n");
            prompt.append("  {\"category\": \"SHOPPING\", \"vendor\": \"Trendyol\", \"title\": \"Kazak Siparişi\", \"date\": \"2024-01-15\", \"amount\": 250.0, \"currency\": \"TRY\", \"status\": \"Sipariş Alındı\"},\n");
            prompt.append("  {\"category\": \"SUBSCRIPTION\", \"vendor\": \"Netflix\", \"title\": \"Standard Plan\", \"date\": \"2024-02-01\", \"amount\": 149.99, \"currency\": \"TRY\", \"billingCycle\": \"Monthly\"}\n");
            prompt.append("]\n\n");

            prompt.append("--- INPUT DATA ---\n");
            prompt.append(inputsBuilder.toString());

            // 3. Gemini İsteği
            GenerativeModel model = new GenerativeModel(MODEL_NAME, vertexAI);

            // Sıcaklık ayarını düşürüyoruz (Daha tutarlı olması için)
            // GenerationConfig config = GenerationConfig.newBuilder().setTemperature(0.1f).build();
            // model.generateContent(..., config) şeklinde eklenebilir ama şu an default kalsın.

            GenerateContentResponse response = model.generateContent(ContentMaker.fromMultiModalData(prompt.toString()));
            String responseText = ResponseHandler.getText(response);

            // 4. Temizlik
            String cleanJson = responseText
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            if (cleanJson.startsWith("json")) cleanJson = cleanJson.substring(4).trim();

            if (cleanJson.isEmpty() || cleanJson.equals("[]") || cleanJson.equals("{}")) {
                return new ArrayList<>();
            }

            return objectMapper.readValue(cleanJson, new TypeReference<List<SmartItem>>() {});

        } catch (Exception e) {
            System.err.println("Gemini Critical Error: " + e.getMessage());
            // Hata durumunda boş liste dön ki sistem çökmesin
            return new ArrayList<>();
        }
    }
}