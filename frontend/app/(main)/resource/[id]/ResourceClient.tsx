"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, ExternalLink, Globe, BookOpen, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Accept resource as a prop instead of finding it
export default function ResourceClient({ resource }: { resource: any }) {
    const [showSticky, setShowSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) setShowSticky(true);
            else setShowSticky(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isBook = resource.type === 'Book';
    const isVideo = resource.type === 'Video';
    const isWebsiteOrCourse = resource.type === 'Website' || resource.type === 'Course';
    const Icon = isBook ? BookOpen : isVideo ? Play : Globe;  
      return (
        <div className="min-h-screen bg-white">
            {/* 
         Standard Padding for Fixed Navbar: pt-32 ensures content starts below the global navbar 
         without collision. 
      */}
            <main className="max-w-6xl mx-auto px-4 md:px-6 pt-28 md:pt-32 pb-32 md:pb-20">

                {/* Back Link */}
                <Link
                    href="/resource"
                    className="inline-flex items-center text-slate-500 hover:text-primary transition-colors font-medium mb-6 md:mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Resources
                </Link>

                {/* Hero Card */}
                <div className="bg-[#f9f6ff] rounded-[2rem] md:rounded-[2.5rem] shadow-xl p-6 md:p-12 border border-white/50 relative overflow-hidden mb-12">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#dd1764]/5 to-[#3f2965]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 relative z-10">
                        {/* Icon/Image Placeholder */}
                        <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100 text-primary mx-auto md:mx-0">
                            <Icon className="w-10 h-10 md:w-14 md:h-14" />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            {/* Meta Badges */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-white text-primary text-xs font-bold uppercase tracking-wider border border-primary/10 shadow-sm">
                                    {resource.category}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                                    {resource.type}
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-5xl font-bold text-primary mb-3 leading-tight">
                                {resource.title}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 font-medium mb-8">
                                By <span className="text-accent">{resource.authorOrSource}</span>
                            </p>

                            {/* Primary Action Button - Hidden on mobile if scrolled past? No, keep it always here, and add sticky one for convenience */}
                            <div className="hidden md:flex flex-wrap gap-4">
                                {isBook && (
                                    <Link
                                        href={resource.link}
                                        target="_blank"
                                        className="bg-[#DD1764] text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-[#c91559] hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center"
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Buy on Amazon / Retailer
                                    </Link>
                                )}
                                {isWebsiteOrCourse && (
                                    <Link
                                        href={resource.link}
                                        target="_blank"
                                        className="bg-primary text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center"
                                    >
                                        <ExternalLink className="w-5 h-5 mr-2" />
                                        Access Full Resource
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Button (Inline for Hero) */}
                            <div className="flex md:hidden flex-col gap-3 w-full">
                                {isBook && (
                                    <Link
                                        href={resource.link}
                                        target="_blank"
                                        className="w-full bg-[#DD1764] text-white px-6 py-3 rounded-xl font-bold shadow-md flex items-center justify-center"
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Buy Now
                                    </Link>
                                )}
                                {isWebsiteOrCourse && (
                                    <Link
                                        href={resource.link}
                                        target="_blank"
                                        className="w-full bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md flex items-center justify-center"
                                    >
                                        <ExternalLink className="w-5 h-5 mr-2" />
                                        Access
                                    </Link>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Short Description */}
                    <div className="mt-8 pt-8 md:mt-10 md:pt-10 border-t border-primary/10">
                        <h3 className="text-lg font-bold text-primary mb-3">Summary</h3>
                        <p className="text-slate-700 leading-relaxed text-lg max-w-4xl">
                            {resource.description}
                        </p>
                    </div>
                </div>

                {/* Detailed Content / Overview */}
                {resource.longSummary && (
                    <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-primary mb-8 pb-4 border-b border-slate-100">
                            Detailed Overview
                        </h2>
                        <div className="prose prose-slate prose-lg max-w-none prose-headings:text-primary prose-a:text-accent prose-strong:text-slate-800">
                            <ReactMarkdown>{resource.longSummary}</ReactMarkdown>
                        </div>
                    </div>
                )}

            </main>

            {/* Mobile Sticky Button - Appears on Scroll */}
            {(isBook || isWebsiteOrCourse) && (
                <div className={`fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 md:hidden z-50 transition-transform duration-300 ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}>
                    {isBook ? (
                        <Link
                            href={resource.link}
                            target="_blank"
                            className="flex items-center justify-center w-full bg-[#DD1764] text-white px-6 py-3 rounded-full font-bold shadow-lg"
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Buy on Amazon
                        </Link>
                    ) : (
                        <Link
                            href={resource.link}
                            target="_blank"
                            className="flex items-center justify-center w-full bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg"
                        >
                            <ExternalLink className="w-5 h-5 mr-2" />
                            Access Resource
                        </Link>
                    )}
                </div>
            )}

        </div>
    );
}
