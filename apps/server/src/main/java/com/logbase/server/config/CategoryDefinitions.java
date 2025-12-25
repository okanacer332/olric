package com.logbase.server.config;

import java.util.*;

/**
 * Comprehensive category definitions for worldwide email analysis.
 * Supports multiple languages (English, Turkish) and global vendors.
 * 
 * DESIGN PRINCIPLE: Provider-agnostic definitions that work for Gmail, Outlook, etc.
 */
public class CategoryDefinitions {

    // ============================================================
    // TRAVEL CATEGORY - Flights, Hotels, Transportation
    // ============================================================
    
    public static final Set<String> TRAVEL_SENDERS = Set.of(
        // Turkish Airlines
        "turkishairlines.com", "thy.com", "milesandsmiles.com",
        // Turkish Low-Cost
        "flypgs.com", "pegasusairlines.com", "sunexpress.com", "anadolujet.com", "corendon.com",
        // European Airlines
        "lufthansa.com", "klm.com", "airfrance.com", "iberia.com", "britishairways.com",
        "ryanair.com", "easyjet.com", "vueling.com", "wizz.com", "norwegian.com", "finnair.com",
        // Middle East
        "emirates.com", "qatarairways.com", "etihad.com", "saudia.com", "flydubai.com",
        // American
        "delta.com", "united.com", "aa.com", "southwest.com", "jetblue.com", "alaskaair.com",
        // Asian
        "singaporeair.com", "cathaypacific.com", "ana.co.jp", "jal.co.jp", "koreanair.com",
        // OTAs & Booking
        "booking.com", "hotels.com", "expedia.com", "agoda.com", "trivago.com",
        "airbnb.com", "vrbo.com", "trip.com", "ctrip.com", "skyscanner.net", "kayak.com",
        // Turkish OTAs
        "obilet.com", "enuygun.com", "tatilsepeti.com", "jollytur.com", "etstur.com", "gezinomi.com",
        // Rail & Bus
        "tcddtasimacilik.gov.tr", "tcdd.gov.tr", "flixbus.com", "bla.blacar.com",
        "eurostar.com", "sncf.com", "trenitalia.com", "deutschebahn.com", "amtrak.com",
        // Car Rental
        "hertz.com", "avis.com", "enterprise.com", "budget.com", "sixt.com", "europcar.com",
        // Ride Sharing
        "uber.com", "lyft.com", "bolt.eu", "freenow.com", "bitaksi.com"
    );
    
    public static final List<String> TRAVEL_SUBJECT_KEYWORDS = List.of(
        // English
        "flight", "booking", "reservation", "itinerary", "e-ticket", "boarding pass",
        "hotel confirmation", "check-in", "your trip", "travel confirmation",
        "train ticket", "bus ticket", "car rental", "pick-up", "rental confirmation",
        // Turkish
        "uçuş", "uçak bileti", "rezervasyon", "bilet", "biniş kartı", "check-in",
        "otel rezervasyonu", "seyahat", "yolculuk", "gezi", "tren bileti", "otobüs bileti",
        "araç kiralama", "transfer"
    );
    
    public static final List<String> TRAVEL_CONFIRMATION_PATTERNS = List.of(
        "PNR", "Booking Reference", "Confirmation Number", "Reservation ID",
        "Ticket Number", "E-Ticket", "Booking ID", "Reservation Code",
        "Rezervasyon No", "Bilet No", "PNR Kodu", "Onay Numarası"
    );
    
    public static final List<String> TRAVEL_EXCLUDE_PATTERNS = List.of(
        "flight deals", "cheap flights", "travel inspiration", "dream destination",
        "explore", "plan your next trip", "wanderlust", "travel tips",
        "ucuz bilet", "kampanya", "fırsat", "indirim", "seyahat rehberi"
    );
    
    // ============================================================
    // FINANCE CATEGORY - Banking, Payments, Transactions
    // ============================================================
    
    public static final Set<String> FINANCE_SENDERS = Set.of(
        // Turkish Banks
        "garantibbva.com.tr", "garanti.com.tr", "isbank.com.tr", "akbank.com.tr", "akbank.com",
        "yapikredi.com.tr", "ziraatbank.com.tr", "halkbank.com.tr", "vakifbank.com.tr",
        "denizbank.com", "qnbfinansbank.com", "ing.com.tr", "hsbc.com.tr", "teb.com.tr",
        "sekerbank.com.tr", "fibabanka.com.tr", "odeabank.com.tr", "anadolubank.com.tr",
        // Global Banks
        "chase.com", "bankofamerica.com", "wellsfargo.com", "citi.com", "citibank.com",
        "hsbc.com", "barclays.com", "deutschebank.com", "bnpparibas.com", "santander.com",
        "ing.com", "unicredit.com", "ubs.com", "standardchartered.com",
        // Payment Services
        "paypal.com", "stripe.com", "wise.com", "revolut.com", "n26.com", "monzo.com",
        "venmo.com", "squareup.com", "brex.com", "mercury.com",
        // Turkish Payment
        "iyzico.com", "papara.com", "tosla.com", "fastpay.com.tr", "param.com.tr",
        "ininal.com", "paycell.com.tr"
    );
    
    public static final List<String> FINANCE_SUBJECT_KEYWORDS = List.of(
        // English
        "payment", "receipt", "invoice", "statement", "transaction", "transfer",
        "balance", "withdrawal", "deposit", "refund", "charge", "debit", "credit",
        "bank statement", "account activity", "payment confirmation", "money sent",
        "you paid", "payment received", "wire transfer", "direct deposit",
        // Turkish
        "ödeme", "fatura", "dekont", "ekstre", "havale", "EFT", "bakiye",
        "para transferi", "hesap hareketi", "harcama", "iade", "borç",
        "kredi kartı ekstresi", "hesap özeti", "işlem onayı", "para gönderimi"
    );
    
    public static final List<String> FINANCE_AMOUNT_PATTERNS = List.of(
        "Total:", "Amount:", "Tutar:", "Toplam:", "Payment of", "You paid",
        "Ödeme Tutarı:", "İşlem Tutarı:", "Harcama:", "Transfer Amount:",
        "₺", "TL", "TRY", "$", "USD", "€", "EUR", "£", "GBP"
    );
    
    public static final List<String> FINANCE_EXCLUDE_PATTERNS = List.of(
        "loan offer", "credit increase", "investment opportunity", "promotional rate",
        "pre-approved", "special offer", "limited time", "campaign", "apply now",
        "kredi teklifi", "limit artışı", "yatırım fırsatı", "kampanya", "başvur"
    );
    
    // ============================================================
    // SHOPPING CATEGORY - Orders, Deliveries, E-commerce
    // ============================================================
    
    public static final Set<String> SHOPPING_SENDERS = Set.of(
        // Turkish E-commerce
        "trendyol.com", "hepsiburada.com", "n11.com", "gittigidiyor.com",
        "ciceksepeti.com", "morhipo.com", "boyner.com.tr", "koton.com",
        "defacto.com.tr", "lcwaikiki.com", "yemeksepeti.com", "getir.com",
        // Global E-commerce
        "amazon.com", "amazon.com.tr", "ebay.com", "aliexpress.com", "alibaba.com",
        "etsy.com", "walmart.com", "target.com", "bestbuy.com", "newegg.com",
        "asos.com", "zalando.com", "hm.com", "zara.com", "uniqlo.com",
        "nike.com", "adidas.com", "apple.com", "samsung.com",
        // Food Delivery
        "doordash.com", "grubhub.com", "ubereats.com", "deliveroo.com", "justeat.com",
        // Shipping
        "ups.com", "fedex.com", "dhl.com", "usps.com",
        "yurticikargo.com", "araskargo.com.tr", "mngkargo.com.tr", "ptt.gov.tr",
        "suratkargo.com.tr", "sendeo.com.tr", "trendyolexpress.com"
    );
    
    public static final List<String> SHOPPING_SUBJECT_KEYWORDS = List.of(
        // English
        "order", "order confirmation", "shipped", "delivered", "tracking",
        "package", "dispatch", "out for delivery", "your order", "order placed",
        "delivery update", "shipment", "return", "refund processed",
        // Turkish
        "sipariş", "sipariş onayı", "kargo", "teslim", "takip",
        "paket", "gönderim", "teslimat", "siparişiniz", "iade",
        "kargoya verildi", "teslim edildi", "yolda"
    );
    
    public static final List<String> SHOPPING_REFERENCE_PATTERNS = List.of(
        "Order #", "Order Number:", "Sipariş No:", "Sipariş Numarası:",
        "Tracking:", "Tracking Number:", "Kargo Takip:", "AWB:",
        "Reference:", "Referans No:"
    );
    
    public static final List<String> SHOPPING_EXCLUDE_PATTERNS = List.of(
        "items in cart", "you might like", "wishlist", "sale alert", "price drop",
        "back in stock", "flash sale", "recommended for you", "bestsellers",
        "sepetinizde", "beğenebileceğiniz", "indirim", "kampanya", "fırsat"
    );
    
    // ============================================================
    // EVENT CATEGORY - Tickets, Concerts, Appointments
    // ============================================================
    
    public static final Set<String> EVENT_SENDERS = Set.of(
        // Turkish Ticketing
        "biletix.com", "passo.com.tr", "mobilet.com", "biletinial.com",
        // Global Ticketing
        "ticketmaster.com", "eventbrite.com", "stubhub.com", "seatgeek.com",
        "dice.fm", "axs.com", "livenation.com", "bandsintown.com",
        // Venues & Cinemas
        "cgv.com.tr", "cinemaximum.com.tr", "cinemaximum.com", "marsmedia.com.tr",
        "amc.com", "cineworld.com", "odeon.co.uk",
        // Healthcare Appointments
        "mhrs.gov.tr", "e-nabiz.gov.tr", "acibadem.com.tr", "memorial.com.tr",
        "zocdoc.com", "doctolib.fr"
    );
    
    public static final List<String> EVENT_SUBJECT_KEYWORDS = List.of(
        // English
        "ticket", "tickets", "event", "concert", "show", "movie", "film",
        "match", "game", "appointment", "reservation", "confirmed", "RSVP",
        "your tickets", "e-ticket", "admission",
        // Turkish
        "bilet", "etkinlik", "konser", "gösteri", "sinema", "film",
        "maç", "randevu", "kaydınız", "onaylandı", "e-bilet"
    );
    
    public static final List<String> EVENT_EXCLUDE_PATTERNS = List.of(
        "upcoming events", "events near you", "recommended events", "don't miss",
        "new events", "trending", "popular events",
        "yaklaşan etkinlikler", "kaçırma", "önerilen"
    );
    
    // ============================================================
    // SUBSCRIPTION CATEGORY - Recurring Services
    // ============================================================
    
    public static final Set<String> SUBSCRIPTION_SENDERS = Set.of(
        // Streaming
        "netflix.com", "spotify.com", "music.apple.com", "youtube.com", "google.com",
        "disneyplus.com", "hbomax.com", "primevideo.com", "hulu.com",
        "twitch.tv", "crunchyroll.com", "dazn.com",
        // Turkish Streaming
        "exxen.com", "blutv.com", "gain.tv", "tabii.com", "todtv.com.tr",
        // Software
        "microsoft.com", "office.com", "adobe.com", "dropbox.com", "notion.so",
        "slack.com", "zoom.us", "atlassian.com", "github.com", "gitlab.com",
        "jetbrains.com", "figma.com", "canva.com", "grammarly.com",
        // News & Learning
        "medium.com", "substack.com", "nytimes.com", "economist.com",
        "udemy.com", "coursera.org", "linkedin.com", "skillshare.com",
        // Wellness
        "headspace.com", "calm.com", "peloton.com", "strava.com",
        // Security & VPN
        "1password.com", "lastpass.com", "nordvpn.com", "expressvpn.com"
    );
    
    public static final List<String> SUBSCRIPTION_SUBJECT_KEYWORDS = List.of(
        // English
        "subscription", "renewal", "billing", "your plan", "membership",
        "premium", "trial ending", "payment due", "auto-renewal",
        "monthly invoice", "yearly invoice", "subscription confirmed",
        // Turkish
        "abonelik", "yenileme", "ödeme", "plan", "üyelik",
        "Premium", "deneme süresi", "otomatik yenileme",
        "aylık fatura", "yıllık fatura"
    );
    
    public static final List<String> SUBSCRIPTION_CYCLE_PATTERNS = List.of(
        "monthly", "yearly", "annual", "per month", "per year",
        "aylık", "yıllık", "her ay", "her yıl", "/mo", "/yr"
    );
    
    public static final List<String> SUBSCRIPTION_EXCLUDE_PATTERNS = List.of(
        "upgrade now", "special offer", "limited time", "exclusive deal",
        "try premium", "unlock features", "get more",
        "şimdi yükselt", "özel teklif", "fırsat"
    );
    
    // ============================================================
    // GMAIL SEARCH QUERY BUILDERS
    // ============================================================
    
    /**
     * Builds a comprehensive Gmail search query for Travel emails.
     * Uses OR logic to capture all possible travel-related emails.
     */
    public static String buildTravelSearchQuery() {
        StringBuilder query = new StringBuilder();
        query.append("(");
        
        // Subject keywords
        query.append("subject:(");
        query.append(String.join(" OR ", TRAVEL_SUBJECT_KEYWORDS.stream()
            .map(k -> "\"" + k + "\"")
            .toList()));
        query.append(") OR ");
        
        // Known senders (top 20 most common)
        query.append("from:(");
        String[] topTravelSenders = {"booking.com", "expedia.com", "airbnb.com", 
            "turkishairlines.com", "pegasus", "emirates", "obilet.com", "hotels.com",
            "ryanair.com", "lufthansa.com"};
        query.append(String.join(" OR ", topTravelSenders));
        query.append(") OR ");
        
        // Confirmation patterns
        query.append("(PNR OR \"booking reference\" OR \"confirmation number\" OR \"e-ticket\")");
        
        query.append(") newer_than:1y");
        return query.toString();
    }
    
    /**
     * Builds a comprehensive Gmail search query for Finance emails.
     */
    public static String buildFinanceSearchQuery() {
        StringBuilder query = new StringBuilder();
        query.append("(");
        
        // Subject keywords
        query.append("subject:(");
        query.append("payment OR receipt OR invoice OR statement OR transaction OR ");
        query.append("\"ödeme\" OR \"fatura\" OR \"dekont\" OR \"ekstre\" OR \"havale\"");
        query.append(") OR ");
        
        // Known bank senders
        query.append("from:(");
        String[] topFinanceSenders = {"garantibbva.com.tr", "isbank.com.tr", "akbank.com",
            "yapikredi.com.tr", "paypal.com", "wise.com", "revolut.com", "chase.com"};
        query.append(String.join(" OR ", topFinanceSenders));
        query.append(")");
        
        query.append(") newer_than:1y");
        return query.toString();
    }
    
    /**
     * Builds a comprehensive Gmail search query for Shopping emails.
     */
    public static String buildShoppingSearchQuery() {
        StringBuilder query = new StringBuilder();
        query.append("(");
        
        query.append("subject:(order OR shipped OR delivered OR tracking OR ");
        query.append("\"sipariş\" OR \"kargo\" OR \"teslim\" OR \"gönderim\") OR ");
        
        query.append("from:(trendyol.com OR hepsiburada.com OR amazon.com OR n11.com OR ");
        query.append("yurticikargo.com OR araskargo.com.tr OR ups.com OR fedex.com)");
        
        query.append(") newer_than:1y");
        return query.toString();
    }
    
    /**
     * Builds a combined search query for all categories.
     * More efficient than running 5 separate queries.
     */
    public static String buildCombinedSearchQuery() {
        return "(" +
            // Travel signals
            "subject:(flight OR booking OR reservation OR \"uçuş\" OR \"rezervasyon\" OR itinerary OR \"e-ticket\") OR " +
            "from:(booking.com OR expedia.com OR airbnb.com OR turkishairlines.com OR pegasus OR emirates) OR " +
            // Finance signals
            "subject:(payment OR receipt OR invoice OR statement OR \"ödeme\" OR \"fatura\" OR \"dekont\" OR \"ekstre\") OR " +
            "from:(garantibbva.com.tr OR isbank.com.tr OR akbank.com OR paypal.com OR wise.com) OR " +
            // Shopping signals
            "subject:(order OR shipped OR delivered OR \"sipariş\" OR \"kargo\" OR \"teslim\") OR " +
            "from:(trendyol.com OR hepsiburada.com OR amazon.com OR n11.com) OR " +
            // Event signals
            "subject:(ticket OR concert OR event OR \"bilet\" OR \"konser\" OR \"etkinlik\" OR appointment) OR " +
            "from:(biletix.com OR ticketmaster.com OR eventbrite.com) OR " +
            // Subscription signals
            "subject:(subscription OR renewal OR billing OR \"abonelik\" OR \"yenileme\" OR membership) OR " +
            "from:(netflix.com OR spotify.com OR adobe.com OR microsoft.com)" +
            ") newer_than:1y";
    }
    
    /**
     * Checks if a sender domain matches any known category.
     * Returns the category name or null if unknown.
     */
    public static String detectCategoryBySender(String senderEmail) {
        if (senderEmail == null) return null;
        
        String domain = extractDomain(senderEmail);
        if (domain == null) return null;
        
        if (TRAVEL_SENDERS.stream().anyMatch(s -> domain.contains(s))) return "TRAVEL";
        if (FINANCE_SENDERS.stream().anyMatch(s -> domain.contains(s))) return "FINANCE";
        if (SHOPPING_SENDERS.stream().anyMatch(s -> domain.contains(s))) return "SHOPPING";
        if (EVENT_SENDERS.stream().anyMatch(s -> domain.contains(s))) return "EVENT";
        if (SUBSCRIPTION_SENDERS.stream().anyMatch(s -> domain.contains(s))) return "SUBSCRIPTION";
        
        return null;
    }
    
    private static String extractDomain(String email) {
        if (email == null) return null;
        int atIndex = email.lastIndexOf('@');
        if (atIndex < 0) {
            // Maybe it's already a domain or display name with domain
            if (email.contains(".")) {
                // Try to extract domain from display name like "Turkish Airlines <noreply@turkishairlines.com>"
                int ltIndex = email.indexOf('<');
                int gtIndex = email.indexOf('>');
                if (ltIndex >= 0 && gtIndex > ltIndex) {
                    return extractDomain(email.substring(ltIndex + 1, gtIndex));
                }
                return email.toLowerCase();
            }
            return null;
        }
        return email.substring(atIndex + 1).toLowerCase().replace(">", "");
    }
}
