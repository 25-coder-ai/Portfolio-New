"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { Experience } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { X, Calendar, MapPin } from "lucide-react";

interface ExperienceBoxProps {
  experience: Experience;
  isSelected: boolean;
  onClick: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  internship: "#4F8EF7",
  hackathon: "#F59E0B",
  leadership: "#A78BFA",
  research: "#34D399",
  volunteering: "#F87171",
  academic: "#4F8EF7",
  club: "#A78BFA",
};

// The cardboard box on the belt
export function ConveyorBox({ experience, isSelected, onClick }: ExperienceBoxProps) {
  const color = TYPE_COLORS[experience.type] || "#4F8EF7";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex-shrink-0 w-32 focus:outline-none group"
      aria-label={`View ${experience.title}`}
      aria-expanded={isSelected}
    >
      {/* Box body */}
      <div
        className="relative w-32 h-24 rounded-lg border transition-all"
        style={{
          background: isSelected ? `${color}20` : "#1A2540",
          borderColor: isSelected ? `${color}60` : "rgba(255,255,255,0.08)",
          boxShadow: isSelected ? `0 0 20px ${color}20` : "none",
        }}
      >
        {/* Box lid */}
        <div
          className="absolute -top-2 left-1 right-1 h-3 rounded-t border-t border-l border-r"
          style={{
            background: isSelected ? color : "#1F2D4A",
            borderColor: isSelected ? `${color}80` : "rgba(255,255,255,0.1)",
          }}
        />
        {/* Box tape */}
        <div
          className="absolute top-1/2 left-0 right-0 h-px -translate-y-px"
          style={{ background: isSelected ? `${color}60` : "rgba(255,255,255,0.1)" }}
        />
        <div
          className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-px"
          style={{ background: isSelected ? `${color}60` : "rgba(255,255,255,0.1)" }}
        />
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center pt-2">
          <span className="text-2xl">{experience.icon}</span>
        </div>
      </div>
      {/* Label */}
      <p
        className="mt-2 text-center text-[10px] font-semibold leading-tight px-1 line-clamp-2"
        style={{ color: isSelected ? color : "#8892A4" }}
      >
        {experience.title}
      </p>
    </motion.button>
  );
}

// The unfolded flat sheet that appears when box is selected
interface UnfoldedSheetProps {
  experience: Experience;
  onClose: () => void;
}

export function UnfoldedSheet({ experience, onClose }: UnfoldedSheetProps) {
  const color = TYPE_COLORS[experience.type] || "#4F8EF7";

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.6, y: 20 }}
      animate={{ opacity: 1, scaleY: 1, y: 0 }}
      exit={{ opacity: 0, scaleY: 0.5, y: 10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "top center" }}
    >
      <div
        className="glass rounded-2xl p-6 border relative overflow-hidden max-w-2xl mx-auto"
        style={{
          borderColor: `${color}25`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${color}12`,
        }}
      >
        {/* Fold lines — visual effect */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-20"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-20"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/[0.06] text-[#4A5568] hover:text-[#E8EEFF] transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: `${color}15` }}
          >
            {experience.icon}
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-[#E8EEFF]">{experience.title}</h3>
            <p className="text-[#8892A4] text-sm mt-0.5">{experience.organization}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge label={experience.type.replace(/-/g, " ")} color={color} />
              <div className="flex items-center gap-1 text-[#4A5568] text-xs">
                <Calendar size={10} />
                {formatDate(experience.startDate)} — {formatDate(experience.endDate)}
              </div>
              {experience.location && (
                <div className="flex items-center gap-1 text-[#4A5568] text-xs">
                  <MapPin size={10} />
                  {experience.location}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#8892A4] text-sm mb-4 leading-relaxed">{experience.description}</p>

        {/* Responsibilities */}
        <div className="mb-4">
          <p className="text-[10px] font-mono-custom uppercase tracking-widest mb-2" style={{ color }}>
            ◈ Responsibilities
          </p>
          <ul className="space-y-1.5">
            {experience.responsibilities.map((r, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="flex items-start gap-2 text-[#8892A4] text-sm"
              >
                <span className="mt-1 text-xs flex-shrink-0" style={{ color }}>▸</span>
                {r}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        {experience.technologies.length > 0 && (
          <div>
            <p className="text-[10px] font-mono-custom uppercase tracking-widest mb-2 text-[#4A5568]">
              ⊞ Technologies
            </p>
            <div className="flex flex-wrap gap-1.5">
              {experience.technologies.map((t) => (
                <Badge key={t} label={t} color={color} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
