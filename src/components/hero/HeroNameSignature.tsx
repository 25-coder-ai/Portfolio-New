"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/data/profile";

// ============================================================
// HERO NAME + SIGNATURE
//
// The name ("V DAKSHITHAA") is rendered as SVG text with a fixed
// `textLength`, so it always spans the same share of the container
// width and NEVER overflows the screen edges — regardless of the
// viewport.
// ============================================================

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroNameSignature() {
  const reduce = useReducedMotion() ?? false;
  const name = profile.name.toUpperCase();

  return (
    <motion.div
      className="relative mx-auto w-full"
      style={{ maxWidth: "min(94vw, 1180px)" }}
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.975 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduce ? 0 : 1, ease: EASE, delay: reduce ? 0 : 0.25 }}
    >
      {/* Real heading for semantics / SEO; the visuals are aria-hidden SVG. */}
      <h1 className="sr-only">{profile.name} — Portfolio</h1>

      {/* Oversized name. `textLength` guarantees it fills the width without
          ever spilling past the sides. */}
      <svg aria-hidden="true" viewBox="0 0 1200 250" className="block w-full">
        <defs>
          <linearGradient id="hero-name-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F4F7FF" />
            <stop offset="1" stopColor="#C7D2EC" />
          </linearGradient>
        </defs>
        <text
          x="600"
          y="188"
          textAnchor="middle"
          textLength="1150"
          lengthAdjust="spacingAndGlyphs"
          fill="url(#hero-name-fill)"
          style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontWeight: 900,
            fontSize: "170px",
          }}
        >
          {name}
        </text>
      </svg>
    </motion.div>
  );
}
