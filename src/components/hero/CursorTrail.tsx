"use client";
import { AnimatePresence } from "framer-motion";
import { useCursorTrail } from "@/hooks/useCursorTrail";
import { TrailCardComponent } from "./TrailCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CursorTrail() {
  const prefersReduced = useReducedMotion();
  const { cards } = useCursorTrail();

  // Do not render trail cards in reduced motion mode
  if (prefersReduced) return null;

  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 5 }}
    >
      <AnimatePresence>
        {cards.map((card) => (
          <TrailCardComponent key={card.id} card={card} />
        ))}
      </AnimatePresence>
    </div>
  );
}
