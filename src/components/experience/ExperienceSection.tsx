"use client";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ConveyorBelt } from "./ConveyorBelt";

export function ExperienceSection() {
  const { ref, inView } = useScrollAnimation();

  return (
    <section id="experience" className="section-padding px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Experience"
          title="The Assembly Line"
          subtitle="Every role, hackathon, and milestone arrives on the belt. Click a box — the robotic arm picks it up and unfolds the full story."
          inView={inView}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <ConveyorBelt />
        </motion.div>
      </div>
    </section>
  );
}
