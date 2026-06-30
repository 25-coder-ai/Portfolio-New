"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const COMPONENTS = [
  { id: "problem-solving", label: "Problem Solving", icon: "⊛", color: "#4F8EF7", desc: "Breaking down complexity" },
  { id: "data-analytics", label: "Data Analytics", icon: "◈", color: "#34D399", desc: "Extracting insight from noise" },
  { id: "machine-learning", label: "Machine Learning", icon: "⬡", color: "#A78BFA", desc: "Teaching machines to reason" },
  { id: "software-dev", label: "Software Development", icon: "◇", color: "#F59E0B", desc: "Building scalable systems" },
  { id: "research", label: "Research", icon: "✦", color: "#F87171", desc: "Asking the right questions" },
];

interface PlacedComponent {
  id: string;
  label: string;
  icon: string;
  color: string;
  desc: string;
}

export function RoboticArm() {
  const prefersReduced = useReducedMotion();
  const [placed, setPlaced] = useState<PlacedComponent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [armState, setArmState] = useState<"idle" | "reaching" | "carrying" | "placing">("idle");
  const [armY, setArmY] = useState(0);
  const [armX, setArmX] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasStarted = useRef(false);

  const runAssembly = (idx: number) => {
    if (idx >= COMPONENTS.length) return;

    setArmState("reaching");
    setArmY(60);
    setArmX(-80);

    timerRef.current = setTimeout(() => {
      setArmState("carrying");
      setArmX(0);
      setArmY(20);

      timerRef.current = setTimeout(() => {
        setArmState("placing");
        setArmY(50);

        timerRef.current = setTimeout(() => {
          setPlaced((prev) => [...prev, COMPONENTS[idx]]);
          setArmState("idle");
          setArmY(0);
          setArmX(0);

          timerRef.current = setTimeout(() => {
            setCurrentIndex(idx + 1);
            if (idx + 1 < COMPONENTS.length) {
              runAssembly(idx + 1);
            }
          }, 600);
        }, 600);
      }, 800);
    }, 700);
  };

  useEffect(() => {
    if (prefersReduced) {
      setPlaced(COMPONENTS);
      return;
    }
    if (!hasStarted.current) {
      hasStarted.current = true;
      setTimeout(() => runAssembly(0), 800);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Arm SVG */}
      {!prefersReduced && (
        <div className="relative w-full max-w-xs mx-auto h-32 mb-6" aria-hidden="true">
          <motion.svg
            viewBox="0 0 300 120"
            className="w-full h-full"
            aria-hidden="true"
          >
            {/* Base */}
            <rect x="130" y="90" width="40" height="20" rx="4" fill="#1A2540" stroke="#243055" strokeWidth="1.5" />
            <rect x="140" y="80" width="20" height="15" rx="3" fill="#243055" />

            {/* Arm segments */}
            <motion.g
              style={{ transformOrigin: "150px 85px" }}
              animate={{ rotate: armState === "reaching" ? -35 : armState === "carrying" ? 15 : armState === "placing" ? 5 : 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <line x1="150" y1="85" x2="150" y2="30" stroke="#243055" strokeWidth="6" strokeLinecap="round" />
              <circle cx="150" cy="30" r="5" fill="#4F8EF7" />

              {/* Forearm */}
              <motion.g
                style={{ transformOrigin: "150px 30px" }}
                animate={{ rotate: armState === "reaching" ? 50 : armState === "carrying" ? -20 : armState === "placing" ? 30 : 10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                <line x1="150" y1="30" x2="150" y2="5" stroke="#1F2D4A" strokeWidth="4" strokeLinecap="round" />
                {/* Claw */}
                <motion.g
                  animate={{ scale: armState === "carrying" ? 1 : 0.8 }}
                  style={{ transformOrigin: "150px 5px" }}
                  transition={{ duration: 0.3 }}
                >
                  <line x1="144" y1="5" x2="138" y2="12" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round" />
                  <line x1="156" y1="5" x2="162" y2="12" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round" />
                </motion.g>
              </motion.g>
            </motion.g>

            {/* Carrying component indicator */}
            <AnimatePresence>
              {armState === "carrying" && currentIndex < COMPONENTS.length && (
                <motion.text
                  x="155" y="8"
                  fontSize="14"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  fill={COMPONENTS[currentIndex]?.color || "#4F8EF7"}
                >
                  {COMPONENTS[currentIndex]?.icon}
                </motion.text>
              )}
            </AnimatePresence>
          </motion.svg>
        </div>
      )}

      {/* Assembly grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl">
        {COMPONENTS.map((comp, i) => {
          const isPlaced = placed.some((p) => p.id === comp.id);
          const isCurrent = currentIndex === i && armState === "placing";

          return (
            <AnimatePresence key={comp.id}>
              {isPlaced ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  className="glass rounded-xl p-4 border border-white/[0.07] flex items-start gap-3"
                  style={{ borderColor: `${comp.color}25` }}
                >
                  <span className="text-2xl mt-0.5" style={{ color: comp.color }}>
                    {comp.icon}
                  </span>
                  <div>
                    <p className="text-[#E8EEFF] font-semibold text-sm">{comp.label}</p>
                    <p className="text-[#8892A4] text-xs mt-0.5">{comp.desc}</p>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                    className="ml-auto"
                  >
                    <span className="text-[#34D399] text-xs">✓</span>
                  </motion.div>
                </motion.div>
              ) : (
                <div
                  className="rounded-xl p-4 border border-dashed border-white/10 flex items-center gap-3 opacity-30"
                >
                  <span className="text-2xl">{comp.icon}</span>
                  <p className="text-[#8892A4] text-sm">{comp.label}</p>
                </div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* Assembly progress */}
      {!prefersReduced && placed.length < COMPONENTS.length && (
        <div className="mt-6 flex items-center gap-2 text-[#4A5568] text-xs">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="inline-block w-1.5 h-1.5 rounded-full bg-[#4F8EF7]"
          />
          Assembling component {placed.length + 1} of {COMPONENTS.length}…
        </div>
      )}

      {placed.length === COMPONENTS.length && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-[#34D399] text-xs font-semibold tracking-widest uppercase font-mono-custom"
        >
          ✓ Assembly complete
        </motion.div>
      )}
    </div>
  );
}
