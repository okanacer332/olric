import { UserPlus, Mail, Sparkles, Check, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Kayıt Ol",
    description: "Ücretsiz hesabınızı oluşturun",
    detail: "Email ve şifre ile hızlıca kaydolun. Kredi kartı gerekmez.",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-500",
    cta: "Hesap Oluştur",
    time: "30 saniye"
  },
  {
    number: 2,
    icon: Mail,
    title: "E-postanı Bağla",
    description: "Güvenli OAuth ile bağlan",
    detail: "E-posta hesabını sadece okuma yetkisi ile güvenli şekilde bağla.",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    borderColor: "border-indigo-500",
    cta: "E-posta Bağla",
    time: "1 dakika"
  },
  {
    number: 3,
    icon: Sparkles,
    title: "AI Analizi Gör",
    description: "Organize edilmiş verilerinizi görün",
    detail: "AI asistanlarınız otomatik olarak tüm bilgilerinizi organize edecek.",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-500",
    cta: "Başla",
    time: "Anında"
  }
];

export function OnboardingStepper() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>
      </div>

      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Hızlı & Kolay Kurulum
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">3 Adımda Başla</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dakikalar içinde OLRIC'i kullanmaya başlayın ve dijital hayatınızı organize edin
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Check className="size-4 text-emerald-500" />
              <span>Toplam 2 dakika</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Check className="size-4 text-emerald-500" />
              <span>Kredi kartı yok</span>
            </div>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden lg:block relative mb-8">
            {/* Connection Line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-gray-200">
              <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 w-full"></div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-3 gap-8 relative">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-300 transition-all hover:shadow-xl overflow-hidden group">
                    {/* Color Bar */}
                    <div className={`h-2 ${step.color}`}></div>

                    <div className="p-6">
                      {/* Icon with Number */}
                      <div className="relative mb-4">
                        <div className={`size-16 mx-auto ${step.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                          <step.icon className="size-8 text-white" />
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border-3 border-gray-200 rounded-full size-10 flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-900">{step.number}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center mt-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-xs font-semibold text-gray-500 mb-2">
                          {step.description}
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-3 text-sm">
                          {step.detail}
                        </p>

                        {/* Time Badge */}
                        <div className={`inline-flex items-center gap-2 ${step.lightColor} px-3 py-1.5 rounded-full`}>
                          <svg className="size-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700">{step.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Vertical Timeline */}
          <div className="lg:hidden space-y-6 mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connection Line (except last) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-10 top-24 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-gray-100"></div>
                )}

                <div className="flex gap-4">
                  {/* Left: Icon & Number */}
                  <div className="flex-shrink-0 relative">
                    <div className={`size-16 ${step.color} rounded-2xl flex items-center justify-center`}>
                      <step.icon className="size-8 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white border-3 border-gray-200 rounded-full size-8 flex items-center justify-center">
                      <span className="text-base font-bold text-gray-900">{step.number}</span>
                    </div>
                  </div>

                  {/* Right: Content Card */}
                  <div className="flex-1">
                    <div className="bg-white rounded-xl border-2 border-gray-100 p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        {step.description}
                      </p>
                      <p className="text-gray-600 leading-relaxed mb-3 text-sm">
                        {step.detail}
                      </p>

                      <div className={`inline-flex items-center gap-2 ${step.lightColor} px-3 py-1.5 rounded-full`}>
                        <svg className="size-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-medium text-gray-700">{step.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Below Cards */}
          <div className="flex justify-center">
            <div className="text-center max-w-sm">
              <button className="group w-full bg-gradient-to-r from-[#0c1844] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#0c1844] text-white px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-base font-bold mb-3">
                <Mail className="size-5" />
                <span>Mailini Bağla</span>
              </button>
              <p className="text-xs text-gray-500">
                <Check className="size-3 inline text-emerald-500" /> Kredi kartı yok •
                <Check className="size-3 inline text-emerald-500" /> 2 dakika kurulum
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
