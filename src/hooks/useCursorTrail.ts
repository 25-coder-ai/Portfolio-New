"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { generateId, randomBetween, randomChoice } from "@/lib/utils";
import { CURSOR_TRAIL } from "@/lib/constants";
import type { TrailCard, TrailCardType } from "@/types";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { achievements } from "@/data/achievements";

// Card content pools
const CARD_POOLS: Record<TrailCardType, () => { title: string; subtitle?: string; color: string }> = {
  project: () => {
    const p = randomChoice(projects);
    return { title: p.title, subtitle: p.category, color: p.color };
  },
  achievement: () => {
    const a = randomChoice(achievements);
    return { title: a.title, subtitle: a.issuer, color: a.color };
  },
  skill: () => {
    const s = randomChoice(skills);
    return { title: s.name, subtitle: `${s.levelPercent}% proficiency`, color: s.brandColor };
  },
  blueprint: () => {
    const p = randomChoice(projects);
    return { title: p.title, subtitle: p.techStack.slice(0, 2).join(" · "), color: "#4F8EF7" };
  },
  note: () => {
    const notes = [
      { title: "Open to opportunities", subtitle: "Full-time & internships", color: "#F59E0B" },
      { title: "Big Data Enthusiast", subtitle: "Turning data into insight", color: "#34D399" },
      { title: "Always learning", subtitle: "Latest: Graph Neural Nets", color: "#A78BFA" },
      { title: "Let's collaborate", subtitle: "akilan.r@cict.in", color: "#4F8EF7" },
    ];
    return randomChoice(notes);
  },
};

const CARD_TYPES: TrailCardType[] = ["project", "achievement", "skill", "blueprint", "note"];

export function useCursorTrail() {
  const [cards, setCards] = useState<TrailCard[]>([]);
  const lastPos = useRef({ x: 0, y: 0, time: Date.now() });
  const lastSpawnTime = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pendingPos = useRef({ x: 0, y: 0 });

  const spawnCard = useCallback((x: number, y: number) => {
    const type = randomChoice(CARD_TYPES);
    const content = CARD_POOLS[type]();
    const card: TrailCard = {
      id: generateId(),
      type,
      x: x + randomBetween(-40, 40),
      y: y + randomBetween(-60, -20),
      rotation: randomBetween(-12, 12),
      createdAt: Date.now(),
      ...content,
    };

    setCards((prev) => {
      const next = [card, ...prev];
      return next.slice(0, CURSOR_TRAIL.maxCards);
    });

    // Auto-remove after lifetime
    setTimeout(() => {
      setCards((prev) => prev.filter((c) => c.id !== card.id));
    }, CURSOR_TRAIL.cardLifetime);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    pendingPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const tick = () => {
      const { x, y } = pendingPos.current;
      const now = Date.now();
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const dt = now - lastPos.current.time;
      const dist = Math.hypot(dx, dy);
      const speed = dt > 0 ? dist / dt : 0;

      if (
        speed > CURSOR_TRAIL.speedThreshold &&
        now - lastSpawnTime.current > CURSOR_TRAIL.spawnCooldown
      ) {
        spawnCard(x, y);
        lastSpawnTime.current = now;
      }

      lastPos.current = { x, y, time: now };
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove, spawnCard]);

  return { cards };
}
