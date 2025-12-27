"use client";
import { resources } from '@/data/resources';
import ResourceCard from '@/components/resource/ResourceCard';
import Link from 'next/link';

export default function ResourcesPage() {
    const categories = ["Core Books", "Academic & Clinical", "Video & Lecture"] as const;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Matching Awareness Page Style + Integration Fixes */}
            <section className="relative overflow-hidden">
                {/* Background gradient to connect header to page better */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-white/0 h-3/4"></div>

                <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-28 md:pt-24 pb-12 text-center">
                    {/* Added shadow-lg and backdrop-blur to make it 'pop' but stay grounded */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-16 border border-white ring-1 ring-slate-100/50">
                        <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                            Knowledge Hub
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight md:leading-tight mb-6">
                            Psychotherapy <span className="text-accent">Resources</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                            Explore our curated collection of core books, academic materials, and video lectures.
                            Handpicked to support your journey in understanding psychotherapy process and practice.
                        </p>
                    </div>
                </div>
            </section>

            {/* Resources Content */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                {categories.map((category) => {
                    const categoryResources = resources.filter(r => r.category === category);

                    return (
                        <div key={category} className="mb-20 last:mb-0">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative inline-block">
                                    {category}
                                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-accent/50 to-primary/20 rounded-full"></span>
                                </h2>
                                <p className="mt-3 text-sm md:text-base text-gray-600">
                                    {category === "Core Books" && "Process-Focused, Gold Standard Reading"}
                                    {category === "Academic & Clinical" && "Highly Reliable Free Resources"}
                                    {category === "Video & Lecture" && "Process in Action"}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {categoryResources.map((resource) => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Call to Action */}
            <section className="bg-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-[2rem] md:rounded-3xl p-8 md:p-16 border border-slate-100">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Have a resource to suggest?</h2>
                    <p className="text-slate-600 mb-8 max-w-lg mx-auto text-sm md:text-base">
                        We are always looking to expand our library with high-quality, evidence-based materials.
                    </p>
                    <Link href="/contact">
                        <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer w-full md:w-auto">
                            Contact Us
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
