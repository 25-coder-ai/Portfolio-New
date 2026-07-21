"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FlowingPaths } from "./FlowingPaths";
import { LeetCodeCard } from "./LeetCodeCard";
import { GitHubCard } from "./GitHubCard";

// Exact background — do not convert to RGB.
const ABOUT_BACKGROUND = "#111B2F";

const EASE = [0.16, 1, 0.3, 1] as const;

const HEADING_LINES = ["I don't just", "write code."];

const KEYWORDS = [
  "Machine Learning",
  "Cloud Computing",
  "Data Structures & Algorithms",
  "Full Stack Development",
  "AI Agents",
];

type Stat = {
  title: string; // small label under the number
  value: number; // large metric — counts up on enter
  decimals?: number;
  prefix?: string;
  suffix?: string;
  secondary?: string; // optional muted line (LeetCode: problems solved)
};

// Placeholder figures — edit freely. Skills & LeetCode are custom cards below.
const STATS: Stat[] = [
  { title: "CGPA", value: 10, suffix: "/10" },
  { title: "Projects", value: 5,suffix: "+" },
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
        className="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full opacity-[0.1] blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(79,142,247,0.28), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-12 h-80 w-80 rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.24), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-5xl">
       

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

        {/* Reading-guide beat 2 — a thin accent line grows beneath the heading */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          style={{ transformOrigin: "left" }}
          className="mt-7 h-px w-28 bg-gradient-to-r from-[#4f8ef7] via-[#A78BFA] to-transparent"
        />

        {/* Reading-guide beat 3 — the paragraph fades in */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
          className="mt-8 max-w-3xl text-2xl font-medium leading-snug text-[#E8EEFF] md:text-3xl"
        >
          I build software that transforms complex data into simple,{" "}
          <span className="gradient-text">meaningful experiences</span>.
        </motion.p>

        {/* Two-column content */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* Left — narrative + rotating keywords */}
          <div>
            {/* Main paragraph — animates only once on enter (fade + rise), then still */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
              className="max-w-xl leading-relaxed text-[#8892A4]"
            >
              I&rsquo;m a Computer Science student specializing in Big Data
              Analytics with a passion for machine learning, cloud computing,
              and full-stack development. I enjoy designing scalable software
              that&rsquo;s reliable, intuitive, and built with purpose&mdash;from
              the architecture behind the scenes to the experience users
              interact with.
            </motion.p>

            {/* Reading-guide beat 4 — "Currently Exploring" begins cycling last */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 1.15 }}
              className="mt-8"
            >
              <RotatingKeyword start={inView} />
            </motion.div>
          </div>

          {/* Right — compact 2×2 metric grid (single column on mobile).
              CGPA / Projects are static; GitHub & LeetCode are live. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {STATS.map((stat, i) => (
              <StatCard key={stat.title} stat={stat} inView={inView} index={i} />
            ))}
            <GitHubCard inView={inView} index={STATS.length} />
            <LeetCodeCard inView={inView} index={STATS.length + 1} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Rotating "Currently Exploring" keyword.
// ---------------------------------------------------------------------------
function RotatingKeyword({ start }: { start: boolean }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || !start) return;
    const id = setInterval(() => setI((p) => (p + 1) % KEYWORDS.length), 1800);
    return () => clearInterval(id);
  }, [reduce, start]);

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
// Compact metric card — subtle glass, large number over a small title.
// Supports the paragraph rather than competing with it.
// ---------------------------------------------------------------------------
function StatCard({ stat, inView, index }: { stat: Stat; inView: boolean; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE, delay: 0.9 + index * 0.08 }}
      className="group flex h-full flex-col justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.10] hover:bg-white/[0.05] hover:shadow-[0_16px_34px_-18px_rgba(0,0,0,0.7)]"
    >
      <p className="font-display text-3xl font-bold leading-none tracking-tight text-[#E8EEFF]">
        <CountUp
          value={stat.value}
          decimals={stat.decimals ?? 0}
          prefix={stat.prefix ?? ""}
          suffix={stat.suffix ?? ""}
          start={inView}
        />
      </p>
      <p className="mt-2 font-mono-custom text-[11px] font-medium uppercase tracking-[0.18em] text-[#8892A4]">
        {stat.title}
      </p>
      {stat.secondary && (
        <p className="mt-1 text-[11px] text-[#4A5568]">{stat.secondary}</p>
      )}
    </motion.div>
  );
}

function CountUp({
  value,
  decimals,
  prefix,
  suffix,
  start,
}: {
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
  start: boolean;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start || reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const duration = 1000;
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
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </>
  );
}
