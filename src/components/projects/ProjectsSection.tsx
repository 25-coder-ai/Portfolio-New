"use client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectWaterfall } from "./ProjectWaterfall";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  const { ref, inView } = useScrollAnimation();

  return (
    <section id="projects" className="relative" ref={ref}>
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
          project has been viewed. Heading is passed in so it stays pinned too. */}
      <div className="relative z-10">
        <ProjectWaterfall
          projects={projects}
          heading={
            <SectionHeading
              label="Projects"
              title="Built to Ship"
              subtitle="A stack of real, working projects. Scroll to let each one crest forward — or tap a card below to bring it up."
              inView={inView}
            />
          }
        />
      </div>
    </section>
  );
}
