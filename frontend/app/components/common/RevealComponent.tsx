"use client";
import React from 'react';
import { motion } from 'framer-motion';

// --- Types ---
interface WrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

interface CharRevealProps {
  children: string; // Must be a string to split
  className?: string;
  delay?: number;
}

// --- 1. Character-by-Character Slide (The "Alphabet" Reveal) ---
export const CharReveal = ({ children, className = "", delay = 0 }: CharRevealProps) => {
  const characters = children.split("");

  return (
    <motion.h1
  className={`inline-flex overflow-hidden pb-2 ${className}`}
  initial="hidden"
  animate="visible"
  transition={{ staggerChildren: 0.03, delayChildren: delay }}
>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { x: 20, opacity: 0 },
            visible: { 
              x: 0, 
              opacity: 1,
              transition: { duration: 0.5, ease: "easeOut" } 
            }
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

// --- 2. Masked Slide Up (Block Reveal) ---
export const MaskedReveal = ({ children, className = "", delay = 0 }: WrapperProps) => {
  return (
    // FIX: Added 'pb-1' here as well for safety
    <div className={`relative overflow-hidden pb-1 ${className}`}>
      <motion.div
        initial={{ y: "110%" }}
        whileInView={{ y: 0 }}
        transition={{ 
            duration: 0.75, 
            ease: [0.33, 1, 0.68, 1],
            delay: delay 
        }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// --- 3. Standard Slide Up ---
export const SlideUp = ({ children, className = "", delay = 0 }: WrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- 4. Stagger Container ---
export const StaggerContainer = ({ children, className = "", delay = 0 }: WrapperProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.1, delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- 5. Stagger Item ---
export const StaggerItem = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};