"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";

/**
 * Get the correct API URL based on the current domain.
 */
function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'okanacer.xyz' || hostname.endsWith('.okanacer.xyz')) {
      return 'https://api.okanacer.xyz/api';
    }
  }
  return 'http://localhost:8080/api';
}

/**
 * Get the correct Dashboard URL based on the current domain.
 */
function getDashboardUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'okanacer.xyz' || hostname.endsWith('.okanacer.xyz')) {
      return 'https://okanacer.xyz';
    }
  }
  return 'http://localhost:3001';
}

export function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleGoogleLogin = () => {
    const apiUrl = getApiUrl();
    const dashboardUrl = getDashboardUrl();
    window.location.href = `${apiUrl}/auth/login/google?redirectUrl=${encodeURIComponent(dashboardUrl)}`;
  };

  const handleMicrosoftLogin = () => {
    const apiUrl = getApiUrl();
    const dashboardUrl = getDashboardUrl();
    window.location.href = `${apiUrl}/auth/login/microsoft?redirectUrl=${encodeURIComponent(dashboardUrl)}`;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-[#0c1844]">OLRIC</div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm text-gray-700 hover:text-[#0c1844] transition-colors">
                About
              </a>
              <a href="#pricing" className="text-sm text-gray-700 hover:text-[#0c1844] transition-colors">
                Pricing
              </a>
              <a href="#help" className="text-sm text-gray-400 hover:text-[#0c1844] transition-colors">
                Help
              </a>
              <a href="#blog" className="text-sm text-gray-700 hover:text-[#0c1844] transition-colors">
                Blog
              </a>
              <a href="#security" className="text-sm text-gray-700 hover:text-[#0c1844] transition-colors">
                Data Security
              </a>
              <a href="#contact" className="text-sm text-gray-400 hover:text-[#0c1844] transition-colors">
                Contact
              </a>
            </nav>

            {/* Language & CTA */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-700">
                <span>EN</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-400">TR</span>
              </div>

              <Button
                onClick={() => setShowLoginModal(true)}
                className="bg-[#0c1844] hover:bg-[#1e3a8a] text-white px-6 py-2.5 rounded-full transition-colors shadow-sm h-auto font-normal"
              >
                Start for free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h2>
              <p className="text-gray-500">Choose your email provider to continue</p>
            </div>

            {/* Login Options */}
            <div className="space-y-4">
              {/* Google */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-6 h-6"
                  alt="Google"
                />
                <span>Continue with Google</span>
              </button>

              {/* Microsoft */}
              <button
                onClick={handleMicrosoftLogin}
                className="w-full flex items-center justify-center gap-3 bg-[#2F2F2F] text-white px-6 py-4 rounded-xl font-medium hover:bg-[#1F1F1F] transition-all"
              >
                <svg className="w-6 h-6" viewBox="0 0 21 21" fill="none">
                  <rect x="0" y="0" width="10" height="10" fill="#F25022" />
                  <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
                  <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
                  <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
                </svg>
                <span>Continue with Microsoft</span>
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      )}
    </>
  );
}