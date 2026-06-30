"use client";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlueprintBook } from "./BlueprintBook";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  const { ref, inView } = useScrollAnimation();

  return (
    <section id="projects" className="section-padding px-6 relative" ref={ref}>
      {/* Blueprint dot grid */}
      <div className="absolute inset-0 opacity-50 blueprint-grid pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          label="Projects"
          title="Engineering Blueprint"
          subtitle="Every project is a chapter. Turn the page to read the full story — from problem statement to deployed solution."
          inView={inView}
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          {/* Desk lamp hint */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 text-[#4A5568] text-xs font-mono-custom">
              <span className="inline-block w-2 h-2 rounded-full bg-[#4F8EF7]/40 animate-pulse" />
              Blueprint Mode Active · {projects.length} Projects
            </div>
          </div>

          <BlueprintBook projects={projects} />
        </motion.div>
      </div>
    </section>
  );
}
