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
      {/* Steam — very subtle, hover only */}
      <div className="relative mb-1 h-8 w-12">
        <AnimatePresence>
          {hovered &&
            [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 rounded-full"
                style={{ left: `${28 + i * 18}%`, width: 2.5, height: 12, background: "rgba(255,255,255,0.12)" }}
                initial={{ y: 0, opacity: 0, scaleX: 1 }}
                animate={{ y: -18, opacity: [0, 0.35, 0], scaleX: [1, 1.4, 0.7] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.45, ease: "easeOut" }}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* Mug */}
      <motion.div animate={{ y: hovered ? -2 : 0 }} transition={{ duration: 0.3 }} className="relative">
        <div
          className="relative h-16 w-16 overflow-hidden rounded-b-2xl rounded-t-md border border-white/10"
          style={{ background: "linear-gradient(180deg, #243150 0%, #1A2540 100%)", boxShadow: "0 8px 22px -6px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)" }}
        >
          {/* coffee surface */}
          <div
            className="absolute left-1.5 right-1.5 top-1.5 h-2.5 rounded-[50%]"
            style={{ background: "linear-gradient(180deg, #3A2410, #241407)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)" }}
          />
          {/* vertical sheen */}
          <div className="absolute left-2 top-2 h-10 w-1 rounded-full bg-white/[0.06]" />
        </div>
        {/* Handle */}
        <div className="absolute right-[-11px] top-1/2 h-8 w-4 -translate-y-1/2 rounded-r-full border-b-2 border-r-2 border-t-2 border-white/10" />
      </motion.div>

      {/* Coaster */}
      <div className="mt-1 h-1.5 w-20 rounded-full" style={{ background: "#0C1322", boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }} />
    </div>
  );
}
