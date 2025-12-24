import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How does VOYAGER access my Gmail?",
    answer: "VOYAGER uses secure OAuth authentication with read-only access to scan your emails for relevant information. We never store email content - only extracted data (bookings, expenses, orders, events, subscriptions) is saved locally on your computer."
  },
  {
    question: "What types of information can VOYAGER detect?",
    answer: "VOYAGER automatically detects: travel bookings (flights, hotels, trains), receipts and expenses, online shopping orders, event tickets and appointments, and recurring subscriptions. It supports major providers like airlines, booking.com, Amazon, and more."
  },
  {
    question: "Is my data safe with VOYAGER?",
    answer: "Absolutely. All your data is encrypted and stored locally on your computer. We use bank-level encryption (AES-256), never upload your personal information to cloud servers, and you maintain complete control over your data."
  },
  {
    question: "Which AI assistants are included?",
    answer: "VOYAGER includes 5 AI assistants: Travel Organizer (bookings & trips), Finance Tracker (expenses & budgets), Shopping Assistant (orders & deliveries), Events Manager (appointments & concerts), and Subscriptions Tracker (recurring payments)."
  },
  {
    question: "Does VOYAGER work offline?",
    answer: "Yes, VOYAGER is a desktop app that works completely offline. You can view all your organized data without an internet connection. Gmail syncing requires internet but happens automatically in the background."
  },
  {
    question: "How much does VOYAGER cost?",
    answer: "We offer a free plan with basic features, a Pro plan at $9.99/month for unlimited tracking across all 5 assistants with advanced analytics, and a Lifetime license at $49.99 one-time payment."
  },
  {
    question: "What platforms does VOYAGER support?",
    answer: "VOYAGER is available as a native desktop application for macOS (10.14+), Windows (10/11), and Linux (Ubuntu 18.04+). All platforms receive the same features and updates."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 via-slate-800 to-teal-900">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Everything you need to know about VOYAGER
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:bg-white/15 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <h3 className="text-xl font-bold text-white pr-4">{faq.question}</h3>
                <ChevronDown
                  className={`size-6 text-white flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-blue-100 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}