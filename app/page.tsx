import { About } from "@/components/About";
import { BotFeatures } from "@/components/BotFeatures";
import { Contact } from "@/components/Contact";
import { CtaBanner } from "@/components/CtaBanner";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { Pricing } from "@/components/Pricing";
import { StatsBar } from "@/components/StatsBar";
import { Technology } from "@/components/Technology";
import { Testimonials } from "@/components/Testimonials";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--bg-primary)]">
        <Hero />
        <StatsBar />
        <About />
        <HowItWorks />
        <BotFeatures />
        <Technology />
        <Pricing />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
        <Newsletter />
        <Contact />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
