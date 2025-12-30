import Image from "next/image";
import Link from "next/link";
import { awarenessContent } from "./awarenessData";
import { CharReveal, SlideUp, StaggerContainer, StaggerItem, ImageWipeReveal } from "../../components/common/RevealComponent";
import { AlertTriangle } from "lucide-react";

interface AwarenessPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all awareness pages at build time
export async function generateStaticParams() {
  return Object.keys(awarenessContent).map((slug) => ({
    slug: slug,
  }));
}

export default async function AwarenessDetailPage({
  params,
}: AwarenessPageProps) {
  const { slug } = await params;
  const content = awarenessContent[slug as keyof typeof awarenessContent];

  // Fallback if slug doesn't match
  if (!content) {
    return (
      <main className="min-h-screen bg-lightBg px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Page Not Found</h1>
          <p className="text-gray-600">The requested awareness page could not be found.</p>
        </div>
      </main>
    );
  }

  return (
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-white"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              {/* Image */}
              {/* Image */}
              <ImageWipeReveal>
                <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={content.heroImage}
                    alt={content.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </ImageWipeReveal>

              {/* Content */}
              <div className="space-y-1">
                <SlideUp delay={0.1}>
                  <div className="inline-flex items-center gap-2 px-4 py-4 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/80 shadow-sm text-[#Dd1764] font-bold text-xs sm:text-sm tracking-wide mb-40 sm:mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#Dd1764]" />
                    {content.category}
                  </div>
                </SlideUp>

                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
                  <CharReveal delay={0.2}>
                    {`Understanding`}
                  </CharReveal>
                  <CharReveal delay={0.5}>
                    {`${content.title}`}
                  </CharReveal>
                </div>

                <SlideUp delay={0.3}>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {content.intro}
                  </p>
                </SlideUp>

                <StaggerContainer delay={0.4}>
                  <div className="flex flex-wrap gap-4 pt-4">
                    {content.keyPoints.map((point, idx) => (
                      <StaggerItem key={idx}>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-accent"></div>
                          <span className="text-sm font-medium text-gray-700">{point}</span>
                        </div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
          {/* What is Section */}
          <SlideUp>
            <section className="relative bg-[#f9f6ff] rounded-3xl p-8 md:p-14 shadow-xl overflow-hidden">

              {/* Header */}
              <div className="relative flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                  <span className="text-white text-xl font-bold">?</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                  <CharReveal delay={0.05} className="justify-center">
                    {`What is ${content.title}?`}
                  </CharReveal>
                </h2>
              </div>

              {/* Content */}
              <div className="relative max-w-4xl">
                <SlideUp delay={0.1}>
                  <p className="text-gray-700 leading-relaxed text-lg md:text-xl mb-5">
                    {content.whatIs}
                  </p>
                </SlideUp>

                {content.whatIsExtended && (
                  <SlideUp delay={0.2}>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                      {content.whatIsExtended}
                    </p>
                  </SlideUp>
                )}
              </div>

            </section>
          </SlideUp>


          {/* Symptoms Section */}
          <SlideUp>
            <section className="relative bg-[#f9f6ff] rounded-3xl p-8 md:p-14 overflow-hidden">


              {/* Heading */}
              <h2 className="relative text-3xl md:text-4xl font-bold text-primary mb-10 text-center">
                <CharReveal delay={0.1} className="justify-center">
                  Common Signs & Symptoms
                </CharReveal>
              </h2>

              <StaggerContainer delay={0.1}>
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {content.symptoms.map((symptom, idx) => (
                    <StaggerItem key={idx}>
                      <div className="group h-full bg-white/90 backdrop-blur rounded-2xl p-6 md:p-7 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">

                        <div className="flex items-start gap-4">

                          {/* Number badge */}
                          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-base transition-colors duration-300 group-hover:bg-primary/20">
                            {idx + 1}
                          </div>

                          {/* Text */}
                          <div>
                            <h3 className="font-semibold text-primary text-lg mb-2 leading-snug">
                              {symptom.title}
                            </h3>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                              {symptom.description}
                            </p>
                          </div>

                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </section>
          </SlideUp>


          {/* Causes Section */}
          {content.causes && content.causes.length > 0 && (
            <SlideUp>
              <section className="relative bg-[#f9f6ff] rounded-3xl p-8 md:p-14 shadow-xl overflow-hidden">

                {/* Heading */}
                <h2 className="relative text-3xl md:text-4xl font-bold text-primary mb-10 text-center">
                  <CharReveal delay={0.1} className="justify-center">
                    Common Causes & Triggers
                  </CharReveal>
                </h2>

                <StaggerContainer delay={0.1}>
                  <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {content.causes.map((cause, idx) => (
                      <StaggerItem key={idx}>
                        <div className="group h-full bg-white border border-softPurple/30 rounded-2xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/50">

                          {/* Icon */}
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-primary/20">
                            <AlertTriangle className="w-6 h-6 text-primary" />
                          </div>

                          {/* Text */}
                          <h3 className="font-semibold text-primary text-lg mb-1 leading-snug">
                            {cause}
                          </h3>

                        </div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>
              </section>
            </SlideUp>
          )}

          {/* Statistics Section */}
          {content.statistics && (
            <SlideUp>
              <section className="relative bg-[#f1edf8] rounded-3xl p-8 md:p-14 border border-primary/10 shadow-2xl overflow-hidden">

                {/* Heading */}
                <h2 className="relative text-3xl md:text-4xl font-bold text-primary mb-10 text-center">
                  <CharReveal delay={0.1} className="justify-center">
                    Did You Know?
                  </CharReveal>
                </h2>

                <StaggerContainer delay={0.1}>
                  <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                    {content.statistics.map((stat, idx) => (
                      <StaggerItem key={idx}>
                        <div className="group h-full bg-white rounded-2xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-primary/10">

                          {/* Value */}
                          <div className="text-4xl md:text-5xl font-extrabold text-accent mb-3 tracking-tight">
                            {stat.value}
                          </div>

                          {/* Description */}
                          <p className="text-primary/80 md:text-lg leading-relaxed">
                            {stat.description}
                          </p>

                        </div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>
              </section>
            </SlideUp>
          )}


          {/* How MindSettler Helps */}
          <SlideUp>
            <section className="relative bg-[#f9f6ff] rounded-3xl p-8 md:p-14 shadow-xl overflow-hidden">

              {/* Header */}
              <div className="relative text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  <CharReveal delay={0.1} className="justify-center">
                    How MindSettler Can Help
                  </CharReveal>
                </h2>
                <SlideUp delay={0.15}>
                  <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                    Our personalized approach blends psycho-education, evidence-based care, and compassionate support to guide you toward clarity and healing.
                  </p>
                </SlideUp>
              </div>

              <StaggerContainer delay={0.2}>
                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                  {content.treatmentApproach.map((approach, idx) => (
                    <StaggerItem key={idx}>
                      <div className="group h-full bg-white rounded-2xl p-7 md:p-8 border border-softPurple/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/40">

                        {/* Step badge */}
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-5 text-white text-xl font-bold transition-transform duration-300 group-hover:scale-110">
                          {idx + 1}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-primary mb-3 leading-snug">
                          {approach.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-700 leading-relaxed">
                          {approach.description}
                        </p>

                      </div>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </section>
          </SlideUp>


          {/* Programs Section */}
          <SlideUp>
            <section className="relative bg-[#f9f6ff] rounded-3xl p-8 md:p-14 overflow-hidden">
              {/* Heading */}
              <h2 className="relative text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
                <CharReveal delay={0.1} className="justify-center">
                  Our Programs & Services
                </CharReveal>
              </h2>

              <StaggerContainer delay={0.1}>
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">

                  {/* Card 1 */}
                  <StaggerItem>
                    <div className="group h-full bg-white rounded-2xl p-8 md:p-9 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-primary/20">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>

                      <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3">
                        Awareness Sessions
                      </h3>

                      <p className="text-gray-700 leading-relaxed mb-5">
                        Structured psycho-education sessions to help you understand{" "}
                        {content.title.toLowerCase()}, recognize patterns, and build healthy coping strategies.
                      </p>

                      <ul className="space-y-2 text-sm md:text-base text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="text-primary/70 font-bold">✓</span>
                          Interactive learning modules
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary/70 font-bold">✓</span>
                          Self-assessment tools
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary/70 font-bold">✓</span>
                          Progress tracking
                        </li>
                      </ul>
                    </div>
                  </StaggerItem>

                  {/* Card 2 */}
                  <StaggerItem>
                    <div className="group h-full bg-white rounded-2xl p-8 md:p-9 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

                      <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-accent/20">
                        <svg className="w-8 h-8 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>

                      <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3">
                        Personalized Guidance
                      </h3>

                      <p className="text-gray-700 leading-relaxed mb-5">
                        One-on-one or group sessions tailored to your unique needs, challenges, and goals —
                        available both online and offline in a safe, confidential space.
                      </p>

                      <ul className="space-y-2 text-sm md:text-base text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="text-primary/70 font-bold">✓</span>
                          Individual counseling
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary/70 font-bold">✓</span>
                          Group support sessions
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary/70 font-bold">✓</span>
                          Flexible scheduling
                        </li>
                      </ul>
                    </div>
                  </StaggerItem>

                </div>
              </StaggerContainer>
            </section>
          </SlideUp>


          {/* CTA Section */}
          <SlideUp>
            <section className="relative bg-[#f9f6ff] rounded-3xl p-10 md:p-16 text-center text-primary shadow-lg overflow-hidden border border-softPurple/20">

              <div className="relative max-w-3xl mx-auto space-y-7">

                {/* Heading */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  <CharReveal delay={0.05} className="justify-center">
                    You Don&apos;t Have to Navigate This Alone
                  </CharReveal>
                </h2>

                {/* Subtext */}
                <SlideUp delay={0.15}>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    Seeking awareness and guidance is a powerful first step. Our team is here to walk with you — every step of the way.
                  </p>
                </SlideUp>

                {/* Buttons */}
                <StaggerContainer delay={0.25}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">

                    <StaggerItem>
                      <Link href="/book">
                        <button className="group relative px-10 py-4 rounded-full bg-primary text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
                          <span className="relative z-10">Book a Session</span>
                          <div className="absolute inset-0 bg-[#Dd1764] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />

                        </button>
                      </Link>
                    </StaggerItem>

                    <StaggerItem>
                      <Link href="/awareness">
                        {/* <button className="group relative px-10 py-4 rounded-full border-2 border-primary text-primary font-semibold transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-1">
                        Learn More
                      <div className="absolute inset-0 bg-[#Dd1764] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
                      </button> */}
                        <button className="group relative px-10 py-4 rounded-full bg-white text-primary font-semibold shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
                          <span className="relative z-10 group-hover:text-white">Learn More</span>
                          <div className="absolute inset-0 bg-[#Dd1764] scale-x-0 group-hover:scale-x-100 transition-transform duration-500  ease-out origin-left" />
                        </button>


                      </Link>
                    </StaggerItem>

                  </div>
                </StaggerContainer>
              </div>
            </section>
          </SlideUp>
        </div>
      </main>
  );
}