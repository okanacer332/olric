import { Sparkles, Plug, FileText, Plane, Tv, Laptop } from "lucide-react";
import dashboardImg from "@/assets/dashboard-overview.png";

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
                <span className="font-bold text-[#0c1844]">AI Insights</span>
                <span className="text-gray-600"> · </span>
                <span className="text-gray-600">Your inbox, automatically organized</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900">AI-Powered</span>
              <br />
              <span className="text-[#0c1844]">Mail</span>
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
              <span className="text-lg font-bold">Mailini Bağla</span>
              <Plug className="size-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative">
            <div className="relative overflow-hidden">
              <img
                src={dashboardImg}
                alt="Olric Dashboard - Financial Overview"
                className="w-full h-auto"
              />
            </div>

            {/* Animated Message Cards - Invoice */}
            <div className="absolute top-1/4 -right-12 animate-float-down-1">
              <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-green-100 flex items-center gap-3 hover:shadow-xl transition-shadow">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FileText className="size-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Invoice Detected</div>
                  <div className="text-sm font-bold text-gray-900">$1,245.00</div>
                </div>
              </div>
            </div>

            {/* Animated Message Cards - Flight Ticket */}
            <div className="absolute top-2/3 -right-16 animate-float-down-2">
              <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-purple-100 flex items-center gap-3 hover:shadow-xl transition-shadow">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Plane className="size-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Flight Booked</div>
                  <div className="text-sm font-bold text-gray-900">NYC → LAX</div>
                </div>
              </div>
            </div>

            {/* Animated Message Cards - Netflix Subscription (Left Side) */}
            <div className="absolute top-1/3 -left-12 animate-float-down-3">
              <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-red-100 flex items-center gap-3 hover:shadow-xl transition-shadow">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Tv className="size-5 text-red-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Netflix</div>
                  <div className="text-sm font-bold text-gray-900">$15.99/mo</div>
                </div>
              </div>
            </div>

            {/* Animated Message Cards - Tech Shopping (Left Side) */}
            <div className="absolute top-3/5 -left-16 animate-float-down-4">
              <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-blue-100 flex items-center gap-3 hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Laptop className="size-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Tech Purchase</div>
                  <div className="text-sm font-bold text-gray-900">MacBook Pro</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}