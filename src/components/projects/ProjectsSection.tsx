"use client";
import { ProjectsHeading } from "./ProjectsHeading";
import { ProjectWaterfall } from "./ProjectWaterfall";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  return (
    <section id="projects" className="relative">
      {/* Soft depth backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(79,142,247,0.06), transparent 60%)",
        }}
      />

      {/* The waterfall pins this whole section: scrolling anywhere inside it
          advances the cards, and the next section only appears once every
          project has been viewed. Heading is passed in so it stays pinned too.
          Heading and cards each reveal themselves via their own whileInView. */}
      <div className="relative z-10">
        <ProjectWaterfall projects={projects} heading={<ProjectsHeading />} />
      </div>
    </section>
  );
}
