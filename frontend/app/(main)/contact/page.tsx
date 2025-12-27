"use client";

import { motion } from "framer-motion";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import { CharReveal } from "@/app/(main)/components/common/RevealComponent";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white pb-20 pt-32"> 
            {/* Header Section */}
            <section className="container mx-auto px-6 py-6 mb-16 text-center">
                
                <div className="flex justify-center">
                    <CharReveal delay={0.1} className="text-4xl md:text-5xl font-extrabold text-primary leading-tight justify-center">
                         We&apos;d Love to Hear From You
                    </CharReveal>
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg"
                >
                    Have questions, suggestions, or just want to chat? We are here to listen and help you on your journey to mental wellness.
                </motion.p>
            </section>

            {/* Content Grid */}
            <section className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    <div className="order-2 lg:order-1">
                        <ContactInfo />

                        <div className="mt-12 p-6 bg-lightBg rounded-2xl border border-softPurple/30">
                            <h4 className="font-bold text-primary text-xl mb-2">Need immediate support?</h4>
                            <p className="text-gray-600 mb-4">
                                If you or someone you know is in crisis, please reach out to our services .
                            </p>
                            <a href="/services" className="text-accent font-semibold hover:underline">
                                View Services &rarr;
                            </a>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <ContactForm />
                    </div>
                </div>
            </section>
        </main>
    );
}
