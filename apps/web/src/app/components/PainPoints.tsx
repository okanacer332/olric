import { CircleCheck } from "lucide-react";

const painPoints = [
  {
    problem: "Tired of digging through hundreds of emails to find travel bookings, receipts, or subscription details?",
    solution: "VOYAGER's AI automatically scans your Gmail inbox and extracts all relevant information—flights, expenses, orders, events, and subscriptions—organizing everything in one beautiful dashboard."
  },
  {
    problem: "Losing track of monthly subscriptions and wondering where your money goes each month?",
    solution: "Get instant visibility into all your recurring costs across software, streaming services, and more. See monthly and yearly totals, plus get alerts when free trials are ending."
  },
  {
    problem: "Missing important events or forgetting about upcoming travel bookings?",
    solution: "All your events, appointments, and travel plans are automatically organized with smart reminders. See everything in one place with beautiful charts showing booking types and spending patterns."
  }
];

export function PainPoints() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Sound familiar?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We understand the chaos of managing your digital life. Here's how VOYAGER solves it.
          </p>
        </div>

        {/* Pain Points */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {painPoints.map((point, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl hover:bg-white/15 transition-colors">
              <div className="flex items-start gap-4">
                <CircleCheck className="size-6 text-green-300 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg font-semibold mb-3 text-white">{point.problem}</p>
                  <p className="text-blue-100 leading-relaxed">{point.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-white text-[#0c1844] hover:bg-gray-100 px-8 py-4 rounded-full font-bold transition-colors shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}