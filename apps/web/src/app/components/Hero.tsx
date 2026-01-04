import { Sparkles, Download } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import assistantsScreenshot from "@/assets/2f8cebd62069fe0b22e2d1a12f90a8c37a050520.png";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-12 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
      </div>
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="relative z-10">
            {/* Beta Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-8">
              <Sparkles className="size-4 text-[#0c1844]" />
              <span className="text-sm">
                <span className="font-bold text-[#0c1844]">Açık Beta</span>
                <span className="text-gray-600"> · </span>
                <span className="text-gray-600">AI E-posta Asistanları Aktif</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              <span className="text-gray-900">AI Destekli</span>
              <br />
              <span className="text-[#0c1844]">E-posta</span>
              <br />
              <span className="text-[#0c1844]">Asistanları</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
              Gelen kutunuzdan dijital hayatınızı otomatik olarak düzenleyin.
              Seyahatleri takip edin, finansları yönetin, alışverişleri izleyin, etkinlikleri organize edin ve abonelikleri kontrol edin—hepsi AI ile.
            </p>

            {/* CTA Button */}
            <button className="group bg-[#0c1844] hover:bg-[#1e3a8a] text-white px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-2xl hover:scale-105 flex items-center gap-3">
              <span className="text-lg font-bold">Mailini Bağla</span>
              <Download className="size-5 group-hover:translate-y-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-500 mt-4">Ücretsiz başla • Kredi kartı gerekmez</p>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-white overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
              <div className="aspect-[16/10] relative">
                <img
                  src={assistantsScreenshot}
                  alt="OLRIC AI Destekli E-posta Asistanları"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
              <div className="text-sm text-gray-600 mb-1">AI Asistan</div>
              <div className="text-3xl font-bold text-[#0c1844]">5</div>
            </div>

            <div className="absolute -top-6 -right-6 bg-gradient-to-br from-[#0c1844] to-[#1e3a8a] rounded-2xl shadow-xl p-6">
              <div className="text-sm text-blue-200 mb-1">Otomatik Organize</div>
              <div className="text-3xl font-bold text-white">100%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}