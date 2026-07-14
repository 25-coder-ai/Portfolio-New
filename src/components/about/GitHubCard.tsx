"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GITHUB_PROFILE_URL } from "@/config/github";
import { GithubIcon } from "@/components/ui/Icons";

const EASE = [0.16, 1, 0.3, 1] as const;

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ok"; lastYear: number; total: number };

// The whole card links to the GitHub profile; the contribution count is fetched
// live (server route is cached) and a blinking dot signals it updates on its own.
export function GitHubCard({ inView, index }: { inView: boolean; index: number }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    // Retry a few times and reject a transient 0 — so the card never flashes 0.
    (async () => {
      for (let i = 0; i < 3 && !cancelled; i++) {
        try {
          const r = await fetch("/api/github", { cache: "no-store" });
          if (r.ok) {
            const d = (await r.json()) as { lastYear: number; total: number };
            if (typeof d.lastYear === "number" && d.lastYear > 0) {
              if (!cancelled) setState({ status: "ok", lastYear: d.lastYear, total: d.total });
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

  const value = state.status === "ok" ? state.lastYear : 0;

  return (
    <motion.a
      href={GITHUB_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub profile — contributions in the last year (opens in a new tab)"
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE, delay: 0.9 + index * 0.08 }}
      className="group relative flex h-full min-h-[176px] flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.55)] backdrop-blur-md outline-none transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.10] hover:bg-white/[0.05] hover:shadow-[0_16px_34px_-18px_rgba(0,0,0,0.7)] focus-visible:ring-2 focus-visible:ring-white/25"
    >
      {/* faint green corner glow — GitHub's contribution colour */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: "radial-gradient(80% 60% at 100% 0%, rgba(52,211,153,0.14), transparent 55%)" }}
      />

      <div className="relative">
        {/* Live indicator — a blinking dot + label signals dynamic updates. */}
        <div className="flex items-center gap-1.5">
          <LiveDot />
          <span className="font-mono-custom text-[10px] font-medium uppercase tracking-[0.18em] text-[#4A5568]">
            Live
          </span>
        </div>

        {/* The metric */}
        <p className="mt-2 font-display text-3xl font-bold leading-none tracking-tight text-[#E8EEFF]">
          {state.status === "loading" ? (
            <Shimmer className="mt-1 h-7 w-20" />
          ) : state.status === "error" ? (
            "—"
          ) : (
            <CountUp value={value} start={inView} />
          )}
        </p>
        <p className="mt-2 font-mono-custom text-[11px] font-medium uppercase tracking-[0.18em] text-[#8892A4]">
          Contributions
        </p>
        
      </div>

      {/* Footer — GitHub identity */}
      <div className="relative flex items-center gap-2 text-[#8892A4] transition-colors group-hover:text-[#E8EEFF]">
        <GithubIcon size={16} />
        <span className="text-[12px] font-medium">GitHub</span>
        <span aria-hidden className="ml-auto transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          ↗
        </span>
      </div>
    </motion.a>
  );
}

// ---------------------------------------------------------------------------
// A small blinking status dot (a solid dot with a pulsing ring).
// ---------------------------------------------------------------------------
function LiveDot() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
    </span>
  );
}

function Shimmer({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`block overflow-hidden rounded-md bg-white/[0.05] ${className}`}>
      {!reduce && (
        <motion.span
          className="block h-full w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
        />
      )}
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
