"use client";

import type React from "react";

import { motion } from "framer-motion";

type AnimatedIconProps = {
  icon: React.ReactNode;
  color: string;
};

export function AnimatedIcon({ icon, color }: AnimatedIconProps) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      className={`w-16 h-16 ${color}`}
    >
      {icon}
    </motion.div>
  );
}
