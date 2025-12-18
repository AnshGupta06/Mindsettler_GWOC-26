"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroCarousel from "./components/HeroCarousel";

export default function AwarenessPage() {

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
            staggerChildren: 0.12,
            },
        },
        };

        const cardVariants = {
        hidden: {
            opacity: 0,
            y: 40,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
            duration: 0.6,
            ease: "easeOut",
            },
        },
        };

    const awarenessAreas = [
        {
            title: "Anxiety",
            slug: "anxiety",
            description: "Persistent worry, fear, or unease that can interfere with daily life.",
        },
        {
            title: "Depression",
            slug: "depression",
            description: "Feelings of sadness, emptiness, or hopelessness lasting over time.",
        },
        {
            title: "Stress",
            slug: "stress",
            description: "Mental and emotional strain caused by overwhelming situations.",
        },
        {
            title: "Relationship Issues",
            slug: "relationship-issues",
            description: "Challenges in communication, trust, or emotional connection.",
        },
        {
            title: "Self-Esteem",
            slug: "self-esteem",
            description: "Struggles with self-worth, confidence, and self-acceptance.",
        },
        {
            title: "Trauma",
            slug: "trauma",
            description: "Emotional responses to deeply distressing experiences.",
        },
        ];

  return (
    <main className="min-h-screen bg-lightBg">
        <HeroCarousel />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-softPurple via-lightBg to-softPink opacity-70"></div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-6 py-28 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12 md:p-16 border border-gray-100">
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
            <button className="px-10 py-3 rounded-full bg-primary text-white font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all">
                Explore Awareness
            </button>

            <button className="px-10 py-3 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all">
                Our Programs
            </button>
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

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            >
            {awarenessAreas.map((item) => (
            <Link href={`/awareness/${item.slug}`} key={item.slug}>
            <motion.div
                // variants={cardVariants}
                className="relative group bg-lightBg rounded-2xl p-8 border border-gray-100 shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-softPurple/20 to-softPink/20"></div>

                <div className="relative z-10">
                <h3 className="text-xl font-semibold text-primary mb-3">
                    {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                    {item.description}
                </p>
                </div>
            </motion.div>
            </Link>
            ))}
        </motion.div>
        </section>

    </main>

    
  );
}

