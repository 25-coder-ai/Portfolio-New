"use client";
import { motion } from "framer-motion";
import type { Achievement } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { TYPE_META, formatMonth } from "./meta";

interface GlassCardProps {
  achievement: Achievement;
  onOpen: (a: Achievement) => void;
}

export function GlassCard({ achievement, onOpen }: GlassCardProps) {
  const meta = TYPE_META[achievement.type] ?? TYPE_META.default;
  const Icon = meta.icon;

  return (
    <motion.div layoutId={`ach-${achievement.id}`} className="h-full">
      <button
        type="button"
        onClick={() => onOpen(achievement)}
        aria-haspopup="dialog"
        aria-label={`View details for ${achievement.title}`}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1A2540]/60 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.015] hover:border-[var(--accent)]/50 hover:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.6),0_0_30px_-10px_var(--glow)]"
        style={
          {
            "--accent": achievement.color,
            "--glow": `${achievement.color}40`,
          } as React.CSSProperties
        }
      >
        {/* Image / artwork */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${achievement.color}33, transparent 60%), linear-gradient(135deg, #1c2747, #141d33)`,
            }}
          />
          <Icon
            aria-hidden
            className="absolute right-4 top-4 h-10 w-10 opacity-20"
            style={{ color: achievement.color }}
            strokeWidth={1.25}
          />
          {/* Real image (covers artwork when the file exists). */}
          {achievement.image && (
            <div
              aria-hidden
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${achievement.image})` }}
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(20,29,51,0.85), transparent 55%)" }}
          />
          {achievement.rank && (
            <span
              className="absolute bottom-3 left-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold"
              style={{
                background: `${achievement.color}22`,
                color: achievement.color,
                border: `1px solid ${achievement.color}40`,
              }}
            >
              {achievement.rank}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <Badge label={achievement.type} color={achievement.color} className="self-start" />
          <h3 className="mt-3 font-display text-lg font-bold leading-snug text-[#E8EEFF] line-clamp-2">
            {achievement.title}
          </h3>
          <p className="mt-1 text-sm text-[#8892A4]">{achievement.issuer}</p>
          <p className="mt-0.5 font-mono-custom text-xs text-[#4A5568]">
            {formatMonth(achievement.date)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#8892A4] line-clamp-2">
            {achievement.description}
          </p>
        </div>

        {/* Reflection sweep on hover */}
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <span className="absolute -inset-y-8 left-[-40%] w-1/3 -rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100" />
        </span>
      </button>
    </motion.div>
  );
}
