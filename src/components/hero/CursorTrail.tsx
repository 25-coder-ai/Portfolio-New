"use client";
import { memo, useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useImageTrail, type TrailImageItem } from "@/hooks/useImageTrail";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IMAGE_TRAIL } from "@/lib/constants";

/**
 * One trail image. Memoized so that spawning a new image does NOT re-render
 * the images already on screen — the parent re-renders the list on every
 * spawn, but unchanged items bail out, keeping fast trails smooth.
 *
 * Each image plays a SINGLE animation across its whole lifetime: a quick soft
 * appear, a plateau at full opacity/size, then a continuous fade + shrink IN
 * PLACE. Because images are spawned in sequence, at any instant older ones are
 * further along this curve → a smooth gradient down the trail = one ribbon.
 */
const TrailImageView = memo(function TrailImageView({
  item,
  onError,
}: {
  item: TrailImageItem;
  onError: (src: string) => void;
}) {
  const life = IMAGE_TRAIL.imageLifetime / 1000;
  return (
    <motion.div
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
      initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%", rotate: item.rotation }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.9, 1, 1, 0.6],
        x: "-50%",
        y: "-50%",
        rotate: item.rotation,
      }}
      transition={{
        duration: life,
        // 5% appear · hold full to 55% · gentle fade to 0 — the plateau keeps
        // the ribbon solid even on a slow drag.
        times: [0, 0.05, 0.55, 1],
        ease: ["easeOut", "linear", "linear"],
      }}
    >
      <Image
        src={item.src}
        alt=""
        width={IMAGE_TRAIL.width}
        height={IMAGE_TRAIL.height}
        quality={70}
        loading="eager"
        draggable={false}
        onError={() => onError(item.src)}
        style={{
          width: IMAGE_TRAIL.width,
          height: IMAGE_TRAIL.height,
          objectFit: "cover",
          borderRadius: 2,
          display: "block",
          boxShadow: "0 8px 22px rgba(0,0,0,0.32)",
        }}
      />
    </motion.div>
  );
});

/**
 * Image trail confined to the hero section. The wrapper is absolutely
 * positioned inside the (relative, overflow-hidden) hero, so images clip to
 * the hero and scroll away with it — no trail in any other section.
 */
export function CursorTrail() {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useImageTrail(containerRef, !prefersReduced);

  // Hide images whose source 404s (e.g. before you've added the real photos).
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const handleError = useCallback((src: string) => {
    setBroken((b) => (b[src] ? b : { ...b, [src]: true }));
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        overflow: "hidden",
      }}
    >
      {items.map((it) =>
        broken[it.src] ? null : (
          <TrailImageView key={it.id} item={it} onError={handleError} />
        )
      )}
    </div>
  );
}
