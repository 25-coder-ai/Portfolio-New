"use client";
import { motion } from "framer-motion";
import type { TrailCard } from "@/types";
import { cn } from "@/lib/utils";

interface TrailCardProps {
  card: TrailCard;
}

const TYPE_CONFIG = {
  project: {
    label: "PROJECT",
    icon: "◈",
    bg: "bg-[#1A2540]",
    border: "border-[#4F8EF7]/20",
    accent: "#4F8EF7",
  },
  achievement: {
    label: "ACHIEVEMENT",
    icon: "◆",
    bg: "bg-[#1A2540]",
    border: "border-[#F59E0B]/20",
    accent: "#F59E0B",
  },
  skill: {
    label: "SKILL",
    icon: "◉",
    bg: "bg-[#1A2540]",
    border: "border-[#A78BFA]/20",
    accent: "#A78BFA",
  },
  blueprint: {
    label: "BLUEPRINT",
    icon: "⊞",
    bg: "bg-[#111D35]",
    border: "border-[#4F8EF7]/15",
    accent: "#4F8EF7",
  },
  note: {
    label: "NOTE",
    icon: "✦",
    bg: "bg-[#1A2540]",
    border: "border-[#34D399]/20",
    accent: "#34D399",
  },
} as const;

export function TrailCardComponent({ card }: TrailCardProps) {
  const config = TYPE_CONFIG[card.type];

  return (
    <motion.div
      style={{
        position: "fixed",
        left: card.x,
        top: card.y,
        zIndex: 5,
        pointerEvents: "none",
        transform: `rotate(${card.rotation}deg)`,
      }}
      initial={{ opacity: 0, scale: 0.75, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.7, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={cn(
          "w-44 rounded-xl p-3 backdrop-blur-sm",
          config.bg,
          "border",
          config.border
        )}
        style={{
          boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${config.accent}12`,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-2">
          <span style={{ color: config.accent }} className="text-xs">
            {config.icon}
          </span>
          <span
            className="text-[9px] font-semibold tracking-[0.18em] uppercase font-mono-custom"
            style={{ color: config.accent }}
          >
            {config.label}
          </span>
        </div>

        {/* Content */}
        <p className="text-[#E8EEFF] text-xs font-semibold leading-snug line-clamp-2">
          {card.title}
        </p>
        {card.subtitle && (
          <p className="text-[#8892A4] text-[10px] mt-1 leading-snug line-clamp-1">
            {card.subtitle}
          </p>
        )}

        {/* Blueprint-style corner marks for blueprint type */}
        {card.type === "blueprint" && (
          <>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#4F8EF7]/30" />
            <span className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#4F8EF7]/30" />
          </>
        )}

        {/* Color accent line */}
        <div
          className="mt-2.5 h-px rounded-full"
          style={{ background: `linear-gradient(90deg, ${config.accent}60, transparent)` }}
        />
      </div>
    </motion.div>
  );
}
