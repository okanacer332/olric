"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, CreditCard, Mail, Globe, BrainCircuit, Layers } from "lucide-react";

interface OnboardingModalProps {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Clint 2.0",
      icon: <span className="text-4xl">👋</span>,
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            We've evolved. Clint is no longer just a travel tracker.
          </p>
          <p>
            It is now your <strong>complete digital life assistant</strong>.
            We organize everything hidden in your emails—from flight tickets to Amazon orders, from concert tickets to Netflix subscriptions.
          </p>
          <p className="font-medium text-gray-800">
            One dashboard to rule them all.
          </p>
        </div>
      ),
      buttonText: "Let's Start",
    },
    {
      title: "1. What we scan?",
      icon: <Layers className="w-10 h-10 text-blue-600" />,
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            When you connect your Gmail, our advanced filters look for specific digital footprints:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">✈️ <strong>Travel:</strong> Flights, hotels, trains.</li>
            <li className="flex items-center gap-2">💰 <strong>Finance:</strong> Bank statements, receipts.</li>
            <li className="flex items-center gap-2">🛍️ <strong>Shopping:</strong> Orders, deliveries, cargo.</li>
            <li className="flex items-center gap-2">📅 <strong>Events:</strong> Concerts, appointments.</li>
            <li className="flex items-center gap-2">💳 <strong>Subscriptions:</strong> Recurring payments.</li>
          </ul>
        </div>
      ),
      buttonText: "Next: AI Power",
    },
    {
      title: "2. Powered by Gemini AI",
      icon: <BrainCircuit className="w-10 h-10 text-purple-600" />,
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            We use Google's <strong>Gemini 2.0 Flash</strong> model to understand the context of your emails.
          </p>
          <p>
            It doesn't just read; it understands. It knows the difference between a "Flight Confirmation" and a "Flight Offer" spam email.
          </p>
          <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg text-xs text-purple-800">
            🔒 Privacy First: We only process relevant emails. Your personal conversations are never touched.
          </div>
        </div>
      ),
      buttonText: "Next: Privacy & Setup",
    },
    {
      title: "3. Access & Security",
      icon: <ShieldCheck className="w-10 h-10 text-green-600" />,
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            To make this magic happen, we need <strong>read-only access</strong> to your Gmail.
          </p>
          <p>
            We have passed Google's strict security verification processes. We cannot send emails on your behalf, we can only organize what's already there.
          </p>
          <p className="text-sm font-semibold text-gray-800">
            15-Day Free Trial included.
          </p>
        </div>
      ),
      buttonText: "I'm ready, let's go",
    },
    // FİNAL ADIM
    {
      title: "Ready to organize your life?",
      icon: <Globe className="w-12 h-12 text-blue-600" />,
      content: (
        <div className="space-y-6 text-center">
          <p className="text-gray-600">
            Click below to connect your Gmail account and watch the AI organize your entire digital history in seconds.
          </p>
          <p className="text-sm font-semibold text-gray-500 bg-gray-100 py-2 px-4 rounded-full inline-block">
            It takes about 45 seconds to scan 1 year of data.
          </p>
        </div>
      ),
      buttonText: "Connect Gmail & Sync",
      isFinal: true,
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-8 pt-10 min-h-[420px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-6">
                <div className="mb-4 inline-block p-3 bg-gray-50 rounded-xl border border-gray-100">
                  {steps[step].icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {steps[step].title}
                </h2>
              </div>

              <div className="flex-1">
                {steps[step].content}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleNext}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                steps[step].isFinal
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              }`}
            >
              {steps[step].buttonText}
              {!steps[step].isFinal && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}