import { Check, Zap, Crown, Gift } from "lucide-react";

const plans = [
  {
    name: "Ücretsiz",
    price: "₺0",
    period: "süresiz",
    icon: Gift,
    color: "from-gray-600 to-gray-700",
    features: [
      "1 AI Asistan (Seyahat Organizatörü)",
      "3 aya kadar geçmiş veriler",
      "Temel AI analizleri",
      "10 otomatik kategori",
      "Günlük Gmail senkronizasyonu"
    ],
    limitations: [
      "Finans Takipçisi kilitli",
      "Alışveriş Asistanı kilitli",
      "Etkinlik Yöneticisi kilitli",
      "Abonelik Takipçisi kilitli"
    ],
    cta: "Ücretsiz Başla",
    popular: false
  },
  {
    name: "Pro",
    price: "₺299",
    period: "aylık",
    icon: Zap,
    color: "from-[#0c1844] to-[#1e3a8a]",
    features: [
      "5 AI Asistanın Tümü 🎯",
      "Sınırsız geçmiş veriler",
      "Gelişmiş AI analizleri ve tahminler",
      "50+ otomatik kategori",
      "Gerçek zamanlı Gmail senkronizasyonu",
      "Özel raporlar ve grafikler",
      "Harcama uyarıları ve öneriler",
      "Öncelikli destek"
    ],
    limitations: [],
    cta: "Pro'ya Yükselt",
    popular: true
  },
  {
    name: "Lifetime",
    price: "₺1.499",
    period: "tek seferlik",
    icon: Crown,
    color: "from-amber-500 to-orange-600",
    features: [
      "Pro'nun tüm özellikleri ⭐",
      "Ömür boyu erişim",
      "Gelecekteki tüm güncellemeler",
      "Yeni asistanlar eklendiğinde otomatik erişim",
      "VIP destek kanalı",
      "Beta özelliklere erken erişim",
      "API erişimi (yakında)",
      "Kişisel onboarding desteği"
    ],
    limitations: [],
    cta: "Lifetime Al",
    popular: false,
    badge: "En İyi Değer"
  }
];

export function PricingUpsell() {
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tüm Asistanların Kilidini Aç
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ücretsiz planla başlayın veya Pro ile 5 AI asistanın tamamına anında erişim sağlayın
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl p-8 ${plan.popular
                ? 'shadow-2xl border-4 border-[#0c1844] scale-105'
                : 'shadow-lg border-2 border-gray-100'
                }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0c1844] to-[#1e3a8a] text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                  ⭐ En Popüler
                </div>
              )}

              {/* Lifetime Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                  👑 {plan.badge}
                </div>
              )}

              {/* Icon */}
              <div className={`bg-gradient-to-br ${plan.color} rounded-2xl size-16 flex items-center justify-center mb-6`}>
                <plan.icon className="size-8 text-white" />
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/ {plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-1 mt-0.5">
                      <Check className="size-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Limitations */}
              {plan.limitations.length > 0 && (
                <div className="mb-6 pt-6 border-t border-gray-200">
                  <div className="text-sm font-bold text-gray-500 mb-3">Kilitli Özellikler:</div>
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                        <div className="bg-gray-200 rounded-full p-0.5 mt-0.5">
                          <svg className="size-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <button
                className={`w-full py-4 rounded-full font-bold transition-all ${plan.popular
                  ? 'bg-gradient-to-r from-[#0c1844] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#0c1844] text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Note */}
        <div className="text-center">
          <div className="inline-block bg-white rounded-2xl px-8 py-6 shadow-lg border-2 border-gray-100 max-w-3xl">
            <h4 className="font-bold text-gray-900 mb-3 text-lg">Pro ile Neler Kazanırsınız?</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-1">✈️</div>
                <div className="font-bold text-[#0c1844]">Seyahat</div>
                <div className="text-gray-600 text-xs">Organizatörü</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-[#0c1844]">Finans</div>
                <div className="text-gray-600 text-xs">Takipçisi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🛍️</div>
                <div className="font-bold text-[#0c1844]">Alışveriş</div>
                <div className="text-gray-600 text-xs">Asistanı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">📅</div>
                <div className="font-bold text-[#0c1844]">Etkinlik</div>
                <div className="text-gray-600 text-xs">Yöneticisi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🔄</div>
                <div className="font-bold text-[#0c1844]">Abonelik</div>
                <div className="text-gray-600 text-xs">Takipçisi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
