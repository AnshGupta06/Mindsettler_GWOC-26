"use client";
import React from 'react';
import { motion } from 'framer-motion';


interface WrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface CharRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export const CharReveal = ({ children, className = "", delay = 0 }: CharRevealProps) => {
  const words = children.split(" ");

  return (
    <motion.span
      className={`inline-block overflow-hidden align-bottom pb-2 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-5%" }}
      transition={{ 
        staggerChildren: 0.03, 
        delayChildren: delay 
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-nowrap mr-[0.25em]"
          transition={{ staggerChildren: 0.005 }} 
        >
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              className="inline-block"
              variants={{
                hidden: { 
                  x: 20, 
                  opacity: 0,
                  scale: 1.1 
                },
                visible: {
                  x: 0, 
                  opacity: 1,
                  scale: 1,
                  transition: { 
                    duration: 0.2, 
                    ease: "easeOut" 
                  },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const SlideUp = ({ children, className = "", delay = 0 }: WrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, className = "", delay = 0 }: WrapperProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

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

export const ImageWipeReveal = ({ children, className = "", delay = 0 }: WrapperProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}

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
