"use client";
import { useRef, useState, type CSSProperties } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { experiences } from "@/data/experience";
import type { Experience } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLenis } from "@/components/layout/SmoothScroll";
import { ExperienceChapter, useSceneMotion, splitStory } from "./ExperienceChapter";
import { TYPE_LABEL, formatRange, navYear } from "./chapterMeta";

const EXPERIENCE_BACKGROUND = "#111B2F";
const EASE = [0.16, 1, 0.3, 1] as const;

// Newest milestone first — the journey reads from where it stands today, back.
const CHAPTERS: Experience[] = [...experiences].sort((a, b) =>
  b.startDate.localeCompare(a.startDate),
);

const pad = (n: number) => String(n).padStart(2, "0");

// ============================================================
// Intro scene — the first viewport
// ============================================================
function IntroScene({
  progress,
  span,
}: {
  progress: MotionValue<number>;
  span: number;
}) {
  const { y } = useSceneMotion(progress, 0, span);
  // Fade the intro out fully and keep it gone for the rest of the scroll — the
  // full [0,1] input range means it can never snap back to full opacity and
  // overpower the chapter content. The faint background watermark carries the
  // word "Experience" from here on.
  const opacity = useTransform(progress, [0, 0.05, 1], [1, 0, 0]);

  return (
    <motion.div
      style={{ y, opacity }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className="mt-5 font-display font-bold tracking-tight text-[#E8EEFF]"
        style={{ fontSize: "clamp(3rem,10vw,7rem)", lineHeight: 0.95 }}
      >
        Experience
      </motion.h2>

      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
        className="mt-7 block h-px w-28 origin-center"
        style={{ background: "linear-gradient(90deg, transparent, #4F8EF7, transparent)" }}
      />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
        className="mt-7 max-w-md text-lg text-[#8892A4]"
      >
        The journey behind the work.
      </motion.p>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 text-[#4A5568]"
      >
        <span className="font-mono-custom text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: 7 }}
          transition={{ duration: 0.9, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="block h-2 w-px"
          style={{ background: "#4A5568" }}
        />
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// Cinematic, scroll-driven experience
// ============================================================
function CinematicExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const getLenis = useLenis();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scenes = CHAPTERS.length + 1; // intro + chapters
  const span = scenes - 1;
  const [active, setActive] = useState(0); // 0 = intro, 1..N = chapters

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(span, Math.max(0, Math.round(p * span)));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const scrollToScene = (sceneIndex: number) => {
    const el = containerRef.current;
    if (!el) return;
    const start = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    const top = start + (sceneIndex / span) * range;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(top);
    } else {
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const activeColor = active >= 1 ? CHAPTERS[active - 1].color : "#4F8EF7";

  return (
    <section
      id="experience"
      style={{ background: EXPERIENCE_BACKGROUND }}
      className="relative"
    >
      <h2 className="sr-only">Experience — the journey behind the work</h2>

      <div ref={containerRef} style={{ height: `${scenes * 100}vh` }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* minimal ambient wash — tinted by the active chapter.
              Crossfade opacity of keyed layers; gradients can't be tween-
              interpolated, so we never animate the `background` property itself. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <AnimatePresence>
              <motion.div
                key={activeColor}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: EASE }}
                style={{
                  background: `radial-gradient(60% 55% at 50% 42%, ${activeColor}1f, transparent 70%)`,
                }}
              />
            </AnimatePresence>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
            style={{ background: "linear-gradient(to top, rgba(13,21,38,0.6), transparent)" }}
          />

          {/* scenes */}
          <IntroScene progress={scrollYProgress} span={span} />
          {CHAPTERS.map((exp, i) => (
            <ExperienceChapter
              key={exp.id}
              experience={exp}
              progress={scrollYProgress}
              sceneIndex={i + 1}
              span={span}
              active={active === i + 1}
              chapterNumber={i + 1}
              totalChapters={CHAPTERS.length}
            />
          ))}

          {/* progress indicator — top-right */}
          <div className="absolute right-6 top-8 z-20 lg:right-10">
            <AnimatePresence mode="wait">
              {active >= 1 ? (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="flex items-baseline gap-1 font-mono-custom text-sm"
                >
                  <span className="text-[#E8EEFF]">{pad(active)}</span>
                  <span className="text-[#4A5568]">/ {pad(CHAPTERS.length)}</span>
                </motion.div>
              ) : (
                <motion.span
                  key="intro-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono-custom text-xs uppercase tracking-[0.3em] text-[#4A5568]"
                >
                  {pad(CHAPTERS.length)} chapters
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* side navigation — desktop only */}
          <nav
            aria-label="Experience chapters"
            className="absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3.5 lg:flex"
          >
            {CHAPTERS.map((exp, i) => {
              const sc = i + 1;
              const isActive = active === sc;
              return (
                <button
                  key={exp.id}
                  onClick={() => scrollToScene(sc)}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`Go to ${exp.title}, ${navYear(exp)}`}
                  className="group flex items-center justify-end gap-3"
                >
                  <span
                    className={`font-mono-custom text-xs tabular-nums transition-all duration-300 ${
                      isActive
                        ? "text-[#E8EEFF]"
                        : "text-[#4A5568] opacity-60 group-hover:opacity-100"
                    }`}
                  >
                    {navYear(exp)}
                  </span>
                  <span
                    className="block h-px transition-all duration-300"
                    style={{
                      width: isActive ? 28 : 14,
                      background: isActive ? exp.color : "#4A5568",
                    }}
                  />
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Reduced-motion fallback — calm, static chapters
// ============================================================
function ExperienceStatic() {
  return (
    <section
      id="experience"
      style={{ background: EXPERIENCE_BACKGROUND }}
      className="section-padding px-6"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <p className="font-mono-custom text-xs uppercase tracking-[0.4em] text-[#4F8EF7]">
            Experience
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-[#E8EEFF] md:text-5xl">
            The journey behind the work.
          </h2>
        </div>

        <div className="space-y-20">
          {CHAPTERS.map((exp) => {
            const { summary, desc } = splitStory(exp);
            return (
              <article
                key={exp.id}
                className="grid gap-10 border-t border-white/[0.06] pt-10 lg:grid-cols-[1.5fr_1fr] lg:gap-12"
                style={{ "--accent": exp.color } as CSSProperties}
              >
                {/* Left — the story */}
                <div className="max-w-xl">
                  <p
                    className="font-mono-custom text-xs uppercase tracking-[0.3em]"
                    style={{ color: exp.color }}
                  >
                    {TYPE_LABEL[exp.type]}
                  </p>
                  <h3 className="mt-3 font-display text-4xl font-bold leading-[1.05] text-[#E8EEFF] md:text-5xl">
                    {exp.title}
                  </h3>
                  <p className="mt-3 font-display text-xl font-bold text-[#C6D2EC] md:text-2xl">
                    {exp.organization}
                  </p>
                  <p className="mt-4 max-w-md text-lg leading-snug text-[#8892A4]">{summary}</p>
                  <p className="mt-4 font-mono-custom text-xs uppercase tracking-[0.24em] text-[#4A5568]">
                    {formatRange(exp)}
                  </p>
                  {desc && (
                    <p className="mt-8 max-w-md text-base leading-relaxed text-[#8892A4]">{desc}</p>
                  )}
                </div>

                {/* Right — the execution */}
                <div>
                  {exp.responsibilities.length > 0 && (
                    <div>
                      <h4 className="font-mono-custom text-xs uppercase tracking-[0.28em] text-[#8892A4]">
                        Key Contributions
                      </h4>
                      <div className="relative mt-6 pl-6">
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute left-[2px] top-1.5 bottom-1.5 w-px"
                          style={{
                            background: `linear-gradient(to bottom, ${exp.color}, ${exp.color}55 70%, transparent)`,
                          }}
                        />
                        <ul className="space-y-4">
                          {exp.responsibilities.slice(0, 5).map((c, i) => (
                            <li
                              key={i}
                              className="relative text-[15px] leading-relaxed text-[#8892A4]"
                            >
                              <span
                                aria-hidden="true"
                                className="absolute -left-6 top-[0.5em] h-[5px] w-[5px] -translate-y-1/2 rounded-full ring-2 ring-[#111B2F]"
                                style={{ background: exp.color }}
                              />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div aria-hidden="true" className="my-8 h-px w-full bg-white/[0.08]" />

                  <div>
                    <p className="font-mono-custom text-xs uppercase tracking-[0.28em] text-[#4A5568]">
                      Technologies
                    </p>
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      {exp.technologies.map((t) => (
                        <span
                          key={t}
                          className="cursor-default rounded-full border border-white/[0.08] bg-[#1A2540]/60 px-3 py-1 text-xs text-[#8892A4] transition-colors hover:border-[color:var(--accent)] hover:text-[#E8EEFF]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ExperienceSection() {
  const reduce = useReducedMotion();
  return reduce ? <ExperienceStatic /> : <CinematicExperience />;
}
