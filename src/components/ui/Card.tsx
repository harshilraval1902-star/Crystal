// src/components/ui/Card.tsx
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  title?: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Card({ title, children, onClick, className }: CardProps) {
  const baseClasses = "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-opacity-70";
  const clickable = onClick ? "cursor-pointer" : "";
  return (
    <motion.div
      whileHover={onClick ? { y: -4, boxShadow: "0 8px 20px rgba(0,0,0,0.12)" } : undefined}
      className={`${baseClasses} ${clickable} ${className}`}
      onClick={onClick}
    >
      {title && <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>}
      {children}
    </motion.div>
  );
}
