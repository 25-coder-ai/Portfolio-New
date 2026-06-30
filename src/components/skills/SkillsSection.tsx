"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillExpandedCard } from "./SkillCard3D";
import { TechKeyboard } from "@/components/keyboard/TechKeyboard";
import { skills } from "@/data/skills";
import type { Skill } from "@/types";
import { Badge } from "@/components/ui/Badge";

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

  return (
    <section id="skills" className="section-padding px-6 relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          label="Skills"
          title="Tech Stack"
          subtitle="Hover over a button"
          inView={inView}
        />

        {/* Desktop: interactive 3D Spline keyboard (contained) */}
        <div className="hidden md:block">
          <div
            className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-white/[0.06]"
            style={{
              background:
                "radial-gradient(ellipse at center, #16203a 0%, #0c1424 70%, #0a1020 100%)",
            }}
          >
            {/* Mounted only once the section scrolls into view to defer WebGL */}
            {inView && (
              <TechKeyboard theme="dark" enableScrollSections={false} />
            )}
          </div>
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
