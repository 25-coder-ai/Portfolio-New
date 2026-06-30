"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { achievements } from "@/data/achievements";
import type { Achievement } from "@/types";
import { GlassCard } from "./GlassCard";
import { GalleryModal } from "./GalleryModal";

// Exact background — do not convert to RGB.
const ACHIEVEMENT_BACKGROUND = "#111B2F";

export function AchievementsSection() {
  const { ref, inView } = useScrollAnimation();
  const [active, setActive] = useState<Achievement | null>(null);

  return (
    <section
      id="achievements"
      ref={ref}
      style={{ backgroundColor: ACHIEVEMENT_BACKGROUND }}
      className="section-padding px-6 relative overflow-hidden"
    >
      {/* Subtle gallery lighting — no particles. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-60"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(79,142,247,0.12), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.3), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          label="Achievements"
          title="The Glass Gallery"
          subtitle="A curated exhibition of milestones, certifications, and recognition. Select any panel to view the full record."
          inView={inView}
        />

        <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, i) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 }}
            >
              <GlassCard achievement={achievement} onOpen={setActive} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {active && <GalleryModal achievement={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
