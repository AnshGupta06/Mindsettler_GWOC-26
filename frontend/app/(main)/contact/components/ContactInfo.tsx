"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram, MessageCircle } from "lucide-react";

export default function ContactInfo() {
  const contactDetails = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Our Location",
      desc: "Surat, Gujarat, India",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Number",
      desc: "+91 99746 31313",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Address",
      desc: "support@mindsettler.com",
    },
  ];

  const socialLinks = [
    { icon: <Instagram className="w-6 h-6" />, label: "Instagram", href: "https://www.instagram.com/mindsettlerbypb", color: "hover:bg-pink-50 hover:text-pink-600" },
    { icon: <MessageCircle className="w-6 h-6" />, label: "WhatsApp", href: "https://api.whatsapp.com/send?phone=919974631313", color: "hover:bg-green-50 hover:text-green-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="space-y-12"
    >
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-primary tracking-tight">Get in Touch</h2>
        <div className="w-20 h-1.5 bg-accent rounded-full" />
      </div>

      <div className="grid gap-8">
        {contactDetails.map((item, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ x: 10 }}
            className="flex items-center gap-6 group"
          >
            <div className="flex-shrink-0 p-4 bg-white shadow-lg shadow-softPurple/5 rounded-2xl border border-softPurple/20 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg">{item.title}</h3>
              <p className="text-gray-500 font-medium">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Connect with us</h3>
        <div className="flex gap-4">
          {socialLinks.map((social, idx) => (
            <a
              key={idx}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 bg-white shadow-md rounded-2xl text-gray-400 transition-all duration-300 border border-softPurple/10 ${social.color} hover:shadow-xl hover:-translate-y-1`}
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