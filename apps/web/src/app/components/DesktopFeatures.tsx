import { Monitor, Download, Shield, Zap, Mail, TrendingUp } from "lucide-react";
import assistantsScreenshot from "@/assets/2f8cebd62069fe0b22e2d1a12f90a8c37a050520.png";

export function DesktopFeatures() {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Powerful Desktop Experience</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Built specifically for desktop to give you the best Gmail organization experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* Desktop Screenshot */}
          <div className="lg:col-span-3 flex justify-center mb-8">
            <div className="relative max-w-5xl w-full">
              <div className="bg-gray-800 rounded-t-2xl px-4 py-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-red-500"></div>
                  <div className="size-3 rounded-full bg-yellow-500"></div>
                  <div className="size-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center text-sm text-gray-400">VOYAGER - AI-Powered Gmail Assistants</div>
              </div>
              <div className="bg-white rounded-b-2xl shadow-2xl overflow-hidden">
                <img
                  src={assistantsScreenshot}
                  alt="VOYAGER Desktop Application"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0c1844] rounded-xl size-14 flex items-center justify-center mb-6">
              <Mail className="size-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Gmail Integration</h3>
            <p className="text-blue-100 leading-relaxed">
              Secure read-only access to your Gmail. AI automatically scans and extracts relevant information in real-time.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0c1844] rounded-xl size-14 flex items-center justify-center mb-6">
              <TrendingUp className="size-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">AI-Powered Insights</h3>
            <p className="text-blue-100 leading-relaxed">
              Get smart tips like "Book flights 6-8 weeks in advance to save 25%" based on your actual data patterns.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0c1844] rounded-xl size-14 flex items-center justify-center mb-6">
              <Monitor className="size-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Native Desktop App</h3>
            <p className="text-blue-100 leading-relaxed">
              Built with native desktop technologies for smooth performance, offline access, and seamless system integration.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0c1844] rounded-xl size-14 flex items-center justify-center mb-6">
              <Shield className="size-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Secure & Private</h3>
            <p className="text-blue-100 leading-relaxed">
              All data encrypted and stored locally on your computer. We never access or upload your personal information.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0c1844] rounded-xl size-14 flex items-center justify-center mb-6">
              <Zap className="size-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-blue-100 leading-relaxed">
              Optimized for speed with instant search, real-time updates, and smooth animations. No lag, no waiting.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0c1844] rounded-xl size-14 flex items-center justify-center mb-6">
              <Download className="size-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Works Offline</h3>
            <p className="text-blue-100 leading-relaxed">
              Access all your organized data even without internet. Sync automatically when you're back online.
            </p>
          </div>
        </div>

        {/* Platform Availability */}
        <div className="text-center">
          <p className="text-lg text-blue-100 mb-6">Available for:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full border border-white/30">
              <span className="font-bold">macOS</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full border border-white/30">
              <span className="font-bold">Windows</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full border border-white/30">
              <span className="font-bold">Linux</span>
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <div className="text-center mt-12">
          <button className="bg-white text-[#0c1844] hover:bg-gray-100 px-8 py-4 rounded-full font-bold transition-colors shadow-lg">
            Mailini Bağla
          </button>
        </div>
      </div>
    </section>
  );
}