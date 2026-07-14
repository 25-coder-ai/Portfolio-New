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

  // Fetch on mount, retrying a few times and rejecting a transient all-zero
  // response (upstream rate-limits) so the card never flashes 0/0.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (let i = 0; i < 3 && !cancelled; i++) {
        try {
          const r = await fetch("/api/leetcode", { cache: "no-store" });
          if (r.ok) {
            const data = (await r.json()) as LeetCodeStats;
            if (data.totalSolved > 0 || data.streak > 0) {
              if (!cancelled) setState({ status: "ok", data });
              return;
            }
          }
        } catch {
          /* retry */
        }
        await new Promise((res) => setTimeout(res, 700 * (i + 1)));
      }
      if (!cancelled) setState({ status: "error" });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE, delay: 0.9 + index * 0.08 }}
      className="group relative h-full min-h-[176px] [perspective:1200px]"
    >
      {/* Flipper — shows the FRONT (stats) at rest; rotates 180° on hover or
          keyboard focus to reveal the BACK (a clickable profile link). */}
      <div className="relative h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)] motion-reduce:transition-none">
        {/* ---- FRONT: statistics ---- */}
        <div className="absolute inset-0 flex flex-col justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141F38] p-5 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.55)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
          {/* Subtle warm-amber corner glow — never bright orange */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background: `radial-gradient(80% 60% at 100% 0%, ${AMBER}22, transparent 55%)`,
            }}
          />
          <div className="relative">
            {state.status === "loading" && <LoadingState />}
            {state.status === "error" && <ErrorState />}
            {state.status === "ok" && (
              <StatsState data={state.data} start={inView} />
            )}
          </div>
        </div>

        {/* ---- BACK: the whole face is the profile link ---- */}
        <a
          href={LEETCODE_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit LeetCode profile (opens in a new tab)"
          className="absolute inset-0 flex items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-amber-400/20 bg-[#17223C] p-5 text-sm font-medium text-amber-300/90 shadow-[0_16px_34px_-18px_rgba(0,0,0,0.7)] outline-none transition-colors [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] hover:text-amber-200 focus-visible:ring-2 focus-visible:ring-amber-400/40 focus-visible:ring-offset-0"
        >
          {/* warmer amber wash on the back so the flip reads as a distinct face */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(90% 70% at 50% 0%, ${AMBER}26, transparent 60%)`,
            }}
          />
          <span className="relative">Visit Profile</span>
          <span aria-hidden className="relative">→</span>
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

      {/* Max streak — the hero metric */}
      <p
        className="mt-2 font-display text-3xl font-bold leading-none tracking-tight text-[#E8EEFF]"
        aria-label={`Max streak: ${data.streak} days`}
      >
        <span aria-hidden>🔥 </span>
        <span aria-hidden>
          <CountUp value={data.streak} start={start} />
        </span>
      </p>
      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[#4A5568]">
        Max Streak
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
