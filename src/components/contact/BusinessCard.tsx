"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { profile } from "@/data/profile";

export function BusinessCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative mx-auto"
      style={{ width: 280, height: 160, perspective: "800px" }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d", width: "100%", height: "100%" }}
      >
        {/* Front face */}
        <motion.div
          className="absolute inset-0 rounded-2xl cursor-pointer overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          onClick={() => setFlipped(true)}
          whileHover={{ y: -3 }}
          role="button"
          aria-label="Flip business card"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setFlipped(true)}
        >
          {/* Card background */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #1A2540 0%, #1F2D4A 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
            }}
          />

          {/* Highlight sweep */}
          <div
            className="absolute inset-0 opacity-40 holographic"
            aria-hidden="true"
          />

          {/* Accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
            style={{ background: "linear-gradient(90deg, #4F8EF7, #A78BFA)" }}
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-5">
            <div>
              <p className="font-display font-bold text-[#E8EEFF] text-lg leading-tight">
                {profile.name}
              </p>
              <p className="text-[#8892A4] text-xs mt-1">
                CS Student · Big Data Analytics
              </p>
            </div>

            <div className="space-y-1.5">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 text-[#8892A4] text-xs hover:text-[#E8EEFF] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail size={11} className="text-[#4F8EF7]" />
                {profile.email}
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#8892A4] text-xs hover:text-[#E8EEFF] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <GithubIcon size={11} className="text-[#4F8EF7]" />
                {profile.github.replace("https://", "")}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#8892A4] text-xs hover:text-[#E8EEFF] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <LinkedinIcon size={11} className="text-[#4F8EF7]" />
                {profile.linkedin.replace("https://linkedin.com/in/", "in/")}
              </a>
            </div>
          </div>

          {/* Flip hint */}
          <div className="absolute bottom-2 right-3 text-[#4A5568] text-[9px] font-mono-custom">
            Click to flip →
          </div>
        </motion.div>

        {/* Back face */}
        <motion.div
          className="absolute inset-0 rounded-2xl cursor-pointer overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          onClick={() => setFlipped(false)}
          role="button"
          aria-label="Flip card back"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setFlipped(false)}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #4F8EF7 0%, #A78BFA 100%)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
            }}
          />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center gap-2 p-5">
            <p className="font-display font-bold text-white text-2xl">Let&apos;s Connect</p>
            <p className="text-white/70 text-xs max-w-[180px] leading-relaxed">
              Open to internships, collaborations, and exciting projects.
            </p>
            <div className="flex gap-3 mt-2">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <GithubIcon size={18} className="text-white/80 hover:text-white transition-colors" />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <LinkedinIcon size={18} className="text-white/80 hover:text-white transition-colors" />
              </a>
              <a href={`mailto:${profile.email}`} onClick={(e) => e.stopPropagation()}>
                <Mail size={18} className="text-white/80 hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
