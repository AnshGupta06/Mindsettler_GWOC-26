"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroCarousel from "./components/HeroCarousel";
import Image from "next/image";
import type { Variants } from "framer-motion";
import { awarenessAreas } from "./awarenessCardsData";
import Footer from "../components/common/Footer";


export default function AwarenessPage() {

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
            staggerChildren: 0.12,
            },
        },
        };

        const cardVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 40,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
            duration: 0.6,
            // Using cubic-bezier equivalent of ease-out to satisfy
            // Framer Motion's typed Easing while keeping behavior similar.
            ease: [0.0, 0.0, 0.58, 1.0],
            },
        },
        };

  return (
    <>
    <main className="min-h-screen bg-white">
        <HeroCarousel />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-6 py-15 text-center">
          <div className="bg-[#f9f6ff] rounded-3xl shadow-xl p-12 md:p-16 border border-gray-100">
            <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
              Understanding Your Mind <br />
              Is the First Step Toward Healing
            </h1>

            <p className="mt-6 text-lg text-gray-700 max-w-3xl mx-auto">
              MindSettler is a psycho-education and mental well-being platform
              that helps individuals understand their mental health and navigate
              life’s challenges through awareness, guidance, and personalized
              support in a safe and confidential environment.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
            <button className="w-full sm:w-auto relative px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full bg-[#Dd1764] text-white font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/20 hover:-translate-y-1">
              <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
              <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
              <span className="relative z-10">Explore Awareness</span>
            </button>

             <Link href="/services">
             <button className="w-full sm:w-auto relative px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full border-2 border-[#3F2965]/10 text-[#3F2965] font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:border-[#3F2965] hover:-translate-y-1">
              <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
              <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Our Programs
              </span>
            </button>
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Awareness Categories */}
        <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Areas of Awareness
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Understanding what you’re experiencing is the first step toward clarity
            and healing. Explore common mental health concerns we support at
            MindSettler.
            </p>
        </div>

       <motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
>
  {awarenessAreas.map((item) => (
    <Link href={`/awareness/${item.slug}`} key={item.slug}>
      <motion.div
        variants={cardVariants}
        className="group bg-[#f9f6ff] rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
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
      </motion.div>
    </Link>
  ))}
</motion.div>


        </section>
    </main>
<Footer />
    </>
  );
}

