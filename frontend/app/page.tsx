"use client"

import OpeningCurtain from "./components/home/OpeningCurtain";
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
    <>
      <OpeningCurtain />
      <HeroSection />
      <AboutPreview />
      <JourneySection />
      <Differentiators />
      <PersonalPathSection />
      <WorkplaceWellnessSection />
      <FAQSection />
      <Footer />
    </>
  );
}
