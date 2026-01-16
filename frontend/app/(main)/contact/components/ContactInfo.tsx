"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram, MessageCircle, ArrowRight } from "lucide-react";

export default function ContactInfo() {
  const contactDetails = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Our Center",
      desc: "Surat, Gujarat, India",
      action: "Get Directions",
      href: "https://maps.google.com/?q=Surat,Gujarat,India"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us Anytime",
      desc: "+91 99746 31313",
      action: "Call Now",
      href: "tel:+919974631313"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      desc: "support@mindsettler.com",
      action: "Send Email",
      href: "mailto:support@mindsettler.com"
    },
  ];

  const socialLinks = [
    { icon: <Instagram className="w-6 h-6" />, label: "Instagram", href: "https://www.instagram.com/mindsettlerbypb", color: "hover:bg-pink-50 hover:text-pink-600" },
    { icon: <MessageCircle className="w-6 h-6" />, label: "WhatsApp", href: "https://api.whatsapp.com/send?phone=919974631313", color: "hover:bg-green-50 hover:text-green-500" },
  ];

  return (
    <div className="space-y-10">

      {}
      <div className="space-y-4">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-[#3F2965] tracking-tight"
        >
          Let's Start a <br />
          <span className="text-[#Dd1764]">Conversation.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 max-w-sm"
        >
          We're here to help you find your path to mental clarity and well-being.
        </motion.p>
      </div>

      {}
      <div className="grid gap-6">
        {contactDetails.map((item, idx) => (
          <motion.a
            key={idx}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 + 0.2 }}
            className="group flex items-center gap-6 p-6 bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl shadow-lg shadow-[#3F2965]/5 hover:shadow-xl hover:shadow-[#3F2965]/10 hover:bg-white hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex-shrink-0 w-14 h-14 bg-[#F9F6FF] rounded-2xl flex items-center justify-center text-[#3F2965] group-hover:bg-[#Dd1764] group-hover:text-white transition-colors duration-300">
              {item.icon}
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-[#3F2965] text-lg mb-0.5">{item.title}</h3>
              <p className="text-gray-500 font-medium group-hover:text-[#Dd1764] transition-colors">{item.desc}</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-[#3F2965]/10 flex items-center justify-center text-[#3F2965]/40 group-hover:bg-[#3F2965] group-hover:text-white group-hover:scale-110 transition-all duration-300">
              <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
            </div>
          </motion.a>
        ))}
      </div>

      {}
      <div className="pt-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Connect with us</h3>
        <div className="flex gap-4">
          {socialLinks.map((social, idx) => (
            <a
              key={idx}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 bg-white shadow-md rounded-2xl text-gray-400 transition-all duration-300 border border-[#3F2965]/10 ${social.color} hover:shadow-xl hover:-translate-y-1`}
              aria-label={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}