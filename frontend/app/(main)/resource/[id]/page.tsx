"use client";

import { use, useEffect, useState } from 'react';
import { resources, Resource } from '@/data/resources';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';

export default function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const resource = resources.find(r => r.id === unwrappedParams.id);

    if (!resource) {
        notFound();
    }

    // Use a state to handle client-side rendering of markdown if needed, 
    // though ReactMarkdown works fine in RSC/Client components usually.

    const isBook = resource.type === 'Book';
    const isWebsiteOrCourse = resource.type === 'Website' || resource.type === 'Course';

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link href="/resource" className="flex items-center text-slate-600 hover:text-primary transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span className="font-medium">Back to Resources</span>
                    </Link>
                    <div className="flex gap-3">
                        {isBook && (
                            <Link
                                href={resource.link}
                                target="_blank"
                                className="hidden sm:flex items-center bg-[#FF9900] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#ff8c00] transition-colors shadow-md"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Buy on Amazon / Retailer
                            </Link>
                        )}
                        {isWebsiteOrCourse && (
                            <Link
                                href={resource.link}
                                target="_blank"
                                className="hidden sm:flex items-center bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-md"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Access Full Resource
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <article className="max-w-4xl mx-auto px-6 py-10">

                {/* Header Section */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Icon/Image Placeholder - Could be actual book cover if we had images */}
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
                            <span className="text-4xl text-primary font-bold">
                                {resource.type === 'Book' ? '📖' : resource.type === 'Video' ? '🎥' : '🌐'}
                            </span>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                    {resource.category}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                                    {resource.type}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 leading-tight">
                                {resource.title}
                            </h1>
                            <p className="text-lg text-slate-500 font-medium mb-6">
                                By {resource.authorOrSource}
                            </p>

                            <p className="text-slate-700 leading-relaxed text-lg">
                                {resource.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Detailed Summary Section */}
                {resource.longSummary ? (
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate prose-lg max-w-none prose-headings:text-primary prose-a:text-accent">
                        <ReactMarkdown>{resource.longSummary}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center text-slate-500 italic">
                        Detailed overview not available for this resource.
                    </div>
                )}

            </article>

            {/* Mobile Sticky Action Button (Bottom) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 sm:hidden z-50">
                {isBook ? (
                    <Link
                        href={resource.link}
                        target="_blank"
                        className="flex items-center justify-center w-full bg-[#FF9900] text-white px-6 py-3 rounded-full font-bold shadow-lg"
                    >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Buy Book
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

        </div>
    );
}
