import { UserPlus, Mail, Sparkles, Check, ChevronRight, Link } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Kayıt Ol",
    description: "Ücretsiz hesap oluştur",
    detail: "Hızlı kayıt, kredi kartı gerekmez."
  },
  {
    number: 2,
    icon: Mail,
    title: "Mail Bağla",
    description: "Güvenli OAuth bağlantısı",
    detail: "Sadece okuma yetkisi ile güvenli bağlan."
  },
  {
    number: 3,
    icon: Sparkles,
    title: "AI ile Organize Et",
    description: "Otomatik düzenleme başlasın",
    detail: "AI asistanların hemen çalışmaya başlar."
  }
];

export function OnboardingStepper() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">3 Adımda Başla</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dakikalar içinde dijital hayatını organize et
          </p>
        </div>

        {/* Stepper */}
        <div className="max-w-5xl mx-auto">
          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step Card */}
                <div className="group bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-[#0c1844] transition-all hover:shadow-xl relative overflow-hidden">
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
    </section>
  );
}
