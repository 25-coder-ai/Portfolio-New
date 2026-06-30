"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Flowing Data Paths — abstract information streams drifting behind the
// content. Long, faint Bézier curves on three depth layers (back = blurred +
// dim, front = sharper). Tiny glowing packets travel along the curves at
// different speeds with natural gaps. Subtle scroll parallax.
//
// Performance: the curves never change shape, so each layer is pre-rendered
// once (with its blur baked in) to an offscreen canvas and simply blitted each
// frame — no per-frame canvas filter. The loop only runs while the section is
// on screen, reads no layout during animation (geometry is cached on resize),
// and pushes zero React state. Honours prefers-reduced-motion (static only).

type Pt = { x: number; y: number };
type PathDef = { c: [Pt, Pt, Pt, Pt]; layer: number };

const PATHS: PathDef[] = [
  { layer: 0, c: [p(-0.1, 0.20), p(0.30, 0.04), p(0.62, 0.36), p(1.1, 0.16)] },
  { layer: 0, c: [p(-0.1, 0.82), p(0.26, 0.60), p(0.55, 0.92), p(1.1, 0.66)] },
  { layer: 0, c: [p(-0.1, 0.46), p(0.32, 0.56), p(0.70, 0.28), p(1.1, 0.52)] },
  { layer: 1, c: [p(-0.1, 0.34), p(0.36, 0.52), p(0.66, 0.14), p(1.1, 0.33)] },
  { layer: 1, c: [p(-0.1, 0.70), p(0.30, 0.88), p(0.60, 0.54), p(1.1, 0.80)] },
  { layer: 2, c: [p(-0.1, 0.56), p(0.30, 0.40), p(0.72, 0.72), p(1.1, 0.50)] },
  { layer: 2, c: [p(-0.1, 0.92), p(0.36, 0.74), p(0.70, 0.96), p(1.1, 0.70)] },
];

const LAYERS = [
  { blur: 6, alpha: 0.05, width: 1, parallax: 0.2, color: "120,170,255" },
  { blur: 2.5, alpha: 0.075, width: 1.2, parallax: 0.45, color: "140,200,255" },
  { blur: 0, alpha: 0.095, width: 1.4, parallax: 0.7, color: "175,225,255" },
];

// Which path each packet rides (some paths get none, others two → variation).
const PARTICLE_PATHS = [0, 2, 3, 3, 4, 5, 5, 6, 1];

const AMP = 60; // px of parallax travel
const CURSOR_R = 130; // px radius of the (very faint) cursor influence

function p(x: number, y: number): Pt {
  return { x, y };
}

function cubic(c: [Pt, Pt, Pt, Pt], t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return {
    x: a * c[0].x + b * c[1].x + d * c[2].x + e * c[3].x,
    y: a * c[0].y + b * c[1].y + d * c[2].y + e * c[3].y,
  };
}

type Particle = { path: number; t: number; speed: number; size: number; gap: number };

export function FlowingPaths() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf = 0;
    let last = 0;
    let running = false;

    // Cached geometry (document-relative) — refreshed only on resize, never
    // read during the animation loop, so scrolling triggers no layout work.
    let pageTop = 0;
    let pageLeft = 0;
    let drive = 0;
    const pointer = { x: -9999, y: -9999 };

    // Soft glow sprite for the packets.
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d");
    if (sctx) {
      const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(200,235,255,1)");
      g.addColorStop(0.4, "rgba(150,210,255,0.55)");
      g.addColorStop(1, "rgba(150,210,255,0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, 64, 64);
    }

    // One offscreen canvas per depth layer with the blur baked in once.
    const layerCanvases: HTMLCanvasElement[] = LAYERS.map(() =>
      document.createElement("canvas"),
    );

    const buildLayers = () => {
      LAYERS.forEach((cfg, li) => {
        const lc = layerCanvases[li];
        lc.width = W * dpr;
        lc.height = H * dpr;
        const lctx = lc.getContext("2d");
        if (!lctx) return;
        lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        lctx.clearRect(0, 0, W, H);
        lctx.filter = cfg.blur ? `blur(${cfg.blur}px)` : "none";
        lctx.lineWidth = cfg.width;
        lctx.strokeStyle = `rgba(${cfg.color},${cfg.alpha})`;
        for (const path of PATHS) {
          if (path.layer !== li) continue;
          lctx.beginPath();
          lctx.moveTo(path.c[0].x * W, path.c[0].y * H);
          lctx.bezierCurveTo(
            path.c[1].x * W, path.c[1].y * H,
            path.c[2].x * W, path.c[2].y * H,
            path.c[3].x * W, path.c[3].y * H,
          );
          lctx.stroke();
        }
      });
    };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const particles: Particle[] = PARTICLE_PATHS.map((path) => {
      const gap = rand(0.15, 0.9);
      return {
        path,
        t: rand(-gap, 1),
        speed: rand(0.018, 0.042),
        size: rand(1.6, 3),
        gap,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      for (let li = 0; li < LAYERS.length; li++) {
        const off = drive * AMP * LAYERS[li].parallax;
        // Blit the pre-blurred curves for this layer.
        ctx.drawImage(layerCanvases[li], 0, off, W, H);
        if (reduce) continue;
        // Packets (already soft; no per-frame filter needed).
        for (const pt of particles) {
          if (PATHS[pt.path].layer !== li || pt.t < 0 || pt.t > 1) continue;
          const pos = cubic(PATHS[pt.path].c, pt.t);
          const x = pos.x * W;
          const y = pos.y * H + off;
          const d = Math.hypot(x - pointer.x, y - pointer.y);
          const near = d < CURSOR_R ? (1 - d / CURSOR_R) * 0.4 : 0;
          const r = pt.size * (1 + near * 0.5);
          ctx.globalAlpha = 0.5 + near;
          ctx.drawImage(sprite, x - r * 2, y - r * 2, r * 4, r * 4);
        }
      }
      ctx.globalAlpha = 1;
    };

    const updateDrive = () => {
      const center = pageTop + H / 2;
      drive = (window.scrollY + window.innerHeight / 2 - center) / window.innerHeight;
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      updateDrive();
      for (const pt of particles) {
        pt.t += pt.speed * dt;
        if (pt.t > 1) pt.t = -pt.gap;
      }
      render();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const resize = () => {
      W = parent.offsetWidth;
      H = parent.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rect = canvas.getBoundingClientRect();
      pageTop = rect.top + window.scrollY;
      pageLeft = rect.left + window.scrollX;
      buildLayers();
      updateDrive();
      if (!running) render(); // refresh the static frame
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX + window.scrollX - pageLeft;
      pointer.y = e.clientY + window.scrollY - pageTop;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // Only animate while the section is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "100px" },
    );
    io.observe(parent);

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
