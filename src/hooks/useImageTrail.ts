"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import { generateId } from "@/lib/utils";
import { IMAGE_TRAIL } from "@/lib/constants";
import { trailImages } from "@/data/trailImages";

export interface TrailImageItem {
  id: string;
  src: string;
  x: number; // px, relative to the container
  y: number; // px, relative to the container
  rotation: number;
}

/**
 * Codrops-style image trail. As the cursor moves inside `containerRef`, images
 * are spawned at a *uniform spacing* (every `spawnDistance` px of travel) and
 * removed after `imageLifetime` ms — producing a trail that follows the cursor
 * and fades away behind it. Only active while the cursor is over the container
 * (i.e. the hero section), so no trail appears in other sections.
 */
export function useImageTrail(
  containerRef: RefObject<HTMLElement | null>,
  enabled = true
) {
  const [items, setItems] = useState<TrailImageItem[]>([]);

  // Mutable refs so the rAF loop reads fresh values without re-subscribing.
  const pending = useRef<{ x: number; y: number; inside: boolean } | null>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const accrued = useRef(0);
  const imgIndex = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || trailImages.length === 0) return;

    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      pending.current = { x: e.clientX - r.left, y: e.clientY - r.top, inside };
    };

    const makeItem = (x: number, y: number): TrailImageItem => {
      const src = trailImages[imgIndex.current % trailImages.length];
      imgIndex.current += 1;
      return {
        id: generateId(),
        src,
        x,
        y,
        rotation: (Math.random() - 0.5) * 16,
      };
    };

    // Commit a frame's worth of new images in ONE state update (avoids a
    // re-render per image) and schedule each one's fade-out.
    const commit = (created: TrailImageItem[]) => {
      if (created.length === 0) return;
      setItems((prev) => [...prev, ...created].slice(-IMAGE_TRAIL.maxImages));
      for (const it of created) {
        window.setTimeout(() => {
          setItems((prev) => prev.filter((x) => x.id !== it.id));
        }, IMAGE_TRAIL.imageLifetime);
      }
    };

    // Safety cap so an extreme flick can't mount hundreds of nodes at once.
    const MAX_PER_FRAME = 16;

    const tick = () => {
      const p = pending.current;
      if (p && p.inside) {
        if (last.current === null) {
          // Cursor just entered → drop the first image right away.
          last.current = { x: p.x, y: p.y };
          accrued.current = 0;
          commit([makeItem(p.x, p.y)]);
        } else {
          const dx = p.x - last.current.x;
          const dy = p.y - last.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0) {
            const D = IMAGE_TRAIL.spawnDistance;
            const total = accrued.current + dist;
            const ideal = Math.floor(total / D);
            const created: TrailImageItem[] = [];

            if (ideal >= 1 && ideal <= MAX_PER_FRAME) {
              // Normal case: lay images at uniform D spacing along the path.
              for (let k = 1; k <= ideal; k++) {
                const f = (k * D - accrued.current) / dist; // 0..1 along last→cur
                created.push(
                  makeItem(last.current.x + dx * f, last.current.y + dy * f)
                );
              }
              accrued.current = total - ideal * D; // carry remainder
            } else if (ideal > MAX_PER_FRAME) {
              // Extreme flick: spread MAX images across the WHOLE segment so
              // the trail still reaches the cursor (last lands at current),
              // instead of bunching at the start and lagging far behind.
              for (let k = 1; k <= MAX_PER_FRAME; k++) {
                const f = k / MAX_PER_FRAME; // 0..1, last == current
                created.push(
                  makeItem(last.current.x + dx * f, last.current.y + dy * f)
                );
              }
              accrued.current = 0;
            } else {
              // Not enough travel to spawn yet → just accumulate.
              accrued.current = total;
            }

            last.current = { x: p.x, y: p.y };
            commit(created);
          }
        }
      } else {
        // Cursor left the hero → stop the trail (existing images still fade).
        last.current = null;
        accrued.current = 0;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
    };
  }, [containerRef, enabled]);

  return items;
}
