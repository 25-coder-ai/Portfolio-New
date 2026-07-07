"use client";
import { motion } from "framer-motion";
import { skills, skillsMap } from "@/data/skills";

const EASE = [0.16, 1, 0.3, 1] as const;

// A curated preview of the stack — the rest live in the 3D keyboard section
// that follows, so this card teases it. Data-driven: "+N more" stays in sync.
const FEATURED_IDS = ["python", "sql", "react", "aws"];

export function SkillsCard({ inView, index }: { inView: boolean; index: number }) {
  const featured = FEATURED_IDS.map((id) => skillsMap[id]).filter(Boolean);
  const remaining = skills.length - featured.length;
  const cardDelay = 0.9 + index * 0.08;
  const chipsStart = cardDelay + 0.25;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE, delay: cardDelay }}
      className="group flex h-full min-h-[176px] flex-col justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.10] hover:bg-white/[0.05] hover:shadow-[0_16px_34px_-18px_rgba(0,0,0,0.7)]"
    >
      {/* Metric */}
      <div>
        <p className="font-display text-3xl font-bold leading-none tracking-tight text-[#E8EEFF]">
          {skills.length}
        </p>
        <p className="mt-2 font-mono-custom text-[11px] font-medium uppercase tracking-[0.18em] text-[#8892A4]">
          Technologies
        </p>
      </div>

      {/* Divider + chip preview */}
      <div>
        <div className="mb-3 h-px w-full bg-gradient-to-r from-white/[0.14] via-white/[0.06] to-transparent" />
        <div className="flex flex-wrap items-center gap-1.5">
          {featured.map((skill, i) => (
            <motion.span
              key={skill.id}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: EASE, delay: chipsStart + i * 0.07 }}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-[#8892A4] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-[#E8EEFF]"
            >
              {skill.name}
            </motion.span>
          ))}
          {remaining > 0 && (
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                ease: EASE,
                delay: chipsStart + featured.length * 0.07,
              }}
              className="px-1.5 py-1 text-[11px] font-medium text-[#4A5568]"
            >
              +{remaining} more
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
