"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/data/profile";

// ============================================================
// HERO NAME + SIGNATURE
//
// The name ("V DAKSHITHAA") is rendered as SVG text with a fixed
// `textLength`, so it always spans the same share of the container
// width and NEVER overflows the screen edges — regardless of the
// viewport. Over it, "portfolio" is written on in a flowing cursive
// (teal-blue), drawn on first load like a real signature.
//
// This echoes the editorial banner treatment without copying it:
// dark hero palette, contained width, teal ink, mount-triggered.
// ============================================================

const EASE = [0.16, 1, 0.3, 1] as const;

// Teal-blue signature ink — luminous on the navy hero. Tweak freely.
const TEAL_BLUE = "#2AC7DE";

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

      {/* Signature accent — written on, teal-blue, slightly rotated, over the name. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 340"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[62%] max-w-[640px]"
        style={{
          transform: "translate(-50%, -54%) rotate(-5deg)",
          overflow: "visible",
        }}
      >
        <defs>
          {/* Write-on reveal: a thick centreline is "drawn" left→right,
              uncovering the cursive script as the pen travels. */}
          <mask id="hero-signature-write" maskUnits="userSpaceOnUse">
            <rect width="1200" height="340" fill="black" />
            <motion.path
              d="M 236 198 Q 430 116 610 192 T 968 174"
              fill="none"
              stroke="white"
              strokeWidth={250}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: reduce ? 0 : 1.5,
                ease: "easeInOut",
                // Begins after the name has settled on load.
                delay: reduce ? 0 : 0.5,
              }}
            />
          </mask>
        </defs>
        <text
          x="600"
          y="222"
          textAnchor="middle"
          mask="url(#hero-signature-write)"
          fill={TEAL_BLUE}
          fillOpacity={0.96}
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "250px",
          }}
        >
          portfolio
        </text>
      </svg>
    </motion.div>
  );
}
