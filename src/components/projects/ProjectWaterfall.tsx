"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";
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
// Depth is built purely from translateY + scale + opacity (no perspective / no
// translateZ / no rotateX) — that keeps every card perfectly sharp, no blur.

// ----------------------------------------------------------------------------
// Shared card visuals (used by both the 3D stack and the mobile fallback)
// ----------------------------------------------------------------------------
function CardFace({ project }: { project: Project }) {
  const c = project.color;
  return (
    <div
      data-card-inner
      className="relative flex h-full w-full overflow-hidden rounded-2xl"
      style={{
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
        background:
          "linear-gradient(155deg, #131c30 0%, #0e1626 55%, #0b1220 100%)",
        // Visible, neutral border with a faint colored bloom — never pure blue.
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: `0 28px 70px rgba(0,0,0,0.55), 0 0 0 1px ${c}1f, 0 0 60px -28px ${c}66`,
      }}
    >
      {/* Accent rail — the card's identity colour, kept subtle */}
      <span
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: `linear-gradient(${c}, ${c}00)` }}
        aria-hidden="true"
      />

      {/* Left: the story */}
      <div className="flex min-w-0 flex-1 flex-col p-7">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge label={project.category} color={c} />
          <Badge label={project.year} color="#8892A4" />
        </div>

        <h3 className="font-display text-2xl font-bold leading-tight text-[#E8EEFF] md:text-[28px]">
          {project.title}
        </h3>

        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[#9AA7BD]">
          {project.solution}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 6).map((t) => (
            <Badge key={t} label={t} color="#5B7290" />
          ))}
        </div>

        <div className="mt-auto flex gap-3 pt-5">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#06101f] transition-transform hover:scale-[1.03]"
              style={{ background: c, boxShadow: `0 6px 22px ${c}45` }}
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-4 py-2 text-sm font-semibold text-[#E8EEFF] transition-colors hover:bg-white/[0.05]"
            >
              <GithubIcon size={14} />
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Right: the demo video */}
      <div
        className="relative hidden w-[42%] shrink-0 overflow-hidden sm:block"
        style={{
          margin: 14,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${c}33, #0a1120)`,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {project.video && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={project.video}
            poster={project.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
        {/* readability + fallback texture when no video is present */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,14,26,0) 55%, rgba(8,14,26,0.55) 100%)",
          }}
        />
        <span className="absolute bottom-2 right-3 font-mono-custom text-[9px] uppercase tracking-widest text-white/35">
          {project.video ? "Demo" : "Preview"}
        </span>
      </div>
    </div>
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
      <div className="mt-10 space-y-6">
        {projects.map((p) => (
          <div
            key={p.id}
            style={{ height: 380 }}
            className="[perspective:1200px]"
          >
            <CardFace project={p} />
          </div>
        ))}
      </div>
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
      {/* Heading rides along, fixed at the top while cards flow */}
      <div className="shrink-0 px-6 pt-[4vh]">
        <div className="mx-auto max-w-7xl">{heading}</div>
      </div>

      {/* Card theatre */}
      <div className="relative min-h-0 flex-1">
        {/* paddingBottom lifts the centred stack toward the top — less empty
            background above the deck, and it leaves a clear band at the bottom
            for the always-visible scroll counter. */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ paddingBottom: "28vh" }}
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
                <CardFace project={p} />
              </div>
            ))}
          </div>
        </div>

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
