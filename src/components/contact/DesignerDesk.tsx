"use client";
import { motion } from "framer-motion";
import { Laptop } from "./Laptop";
import { BusinessCard } from "./BusinessCard";
import { CoffeeMug } from "./CoffeeMug";
import { profile } from "@/data/profile";
import { Download, FileText } from "lucide-react";

function ResumeDoc() {
  return (
    <motion.a
      href={profile.resumeUrl}
      download
      whileHover={{ y: -4, rotate: -1 }}
      transition={{ duration: 0.2 }}
      className="relative block mx-auto cursor-pointer group"
      style={{ width: 120 }}
      aria-label="Download Resume"
      title="Click to download resume"
    >
      {/* Paper stack effect */}
      <div
        className="absolute inset-0 translate-x-1 translate-y-1 rounded-lg border border-white/[0.04]"
        style={{ background: "#1A2540" }}
        aria-hidden="true"
      />
      {/* Main paper */}
      <div
        className="relative rounded-lg border border-white/[0.08] overflow-hidden"
        style={{
          background: "#1F2D4A",
          boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div
          className="px-3 py-2 border-b border-white/[0.06]"
          style={{ background: "#111B2F" }}
        >
          <div className="flex items-center gap-1.5">
            <FileText size={10} className="text-[#4F8EF7]" />
            <span className="text-[8px] font-mono-custom text-[#4A5568] uppercase tracking-wider">
              Resume
            </span>
          </div>
        </div>

        {/* Lines */}
        <div className="p-3 space-y-1.5">
          {[100, 80, 90, 60, 75].map((w, i) => (
            <div
              key={i}
              className="h-1 rounded-full"
              style={{
                width: `${w}%`,
                background: i === 0
                  ? "rgba(79,142,247,0.4)"
                  : "rgba(255,255,255,0.06)",
              }}
            />
          ))}
          <div className="mt-2 space-y-1">
            {[70, 85, 60].map((w, i) => (
              <div
                key={i}
                className="h-0.5 rounded-full"
                style={{ width: `${w}%`, background: "rgba(255,255,255,0.04)" }}
              />
            ))}
          </div>
        </div>

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-lg"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{ background: "rgba(17,27,47,0.88)" }}
        >
          <Download size={18} className="text-[#4F8EF7]" />
          <span className="text-[#E8EEFF] text-[9px] font-semibold font-mono-custom uppercase tracking-wider">
            Download
          </span>
        </motion.div>
      </div>

      {/* Label */}
      <p className="text-center text-[#4A5568] text-[9px] mt-2 font-mono-custom uppercase tracking-widest">
        Resume.pdf
      </p>
    </motion.a>
  );
}

function DeskLamp() {
  return (
    <div className="relative" aria-hidden="true">
      {/* Lamp arm */}
      <div
        className="absolute right-0 top-0 w-0.5 h-20"
        style={{ background: "#243055", transform: "rotate(-10deg)", transformOrigin: "bottom" }}
      />
      {/* Lamp head */}
      <div
        className="absolute right-[-6px] top-[-8px] w-10 h-6 rounded-b-full border border-white/10"
        style={{
          background: "#1A2540",
          transform: "rotate(-10deg)",
        }}
      />
      {/* Light cone */}
      <div
        className="absolute right-[-16px] top-[-2px] pointer-events-none"
        style={{
          width: 80,
          height: 100,
          background: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.04) 0%, transparent 70%)",
          transform: "rotate(-10deg)",
          transformOrigin: "top center",
        }}
      />
    </div>
  );
}

const STAGGER = 0.1;

export function DesignerDesk() {
  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Desk surface */}
      <div
        className="relative rounded-3xl border border-white/[0.06] overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #141E32 0%, #0D1526 100%)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          minHeight: 420,
          perspective: "1200px",
        }}
      >
        {/* Desk top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" }}
          aria-hidden="true"
        />

        {/* Desk wood grain texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.01) 80px, rgba(255,255,255,0.01) 81px)",
          }}
          aria-hidden="true"
        />

        {/* Content layout — slightly elevated angle via padding */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10 p-10 lg:p-14 items-start">
          {/* Left column — Resume + Coffee Mug */}
          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: STAGGER }}
          >
            <ResumeDoc />
            <CoffeeMug />
          </motion.div>

          {/* Center column — Laptop (primary) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: STAGGER * 2 }}
            className="lg:col-span-1"
          >
            <Laptop />
          </motion.div>

          {/* Right column — Business Card + Lamp */}
          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: STAGGER * 3 }}
          >
            <BusinessCard />
            <div className="relative h-24 w-16">
              <DeskLamp />
            </div>
          </motion.div>
        </div>

        {/* Desk bottom edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 rounded-b-3xl"
          style={{ background: "rgba(0,0,0,0.3)" }}
          aria-hidden="true"
        />
      </div>

      {/* Desk legs */}
      <div className="flex justify-between px-8 mt-0" aria-hidden="true">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-b"
            style={{ background: "#0D1526" }}
          />
        ))}
      </div>
    </div>
  );
}
