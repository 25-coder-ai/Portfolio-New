"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types";
import { GithubIcon } from "@/components/ui/Icons";
import { Badge } from "@/components/ui/Badge";

gsap.registerPlugin(ScrollTrigger);

// ---- Tunables for the waterfall ----
const CARD_W = "min(880px, 92vw)";
// Responsive height so the whole card (plus a little background) always fits the
// viewport before the waterfall starts moving — never clipped at the bottom.
const CARD_H = "min(440px, 50vh)";
const PEEK = 58; // px each lower card peeks below the active one (~1/8 of CARD_H)
const FLY_Y = 170; // px the active card travels up as it's replaced
// Clear space above the heading, INSIDE the pinned stage, so it sits below the
// fixed navbar (~68px). Living in-flow means the gap above "Featured Projects"
// looks identical while scrolling in and while paused — no jump at pin.
const HEADING_TOP = 96; // px
// Depth is built purely from translateY + scale + opacity (no perspective / no
// translateZ / no rotateX) — that keeps every card perfectly sharp, no blur.

// The card deck's one-time entrance rides ~180ms behind the heading's subtitle,
// so the sequence reads: label → title → subtitle → (short pause) → cards.
// Each container observes itself via whileInView — NOT the section-level
// observer, which is unreliable over the GSAP-pinned stage.
const EASE = [0.16, 1, 0.3, 1] as const;
const CARD_INTRO_DELAY = 0.45;
const CARD_INTRO = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 } as const,
  transition: { duration: 0.7, ease: EASE, delay: CARD_INTRO_DELAY },
};

// ----------------------------------------------------------------------------
// Card reveal choreography — a calm, Apple-style staggered entrance.
// Order follows DOM order: watermark → title → category → role → description
// → tech chips (one section) → "Explore Project".
// ----------------------------------------------------------------------------
const cardStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
} as const;
const itemReveal = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
} as const;
const watermarkReveal = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE } },
} as const;

// Treat template placeholders ("YOUR_GITHUB_URL") as "no link".
const isRealUrl = (u?: string) => !!u && /^https?:\/\//i.test(u);
// The one-sentence "role summary" — the first sentence of the solution blurb.
const firstSentence = (text: string) => {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
};

// ----------------------------------------------------------------------------
// Shared card visuals (used by both the 3D stack and the mobile fallback).
//
// A premium, product-page card: an enormous ultra-subtle monochrome watermark
// behind large typography, generous whitespace, tech chips, and a single
// "Explore Project →" affordance that expands to reveal Key Features. No
// screenshots, mockups, borders-for-borders'-sake or glassmorphism. The outer
// dimensions never change on desktop, so the GSAP waterfall math is untouched;
// the expansion simply grows into the card's whitespace (and grows the card
// naturally in the non-pinned mobile list).
// ----------------------------------------------------------------------------
function CardFace({
  project,
  isActive = true,
}: {
  project: Project;
  isActive?: boolean;
}) {
  const c = project.color;
  const [expanded, setExpanded] = useState(false);
  const roleSummary = firstSentence(project.solution);

  // Collapse again once this card is no longer the focused one (desktop).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isActive) setExpanded(false);
  }, [isActive]);

  const handleExplore = (e: React.MouseEvent) => {
    // On a background card, let the click bubble so the waterfall glides here.
    if (!isActive) return;
    e.stopPropagation();
    setExpanded((v) => !v);
  };

  return (
    <div
      data-card-inner
      className="relative h-full w-full overflow-hidden rounded-2xl"
      style={{
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
        background: "linear-gradient(180deg,#141d31 0%,#0f1727 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 30px 80px -42px rgba(0,0,0,0.75)",
      }}
    >
      <motion.div
        className="relative flex h-full w-full flex-col p-8 md:p-10"
        variants={cardStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Watermark — enormous, ~5% opacity, blurred, monochrome. Fades in first. */}
        <motion.div variants={watermarkReveal} className="absolute inset-0" aria-hidden>
          <Watermark category={project.category} />
        </motion.div>

        {/* Title — largest text, highest emphasis. */}
        <motion.h3
          variants={itemReveal}
          className="relative line-clamp-2 font-display text-[26px] font-bold leading-[1.08] tracking-tight text-[#F4F7FF] sm:text-3xl md:text-4xl"
        >
          {project.title}
        </motion.h3>

        {/* Category — tiny, letter-spaced metadata. */}
        <motion.p
          variants={itemReveal}
          className="relative mt-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[#6B7688]"
        >
          {project.category}
        </motion.p>

        {/* Role summary — exactly one sentence, medium weight. */}
        <motion.p
          variants={itemReveal}
          className="relative mt-4 line-clamp-2 max-w-2xl text-[15px] font-medium leading-relaxed text-[#C6CEDE] md:text-base"
        >
          {roleSummary}
        </motion.p>

        {/* Description — the problem it solves, kept to a couple of lines. */}
        <motion.p
          variants={itemReveal}
          className="relative mt-2.5 line-clamp-2 max-w-2xl text-[13px] leading-relaxed text-[#8892A4]"
        >
          {project.problem}
        </motion.p>

        {/* Expanded detail — Key Features, revealed on demand, one after another. */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="features"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative overflow-hidden"
            >
              <div className="pt-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#6B7688]">
                  Key Features
                </p>
                <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {project.features.slice(0, 4).map((f, idx) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE, delay: 0.14 + idx * 0.09 }}
                      className="flex items-start gap-2 text-[13px] leading-snug text-[#9AA7BD]"
                    >
                      <span
                        className="mt-[6px] h-1 w-1 shrink-0 rounded-full"
                        style={{ background: c }}
                      />
                      {f}
                    </motion.li>
                  ))}
                </ul>
                {isRealUrl(project.githubUrl) && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 inline-flex items-center gap-2 text-[12px] font-medium text-[#8892A4] transition-colors hover:text-[#E8EEFF]"
                  >
                    <GithubIcon size={14} />
                    View on GitHub
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Whitespace — lets the title breathe and anchors the footer (desktop). */}
        <div className="min-h-[16px] flex-1" />

        {/* Technology chips — existing chip styling, animate together as one section. */}
        <motion.div variants={itemReveal} className="relative flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 6).map((t) => (
            <Badge key={t} label={t} color="#5B7290" />
          ))}
        </motion.div>

        {/* Explore Project → — typography, not a button-chrome; arrow nudges on hover. */}
        <motion.div variants={itemReveal} className="relative mt-6">
          <button
            type="button"
            onClick={handleExplore}
            className="group/explore inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide text-[#E8EEFF] outline-none"
          >
            {expanded ? "Show less" : "Explore Project"}
            <ArrowRight
              size={15}
              className={`transition-transform duration-300 group-hover/explore:translate-x-1 ${
                expanded ? "-rotate-90" : ""
              }`}
            />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Watermark — an enormous, faint, monochrome glyph behind the card content.
// Chosen abstractly from the project's category so it registers subconsciously
// rather than consciously. Never a screenshot, illustration or mockup.
// ----------------------------------------------------------------------------
function Watermark({ category }: { category: string }) {
  const c = category.toLowerCase();
  const glyph = c.includes("data") ? (
    <DocGlyph />
  ) : c.includes("full") ? (
    <FlowGlyph />
  ) : c.includes("ai") || c.includes("cloud") || c.includes("generative") ? (
    <NetworkGlyph />
  ) : (
    <WireGlyph />
  );
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-[78%] w-[78%] text-white opacity-[0.045] blur-[2px]">
        {glyph}
      </div>
    </div>
  );
}

function NetworkGlyph() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="h-full w-full"
    >
      <path d="M100 52V88M92 106 47 111M108 106 153 111M96 111 74 158M104 111 126 158M47 119 66 154M153 119 134 154" />
      <circle cx="100" cy="40" r="11" />
      <circle cx="40" cy="112" r="11" />
      <circle cx="160" cy="112" r="11" />
      <circle cx="70" cy="168" r="11" />
      <circle cx="130" cy="168" r="11" />
      <circle cx="100" cy="100" r="13" />
    </svg>
  );
}

function DocGlyph() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
    >
      <rect x="46" y="28" width="108" height="144" rx="12" />
      <path d="M66 60H134M66 82H134M66 104H120M66 126H134M66 148H108" />
    </svg>
  );
}

function FlowGlyph() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
    >
      <rect x="16" y="84" width="38" height="32" rx="8" />
      <rect x="81" y="84" width="38" height="32" rx="8" />
      <rect x="146" y="84" width="38" height="32" rx="8" />
      <path d="M54 100H81M119 100H146M72 94l7 6-7 6M137 94l7 6-7 6" />
    </svg>
  );
}

function WireGlyph() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
      className="h-full w-full"
    >
      <path d="M100 22 172 64V136L100 178 28 136V64L100 22Z" />
      <path d="M100 22V178M28 64 172 136M172 64 28 136" />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Mobile / reduced fallback: a clean vertical list, no pinning
// ----------------------------------------------------------------------------
function ProjectList({
  projects,
  heading,
}: {
  projects: Project[];
  heading: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {heading}
      <motion.div className="mt-10 space-y-6" {...CARD_INTRO}>
        {projects.map((p) => (
          <div
            key={p.id}
            style={{ minHeight: 380 }}
            className="[perspective:1200px]"
          >
            <CardFace project={p} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Desktop: the GSAP ScrollTrigger 3D waterfall
// ----------------------------------------------------------------------------
function WaterfallStack({
  projects,
  heading,
}: {
  projects: Project[];
  heading: ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const n = projects.length;
    const lastActive = { current: -1 };

    const layout = (progress: number) => {
      const pos = progress * (n - 1); // continuous "active" index
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const rel = i - pos;
        let y: number, scale: number, opacity: number;

        if (rel >= 0) {
          // Active card (rel≈0) and the stack waiting below it. Depth via a
          // gentle downscale only, so a waiting card is already crisp and only
          // a touch smaller — it reads clearly well before it becomes active.
          y = rel * PEEK;
          scale = Math.max(0.8, 1 - rel * 0.05);
          opacity = rel <= 3 ? 1 : Math.max(0, 1 - (rel - 3));
        } else {
          // Already passed — gliding up and shrinking away as it fades out.
          const p = -rel;
          y = -p * FLY_Y;
          scale = Math.max(0.55, 1 - p * 0.16);
          opacity = Math.max(0, 1 - p * 0.9);
        }

        gsap.set(el, {
          y,
          scale,
          autoAlpha: opacity,
          force3D: true, // keep each card on its own GPU layer = cheap composite
          zIndex: Math.round(1000 - Math.abs(rel) * 10),
          pointerEvents: rel >= -0.05 && rel <= 3.2 ? "auto" : "none",
        });
      }
      // Track the nearest card for the active-state UI — only when it actually
      // changes, so we never re-render React on a scroll tick.
      const a = Math.round(pos);
      if (a !== lastActive.current) {
        lastActive.current = a;
        setActive(a);
      }
    };

    cardRefs.current.forEach((el) => {
      if (el) gsap.set(el, { xPercent: -50, yPercent: -50 });
    });
    layout(0);

    // Drive the layout from a tween whose playhead ScrollTrigger SCRUBS. Scrub
    // eases that playhead toward the scroll position, so the cards glide even
    // though mouse-wheel scrolling arrives in discrete chunks. (Reading the raw
    // scroll progress in onUpdate would inherit that chunkiness — no glide.)
    const proxy = { p: 0 };
    // A short hold at each end: the section pins with the first card fully
    // framed and DOESN'T move for ~0.45 of a viewport of scroll, so the user
    // sees the whole card first; same at the end for the last card. The middle
    // segment is the waterfall. (vh cancels, so this is resize-safe.)
    const holdDur = 0.45 / (0.9 * n);
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      onUpdate: () => layout(proxy.p),
    });
    tl.to(proxy, { p: 0, duration: holdDur }); // lead-in: first card sits still
    tl.to(proxy, { p: 1, duration: 1 }); //          the gliding waterfall
    tl.to(proxy, { p: 1, duration: holdDur }); // trailing: last card sits still

    const st = ScrollTrigger.create({
      animation: tl,
      trigger: stage,
      start: "top top",
      end: () => "+=" + window.innerHeight * (0.9 * n + 0.9),
      pin: stage,
      pinSpacing: true,
      scrub: 1.5, // seconds of catch-up — higher = more glide
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
    stRef.current = st;

    // Recalculate once any embedded videos report dimensions.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      st.kill();
      tl.kill();
    };
  }, [projects]);

  const goToIndex = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const n = projects.length;
    const p = n > 1 ? i / (n - 1) : 0;
    // The waterfall occupies the MIDDLE of the scroll (between the lead-in and
    // trailing holds), so map p through the timeline so we land on card i.
    const holdDur = 0.45 / (0.9 * n);
    const frac = (holdDur + p) / (2 * holdDur + 1);
    const top = st.start + frac * (st.end - st.start);
    window.scrollTo({ top, behavior: "smooth" });
  };

  const onCardMove = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    if (i !== active) return; // only the focused card tilts
    const inner = e.currentTarget.querySelector<HTMLElement>(
      "[data-card-inner]"
    );
    if (!inner) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    // pure 2D lift — stays perfectly sharp, no perspective/blur
    inner.style.transform = `translate(${dx * 6}px, ${dy * 6 - 10}px) scale(1.03)`;
  };

  const onCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const inner = e.currentTarget.querySelector<HTMLElement>(
      "[data-card-inner]"
    );
    if (inner) inner.style.transform = "";
  };

  return (
    // The whole section-height stage is pinned, so scrolling ANYWHERE inside it
    // advances the cards — the user must scroll through every project before the
    // pin releases and the next section appears.
    <div
      ref={stageRef}
      className="relative flex h-screen w-full flex-col"
    >
      {/* Heading rides along below the navbar. The top padding lives inside the
          pinned stage, so the space above it is the same scrolling-in or paused. */}
      <div className="shrink-0 px-6" style={{ paddingTop: HEADING_TOP }}>
        <div className="mx-auto max-w-7xl">{heading}</div>
      </div>

      {/* Card theatre. overflow-hidden clips cards to this region (which sits
          below the heading), so a card gliding upward as it's replaced never
          renders over the title. */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* paddingBottom lifts the centred stack toward the top — but trimmed so
            the active card keeps clear top clearance below the heading and a
            card gliding up doesn't reach the title. */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ paddingBottom: "18vh" }}
          {...CARD_INTRO}
        >
          <div className="relative">
            {projects.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                onClick={() => i !== active && goToIndex(i)}
                onMouseMove={(e) => onCardMove(e, i)}
                onMouseLeave={onCardLeave}
                className="absolute left-1/2 top-1/2 cursor-pointer"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
                }}
              >
                <CardFace project={p} isActive={i === active} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progress rail — click to glide to any project */}
        <div className="absolute right-6 top-1/2 z-[1100] hidden -translate-y-1/2 flex-col gap-3 lg:flex">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => goToIndex(i)}
              aria-label={`Go to ${p.title}`}
              className="group relative flex cursor-pointer items-center justify-end"
            >
              <span
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 22 : 8,
                  height: 8,
                  background: i === active ? p.color : "rgba(255,255,255,0.25)",
                }}
              />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
export function ProjectWaterfall({
  projects,
  heading,
}: {
  projects: Project[];
  heading: ReactNode;
}) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Avoid initialising ScrollTrigger against a hidden/unknown layout.
  if (isDesktop === null) {
    return <div style={{ minHeight: 480 }} />;
  }

  return isDesktop ? (
    <WaterfallStack projects={projects} heading={heading} />
  ) : (
    <ProjectList projects={projects} heading={heading} />
  );
}
