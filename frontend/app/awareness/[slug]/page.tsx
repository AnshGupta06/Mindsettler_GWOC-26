import Image from "next/image";
import { awarenessContent } from "./awarenessData";

interface AwarenessPageProps {
  params: {
    slug: string;
  };
}

export default async function AwarenessDetailPage({ 
    params,
}: AwarenessPageProps) {
    const { slug } = await params;
    const content = awarenessContent[slug as keyof typeof awarenessContent];

    // Fallback if slug doesn't match
    if (!content) {
        return (
            <main className="min-h-screen bg-lightBg px-6 py-20">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-primary mb-4">Page Not Found</h1>
                    <p className="text-gray-600">The requested awareness page could not be found.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-lightBg">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-softPurple/40 via-lightBg to-softPink/40"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Image */}
                        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src={content.heroImage}
                                alt={content.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold text-primary shadow-md">
                                {content.category}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
                                Understanding {content.title}
                            </h1>
                            <p className="text-xl text-gray-700 leading-relaxed">
                                {content.intro}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                {content.keyPoints.map((point, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                                        <span className="text-sm font-medium text-gray-700">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
                {/* What is Section */}
                <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">?</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-primary">
                            What is {content.title}?
                        </h2>
                    </div>
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed text-lg mb-4">
                            {content.whatIs}
                        </p>
                        {content.whatIsExtended && (
                            <p className="text-gray-600 leading-relaxed">
                                {content.whatIsExtended}
                            </p>
                        )}
                    </div>
                </section>

                {/* Symptoms Section */}
                <section className="bg-gradient-to-br from-softPurple/20 to-softPink/20 rounded-3xl p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">
                        Common Signs & Symptoms
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.symptoms.map((symptom, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold">{idx + 1}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary mb-2">{symptom.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{symptom.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Causes Section */}
                {content.causes && content.causes.length > 0 && (
                    <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">
                            Common Causes & Triggers
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {content.causes.map((cause, idx) => (
                                <div key={idx} className="border-2 border-softPurple/30 rounded-2xl p-6 hover:border-primary/50 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-softPurple/30 flex items-center justify-center mb-4">
                                        <span className="text-primary text-xl">•</span>
                                    </div>
                                    <h3 className="font-semibold text-primary mb-2">{cause}</h3>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Statistics Section */}
                {content.statistics && (
                    <section className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 md:p-12 text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8">Did You Know?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.statistics.map((stat, idx) => (
                                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                    <p className="text-white/90">{stat.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* How MindSettler Helps */}
                <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                            How MindSettler Can Help
                        </h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            Our personalized approach combines psycho-education, evidence-based techniques, and compassionate support to help you navigate your journey.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {content.treatmentApproach.map((approach, idx) => (
                            <div key={idx} className="group relative">
                                <div className="bg-gradient-to-br from-lightBg to-white rounded-2xl p-6 h-full border-2 border-transparent group-hover:border-primary/30 transition-all shadow-md group-hover:shadow-xl">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <span className="text-white text-2xl font-bold">{idx + 1}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-primary mb-3">{approach.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{approach.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Programs Section */}
                <section className="bg-gradient-to-br from-softPurple/30 to-softPink/30 rounded-3xl p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
                        Our Programs & Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-primary mb-3">Awareness Sessions</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Structured psycho-education sessions designed to help you understand {content.title.toLowerCase()}, recognize patterns, and develop healthy coping strategies.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="text-accent">✓</span>
                                    Interactive learning modules
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-accent">✓</span>
                                    Self-assessment tools
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-accent">✓</span>
                                    Progress tracking
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-primary mb-3">Personalized Guidance</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                One-on-one or group sessions tailored to your unique needs, challenges, and goals. Available both online and offline in a safe, confidential environment.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="text-accent">✓</span>
                                    Individual counseling
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-accent">✓</span>
                                    Group support sessions
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-accent">✓</span>
                                    Flexible scheduling
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            You Dont Have to Navigate This Alone
                        </h2>
                        <p className="text-lg text-white/90 leading-relaxed">
                            Seeking awareness and guidance is a positive step toward mental well-being. Our team is here to support you every step of the way.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button className="px-10 py-4 rounded-full bg-white text-primary font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                Book a Session
                            </button>
                            <button className="px-10 py-4 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all">
                                Learn More
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
