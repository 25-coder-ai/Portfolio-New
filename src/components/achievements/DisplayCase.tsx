"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Achievement } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink, X, Award } from "lucide-react";

interface DisplayCaseProps {
  achievement: Achievement;
}

const TYPE_ICONS: Record<string, string> = {
  certificate: "📜",
  award: "🏆",
  competition: "⚡",
  hackathon: "💡",
  academic: "🎓",
};

export function DisplayCase({ achievement }: DisplayCaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* Display case trigger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4 }}
        className="relative w-full text-left focus:outline-none group"
        aria-label={`View ${achievement.title}`}
        aria-haspopup="dialog"
      >
        <div
          className="relative rounded-2xl border overflow-hidden transition-all duration-300"
          style={{
            background: "#1A2540",
            borderColor: hovered ? `${achievement.color}40` : "rgba(255,255,255,0.07)",
            boxShadow: hovered
              ? `0 12px 40px rgba(0,0,0,0.4), 0 0 20px ${achievement.color}15`
              : "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          {/* Glass lid — lifts on hover */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl"
            style={{ background: `${achievement.color}80` }}
            animate={{ scaleX: hovered ? 1 : 0.6, opacity: hovered ? 1 : 0.5 }}
            transition={{ duration: 0.25 }}
          />

          {/* Inner display area */}
          <div className="p-6">
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4"
              style={{ background: `${achievement.color}12` }}
            >
              {TYPE_ICONS[achievement.type] || "🏅"}
            </div>

            {/* Rank badge */}
            {achievement.rank && (
              <div
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-3"
                style={{
                  background: `${achievement.color}20`,
                  color: achievement.color,
                  border: `1px solid ${achievement.color}30`,
                }}
              >
                <Award size={8} />
                {achievement.rank}
              </div>
            )}

            <h3 className="text-[#E8EEFF] font-semibold text-sm leading-snug mb-2 line-clamp-2">
              {achievement.title}
            </h3>
            <p className="text-[#4A5568] text-xs">{achievement.issuer}</p>
            <p className="text-[#4A5568] text-xs mt-1">
              {new Date(achievement.date + "-01").toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Bottom border accent */}
          <div
            className="h-px mx-4"
            style={{ background: `linear-gradient(90deg, transparent, ${achievement.color}40, transparent)` }}
          />

          {/* Hover prompt */}
          <div className="px-4 py-3 flex items-center justify-between">
            <Badge label={achievement.type} color={achievement.color} />
            <motion.span
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 4 }}
              className="text-xs text-[#4A5568] font-mono-custom"
            >
              Click to open →
            </motion.span>
          </div>
        </div>
      </motion.button>

      {/* Expanded modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-[#111B2F]/90 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={achievement.title}
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 glass rounded-2xl p-8 border max-w-lg w-full"
              style={{
                borderColor: `${achievement.color}25`,
                boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 40px ${achievement.color}12`,
              }}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/[0.06] text-[#4A5568] hover:text-[#E8EEFF] transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Icon + type */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: `${achievement.color}12` }}
                >
                  {TYPE_ICONS[achievement.type] || "🏅"}
                </div>
                <div>
                  <Badge label={achievement.type} color={achievement.color} />
                  {achievement.rank && (
                    <div
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ml-2"
                      style={{
                        background: `${achievement.color}20`,
                        color: achievement.color,
                        border: `1px solid ${achievement.color}30`,
                      }}
                    >
                      {achievement.rank}
                    </div>
                  )}
                  <h2 className="text-[#E8EEFF] font-display font-bold text-xl mt-2 leading-snug">
                    {achievement.title}
                  </h2>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-[#4A5568] text-xs uppercase tracking-widest font-mono-custom">Issuer</p>
                    <p className="text-[#E8EEFF] font-medium">{achievement.issuer}</p>
                  </div>
                  <div>
                    <p className="text-[#4A5568] text-xs uppercase tracking-widest font-mono-custom">Date</p>
                    <p className="text-[#E8EEFF] font-medium">
                      {new Date(achievement.date + "-01").toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <p className="text-[#8892A4] text-sm leading-relaxed">{achievement.description}</p>
              </div>

              {achievement.credentialUrl && (
                <a
                  href={achievement.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                  style={{
                    background: achievement.color,
                    color: "#111B2F",
                    boxShadow: `0 4px 20px ${achievement.color}30`,
                  }}
                >
                  <ExternalLink size={14} />
                  Verify Credential
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
