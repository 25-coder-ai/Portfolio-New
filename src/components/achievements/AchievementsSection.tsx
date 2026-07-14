"use client";
import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, ArrowUpRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { achievements } from "@/data/achievements";
import type { Achievement } from "@/types";
import { LEETCODE_PROFILE_URL } from "@/config/leetcode";

// Exact background — do not convert to RGB.
const ACHIEVEMENT_BACKGROUND = "#111B2F";
const EASE = [0.16, 1, 0.3, 1] as const;

type Material = "metal" | "glass" | "matte";

// Per-exhibit material & identity — keyed by achievement id so the data stays
// semantic and the "physical" treatment lives with the presentation.
const EXHIBIT: Record<
  string,
  { material: Material; accent: string; glyph: "aws" | "gpa" | "flame" }
> = {
  "ach-aws": { material: "metal", accent: "#FF9900", glyph: "aws" },
  "ach-gpa": { material: "glass", accent: "#CFE0FF", glyph: "gpa" },
  "ach-leetcode": { material: "matte", accent: "#F59E0B", glyph: "flame" },
};

// The direct action on each pedestal. CGPA has none.
function pedestalLink(ach: Achievement): { label: string; url: string } | null {
  if (ach.id === "ach-aws" && ach.credentialUrl) {
    return { label: "View Certificate", url: ach.credentialUrl };
  }
  if (ach.id === "ach-leetcode") {
    return { label: "View Profile", url: LEETCODE_PROFILE_URL };
  }
  return null;
}

export function AchievementsSection() {
  const { ref, inView } = useScrollAnimation();
  const [leetStreak, setLeetStreak] = useState<number | null>(null);

  // Live LeetCode streak for the third pedestal (server route is cached).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/leetcode")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((d: { streak: number }) => {
        if (!cancelled) setLeetStreak(d.streak);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="achievements"
      ref={ref}
      style={{ backgroundColor: ACHIEVEMENT_BACKGROUND }}
      className="section-padding relative overflow-hidden px-6"
    >
      {/* Gallery lighting — a soft wash from above, no particles. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-70"
        style={{
          background:
            "radial-gradient(70% 100% at 50% 0%, rgba(120,150,210,0.12), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          label="Achievements"
          title="The Exhibition"
          subtitle="Three milestones, each on its own pedestal."
          inView={inView}
        />

        {/* Pedestals */}
        <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {achievements.map((ach, i) => (
            <Pedestal
              key={ach.id}
              achievement={ach}
              index={i}
              inView={inView}
              leetStreak={ach.id === "ach-leetcode" ? leetStreak : null}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// A single pedestal: spotlit medallion, engraved plaque, base light + reflection.
// AWS / LeetCode pedestals are direct links; CGPA is a plain display card.
// ---------------------------------------------------------------------------
function Pedestal({
  achievement,
  index,
  inView,
  leetStreak,
}: {
  achievement: Achievement;
  index: number;
  inView: boolean;
  leetStreak: number | null;
}) {
  const ex = EXHIBIT[achievement.id] ?? {
    material: "matte" as Material,
    accent: achievement.color,
    glyph: "gpa" as const,
  };
  const { material, accent } = ex;
  const isAws = ex.glyph === "aws";
  const link = pedestalLink(achievement);

  const surface: CSSProperties =
    material === "metal"
      ? { background: "linear-gradient(150deg,#1C2536 0%,#141B29 55%,#10161f 100%)" }
      : material === "glass"
        ? { background: "rgba(255,255,255,0.06)", backdropFilter: "blur(14px)" }
        : { background: "#131B2C" };

  const borderClass =
    material === "glass" ? "border-white/15" : "border-white/[0.08]";

  const commonProps = {
    initial: { opacity: 0, y: 34 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, ease: EASE, delay: 0.15 + index * 0.08 },
    className:
      "group relative flex h-full w-full flex-col items-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/25",
  } as const;

  const body = (
    <>
      {/* Spotlight from above onto the medallion */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 h-40 w-40 rounded-full opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${accent}2e, transparent 70%)` }}
      />

      {/* Medallion — the exhibit object. AWS shows its full natural badge shape
          (no circular clip, border, or backdrop); the others stay circular. */}
      <div
        className={`relative z-10 flex items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-2 ${
          isAws
            ? "h-24 w-24"
            : `h-20 w-20 overflow-hidden rounded-full border ${borderClass} shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)]`
        }`}
        style={isAws ? undefined : surface}
      >
        {!isAws && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 22px ${accent}22` }}
          />
        )}
        <Glyph kind={ex.glyph} accent={accent} leetStreak={leetStreak} />
      </div>

      {/* Pedestal block with engraved plaque */}
      <div
        className={`relative mt-5 flex w-full flex-1 flex-col overflow-hidden rounded-2xl border ${borderClass} px-6 pb-9 pt-7 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out group-hover:-translate-y-2`}
        style={surface}
      >
        {/* material detail: brushed streaks (metal) */}
        {material === "metal" && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 3px)",
            }}
          />
        )}
        {/* top edge highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)" }}
        />

        {/* Plaque */}
        <div className="relative flex flex-1 flex-col">
          <h3
            className="text-left font-display text-lg font-bold leading-snug text-[#E8EEFF]"
            style={{ textShadow: "0 1px 0 rgba(0,0,0,0.45)" }}
          >
            {achievement.title}
          </h3>
          <p className="mt-1 text-left text-sm text-[#8892A4]">{achievement.issuer}</p>
          <p className="mt-3 text-left text-[13px] leading-relaxed text-[#6B7688]">
            {achievement.description}
          </p>

          {/* Direct action (AWS / LeetCode). CGPA has none. */}
          {link && (
            <span
              className="mt-6 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-transform duration-300 group-hover:translate-x-0.5"
              style={{ color: accent }}
            >
              {link.label}
              <ArrowUpRight size={13} />
            </span>
          )}
        </div>

        {/* Base lighting — softly brightens on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 bottom-0 h-16 opacity-60 blur-md transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(60% 100% at 50% 100%, ${accent}33, transparent 75%)` }}
        />
      </div>

      {/* Reflection — a faint mirrored puddle that drifts gently on hover */}
      <span
        aria-hidden
        className="pointer-events-none mt-1 h-8 w-3/4 rounded-[100%] opacity-40 blur-md transition-all duration-700 group-hover:translate-y-1 group-hover:opacity-70"
        style={{ background: `radial-gradient(60% 100% at 50% 0%, ${accent}2e, transparent 70%)` }}
      />
    </>
  );

  // AWS / LeetCode → the whole pedestal is a link. CGPA → a plain card.
  return link ? (
    <motion.a href={link.url} target="_blank" rel="noopener noreferrer" {...commonProps}>
      {body}
    </motion.a>
  ) : (
    <motion.div {...commonProps}>{body}</motion.div>
  );
}

// ---------------------------------------------------------------------------
// Medallion glyph.
// ---------------------------------------------------------------------------
function Glyph({
  kind,
  accent,
  leetStreak,
}: {
  kind: "aws" | "gpa" | "flame";
  accent: string;
  leetStreak: number | null;
}) {
  if (kind === "aws") {
    // The AWS logo fills the whole circular medallion.
    return (
      <Image
        src="/images/achievements/aws.png"
        alt="AWS"
        fill
        sizes="96px"
        className="object-contain"
      />
    );
  }
  if (kind === "gpa") {
    // A clean glass badge: 10.0 large with CGPA beneath.
    return (
      <span
        className="relative flex flex-col items-center leading-none"
        style={{ color: accent }}
      >
        <span className="font-display text-[26px] font-bold tracking-tight">10.0</span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em]">
          CGPA
        </span>
      </span>
    );
  }
  return (
    <span className="relative flex flex-col items-center leading-none" style={{ color: accent }}>
      <Flame size={22} />
      {leetStreak !== null && (
        <span className="mt-0.5 text-[10px] font-bold tabular-nums">{leetStreak}</span>
      )}
    </span>
  );
}
