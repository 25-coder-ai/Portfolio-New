"use client";
import { useState, type CSSProperties } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
  type Variants,
} from "framer-motion";
import type { Experience } from "@/types";
import { TYPE_LABEL, formatRange, monogram } from "./chapterMeta";

const EASE = [0.16, 1, 0.3, 1] as const;

// At most five contributions are shown — the timeline guides the eye, it
// shouldn't become a wall of text.
const MAX_CONTRIBUTIONS = 5;

// ------------------------------------------------------------
// Scroll-driven scene motion. Each chapter slides in, settles onto a plateau
// (where the identity block reads as "pinned"), then releases upward on exit —
// so a chapter has a satisfying ending before the next fades in.
// ------------------------------------------------------------
export function useSceneMotion(
  progress: MotionValue<number>,
  sceneIndex: number,
  span: number,
) {
  const c = span === 0 ? 0 : sceneIndex / span;
  const d = span === 0 ? 1 : 1 / span;
  const isFirst = sceneIndex === 0;
  const isLast = sceneIndex === span;

  // Input breakpoints MUST stay within [0, 1] and be strictly increasing —
  // framer-motion 12 can route scroll-driven values through native WAAPI, which
  // rejects out-of-range / non-monotonic offsets. Plateau = the flat middle
  // where y holds at 0 (pinned); the edges slide in / release.
  const yIn = isFirst
    ? [0, d]
    : isLast
      ? [1 - d, 1 - 0.4 * d, 1]
      : [c - d, c - 0.4 * d, c + 0.4 * d, c + d];
  const yOut = isFirst ? [0, -70] : isLast ? [70, 0, 0] : [70, 0, 0, -70];

  // Opacity holds a touch longer past centre — a brief pause to absorb the
  // finished chapter — then fades as the chapter releases upward.
  const oIn = isFirst
    ? [0, 0.15 * d, 0.35 * d]
    : isLast
      ? [1 - 0.62 * d, 1 - 0.3 * d, 1]
      : [c - 0.62 * d, c - 0.3 * d, c + 0.4 * d, c + 0.66 * d];
  const oOut = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];

  const y = useTransform(progress, yIn, yOut);
  const opacity = useTransform(progress, oIn, oOut);

  // Description parallax — a gentle drift so the copy reads as if it is
  // scrolling beneath the pinned identity block.
  const dLo = isFirst ? 0 : Math.max(0, c - 0.45 * d);
  const dHi = isFirst ? d : Math.min(1, c + 0.45 * d);
  const descY = useTransform(
    progress,
    dLo === dHi ? [0, 1] : [dLo, dHi],
    [24, -24],
  );

  // Reveal content once the scene is meaningfully on-screen (with hysteresis
  // so adjacent chapters can briefly coexist during the cross-fade).
  const [shown, setShown] = useState(() => opacity.get() > 0.22);
  useMotionValueEvent(opacity, "change", (v) => {
    setShown((prev) => (v > 0.22 ? true : v < 0.05 ? false : prev));
  });

  return { y, opacity, shown, descY };
}

// Explicit-delay entrance so the sequence is exact: title → org → summary →
// duration, then the description arrives only after the summary has settled.
const rise = (delay: number, y = 14): Variants => ({
  hide: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay } },
});

// Container just propagates show/hide; children own their timing.
const container: Variants = { hide: {}, show: {} };

// Key Contributions — heading, then the timeline draws while each contribution
// rises into place beside it.
const contribSequence: Variants = {
  hide: {},
  show: { transition: { delayChildren: 0.5, staggerChildren: 0.08 } },
};
const contribHeading: Variants = {
  hide: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const timelineLine: Variants = {
  hide: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.9, ease: EASE } },
};
const contribItem: Variants = {
  hide: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// Divider fades in after the last contribution; Technologies animates as ONE
// block (not per-chip) shortly after.
const dividerVar: Variants = {
  hide: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { duration: 0.5, ease: EASE, delay: 1.55 } },
};
const techBlock: Variants = {
  hide: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 1.75 } },
};

interface ChapterProps {
  experience: Experience;
  progress: MotionValue<number>;
  sceneIndex: number;
  span: number;
  active: boolean;
  chapterNumber: number;
  totalChapters: number;
}

// Split the story into a one-sentence summary + the remaining description.
export function splitStory(exp: Experience): { summary: string; desc: string } {
  if (exp.roleSummary) return { summary: exp.roleSummary, desc: exp.description };
  const m = exp.description.match(/^(.*?[.!?])\s+([\s\S]+)$/);
  if (m) return { summary: m[1], desc: m[2] };
  return { summary: exp.description, desc: "" };
}

export function ExperienceChapter({
  experience,
  progress,
  sceneIndex,
  span,
  active,
}: ChapterProps) {
  const { y, opacity, shown, descY } = useSceneMotion(progress, sceneIndex, span);
  const color = experience.color;

  const accentVars = {
    "--accent": color,
    "--accent-soft": `${color}33`,
  } as CSSProperties;

  const contributions = experience.responsibilities.slice(0, MAX_CONTRIBUTIONS);
  const { summary, desc } = splitStory(experience);

  return (
    <motion.article
      style={{ y, opacity, pointerEvents: active ? "auto" : "none" }}
      aria-hidden={!active}
      className="absolute inset-0 flex items-center justify-center px-6 sm:px-10 lg:px-16"
      aria-label={`${experience.title} at ${experience.organization}`}
    >
      <motion.div
        variants={container}
        initial="hide"
        animate={shown ? "show" : "hide"}
        style={accentVars}
        className="grid w-full max-w-6xl grid-cols-1 items-start gap-12 md:gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16"
      >
        {/* ================= LEFT — the story ================= */}
        <div className="max-w-xl">
          <motion.p
            variants={rise(0.02)}
            className="font-mono-custom text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]"
          >
            {TYPE_LABEL[experience.type]}
          </motion.p>

          {/* Job Title — largest, bold */}
          <motion.h3
            variants={rise(0.08)}
            className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight text-[#E8EEFF] md:text-5xl"
          >
            {experience.title}
          </motion.h3>

          {/* Organization — bold, slightly smaller */}
          <motion.p
            variants={rise(0.2)}
            className="mt-3 font-display text-xl font-bold text-[#C6D2EC] md:text-2xl"
          >
            {experience.organization}
          </motion.p>

          {/* Role Summary — one professional sentence */}
          <motion.p
            variants={rise(0.32)}
            className="mt-4 max-w-md text-lg leading-snug text-[#8892A4]"
          >
            {summary}
          </motion.p>

          {/* Duration — small uppercase metadata */}
          <motion.p
            variants={rise(0.44)}
            className="mt-4 font-mono-custom text-xs uppercase tracking-[0.24em] text-[#4A5568]"
          >
            {formatRange(experience)}
            {experience.location ? ` · ${experience.location}` : ""}
          </motion.p>

          {/* Description — not pinned; drifts gently while identity holds */}
          {desc && (
            <motion.div style={{ y: descY }} className="mt-8">
              <motion.p
                variants={rise(0.85)}
                className="line-clamp-3 max-w-md text-base leading-relaxed text-[#8892A4]"
              >
                {desc}
              </motion.p>
            </motion.div>
          )}
        </div>

        {/* ============ RIGHT — the execution ============ */}
        <div className="relative lg:pt-1">
          <div className="relative z-10">
            {/* Key Contributions — premium vertical timeline, with the org
                logo as an ambient backdrop covering the whole block. */}
            {contributions.length > 0 && (
              <div className="relative">
                <ChapterWatermark experience={experience} color={color} shown={shown} />
                <motion.div variants={contribSequence} className="relative z-10">
                <motion.h4
                  variants={contribHeading}
                  className="font-mono-custom text-xs uppercase tracking-[0.28em] text-[#8892A4]"
                >
                  Key Contributions
                </motion.h4>

                <div className="relative mt-6 pl-6">
                  <motion.span
                    aria-hidden="true"
                    variants={timelineLine}
                    className="pointer-events-none absolute left-[2px] top-1.5 bottom-1.5 w-px origin-top"
                    style={{
                      background: `linear-gradient(to bottom, ${color}, ${color}55 70%, transparent)`,
                    }}
                  />
                  <ul className="space-y-4">
                    {contributions.map((c, i) => (
                      <motion.li
                        key={i}
                        variants={contribItem}
                        className="relative text-[15px] leading-relaxed text-[#8892A4]"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute -left-6 top-[0.5em] h-[5px] w-[5px] -translate-y-1/2 rounded-full ring-2 ring-[#111B2F]"
                          style={{ background: color }}
                        />
                        {c}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                </motion.div>
              </div>
            )}

            {/* Thin divider — appears after the last contribution */}
            <motion.div
              aria-hidden="true"
              variants={dividerVar}
              className="my-8 h-px w-full origin-left bg-white/[0.08]"
            />

            {/* Technologies — animates as one block; chips unchanged */}
            <motion.div variants={techBlock}>
              <p className="font-mono-custom text-xs uppercase tracking-[0.28em] text-[#4A5568]">
                Technologies
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {experience.technologies.map((t) => (
                  <span
                    key={t}
                    className="cursor-default rounded-full border border-[color:var(--accent-soft)] bg-[#1A2540]/60 px-3 py-1 text-xs text-[#8892A4] transition-colors hover:border-[color:var(--accent)] hover:text-[#E8EEFF]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

// Per-logo zoom/nudge so differently-framed source images read at a consistent
// size inside the circle. iit fills its frame edge-to-edge (reference = 1); the
// others have padding, so they're zoomed to match. Tweak these freely.
// Every logo is shown whole (object-contain by default — nothing is cropped);
// `scale` nudges each to a consistent visual size. Set `fit: "cover"` only if
// you deliberately want a logo to fill/crop.
const WATERMARK_ADJUST: Record<
  string,
  { scale: number; x?: string; y?: string; fit?: "cover" | "contain" }
> = {
  "/images/experience/iit.png": { scale: 1 },
  "/images/experience/cict.png": { scale: 1 }, // squared+centered disc, fills circle
  "/images/experience/literary.png": { scale: 1.1 },
  "/images/experience/chipset.png": { scale: 1 },
};

// ------------------------------------------------------------
// Org identity as an ambient backdrop for the Key Contributions block.
// Fills its parent (the KC block) and sizes the circular logo to span the
// whole timeline, very subtle, slightly blurred, with a barely-there float.
// ------------------------------------------------------------
function ChapterWatermark({
  experience,
  color,
  shown,
}: {
  experience: Experience;
  color: string;
  shown: boolean;
}) {
  // Prefer the supplied logo/emblem; if it fails to load (missing / misnamed),
  // quietly fall back to the org monogram rather than showing a broken image.
  const [imgFailed, setImgFailed] = useState(false);
  const useImage = Boolean(experience.watermark) && !imgFailed;
  const adjust =
    (experience.watermark && WATERMARK_ADJUST[experience.watermark]) || { scale: 1 };

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={shown ? { opacity: 0.03, scale: 1 } : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 1.5, ease: EASE }}
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-visible select-none"
    >
      {/* inner element carries the perpetual, barely-there float, and stretches
          to the full height of the KC block so the logo can span it */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-full items-center justify-center blur-[2px]"
      >
        {useImage ? (
          // A fixed circular frame; the logo is zoomed inside it (per WATERMARK_
          // ADJUST) so all orgs read at a consistent size regardless of padding.
          <div
            style={{ height: "90%", aspectRatio: "1 / 1" }}
            className="overflow-hidden rounded-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={experience.watermark}
              alt=""
              loading="lazy"
              onError={() => setImgFailed(true)}
              style={{
                transform: `scale(${adjust.scale}) translate(${adjust.x ?? "0px"}, ${adjust.y ?? "0px"})`,
              }}
              className={`h-full w-full bg-transparent ${
                adjust.fit === "cover" ? "object-cover" : "object-contain"
              }`}
            />
          </div>
        ) : (
          <span
            className="block font-display font-bold uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(8rem,18vw,15rem)", color }}
          >
            {monogram(experience)}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
