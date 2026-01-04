import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { OnboardingStepper } from "./components/OnboardingStepper";
import { AssistantShowcase } from "./components/AssistantShowcase";
import { PainPoints } from "./components/PainPoints";
import { PricingUpsell } from "./components/PricingUpsell";
import { DesktopFeatures } from "./components/DesktopFeatures";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { Chatbot } from "./components/Chatbot";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <OnboardingStepper />
        <HowItWorks />
        <AssistantShowcase />
        <PainPoints />
        <PricingUpsell />
        <DesktopFeatures />
        <FAQ />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}