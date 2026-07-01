import { About } from "@/components/About";
import { BotFeatures } from "@/components/BotFeatures";
import { Contact } from "@/components/Contact";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { StatsBar } from "@/components/StatsBar";
import { Testimonials } from "@/components/Testimonials";
import { WhyChooseATC } from "@/components/WhyChooseATC";

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
        <WhyChooseATC />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
