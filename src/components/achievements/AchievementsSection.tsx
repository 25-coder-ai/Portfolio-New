"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cloud, Flame, ArrowUpRight } from "lucide-react";
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
  { material: Material; accent: string; glyph: "cloud" | "gpa" | "flame" }
> = {
  "ach-aws": { material: "metal", accent: "#FF9900", glyph: "cloud" },
  "ach-gpa": { material: "glass", accent: "#CFE0FF", glyph: "gpa" },
  "ach-leetcode": { material: "matte", accent: "#F59E0B", glyph: "flame" },
};

export function AchievementsSection() {
  const { ref, inView } = useScrollAnimation();
  const [openId, setOpenId] = useState<string | null>(null);
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

  // Close on Escape.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  const openIndex = achievements.findIndex((a) => a.id === openId);
  const openAch = openIndex >= 0 ? achievements[openIndex] : null;

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
          subtitle="Three milestones, each on its own pedestal. Step closer — select a piece to read its full record."
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
              open={openId === ach.id}
              dimmed={openId !== null && openId !== ach.id}
              leetStreak={ach.id === "ach-leetcode" ? leetStreak : null}
              onToggle={() => setOpenId((cur) => (cur === ach.id ? null : ach.id))}
            />
          ))}
        </div>

        {/* Unfolding information panel */}
        <AnimatePresence initial={false}>
          {openAch && (
            <InfoPanel
              key={openAch.id}
              achievement={openAch}
              index={openIndex}
              leetStreak={openAch.id === "ach-leetcode" ? leetStreak : null}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// A single pedestal: spotlit medallion, engraved plaque, base light + reflection.
// ---------------------------------------------------------------------------
function Pedestal({
  achievement,
  index,
  inView,
  open,
  dimmed,
  leetStreak,
  onToggle,
}: {
  achievement: Achievement;
  index: number;
  inView: boolean;
  open: boolean;
  dimmed: boolean;
  leetStreak: number | null;
  onToggle: () => void;
}) {
  const ex = EXHIBIT[achievement.id] ?? {
    material: "matte" as Material,
    accent: achievement.color,
    glyph: "gpa" as const,
  };
  const { material, accent } = ex;

  const surface: CSSProperties =
    material === "metal"
      ? { background: "linear-gradient(150deg,#1C2536 0%,#141B29 55%,#10161f 100%)" }
      : material === "glass"
        ? { background: "rgba(255,255,255,0.06)", backdropFilter: "blur(14px)" }
        : { background: "#131B2C" };

  const borderClass =
    material === "glass" ? "border-white/15" : "border-white/[0.08]";

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`exhibit-panel-${achievement.id}`}
      initial={{ opacity: 0, y: 34 }}
      animate={inView ? { opacity: dimmed ? 0.55 : 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: 0.15 + index * 0.08 }}
      className="group relative flex w-full flex-col items-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/25"
    >
      {/* Spotlight from above onto the medallion */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 h-40 w-40 rounded-full opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${accent}2e, transparent 70%)` }}
      />

      {/* Medallion — the exhibit object */}
      <div
        className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border ${borderClass} shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)] transition-transform duration-500 ease-out group-hover:-translate-y-2 ${open ? "-translate-y-2" : ""}`}
        style={surface}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 22px ${accent}22` }}
        />
        <Glyph kind={ex.glyph} accent={accent} leetStreak={leetStreak} />
      </div>

      {/* Pedestal block with engraved plaque */}
      <div
        className={`relative mt-5 w-full overflow-hidden rounded-2xl border ${borderClass} px-6 pb-9 pt-7 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out group-hover:-translate-y-2 ${open ? "-translate-y-2" : ""}`}
        style={surface}
      >
        {/* material detail: brushed streaks (metal) / cool sheen (glass) */}
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
        <div className="relative">
          <p
            className="font-mono-custom text-[10px] uppercase tracking-[0.32em]"
            style={{ color: accent }}
          >
            N&deg; {String(index + 1).padStart(2, "0")}
          </p>
          <h3
            className="mt-3 text-left font-display text-lg font-bold leading-snug text-[#E8EEFF]"
            style={{ textShadow: "0 1px 0 rgba(0,0,0,0.45)" }}
          >
            {achievement.title}
          </h3>
          <p className="mt-1 text-left text-sm text-[#8892A4]">{achievement.issuer}</p>
          <p className="mt-3 text-left text-[13px] leading-relaxed text-[#6B7688]">
            {achievement.description}
          </p>

          <span
            className="mt-5 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ color: accent }}
          >
            {open ? "Close" : "Examine"}
            <ArrowUpRight size={12} className={open ? "rotate-90 transition-transform" : "transition-transform"} />
          </span>
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
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// The unfolding information panel — one open at a time, below the pedestals.
// ---------------------------------------------------------------------------
function InfoPanel({
  achievement,
  index,
  leetStreak,
}: {
  achievement: Achievement;
  index: number;
  leetStreak: number | null;
}) {
  const accent = EXHIBIT[achievement.id]?.accent ?? achievement.color;
  const pointerLeft = `${((index + 0.5) / achievements.length) * 100}%`;

  const link =
    achievement.id === "ach-aws" && achievement.credentialUrl
      ? { label: "View Credential", url: achievement.credentialUrl }
      : achievement.id === "ach-leetcode"
        ? { label: "View Profile", url: LEETCODE_PROFILE_URL }
        : null;

  return (
    <motion.div
      id={`exhibit-panel-${achievement.id}`}
      role="region"
      aria-label={`${achievement.title} — details`}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative overflow-hidden"
    >
      {/* pointer to the active pedestal */}
      <span
        aria-hidden
        className="absolute top-3 hidden h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t sm:block"
        style={{ left: pointerLeft, background: "#0E1626", borderColor: `${accent}55` }}
      />

      <div
        className="mt-8 rounded-2xl border p-8"
        style={{ background: "rgba(14,22,38,0.85)", borderColor: `${accent}33`, backdropFilter: "blur(6px)" }}
      >
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
          {/* Description + notes */}
          <div>
            <p className="font-mono-custom text-[10px] uppercase tracking-[0.32em]" style={{ color: accent }}>
              Record
            </p>
            <p className="mt-3 text-lg leading-relaxed text-[#E8EEFF]">
              {achievement.description}
            </p>
            {achievement.id === "ach-leetcode" && leetStreak !== null && (
              <p className="mt-4 font-display text-2xl font-bold" style={{ color: accent }}>
                {leetStreak}
                <span className="ml-2 align-middle text-xs font-medium uppercase tracking-[0.2em] text-[#8892A4]">
                  day streak
                </span>
              </p>
            )}
            {achievement.notes && (
              <p className="mt-5 border-l-2 pl-4 text-sm italic leading-relaxed text-[#8892A4]" style={{ borderColor: `${accent}55` }}>
                {achievement.notes}
              </p>
            )}
            {link && (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium text-[#E8EEFF] transition-all duration-200 hover:-translate-y-0.5"
                style={{ borderColor: `${accent}66` }}
              >
                {link.label}
                <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </div>

          {/* Skills */}
          {achievement.skills && achievement.skills.length > 0 && (
            <div>
              <p className="font-mono-custom text-[10px] uppercase tracking-[0.32em] text-[#4A5568]">
                Skills
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {achievement.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border px-3 py-1 text-xs text-[#8892A4]"
                    style={{ borderColor: `${accent}33`, background: "rgba(255,255,255,0.02)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
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
  kind: "cloud" | "gpa" | "flame";
  accent: string;
  leetStreak: number | null;
}) {
  if (kind === "gpa") {
    return (
      <span className="relative font-display text-xl font-bold" style={{ color: accent }}>
        10.0
      </span>
    );
  }
  if (kind === "flame") {
    return (
      <span className="relative flex flex-col items-center leading-none" style={{ color: accent }}>
        <Flame size={22} />
        {leetStreak !== null && (
          <span className="mt-0.5 text-[10px] font-bold tabular-nums">{leetStreak}</span>
        )}
      </span>
    );
  }
  return <Cloud size={26} className="relative" style={{ color: accent }} />;
}
