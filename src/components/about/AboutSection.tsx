"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FlowingPaths } from "./FlowingPaths";

// Exact background — do not convert to RGB.
const ABOUT_BACKGROUND = "#111B2F";

const EASE = [0.16, 1, 0.3, 1] as const;

const HEADING_LINES = ["I don't just", "write code."];

const KEYWORDS = [
  "Machine Learning",
  "Cloud Computing",
  "Big Data Analytics",
  "Full Stack Development",
];

type Stat = {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
};

// Placeholder figures — edit freely.
const STATS: Stat[] = [
  { label: "CGPA", value: 8.8, decimals: 1 },
  { label: "Projects", value: 12, suffix: "+" },
  { label: "Skills", value: 15, suffix: "+" },
];

export function AboutSection() {
  const { ref, inView } = useScrollAnimation();

  return (
    <section
      id="about"
      ref={ref}
      style={{ backgroundColor: ABOUT_BACKGROUND }}
      className="section-padding px-6 relative overflow-hidden"
    >
      {/* Flowing data paths — behind everything, kept faint. Oversized so the
          parallax translate never reveals an edge; softly masked at the rim. */}
      <div className="pointer-events-none absolute inset-x-0 -top-16 -bottom-16 [mask-image:radial-gradient(130%_120%_at_50%_40%,#000_60%,transparent_100%)]">
        <FlowingPaths />
      </div>
      {/* Soft gradient blobs for depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(79,142,247,0.35), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-12 h-80 w-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.3), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-6 inline-flex items-center gap-2"
        >
          <span className="h-px w-8 bg-[#4F8EF7]/60" />
          <span className="font-mono-custom text-xs font-semibold uppercase tracking-[0.2em] text-[#4F8EF7]">
            About Me
          </span>
        </motion.div>

        {/* Heading — reveals line by line */}
        <h2 className="font-display text-5xl font-bold leading-[1.08] text-[#E8EEFF] md:text-6xl lg:text-7xl">
          {HEADING_LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        {/* Big introductory statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
          className="mt-8 max-w-3xl text-2xl font-medium leading-snug text-[#E8EEFF] md:text-3xl"
        >
          I enjoy building intelligent software where data, design, and
          technology work together to solve{" "}
          <span className="gradient-text">meaningful problems</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
          className="divider my-12"
        />

        {/* Two-column content */}
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* Left — narrative + rotating keywords */}
          <div>
            {[
              "I'm a Computer Science student specializing in Big Data Analytics, drawn to the point where large-scale data meets thoughtful engineering. What started as curiosity about how systems make decisions has grown into a focus on building tools that turn raw information into something people can actually trust.",
              "I care about clarity — in code, in interfaces, and in how data is communicated. My goal is to keep working at the intersection of analytics, machine learning, and clean software design: building products that feel calm and dependable, no matter how complex they are underneath.",
            ].map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: EASE, delay: 0.65 + i * 0.12 }}
                className="mb-5 max-w-xl leading-relaxed text-[#8892A4]"
              >
                {para}
              </motion.p>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.95 }}
              className="mt-8"
            >
              <RotatingKeyword />
            </motion.div>
          </div>

          {/* Right — stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} inView={inView} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Rotating "Currently Exploring" keyword.
// ---------------------------------------------------------------------------
function RotatingKeyword() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((p) => (p + 1) % KEYWORDS.length), 1000);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div>
      <p className="font-mono-custom text-xs uppercase tracking-[0.2em] text-[#4A5568]">
        Currently Exploring
      </p>
      {/* Full list for assistive tech. */}
      <span className="sr-only">{KEYWORDS.join(", ")}</span>

      {reduce ? (
        <ul aria-hidden className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {KEYWORDS.map((k) => (
            <li key={k} className="font-display text-xl font-semibold text-[#E8EEFF]">
              {k}
            </li>
          ))}
        </ul>
      ) : (
        <div aria-hidden className="relative mt-2 h-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={KEYWORDS[i]}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute inset-0 font-display text-2xl font-semibold text-[#E8EEFF]"
            >
              {KEYWORDS[i]}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Glass stat card with count-up.
// ---------------------------------------------------------------------------
function StatCard({ stat, inView, index }: { stat: Stat; inView: boolean; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE, delay: 0.75 + index * 0.1 }}
      className="group relative rounded-2xl border border-white/[0.07] bg-[#1A2540]/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#4F8EF7]/40 hover:shadow-[0_14px_30px_-12px_rgba(79,142,247,0.4)]"
    >
      <p className="font-display text-4xl font-bold text-[#E8EEFF]">
        <CountUp
          value={stat.value}
          decimals={stat.decimals ?? 0}
          suffix={stat.suffix ?? ""}
          start={inView}
        />
      </p>
      <p className="mt-2 font-mono-custom text-[11px] uppercase tracking-[0.16em] text-[#8892A4]">
        {stat.label}
      </p>
    </motion.div>
  );
}

function CountUp({
  value,
  decimals,
  suffix,
  start,
}: {
  value: number;
  decimals: number;
  suffix: string;
  start: boolean;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start || reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value, reduce]);

  const shown = reduce ? (start ? value : 0) : display;

  return (
    <>
      {shown.toFixed(decimals)}
      {suffix}
    </>
  );
}
