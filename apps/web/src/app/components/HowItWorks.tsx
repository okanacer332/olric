import { useState, useRef, useEffect } from "react";
import { Plane, CreditCard, ShoppingBag, Calendar, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import travelOrganizerScreenshot from "@/assets/2121b57700922c934b7fca684f22bd173fb5412e.png";
import expenseTrackingScreenshot from "@/assets/3c5bf939bd58bf0edb8c9690226df392e3923399.png";
import assistantsScreenshot from "@/assets/2f8cebd62069fe0b22e2d1a12f90a8c37a050520.png";

const features = [
  {
    icon: Plane,
    title: "Seyahat Organizatörü",
    description: "Uçuşlar, oteller ve tren rezervasyonlarını otomatik tespit eder. Yaklaşan tüm seyahatlerinizi, toplam değeri ve rezervasyon türlerini güzel görselleştirmelerle görün.",
    image: travelOrganizerScreenshot,
    color: "from-sky-500 to-blue-600",
    details: [
      "Uçuş, otel ve tren rezervasyonları",
      "Otomatik tarih ve konum çıkarma",
      "Toplam seyahat maliyeti takibi",
      "Rezervasyon hatırlatmaları"
    ]
  },
  {
    icon: CreditCard,
    title: "Finans Takipçisi",
    description: "E-posta makbuzlarından çıkarılan tüm harcamaları takip eder. AI, işlemleri kategorize eder, harcama alışkanlıklarını analiz eder ve para biriktirmeniz için akıllı öneriler sunar.",
    image: expenseTrackingScreenshot,
    color: "from-emerald-500 to-teal-600",
    details: [
      "Otomatik harcama kategorilendirme",
      "Aylık/yıllık harcama analizi",
      "Bütçe aşımı uyarıları",
      "Tasarruf önerileri"
    ]
  },
  {
    icon: ShoppingBag,
    title: "Alışveriş Asistanı",
    description: "Amazon, Zara ve diğer satıcılardan yaptığınız tüm online siparişleri izleyin. Yoldakileri, teslim edilenleri ve toplam harcamayı bir bakışta görün.",
    image: assistantsScreenshot,
    color: "from-pink-500 to-rose-600",
    details: [
      "Sipariş takibi (Amazon, Zara, vb.)",
      "Teslimat durumu güncellemeleri",
      "İade ve garanti takibi",
      "Toplam alışveriş harcaması"
    ]
  },
  {
    icon: Calendar,
    title: "Etkinlik Yöneticisi",
    description: "Hiçbir konser, randevu veya önemli etkinliği kaçırmayın. OLRIC, etkinlik detaylarını otomatik olarak tespit eder ve zamanında hatırlatmalar gönderir.",
    image: assistantsScreenshot,
    color: "from-purple-500 to-indigo-600",
    details: [
      "Konser ve etkinlik tespiti",
      "Randevu hatırlatmaları",
      "Bilet ve rezervasyon yönetimi",
      "Takvim entegrasyonu"
    ]
  },
  {
    icon: RotateCcw,
    title: "Abonelik Takipçisi",
    description: "Netflix, Spotify ve yazılım araçları gibi tüm tekrarlayan aboneliklerinizi takip edin. Aylık ve yıllık maliyetleri deneme süresi bitim uyarılarıyla izleyin.",
    image: assistantsScreenshot,
    color: "from-orange-500 to-amber-600",
    details: [
      "Abonelik tespit ve listeleme",
      "Aylık/yıllık maliyet hesaplama",
      "Deneme süresi bitim uyarıları",
      "İptal önerileri"
    ]
  }
];

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped left - next
      handleNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      // Swiped right - prev
      handlePrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeFeature = features[activeIndex];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Senin İçin Çalışan 5 AI Asistan</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            OLRIC, e-postalarınızı otomatik olarak taramak ve önemli her şeyi düzenlemek için gelişmiş AI kullanır
          </p>
        </div>

        {/* Mini Preview Thumbnails */}
        <div className="flex justify-center gap-3 mb-8 overflow-x-auto pb-4">
          {features.map((feature, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setActiveIndex(idx);
                  setTimeout(() => setIsAnimating(false), 300);
                }
              }}
              className={`group relative flex-shrink-0 transition-all duration-300 ${idx === activeIndex
                ? 'scale-100'
                : 'scale-90 opacity-60 hover:opacity-100 hover:scale-95'
                }`}
            >
              <div className={`relative w-24 h-20 rounded-xl overflow-hidden transition-all ${idx === activeIndex
                  ? 'border-3 border-[#0c1844]'
                  : 'border-2 border-gray-200 hover:border-gray-300'
                }`}>
                <div className="w-full h-full bg-white rounded-lg flex flex-col items-center justify-center p-2">
                  <feature.icon className={`size-6 mb-1 ${idx === activeIndex ? 'text-gray-900' : 'text-gray-500'}`} />
                  <span className={`text-[10px] font-medium text-center leading-tight ${idx === activeIndex ? 'text-gray-900' : 'text-gray-600'}`}>
                    {feature.title.split(' ')[0]}
                  </span>
                </div>
              </div>
              {idx === activeIndex && (
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`}></div>
              )}
            </button>
          ))}
        </div>

        {/* Main Swipeable Feature Section */}
        <div
          className="max-w-6xl mx-auto"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Screenshot with floating badge */}
            <div className="relative order-2 lg:order-1">
              <div className="relative transform transition-all duration-500 hover:scale-105">
                <div className="bg-white rounded-2xl shadow-2xl border-4 border-white overflow-hidden">
                  <div className="aspect-[16/9]">
                    <img
                      src={activeFeature.image}
                      alt={activeFeature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Floating feature badge */}
                <div className={`absolute -top-6 -left-6 bg-gradient-to-r ${activeFeature.color} rounded-2xl shadow-2xl p-5 transform transition-all duration-500`}>
                  <activeFeature.icon className="size-10 text-white" />
                </div>

                {/* Feature number badge */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full shadow-xl p-4 border-4 border-gray-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {activeIndex + 1}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">/ {features.length}</div>
                  </div>
                </div>
              </div>

              {/* Swipe hint */}
              <div className="text-center mt-4 lg:hidden">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <ChevronLeft className="size-4" />
                  Kaydırarak geçiş yapın
                  <ChevronRight className="size-4" />
                </p>
              </div>
            </div>

            {/* Right: Feature Details with Accordion */}
            <div className="space-y-6 order-1 lg:order-2">
              {/* Active Feature Header */}
              <div className="relative">
                <div className={`bg-gradient-to-r ${activeFeature.color} p-1 rounded-2xl`}>
                  <div className="bg-white rounded-2xl p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`bg-gradient-to-br ${activeFeature.color} rounded-xl size-16 flex items-center justify-center`}>
                        <activeFeature.icon className="size-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900">{activeFeature.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">AI Asistan #{activeIndex + 1}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {activeFeature.description}
                    </p>

                    {/* Details List */}
                    <div className="space-y-3">
                      {activeFeature.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 transform transition-all hover:bg-gray-100 hover:translate-x-1"
                        >
                          <div className={`size-2 rounded-full bg-gradient-to-r ${activeFeature.color}`}></div>
                          <span className="text-sm text-gray-700">{detail}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button className={`mt-6 w-full bg-gradient-to-r ${activeFeature.color} hover:opacity-90 text-white px-6 py-3 rounded-full transition-all hover:scale-105 shadow-md hover:shadow-lg font-medium`}>
                      Daha Fazla Bilgi
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePrev}
                  className="group bg-white hover:bg-gray-50 backdrop-blur-sm border-2 border-gray-200 rounded-full p-4 transition-all hover:scale-110 hover:border-blue-400 active:scale-95 shadow-md"
                  aria-label="Previous assistant"
                >
                  <ChevronLeft className="size-6 text-gray-700 group-hover:text-blue-600 transition-all group-hover:-translate-x-1" />
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
                        ? 'w-8 h-3 bg-gradient-to-r from-blue-600 to-indigo-600'
                        : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                        }`}
                      aria-label={`Go to assistant ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="group bg-white hover:bg-gray-50 backdrop-blur-sm border-2 border-gray-200 rounded-full p-4 transition-all hover:scale-110 hover:border-blue-400 active:scale-95 shadow-md"
                  aria-label="Next assistant"
                >
                  <ChevronRight className="size-6 text-gray-700 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}