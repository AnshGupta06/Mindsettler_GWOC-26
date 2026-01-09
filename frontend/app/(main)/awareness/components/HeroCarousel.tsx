"use client";
import HeroStory from "./HeroStory";

export default function HeroCarousel() {
  return (
    <div className="pt-24 pb-8 sm:pb-12 px-4 sm:px-6 bg-[#F9F6FF]">
      <div className="max-w-[1440px] mx-auto">
        <HeroStory />
      </div>
    </div>
  );
}