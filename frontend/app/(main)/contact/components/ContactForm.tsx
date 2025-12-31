"use client";

import { motion } from "framer-motion";

export default function ContactForm() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-softPurple/20 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <h3 className="text-2xl font-bold text-primary mb-6">Send a Message</h3>

            <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 rounded-xl bg-lightBg border border-softPurple/30 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all placeholder:text-gray-400 text-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email address"
                            className="w-full px-4 py-3 rounded-xl bg-lightBg border border-softPurple/30 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all placeholder:text-gray-400 text-primary"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 rounded-xl bg-lightBg border border-softPurple/30 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all placeholder:text-gray-400 text-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                    <textarea
                        id="message"
                        rows={4}
                        placeholder="Briefly describe your problem..."
                        className="w-full px-4 py-3 rounded-xl bg-lightBg border border-softPurple/30 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all placeholder:text-gray-400 text-primary resize-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
                >
                    Send Message
                </button>
            </form>
        </motion.div>
    );
}
