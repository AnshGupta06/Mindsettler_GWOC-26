"use client"

import OpeningCurtain from "./components/home/OpeningCurtain";
import HeroSection from "./components/home/HeroSection";
import AboutPreview from "./components/home/AboutPreview";
import JourneySection from "./components/home/JourneySection";
import Differentiators from "./components/home/Differentiators";
import Footer from "./components/common/Footer";

export default function HomePage() {
  return (
    <>
      <OpeningCurtain />
      <HeroSection />
      <AboutPreview />
      <JourneySection />
      <Differentiators />
      <Footer />
    </>
  );
}
