"use client";

import { motion, type Variants } from "framer-motion";

// ============================================================
// PROJECTS HEADING — "Tiny Label + Big Title" editorial header.
//
//   FEATURED PROJECTS         ← 11px, uppercase, wide tracking
//   Selected Work             ← 56–72px, bold
//
// Typeface: Playfair Display (--font-playfair).
// Reveal is self-contained via `whileInView` (each element observes
// itself) — deliberately NOT tied to the section-level observer,
// which is unreliable over the GSAP-pinned Projects stage.
// On enter: label fades → title slides up.
// ============================================================

const EASE = [0.16, 1, 0.3, 1] as const;
const FONT = "var(--font-playfair), Georgia, serif";
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

export function ProjectsHeading() {
  return (
    <motion.div
      className="text-center"
      style={{ fontFamily: FONT }}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {/* Tiny label */}
      <motion.p
        variants={labelV}
        className="text-[11px] font-semibold uppercase text-[#E8EEFF]"
        style={{ letterSpacing: "0.28em" }}
      >
        Selected Work
      </motion.p>

      {/* Big title */}
      <motion.h2
        variants={titleV}
        className="mt-4 font-bold text-[#E0C58F]"
        style={{
          fontFamily: FONT,
          fontSize: "clamp(56px, 8vw, 72px)",
          lineHeight: 1.02,
          letterSpacing: "-0.01em",
        }}
      >
        Featured Projects
      </motion.h2>
    </motion.div>
  );
}
