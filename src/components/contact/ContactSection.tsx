"use client";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DesignerDesk } from "./DesignerDesk";
import { CONTACT_BACKGROUND } from "@/lib/constants";

export function ContactSection() {
  const { ref, inView } = useScrollAnimation();

  return (
    <section
      id="contact"
      className="section-padding px-6 relative"
      style={{ background: CONTACT_BACKGROUND }}
      ref={ref}
    >
      {/* Subtle top divider */}
      <div className="divider mb-0" aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Contact"
          title="Designer's Desk"
          subtitle="Let's build something together. Send a message through the laptop, grab my resume, or reach out directly."
          inView={inView}
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          <DesignerDesk />
        </motion.div>

        {/* Direct contact links below the desk */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-[#4A5568] text-sm mb-6">Or reach out directly</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="mailto:your.email@example.com"
              className="text-[#8892A4] hover:text-[#E8EEFF] transition-colors text-sm flex items-center gap-2"
            >
              <span className="text-[#4F8EF7]">✉</span>
              your.email@example.com
            </a>
            <span className="w-px h-4 bg-white/10" aria-hidden="true" />
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8892A4] hover:text-[#E8EEFF] transition-colors text-sm flex items-center gap-2"
            >
              <span className="text-[#4F8EF7]">⊞</span>
              LinkedIn
            </a>
            <span className="w-px h-4 bg-white/10" aria-hidden="true" />
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8892A4] hover:text-[#E8EEFF] transition-colors text-sm flex items-center gap-2"
            >
              <span className="text-[#4F8EF7]">◉</span>
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
