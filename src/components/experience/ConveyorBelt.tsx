"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { experiences } from "@/data/experience";
import { ConveyorBox, UnfoldedSheet } from "./ExperienceBox";
import type { Experience } from "@/types";

export function ConveyorBelt() {
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const beltRef = useRef<HTMLDivElement>(null);

  const handleBoxClick = (exp: Experience) => {
    if (selectedExp?.id === exp.id) {
      setSelectedExp(null);
      setIsPaused(false);
    } else {
      setSelectedExp(exp);
      setIsPaused(true);
    }
  };

  // Duplicate experiences for seamless loop
  const loopedExperiences = [...experiences, ...experiences];

  return (
    <div className="relative">
      {/* Belt machine top bar */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/[0.07]"
        style={{ background: "#0D1526" }}
      >
        {/* Machine header */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06]"
          style={{ background: "#111B2F" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#34D399]" />
            <span className="text-[10px] font-mono-custom text-[#4A5568] uppercase tracking-widest">
              Experience · Conveyor Line {isPaused ? "— Paused" : "— Running"}
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B]/60" />
            <div className="w-2 h-2 rounded-full bg-[#F87171]/60" />
            <div className="w-2 h-2 rounded-full bg-[#34D399]/60" />
          </div>
        </div>

        {/* Conveyor belt track */}
        <div
          className="relative overflow-hidden"
          style={{ height: 160 }}
          onMouseEnter={() => !selectedExp && setIsPaused(true)}
          onMouseLeave={() => !selectedExp && setIsPaused(false)}
        >
          {/* Belt texture */}
          <div
            className="absolute bottom-0 left-0 right-0 h-5"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 20px, transparent 20px, transparent 40px)",
            }}
          />
          <div
            className="absolute bottom-5 left-0 right-0 h-1"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
          <div
            className="absolute bottom-6 left-0 right-0 h-1"
            style={{ background: "rgba(255,255,255,0.04)" }}
          />

          {/* Moving boxes */}
          <motion.div
            className="absolute top-4 flex items-center gap-8 whitespace-nowrap"
            style={{ left: 0 }}
            animate={
              isPaused
                ? { x: undefined }
                : {
                    x: [0, -(experiences.length * 160)],
                  }
            }
            transition={
              isPaused
                ? { duration: 0 }
                : {
                    x: {
                      repeat: Infinity,
                      duration: experiences.length * 4.5,
                      ease: "linear",
                      repeatType: "loop",
                    },
                  }
            }
          >
            {loopedExperiences.map((exp, i) => (
              <ConveyorBox
                key={`${exp.id}-${i}`}
                experience={exp}
                isSelected={selectedExp?.id === exp.id}
                onClick={() => handleBoxClick(exp)}
              />
            ))}
          </motion.div>

          {/* Left/Right fade masks */}
          <div
            className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-10"
            style={{
              background: "linear-gradient(90deg, #0D1526, transparent)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-10"
            style={{
              background: "linear-gradient(270deg, #0D1526, transparent)",
            }}
          />
        </div>

        {/* Belt rollers */}
        <div className="flex justify-between px-0">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="w-6 h-6 rounded-full border-2 border-white/10 bg-[#1A2540]"
              animate={isPaused ? {} : { rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          ))}
        </div>
      </div>

      {/* Unfolded sheet — robotic arm places it here */}
      <AnimatePresence>
        {selectedExp && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Robotic arm indicator */}
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-px flex-1 bg-white/[0.04]" />
              <div className="flex items-center gap-2">
                <span className="text-[#4F8EF7] text-xs">🤖</span>
                <span className="text-[10px] font-mono-custom text-[#4A5568] uppercase tracking-widest">
                  Picked by robotic arm · Unfolding
                </span>
              </div>
              <div className="h-px flex-1 bg-white/[0.04]" />
            </div>

            <UnfoldedSheet experience={selectedExp} onClose={() => { setSelectedExp(null); setIsPaused(false); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruction hint */}
      {!selectedExp && (
        <p className="text-center text-[#4A5568] text-xs mt-4 font-mono-custom">
          Click any box · Robotic arm picks and unfolds it
        </p>
      )}
    </div>
  );
}
