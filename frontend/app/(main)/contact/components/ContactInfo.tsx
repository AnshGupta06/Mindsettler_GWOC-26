"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram, MessageCircle } from "lucide-react";

export default function ContactInfo() {
    const contactDetails = [
        {
            icon: <MapPin className="w-6 h-6 text-accent" />,
            title: "Our Location",
            desc: "Surat, Gujarat, India",
        },
        {
            icon: <Phone className="w-6 h-6 text-accent" />,
            title: "Phone Number",
            desc: "+91 99746 31313",
        },
        {
            icon: <Mail className="w-6 h-6 text-accent" />,
            title: "Email Address",
            desc: "support@mindsettler.com",
        },
    ];

    const socialLinks = [
        { icon: <Instagram className="w-5 h-5" />, label: "Instagram", href: "https://www.instagram.com/mindsettlerbypb?igsh=MXZ4ajNwaGN3M3hueA==", color: "hover:text-pink-600" },
        { icon: <MessageCircle className="w-5 h-5" />, label: "WhatsApp", href: "https://api.whatsapp.com/send?phone=919974631313", color: "hover:text-green-500" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            <div>
                <h2 className="text-3xl font-bold text-primary mb-4">Get in Touch</h2>
                <p className="text-gray-600 leading-relaxed">
                    We are here to support your journey. Whether you have a question, need guidance, or just want to say hello, feel free to reach out to us.
                </p>
            </div>

            <div className="space-y-6">
                {contactDetails.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                        <div className="p-3 bg-white shadow-md rounded-xl border border-softPurple/30">
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold text-primary">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t border-softPurple/20">
                <h3 className="text-lg font-semibold text-primary mb-4">Follow Us</h3>
                <div className="flex gap-4">
                    {socialLinks.map((social, idx) => (
                        <a
                            key={idx}
                            href={social.href}
                            className={`p-3 bg-white shadow-md rounded-full text-gray-400 transition-colors duration-300 border border-transparent hover:border-softPurple ${social.color}`}
                            aria-label={social.label}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
