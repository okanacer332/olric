import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "OLRIC e-postama nasıl erişir?",
    answer: "OLRIC, e-postalarınızı ilgili bilgiler için taramak amacıyla yalnızca okuma erişimi ile güvenli OAuth kimlik doğrulaması kullanır. E-posta içeriğini asla saklamayız - yalnızca çıkarılan veriler (rezervasyonlar, harcamalar, siparişler, etkinlikler, abonelikler) bilgisayarınızda yerel olarak kaydedilir."
  },
  {
    question: "OLRIC hangi tür bilgileri tespit edebilir?",
    answer: "OLRIC otomatik olarak şunları tespit eder: seyahat rezervasyonları (uçuşlar, oteller, trenler), makbuzlar ve harcamalar, online alışveriş siparişleri, etkinlik biletleri ve randevular, ve tekrarlayan abonelikler. Havayolları, booking.com, Amazon ve daha fazlası gibi büyük sağlayıcıları destekler."
  },
  {
    question: "Verilerim OLRIC ile güvende mi?",
    answer: "Kesinlikle. Tüm verileriniz şifrelenir ve bilgisayarınızda yerel olarak saklanır. Banka düzeyinde şifreleme (AES-256) kullanırız, kişisel bilgilerinizi asla bulut sunucularına yüklemeyiz ve verileriniz üzerinde tam kontrole sahipsiniz."
  },
  {
    question: "Hangi AI asistanları dahil?",
    answer: "OLRIC 5 AI asistan içerir: Seyahat Organizatörü (rezervasyonlar & geziler), Finans Takipçisi (harcamalar & bütçeler), Alışveriş Asistanı (sipari şler & teslimatlar), Etkinlik Yöneticisi (randevular & konserler), ve Abonelik Takipçisi (tekrarlayan ödemeler)."
  },
  {
    question: "OLRIC çevrimdışı çalışır mı?",
    answer: "Evet, OLRIC tamamen çevrimdışı çalışan bir masaüstü uygulamasıdır. Organize edilmiş tüm verilerinizi internet bağlantısı olmadan görüntüleyebilirsiniz. E-posta senkronizasyonu internet gerektirir ancak arka planda otomatik olarak gerçekleşir."
  },
  {
    question: "OLRIC'ın maliyeti nedir?",
    answer: "Temel özelliklerle ücretsiz bir plan, sınırsız takip için tüm 5 asistana gelişmiş analizlerle erişim sağlayan aylık ₺299 Pro plan ve tek seferlik ₺1.499 ödeme ile Lifetime lisansı sunuyoruz."
  },
  {
    question: "OLRIC hangi platformları destekler?",
    answer: "OLRIC, macOS (10.14+), Windows (10/11) ve Linux (Ubuntu 18.04+) için yerel masaüstü uygulaması olarak kullanılabilir. Tüm platformlar aynı özellikleri ve güncellemeleri alır."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 via-slate-800 to-teal-900">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Sık Sorulan Sorular</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            OLRIC hakkında bilmeniz gereken her şey
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:bg-white/15 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <h3 className="text-xl font-bold text-white pr-4">{faq.question}</h3>
                <ChevronDown
                  className={`size-6 text-white flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                    }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-blue-100 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}