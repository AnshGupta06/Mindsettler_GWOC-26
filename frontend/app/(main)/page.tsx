"use client";

import HeroSection from "./components/home/HeroSection";
import AboutPreview from "./components/home/AboutPreview";
import JourneySection from "./components/home/JourneySection";
import Differentiators from "./components/home/Differentiators";
import PersonalPathSection from "./components/home/PersonalPath";
import WorkplaceWellnessSection from "./components/home/Workplace";
import HowItWorks from "./components/home/HowItWorks";
import FAQSection from "./components/home/FAQSection";
import SectionDivider from "./components/common/SectionDivider"; // Import the new divider

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-[#F9F6FF]"> {/* Ensure global bg matches */}
        
        <HeroSection />
        
        <SectionDivider /> {/* Aesthetic Break */}
        
        <AboutPreview />
        
        <SectionDivider />
        
        <HowItWorks />
        
        <SectionDivider />
        
        <JourneySection />
        
        <SectionDivider />
        
        <Differentiators />
        
        <SectionDivider />
        
        <PersonalPathSection />
        
        <SectionDivider />
        
        <WorkplaceWellnessSection />
        
        <SectionDivider />
        
        <FAQSection />
        
      </main>
    </>
  );
}