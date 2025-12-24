import { Sparkles, Download } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import assistantsScreenshot from "@/assets/2f8cebd62069fe0b22e2d1a12f90a8c37a050520.png";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 pt-32 pb-20 overflow-hidden">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="relative z-10">
            {/* Beta Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-4 py-2 mb-8">
              <Sparkles className="size-4 text-[#0c1844]" />
              <span className="text-sm">
                <span className="font-bold text-[#0c1844]">Open Beta</span>
                <span className="text-gray-600"> · </span>
                <span className="text-gray-600">AI Gmail Assistants are live</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900">AI-Powered</span>
              <br />
              <span className="text-[#0c1844]">Gmail</span>
              <br />
              <span className="text-[#0c1844]">Assistants</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
              Automatically organizing your digital life from your inbox.
              Track travel, manage finances, monitor shopping, organize events, and handle subscriptions—all powered by AI.
            </p>

            {/* CTA Button */}
            <button className="group bg-[#0c1844] hover:bg-[#1e3a8a] text-white px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-3">
              <span className="text-lg font-bold">Gmailini Bağla</span>
              <Download className="size-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl border-4 border-white overflow-hidden">
              <div className="aspect-[16/10] relative">
                <img 
                  src={assistantsScreenshot}
                  alt="VOYAGER AI-Powered Gmail Assistants"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
              <div className="text-sm text-gray-600 mb-1">AI Assistants</div>
              <div className="text-3xl font-bold text-[#0c1844]">5</div>
            </div>

            <div className="absolute -top-6 -right-6 bg-gradient-to-br from-[#0c1844] to-[#1e3a8a] rounded-2xl shadow-xl p-6">
              <div className="text-sm text-blue-200 mb-1">Auto-Organized</div>
              <div className="text-3xl font-bold text-white">100%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}