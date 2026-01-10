'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Zap, Users, Shield, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser'; 

import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '@/hooks/use-toast';
import workshopsData from '@/data/workshops.json';
import Image from 'next/image';

const corporateFormSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters.'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type CorporateFormValues = z.infer<typeof corporateFormSchema>;

// Faster Scroll reveal animation component
const FastScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Faster Staggered reveal for lists
const FastStaggerReveal = ({ children, index }: { children: React.ReactNode; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

type CarouselItem = {
  type?: 'intro';
  title: string;
  description: string;
  image: string;
  stats?: Array<{ label: string; value: string }>;
  highlight?: string;
};

// Full-width Carousel component with smooth transitions and rounded borders
const CorporateWellnessCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const carouselItems: CarouselItem[] = [
    {
      type: 'intro',
      title: "Corporate Wellness Programs",
      description: "Invest in your team's most valuable asset: their mental well-being. We partner with organizations to build healthier, more resilient workplaces.",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
      stats: [
        { label: "Employee Satisfaction", value: "89%" },
        { label: "Productivity Increase", value: "25%" },
        { label: "Stress Reduction", value: "33%" }
      ]
    },
    {
      title: "Increased Productivity",
      description: "Companies with wellness programs see up to 25% increase in employee productivity and 30% reduction in healthcare costs.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
      highlight: "25% Productivity Boost"
    },
    {
      title: "Reduced Absenteeism",
      description: "Wellness initiatives can reduce absenteeism by up to 28% through better health management and preventive care.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
      highlight: "28% Less Absenteeism"
    },
    {
      title: "Higher Retention",
      description: "87% of employees consider health and wellness offerings when choosing an employer, leading to 40% lower turnover.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
      highlight: "40% Lower Turnover"
    },
    {
      title: "Better Mental Health",
      description: "Mental wellness programs reduce stress levels by 33% and improve focus by 42%, creating healthier work environments.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2032&auto=format&fit=crop",
      highlight: "42% Better Focus"
    },
    {
      title: "ROI on Wellness",
      description: "For every $1 invested in employee wellness, companies see an average return of $3-4 in reduced costs and increased productivity.",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
      highlight: "$3-4 ROI per $1"
    }
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-rotate slides every 6 seconds
  useEffect(() => {
    if (isAnimating) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 max-w-[1600px] mx-auto">
      {/* ROUNDED BORDERS APPLIED HERE */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[3rem] shadow-xl">
        
        {/* Simple fade transition without complex animations */}
        <div className="relative w-full h-full">
          {/* All slides stacked, only current one visible */}
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background Image with smooth loading */}
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url('${item.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              
              {/* Light overlay for better text readability */}
              <div className="absolute inset-0 bg-black/60" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 py-8">
                  <div className="max-w-4xl mx-auto text-center">
                    {item.type === 'intro' ? (
                      <>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                          {item.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                          {item.stats?.map((stat, idx) => (
                            <div
                              key={idx}
                              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6 min-w-[140px] md:min-w-[180px]"
                            >
                              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                              <div className="text-white/80 text-sm md:text-base mt-2">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="inline-block bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                          <span className="text-white font-semibold text-sm md:text-base">{item.highlight}</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                          {item.title}
                        </h2>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                          {item.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots indicator - Suppress Hydration Warning Added */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              suppressHydrationWarning
              className={`transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 h-2 bg-white rounded-full' 
                  : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/70'
              } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation buttons - Suppress Hydration Warning Added */}
        <button
          onClick={prevSlide}
          disabled={isAnimating}
          suppressHydrationWarning
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow-2xl flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-purple-700" />
        </button>
        <button
          onClick={nextSlide}
          disabled={isAnimating}
          suppressHydrationWarning
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow-2xl flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-purple-700" />
        </button>
      </div>
    </div>
  );
};

export default function CorporatePage() {
  const { toast } = useToast();
  const form = useForm<CorporateFormValues>({
    resolver: zodResolver(corporateFormSchema),
    defaultValues: { companyName: '', contactName: '', email: '', message: '' },
  });

  const onSubmit = async (data: CorporateFormValues) => {
    try {
      // ---------------------------------------------------------
      // 🔑 EMAILJS CONFIGURATION (ENV VARS)
      // ---------------------------------------------------------
      // We use the non-null assertion (!) because we assume these are set.
      // If not, it's better to fail fast in development.
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID_2!; 
      const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_2!; 
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY_2!; 

      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        throw new Error("EmailJS environment variables are missing.");
      }

      const templateParams = {
        company_name: data.companyName,
        contact_name: data.contactName,
        from_email: data.email,
        message: data.message,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      toast({
        title: 'Inquiry Sent Successfully! 🚀',
        description: `Thanks ${data.contactName}! We have received your inquiry.`,
        className: "bg-[#3F2965] text-white border-none",
      });
      
      form.reset();
    } catch (error: any) {
      console.error('❌ EMAILJS ERROR:', error);

      let errorMessage = "Failed to send. Please check your internet connection.";
      
      if (error?.text) {
        errorMessage = error.text; 
      } else if (error?.message) {
        errorMessage = error.message; 
      } else if (Object.keys(error).length === 0) {
        errorMessage = "Request blocked by AdBlocker. Please disable it and retry.";
      }

      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const offerings = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Interactive Workshops',
      description: 'Engaging workshops on topics like stress management, resilience, and mindfulness.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Group Sessions',
      description: 'Confidential group counseling sessions to foster team cohesion and support.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Mental Health First Aid',
      description: 'Training programs to equip employees with skills to support their peers.',
    },
  ];

  // Use the data from JSON file
  const workshopCategories = workshopsData.workshops;

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-24">
      {/* Full-width Carousel Section */}
      <CorporateWellnessCarousel />

      {/* What We Offer section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <FastScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold sm:text-4xl" style={{ color: '#3f2965' }}>
                What We <span style={{ color: '#de206a' }}>Offer</span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg" style={{ color: '#766693' }}>
                Comprehensive wellness solutions tailored to your organization's needs
              </p>
            </div>
          </FastScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offerings.map((offering, index) => (
              <FastScrollReveal key={offering.title} delay={index * 0.1}>
                <motion.div 
                  className="group p-6 rounded-xl border border-pink-100 hover:border-pink-300 hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: '#f9f6ff' }}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-b from-pink-100 to-purple-100 mb-4 group-hover:from-pink-200 group-hover:to-purple-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-pink-600">
                      {offering.icon}
                    </div>
                  </motion.div>
                  <h3 className="mt-4 font-headline text-xl font-bold" style={{ color: '#3f2965' }}>{offering.title}</h3>
                  <p className="mt-2 leading-relaxed" style={{ color: '#766693' }}>{offering.description}</p>
                </motion.div>
              </FastScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Workshop section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <FastScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl flex items-center justify-center" style={{ color: '#3f2965' }}>
                Our <span style={{ color: '#de206a' }}> Workshop </span> Offerings 
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg leading-8" style={{ color: '#766693' }}>
                Customizable sessions to address the unique challenges of your workplace
              </p>
            </div>
          </FastScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshopCategories.map((category, index) => (
              <FastScrollReveal key={category.id} delay={index * 0.05}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="h-full"
                >
                  <Card 
                    className="flex flex-col h-full shadow-sm border-pink-100 hover:shadow-md hover:border-pink-300 transition-all duration-200 group"
                    style={{ backgroundColor: '#f9f6ff' }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3 mb-2">
                        <motion.div 
                          className="w-2 h-8 rounded-full bg-purple-500"
                          whileHover={{ scaleY: 1.2 }}
                          transition={{ duration: 0.2 }}
                        />
                        <CardTitle className="font-headline text-xl" style={{ color: '#3f2965' }}>
                          {category.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="leading-relaxed" style={{ color: '#766693' }}>
                        {category.purpose}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-grow flex-col">
                      <div className="mb-3">
                        <h4 className="font-semibold mb-3" style={{ color: '#3f2965' }}>Topics Include:</h4>
                        <ul className="space-y-2">
                          {category.examples.map((example, idx) => (
                            <FastStaggerReveal key={`${category.id}-${idx}`} index={idx}>
                              <motion.li 
                                className="flex items-start gap-3"
                                whileHover={{ x: 3 }}
                              >
                                <motion.div 
                                  className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center mt-0.5 group-hover:bg-pink-200 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <Check className="h-3 w-3 text-pink-600" />
                                </motion.div>
                                <span className="text-sm" style={{ color: '#766693' }}>{example}</span>
                              </motion.li>
                            </FastStaggerReveal>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </FastScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Form section with background image */}
      <div className="py-16 sm:py-24 relative overflow-hidden">
        {/* Background image with overlay - very light */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/95"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <FastScrollReveal>
                <div className="text-center mb-10">
                  <h2 className="font-headline text-3xl font-bold" style={{ color: '#3f2965' }}>
                    <span style={{ color: '#de206a' }}>Partner</span> With <span style={{ color: '#de206a' }}>Us</span>
                  </h2>
                  <p className="mt-3 text-lg max-w-xl mx-auto" style={{ color: '#766693' }}>
                    Ready to foster a culture of wellness in your organization?
                  </p>
                </div>
              </FastScrollReveal>
              
              <FastScrollReveal delay={0.1}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white p-8 rounded-3xl shadow-xl border border-softPurple/20 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      {['companyName', 'contactName', 'email', 'message'].map((fieldName, index) => (
                        <FastScrollReveal key={fieldName} delay={0.15 + index * 0.05}>
                          {fieldName === 'message' ? (
                            <FormField control={form.control} name="message" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-medium" style={{ color: '#3f2965' }}>Your Message</FormLabel>
                                <FormControl>
                                  <textarea
                                    className="w-full px-4 py-3 rounded-xl bg-lightBg border border-softPurple/30 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all placeholder:text-gray-400 text-primary resize-none min-h-[120px]"
                                    placeholder="Tell us about your organizational needs and goals..." 
                                    suppressHydrationWarning // Added for safety against extensions
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-pink-600" />
                              </FormItem>
                            )} />
                          ) : (
                            <FormField 
                              control={form.control} 
                              name={fieldName as keyof CorporateFormValues} 
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-medium" style={{ color: '#3f2965' }}>
                                    {fieldName === 'companyName' ? 'Company Name' : 
                                     fieldName === 'contactName' ? 'Your Name' : 'Work Email'}
                                  </FormLabel>
                                  <FormControl>
                                    <input
                                      type={fieldName === 'email' ? 'email' : 'text'}
                                      className="w-full px-4 py-3 rounded-xl bg-lightBg border border-softPurple/30 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all placeholder:text-gray-400 text-primary"
                                      placeholder={
                                        fieldName === 'companyName' ? 'Your Company Inc.' : 
                                        fieldName === 'contactName' ? 'Jane Doe' : 'jane.doe@company.com'
                                      }
                                      suppressHydrationWarning // Added for safety against extensions
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-pink-600" />
                                </FormItem>
                              )} 
                            />
                          )}
                        </FastScrollReveal>
                      ))}
                      <FastScrollReveal delay={0.35}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button 
                            type="submit" 
                            className="relative w-full px-6 py-3 rounded-full bg-[#Dd1764] text-white text-sm font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={form.formState.isSubmitting}
                            suppressHydrationWarning // Added for safety against extensions
                          >
                            {/* Left Curtain */}
                            <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                            
                            {/* Right Curtain */}
                            <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                            
                            {/* Text */}
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                              Submit Inquiry
                            </span>
                          </button>
                        </motion.div>
                      </FastScrollReveal>
                    </form>
                  </Form>
                </motion.div>
              </FastScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}