"use client";
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Check, Users, Heart, BrainCircuit, Waves, GitCommit, UserCheck, ShieldCheck, Calendar, Globe, PencilRuler, Monitor, Users as UsersIcon, CalendarDays, CheckCircle, Star, Quote, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { SlideUp, StaggerContainer, StaggerItem, CharReveal } from '../components/common/RevealComponent';

// Import JSON data
import therapyApproachesData from '../../../data/therapyApproaches.json';
import testimonialsData from '../../../data/testimonials.json';

export default function ServicesPage() {
  // Use imported JSON data
  const therapyApproaches = therapyApproachesData;
  const testimonials = testimonialsData;

  // --- Responsive Logic & State ---
  const [isMobile, setIsMobile] = useState(false);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      if (width < 768) {
        setItemsPerSlide(1); // Mobile: 1 card
      } else if (width < 1024) {
        setItemsPerSlide(2); // Tablet: 2 cards
      } else {
        setItemsPerSlide(3); // Desktop: 3 cards
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Speed Adjustment for Mobile ---
  const baseDelay = isMobile ? 0 : 0.1;
  const staggerDelay = isMobile ? 0.05 : 0.1;

  const clientGroups = [
    {
      title: 'Children (5+)',
      description: 'Age-appropriate support focusing on emotional understanding, behavioral challenges, and healthy development in a safe and nurturing environment.',
      image: '/images/clients/child.png'
    },
    {
      title: 'Teens',
      description: 'Support for emotional regulation, self-identity, academic stress, peer relationships, and life transitions.',
      image: '/images/clients/teenager.png'
    },
    {
      title: 'Adults (up to 65 years)',
      description: 'Guidance for managing stress, emotional well-being, personal challenges, and life changes with clarity and resilience.',
      image: '/images/clients/adult.png'
    },
    {
      title: 'Couples',
      description: 'Support for improving communication, emotional connection, conflict resolution, and relationship satisfaction.',
      image: '/images/clients/couple.png'
    },
    {
      title: 'Families',
      description: 'Collaborative sessions aimed at strengthening family dynamics, understanding emotional needs, and building healthier relationships within the family system.',
      image: '/images/clients/family.png'
    },
  ];

  const whatToExpect = [
    {
      icon: <Check className="h-6 w-6 text-[#Dd1764]" />,
      title: "Evidence-Based Methods",
      description: "Our practice is grounded in proven therapeutic techniques to ensure effective support."
    },
    {
      icon: <PencilRuler className="h-6 w-6 text-[#Dd1764]" />,
      title: "Personalized Sessions",
      description: "Your sessions are tailored to your unique needs, goals, and life circumstances."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#Dd1764]" />,
      title: "Strict Confidentiality",
      description: "We provide a safe and private space where your information is always protected."
    },
    {
      icon: <Globe className="h-6 w-6 text-[#Dd1764]" />,
      title: "Online & Offline",
      description: "Choose between the convenience of online sessions or the connection of in-person meetings."
    },
    {
      icon: <Calendar className="h-6 w-6 text-[#Dd1764]" />,
      title: "Structured Yet Flexible",
      description: "We offer a clear path forward while remaining adaptable to your pace and progress."
    }
  ];

  // Testimonial Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);

  // Calculate slides
  const slidesCount = Math.ceil(testimonials.length / itemsPerSlide);

  // Navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= slidesCount - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slidesCount - 1 : prevIndex - 1
    );
  };

  const getCurrentTestimonials = () => {
    const startIndex = currentIndex * itemsPerSlide;
    const endIndex = startIndex + itemsPerSlide;
    return testimonials.slice(startIndex, endIndex);
  };

  useEffect(() => {
    if (isAutoPlaying && slidesCount > 1) {
      autoPlayInterval.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }
    return () => {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current);
    };
  }, [isAutoPlaying, currentIndex, slidesCount]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
    if (autoPlayInterval.current) clearInterval(autoPlayInterval.current);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const handleBookSession = (therapyType: string) => {
    localStorage.setItem('selectedTherapy', therapyType);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-[#Dd1764] text-[#Dd1764]' : 'fill-gray-200 text-gray-200'}`}
          />
        ))}
      </div>
    );
  };

  return (
    // MAIN PAGE BACKGROUND set to continuous Light Purple (#F9F6FF)
    <main className="min-h-screen bg-[#F9F6FF]">
      
      {/* Hero Section */}
      {/* Removed the inner nested container style so it blends with the main bg */}
      <section className="relative overflow-visible pt-32 pb-12 sm:pt-40 sm:pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1440px] mx-auto w-full relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

            {/* Left Column: Text */}
            <div className="text-center lg:text-left z-10">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] leading-tight font-bold tracking-tight mb-6 flex flex-col items-center lg:items-start">
                <span className="text-[#3F2965] mb-2">
                  <CharReveal className="justify-center lg:justify-start" delay={baseDelay}>
                    Our
                  </CharReveal>
                </span>
                <span className="text-[#Dd1764]">
                  <CharReveal className="justify-center lg:justify-start" delay={baseDelay + 0.1}>
                    Services
                  </CharReveal>
                </span>
              </h1>

              <SlideUp delay={baseDelay + 0.2}>
                <p className="mt-6 text-lg sm:text-xl text-[#3F2965]/80 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  MindSettler offers evidence-based therapeutic approaches designed to support emotional well-being, personal growth, and healthier relationships. Our sessions are conducted in a safe, confidential, and supportive environment.
                </p>
              </SlideUp>

              <SlideUp delay={baseDelay + 0.3}>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/book" className="w-full sm:w-auto">
                   <button className="w-full relative px-6 py-3 rounded-full bg-[#Dd1764] text-white text-sm font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-0.5">
                          <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                          <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            Book Session
                          </span>
                        </button>
                  </Link>
                </div>
              </SlideUp>
            </div>

            {/* Right Column: Animated Images */}
            <div className="relative h-[300px] sm:h-[500px] w-full flex items-center justify-center lg:justify-end perspective-1000 lg:pr-40">
              <SlideUp delay={baseDelay} className="w-full h-full relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full h-full flex items-center justify-center scale-[0.65] sm:scale-100 origin-center lg:origin-right">
                  {/* Image 1 (Back) */}
                  <div
                    className="absolute w-[240px] sm:w-[280px] aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden transform -rotate-12 translate-x-[-100px] sm:translate-x-[-150px] translate-y-[20px] opacity-90 animate-float-slow z-0 border-4 border-white cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-4 hover:rotate-[-5deg] hover:z-30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ease-out"
                    onClick={() => setSelectedImage('/assets/services1.png')}
                  >
                    <Image
                      src="/assets/services1.png"
                      alt="Service 1"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Image 2 (Middle) */}
                  <div
                    className="absolute w-[240px] sm:w-[280px] aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden transform -rotate-6 translate-x-[0px] translate-y-[-20px] z-10 border-4 border-white animate-float-medium cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-4 hover:rotate-0 hover:z-30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ease-out"
                    onClick={() => setSelectedImage('/assets/services2.png')}
                  >
                    <Image
                      src="/assets/services2.png"
                      alt="Service 2"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Image 3 (Front) */}
                  <div
                    className="absolute w-[240px] sm:w-[280px] aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden transform rotate-6 translate-x-[100px] sm:translate-x-[130px] translate-y-[40px] z-20 border-4 border-white animate-float-fast cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-4 hover:rotate-[5deg] hover:z-30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ease-out"
                    onClick={() => setSelectedImage('/assets/services3.png')}
                  >
                    <Image
                      src="/assets/services3.png"
                      alt="Service 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </SlideUp>

              {/* Decorative Circle Background - Adjusted color to blend with new bg */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-tr from-[#3F2965]/10 to-transparent rounded-full opacity-50 blur-3xl -z-10" />
            </div>
          </div>

          {/* Custom Animation Styles Inline */}
          <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(var(--tw-rotate)) translateX(var(--tw-translate-x)); }
            50% { transform: translateY(-15px) rotate(var(--tw-rotate)) translateX(var(--tw-translate-x)); }
          }
          .animate-float-slow { animation: float 6s ease-in-out infinite; }
          .animate-float-medium { animation: float 5s ease-in-out infinite; animation-delay: 1s; }
          .animate-float-fast { animation: float 4s ease-in-out infinite; animation-delay: 2s; }
          
          /* Pause animation on hover */
          .animate-float-slow:hover, .animate-float-medium:hover, .animate-float-fast:hover {
            animation-play-state: paused;
          }
        `}</style>

          {/* Lightbox Overlay */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <button
                  className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
                <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
                  <Image
                    src={selectedImage}
                    alt="Full size preview"
                    fill
                    className="object-contain"
                    quality={100}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Therapy Sessions Section */}
          <div className="pt-20 sm:pt-32"></div>

          {/* UPDATED HEADER SECTION WITH SVG */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 mb-10 sm:mb-16 max-w-6xl mx-auto px-4">
            
            {/* SVG Illustration - Visible on Desktop/Tablet, stacked on mobile */}
            <div className="w-56 sm:w-72 lg:w-96 flex-shrink-0">
               <TherapyServicesIllustration />
            </div>

            {/* Text Content */}
            <div className="text-center lg:text-left max-w-2xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] leading-tight sm:leading-[1.1] font-bold tracking-tight mb-4 sm:mb-6 md:mb-8 flex flex-col items-center lg:items-start">
                <div className="text-[#3F2965] mb-1 sm:mb-2">
                  <CharReveal className="justify-center lg:justify-start" delay={baseDelay}>Our Therapeutic</CharReveal>
                </div>
                <div className="text-[#Dd1764]">
                  <CharReveal className="justify-center lg:justify-start" delay={baseDelay + 0.1}>Services</CharReveal>
                </div>
              </h2>

              <SlideUp delay={baseDelay + 0.2}>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-[#3F2965]/70 font-medium">
                  Explore our evidence-based therapeutic approaches designed to support your unique healing journey
                </p>
              </SlideUp>
            </div>
          </div>

          {/* Therapy Cards Grid */}
          <StaggerContainer 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" 
            delay={staggerDelay}
          >
            {therapyApproaches.map((therapy) => (
              <StaggerItem key={therapy.id} className="h-full">
                <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white border border-[#3F2965]/5">
                  {/* Image Section */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={therapy.image}
                      alt={therapy.title}
                      fill
                      className="object-cover object-center scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectPosition: 'center 30%'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    <CardTitle className="font-headline text-xl mb-4 text-center text-[#3F2965]">
                      {therapy.title}
                    </CardTitle>

                    <ul className="space-y-2 mb-6 flex-1">
                      {therapy.points.map((point, index) => (
                        <li key={index} className="flex items-start text-sm text-[#3F2965]/70">
                          <CheckCircle className="h-4 w-4 text-[#Dd1764] mr-2 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Buttons Section */}
                    <div className="mt-auto space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        {/* Online Button */}
                        {therapy.availableOnline ? (
                          <Link
                            href={`/book?therapy=${encodeURIComponent(therapy.title)}&type=online`}
                            onClick={() => handleBookSession(therapy.title)}
                            className="w-full"
                          >
                            <button className="w-full relative px-4 py-3 rounded-full bg-white text-[#3F2965] text-sm font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-0.5 border border-[#3F2965]/10">
                              <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                              <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                                <Monitor className="h-4 w-4 group-hover:text-white transition-colors duration-300" />
                                Online
                              </span>
                            </button>
                          </Link>
                        ) : (
                          <button
                            className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-400 text-sm font-bold tracking-wide border border-gray-200 cursor-not-allowed flex items-center justify-center gap-2"
                            disabled
                          >
                            <Monitor className="h-4 w-4" />
                            Online (Unavailable)
                          </button>
                        )}

                        {/* Offline Button */}
                        {therapy.availableOffline ? (
                          <Link
                            href={`/book?therapy=${encodeURIComponent(therapy.title)}&type=offline`}
                            onClick={() => handleBookSession(therapy.title)}
                            className="w-full"
                          >
                            <button className="w-full relative px-4 py-3 rounded-full bg-white text-[#3F2965] text-sm font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-0.5 border border-[#3F2965]/10">
                              <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                              <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                                <UsersIcon className="h-4 w-4 group-hover:text-white transition-colors duration-300" />
                                Offline
                              </span>
                            </button>
                          </Link>
                        ) : (
                          <button
                            className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-400 text-sm font-bold tracking-wide border border-gray-200 cursor-not-allowed flex items-center justify-center gap-2"
                            disabled
                          >
                            <UsersIcon className="h-4 w-4" />
                            Offline (Unavailable)
                          </button>
                        )}
                      </div>

                      {/* Book Session Button */}
                      <Link href={`/book?therapy=${encodeURIComponent(therapy.title)}`}>
                        <button className="w-full relative px-6 py-3 rounded-full bg-[#Dd1764] text-white text-sm font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-0.5">
                          <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                          <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            Book Session
                          </span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Corporate Services Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 bg-[#F9F6FF]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

          <SlideUp delay={baseDelay}>
            {/* Changed background to White to stand out against Purple page */}
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-white text-[#Dd1764] mb-6 sm:mb-8 shadow-sm">
              <Building2 size={40} strokeWidth={1.5} className="sm:w-12 sm:h-12" />
            </div>
          </SlideUp>

          <div className="mb-4 sm:mb-6 flex flex-col items-center">
              <SlideUp delay={baseDelay + 0.1}>
                  <span className="block text-[#Dd1764] font-bold text-xs sm:text-sm tracking-wide mb-2 sm:mb-3 uppercase">
                      Corporate & Organizational Care
                  </span>
              </SlideUp>

              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#3F2965] space-y-1">
                  <div>
                      <CharReveal delay={baseDelay + 0.1} className="justify-center">
                          Wellness solutions for
                      </CharReveal>
                  </div>
                  <div className="text-[#Dd1764]">
                      <CharReveal delay={baseDelay + 0.1} className="justify-center">
                          healthier workplaces
                      </CharReveal>
                  </div>
              </div>
          </div>

          <SlideUp delay={baseDelay + 0.2} className="mb-8 sm:mb-10 md:mb-12">
            <p className="text-base sm:text-lg md:text-xl text-[#3F2965]/70 leading-relaxed max-w-2xl mx-auto font-medium px-4">
              We partner with organizations to foster mentally healthy and productive work environments through workshops, group sessions, and collaborative programs.
            </p>
          </SlideUp>

          <SlideUp delay={baseDelay + 0.3}>
            <Link href="/corporate">
              <button className="w-full sm:w-auto relative px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-[#Dd1764] text-white font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/20 hover:-translate-y-1">
                  <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                  <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                  <span className="relative z-10 flex items-center justify-center gap-2">Explore Corporate Services</span>
              </button>
            </Link>
          </SlideUp>
        </div>
      </section>

      {/* Who We Work With Section */}
      <section className="py-8 sm:py-12 bg-[#F9F6FF]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] leading-tight sm:leading-[1.1] font-bold tracking-tight mb-4 sm:mb-6 md:mb-8 flex flex-col items-center">
              <div className="text-[#3F2965] mb-1 sm:mb-2">
                <CharReveal className="justify-center" delay={baseDelay}>Who We</CharReveal>
              </div>
              <div className="text-[#Dd1764]">
                <CharReveal className="justify-center" delay={baseDelay + 0.1}>Work With</CharReveal>
              </div>
            </h2>

            <SlideUp delay={baseDelay + 0.2}>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-[#3F2965]/70">
                Our services are thoughtfully designed to support individuals and families across different life stages:
              </p>
            </SlideUp>
          </div>

          <StaggerContainer className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-5" delay={staggerDelay}>
            {clientGroups.map((group) => (
              <StaggerItem
                key={group.title}
                className="relative rounded-lg overflow-hidden shadow-sm group hover:shadow-lg transition-shadow duration-300 h-full min-h-[250px] sm:min-h-[auto]"
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src={group.image}
                    alt={group.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300" />
                </div>

                <div className="relative z-10 p-6 text-center h-full flex flex-col justify-center min-h-[200px]">
                  <h3 className="font-headline text-xl font-semibold text-white mb-2">
                    {group.title}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {group.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* What You Can Expect Section */}
      <section className="py-8 sm:py-12 bg-[#F9F6FF]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] leading-tight sm:leading-[1.1] font-bold tracking-tight mb-4 sm:mb-6 md:mb-8 flex flex-col items-center">
              <div className="text-[#3F2965] mb-1 sm:mb-2">
                <CharReveal className="justify-center" delay={baseDelay}>What You</CharReveal>
              </div>
              <div className="text-[#Dd1764]">
                <CharReveal className="justify-center" delay={baseDelay + 0.1}>Can Expect</CharReveal>
              </div>
            </h2>

            <SlideUp delay={baseDelay + 0.2}>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-[#3F2965]/70">
                Our commitment to your healing journey includes these five essential pillars of care
              </p>
            </SlideUp>
          </div>

          {/* Cards */}
          <div className="max-w-4xl mx-auto">
            {/* First Row - 2 Cards */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8" delay={staggerDelay}>
              {whatToExpect.slice(0, 2).map((item) => (
                <StaggerItem key={item.title}>
                  {/* Changed BG to WHITE to pop on Purple Page */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-[#3F2965]/10 hover:border-[#3F2965]/20 hover:-translate-y-1 h-full">
                    <div className="flex flex-col items-center text-center">
                      {/* Icon BG changed to light purple */}
                      <div className="w-16 h-16 rounded-full bg-[#F9F6FF] flex items-center justify-center mb-6 shadow-sm text-[#3F2965]">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold font-headline text-[#3F2965] mb-4">
                        {item.title}
                      </h3>
                      <p className="text-[#3F2965]/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Second Row - 3 Cards */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" delay={staggerDelay + 0.1}>
              {whatToExpect.slice(2, 5).map((item) => (
                <StaggerItem key={item.title}>
                  {/* Changed BG to WHITE */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-[#3F2965]/10 hover:border-[#3F2965]/20 hover:-translate-y-1 h-full">
                    <div className="flex flex-col items-center text-center">
                      {/* Icon BG changed to light purple */}
                      <div className="w-14 h-14 rounded-full bg-[#F9F6FF] flex items-center justify-center mb-4 shadow-sm">
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-bold font-headline text-[#3F2965] mb-3">
                        {item.title}
                      </h3>
                      <p className="text-[#3F2965]/70 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <div className="mt-12 sm:mt-20 text-center">
            <Link href="/book">
              <button className="relative px-8 py-4 rounded-full bg-[#Dd1764] text-white font-bold text-lg tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-0.5 w-full sm:w-auto">
                <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>Book Your First Session</span>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - Removed the inner box styling */}
      <section className="flex items-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-[#F9F6FF]">
        <div className="max-w-[1440px] mx-auto w-full relative overflow-visible">

          <div className="text-center mb-10 sm:mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] leading-tight sm:leading-[1.1] font-bold tracking-tight mb-4 sm:mb-6 md:mb-8 flex flex-col items-center">
              <div className="text-[#3F2965] mb-1 sm:mb-2">
                <CharReveal className="justify-center" delay={baseDelay}>What Our</CharReveal>
              </div>
              <div className="text-[#Dd1764]">
                <CharReveal className="justify-center" delay={baseDelay + 0.1}>Clients Say</CharReveal>
              </div>
            </h2>

            <SlideUp delay={baseDelay + 0.2}>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-[#3F2965]/70 font-medium max-w-3xl mx-auto">
                Real stories from individuals and families who have found healing and growth through our therapeutic approaches
              </p>
            </SlideUp>
          </div>

          <SlideUp delay={baseDelay + 0.3}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {slidesCount > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 z-10 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#3F2965] hover:bg-[#3F2965] hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 z-10 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#3F2965] hover:bg-[#3F2965] hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}

            <div className="overflow-hidden px-2">
              <div className={`grid gap-8 transition-all duration-500 ease-in-out ${
                itemsPerSlide === 1 ? 'grid-cols-1' : itemsPerSlide === 2 ? 'grid-cols-2' : 'grid-cols-3'
              }`}>
                {getCurrentTestimonials().map((testimonial) => (
                  <div
                    key={testimonial.id}
                    // Cards kept white
                    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-[#3F2965]/5 transform hover:-translate-y-1 h-full flex flex-col"
                  >
                    <div className="mb-4">
                      <Quote className="h-8 w-8 text-[#Dd1764]/30" />
                    </div>

                    <div className="mb-4">
                      {renderStars(testimonial.rating)}
                    </div>

                    <p className="text-[#3F2965] text-sm sm:text-base leading-relaxed mb-6 italic flex-grow">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-[#3F2965] to-[#513681] flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold text-[#3F2965] truncate">{testimonial.name}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="text-sm text-[#3F2965]/70 truncate">{testimonial.role}</span>
                          <span className="hidden sm:block text-[#3F2965]/30">•</span>
                          <span className="text-xs px-2 py-1 bg-[#F9F6FF] text-[#Dd1764] font-bold rounded-full w-fit">
                            {testimonial.therapy}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {slidesCount > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {[...Array(slidesCount)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'w-8 bg-[#Dd1764]'
                      : 'w-2 bg-[#3F2965]/30'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </SlideUp>

          <div className="mt-12 sm:mt-20 text-center">
            <div className="max-w-2xl mx-auto mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#3F2965] mb-4">
                Ready to Begin Your Healing Journey?
              </h3>
              <p className="text-[#3F2965]/70">
                Join hundreds of satisfied clients who have transformed their lives through therapy
              </p>
            </div>

            <Link href="/book">
              <button className="relative px-8 py-4 rounded-full bg-[#Dd1764] text-white font-bold text-lg tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-0.5 w-full sm:w-auto">
                <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <CalendarDays className="h-5 w-5" />
                  <span>Start Your Transformation Today</span>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// Sub-component for the new "Therapy Services" SVG
function TherapyServicesIllustration() {
  return (
    <svg className="animated w-full h-auto" id="freepik_stories-mental-health" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink">
      <style dangerouslySetInnerHTML={{__html: `
        svg#freepik_stories-mental-health:not(.animated) .animable {opacity: 0;}
        svg#freepik_stories-mental-health.animated #freepik--background-complete--inject-63 {animation: 1s 1 forwards cubic-bezier(.36,-0.01,.5,1.38) zoomIn;animation-delay: 0s;}
        svg#freepik_stories-mental-health.animated #freepik--Shadow--inject-63 {animation: 1s 1 forwards cubic-bezier(.36,-0.01,.5,1.38) lightSpeedLeft;animation-delay: 0s;}
        svg#freepik_stories-mental-health.animated #freepik--Head--inject-63 {animation: 1s 1 forwards cubic-bezier(.36,-0.01,.5,1.38) slideDown;animation-delay: 0s;}
        svg#freepik_stories-mental-health.animated #freepik--character-1--inject-63 {animation: 1s 1 forwards cubic-bezier(.36,-0.01,.5,1.38) slideUp;animation-delay: 0s;}
        svg#freepik_stories-mental-health.animated #freepik--character-2--inject-63 {animation: 1s 1 forwards cubic-bezier(.36,-0.01,.5,1.38) slideUp;animation-delay: 0s;}
        @keyframes zoomIn { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes lightSpeedLeft { from { transform: translate3d(-50%, 0, 0) skewX(20deg); opacity: 0; } 60% { transform: skewX(-10deg); opacity: 1; } 80% { transform: skewX(2deg); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
        @keyframes slideDown { 0% { opacity: 0; transform: translateY(-30px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: inherit; } }
        .animator-hidden { display: none; }
      `}} />
      <g id="freepik--background-complete--inject-63" className="animable" style={{transformOrigin: '250px 212.763px'}}>
        <rect y="382.4" width="500" height="0.25" style={{fill: 'rgb(235, 235, 235)', transformOrigin: '250px 382.525px'}} id="elkwqh5515a1e" className="animable"></rect>
        <rect x="78.54" y="390.79" width="33.12" height="0.25" style={{fill: 'rgb(235, 235, 235)', transformOrigin: '95.1px 390.915px'}} id="el8dox36bol66" className="animable"></rect>
        <rect x="133.33" y="398" width="30.17" height="0.25" style={{fill: 'rgb(235, 235, 235)', transformOrigin: '148.415px 398.125px'}} id="eluqw9h1jcmas" className="animable"></rect>
        <rect x="56.85" y="400.07" width="38.25" height="0.25" style={{fill: 'rgb(235, 235, 235)', transformOrigin: '75.975px 400.195px'}} id="el0ewtdhg624ct" className="animable"></rect>
        <rect x="434" y="399.53" width="15.9" height="0.25" style={{fill: 'rgb(235, 235, 235)', transformOrigin: '441.95px 399.655px'}} id="elccxg2sqg64r" className="animable"></rect>
        <rect x="391.47" y="399.53" width="39.32" height="0.25" style={{fill: 'rgb(235, 235, 235)', transformOrigin: '411.13px 399.655px'}} id="eldw8qgnb688w" className="animable"></rect>
        <rect x="250" y="390.66" width="30.33" height="0.25" style={{fill: 'rgb(235, 235, 235)', transformOrigin: '265.165px 390.785px'}} id="elevbgk8rp44s" className="animable"></rect>
        <rect x="284.67" y="390.66" width="72.1" height="0.25" style={{fill: 'rgb(235, 235, 235)', transformOrigin: '320.72px 390.785px'}} id="elk6wa89hvl1i" className="animable"></rect>
        <path d="M237,337.8H43.91a5.71,5.71,0,0,1-5.7-5.71V60.66A5.71,5.71,0,0,1,43.91,55H237a5.71,5.71,0,0,1,5.71,5.71V332.09A5.71,5.71,0,0,1,237,337.8ZM43.91,55.2a5.46,5.46,0,0,0-5.45,5.46V332.09a5.46,5.46,0,0,0,5.45,5.46H237a5.47,5.47,0,0,0,5.46-5.46V60.66A5.47,5.47,0,0,0,237,55.2Z" style={{fill: 'rgb(235, 235, 235)', transformOrigin: '140.46px 196.4px'}} id="eljeunm5vj8z" className="animable"></path>
        <path d="M453.31,337.8H260.21a5.72,5.72,0,0,1-5.71-5.71V60.66A5.72,5.72,0,0,1,260.21,55h193.1A5.71,5.71,0,0,1,459,60.66V332.09A5.71,5.71,0,0,1,453.31,337.8ZM260.21,55.2a5.47,5.47,0,0,0-5.46,5.46V332.09a5.47,5.47,0,0,0,5.46,5.46h193.1a5.47,5.47,0,0,0,5.46-5.46V60.66a5.47,5.47,0,0,0-5.46-5.46Z" style={{fill: 'rgb(235, 235, 235)', transformOrigin: '356.75px 196.4px'}} id="elansbgb2787s" className="animable"></path>
        <path d="M175.67,382.4h-4a90.33,90.33,0,0,1,1.51-12.94c3.18-19.91,8-50-16.88-84.29-14.72-20.29-29.94-50.25-18.82-77.71C147.7,182.22,178.15,165,228,156.24,299.36,143.71,342,122.51,351.24,95c5.72-17-1.47-36.52-21.37-57.93l2.93-2.72c21,22.56,28.45,43.4,22.23,61.92-9.75,29-53.44,51.15-126.35,64-48.39,8.5-77.83,24.91-87.49,48.78-10.43,25.76,4.22,54.39,18.35,73.87,25.85,35.64,20.68,67.95,17.59,87.26A87.25,87.25,0,0,0,175.67,382.4Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '245.404px 208.375px'}} id="elf0frb1lqt9o" className="animable"></path>
        <path d="M144.45,198.71c11.39-17.6,11.28-38.72,1-54.35C119.89,167.19,144.45,198.71,144.45,198.71Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '143.452px 171.535px'}} id="elip0swlisoor" className="animable"></path>
        <path d="M226.91,158.61c24.56-9.86,50.7-4.62,67.56,12C260,196.65,226.91,158.61,226.91,158.61Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '260.69px 166.683px'}} id="el6rdlxc92ted" className="animable"></path>
        <path d="M397.77,66.76c-8.82,18.91-26.69,30-45.33,29.53C358.21,62.71,397.77,66.76,397.77,66.76Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '375.105px 81.4557px'}} id="el8smx57vpmtv" className="animable"></path>
        <path d="M166.49,297.73c-9.58-12.31-10.85-28-4.2-40.23C182.67,272.78,166.49,297.73,166.49,297.73Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '165.356px 277.615px'}} id="ele3g7u66pq0o" className="animable"></path>
        <path d="M341.41,47.24c-15.6.22-28.88-8.2-34.65-20.89C331.24,19.29,341.41,47.24,341.41,47.24Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '324.085px 36.2255px'}} id="elei7arlmqoi" className="animable"></path>
        <path d="M415.89,382.4h-2.68c0-9.63-8.15-15.28-16.78-21.26C385,353.2,372,344.19,381.67,324.33c4.68-9.59,12.36-17,19.79-24.17,18.52-17.88,34.52-33.32.2-76.22-31.05-38.82-43.25-69.36-35.28-88.32,5.09-12.1,18.11-19.28,38.7-21.34l.26,2.68c-19.53,2-31.8,8.58-36.48,19.7-7.57,18,4.5,47.6,34.9,85.6,35.85,44.82,18.22,61.83-.44,79.84-7.26,7-14.77,14.25-19.23,23.41-8.67,17.79,2.28,25.38,13.87,33.42C406.78,365,415.89,371.37,415.89,382.4Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '394.262px 248.34px'}} id="el2374j2i1dgw" className="animable"></path>
        <path d="M419,282.58c2.08-13.93,11.51-24.52,23.65-27.81C445.37,277.6,419,282.58,419,282.58Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '430.923px 268.675px'}} id="els9ynb65akhj" className="animable"></path>
        <path d="M403.25,223.93c-8-15.87-23.5-24.83-39.35-24C369.67,228.4,403.25,223.93,403.25,223.93Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '383.575px 212.031px'}} id="eliksnnfvi5eq" className="animable"></path>
        <path d="M357.93,101.79c-3.95,13.45.14,27,9.73,35C379.66,117.32,357.93,101.79,357.93,101.79Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '363.854px 119.29px'}} id="els7gatjg3gcc" className="animable"></path>
        <path d="M381.83,327.51c5.61-8.85,5.46-19.4.23-27.17C369.42,311.87,381.83,327.51,381.83,327.51Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '381.196px 313.925px'}} id="elnp6lp7xv3me" className="animable"></path>
        <path d="M395,117c7.76,7,18.19,8.69,26.73,4.85C412.53,107.41,395,117,395,117Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '408.365px 118.869px'}} id="el68n1tm8bfph" className="animable"></path>
        <path d="M240.43,382.4h-2.89c0-10.37-8.78-16.46-18.08-22.91-12.34-8.55-26.32-18.25-15.89-39.65,5-10.32,13.3-18.31,21.3-26,20-19.26,37.2-35.9.23-82.11-33.46-41.82-46.6-74.72-38-95.15,5.48-13,19.51-20.76,41.69-23l.28,2.88c-21,2.1-34.26,9.25-39.3,21.22-8.15,19.39,4.85,51.28,37.6,92.22,38.62,48.28,19.63,66.6-.48,86-7.82,7.55-15.9,15.35-20.71,25.22-9.34,19.17,2.45,27.35,14.94,36C230.61,363.7,240.43,370.51,240.43,382.4Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '217.134px 237.99px'}} id="elnl4w8f1bef8" className="animable"></path>
        <path d="M243.78,274.87c2.23-15,12.39-26.41,25.47-30C272.18,269.5,243.78,274.87,243.78,274.87Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '256.621px 259.87px'}} id="elbmhr3clq5o7" className="animable"></path>
        <path d="M226.81,211.69c-8.62-17.1-25.32-26.75-42.4-25.82C190.64,216.5,226.81,211.69,226.81,211.69Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '205.61px 198.887px'}} id="elpkruyztozp" className="animable"></path>
        <path d="M178,80.11c-4.25,14.49.15,29,10.49,37.72C201.4,96.84,178,80.11,178,80.11Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '184.383px 98.97px'}} id="elrykb5dyh1y" className="animable"></path>
        <path d="M203.74,323.27c6-9.53,5.87-20.9.24-29.27C190.36,306.42,203.74,323.27,203.74,323.27Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '203.043px 308.635px'}} id="eldp457q9wyq8" className="animable"></path>
        <path d="M217.92,96.47c8.36,7.58,19.59,9.36,28.79,5.23C236.8,86.16,217.92,96.47,217.92,96.47Z" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '232.315px 98.4934px'}} id="eltd5pz0d7hmd" className="animable"></path>
        <path d="M82.23,117.33l18.28,18.28s-3.86,25.67-11.83,18-6.27-12.31-6.27-12.31S66.88,150,61.93,132.26,82.23,117.33,82.23,117.33Z" style={{fill: 'rgb(235, 235, 235)', transformOrigin: '80.8984px 136.104px'}} id="eluel2vahpyp" className="animable"></path>
        <path d="M82.23,117.33l18.28,18.28s25.68-3.86,18-11.83-12.3-6.27-12.3-6.27S114.86,102,97.16,97,82.23,117.33,82.23,117.33Z" style={{fill: 'rgb(250, 250, 250)', transformOrigin: '101.008px 115.978px'}} id="elkzsvp87vet8" className="animable"></path>
        <circle cx="81.04" cy="116.14" r="2.88" style={{fill: 'rgb(224, 224, 224)', transformOrigin: '81.04px 116.14px'}} id="el0s55leqynzi" className="animable"></circle>
        <path d="M101.76,136.85h0a2,2,0,0,1-2.84,0L80.63,117.39l1.67-1.67L101.71,134A2,2,0,0,1,101.76,136.85Z" style={{fill: 'rgb(224, 224, 224)', transformOrigin: '91.481px 126.581px'}} id="ellxc0465qwbj" className="animable"></path>
        <path d="M428,164.7l-9,17.12s-19.21,2.91-15.51-4.48,7.42-7.2,7.42-7.2-9.6-9.21,2-16.66S428,164.7,428,164.7Z" style={{fill: 'rgb(250, 250, 250)', transformOrigin: '415.508px 167.055px'}} id="el41uk6o6ocgr" className="animable"></path>
        <path d="M428,164.7l-9,17.12s8.44,17.5,12.45,10.28,1.76-10.18,1.76-10.18,13,2.73,12.65-11S428,164.7,428,164.7Z" style={{fill: 'rgb(240, 240, 240)', transformOrigin: '432.433px 178.248px'}} id="el93ekxlcbcc6" className="animable"></path>
        <path d="M430.51,164.6a2.16,2.16,0,1,1-.9-2.92A2.15,2.15,0,0,1,430.51,164.6Z" style={{fill: 'rgb(224, 224, 224)', transformOrigin: '428.603px 163.59px'}} id="elewmtut73sw" className="animable"></path>
        <path d="M418.37,183h0a1.48,1.48,0,0,1-.6-2l9.85-17.37,1.56.83-8.79,17.92A1.48,1.48,0,0,1,418.37,183Z" style={{fill: 'rgb(224, 224, 224)', transformOrigin: '423.387px 173.405px'}} id="eliw10y9z4m5s" className="animable"></path>
        <path d="M167.87,47.68l-6.32,12s-13.44,2-10.85-3.13,5.19-5,5.19-5-6.72-6.44,1.37-11.65S167.87,47.68,167.87,47.68Z" style={{fill: 'rgb(250, 250, 250)', transformOrigin: '159.119px 49.3656px'}} id="elwu2b9e58yn" className="animable"></path>
        <path d="M167.87,47.68l-6.32,12s5.9,12.25,8.71,7.2,1.23-7.13,1.23-7.13,9.11,1.91,8.85-7.71S167.87,47.68,167.87,47.68Z" style={{fill: 'rgb(240, 240, 240)', transformOrigin: '170.948px 57.1728px'}} id="elqlpb9kncumg" className="animable"></path>
        <path d="M169.62,47.6a1.51,1.51,0,1,1-.63-2A1.51,1.51,0,0,1,169.62,47.6Z" style={{fill: 'rgb(224, 224, 224)', transformOrigin: '168.269px 46.9265px'}} id="el7d9hth27q5u" className="animable"></path>
        <path d="M161.12,60.46h0A1,1,0,0,1,160.7,59l6.89-12.15,1.09.57L162.54,60A1,1,0,0,1,161.12,60.46Z" style={{fill: 'rgb(224, 224, 224)', transformOrigin: '164.608px 53.7234px'}} id="elm37hzsvhx2" className="animable"></path>
      </g>
      <g id="freepik--Shadow--inject-63" className="animable" style={{transformOrigin: '250px 416.24px'}}>
        <ellipse id="freepik--path--inject-63" cx="250" cy="416.24" rx="193.89" ry="11.32" style={{fill: 'rgb(245, 245, 245)', transformOrigin: '250px 416.24px'}} className="animable"></ellipse>
      </g>
      <g id="freepik--Head--inject-63" className="animable" style={{transformOrigin: '271.93px 241.185px'}}>
        <path d="M371.37,184.33c27.05-70.41-37.54-135.5-120.79-112.11-36.92,10.37-51.17,46-59.94,84.82-5.26,9.94-16.11,27.77-31.28,39.07a8.82,8.82,0,0,0-.43,13.82c6.61,5.56,14.85,7.69,19.78,8.49-1.35,6.25-2.81,12.24-4.48,17.85-10.83,36.5,20.39,55.28,55.6,58.83a132,132,0,0,1,1.94,35.37c-1.21,15.58,13,27.91,28.33,24.82l69-13.93a23.68,23.68,0,0,0,18.93-25.24,564.57,564.57,0,0,1-.16-89.87C355.86,216.81,363.64,204.42,371.37,184.33Z" style={{fill: 'rgb(126, 87, 194)', transformOrigin: '266.708px 211.569px'}} id="elhirpdponm9u" className="animable"></path>
        <g id="el25rjuwfeejg"><path d="M371.37,184.33c27.05-70.41-37.54-135.5-120.79-112.11-36.92,10.37-51.17,46-59.94,84.82-5.26,9.94-16.11,27.77-31.28,39.07a8.82,8.82,0,0,0-.43,13.82c6.61,5.56,14.85,7.69,19.78,8.49-1.35,6.25-2.81,12.24-4.48,17.85-10.83,36.5,20.39,55.28,55.6,58.83a132,132,0,0,1,1.94,35.37c-1.21,15.58,13,27.91,28.33,24.82l69-13.93a23.68,23.68,0,0,0,18.93-25.24,564.57,564.57,0,0,1-.16-89.87C355.86,216.81,363.64,204.42,371.37,184.33Z" style={{fill: 'rgb(255, 255, 255)', opacity: 0.6, transformOrigin: '266.708px 211.569px'}} className="animable"></path></g>
        <path d="M378.08,415H207.66a9.94,9.94,0,0,1-9.51-12.84l19.56-64a10,10,0,0,1,6.22-6.48l125.64-44a9.93,9.93,0,0,1,13,7.12l25.23,108A9.94,9.94,0,0,1,378.08,415Z" style={{fill: 'rgb(126, 87, 194)', transformOrigin: '292.889px 351.053px'}} id="el74lnxlhj9gs" className="animable"></path>
        <path d="M268.68,91.87a15,15,0,0,0-24.83,8.79,12.28,12.28,0,0,0-15.52,6l13.39,5.69a8.35,8.35,0,1,0,13.44,5.7l14.71,6.25,6.25-14.71a8.34,8.34,0,0,1-8.26-4.45,8.06,8.06,0,0,1-.42-1c-.11-.3-.2-.6-.28-.91a8.29,8.29,0,0,1-.24-1.93s0,0,0-.07a8.48,8.48,0,0,1,.67-3.25,8.34,8.34,0,0,1,14.25-1.88l4.1-9.65a16.07,16.07,0,0,0-17.25,5.34Z" style={{fill: 'rgb(255, 255, 255)', transformOrigin: '257.135px 106.516px'}} id="elenouen29ol" className="animable"></path>
        <g id="elbn61iktsnyb"><path d="M261.23,155a8.26,8.26,0,0,0,4.52.56A8.33,8.33,0,0,0,264.41,139a6.79,6.79,0,0,0-.78,0h0l6.24-14.71-14.71-6.25a8.27,8.27,0,0,1-.61,4.13,8.35,8.35,0,1,1-12.83-9.83l-13.39-5.69a12.27,12.27,0,0,0,2.17,14,15,15,0,0,0-8.67,23h0l.22.29a15.13,15.13,0,0,0,5.41,4.6c6.27,3.81,16.27,7,28,9.58l2.44-5.73A8.25,8.25,0,0,0,261.23,155Z" style={{opacity: 0.1, transformOrigin: '246.003px 132.385px'}} className="animable"></path></g>
        <path d="M328.82,115a8.35,8.35,0,0,1,5,6.44,9.24,9.24,0,0,1,.1,1.18v.08A8.35,8.35,0,0,1,319,127.83l-6.24,14.7h0l14.71,6.24a8.35,8.35,0,1,0,13.44,5.71l13.49,5.73a12.32,12.32,0,0,0-7.14-15.63,15,15,0,0,0-12.34-23.27,16.06,16.06,0,0,0-5.17-12.94,16.23,16.23,0,0,0-1.87-1.46l-3.17,7.47A8.27,8.27,0,0,1,328.82,115Z" style={{fill: 'rgb(255, 255, 255)', transformOrigin: '333.939px 135.307px'}} id="el2rswx0xhhot" className="animable"></path>
        <g id="eld5yi0r5l8ho"><path d="M278.52,93.64a8.35,8.35,0,0,0-10.94,4.42,8.48,8.48,0,0,0-.67,3.25s0,0,0,.07a8.29,8.29,0,0,0,.24,1.93c.08.31.17.61.28.91a8.06,8.06,0,0,0,.42,1,8.34,8.34,0,0,0,8.26,4.45h0l-6.25,14.71h0l14.7,6.25a8.93,8.93,0,0,1,0-2,.17.17,0,0,1,0-.07s0-.09,0-.13a8.32,8.32,0,0,1,9.63-6.88,7.88,7.88,0,0,1,1.86.54h0A8.35,8.35,0,0,1,300.57,133a8.25,8.25,0,0,1-1.78,2.63,9.72,9.72,0,0,1-.76.68l14.71,6.24,6.24-14.7a8.35,8.35,0,0,0,14.92-5.13v-.08a9.24,9.24,0,0,0-.1-1.18,8.31,8.31,0,0,0-9.11-7h0l3.17-7.47a16,16,0,0,0-7.8-2.72,17.79,17.79,0,0,0-25.65-11.5,16.12,16.12,0,0,0-8.48-6.17l-4.1,9.65A8.34,8.34,0,0,0,278.52,93.64Z" style={{opacity: 0.1, transformOrigin: '300.405px 114.575px'}} className="animable"></path></g>
        <g id="el00522e3bydb8t"><path d="M340.27,158.62a8.35,8.35,0,1,1-12.82-9.84l-14.71-6.24-6.25,14.71c-.16-.21-.35-.4-.53-.6a8.14,8.14,0,0,0-2.78-1.94,8.35,8.35,0,0,0-7.29,15c.24.13.5.26.76.37a8.39,8.39,0,0,0,4.13.62h0l-2.31,5.43a13.62,13.62,0,0,0,10.14-1.72,13.84,13.84,0,0,0,1.79-1.33,17.62,17.62,0,0,0,2.32,5.94,17.93,17.93,0,0,0,33.11-11,12.31,12.31,0,0,0,8.55-7.8l-13.49-5.73A8.39,8.39,0,0,1,340.27,158.62Z" style={{opacity: 0.1, transformOrigin: '322.977px 165.029px'}} className="animable"></path></g>
        <g id="elf25sxnultsk"><g style={{opacity: 0.2, transformOrigin: '348.185px 362.37px'}} className="animable"><polygon points="327.26 363.52 327.93 388.81 369.85 388.81 369.18 363.52 327.26 363.52" style={{fill: 'none', transformOrigin: '348.555px 376.165px'}} id="el3l0rolx4lc" className="animable"></polygon><polygon points="368.44 335.93 326.52 335.93 327.19 361.22 369.12 361.22 368.44 335.93" style={{fill: 'none', transformOrigin: '347.82px 348.575px'}} id="elagc6qy9ul3k" className="animable"></polygon></g></g>
      </g>
      <g id="freepik--character-1--inject-63" className="animable" style={{transformOrigin: '113.899px 314.405px'}}>
        <path d="M88.13,308l.17-2.48a2.55,2.55,0,0,0-.94-2.26l-3-2.23a4.25,4.25,0,0,0-4.38-.28l-1,.44c-.54,4.15,1.61,8.58,1.61,8.58l.48,1.36a1.84,1.84,0,0,0,2.77,1l2.64-1.46A3.42,3.42,0,0,0,88.13,308Z" style={{fill: 'rgb(181, 91, 82)', transformOrigin: '83.6037px 306.352px'}} id="elxseiz949xsl" className="animable"></path>
        <path d="M83.71,299l1.54,1.25a88.78,88.78,0,0,1-7.81,6.08,17.74,17.74,0,0,0-1.91-1.62Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '80.39px 302.665px'}} id="elpol0asrd6a" className="animable"></path>
        <path d="M89.58,258.38c-.57.73-1.28,1.71-1.9,2.6s-1.28,1.83-1.9,2.75c-1.23,1.86-2.42,3.74-3.51,5.62A62.86,62.86,0,0,0,79.35,275a27,27,0,0,0-1.8,5l.09-1.72a5.92,5.92,0,0,0,.19,1.61,22.75,22.75,0,0,0,.69,2.41,56.54,56.54,0,0,0,2.18,5.4c.84,1.84,1.78,3.69,2.76,5.53s2,3.72,3,5.39l-12.2,8.05c-1.41-2-2.63-3.91-3.87-5.92s-2.41-4-3.55-6.12a73.36,73.36,0,0,1-3.21-6.71c-.49-1.21-1-2.47-1.38-3.87a24.3,24.3,0,0,1-.95-4.91l-.06-.7.15-1a42.22,42.22,0,0,1,2.33-8.73A80.36,80.36,0,0,1,67,261.25c1.15-2.35,2.37-4.62,3.64-6.84.63-1.11,1.28-2.22,2-3.31s1.31-2.13,2.12-3.35Z" style={{fill: 'rgb(126, 87, 194)', transformOrigin: '75.41px 277.21px'}} id="elf3kc6hcj7sb" className="animable"></path>
        <g id="elhs7bxjdjiy"><path d="M89.58,258.38c-.57.73-1.28,1.71-1.9,2.6s-1.28,1.83-1.9,2.75c-1.23,1.86-2.42,3.74-3.51,5.62A62.86,62.86,0,0,0,79.35,275a27,27,0,0,0-1.8,5l.09-1.72a5.92,5.92,0,0,0,.19,1.61,22.75,22.75,0,0,0,.69,2.41,56.54,56.54,0,0,0,2.18,5.4c.84,1.84,1.78,3.69,2.76,5.53s2,3.72,3,5.39l-12.2,8.05c-1.41-2-2.63-3.91-3.87-5.92s-2.41-4-3.55-6.12a73.36,73.36,0,0,1-3.21-6.71c-.49-1.21-1-2.47-1.38-3.87a24.3,24.3,0,0,1-.95-4.91l-.06-.7.15-1a42.22,42.22,0,0,1,2.33-8.73A80.36,80.36,0,0,1,67,261.25c1.15-2.35,2.37-4.62,3.64-6.84.63-1.11,1.28-2.22,2-3.31s1.31-2.13,2.12-3.35Z" style={{fill: 'rgb(255, 255, 255)', opacity: 0.7, transformOrigin: '75.41px 277.21px'}} className="animable"></path></g>
        <polygon points="138.39 397.53 127.76 399.72 133.12 411.75 142.01 409.93 138.39 397.53" style={{fill: 'rgb(181, 91, 82)', transformOrigin: '134.885px 404.64px'}} id="eluxabon1tio7" className="animable"></polygon>
        <g id="el5c59d60noen"><polygon points="138.39 397.53 127.75 399.73 130.76 406.46 140.42 404.48 138.39 397.53" style={{opacity: 0.2, transformOrigin: '134.085px 401.995px'}} className="animable"></polygon></g>
        <path d="M113.58,359.73c-5.3-16.47-18-33-17-49.26l35.41-.09s2.31,32.8,3.51,48c1.25,15.76,5.2,43.4,5.2,43.4l-12,3.22S112.66,377.37,113.58,359.73Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '118.612px 357.69px'}} id="el89fhwzn995q" className="animable"></path>
        <path d="M133.69,415.93l2.77-.73.24-1.06,1.59.58a29.85,29.85,0,0,0,14.16-4.79,7.25,7.25,0,0,0-2.21-2.64s-4.12,1-6.86.24a1.82,1.82,0,0,0-1.34.09c-1.71.84-6.3,2.91-9.47,2.63a.4.4,0,0,0-.41.55A33.62,33.62,0,0,1,133.69,415.93Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '142.29px 411.61px'}} id="elaeq2m0nglkc" className="animable"></path>
        <polygon points="96.42 399.02 85.54 399.13 86.06 411.96 95.15 411.89 96.42 399.02" style={{fill: 'rgb(181, 91, 82)', transformOrigin: '90.98px 405.49px'}} id="el8ywugzot3zd" className="animable"></polygon>
        <g id="elm428t4dr2q"><polygon points="96.42 399.03 85.54 399.13 85.83 406.32 95.71 406.23 96.42 399.03" style={{opacity: 0.2, transformOrigin: '90.98px 402.675px'}} className="animable"></polygon></g>
        <path d="M84.59,355.6c-.88-16.48-10.08-33.89-5.65-44.46l33.89-.76s-.32,31.83-3.84,47C105.33,373.21,96.73,404,96.73,404l-11.76,0S80.17,374.39,84.59,355.6Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '95.2852px 357.19px'}} id="eliz0671mac0o" className="animable"></path>
        <path d="M110.89,227.76c1.19,1.15,2,.46,1.93-1.12a3.13,3.13,0,0,1-.5,5.37c-2.22,1.26-4.72.55-5.59-.81l-.34-4.65C108.08,225.69,109.1,226.05,110.89,227.76Z" style={{fill: 'rgb(224, 224, 224)', transformOrigin: '110.254px 229.384px'}} id="el4yhec6f9zz" className="animable"></path>
        <path d="M105.93,222.72l1.77,4.55a4.15,4.15,0,0,0,2.61-1.46A10.2,10.2,0,0,0,105.93,222.72Z" style={{fill: 'rgb(160, 39, 36)', transformOrigin: '108.12px 224.995px'}} id="el14rbppqu3vf" className="animable"></path>
        <path d="M106.24,221.83c.21.54.67.86,1,.71s.47-.69.25-1.23-.67-.86-1-.72S106,221.29,106.24,221.83Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '106.861px 221.567px'}} id="elyawjgoi7go" className="animable"></path>
        <path d="M107.64,225.78a2.76,2.76,0,0,1-1.09-.24,5.54,5.54,0,0,1-2.73-3.1c-1-2.41-.42-4.9,1.19-5.56A2.48,2.48,0,0,1,107,217a5.54,5.54,0,0,1,2.73,3.1c1,2.41.42,4.9-1.19,5.56A2.22,2.22,0,0,1,107.64,225.78Zm-1.78-8.57a1.85,1.85,0,0,0-.66.13c-1.36.56-1.77,2.76-.91,4.91h0a5,5,0,0,0,2.46,2.83,2,2,0,0,0,1.55.07c1.36-.56,1.77-2.76.91-4.91a5,5,0,0,0-2.46-2.83A2.32,2.32,0,0,0,105.86,217.21Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '106.775px 221.256px'}} id="el8ifg9slpq1l" className="animable"></path>
        <path d="M106.3,219.42a.32.32,0,0,1-.31,0,2.69,2.69,0,0,0-2.42-.43.34.34,0,0,1-.44-.19.35.35,0,0,1,.19-.45,3.38,3.38,0,0,1,3.06.52.33.33,0,0,1,.08.47A.28.28,0,0,1,106.3,219.42Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '104.816px 218.825px'}} id="elzm6pg3q9wf" className="animable"></path>
        <path d="M87,227c3,6.47,5.25,10.79,10.2,12.06,9.85,2.52,13-2.92,12-10.18-1-6.53-5.77-16-13.29-16A9.84,9.84,0,0,0,87,227Z" style={{fill: 'rgb(181, 91, 82)', transformOrigin: '97.6984px 226.283px'}} id="elwhg38sc8wy" className="animable"></path>
        <path d="M108.68,243.56a6.38,6.38,0,0,0-3.05-2.89,5.9,5.9,0,0,1-.1-4L90.63,232c1.2,4.92,2.14,8.82.31,11.21,2.93,1.78,8.3,5,14.15,4.83S109.63,245.62,108.68,243.56Z" style={{fill: 'rgb(181, 91, 82)', transformOrigin: '100.071px 240.023px'}} id="el7wm31yo9qmk" className="animable"></path>
        <path d="M88.32,242.68c-.89-2.84.46-3.22.46-3.22s9.21-2.21,17.75,0,3.4,5.3,3.4,5.3Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '99.74px 241.619px'}} id="ellsng79fvn7" className="animable"></path>
        <path d="M103.44,226.1c.94-2.19,1-6.6-.84-8.8a1.84,1.84,0,0,1-.72,1.5c-.47-.7-3.39-2.65-7.5-2.56a2.51,2.51,0,0,1,.83,1s-6.44-1.07-9.92,1.56c0,0,.74,1,.2,1.66-1.27.72-1.79,1.61-1.28,4.54s4,8.06,7.39,11.26c6.34.36,9.73-2.23,9.73-2.23S105,230.2,103.44,226.1Z" style={{fill: 'rgb(224, 224, 224)', transformOrigin: '94.0498px 226.266px'}} id="elrvut8r7w5wm" className="animable"></path>
        <path d="M100.36,225.25h-.06a.24.24,0,0,1-.18-.3c.4-1.56,2.48-3.05,3.83-3.6,2-.85,5.13-2,5.16-2a.25.25,0,0,1,.17.47s-3.11,1.14-5.14,2c-1.22.5-3.18,1.88-3.54,3.26A.26.26,0,0,1,100.36,225.25Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '104.775px 222.294px'}} id="ele1wl58kclme" className="animable"></path>
        <path d="M99.5,226.29a6.76,6.76,0,0,0,3,3.7c1.78.93,2.77-1,2.37-3.16-.36-2-1.71-4.88-3.54-4.87S98.76,224.24,99.5,226.29Z" style={{fill: 'rgb(181, 91, 82)', transformOrigin: '102.087px 226.095px'}} id="elqqvb2pt6lvp" className="animable"></path>
        <path d="M113.44,243.11a137.47,137.47,0,0,0-30.24.48,10.2,10.2,0,0,0-8.49,12.15c4.7,23.68,2.38,52.21,2.87,56.89,0,0,29.56,7.28,56-.65,3.09-29-7.31-53.08-12.06-63.1A10.16,10.16,0,0,0,113.44,243.11Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '104.322px 279.09px'}} id="eld79z85c1fvt" className="animable"></path>
        <path d="M84.72,415.93h2.36l.6-1,1.28,1h15.21a6.54,6.54,0,0,0-.75-3.27s-5.21-.39-6.94-2.51a.55.55,0,0,0-.54-.22c-1.4.3-7,1.37-10.16.25a.49.49,0,0,0-.68.47A34.61,34.61,0,0,1,84.72,415.93Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '94.4469px 412.926px'}} id="el1qhepylukg4" className="animable"></path>
        <path d="M119.34,244.16c-12.27-6.46-36.45-3.73-41.79.17-10.19,7.45-.9,31.6-.82,54.65s-1.09,49.07-1.09,77.71c24.87,19,67.78-1.35,67.78-1.35S144,257.16,119.34,244.16Z" style={{fill: 'rgb(126, 87, 194)', transformOrigin: '108.1px 312.542px'}} id="elen9ajwwp09" className="animable"></path>
        <g id="eloeg1ludvgk"><path d="M119.34,244.16c-12.27-6.46-36.45-3.73-41.79.17-10.19,7.45-.9,31.6-.82,54.65s-1.09,49.07-1.09,77.71c24.87,19,67.78-1.35,67.78-1.35S144,257.16,119.34,244.16Z" style={{fill: 'rgb(255, 255, 255)', opacity: 0.8, transformOrigin: '108.1px 312.542px'}} className="animable"></path></g>
        <g id="el95cf473jttv"><path d="M128.72,256.77l-9.55,1.71a46.26,46.26,0,0,0,12.25,5.82A79.7,79.7,0,0,0,128.72,256.77Z" style={{fill: 'rgb(126, 87, 194)', opacity: 0.2, transformOrigin: '125.295px 260.535px'}} className="animable"></path></g>
        <path d="M160.52,225.52l-2.41.63a2.53,2.53,0,0,0-1.83,1.61l-1.14,3.6a4.26,4.26,0,0,0,1.14,4.24l.72.76c4.1-.83,7.61-4.29,7.61-4.29l1.14-.88a1.85,1.85,0,0,0,.08-3l-2.22-2A3.41,3.41,0,0,0,160.52,225.52Z" style={{fill: 'rgb(181, 91, 82)', transformOrigin: '160.767px 230.879px'}} id="ely6o8qgh0bt" className="animable"></path>
        <path d="M152,232.17l1.8-1.94a99.87,99.87,0,0,1,9.19,6.48,19.06,19.06,0,0,0-1.22,2.61Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '157.495px 234.775px'}} id="elvh88k3vd5r" className="animable"></path>
        <path d="M113.82,242.18c2,.38,4.19.75,6.29,1.09s4.23.68,6.33,1c4.21.62,8.43,1.17,12.44,1.49l-1.73.12c-.32.11,0,.09.54-.18a11.39,11.39,0,0,0,1.83-1.21,36.73,36.73,0,0,0,4.23-3.93c1.42-1.49,2.81-3.12,4.16-4.8.67-.84,1.34-1.7,2-2.56s1.31-1.79,1.85-2.55l12.34,7.84c-.73,1.19-1.35,2.16-2.05,3.22s-1.38,2.06-2.1,3.07c-1.43,2-2.94,4-4.6,6a53,53,0,0,1-5.64,5.87,28.29,28.29,0,0,1-3.8,2.86,17.64,17.64,0,0,1-5.89,2.42l-.61.13h-1.11c-4.73,0-9.22-.28-13.7-.59q-3.36-.24-6.69-.53c-2.24-.2-4.42-.41-6.71-.65Z" style={{fill: 'rgb(126, 87, 194)', transformOrigin: '137.65px 246.355px'}} id="el3ydykjbbinu" className="animable"></path>
        <g id="elcliuuknblsc"><path d="M113.82,242.18c2,.38,4.19.75,6.29,1.09s4.23.68,6.33,1c4.21.62,8.43,1.17,12.44,1.49l-1.73.12c-.32.11,0,.09.54-.18a11.39,11.39,0,0,0,1.83-1.21,36.73,36.73,0,0,0,4.23-3.93c1.42-1.49,2.81-3.12,4.16-4.8.67-.84,1.34-1.7,2-2.56s1.31-1.79,1.85-2.55l12.34,7.84c-.73,1.19-1.35,2.16-2.05,3.22s-1.38,2.06-2.1,3.07c-1.43,2-2.94,4-4.6,6a53,53,0,0,1-5.64,5.87,28.29,28.29,0,0,1-3.8,2.86,17.64,17.64,0,0,1-5.89,2.42l-.61.13h-1.11c-4.73,0-9.22-.28-13.7-.59q-3.36-.24-6.69-.53c-2.24-.2-4.42-.41-6.71-.65Z" style={{fill: 'rgb(255, 255, 255)', opacity: 0.8, transformOrigin: '137.65px 246.355px'}} className="animable"></path></g></g>
      <g id="freepik--character-2--inject-63" className="animable animator-hidden" style={{transformOrigin: '327.828px 274.624px'}}>
        <g id="el3we4ae7njl5"><path d="M368,318l.42,15.6H326.46l-.68-25.29H365.7l-.54-2.29H325.72l-.67-25.29h21.24c0-.77,0-1.54,0-2.3H325l-.64-23.86h-3.41L325.21,415h3.42L328,391.11h41.92l.64,23.85H374l-2.14-80.43Zm-41.44,17.9h41.92l.67,25.29H327.19Zm1.41,52.88-.67-25.29h41.92l.67,25.29Z" style={{opacity: 0.2, transformOrigin: '347.475px 334.785px'}} className="animable"></path></g>
        <path d="M396.22,422.8h3.42L370.42,254.6H367l4.34,25H329.43l-4.34-25h-3.42l29.22,168.2h3.41l-4.34-25h41.92Zm-14.39-82.89,4.6,26.52H344.51l-4.6-26.52Zm-42.34-2.42L334.88,311H376.8l4.61,26.52ZM371.77,282l4.61,26.53H334.46L329.85,282ZM349.54,395.37l-4.61-26.53h41.92l4.61,26.53Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '360.655px 338.7px'}} id="elw6hr4s3g5e" className="animable"></path>
        <path d="M376.76,224.23l-.63-2.11a2.56,2.56,0,0,1,.42-2.31l2.36-3.06a4.77,4.77,0,0,1,4-1.85l1,0c1.3,3.42.18,8.08.18,8.08l-.17,1.36a2.13,2.13,0,0,1-2.35,1.91l-2.71-.3A2.47,2.47,0,0,1,376.76,224.23Z" style={{fill: 'rgb(127, 62, 59)', transformOrigin: '380.278px 220.579px'}} id="elfa75r8s68ja" className="animable"></path>
        <path d="M380.12,214.82,379,216.49a89.26,89.26,0,0,0,9.41,3.83,17.87,17.87,0,0,1,1.44-2.14Z" style={{fill: 'rgb(255, 255, 255)', transformOrigin: '384.425px 217.57px'}} id="el89002mrgmv9" className="animable"></path>
        <path d="M372.5,164.53c1.84,1.6,3.56,3.15,5.3,4.76s3.46,3.22,5.16,4.88a138,138,0,0,1,10,10.62l.53.64.25.49a16.25,16.25,0,0,1,1.66,5.81,28.55,28.55,0,0,1,.08,4.68,54.55,54.55,0,0,1-1.19,8.14c-.55,2.58-1.22,5.07-2,7.52s-1.52,4.81-2.46,7.34l-11-3.95c.66-2.06,1.32-4.38,1.87-6.58s1-4.47,1.41-6.66a42.71,42.71,0,0,0,.64-6.31,15.47,15.47,0,0,0-.16-2.6,2.66,2.66,0,0,0-.35-1.15l.79,1.13a126,126,0,0,0-9.49-9c-1.69-1.47-3.41-2.91-5.15-4.34s-3.52-2.86-5.23-4.19Z" style={{fill: 'rgb(126, 87, 194)', transformOrigin: '379.35px 191.97px'}} id="elmmhjco1sd2d" className="animable"></path>
        <g id="eleu28fz1f5j"><path d="M372.5,164.53c1.84,1.6,3.56,3.15,5.3,4.76s3.46,3.22,5.16,4.88a138,138,0,0,1,10,10.62l.53.64.25.49a16.25,16.25,0,0,1,1.66,5.81,28.55,28.55,0,0,1,.08,4.68,54.55,54.55,0,0,1-1.19,8.14c-.55,2.58-1.22,5.07-2,7.52s-1.52,4.81-2.46,7.34l-11-3.95c.66-2.06,1.32-4.38,1.87-6.58s1-4.47,1.41-6.66a42.71,42.71,0,0,0,.64-6.31,15.47,15.47,0,0,0-.16-2.6,2.66,2.66,0,0,0-.35-1.15l.79,1.13a126,126,0,0,0-9.49-9c-1.69-1.47-3.41-2.91-5.15-4.34s-3.52-2.86-5.23-4.19Z" style={{fill: 'rgb(255, 255, 255)', opacity: 0.7, transformOrigin: '379.35px 191.97px'}} className="animable"></path></g>
        <path d="M361.57,149.87c-.85,3.9-1.77,11.06.9,13.66,0,0-3.73-.56-11.32,4.3-2.45-3.26-.81-4.3-.81-4.3,4.37-1,4.33-4.27,3.64-7.3Z" style={{fill: 'rgb(127, 62, 59)', transformOrigin: '356.136px 158.85px'}} id="elest2y1shzf8" className="animable"></path>
        <path d="M347.23,143.34c-.1.52-.45.9-.79.85s-.54-.53-.44-1.06.45-.9.79-.84S347.33,142.82,347.23,143.34Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '346.615px 143.239px'}} id="eli84i6expc8r" className="animable"></path>
        <path d="M346.92,139.92a.36.36,0,0,1-.21-.11.31.31,0,0,1,.07-.43,3.22,3.22,0,0,1,2.83-.57.29.29,0,0,1,.19.39.32.32,0,0,1-.4.19,2.59,2.59,0,0,0-2.24.47A.28.28,0,0,1,346.92,139.92Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '348.237px 139.312px'}} id="el38lvg53u4uu" className="animable"></path>
        <path d="M346.83,144.31a14.68,14.68,0,0,1-2.48,3,2.23,2.23,0,0,0,1.79.66Z" style={{fill: 'rgb(99, 15, 15)', transformOrigin: '345.59px 146.144px'}} id="elzkk5ppb0utm" className="animable"></path>
        <path d="M346.94,142.34l-1.19-.57S346.21,142.86,346.94,142.34Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '346.345px 142.125px'}} id="elazhq15eapgf" className="animable"></path>
        <path d="M364.82,144.29c-1.44,6.17-1.91,8.81-5.63,11.49-5.6,4-12.94.94-13.39-5.52-.41-5.82,2-14.92,8.6-16.4A8.66,8.66,0,0,1,364.82,144.29Z" style={{fill: 'rgb(127, 62, 59)', transformOrigin: '355.405px 145.6px'}} id="eljtn3eck6yi" className="animable"></path>
        <path d="M350.34,145.05c-1.68-.4-.69-5.34,0-6.36-3.37-.95-5.95-3.68-2.1-6.3s7.21-3.6,8.95-2.44c1.05-3,7.87-1.65,11.21,3.69,3.17,5.05.7,9.09-1.57,9.26,3.6,3-1.1,8.77-5.17,9.93-.23,4-7.14,4.18-10.27,1.16S350.34,145.05,350.34,145.05Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '358.113px 142.225px'}} id="elvgtopdam95" className="animable"></path>
        <path d="M353.08,146.08a4.13,4.13,0,0,1-2.28,2.62c-1.39.54-2.29-1.06-2.07-2.78.2-1.55,1.15-3.7,2.63-3.49S353.57,144.53,353.08,146.08Z" style={{fill: 'rgb(127, 62, 59)', transformOrigin: '350.964px 145.611px'}} id="eljj7h0jteix" className="animable"></path>
        <path d="M395.78,330.57c4.08-2.58,3.43-3.63,5.67-5.16,1.92-1.31,2.56-1.36,4.12-2.39,1.3-.86.38-2.14-1-3.38-.71-.63-1.64-1.35-2.73-2.39l-6.2,3.92c.26,2.2-.28,5.67-2.37,7.44S394.15,331.6,395.78,330.57Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '399.373px 324.099px'}} id="el002rlvf0o7d9m" className="animable"></path>
        <path d="M344.07,337.49c6.94,0,6.49-.21,9.22-.26,2,0,1.45.26,5.17.26,1.57,0,1.71-1.77,1.13-3.1a23.16,23.16,0,0,1-1.55-3.62h-6.71c-1.19,2.13-4.48,3.7-8.17,4C340.53,334.93,342.12,337.49,344.07,337.49Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '350.841px 334.13px'}} id="elwdm8p9f931" className="animable"></path>
        <path d="M342.11,204.91s-.78,35,1.42,57.22c0,20.86,7.81,68.64,7.81,68.64.16,1.07,5.76.64,6.7,0,0,0,4.28-35-.56-68.83,11.46-35.3,10.57-57,10.57-57Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '355.021px 268.166px'}} id="eliukykt7fow" className="animable"></path>
        <path d="M349.09,204.91s13.44,39.5,19.07,58.9c5.9,20.37,20.45,45.41,27.46,57.36,1.33,0,4.72-2.12,6.2-3.92-7.61-13.51-7.82-32.44-19.41-52.54.11-48.25-7.77-59.8-7.77-59.8Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '375.455px 263.04px'}} id="el90g42uuqe0k" className="animable"></path>
        <path d="M393.55,319.07a20.87,20.87,0,0,1,1.36,2.5.6.6,0,0,0,.79.33,26.28,26.28,0,0,0,6.36-4.53.56.56,0,0,0,.11-.65L401,314.28a.6.6,0,0,0-.86-.26l-6.48,4.28A.55.55,0,0,0,393.55,319.07Z" style={{fill: 'rgb(126, 87, 194)', transformOrigin: '397.834px 317.939px'}} id="el7fl4bu0cr7q" className="animable"></path>
        <g id="elw1k3wnwrgfg"><path d="M393.55,319.07a20.87,20.87,0,0,1,1.36,2.5.6.6,0,0,0,.79.33,26.28,26.28,0,0,0,6.36-4.53.56.56,0,0,0,.11-.65L401,314.28a.6.6,0,0,0-.86-.26l-6.48,4.28A.55.55,0,0,0,393.55,319.07Z" style={{fill: 'rgb(255, 255, 255)', opacity: 0.3, transformOrigin: '397.834px 317.939px'}} className="animable"></path></g>
        <path d="M350.24,328.28c0,.73.05,2,0,3a.6.6,0,0,0,.56.61,40.36,40.36,0,0,0,7.39-.44.55.55,0,0,0,.46-.47l.36-2.62a.61.61,0,0,0-.61-.68l-7.65.07A.56.56,0,0,0,350.24,328.28Z" style={{fill: 'rgb(126, 87, 194)', transformOrigin: '354.627px 329.796px'}} id="elq3h95ebgc5" className="animable"></path>
        <g id="el53l2neyy18v"><path d="M350.24,328.28c0,.73.05,2,0,3a.6.6,0,0,0,.56.61,40.36,40.36,0,0,0,7.39-.44.55.55,0,0,0,.46-.47l.36-2.62a.61.61,0,0,0-.61-.68l-7.65.07A.56.56,0,0,0,350.24,328.28Z" style={{fill: 'rgb(255, 255, 255)', opacity: 0.3, transformOrigin: '354.627px 329.796px'}} className="animable"></path></g>
        <path d="M339,173.46c.06,2.63.13,5.95.82,12.22.48,5.31,1.12,10.53,2.34,19.23h32.53c-.93-7.52-5.16-16.1-1.25-33a6.58,6.58,0,0,0-5.75-8.1c-1.06-.1-2.19-.19-3.34-.25a101.53,101.53,0,0,0-13.29,0c-1.32.12-2.67.29-4,.47A9.42,9.42,0,0,0,339,173.46Z" style={{fill: 'rgb(126, 87, 194)', transformOrigin: '356.845px 184.126px'}} id="ela8yphph2lt" className="animable"></path>
        <path d="M285.11,195a13.41,13.41,0,0,0,3.31,2.74A13.57,13.57,0,0,0,299,199.1l-.48-5.88a8.34,8.34,0,0,1-3.94,1.37,8.1,8.1,0,0,1-.85,0,8.34,8.34,0,1,1,2.85-16.23l.74.28L296,162.73,280,164h0a9.85,9.85,0,0,0,.37-.95,8.5,8.5,0,0,0,.34-3.16,8.35,8.35,0,0,0-9-7.63,9,9,0,0,0-1.9.39,8.3,8.3,0,0,0-5.32,10.57.65.65,0,0,0,0,.13.14.14,0,0,0,0,.06,8.12,8.12,0,0,0,.9,1.79l-15.93,1.31,1.31,15.93c.22-.15.45-.27.68-.4a8.34,8.34,0,1,1,.52,14.95l.51,6.2c5.77-1.57,11.85-3.45,18.07-5.55A13.64,13.64,0,0,0,285.11,195Z" style={{fill: 'rgb(255, 255, 255)', transformOrigin: '274.23px 177.711px'}} id="el4uax8ulmx3" className="animable"></path>
        <path d="M291.75,173.19l2.17-.39a2.54,2.54,0,0,1,2.24.68l2.77,2.7a4.8,4.8,0,0,1,1.39,4.16l-.15.95c-3.55.89-8-.76-8-.76l-1.34-.33a2.14,2.14,0,0,1-1.63-2.55l.62-2.65A2.44,2.44,0,0,1,291.75,173.19Z" style={{fill: 'rgb(127, 62, 59)', transformOrigin: '294.763px 177.155px'}} id="elpx36vxfzqwi" className="animable"></path>
        <path d="M300.71,177.61l-1.53-1.35a91.82,91.82,0,0,0-4.89,8.91,19.09,19.09,0,0,1,2,1.67Z" style={{fill: 'rgb(255, 255, 255)', transformOrigin: '297.5px 181.55px'}} id="elslvj28omgge" className="animable"></path>
        <path d="M347.73,162.18c-7,1-11.57,5.8-12.23,21.49a329.63,329.63,0,0,0,1.19,35.24c-1,28.34-2.66,68.18,2.26,81.47,17.85,6.62,46.87-2.68,60.43-9.53-4.39-10-13.43-44.52-17.61-71.67-2.19-14.27-4.89-36.33-5.53-45.44s-5.38-10.94-9.9-11.85S355.24,161.12,347.73,162.18Z" style={{fill: 'rgb(126, 87, 194)', transformOrigin: '367.408px 231.968px'}} id="el9jnck4jvszq" className="animable"></path>
        <g id="el4g8qy70npzx"><path d="M347.73,162.18c-7,1-11.57,5.8-12.23,21.49a329.63,329.63,0,0,0,1.19,35.24c-1,28.34-2.66,68.18,2.26,81.47,17.85,6.62,46.87-2.68,60.43-9.53-4.39-10-13.43-44.52-17.61-71.67-2.19-14.27-4.89-36.33-5.53-45.44s-5.38-10.94-9.9-11.85S355.24,161.12,347.73,162.18Z" style={{fill: 'rgb(255, 255, 255)', opacity: 0.8, transformOrigin: '367.408px 231.968px'}} className="animable"></path></g>
        <g id="elah76dpja0me"><path d="M335.5,183.65v0c-.09,2.12-.12,5.15-.08,8.72,5.56-4.6,8.1-12.36,8.1-12.36Z" style={{fill: 'rgb(126, 87, 194)', opacity: 0.2, transformOrigin: '339.461px 186.19px'}} className="animable"></path></g>
        <path d="M350.76,176.15c-1.74,1.64-3.4,3.14-5.12,4.67s-3.46,3-5.23,4.49a122.62,122.62,0,0,1-11.35,8.53l-.71.45-.51.19a16.29,16.29,0,0,1-6,1,27.51,27.51,0,0,1-4.66-.47,54.53,54.53,0,0,1-8-2.11c-2.5-.85-4.89-1.8-7.25-2.82s-4.6-2.06-7-3.29l5.19-10.43c2,.89,4.2,1.82,6.32,2.62s4.32,1.55,6.46,2.17a42.14,42.14,0,0,0,6.19,1.37,15.34,15.34,0,0,0,2.6.14,3,3,0,0,0,1.19-.21l-1.22.65a109.08,109.08,0,0,0,9.53-8.12c1.57-1.46,3.12-3,4.65-4.49s3.07-3.1,4.48-4.6Z" style={{fill: 'rgb(126, 87, 194)', transformOrigin: '322.845px 180.687px'}} id="elgit2h00nn9" className="animable"></path>
        <g id="eltrjfonmyqwe"><path d="M350.76,176.15c-1.74,1.64-3.4,3.14-5.12,4.67s-3.46,3-5.23,4.49a122.62,122.62,0,0,1-11.35,8.53l-.71.45-.51.19a16.29,16.29,0,0,1-6,1,27.51,27.51,0,0,1-4.66-.47,54.53,54.53,0,0,1-8-2.11c-2.5-.85-4.89-1.8-7.25-2.82s-4.6-2.06-7-3.29l5.19-10.43c2,.89,4.2,1.82,6.32,2.62s4.32,1.55,6.46,2.17a42.14,42.14,0,0,0,6.19,1.37,15.34,15.34,0,0,0,2.6.14,3,3,0,0,0,1.19-.21l-1.22.65a109.08,109.08,0,0,0,9.53-8.12c1.57-1.46,3.12-3,4.65-4.49s3.07-3.1,4.48-4.6Z" style={{fill: 'rgb(255, 255, 255)', opacity: 0.8, transformOrigin: '322.845px 180.687px'}} className="animable"></path></g>
        <path d="M363.94,129.93c-2.22-.65-5.09,1.69-3.92,5.18s4.64,5.14,7.37,4S368.85,131.35,363.94,129.93Z" style={{fill: 'rgb(126, 87, 194)', transformOrigin: '364.276px 134.645px'}} id="elp751eqjtoh" className="animable"></path>
        <path d="M362.35,135.08c-1.49-5.83,6-14.14,9.61-3.52C374.18,138.11,363.78,140.64,362.35,135.08Z" style={{fill: 'rgb(38, 50, 56)', transformOrigin: '367.213px 132.292px'}} id="el883golhh1qg" className="animable"></path>
      </g>
      <defs>
        <filter id="active" height="200%">
          <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="2"></feMorphology>
          <feFlood floodColor="#32DFEC" floodOpacity="1" result="PINK"></feFlood>
          <feComposite in="PINK" in2="DILATED" operator="in" result="OUTLINE"></feComposite>
          <feMerge>
            <feMergeNode in="OUTLINE"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
        <filter id="hover" height="200%">
          <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="2"></feMorphology>
          <feFlood floodColor="#ff0000" floodOpacity="0.5" result="PINK"></feFlood>
          <feComposite in="PINK" in2="DILATED" operator="in" result="OUTLINE"></feComposite>
          <feMerge>
            <feMergeNode in="OUTLINE"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0 "></feColorMatrix>
        </filter>
      </defs>
    </svg>
  );
}