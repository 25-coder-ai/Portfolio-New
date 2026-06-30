"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { Skill } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { X } from "lucide-react";

interface SkillCard3DProps {
  skill: Skill | null;
  mode: "tooltip" | "expanded";
  onClose?: () => void;
  position?: { x: number; y: number };
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

const CATEGORY_COLORS: Record<string, string> = {
  language: "#4F8EF7",
  framework: "#A78BFA",
  tool: "#F59E0B",
  concept: "#34D399",
  cloud: "#F87171",
};

export function SkillTooltip({ skill }: { skill: Skill | null }) {
  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.92 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none"
          style={{ maxWidth: 260 }}
        >
          <div
            className="glass rounded-xl p-4 border"
            style={{
              borderColor: `${skill.brandColor}30`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${skill.brandColor}15`,
            }}
          >
            {/* Holographic shimmer overlay */}
            <div className="holographic absolute inset-0 rounded-xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                style={{ background: `${skill.brandColor}20`, color: skill.brandColor }}
              >
                {skill.icon || skill.name.slice(0, 2)}
              </div>
              <div>
                <p className="text-[#E8EEFF] font-bold text-sm">{skill.name}</p>
                <Badge
                  label={LEVEL_LABELS[skill.level]}
                  color={CATEGORY_COLORS[skill.category] || "#4F8EF7"}
                />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-[#4A5568] mb-1">
                <span>Proficiency</span>
                <span style={{ color: skill.brandColor }}>{skill.levelPercent}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: skill.brandColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.levelPercent}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            <p className="text-[#8892A4] text-xs leading-relaxed">{skill.description}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SkillExpandedCard({ skill, onClose }: { skill: Skill; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-2xl p-6 border relative overflow-hidden"
      style={{
        borderColor: `${skill.brandColor}30`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${skill.brandColor}12`,
        maxWidth: 380,
        width: "100%",
      }}
    >
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${skill.brandColor}10, transparent 70%)`,
          transform: "translate(30%, -30%)",
        }}
      />

      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/[0.06] text-[#4A5568] hover:text-[#E8EEFF] transition-colors"
        aria-label="Close skill card"
      >
        <X size={16} />
      </button>

      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
          style={{ background: `${skill.brandColor}20`, color: skill.brandColor }}
        >
          {skill.icon || skill.name.slice(0, 2)}
        </div>
        <div>
          <h3 className="text-[#E8EEFF] font-display font-bold text-xl">{skill.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge label={LEVEL_LABELS[skill.level]} color={skill.brandColor} />
            <Badge label={skill.category} color={CATEGORY_COLORS[skill.category]} />
          </div>
        </div>
      </div>

      {/* Proficiency */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#8892A4]">Proficiency</span>
          <span className="font-bold" style={{ color: skill.brandColor }}>
            {skill.levelPercent}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${skill.brandColor}, ${skill.color})` }}
            initial={{ width: 0 }}
            animate={{ width: `${skill.levelPercent}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </div>
      </div>

      <p className="text-[#8892A4] text-sm leading-relaxed">{skill.description}</p>
    </motion.div>
  );
}
