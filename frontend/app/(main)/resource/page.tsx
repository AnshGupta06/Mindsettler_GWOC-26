import { resources } from '@/data/resources';
import ResourceCard from '@/components/resource/ResourceCard';

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative bg-primary pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Psychotherapy <span className="text-accent">Resources</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Explore our curated collection of articles, videos, and tools designed to support your mental well-being journey.
                    </p>
                </div>
            </section>

            {/* Filter/Search Section (Placeholder for future) */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-sm text-slate-500">Showing {resources.length} resources</p>
                </div>
            </div>

            {/* Resources Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-10 md:p-16 border border-slate-100">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Need personalized support?</h2>
                    <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                        Our professional therapists are here to guide you through your unique journey.
                    </p>
                    <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        Book a Session
                    </button>
                </div>
            </section>
        </div>
    );
}
