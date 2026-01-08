"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Message sent successfully");
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Floating Label Input Component (UNCHANGED)
  const FloatingInput = ({
    label,
    name,
    type = "text",
    rows,
  }: any) => {
    const isTextarea = !!rows;

    return (
      <div className="relative">
        {isTextarea ? (
          <textarea
            name={name}
            rows={rows}
            value={(formData as any)[name]}
            onChange={handleChange}
            placeholder=" "
            required
            className="peer w-full px-5 py-4 rounded-xl bg-white/50 border border-[#3F2965]/10 outline-none focus:border-[#Dd1764] focus:ring-4 focus:ring-[#Dd1764]/5 transition-all duration-300 resize-none font-medium text-[#3F2965] placeholder-transparent"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={(formData as any)[name]}
            onChange={handleChange}
            placeholder=" "
            required
            className="peer w-full px-5 py-4 rounded-xl bg-white/50 border border-[#3F2965]/10 outline-none focus:border-[#Dd1764] focus:ring-4 focus:ring-[#Dd1764]/5 transition-all duration-300 font-medium text-[#3F2965] placeholder-transparent"
          />
        )}

        <label
          className="absolute left-5 top-4 text-gray-400 text-sm font-medium transition-all duration-300 
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base
          peer-focus:-translate-y-7 peer-focus:text-xs peer-focus:text-[#Dd1764] peer-focus:font-bold
          peer-[&:not(:placeholder-shown)]:-translate-y-7
          peer-[&:not(:placeholder-shown)]:text-xs
          peer-[&:not(:placeholder-shown)]:text-[#Dd1764]
          peer-[&:not(:placeholder-shown)]:font-bold"
        >
          {label}
        </label>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="relative perspective-[1200px]"
    >
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-r from-[#3F2965]/10 to-[#Dd1764]/10 blur-[80px] rounded-full -z-10" />

      <motion.div
        animate={{ rotateY: isSubmitted ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT – FORM */}
        <div
          className="bg-white/70 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-[#3F2965]/10 border border-white"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h3 className="text-2xl font-bold text-[#3F2965] mb-2">
            Send a Message
          </h3>
          <p className="text-gray-500 mb-8 text-sm">
            Fill out the form below and we'll get back to you shortly.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatingInput label="Full Name" name="name" />
              <FloatingInput
                label="Email Address"
                name="email"
                type="email"
              />
            </div>

            <FloatingInput label="Subject" name="subject" />

            <FloatingInput
              label="Tell us more about what's on your mind..."
              name="message"
              rows={5}
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group bg-[#3F2965] text-white font-bold py-5 rounded-xl shadow-xl shadow-[#3F2965]/20 hover:shadow-[#3F2965]/40 transition-all duration-300 disabled:opacity-60"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#3F2965] to-[#513681] group-hover:opacity-0 transition-opacity duration-300" />
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#Dd1764] to-[#ff4785] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">
                {loading ? "Sending..." : "Send Message"}
              </span>
            </motion.button>

            {error && (
              <p className="text-red-600 font-medium text-sm mt-2">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* BACK – THANK YOU */}
        <div
          className="absolute inset-0 bg-white/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl shadow-[#3F2965]/10 border border-white flex flex-col items-center justify-center text-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h3 className="text-4xl font-bold text-[#3F2965] mb-7">
            Thank You For Message !
          </h3>
          <p className="text-gray-600 max-w-sm">
            Your message has been sent successfully.  
            We truly appreciate you reaching out and will get back to you soon.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
