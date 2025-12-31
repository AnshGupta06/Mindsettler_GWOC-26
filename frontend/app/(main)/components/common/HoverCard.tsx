"use client";

import { motion } from "framer-motion";

export default function HoverCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 12px 30px rgba(63, 41, 101, 0.12)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-xl"
    >
      {children}
    </motion.div>
  );
}
    