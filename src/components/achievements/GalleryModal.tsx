"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { Achievement } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { TYPE_META, formatMonth } from "./meta";

interface GalleryModalProps {
  achievement: Achievement;
  onClose: () => void;
}

const FADE = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const, delay: 0.12 };

export function GalleryModal({ achievement, onClose }: GalleryModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const meta = TYPE_META[achievement.type] ?? TYPE_META.default;
  const Icon = meta.icon;

  // Lock scroll, focus close button, and wire up Escape.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#0b1322]/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel — expands from the clicked card via the shared layoutId. */}
      <motion.div
        layoutId={`ach-${achievement.id}`}
        role="dialog"
        aria-modal="true"
        aria-label={achievement.title}
        className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border bg-[#141d33] shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
        style={{ borderColor: `${achievement.color}33` }}
      >
        {/* Image / artwork */}
        <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${achievement.color}40, transparent 60%), linear-gradient(135deg, #1c2747, #141d33)`,
            }}
          />
          <Icon
            aria-hidden
            className="absolute right-6 top-6 h-14 w-14 opacity-20"
            style={{ color: achievement.color }}
            strokeWidth={1.1}
          />
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
            style={{ background: "linear-gradient(to top, rgba(20,29,51,0.95), transparent 60%)" }}
          />
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-lg bg-black/30 p-2 text-[#cbd5e8] backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Scrollable content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={FADE}
          className="-mt-8 flex-1 overflow-y-auto p-6"
        >
          <div className="flex items-center gap-2">
            <Badge label={achievement.type} color={achievement.color} />
            {achievement.rank && (
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold"
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

          <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-[#E8EEFF]">
            {achievement.title}
          </h2>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="text-[#8892A4]">
              <span className="text-[#4A5568]">By </span>
              {achievement.issuer}
            </span>
            <span className="font-mono-custom text-[#4A5568]">{formatMonth(achievement.date)}</span>
          </div>

          <p className="mt-5 leading-relaxed text-[#8892A4]">{achievement.description}</p>

          {achievement.skills && achievement.skills.length > 0 && (
            <div className="mt-6">
              <p className="font-mono-custom text-xs uppercase tracking-[0.18em] text-[#4A5568]">
                Skills gained
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {achievement.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-[#cbd5e8]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {achievement.notes && (
            <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="font-mono-custom text-xs uppercase tracking-[0.18em] text-[#4A5568]">
                Notes
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#8892A4]">{achievement.notes}</p>
            </div>
          )}

          {achievement.credentialUrl && (
            <a
              href={achievement.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02]"
              style={{
                background: achievement.color,
                color: "#111B2F",
                boxShadow: `0 8px 24px ${achievement.color}33`,
              }}
            >
              <ExternalLink size={14} />
              View certificate
            </a>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
