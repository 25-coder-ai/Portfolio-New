"use client";

import { motion, type Variants } from "framer-motion";

// ============================================================
// PROJECTS HEADING — "Tiny Label + Big Title" editorial header.
//
//   FEATURED PROJECTS         ← 11px, uppercase, wide tracking
//   Selected Work             ← 56–72px, bold
//   one-line subtitle
//
// Typeface: Familjen Grotesk (--font-familjen).
// Reveal is self-contained via `whileInView` (each element observes
// itself) — deliberately NOT tied to the section-level observer,
// which is unreliable over the GSAP-pinned Projects stage.
// On enter: label fades → title slides up → subtitle fades, staggered.
// ============================================================

const EASE = [0.16, 1, 0.3, 1] as const;
const FAMILJEN = "var(--font-familjen), system-ui, sans-serif";
const VIEWPORT = { once: true, amount: 0.4 } as const;

const container: Variants = { hidden: {}, show: {} };

const labelV: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const titleV: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.12 } },
};

const subtitleV: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.26 } },
};

export function ProjectsHeading() {
  return (
    <motion.div
      className="text-center"
      style={{ fontFamily: FAMILJEN }}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {/* Tiny label */}
      <motion.p
        variants={labelV}
        className="text-[11px] font-semibold uppercase text-[#4F8EF7]"
        style={{ letterSpacing: "0.28em" }}
      >
        Featured Projects
      </motion.p>

      {/* Big title */}
      <motion.h2
        variants={titleV}
        className="mt-4 font-bold text-[#E8EEFF]"
        style={{
          fontFamily: FAMILJEN,
          fontSize: "clamp(56px, 8vw, 72px)",
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
        }}
      >
        Selected Work
      </motion.h2>

      {/* One-line subtitle */}
      <motion.p
        variants={subtitleV}
        className="mx-auto mt-5 max-w-xl text-[#8892A4]"
        style={{ fontFamily: FAMILJEN, fontSize: "clamp(15px, 1.2vw, 18px)" }}
      >
        A curated set of things I&apos;ve designed, built, and shipped end to end.
      </motion.p>
    </motion.div>
  );
}
