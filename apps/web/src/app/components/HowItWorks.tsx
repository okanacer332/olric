import { Plane, CreditCard, ShoppingBag, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

const features = [
  {
    icon: Plane,
    title: "Travel Organizer",
    description: "Auto-detects flights, hotels, bookings",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: CreditCard,
    title: "Finance Tracker",
    description: "Smart expense tracking & insights",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    icon: ShoppingBag,
    title: "Shopping Assistant",
    description: "Track all your online orders",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Calendar,
    title: "Events Manager",
    description: "Never miss important events",
    color: "from-orange-500 to-orange-600"
  }
];

export function HowItWorks() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 100);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50">
      <div className="mx-auto px-8 md:px-16 lg:px-24 xl:px-48">
        {/* Compact Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">AI Assistants</h2>
          <p className="text-lg text-gray-600">
            Automatically organize your digital life
          </p>
        </div>

        {/* Swipeable Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-6 text-gray-700" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-6 text-gray-700" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[300px] snap-center"
              >
                <div className="group relative bg-white hover:bg-[#0c1844] rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden">
                  <div className={`bg-gradient-to-br ${feature.color} rounded-xl size-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="size-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-2 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 group-hover:text-gray-200 text-sm transition-colors">{feature.description}</p>

                  {/* Flying Icon on Hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <feature.icon className="size-8 text-white/30 animate-float-icon" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Hint */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">← Swipe to explore →</p>
          </div>
        </div>
      </div>
    </section>
  );
}