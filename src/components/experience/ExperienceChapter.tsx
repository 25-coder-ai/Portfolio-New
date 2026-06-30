"use client";
import { useState, type CSSProperties } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Experience } from "@/types";
import { TYPE_LABEL, formatRange, bigYear } from "./chapterMeta";

const EASE = [0.16, 1, 0.3, 1] as const;

// ------------------------------------------------------------
// Scroll-driven scene motion: a chapter fades / lifts / scales
// as it passes through the centre of the sticky stage.
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

  // All input breakpoints MUST stay within [0, 1] and be strictly increasing:
  // framer-motion 12 can hand scroll-driven values to the native WAAPI keyframe
  // path, which rejects out-of-range / non-monotonic offsets. The first and last
  // scenes have no neighbour on one side, so their ranges are built one-sided.
  const yIn = isFirst ? [0, d] : isLast ? [1 - d, 1] : [c - d, c, c + d];
  const yOut = isFirst ? [0, -70] : isLast ? [70, 0] : [70, 0, -70];

  const sIn = isFirst ? [0, d] : isLast ? [1 - d, 1] : [c - d, c, c + d];
  const sOut = isFirst ? [1, 0.95] : isLast ? [0.965, 1] : [0.965, 1, 0.95];

  const oIn = isFirst
    ? [0, 0.3 * d, 0.62 * d]
    : isLast
      ? [1 - 0.62 * d, 1 - 0.3 * d, 1]
      : [c - 0.62 * d, c - 0.3 * d, c + 0.3 * d, c + 0.62 * d];
  const oOut = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];

  const y = useTransform(progress, yIn, yOut);
  const scale = useTransform(progress, sIn, sOut);
  const opacity = useTransform(progress, oIn, oOut);

  // Reveal content once the scene is meaningfully on-screen (with hysteresis
  // so adjacent chapters can briefly coexist during the cross-fade).
  const [shown, setShown] = useState(() => opacity.get() > 0.22);
  useMotionValueEvent(opacity, "change", (v) => {
    setShown((prev) => (v > 0.22 ? true : v < 0.05 ? false : prev));
  });

  return { y, scale, opacity, shown };
}

const container: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};
const item: Variants = {
  hide: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const tagGroup: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const tag: Variants = {
  hide: { opacity: 0, y: 14, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE } },
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

export function ExperienceChapter({
  experience,
  progress,
  sceneIndex,
  span,
  active,
}: ChapterProps) {
  const { y, scale, opacity, shown } = useSceneMotion(progress, sceneIndex, span);
  const color = experience.color;

  const accentVars = {
    "--accent": color,
    "--accent-soft": `${color}33`,
  } as CSSProperties;

  return (
    <motion.article
      style={{ y, scale, opacity, pointerEvents: active ? "auto" : "none" }}
      aria-hidden={!active}
      className="absolute inset-0 flex items-center justify-center px-6 will-change-transform sm:px-10 lg:px-16"
      aria-label={`${experience.title} at ${experience.organization}`}
    >
      <motion.div
        variants={container}
        initial="hide"
        animate={shown ? "show" : "hide"}
        style={accentVars}
        className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:gap-16"
      >
        {/* ---- Left: oversized year anchor ---- */}
        <div className="lg:pr-4">
          <motion.p
            variants={item}
            className="font-mono-custom text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]"
          >
            {TYPE_LABEL[experience.type]}
          </motion.p>
          <motion.span
            variants={item}
            className="mt-2 block font-display font-bold leading-[0.82] tracking-tight"
            style={{
              fontSize: "clamp(4.5rem,15vw,12rem)",
              backgroundImage: `linear-gradient(155deg, #E8EEFF 35%, ${color})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {bigYear(experience)}
          </motion.span>
          <motion.p
            variants={item}
            className="mt-1 font-mono-custom text-xs tracking-wider text-[#4A5568]"
          >
            {formatRange(experience)}
            {experience.location ? ` · ${experience.location}` : ""}
          </motion.p>
        </div>

        {/* ---- Right: the story ---- */}
        <div className="max-w-xl">
          <motion.h3
            variants={item}
            className="font-display text-3xl font-bold leading-tight text-[#E8EEFF] md:text-4xl"
          >
            {experience.title}
          </motion.h3>

          <motion.p variants={item} className="mt-2 flex items-center gap-2 text-lg text-[#8892A4]">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: color }}
            />
            {experience.organization}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-5 text-base leading-relaxed text-[#8892A4]"
          >
            {experience.description}
          </motion.p>

          {/* metrics */}
          {experience.metrics && experience.metrics.length > 0 && (
            <motion.div variants={item} className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
              {experience.metrics.map((m) => (
                <div key={m.label}>
                  <div className="font-display text-2xl font-bold text-[color:var(--accent)] md:text-3xl">
                    {m.value}
                  </div>
                  <div className="mt-0.5 text-xs uppercase tracking-wider text-[#4A5568]">
                    {m.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* optional supporting imagery */}
          {experience.images && experience.images.length > 0 && (
            <motion.div variants={item} className="mt-7 flex gap-3">
              {experience.images.slice(0, 3).map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="h-20 w-28 overflow-hidden rounded-lg border border-white/[0.08]"
                  style={{ background: "#1A2540" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${experience.title} — supporting visual ${i + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* technology stack — revealed one by one */}
          <motion.div variants={tagGroup} className="mt-7 flex flex-wrap gap-2">
            {experience.technologies.map((t) => (
              <motion.span
                key={t}
                variants={tag}
                whileHover={{ y: -3, boxShadow: `0 8px 20px -8px ${color}66` }}
                transition={{ duration: 0.2, ease: EASE }}
                className="cursor-default rounded-full border border-[color:var(--accent-soft)] bg-[#1A2540]/60 px-3 py-1 text-xs text-[#8892A4] transition-colors hover:border-[color:var(--accent)] hover:text-[#E8EEFF]"
              >
                {t}
              </motion.span>
            ))}
          </motion.div>

          {/* optional CTA */}
          {experience.cta && (
            <motion.a
              variants={item}
              href={experience.cta.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--accent)] px-4 py-2 text-sm font-medium text-[#E8EEFF] transition-colors hover:bg-[color:var(--accent-soft)]"
            >
              {experience.cta.label}
              <ArrowUpRight size={15} />
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}
