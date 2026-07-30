"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/types";

// ============================================================================
// ENGINEERING WORKSPACE
// Projects are floating "engineering sheets" spread naturally across the page —
// each resting at a slightly different position and rotation, like drawings on a
// designer's desk. On hover a sheet straightens, lifts, and its shadow deepens.
// On click the sheet FLIPS in place (3D rotateY) to reveal the full engineering
// case study on its back face; clicking again (or Escape) flips it back. Only
// one sheet is flipped at a time. No glassmorphism, no flashy gradients —
// tactile, editorial, and carefully choreographed. Inspired by Figma / Framer.
// ============================================================================

const EASE = [0.16, 1, 0.3, 1] as const;

// A flat "drafting sheet" surface — solid, no showy gradient. Depth comes from
// the drop shadow and a faint blueprint grid, not from the fill.
const SHEET_BG = "#111a2b";
const SHEET_BORDER = "1px solid rgba(255,255,255,0.07)";
const REST_SHADOW = "0 14px 34px -20px rgba(0,0,0,0.75)";
const LIFT_SHADOW = "0 34px 66px -26px rgba(0,0,0,0.9)";

// Resting scatter (desktop). Per-index rotation + nudge, so the sheets sit like
// documents casually dropped on a desk. Mobile flattens all of this to 0.
const SCATTER = [
  { rot: -2.3, x: -6, y: 8 },
  { rot: 1.9, x: 8, y: 40 },
  { rot: 2.4, x: 4, y: -14 },
  { rot: -1.7, x: -10, y: 30 },
  { rot: -2.1, x: 6, y: 4 },
] as const;

// #rrggbb → rgba() at a given alpha (all project colours are 6-digit hex).
function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop;
}

// Small engineering registration marks in the four corners of a sheet — drawn
// as short L-shaped strokes (not a connected border) for a drafting feel.
function CornerTicks({
  opacity = 0.14,
  topRight = true,
}: {
  opacity?: number;
  topRight?: boolean;
}) {
  const line = `rgba(255,255,255,${opacity})`;
  const common = "pointer-events-none absolute h-3.5 w-3.5";
  return (
    <>
      <span
        aria-hidden
        className={`${common} left-3.5 top-3.5`}
        style={{ borderTop: `1px solid ${line}`, borderLeft: `1px solid ${line}` }}
      />
      {topRight && (
        <span
          aria-hidden
          className={`${common} right-3.5 top-3.5`}
          style={{ borderTop: `1px solid ${line}`, borderRight: `1px solid ${line}` }}
        />
      )}
      <span
        aria-hidden
        className={`${common} bottom-3.5 left-3.5`}
        style={{ borderBottom: `1px solid ${line}`, borderLeft: `1px solid ${line}` }}
      />
      <span
        aria-hidden
        className={`${common} bottom-3.5 right-3.5`}
        style={{ borderBottom: `1px solid ${line}`, borderRight: `1px solid ${line}` }}
      />
    </>
  );
}

// Shared face styling (front + back share the same drafting surface + size).
const faceClass =
  "absolute inset-0 overflow-hidden rounded-[14px] [backface-visibility:hidden]";
const faceStyle = { background: SHEET_BG, border: SHEET_BORDER } as const;

// A thin accent hairline along the top edge of a face.
function AccentEdge({ accent, alpha = 0.5 }: { accent: string; alpha?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-px"
      style={{
        background: `linear-gradient(90deg, transparent, ${hexA(accent, alpha)} 30%, ${hexA(
          accent,
          alpha,
        )} 70%, transparent)`,
      }}
    />
  );
}

// ----------------------------------------------------------------------------
// FRONT — the resting preview of the sheet.
// ----------------------------------------------------------------------------
function SheetFront({ project }: { project: Project }) {
  const accent = project.color;

  return (
    <div className={faceClass} style={faceStyle}>
      <CornerTicks />
      <AccentEdge accent={accent} />

      <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A97AD]">
              {project.category}
            </span>
          </div>

          <h3 className="mt-3 font-display text-[21px] font-bold leading-[1.15] tracking-tight text-[#F4F7FF] transition-colors duration-300 group-hover:text-white sm:text-[23px]">
            {project.title}
          </h3>

          <p className="mt-3 line-clamp-2 max-w-[42ch] text-[13px] leading-relaxed text-[#93A0B6]">
            {project.solution}
          </p>
        </div>

        <div>
          {/* Tech stack — always visible on the front of the sheet. */}
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10.5px] font-medium tracking-tight text-[#9AA7BD]"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-all duration-300 group-hover:brightness-125"
              style={{ color: accent, background: hexA(accent, 0.12) }}
            >
              Flip →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// BACK — the full case study, revealed by the flip. Scrolls within the card.
// ----------------------------------------------------------------------------
function SheetBack({
  project,
  flipped,
  onClose,
}: {
  project: Project;
  flipped: boolean;
  onClose: () => void;
}) {
  const accent = project.color;
  const hasResults = (project.results?.length ?? 0) > 0;

  return (
    <div
      className={faceClass}
      style={{ ...faceStyle, transform: "rotateY(180deg)" }}
      // The back is only interactive once it faces the viewer.
      aria-hidden={!flipped}
    >
      <CornerTicks opacity={0.12} topRight={false} />
      <AccentEdge accent={accent} alpha={0.6} />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Flip back"
        tabIndex={flipped ? 0 : -1}
        className="absolute right-3.5 top-3.5 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/10 text-[#AEB8CC] transition-colors hover:border-white/25 hover:text-white"
      >
        <X size={15} />
      </button>

      {/* Header (fixed) */}
      <div className="relative px-6 pt-6 sm:px-7">
        <h3 className="pr-10 font-display text-[19px] font-bold leading-[1.15] tracking-tight text-[#F4F7FF] sm:text-[21px]">
          {project.title}
        </h3>
      </div>

      {/* Scrolling body — only Key Features + Results.
          `data-lenis-prevent` releases this element from Lenis so the wheel
          scrolls the card natively; `overscroll-contain` stops the scroll from
          chaining out to the page at the top/bottom edges. */}
      <div
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        className="relative mt-3 h-[calc(100%-92px)] overflow-y-auto overscroll-contain px-6 pb-6 sm:px-7 [scrollbar-width:thin]"
      >
        <CaseSection label="Key Features">
          <BulletList items={project.features} accent={accent} />
        </CaseSection>

        {hasResults && (
          <CaseSection label="Results">
            <BulletList items={project.results!} accent={accent} />
          </CaseSection>
        )}
      </div>
    </div>
  );
}

function CaseSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-5 first:mt-1">
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-[#6B7688]">
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function BulletList({ items, accent }: { items: string[]; accent: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it) => (
        <li
          key={it}
          className="flex items-start gap-2.5 text-[12.5px] leading-snug text-[#9AA7BD]"
        >
          <span
            className="mt-[6px] h-1 w-1 shrink-0 rounded-full"
            style={{ background: accent }}
          />
          {it}
        </li>
      ))}
    </ul>
  );
}

// ----------------------------------------------------------------------------
// A single sheet: resting scatter + hover lift on the outer wrapper, and a 3D
// flip on the inner card that swaps front ↔ back.
// ----------------------------------------------------------------------------
function Sheet({
  project,
  index,
  desktop,
  flipped,
  onToggle,
}: {
  project: Project;
  index: number;
  desktop: boolean;
  flipped: boolean;
  onToggle: () => void;
}) {
  const s = SCATTER[index % SCATTER.length];
  const rot = desktop ? s.rot : 0;
  const rx = desktop ? s.x : 0;
  const ry = desktop ? s.y : 0;
  const [entered, setEntered] = useState(false);

  // Outer wrapper: entrance, resting tilt, hover lift, flip-time straighten.
  const outerAnimate = !entered
    ? { opacity: 0, y: ry + 46, x: rx, rotate: rot * 0.35, scale: 0.96, boxShadow: REST_SHADOW }
    : flipped
      ? { opacity: 1, y: ry - 10, x: rx, rotate: 0, scale: 1.03, boxShadow: LIFT_SHADOW }
      : { opacity: 1, y: ry, x: rx, rotate: rot, scale: 1, boxShadow: REST_SHADOW };

  return (
    <motion.div
      initial={false}
      onViewportEnter={() => setEntered(true)}
      viewport={{ once: true, amount: 0.3 }}
      animate={outerAnimate}
      whileHover={
        flipped
          ? undefined
          : { rotate: 0, y: ry - 14, scale: 1.025, boxShadow: LIFT_SHADOW }
      }
      transition={{ duration: 0.6, ease: EASE }}
      style={{ perspective: 1400, zIndex: flipped ? 20 : 1, borderRadius: 14 }}
      className="group relative h-[360px] w-full sm:h-[372px]"
    >
      {/* Inner card — the element that actually flips. */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={`${flipped ? "Flip back from" : "Flip to view"} case study: ${project.title}`}
        aria-pressed={flipped}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 1.05, ease: EASE }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative h-full w-full cursor-pointer rounded-[14px]"
      >
        <SheetFront project={project} />
        <SheetBack project={project} flipped={flipped} onClose={onToggle} />
      </motion.div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------------
// The workspace: scattered flip-sheets. Each flips independently — flipping one
// never flips another back. Escape flips every open card back.
// ----------------------------------------------------------------------------
function ProjectWorkspace({ projects }: { projects: Project[] }) {
  const desktop = useIsDesktop();
  const [flipped, setFlipped] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (flipped.size === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFlipped(new Set());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped]);

  const toggle = (id: string) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="mx-auto grid max-w-5xl gap-x-14 gap-y-12 px-2 sm:grid-cols-2 md:gap-x-16">
      {projects.map((p, i) => (
        <div key={p.id} className={i % 2 === 1 ? "md:mt-16" : "md:mt-0"}>
          <Sheet
            project={p}
            index={i}
            desktop={desktop}
            flipped={flipped.has(p.id)}
            onToggle={() => toggle(p.id)}
          />
        </div>
      ))}
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
  return (
    <div className="px-6 pb-28 pt-24 md:pt-28">
      <div className="mx-auto max-w-7xl">{heading}</div>
      <div className="mt-16 md:mt-24">
        <ProjectWorkspace projects={projects} />
      </div>
    </div>
  );
}

