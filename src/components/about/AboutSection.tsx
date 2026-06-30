"use client";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RoboticArm } from "./RoboticArm";
import { profile } from "@/data/profile";

const STATS = [
  { label: "CGPA", value: "8.5" },
  { label: "Projects", value: "10+" },
  { label: "Hackathons", value: "5+" },
  { label: "Certifications", value: "4+" },
];

export function AboutSection() {
  const { ref, inView } = useScrollAnimation();

  return (
    <section id="about" className="section-padding px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="About Me"
          title="How I'm Built"
          subtitle="Each component is a core discipline I've assembled over the years — not just skills, but thinking frameworks."
          inView={inView}
        />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Bio + Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="space-y-5 text-[#8892A4] leading-relaxed mb-10">
              <p className="text-[#E8EEFF] text-lg font-medium">
                {profile.bio}
              </p>
              <p>
                I believe data engineering and machine learning aren't just technical disciplines — they're a mindset. I approach every problem by asking what the data is trying to tell us, then build the pipeline that lets it speak clearly.
              </p>
              <p>
                Currently pursuing a B.Tech in Computer Science with specialization in Big Data Analytics at{" "}
                <span className="text-[#E8EEFF] font-medium">VIT University, Chennai</span>.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="glass rounded-xl p-4 text-center"
                >
                  <p className="font-display text-3xl font-bold text-[#4F8EF7]">{stat.value}</p>
                  <p className="text-[#8892A4] text-xs mt-1 uppercase tracking-widest font-mono-custom">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Robotic Arm Assembly */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div className="glass rounded-2xl p-6 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                <span className="text-xs text-[#4A5568] font-mono-custom uppercase tracking-widest">
                  Assembly Sequence — Active
                </span>
              </div>
              <RoboticArm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
