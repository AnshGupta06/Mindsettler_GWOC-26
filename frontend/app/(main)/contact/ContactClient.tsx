"use client";

import { motion } from "framer-motion";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-[#fafafa] pb-24 pt-36 overflow-hidden">

      {}
      <div className="absolute top-0 left-0 w-screen h-screen overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#3F2965]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] bg-[#Dd1764]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[30vw] h-[30vw] bg-purple-300/10 rounded-full blur-[120px]" />
      </div>

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start">

          {}
          <div className="lg:col-span-5 lg:sticky lg:top-40">
            <ContactInfo />
          </div>

          {}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </section>
    </main>
  );
}