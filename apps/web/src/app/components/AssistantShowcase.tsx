import React from 'react';
// Using the @ alias for cleaner paths and adding extensions
import travelOrganizerScreenshot from "@/assets/2121b57700922c934b7fca684f22bd173fb5412e.png";
import expenseTrackingScreenshot from '@/assets/3c5bf939bd58bf0edb8c9690226df392e3923399.png';

export function AssistantShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
        {/* Travel Organizer Section */}
        <div className="mb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-blue-100 text-[#0c1844] px-4 py-2 rounded-full mb-6">
                <span className="font-bold">✈️ Seyahat Organizatörü</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Tüm Rezervasyonlarınız Tek Yerde
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                VOYAGER uçuş, otel ve tren rezervasyonlarınızı Gmail'den otomatik olarak algılar.
                Yaklaşan seyahatlerinizi, toplam rezervasyon değerini ve rezervasyon türlerini güzel görselleştirmelerle görün.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-1">
                    <svg className="size-4 text-[#0c1844]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">Otomatik algılanan rezervasyonlar</span>
                    <span className="text-gray-600"> onay e-postalarından</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-1">
                    <svg className="size-4 text-[#0c1844]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">Rezervasyon türü dağılımı</span>
                    <span className="text-gray-600"> görsel pasta grafikleriyle</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-1">
                    <svg className="size-4 text-[#0c1844]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">Toplam seyahat değeri takibi</span>
                    <span className="text-gray-600"> tüm rezervasyonlarda</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-2xl">
                <img 
                  src={travelOrganizerScreenshot}
                  alt="Seyahat Organizatörü Paneli"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Finance Tracker Section */}
        <div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-cyan-100 to-teal-100 rounded-3xl p-8 shadow-2xl">
                <img 
                  src={expenseTrackingScreenshot}
                  alt="Harcama Takip Paneli"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block bg-teal-100 text-teal-900 px-4 py-2 rounded-full mb-6">
                <span className="font-bold">💰 Finans Takipçisi</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Gmail'den Akıllı Harcama Takibi
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                6 Gmail işleminden €1361.30 seyahat harcamasını takip edin. AI, harcamalarınızı otomatik olarak kategorize eder
                ve para biriktirmenize yardımcı olacak içgörüler sağlar.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-teal-100 rounded-full p-1 mt-1">
                    <svg className="size-4 text-teal-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">AI destekli kategorizasyon</span>
                    <span className="text-gray-600"> uçuşlar, oteller, yemek, aktiviteler için</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-teal-100 rounded-full p-1 mt-1">
                    <svg className="size-4 text-teal-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">Akıllı harcama içgörüleri</span>
                    <span className="text-gray-600"> "Konaklama en yüksek gideriniz" gibi</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-teal-100 rounded-full p-1 mt-1">
                    <svg className="size-4 text-teal-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">Para tasarrufu ipuçları</span>
                    <span className="text-gray-600"> harcama alışkanlıklarınıya göre</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}