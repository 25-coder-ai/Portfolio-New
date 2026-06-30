"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { profile } from "@/data/profile";

export function BusinessCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative mx-auto" style={{ width: 300, height: 180, perspective: "1000px" }}>
      <motion.div
        className="relative h-full w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        whileHover={{ y: -5, rotateX: 5 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="group absolute inset-0 cursor-pointer overflow-hidden rounded-2xl"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          onClick={() => setFlipped(true)}
          role="button"
          aria-label="Flip business card"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setFlipped(true))}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #1C2742 0%, #213056 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 16px 44px -12px rgba(0,0,0,0.5)",
            }}
          />
          {/* accent line */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-0 h-0.5"
            style={{ background: "linear-gradient(90deg, #4F8EF7, #A78BFA)" }}
          />
          {/* reflection sweep on hover */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <span className="absolute -inset-y-8 left-[-40%] w-1/3 -rotate-12 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100" />
          </span>

          <div className="relative z-10 flex h-full flex-col justify-between p-5">
            <div>
              <p className="font-display text-lg font-bold leading-tight text-[#E8EEFF]">{profile.name}</p>
              <p className="mt-1 text-xs text-[#8892A4]">{profile.subtitle}</p>
            </div>

            <div className="space-y-1.5">
              <a
                href={`mailto:${profile.email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-xs text-[#8892A4] transition-colors hover:text-[#E8EEFF]"
              >
                <Mail size={11} className="text-[#4F8EF7]" />
                {profile.email}
              </a>
              <a
                href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-xs text-[#8892A4] transition-colors hover:text-[#E8EEFF]"
              >
                <Phone size={11} className="text-[#4F8EF7]" />
                {profile.phone}
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-xs text-[#8892A4] transition-colors hover:text-[#E8EEFF]"
              >
                <GithubIcon size={11} className="text-[#4F8EF7]" />
                {profile.github.replace("https://", "")}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-xs text-[#8892A4] transition-colors hover:text-[#E8EEFF]"
              >
                <LinkedinIcon size={11} className="text-[#4F8EF7]" />
                {profile.linkedin.replace("https://linkedin.com/in/", "in/")}
              </a>
            </div>
          </div>

          <span className="absolute bottom-2 right-3 font-mono-custom text-[9px] text-[#4A5568]">
            tap to flip →
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 cursor-pointer overflow-hidden rounded-2xl"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          onClick={() => setFlipped(false)}
          role="button"
          aria-label="Flip card back"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setFlipped(false))}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #4F8EF7 0%, #A78BFA 100%)", boxShadow: "0 16px 44px -12px rgba(0,0,0,0.5)" }}
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="font-display text-xl font-bold leading-snug text-white">
              Let&apos;s Build Something Together
            </p>
            <div className="flex gap-4">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" onClick={(e) => e.stopPropagation()}>
                <GithubIcon size={18} className="text-white/80 transition-colors hover:text-white" />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" onClick={(e) => e.stopPropagation()}>
                <LinkedinIcon size={18} className="text-white/80 transition-colors hover:text-white" />
              </a>
              <a href={`mailto:${profile.email}`} aria-label="Email" onClick={(e) => e.stopPropagation()}>
                <Mail size={18} className="text-white/80 transition-colors hover:text-white" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
