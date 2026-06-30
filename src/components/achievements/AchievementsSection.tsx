"use client";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DisplayCase } from "./DisplayCase";
import { achievements } from "@/data/achievements";

export function AchievementsSection() {
  const { ref, inView } = useScrollAnimation();

  return (
    <section id="achievements" className="section-padding px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Achievements"
          title="The Display Gallery"
          subtitle="A curated collection of milestones, certifications, and recognition. Each case holds a story."
          inView={inView}
        />

        {/* Gallery shelf */}
        <div className="relative">
          {/* Shelf line */}
          <div
            className="hidden md:block absolute -inset-x-6 h-1 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(79,142,247,0.15), transparent)",
              top: "auto",
              bottom: -16,
            }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1 + i * 0.07,
                }}
              >
                <DisplayCase achievement={achievement} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
