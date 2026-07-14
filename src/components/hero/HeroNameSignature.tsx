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
const TEAL_BLUE = "#997953";

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

      {/* Signature accent — written on, teal-blue, slightly rotated. Sized large
          and set to overflow, so it intentionally spills out of the name: the
          f/l ascenders rise above the top and the p descender drops below. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 460"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[70%] max-w-[760px]"
        style={{
          transform: "translate(-50%, -50%) rotate(-5deg)",
          overflow: "visible",
        }}
      >
        <defs>
          {/* Write-on reveal: a full-height stroke is "drawn" left→right,
              uncovering the cursive script as the pen travels. The stroke is
              tall enough to cover the ascenders/descenders so nothing is
              masked (clipped) away. The mask region is oversized too. */}
          <mask
            id="hero-signature-write"
            maskUnits="userSpaceOnUse"
            x="-300"
            y="-300"
            width="1800"
            height="1060"
          >
            <rect x="-300" y="-300" width="1800" height="1060" fill="black" />
            <motion.path
              d="M 190 214 Q 430 150 610 208 T 1010 196"
              fill="none"
              stroke="white"
              strokeWidth={430}
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
          y="290"
          textAnchor="middle"
          mask="url(#hero-signature-write)"
          fill={TEAL_BLUE}
          fillOpacity={0.62}
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "270px",
          }}
        >
          portfolio
        </text>
      </svg>
    </motion.div>
  );
}
