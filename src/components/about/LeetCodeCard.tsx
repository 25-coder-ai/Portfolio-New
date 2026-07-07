"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LEETCODE_PROFILE_URL } from "@/config/leetcode";
import type { LeetCodeStats } from "@/types";

const EASE = [0.16, 1, 0.3, 1] as const;

type FetchState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ok"; data: LeetCodeStats };

// Amber, borrowed from the LeetCode flame — used only as a restrained accent.
const AMBER = "#F59E0B";

export function LeetCodeCard({ inView, index }: { inView: boolean; index: number }) {
  const [state, setState] = useState<FetchState>({ status: "loading" });

  // Fetch once, on mount. The server route is cached, so this is cheap.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/leetcode")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((data: LeetCodeStats) => {
        if (!cancelled) setState({ status: "ok", data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE, delay: 0.9 + index * 0.08 }}
      className="group relative flex h-full min-h-[176px] flex-col justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/20 hover:bg-white/[0.05] hover:shadow-[0_16px_34px_-18px_rgba(0,0,0,0.7)]"
    >
      {/* Subtle warm-amber corner glow — never bright orange */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(80% 60% at 100% 0%, ${AMBER}22, transparent 55%)`,
        }}
      />

      {/* --- Statistics layer (fades out on hover/focus) --- */}
      <div className="relative transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
        {state.status === "loading" && <LoadingState />}
        {state.status === "error" && <ErrorState />}
        {state.status === "ok" && (
          <StatsState data={state.data} start={inView} />
        )}
      </div>

      {/* --- Profile link overlay (fades in on hover/focus) --- */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        <a
          href={LEETCODE_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit LeetCode profile (opens in a new tab)"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-amber-300/90 outline-none transition-colors hover:text-amber-200 focus-visible:ring-2 focus-visible:ring-amber-400/40"
        >
          Visit Profile
          <span aria-hidden>→</span>
        </a>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------
function LoadingState() {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="font-mono-custom text-[11px] font-medium uppercase tracking-[0.18em] text-[#8892A4]">
        LeetCode
      </p>
      <div className="mt-3 space-y-2.5">
        <Shimmer className="h-7 w-24" />
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-6 w-16" />
      </div>
      <p className="mt-3 text-[11px] text-[#4A5568]">Loading profile…</p>
    </div>
  );
}

function ErrorState() {
  return (
    <div role="alert">
      <p className="font-mono-custom text-[11px] font-medium uppercase tracking-[0.18em] text-[#8892A4]">
        LeetCode
      </p>
      <p className="mt-3 text-sm text-[#E8EEFF]">Unable to load statistics.</p>
      <a
        href={LEETCODE_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit LeetCode profile (opens in a new tab)"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-amber-300/90 outline-none transition-colors hover:text-amber-200 focus-visible:underline"
      >
        Visit Profile
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}

function StatsState({ data, start }: { data: LeetCodeStats; start: boolean }) {
  return (
    <div>
      <p className="font-mono-custom text-[11px] font-medium uppercase tracking-[0.18em] text-[#8892A4]">
        LeetCode
      </p>

      {/* Current streak — the hero metric */}
      <p
        className="mt-2 font-display text-3xl font-bold leading-none tracking-tight text-[#E8EEFF]"
        aria-label={`Current streak: ${data.streak} days`}
      >
        <span aria-hidden>🔥 </span>
        <span aria-hidden>
          <CountUp value={data.streak} start={start} />
        </span>
      </p>
      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[#4A5568]">
        Current Streak
      </p>

      <div className="my-3 h-px w-full bg-gradient-to-r from-amber-400/25 via-amber-400/[0.08] to-transparent" />

      {/* Problems solved — secondary metric */}
      <p
        className="font-display text-2xl font-bold leading-none tracking-tight text-[#E8EEFF]"
        aria-label={`Problems solved: ${data.totalSolved}`}
      >
        <span aria-hidden>
          <CountUp value={data.totalSolved} start={start} />
        </span>
      </p>
      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[#4A5568]">
        Problems Solved
      </p>

      {/* Live indicator — deliberately quiet, GitHub-online-status style */}
      <p className="mt-3.5 flex items-center gap-1.5 text-[10px] font-medium text-[#4A5568]">
        <LiveDot />
        Synced Live
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bits
// ---------------------------------------------------------------------------
function Shimmer({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`overflow-hidden rounded-md bg-white/[0.05] ${className}`}>
      {!reduce && (
        <motion.div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

function LiveDot() {
  const reduce = useReducedMotion();
  return (
    <span className="relative flex h-1.5 w-1.5">
      {!reduce && (
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ backgroundColor: "#F59E0B" }}
        />
      )}
      <span
        className="relative inline-flex h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "#F59E0B" }}
      />
    </span>
  );
}

/** Counts from 0 → value over ~1s, once, when `start` becomes true. */
function CountUp({ value, start }: { value: number; start: boolean }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!start || reduce || done.current) return;
    done.current = true;
    let raf = 0;
    const t0 = performance.now();
    const duration = 1000;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value, reduce]);

  return <>{reduce ? value : display}</>;
}
