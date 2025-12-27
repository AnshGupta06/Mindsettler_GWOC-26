"use client";
import Link from "next/link";
import HeroCarousel from "./components/HeroCarousel";
import Image from "next/image";
import { awarenessAreas } from "./awarenessCardsData";
import { CharReveal, SlideUp, StaggerContainer, StaggerItem } from "../components/common/RevealComponent";

export default function AwarenessPage() {
  return (
      <main className="min-h-screen bg-white">
        <HeroCarousel />

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-white"></div>

          {/* Content */}
          <div className="relative max-w-6xl mx-auto px-6 py-8 text-center">
            <SlideUp>
              <div className="bg-[#f9f6ff] rounded-3xl shadow-xl p-12 md:p-16 border border-gray-100">
                <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                  <CharReveal delay={0.1} className="justify-center">
                    Understanding Your Mind
                  </CharReveal>
                  <CharReveal delay={0.2} className="justify-center">
                    Is the First Step Toward Healing
                  </CharReveal>
                </h1>

                <SlideUp delay={0.3}>
                  <p className="mt-6 text-lg text-gray-700 max-w-3xl mx-auto">
                    MindSettler is a psycho-education and mental well-being platform
                    that helps individuals understand their mental health and navigate
                    life’s challenges through awareness, guidance, and personalized
                    support in a safe and confidential environment.
                  </p>
                </SlideUp>

                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
                  <SlideUp delay={0.4}>
                    <button className="w-full sm:w-auto relative px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full bg-[#Dd1764] text-white font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/20 hover:-translate-y-1">
                      <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                      <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                      <span className="relative z-10">Explore Awareness</span>
                    </button>
                  </SlideUp>

                  <Link href="/services">
                    <SlideUp delay={0.5}>
                      <button className="w-full sm:w-auto relative px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full border-2 border-[#3F2965]/10 text-[#3F2965] font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:border-[#3F2965] hover:-translate-y-1">
                        <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                        <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                          Our Programs
                        </span>
                      </button>
                    </SlideUp>
                  </Link>
                </div>
              </div>
            </SlideUp>
          </div>
        </section>

        {/* Awareness Categories */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              <CharReveal delay={0.2} className="justify-center">
                Areas of Awareness
              </CharReveal>
            </h2>
            <SlideUp delay={0.3}>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Understanding what you’re experiencing is the first step toward clarity
                and healing. Explore common mental health concerns we support at
                MindSettler.
              </p>
            </SlideUp>
          </div>

          <StaggerContainer delay={0.4}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {awarenessAreas.map((item) => (
                <StaggerItem key={item.slug}>
                  <Link href={`/awareness/${item.slug}`}>
                    <div className="group bg-[#f9f6ff] rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-primary mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </section>
      </main>
  );
}