"use client"

import HeroSection from "./components/home/HeroSection";
import AboutPreview from "./components/home/AboutPreview";
import JourneySection from "./components/home/JourneySection";
import Differentiators from "./components/home/Differentiators";
import PersonalPathSection from "./components/home/PersonalPath";
import WorkplaceWellnessSection from "./components/home/Workplace";
import Footer from "./components/common/Footer";
import FAQSection from "./components/home/FAQSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f3ecff] via-[#ffeaf5] to-[#f7f0ff]">
      <HeroSection />
      <AboutPreview />
      <JourneySection />
      <Differentiators />
      <PersonalPathSection />
      <WorkplaceWellnessSection />
      <FAQSection />
    </main>
  );
}
