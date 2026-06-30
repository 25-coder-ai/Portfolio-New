"use client";
import { useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillTooltip, SkillExpandedCard } from "./SkillCard3D";
import { skills } from "@/data/skills";
import type { Skill } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Badge } from "@/components/ui/Badge";

// Lazy-load the heavy 3D canvas
const KeyboardCanvas = dynamic(
  () => import("./KeyboardScene").then((m) => ({ default: m.KeyboardCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 flex items-center justify-center text-[#4A5568] text-sm">
        <span className="animate-pulse">Loading 3D keyboard…</span>
      </div>
    ),
  }
);

// Mobile fallback: skill grid
function MobileSkillGrid() {
  const [expanded, setExpanded] = useState<Skill | null>(null);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <button
            key={skill.id}
            onClick={() => setExpanded(expanded?.id === skill.id ? null : skill)}
            className="glass rounded-xl p-4 text-left border border-white/[0.07] hover:border-[#4F8EF7]/25 transition-all group"
            style={{ borderColor: expanded?.id === skill.id ? `${skill.brandColor}40` : undefined }}
          >
            <span className="text-xl block mb-2">{skill.icon}</span>
            <p className="text-[#E8EEFF] font-semibold text-sm">{skill.name}</p>
            <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${skill.levelPercent}%`,
                  background: skill.brandColor,
                }}
              />
            </div>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="flex justify-center">
              <SkillExpandedCard skill={expanded} onClose={() => setExpanded(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SkillsSection() {
  const { ref, inView } = useScrollAnimation();
  const prefersReduced = useReducedMotion();
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [expandedSkill, setExpandedSkill] = useState<Skill | null>(null);

  const handleSkillHover = useCallback((skill: Skill | null) => {
    setHoveredSkill(skill);
  }, []);

  const handleSkillClick = useCallback((skill: Skill) => {
    setExpandedSkill((prev) => (prev?.id === skill.id ? null : skill));
  }, []);

  return (
    <section id="skills" className="section-padding px-6 relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          label="Skills"
          title="The Keyboard of My Craft"
          subtitle="Each key is a skill. Hover to inspect. Click to explore. Drag to rotate the keyboard."
          inView={inView}
        />

        {/* Desktop: 3D Keyboard */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative"
          >
            {/* Keyboard canvas */}
            <div
              className="relative rounded-2xl overflow-hidden border border-white/[0.06]"
              style={{
                height: 440,
                background: "radial-gradient(ellipse at center, #1A2540 0%, #111B2F 100%)",
              }}
            >
              <KeyboardCanvas
                skills={skills}
                onSkillHover={handleSkillHover}
                onSkillClick={handleSkillClick}
              />

              {/* Tooltip — appears at fixed bottom-left of canvas */}
              <div className="absolute bottom-6 left-6 w-64 pointer-events-none">
                <SkillTooltip skill={hoveredSkill} />
              </div>

              {/* Hint */}
              <p className="absolute bottom-4 right-6 text-[#4A5568] text-xs font-mono-custom">
                Drag to rotate · Click a key
              </p>
            </div>

            {/* Expanded skill card — appears below canvas */}
            <AnimatePresence>
              {expandedSkill && (
                <div className="mt-6 flex justify-center">
                  <SkillExpandedCard
                    skill={expandedSkill}
                    onClose={() => setExpandedSkill(null)}
                  />
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Mobile fallback */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <MobileSkillGrid />
          </motion.div>
        </div>

        {/* Category legend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-10 flex flex-wrap gap-3 justify-center"
        >
          {[
            { label: "Language", color: "#4F8EF7" },
            { label: "Framework", color: "#A78BFA" },
            { label: "Tool", color: "#F59E0B" },
            { label: "Concept", color: "#34D399" },
            { label: "Cloud", color: "#F87171" },
          ].map((cat) => (
            <Badge key={cat.label} label={cat.label} color={cat.color} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
