"use client";
import React from 'react';
import { motion } from 'framer-motion';

// --- Types ---
interface WrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
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
      className={`flex flex-wrap w-full overflow-hidden pb-2 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
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
              transition: { duration: 0.5, ease: "easeOut" },
            },
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

//ADDED THIS FOR AWARNESS PAGE TO BE RESPONSIVE 
//  Character-by-Character Slide (Word Preserving) 
export const CharRevealWord = ({ children, className = "", delay = 0 }: CharRevealProps) => {
  // Split by whitespace but keep the whitespace segments
  const segments = children.split(/(\s+)/);

  return (
    <motion.h1
      className={`flex flex-wrap w-full overflow-hidden pb-2 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.03, delayChildren: delay }}
    >
      {segments.map((segment, i) => {
        // Render whitespace as-is
        if (segment.match(/^\s+$/)) {
          return (
            <span key={i} className="whitespace-pre">
              {segment}
            </span>
          );
        }
        // Render word wrapped in nowrap
        return (
          <span key={i} className="whitespace-nowrap inline-flex">
            {segment.split("").map((char, charIndex) => (
              <motion.span
                key={`${i}-${charIndex}`}
                variants={{
                  hidden: { x: 20, opacity: 0 },
                  visible: {
                    x: 0,
                    opacity: 1,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="inline-block whitespace-pre"
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
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
export const SlideUp = ({ children, className = "", delay = 0, ...props }: WrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      viewport={{ once: true }}
      className={className}
      {...props}
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
// --- 6. Image Wipe Reveal (Mask slides left → right) ---
export const ImageWipeReveal = ({ children, className = "", delay = 0 }: WrapperProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Image stays static */}
      {children}

      {/* Wipe overlay */}
      <motion.div
        initial={{ x: "0%" }}
        whileInView={{ x: "100%" }}
        transition={{
          duration: 1,
          ease: [0.33, 1, 0.68, 1],
          delay,
        }}
        viewport={{ once: true }}
        className="absolute inset-0 bg-white z-10"
      />
    </div>
  );
};
