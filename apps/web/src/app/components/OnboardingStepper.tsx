import { UserPlus, Mail, Sparkles, Check } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Kayıt Ol",
    description: "Ücretsiz hesabınızı oluşturun",
    detail: "Email ve şifre ile hızlıca kaydolun. Kredi kartı gerekmez."
  },
  {
    number: 2,
    icon: Mail,
    title: "E-postanı Bağla",
    description: "Güvenli OAuth ile bağlan",
    detail: "E-posta hesabını sadece okuma yetkisi ile güvenli şekilde bağla."
  },
  {
    number: 3,
    icon: Sparkles,
    title: "AI Analizi Gör",
    description: "Organize edilmiş verilerinizi görün",
    detail: "AI asistanlarınız otomatik olarak tüm bilgilerinizi organize edecek."
  }
];

export function OnboardingStepper() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">3 Adımda Başla</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dakikalar içinde OLRIC'i kullanmaya başlayın ve dijital hayatınızı organize edin
          </p>
        </div>

        {/* Stepper */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-gray-200 hidden lg:block">
              <div className="h-full bg-gradient-to-r from-[#0c1844] via-[#1e3a8a] to-teal-500 w-2/3"></div>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-[#0c1844] transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
                    {/* Icon Circle */}
                    <div className="relative mb-6">
                      <div className="size-20 mx-auto bg-gradient-to-br from-[#0c1844] to-[#1e3a8a] rounded-full flex items-center justify-center relative">
                        <step.icon className="size-10 text-white" />
                        {/* Step Number Badge */}
                        <div className="absolute -top-2 -right-2 bg-teal-500 text-white rounded-full size-8 flex items-center justify-center font-bold border-4 border-white">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#0c1844] font-bold mb-3 text-center">
                      {step.description}
                    </p>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {step.detail}
                    </p>
                  </div>

                  {/* Arrow (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-20 -right-8 text-gray-300">
                      <svg className="size-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <button className="group bg-gradient-to-r from-[#0c1844] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#0c1844] text-white px-12 py-5 rounded-full transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto text-lg">
              <span className="font-bold">Mailini Bağla</span>
              <Mail className="size-6 group-hover:rotate-12 transition-transform" />
            </button>
            <p className="text-sm text-gray-500 mt-4">Kredi kartı gerekmez • 2 dakikada kurulum</p>
          </div>
        </div>
      </div>
    </section>
  );
}
