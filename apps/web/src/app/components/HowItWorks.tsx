import { Plane, CreditCard, ShoppingBag, Calendar, RotateCcw } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
const travelOrganizerScreenshot = "https://placehold.co/600x400?text=Travel+App";
const expenseTrackingScreenshot = "https://placehold.co/600x400?text=Expense+Tracking";
const assistantsScreenshot = "https://placehold.co/600x400?text=Assistants";


const features = [
  {
    icon: Plane,
    title: "Travel Organizer",
    description: "Automatically detects flights, hotels, and train bookings from your Gmail. See all upcoming trips, total value, and booking types in beautiful visualizations.",
    image: travelOrganizerScreenshot
  },
  {
    icon: CreditCard,
    title: "Finance Tracker",
    description: "Track all expenses extracted from Gmail receipts. AI categorizes transactions, analyzes spending patterns, and provides smart tips to save money.",
    image: expenseTrackingScreenshot
  },
  {
    icon: ShoppingBag,
    title: "Shopping Assistant",
    description: "Monitor all your online orders from Amazon, Zara, and other retailers. See what's in transit, delivered, and total spending at a glance.",
    image: assistantsScreenshot
  },
  {
    icon: Calendar,
    title: "Events Manager",
    description: "Never miss a concert, appointment, or important event. VOYAGER automatically extracts event details and sends timely reminders.",
    image: assistantsScreenshot
  },
  {
    icon: RotateCcw,
    title: "Subscriptions Tracker",
    description: "Keep track of all your recurring subscriptions like Netflix, Spotify, and software tools. Monitor monthly and yearly costs with trial expiration alerts.",
    image: assistantsScreenshot
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">5 AI Assistants Working for You</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            VOYAGER uses advanced AI to automatically scan your Gmail and organize everything that matters
          </p>
        </div>

        {/* Features */}
        <div className="space-y-16">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Feature Info */}
              <div className={`lg:w-1/3 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="bg-white rounded-2xl p-8 shadow-md border border-blue-100">
                  <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0c1844] rounded-xl size-14 flex items-center justify-center mb-6">
                    <feature.icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  <button className="bg-[#0c1844] hover:bg-[#1e3a8a] text-white px-6 py-3 rounded-full transition-colors">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Feature Image */}
              <div className={`lg:w-2/3 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="bg-white rounded-2xl shadow-2xl border-4 border-white overflow-hidden transform hover:scale-[1.02] transition-transform">
                  <div className="aspect-[16/9]">
                    <ImageWithFallback 
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}