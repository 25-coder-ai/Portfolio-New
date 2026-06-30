"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/types";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface BookPageProps {
  project: Project;
  pageNum: number;
  totalPages: number;
}

function BookPage({ project, pageNum, totalPages }: BookPageProps) {
  return (
    <div className="absolute inset-0 blueprint-grid rounded-r-xl overflow-hidden">
      {/* Page header */}
      <div
        className="p-6 border-b border-[#4F8EF7]/15"
        style={{ background: `${project.color}08` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: project.color }}
              />
              <span className="text-[#4F8EF7]/70 text-[10px] font-mono-custom uppercase tracking-widest">
                Project {pageNum}/{totalPages}
              </span>
            </div>
            <h3
              className="font-display font-bold text-2xl md:text-3xl text-[#E8EEFF] leading-tight"
            >
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge label={project.category} color={project.color} />
              <Badge label={project.year} color="#8892A4" />
            </div>
          </div>

          {/* Corner marks — blueprint style */}
          <div className="hidden sm:flex flex-col items-end gap-1 text-[#4F8EF7]/20 font-mono-custom text-[8px] leading-tight">
            <span>REV.{pageNum}.0</span>
            <span>{project.year}</span>
            <div className="w-16 h-px bg-[#4F8EF7]/20" />
            <span>CS/BDA</span>
          </div>
        </div>
      </div>

      {/* Page content — scrollable */}
      <div className="overflow-y-auto h-[calc(100%-140px)] p-6 space-y-5">
        {/* Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 border border-[#F87171]/15">
            <p className="text-[#F87171] text-[10px] font-mono-custom uppercase tracking-widest mb-2">
              ◈ Problem Statement
            </p>
            <p className="text-[#8892A4] text-sm leading-relaxed">{project.problem}</p>
          </div>
          <div className="glass rounded-xl p-4 border border-[#34D399]/15">
            <p className="text-[#34D399] text-[10px] font-mono-custom uppercase tracking-widest mb-2">
              ◈ Solution
            </p>
            <p className="text-[#8892A4] text-sm leading-relaxed">{project.solution}</p>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <p className="text-[#4F8EF7]/70 text-[10px] font-mono-custom uppercase tracking-widest mb-2">
            ⊞ Tech Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <Badge key={tech} label={tech} color="#4F8EF7" />
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <p className="text-[#A78BFA]/70 text-[10px] font-mono-custom uppercase tracking-widest mb-2">
            ✦ Key Features
          </p>
          <ul className="space-y-1.5">
            {project.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-[#8892A4] text-sm">
                <span className="text-[#A78BFA] mt-0.5 text-xs">▸</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-[1.02]"
              style={{
                background: project.color,
                boxShadow: `0 4px 20px ${project.color}30`,
              }}
            >
              <ExternalLink size={13} />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-white/10 text-[#E8EEFF] hover:bg-white/[0.04] transition-all"
            >
              <GithubIcon size={13} />
              Source
            </a>
          )}
        </div>
      </div>

      {/* Blueprint reference marks */}
      <div className="absolute bottom-3 right-4 text-[#4F8EF7]/15 text-[9px] font-mono-custom">
        {project.id.toUpperCase()} · CONFIDENTIAL
      </div>
    </div>
  );
}

interface BlueprintBookProps {
  projects: Project[];
}

export function BlueprintBook({ projects }: BlueprintBookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const canGoNext = currentPage < projects.length - 1;
  const canGoPrev = currentPage > 0;

  const flipToPage = useCallback(
    (dir: "next" | "prev") => {
      if (isFlipping) return;
      if (dir === "next" && !canGoNext) return;
      if (dir === "prev" && !canGoPrev) return;

      setIsFlipping(true);
      setFlipDirection(dir);
      setTimeout(() => {
        setCurrentPage((p) => (dir === "next" ? p + 1 : p - 1));
        setIsFlipping(false);
      }, 450);
    },
    [isFlipping, canGoNext, canGoPrev]
  );

  const pageVariants = {
    enterNext: { x: 60, opacity: 0 },
    enterPrev: { x: -60, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exitNext: { x: -60, opacity: 0 },
    exitPrev: { x: 60, opacity: 0 },
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Desk surface */}
      <div
        className="absolute inset-x-[-24px] bottom-[-16px] h-12 rounded-b-3xl"
        style={{ background: "#0D1526" }}
        aria-hidden="true"
      />

      {/* Book container */}
      <div
        className="relative rounded-2xl overflow-hidden border border-[#4F8EF7]/12"
        style={{
          minHeight: 520,
          background: "#0D1526",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(79,142,247,0.08)",
        }}
      >
        {/* Spine */}
        <div
          className="absolute left-0 top-0 bottom-0 w-4 border-r border-[#4F8EF7]/10 flex flex-col items-center justify-center"
          style={{ background: "#111B2F" }}
          aria-hidden="true"
        >
          <span
            className="text-[8px] font-mono-custom text-[#4F8EF7]/30 uppercase tracking-[0.3em]"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Projects
          </span>
        </div>

        {/* Page area */}
        <div className="ml-4 relative" style={{ minHeight: 520 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={flipDirection === "next" ? pageVariants.enterNext : pageVariants.enterPrev}
              animate={pageVariants.center}
              exit={flipDirection === "next" ? pageVariants.exitNext : pageVariants.exitPrev}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <BookPage
                project={projects[currentPage]}
                pageNum={currentPage + 1}
                totalPages={projects.length}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => flipToPage("prev")}
          disabled={!canGoPrev || isFlipping}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
            canGoPrev && !isFlipping
              ? "border-white/10 text-[#E8EEFF] hover:bg-white/[0.04]"
              : "border-white/[0.04] text-[#4A5568] cursor-not-allowed"
          )}
          aria-label="Previous project"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {/* Page dots */}
        <div className="flex items-center gap-2" aria-label={`Page ${currentPage + 1} of ${projects.length}`}>
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const dir = i > currentPage ? "next" : "prev";
                setFlipDirection(dir);
                setCurrentPage(i);
              }}
              className={cn(
                "rounded-full transition-all duration-300",
                i === currentPage
                  ? "w-6 h-2 bg-[#4F8EF7]"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              )}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => flipToPage("next")}
          disabled={!canGoNext || isFlipping}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
            canGoNext && !isFlipping
              ? "border-white/10 text-[#E8EEFF] hover:bg-white/[0.04]"
              : "border-white/[0.04] text-[#4A5568] cursor-not-allowed"
          )}
          aria-label="Next project"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
