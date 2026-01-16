"use client";
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Check, Users, Heart, BrainCircuit, Waves, GitCommit, UserCheck, ShieldCheck, Calendar, Globe, PencilRuler, Monitor, Users as UsersIcon, CalendarDays, CheckCircle, Star, Quote, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { SlideUp, StaggerContainer, StaggerItem, CharReveal } from '../components/common/RevealComponent';
import SectionDivider from '../components/common/SectionDivider';

import therapyApproachesData from '../../../data/therapyApproaches.json';
import testimonialsData from '../../../data/testimonials.json';


const RevealOnScrollImage = ({ src, alt, className, ...props }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.2 } 
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          className={`${className} animate-in fade-in duration-700 slide-in-from-bottom-4`}
          {...props}
        />
      )}
    </div>
  );
};

export default function ServicesPage() {
  
  const therapyApproaches = therapyApproachesData;
  const testimonials = testimonialsData;

  
  const [isMobile, setIsMobile] = useState(false);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      if (width < 768) {
        setItemsPerSlide(1); 
      } else if (width < 1024) {
        setItemsPerSlide(2); 
      } else {
        setItemsPerSlide(3); 
      }
    };

    
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  const baseDelay = isMobile ? 0 : 0.1;
  const staggerDelay = isMobile ? 0.05 : 0.1;

  const clientGroups = [
    {
      title: 'Children (5+)',
      description: 'Age-appropriate support focusing on emotional understanding, behavioral challenges, and healthy development in a safe and nurturing environment.',
      image: '/images/clients/child.webp'
    },
    {
      title: 'Teens',
      description: 'Support for emotional regulation, self-identity, academic stress, peer relationships, and life transitions.',
      image: '/images/clients/teenager.webp'
    },
    {
      title: 'Adults (up to 65 years)',
      description: 'Guidance for managing stress, emotional well-being, personal challenges, and life changes with clarity and resilience.',
      image: '/images/clients/adult.webp'
    },
    {
      title: 'Couples',
      description: 'Support for improving communication, emotional connection, conflict resolution, and relationship satisfaction.',
      image: '/images/clients/couple.webp'
    },
    {
      title: 'Families',
      description: 'Collaborative sessions aimed at strengthening family dynamics, understanding emotional needs, and building healthier relationships within the family system.',
      image: '/images/clients/family.webp'
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

  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);

  
  const slidesCount = Math.ceil(testimonials.length / itemsPerSlide);

  
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
    
    <main className="min-h-screen bg-[#F9F6FF]">
      
      {}
      <section className="relative overflow-visible pt-32 pb-12 sm:pt-40 sm:pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1440px] mx-auto w-full relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

            {}
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

            {}
            <div className="relative h-[300px] sm:h-[500px] w-full flex items-center justify-center lg:justify-end perspective-1000 lg:pr-40">
              <SlideUp delay={baseDelay} className="w-full h-full relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full h-full flex items-center justify-center scale-[0.65] sm:scale-100 origin-center lg:origin-right">
                  {}
                  <div
                    className="absolute w-[240px] sm:w-[280px] aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden transform -rotate-12 translate-x-[-100px] sm:translate-x-[-150px] translate-y-[20px] opacity-90 animate-float-slow z-0 border-4 border-white cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-4 hover:rotate-[-5deg] hover:z-30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ease-out"
                    onClick={() => setSelectedImage('/assets/services1.webp')}
                  >
                    <Image
                      src="/assets/services1.webp"
                      alt="Service 1"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {}
                  <div
                    className="absolute w-[240px] sm:w-[280px] aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden transform -rotate-6 translate-x-[0px] translate-y-[-20px] z-10 border-4 border-white animate-float-medium cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-4 hover:rotate-0 hover:z-30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ease-out"
                    onClick={() => setSelectedImage('/assets/services2.webp')}
                  >
                    <Image
                      src="/assets/services2.webp"
                      alt="Service 2"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {}
                  <div
                    className="absolute w-[240px] sm:w-[280px] aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden transform rotate-6 translate-x-[100px] sm:translate-x-[130px] translate-y-[40px] z-20 border-4 border-white animate-float-fast cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-4 hover:rotate-[5deg] hover:z-30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ease-out"
                    onClick={() => setSelectedImage('/assets/services3.webp')}
                  >
                    <Image
                      src="/assets/services3.webp"
                      alt="Service 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </SlideUp>
            </div>
          </div>

          {}
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

          {}
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

          {}
          <div className="pt-20 sm:pt-32"></div>

          {}
          {}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10 sm:mb-16 max-w-7xl mx-auto px-4">
            
            {}
            <div className="hidden lg:flex justify-center items-center order-1 lg:col-span-3">
              <SlideUp delay={baseDelay + 0.2}>
                <div className="relative w-52 h-52 xl:w-72 xl:h-72">
                    {}
                    <RevealOnScrollImage 
                      src="/assets/services1.svg" 
                      alt="Mental Health Illustration Left" 
                      fill 
                      className="object-contain" 
                    />
                </div>
              </SlideUp>
            </div>

            {}
            <div className="flex flex-col items-center text-center order-2 lg:col-span-6 z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] leading-tight sm:leading-[1.1] font-bold tracking-tight mb-4 sm:mb-6 md:mb-8 flex flex-col items-center">
                <div className="text-[#3F2965] mb-1 sm:mb-2">
                  <CharReveal className="justify-center" delay={baseDelay}>Our Therapeutic</CharReveal>
                </div>
                <div className="text-[#Dd1764]">
                  <CharReveal className="justify-center" delay={baseDelay + 0.1}>Services</CharReveal>
                </div>
              </h2>

              <SlideUp delay={baseDelay + 0.2}>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-[#3F2965]/70 font-medium">
                  Explore our evidence-based therapeutic approaches designed to support your unique healing journey
                </p>
              </SlideUp>
            </div>

            {}
            <div className="hidden lg:flex justify-center items-center order-3 lg:col-span-3">
              <SlideUp delay={baseDelay + 0.3}>
                <div className="relative w-52 h-52 xl:w-72 xl:h-72">
                    {}
                    <RevealOnScrollImage 
                      src="/assets/services2.svg" 
                      alt="Mental Health Illustration Right" 
                      fill 
                      className="object-contain" 
                    />
                 </div>
              </SlideUp>
            </div>

          </div>

          {}
          <StaggerContainer 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" 
            delay={staggerDelay}
          >
            {therapyApproaches.map((therapy) => (
              <StaggerItem key={therapy.id} className="h-full">
                <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white border border-[#3F2965]/5">
                  {}
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

                    {}
                    <div className="mt-auto space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        {}
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

                        {}
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

                      {}
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
<SectionDivider/>
      {}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 bg-[#F9F6FF]">
        <div className="max-w-7xl mx-auto">
          {}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {}
            <div className="hidden lg:flex justify-center items-center order-1 lg:col-span-4">
              <SlideUp delay={baseDelay + 0.1}>
                <div className="relative w-64 h-64 xl:w-80 xl:h-80">
                  {}
                  <RevealOnScrollImage
                    src="/assets/peace-of-mind-animate.svg"
                    alt="Peace of Mind Illustration"
                    fill
                    className="object-contain"
                  />
                </div>
              </SlideUp>
            </div>

            {}
            <div className="flex flex-col items-center text-center order-2 lg:col-span-8 z-10">
              <SlideUp delay={baseDelay}>
                {}
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

          </div>
        </div>
      </section>
<SectionDivider/>
      {}
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
<SectionDivider/>
      {}
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

          {}
          <div className="max-w-4xl mx-auto">
            {}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8" delay={staggerDelay}>
              {whatToExpect.slice(0, 2).map((item) => (
                <StaggerItem key={item.title}>
                  {}
                  <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-[#3F2965]/10 hover:border-[#3F2965]/20 hover:-translate-y-1 h-full">
                    <div className="flex flex-col items-center text-center">
                      {}
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

            {}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" delay={staggerDelay + 0.1}>
              {whatToExpect.slice(2, 5).map((item) => (
                <StaggerItem key={item.title}>
                  {}
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-[#3F2965]/10 hover:border-[#3F2965]/20 hover:-translate-y-1 h-full">
                    <div className="flex flex-col items-center text-center">
                      {}
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
<SectionDivider/>
      {}
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

                      <div className="min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="text-sm text-[#3F2965]/70 truncate">{testimonial.role}</span>
                          <span className="hidden sm:block text-[#3F2965]/30">•</span>

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
                  <span>Book Your First Session</span>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}