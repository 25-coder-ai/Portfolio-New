"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { CursorTrail } from "./CursorTrail";
import { useLenis } from "@/components/layout/SmoothScroll";
import { profile } from "@/data/profile";
import { HERO_BACKGROUND, ANIMATION } from "@/lib/constants";
import { ArrowDown } from "lucide-react";
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from "@/components/ui/Icons";

const STAGGER_DELAY = 0.12;

function HeroBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: HERO_BACKGROUND }}
      aria-hidden="true"
    >
      {/* Subtle radial gradient highlight */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(79,142,247,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{
          background: `linear-gradient(to bottom, transparent, ${HERO_BACKGROUND})`,
        }}
      />
    </div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const getLenis = useLenis();

  // Smoothly scroll to an in-page section, routing through Lenis when active
  // so the glide matches the rest of the site (falls back to native).
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el);
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: STAGGER_DELAY, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION.durationSlow,
        ease: ANIMATION.easingStandard,
      },
    },
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ background: HERO_BACKGROUND }}
      aria-label="Hero"
    >
      <HeroBackground />

      {/* Cursor trail — renders behind hero content (z-5) */}
      <CursorTrail />

      {/* Content (z-10 — above trail cards) */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Name — Parisian-style display font */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-bold leading-[1.05] tracking-tight text-[#E8EEFF]"
          style={{ fontSize: "clamp(3.2rem, 9vw, 7.5rem)" }}
        >
          {profile.name}
        </motion.h1>

        {/* Gradient underline accent */}
        <motion.div
          variants={itemVariants}
          className="mt-3 mb-6 h-px w-64 mx-auto"
          style={{
            background: "linear-gradient(90deg, transparent, #4F8EF7, #A78BFA, transparent)",
          }}
        />

        {/* Subtitle — two lines */}
        <motion.div variants={itemVariants} className="space-y-1 mb-8">
          <p className="text-[#8892A4] text-lg md:text-xl font-medium">
            Computer Science Student
          </p>
          <p className="text-[#8892A4] text-base md:text-lg">
            Specialization in{" "}
            <span className="text-[#4F8EF7] font-semibold">Big Data Analytics</span>
          </p>
        </motion.div>

        {/* CTA row */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap justify-center">
          <button
            onClick={() => scrollToSection("about")}
            className="px-7 py-3 rounded-xl bg-[#4F8EF7] text-white font-semibold text-sm hover:bg-[#4F8EF7]/90 transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{ boxShadow: "0 0 32px rgba(79,142,247,0.25)" }}
          >
            Explore Work
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="px-7 py-3 rounded-xl border border-white/10 text-[#E8EEFF] font-semibold text-sm hover:border-[#4F8EF7]/40 hover:bg-white/[0.03] transition-all"
          >
            Get in Touch
          </button>
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-5 mt-10 text-[#4A5568]"
        >
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E8EEFF] transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon size={20} />
          </a>
          <span className="w-px h-4 bg-white/10" />
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E8EEFF] transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={20} />
          </a>
          <span className="w-px h-4 bg-white/10" />
          <a
            href={profile.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E8EEFF] transition-colors"
            aria-label="LeetCode"
          >
            <LeetCodeIcon size={20} />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        onClick={() => scrollToSection("about")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#4A5568] hover:text-[#8892A4] transition-colors group"
        aria-label="Scroll to About"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono-custom">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
