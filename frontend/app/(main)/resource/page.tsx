"use client";
import { resources } from '@/data/resources';
import ResourceCard from '@/components/resource/ResourceCard';
import Link from 'next/link';
// Import CharReveal
import { SlideUp, CharReveal } from '../components/common/RevealComponent';

export default function ResourcesPage() {
    const categories = ["Core Books", "Academic & Clinical", "Video & Lecture"] as const;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-white h-3/4"></div>

                <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-28 md:pt-39 pb-4 text-center">
                    <SlideUp delay={0.1}>
                        <div className="bg-white rounded-[2rem] md:rounded-3xl p-8 md:p-16 border border-white ring-1 ring-slate-100/50">
                        
                            {/* Updated Main Heading */}
                            <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight md:leading-tight mb-6">
                                <span className="inline-block mr-3">
                                    <CharReveal delay={0.1}>
                                        Psychotherapy
                                    </CharReveal>
                                </span>
                                <span className="text-accent inline-block">
                                    <CharReveal delay={0.5}>
                                        Resources
                                    </CharReveal>
                                </span>
                            </h1>
                            
                            <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                                Explore our curated collection of core books, academic materials, and video lectures.
                                Handpicked to support your journey in understanding psychotherapy process and practice.
                            </p>
                        </div>
                    </SlideUp>
                </div>
            </section>

            {/* Resources Content */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                {categories.map((category) => {
                    const categoryResources = resources.filter(r => r.category === category);

                    return (
                        <div key={category} className="mb-20 last:mb-0">
                            <SlideUp delay={0.3}>
                                <div className="text-center mb-10">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative inline-block">
                                        {/* Optional: Add CharReveal to category titles too if desired, currently standard text */}
                                        {category}
                                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-accent from-primary/20 via-accent/50 to-primary/20 rounded-full"></span>
                                    </h2>
                                    <p className="mt-3 text-sm md:text-base text-gray-600">
                                        {category === "Core Books" && "Process-Focused, Gold Standard Reading"}
                                        {category === "Academic & Clinical" && "Highly Reliable Free Resources"}
                                        {category === "Video & Lecture" && "Process in Action"}
                                    </p>
                                </div>
                            </SlideUp>

                            <SlideUp delay={0.4}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                    {categoryResources.map((resource) => (
                                        <ResourceCard key={resource.id} resource={resource} />
                                    ))}
                                </div>
                            </SlideUp>
                        </div>
                    );
                })}
            </section>

            {/* Call to Action */}
            <section className="bg-white py-20 px-4">
                <SlideUp delay={0.5}>
                    <div className="max-w-4xl mx-auto text-center bg-[#f9f6ff] from-primary/5 to-accent/5 rounded-[2rem] md:rounded-3xl p-8 md:p-16 border border-slate-100">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Have a resource to suggest?</h2>
                        <p className="text-slate-600 mb-8 max-w-lg mx-auto text-sm md:text-base">
                            We are always looking to expand our library with high-quality, evidence-based materials.
                        </p>
                        <Link href="/contact">
                            <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer w-full md:w-auto overflow-hidden relative group">
                            <span className="relative z-10 group-hover:text-white">Learn More</span>
                            <div className="absolute inset-0 bg-[#Dd1764] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
                            </button>
                        </Link>
                    </div>
                </SlideUp>
            </section>
        </div>
    );
}