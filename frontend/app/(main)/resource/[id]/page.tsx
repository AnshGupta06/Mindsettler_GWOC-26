"use client";

import { use } from 'react';
import { resources } from '@/data/resources';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, ExternalLink, Globe, BookOpen, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';

export default function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const resource = resources.find(r => r.id === unwrappedParams.id);

    if (!resource) {
        notFound();
    }

    const isBook = resource.type === 'Book';
    const isVideo = resource.type === 'Video';
    const isWebsiteOrCourse = resource.type === 'Website' || resource.type === 'Course';

    // Choose icon based on type
    const Icon = isBook ? BookOpen : isVideo ? Play : Globe;

    return (
        <div className="min-h-screen bg-white">
            {/* 
         Standard Padding for Fixed Navbar: pt-32 ensures content starts below the global navbar 
         without collision. 
      */}
            <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">

                {/* Back Link */}
                <Link
                    href="/resource"
                    className="inline-flex items-center text-slate-500 hover:text-primary transition-colors font-medium mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Resources
                </Link>

                {/* Hero Card - Matches Awareness/Resources Main Style */}
                <div className="bg-[#f9f6ff] rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-white/50 relative overflow-hidden mb-12">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#dd1764]/5 to-[#3f2965]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                        {/* Icon/Image Placeholder */}
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100 text-primary">
                            <Icon className="w-10 h-10 md:w-14 md:h-14" />
                        </div>

                        <div className="flex-1">
                            {/* Meta Badges */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-white text-primary text-xs font-bold uppercase tracking-wider border border-primary/10 shadow-sm">
                                    {resource.category}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                                    {resource.type}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-3 leading-tight">
                                {resource.title}
                            </h1>
                            <p className="text-xl text-slate-600 font-medium mb-8">
                                By <span className="text-accent">{resource.authorOrSource}</span>
                            </p>

                            {/* Primary Action Button */}
                            <div className="flex flex-wrap gap-4">
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
                        </div>
                    </div>

                    {/* Short Description */}
                    <div className="mt-10 pt-10 border-t border-primary/10">
                        <h3 className="text-lg font-bold text-primary mb-3">Summary</h3>
                        <p className="text-slate-700 leading-relaxed text-lg max-w-4xl">
                            {resource.description}
                        </p>
                    </div>
                </div>

                {/* Detailed Content / Overview */}
                {resource.longSummary && (
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-primary mb-8 pb-4 border-b border-slate-100">
                            Detailed Overview
                        </h2>
                        <div className="prose prose-slate prose-lg max-w-none prose-headings:text-primary prose-a:text-accent prose-strong:text-slate-800">
                            <ReactMarkdown>{resource.longSummary}</ReactMarkdown>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
