"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CoffeeMug() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden="true"
    >
      {/* Steam */}
      <div className="relative h-8 w-12 mb-1">
        <AnimatePresence>
          {hovered && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0 rounded-full"
                  style={{
                    left: `${25 + i * 20}%`,
                    width: 3,
                    height: 12,
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 9999,
                  }}
                  initial={{ y: 0, opacity: 0, scaleX: 1 }}
                  animate={{ y: -20, opacity: [0, 0.5, 0], scaleX: [1, 1.5, 0.8] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Mug */}
      <motion.div
        animate={{ y: hovered ? -2 : 0 }}
        transition={{ duration: 0.25 }}
        className="relative"
      >
        {/* Mug body */}
        <div
          className="w-16 h-16 rounded-b-2xl border border-white/10 flex items-center justify-center"
          style={{
            background: "linear-gradient(180deg, #1F2D4A, #1A2540)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
          }}
        >
          <span className="text-xl">☕</span>
        </div>
        {/* Handle */}
        <div
          className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-4 h-8 border-r-2 border-t-2 border-b-2 border-white/10 rounded-r-full"
        />
        {/* Rim */}
        <div
          className="absolute top-0 left-0 right-0 h-3 rounded-t border border-white/10"
          style={{ background: "#243055" }}
        />
        {/* Coffee surface */}
        <div
          className="absolute top-1 left-1 right-1 h-2 rounded"
          style={{ background: "#4a2800", opacity: 0.8 }}
        />
      </motion.div>

      {/* Coaster */}
      <div
        className="w-20 h-1.5 rounded-full mt-0.5"
        style={{ background: "#0D1526" }}
      />
    </div>
  );
}
