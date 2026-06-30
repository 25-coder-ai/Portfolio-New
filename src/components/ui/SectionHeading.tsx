"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ANIMATION } from "@/lib/constants";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  inView?: boolean;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  label,
  title,
  subtitle,
  inView = true,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-16", align === "center" ? "text-center" : "text-left", className)}>
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: ANIMATION.durationBase, ease: ANIMATION.easingStandard }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <span className="h-px w-8 bg-[#4F8EF7]/60" />
          <span className="text-[#4F8EF7] text-xs font-semibold tracking-[0.2em] uppercase font-mono-custom">
            {label}
          </span>
          <span className="h-px w-8 bg-[#4F8EF7]/60" />
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: ANIMATION.durationSlow, ease: ANIMATION.easingStandard, delay: 0.1 }}
        className="font-display text-4xl md:text-5xl font-bold text-[#E8EEFF] leading-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: ANIMATION.durationSlow, ease: ANIMATION.easingStandard, delay: 0.2 }}
          className="mt-4 text-[#8892A4] text-lg max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
