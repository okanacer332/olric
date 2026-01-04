import { useState } from "react";
import { Monitor, Download, Shield, Zap, Mail, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import assistantsScreenshot from "@/assets/2f8cebd62069fe0b22e2d1a12f90a8c37a050520.png";

const features = [
  {
    icon: Mail,
    title: "E-posta Entegrasyonu",
    description: "E-postanıza güvenli, yalnızca okuma erişimi ile bağlanın. AI, ilgili bilgileri gerçek zamanlı olarak otomatik tarar ve çıkarır.",
    color: "from-blue-500 to-cyan-500",
    details: [
      "OAuth 2.0 güvenlik protokolü",
      "Otomatik e-posta tarama",
      "Gerçek zamanlı veri çıkarma",
      "Şifreli bağlantı"
    ]
  },
  {
    icon: TrendingUp,
    title: "AI Destekli İçgörüler",
    description: "Gerçek veri paternlerinize dayanarak akıllı öneriler alın ve para tasarrufu yapın.",
    color: "from-purple-500 to-pink-500",
    details: [
      "Harcama analizi ve tahminler",
      "Tasarruf önerileri",
      "Trend analizi",
      "Kişiselleştirilmiş raporlar"
    ]
  },
  {
    icon: Monitor,
    title: "Yerel Masaüstü Uygulaması",
    description: "Sorunsuz performans, çevrimdışı erişim ve kusursuz sistem entegrasyonu.",
    color: "from-indigo-500 to-blue-500",
    details: [
      "Native desktop performance",
      "Sistem tepsisi entegrasyonu",
      "Otomatik güncellemeler",
      "Cross-platform desteği"
    ]
  },
  {
    icon: Shield,
    title: "Güvenli & Özel",
    description: "Tüm veriler şifrelenmiş ve bilgisayarınızda yerel olarak saklanır.",
    color: "from-green-500 to-emerald-500",
    details: [
      "AES-256 şifreleme",
      "Yerel veri depolama",
      "Sıfır bulut yükleme",
      "Tam veri kontrolü"
    ]
  },
  {
    icon: Zap,
    title: "Yıldırım Hızında",
    description: "Anlık arama, gerçek zamanlı güncellemeler ve akıcı animasyonlar.",
    color: "from-yellow-500 to-orange-500",
    details: [
      "Milisaniye yanıt süresi",
      "Optimize edilmiş sorgular",
      "Smooth 60fps animasyonlar",
      "Lazy loading teknolojisi"
    ]
  },
  {
    icon: Download,
    title: "Çevrimdışı Çalışır",
    description: "İnternet olmadan bile organize edilmiş tüm verilerinize erişin.",
    color: "from-teal-500 to-cyan-500",
    details: [
      "Offline-first mimari",
      "Yerel veri önbelleği",
      "Otomatik senkronizasyon",
      "Conflict resolution"
    ]
  }
];

export function DesktopFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % features.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const activeFeature = features[activeIndex];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Güçlü Masaüstü Deneyimi</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Size en iyi e-posta organizasyon deneyimini sunmak için özel olarak masaüstü için tasarlandı
          </p>
        </div>

        {/* Main Swipeable Feature Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Feature Details with Accordion */}
            <div className="space-y-6">
              {/* Active Feature Header */}
              <div className="relative">
                <div className={`bg-gradient-to-r ${activeFeature.color} p-1 rounded-2xl`}>
                  <div className="bg-slate-900 rounded-2xl p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`bg-gradient-to-br ${activeFeature.color} rounded-xl size-16 flex items-center justify-center`}>
                        <activeFeature.icon className="size-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold">{activeFeature.title}</h3>
                        <p className="text-sm text-blue-200 mt-1">{activeIndex + 1} / {features.length}</p>
                      </div>
                    </div>
                    <p className="text-blue-100 leading-relaxed mb-6">
                      {activeFeature.description}
                    </p>

                    {/* Details List */}
                    <div className="space-y-3">
                      {activeFeature.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-white/5 rounded-lg p-3 backdrop-blur-sm transform transition-all hover:bg-white/10 hover:translate-x-1"
                        >
                          <div className={`size-2 rounded-full bg-gradient-to-r ${activeFeature.color}`}></div>
                          <span className="text-sm text-blue-50">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePrev}
                  className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-4 transition-all hover:scale-110 hover:border-white/40 active:scale-95"
                  aria-label="Previous feature"
                >
                  <ChevronLeft className="size-6 text-white group-hover:text-blue-200 transition-all group-hover:-translate-x-1" />
                </button>

                {/* Dots Indicator */}
                <div className="flex gap-2">
                  {features.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!isAnimating) {
                          setIsAnimating(true);
                          setActiveIndex(idx);
                          setTimeout(() => setIsAnimating(false), 300);
                        }
                      }}
                      className={`transition-all duration-300 rounded-full ${idx === activeIndex
                          ? 'w-8 h-3 bg-white'
                          : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                        }`}
                      aria-label={`Go to feature ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-4 transition-all hover:scale-110 hover:border-white/40 active:scale-95"
                  aria-label="Next feature"
                >
                  <ChevronRight className="size-6 text-white group-hover:text-blue-200 transition-all group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right: Desktop Screenshot */}
            <div className="relative">
              <div className="relative max-w-2xl mx-auto transform transition-all duration-500 hover:scale-105">
                <div className="bg-gray-800 rounded-t-2xl px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="size-3 rounded-full bg-red-500"></div>
                    <div className="size-3 rounded-full bg-yellow-500"></div>
                    <div className="size-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 text-center text-sm text-gray-400">OLRIC - AI Destekli E-posta Asistanları</div>
                </div>
                <div className="bg-white rounded-b-2xl shadow-2xl overflow-hidden">
                  <img
                    src={assistantsScreenshot}
                    alt="OLRIC Masaüstü Uygulaması"
                    className="w-full h-auto"
                  />
                </div>

                {/* Floating feature badge */}
                <div className={`absolute -top-4 -right-4 bg-gradient-to-r ${activeFeature.color} rounded-2xl shadow-2xl p-4 transform transition-all duration-500`}>
                  <activeFeature.icon className="size-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Availability */}
        <div className="text-center">
          <p className="text-lg text-blue-100 mb-6">Kullanılabilir platformlar:</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full border border-white/30 hover:bg-white/30 hover:scale-105 transition-all">
              <span className="font-bold">macOS</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full border border-white/30 hover:bg-white/30 hover:scale-105 transition-all">
              <span className="font-bold">Windows</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full border border-white/30 hover:bg-white/30 hover:scale-105 transition-all">
              <span className="font-bold">Linux</span>
            </div>
          </div>

          {/* Download CTA */}
          <button className="bg-white text-[#0c1844] hover:bg-gray-100 px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-2xl hover:scale-105">
            Mailini Bağla
          </button>
        </div>
      </div>
    </section>
  );
}