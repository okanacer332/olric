import { Sparkles, ArrowRight } from "lucide-react";
// Resim importlarını "placeholder" ile değiştirmeyi unutma demiştik, burayı senin son haline göre ayarladım.
const assistantsScreenshot = "https://placehold.co/800x500?text=Dashboard+Preview";

export function Hero() {

  const handleConnect = () => {
    // Direkt login'e git, maili Google soracak
    window.location.href = "http://localhost:8080/api/auth/login";
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Sol Kolon */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-8">
              <Sparkles className="size-4 text-[#0c1844]" />
              <span className="text-sm">
                <span className="font-bold text-[#0c1844]">Open Beta</span>
                <span className="text-gray-600"> · </span>
                <span className="text-gray-600">AI Gmail Assistants are live</span>
              </span>
            </div>

            <h1 className="text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900">AI-Powered</span>
              <br />
              <span className="text-[#0c1844]">Gmail</span>
              <br />
              <span className="text-[#0c1844]">Assistants</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
              Automatically organizing your digital life from your inbox.
              Track travel, manage finances, and subscriptions—all powered by AI.
            </p>

            {/* CTA Section - Sadece Buton */}
            <div className="flex flex-col items-start gap-4 max-w-lg">
              <button 
                onClick={handleConnect}
                className="group bg-[#0c1844] hover:bg-[#1e3a8a] text-white px-8 py-5 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer text-lg w-full md:w-auto"
              >
                <span className="font-bold">Connect Gmail & Start Free</span>
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-sm text-gray-500 pl-2">
                * No credit card required. AI automatically organizes your data.
              </p>
            </div>
          </div>

          {/* Sağ Kolon (Resim) */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl border-4 border-white overflow-hidden">
              <div className="aspect-[16/10] relative bg-gray-100 flex items-center justify-center">
                <img 
                  src={assistantsScreenshot}
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}