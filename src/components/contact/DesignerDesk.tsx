"use client";
import { motion } from "framer-motion";
import { Laptop } from "./Laptop";
import { BusinessCard } from "./BusinessCard";
import { CoffeeMug } from "./CoffeeMug";
import { profile } from "@/data/profile";
import { Download, FileText } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

function ResumeDoc() {
  return (
    <motion.a
      href={profile.resumeUrl}
      download
      whileHover={{ y: -6, rotate: -1.5 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="group relative mx-auto block cursor-pointer"
      style={{ width: 128 }}
      aria-label="Download résumé (PDF)"
      title="Download résumé"
    >
      {/* stacked sheet behind */}
      <div
        className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-lg border border-white/[0.04]"
        style={{ background: "#16203A" }}
        aria-hidden="true"
      />
      <div
        className="relative overflow-hidden rounded-lg border border-white/[0.08] transition-shadow duration-300 group-hover:shadow-[0_18px_44px_-14px_rgba(0,0,0,0.6)]"
        style={{ background: "#1F2D4A", boxShadow: "0 8px 26px -10px rgba(0,0,0,0.4)" }}
      >
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2" style={{ background: "#111B2F" }}>
          <FileText size={10} className="text-[#4F8EF7]" />
          <span className="font-mono-custom text-[8px] uppercase tracking-wider text-[#4A5568]">Résumé</span>
        </div>
        <div className="space-y-1.5 p-3">
          {[100, 80, 90, 60, 75].map((w, i) => (
            <div
              key={i}
              className="h-1 rounded-full"
              style={{ width: `${w}%`, background: i === 0 ? "rgba(79,142,247,0.4)" : "rgba(255,255,255,0.06)" }}
            />
          ))}
          <div className="mt-2 space-y-1">
            {[70, 85, 60].map((w, i) => (
              <div key={i} className="h-0.5 rounded-full" style={{ width: `${w}%`, background: "rgba(255,255,255,0.04)" }} />
            ))}
          </div>
        </div>
        {/* hover overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "rgba(17,27,47,0.88)" }}
        >
          <Download size={18} className="text-[#4F8EF7]" />
          <span className="font-mono-custom text-[9px] font-semibold uppercase tracking-wider text-[#E8EEFF]">Download</span>
        </div>
      </div>
      <p className="mt-2 text-center font-mono-custom text-[9px] uppercase tracking-widest text-[#4A5568]">resume.pdf</p>
    </motion.a>
  );
}

function DeskLamp() {
  return (
    <div className="relative h-24 w-16" aria-hidden="true">
      <div className="absolute bottom-0 right-2 h-2 w-12 rounded-full" style={{ background: "#16203A" }} />
      <div className="absolute bottom-1 right-7 h-20 w-0.5" style={{ background: "#243055", transform: "rotate(-12deg)", transformOrigin: "bottom" }} />
      <div className="absolute right-[-2px] top-[-4px] h-6 w-10 rounded-b-full border border-white/10" style={{ background: "#1A2540", transform: "rotate(-12deg)" }} />
      {/* soft warm light */}
      <div
        className="pointer-events-none absolute right-[-18px] top-2"
        style={{ width: 90, height: 120, background: "radial-gradient(ellipse at 50% 0%, rgba(245,200,120,0.05) 0%, transparent 70%)", transform: "rotate(-12deg)", transformOrigin: "top center" }}
      />
    </div>
  );
}

export function DesignerDesk() {
  const objects = [
    // Center / primary — laptop first on mobile
    {
      key: "laptop",
      className: "order-1 lg:order-2 lg:col-span-1",
      delay: 0.1,
      node: <Laptop />,
    },
    {
      key: "left",
      className: "order-2 lg:order-1 flex flex-col items-center gap-12",
      delay: 0.3,
      node: (
        <>
          <ResumeDoc />
          <CoffeeMug />
        </>
      ),
    },
    {
      key: "right",
      className: "order-3 lg:order-3 flex flex-col items-center gap-10",
      delay: 0.45,
      node: (
        <>
          <BusinessCard />
          <DeskLamp />
        </>
      ),
    },
  ];

  return (
    <div className="relative mx-auto max-w-5xl">
      <div
        className="relative overflow-hidden rounded-3xl border border-white/[0.06]"
        style={{
          background: "linear-gradient(160deg, #141E32 0%, #0D1526 100%)",
          boxShadow: "0 50px 110px -40px rgba(0,0,0,0.7)",
          minHeight: 440,
          perspective: "1400px",
        }}
      >
        {/* top edge highlight */}
        <div className="absolute left-0 right-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} aria-hidden="true" />
        {/* desk surface grain */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 90px, rgba(255,255,255,0.012) 90px, rgba(255,255,255,0.012) 91px)" }}
          aria-hidden="true"
        />
        {/* soft ambient pool */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-full w-2/3 -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse at 50% 10%, rgba(79,142,247,0.06), transparent 65%)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-1 items-center gap-14 p-10 lg:grid-cols-3 lg:items-start lg:gap-10 lg:p-14">
          {objects.map((o) => (
            <motion.div
              key={o.key}
              className={o.className}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.95, ease: EASE, delay: o.delay }}
            >
              {o.node}
            </motion.div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 rounded-b-3xl" style={{ background: "rgba(0,0,0,0.3)" }} aria-hidden="true" />
      </div>

      {/* desk legs */}
      <div className="flex justify-between px-10" aria-hidden="true">
        {[0, 1].map((i) => (
          <div key={i} className="h-6 w-6 rounded-b" style={{ background: "#0D1526" }} />
        ))}
      </div>
    </div>
  );
}
