"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "../components/common/Reveal";
import { CharReveal, SlideUp } from "../components/common/RevealComponent";

export default function AboutPage() {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    return (
        <>
        <main className="bg-white">
            {/* --- HERO SECTION: Simple & Elegant --- */}
            <section className="min-h-[85vh] flex items-center pt-24 pb-12 px-4 sm:px-6 md:px-8 relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-11 items-center">

                    {/* Text Content */}
                    <div className="order-2 lg:order-1 relative z-10">
                        <SlideUp>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-[2px] w-12 bg-[#Dd1764]" />
                                <span className="text-sm font-bold tracking-[0.25em] text-[#Dd1764] uppercase">Our Story</span>
                            </div>
                        </SlideUp>

                        <div className="text-5xl sm:text-6xl md:text-[5.5rem] leading-[1.05] font-bold text-[#3F2965] tracking-tight mb-8">
                            <CharReveal delay={0}>Redefining</CharReveal>
                            <span className="block text-[#Dd1764] italic font-light font-serif">
                                <CharReveal delay={0.2}>Mental Wellness</CharReveal>
                            </span>
                        </div>

                        <SlideUp delay={0.4}>
                            <p className="text-lg md:text-xl leading-relaxed text-[#5a4b75] max-w-lg font-light mb-10 border-l-4 border-[#f3ecff] pl-6">
                                We are the bridge between potential and reality. A new standard of psychological care designed for the modern mind, blending science with soul.
                            </p>
                        </SlideUp>

                        <SlideUp delay={0.6}>
                            <Link href="/book">
                                <button className="group relative px-10 py-5 rounded-full bg-[#3F2965] text-white font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/30">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Start Your Journey
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-[#Dd1764] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
                                </button>
                            </Link>
                        </SlideUp>
                    </div>

                    {/* IMAGE / VISUAL: Single Elegant Image */}
                    <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
                        <SlideUp delay={0.2} className="w-full max-w-xl">
                            <div className="relative aspect-[4/4] w-full rounded-tl-[100px] rounded-br-[100px] rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/assets/aboutus_hero.jpeg"
                                    alt="About Mindsettler"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                {/* Subtle overlay for better integration if needed, but keeping it clean for now */}
                                <div className="absolute inset-0 ring-1 ring-black/5 rounded-tl-[100px] rounded-br-[100px] rounded-tr-3xl rounded-bl-3xl pointer-events-none" />
                            </div>
                            {/* Floating decorative element */}
                            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#f3ecff] rounded-full -z-10 blur-xl opacity-80" />
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#Dd1764]/5 rounded-full -z-10 blur-2xl" />
                        </SlideUp>
                    </div>

                </div>
            </section>

            {/* --- VISION SECTION (Redesigned) --- */}
            <section className="py-26 px-4 sm:px-6 relative overflow-hidden bg-white">
                {/* Creative Typographic Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.03] select-none">
                    <h2 className="text-[15rem] font-black text-[#3F2965]">VISION</h2>
                </div>

                <div className="max-w-4xl mx-auto w-full text-center relative z-10">
                    <Reveal>
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-[#3F2965] inline-block">
                                Our Vision
                            </h2>
                            {/* <div className="w-16 h-1.5 bg-[#Dd1764] mx-auto rounded-full mt-4" /> */}
                        </div>
                    </Reveal>

                    <SlideUp delay={0.2}>
                        <div className="relative">
                            <div className="absolute -top-12 -left-8 text-8xl text-[#3F2965]/10 font-serif">&quot;</div>
                            <h3 className="text-2xl md:text-4xl font-medium text-[#3F2965] leading-tight mb-8">
                                To create a world where every individual has the tools to <span className="text-[#Dd1764] decoration-wavy decoration-[#Dd1764]/30 ">understand their mind</span>, heal their trauma, and unlock their <span className="text-[#Dd1764]">limitless potential.</span>
                            </h3>
                            <div className="absolute -bottom-1 -right-1 text-8xl text-[#3F2965]/10 font-serif rotate-180">&quot;</div>
                        </div>
                    </SlideUp>

                    <SlideUp delay={0.4}>
                        <div className="bg-[#f3ecff] p-8 md:p-12 rounded-[2rem] mt-12 shadow-inner">
                            <p className="text-lg md:text-xl text-[#3F2965]/70 leading-relaxed font-light">
                                We believe that mental well-being is the foundation of all success. Our vision is to democratize access to high-quality psychological education and therapeutic tools, making mental mastery accessible to everyone, everywhere.
                            </p>
                        </div>
                    </SlideUp>
                </div>
            </section>

            {/* --- FOUNDER SECTION (Left Aligned Title) --- */}
            <section className="py-8 px-4 sm:px-6 bg-white relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />

                <div className="max-w-6xl mx-auto w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Founder Info */}
                        <div className="space-y-8 relative">
                            {/* Decorative background for text area */}
                            <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#Dd1764]/5 rounded-full blur-3xl -z-10" />

                            <SlideUp delay={0.2}>
                                <div className="mb-8">
                                    <Reveal>
                                        <h2 className="text-4xl md:text-6xl font-bold text-[#3F2965] mb-2">Meet The Founder</h2>
                                        <div className="w-24 h-1.5 bg-[#Dd1764] rounded-full" />
                                    </Reveal>
                                </div>

                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-24 h-24 rounded-full bg-[#f3ecff] border-2 border-[#Dd1764] overflow-hidden flex-shrink-0">
                                        <Image
                                            src="/assets/aboutus_founder.jpeg"
                                            alt="Founder Avatar"
                                            width={96}
                                            height={96}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#3F2965]">Parnika Bajaj</h3>
                                        <p className="text-[#Dd1764] font-medium">Founder & Visionary</p>
                                    </div>
                                </div>
                            </SlideUp>

                            <SlideUp delay={0.4}>
                                <h4 className="text-2xl font-semibold text-[#3F2965] mb-4">
                                    &quot;A Message from the Heart&quot;
                                    </h4>
                                <p className="text-lg text-[#3F2965]/70 leading-relaxed">
                                    My journey began with a simple question: What if we could design our own minds? Mindsettler is the answer to that question. It is the culmination of years of research, practice, and a deep desire to see people thrive.
                                </p>
                                <br />
                                <p className="text-lg text-[#3F2965]/70 leading-relaxed">
                                    I invite you to watch my story and understand the {"Why"} behind everything we do.
                                </p>
                            </SlideUp>
                        </div>

                        {/* VIDEO SECTION */}
                        <SlideUp delay={0.6} className="w-full">
                            <div
                                className="relative w-full max-w-sm mx-auto aspect-[9/14] bg-black rounded-3xl overflow-hidden shadow-2xl group cursor-pointer group"
                                onMouseEnter={() => {
                                    if (videoRef.current) {
                                        videoRef.current.muted = false;
                                        const playPromise = videoRef.current.play();
                                        if (playPromise !== undefined) {
                                            playPromise.catch((error) => {
                                                console.error("Auto-play prevented:", error);
                                                // Fallback: Play muted if audio is blocked
                                                if (videoRef.current) {
                                                    videoRef.current.muted = true;
                                                    videoRef.current.play();
                                                }
                                            });
                                        }
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (videoRef.current) {
                                        videoRef.current.pause();
                                        videoRef.current.currentTime = 0;

                                        videoRef.current.load();
                                    }
                                }}
                            >
                                <video
                                    ref={videoRef}
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                    poster="/assets/aboutus_videointro.jpeg"
                                    onEnded={() => {
                                    if (videoRef.current) {
                                        videoRef.current.currentTime = 0;
                                        videoRef.current.load();
                                    }
                                }}
                                >
                                    <source src="/assets/aboutus_video.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <p className="text-center text-sm text-[#3F2965]/60 mt-4 italic">
                                Hover on video to play the founder&apos;s message
                            </p>
                        </SlideUp>

                    </div>
                </div>
            </section>

        </main >
                </>
    );
}
