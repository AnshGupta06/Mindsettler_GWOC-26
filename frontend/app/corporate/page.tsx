'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Zap, Users, Shield, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const corporateFormSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters.'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type CorporateFormValues = z.infer<typeof corporateFormSchema>;

// This would typically be fetched, but for static site we can import directly
import workshopsData from '@/data/workshops.json';

// Custom Input component with pink background and purple border - completely custom
const PinkInput = ({ className, onFocus, onBlur, ...props }: React.ComponentProps<typeof Input>) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <input
      type={props.type || 'text'}
      className={`
        flex h-10 w-full rounded-md border px-3 py-2 text-base 
        file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground 
        placeholder:text-gray-400 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
        transition-all duration-200
        ${isFocused 
          ? 'bg-pink-50 border-purple-500 ring-2 ring-purple-500 ring-offset-0' 
          : 'bg-white border-pink-200'
        }
        ${className || ''}
      `}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
};

// Custom Textarea component with pink background and purple border - completely custom
const PinkTextarea = ({ className, onFocus, onBlur, ...props }: React.ComponentProps<typeof Textarea>) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <textarea
      className={`
        flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base 
        placeholder:text-gray-400 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
        transition-all duration-200
        ${isFocused 
          ? 'bg-pink-50 border-purple-500 ring-2 ring-purple-500 ring-offset-0' 
          : 'bg-white border-pink-200'
        }
        ${className || ''}
      `}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
};

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

// Full-width Carousel component with images
const CorporateWellnessCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselItems = [
    {
      type: 'intro',
      title: "Corporate Wellness Programs",
      description: "Invest in your team's most valuable asset: their mental well-being. We partner with organizations to build healthier, more resilient workplaces.",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
      overlay: "bg-gradient-to-br from-[#3f2965]/80 via-[#5a3d8a]/70 to-[#3f2965]/80",
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
      overlay: "bg-gradient-to-br from-pink-600/80 via-purple-600/70 to-pink-600/80",
      highlight: "25% Productivity Boost"
    },
    {
      title: "Reduced Absenteeism",
      description: "Wellness initiatives can reduce absenteeism by up to 28% through better health management and preventive care.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
      overlay: "bg-gradient-to-br from-purple-600/80 via-pink-600/70 to-purple-600/80",
      highlight: "28% Less Absenteeism"
    },
    {
      title: "Higher Retention",
      description: "87% of employees consider health and wellness offerings when choosing an employer, leading to 40% lower turnover.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
      overlay: "bg-gradient-to-br from-pink-500/80 via-purple-500/70 to-pink-500/80",
      highlight: "40% Lower Turnover"
    },
    {
      title: "Better Mental Health",
      description: "Mental wellness programs reduce stress levels by 33% and improve focus by 42%, creating healthier work environments.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2032&auto=format&fit=crop",
      overlay: "bg-gradient-to-br from-purple-500/80 via-pink-500/70 to-purple-500/80",
      highlight: "42% Better Focus"
    },
    {
      title: "ROI on Wellness",
      description: "For every $1 invested in employee wellness, companies see an average return of $3-4 in reduced costs and increased productivity.",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
      overlay: "bg-gradient-to-br from-pink-700/80 via-purple-700/70 to-pink-700/80",
      highlight: "$3-4 ROI per $1"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  // Auto-rotate slides every 6 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentItem = carouselItems[currentSlide];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Images with smooth transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `url('${currentItem.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </AnimatePresence>
      
      {/* Overlay with smooth transition - fixed gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className={`absolute inset-0 z-1 ${currentItem.overlay}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>
      
      {/* Carousel Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-white"
            >
              <div className="max-w-4xl mx-auto text-center">
                {currentItem.type === 'intro' ? (
                  <>
                    <motion.h1 
                      className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      {currentItem.title}
                    </motion.h1>
                    <motion.p 
                      className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      {currentItem.description}
                    </motion.p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                      {currentItem.stats?.map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                          className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6 min-w-[140px] md:min-w-[180px]"
                        >
                          <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                          <div className="text-white/80 text-sm md:text-base mt-2">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <motion.div 
                      className="inline-block bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <span className="text-white font-semibold text-sm md:text-base">{currentItem.highlight}</span>
                    </motion.div>
                    <motion.h2 
                      className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      {currentItem.title}
                    </motion.h2>
                    <motion.p 
                      className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      {currentItem.description}
                    </motion.p>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots indicator - bottom center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 h-2 bg-white rounded-full' 
                    : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow-2xl flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-purple-700" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow-2xl flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-purple-700" />
      </button>
    </div>
  );
};

export default function CorporatePage() {
  const { toast } = useToast();
  const form = useForm<CorporateFormValues>({
    resolver: zodResolver(corporateFormSchema),
    defaultValues: { companyName: '', contactName: '', email: '', message: '' },
  });

  const onSubmit = (data: CorporateFormValues) => {
    console.log('Corporate form submitted:', data);
    toast({
      title: 'Inquiry Sent!',
      description: "Thank you for your interest. We'll be in touch with you soon.",
    });
    form.reset();
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

  // Faster animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const fastItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  const cardHoverVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Full-width Carousel Section */}
      <CorporateWellnessCarousel />

      {/* What We Offer section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <FastScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold sm:text-4xl" style={{ color: '#3f2965' }}>
                What We Offer
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                Comprehensive wellness solutions tailored to your organization's needs
              </p>
            </div>
          </FastScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offerings.map((offering, index) => (
              <FastScrollReveal key={offering.title} delay={index * 0.1}>
                <motion.div 
                  className="group p-6 rounded-xl border border-pink-100 hover:border-pink-300 hover:shadow-lg transition-all duration-200 bg-white backdrop-blur-sm"
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
                  <h3 className="mt-4 font-headline text-xl font-bold text-[#3f2965] transition-colors duration-200 group-hover:text-[#dd1764]">{offering.title}</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">{offering.description}</p>
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
              <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: '#3f2965' }}>
                Our Workshop Offerings
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-gray-600">
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
                  <Card className="flex flex-col h-full shadow-sm border-pink-100 hover:shadow-md hover:border-pink-300 transition-all duration-200 bg-white backdrop-blur-sm group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3 mb-2">
                        <motion.div 
                          className="w-2 h-8 rounded-full bg-purple-500"
                          whileHover={{ scaleY: 1.2 }}
                          transition={{ duration: 0.2 }}
                        />
                        <CardTitle className="font-headline text-xl text-[#3f2965] transition-colors duration-200 group-hover:text-[#dd1764]">
                          {category.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-gray-600 leading-relaxed">{category.purpose}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-grow flex-col">
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-800 mb-3">Topics Include:</h4>
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
                                <span className="text-purple-700 text-sm">{example}</span>
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

      {/* Form section */}
      <div className="py-16 sm:py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <FastScrollReveal>
                <div className="text-center mb-10">
                  <h2 className="font-headline text-3xl font-bold" style={{ color: '#3f2965' }}>
                    Partner With Us
                  </h2>
                  <p className="mt-3 text-lg text-gray-700 max-w-xl mx-auto">
                    Ready to foster a culture of wellness in your organization?
                  </p>
                </div>
              </FastScrollReveal>
              
              <FastScrollReveal delay={0.1}>
                <Card className="p-6 shadow-lg border-pink-100 bg-white">
                  <CardContent className="p-0">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {['companyName', 'contactName', 'email', 'message'].map((fieldName, index) => (
                          <FastScrollReveal key={fieldName} delay={0.15 + index * 0.05}>
                            {fieldName === 'message' ? (
                              <FormField control={form.control} name="message" render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-800 font-medium">Your Message</FormLabel>
                                  <FormControl>
                                    <PinkTextarea 
                                      placeholder="Tell us about your organizational needs and goals..." 
                                      {...field} 
                                      className="min-h-[120px]"
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
                                    <FormLabel className="text-gray-800 font-medium">
                                      {fieldName === 'companyName' ? 'Company Name' : 
                                       fieldName === 'contactName' ? 'Your Name' : 'Work Email'}
                                    </FormLabel>
                                    <FormControl>
                                      <PinkInput 
                                        placeholder={
                                          fieldName === 'companyName' ? 'Your Company Inc.' : 
                                          fieldName === 'contactName' ? 'Jane Doe' : 'jane.doe@company.com'
                                        }
                                        type={fieldName === 'email' ? 'email' : 'text'}
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
                            <Button 
                              type="submit" 
                              size="lg" 
                              className="w-full bg-pink-600 hover:bg-pink-700 text-white shadow-md hover:shadow-lg transition-all"
                              disabled={form.formState.isSubmitting}
                            >
                              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Submit Inquiry
                            </Button>
                          </motion.div>
                        </FastScrollReveal>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </FastScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}