"use client";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DesignerDesk } from "./DesignerDesk";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { CONTACT_BACKGROUND } from "@/lib/constants";
import { profile } from "@/data/profile";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ContactSection() {
  const { ref, inView } = useScrollAnimation();

  return (
    <section
      id="contact"
      ref={ref}
      style={{ background: CONTACT_BACKGROUND }}
      className="section-padding px-6 relative overflow-hidden"
    >
      {/* subtle ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-60"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(79,142,247,0.1), transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.28), transparent 70%)" }}
      />

      <div className="divider mb-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          label="Contact"
          title="Let's Build Together"
          subtitle="Pull up a chair. Send a note through the laptop, take a copy of my résumé, or reach out directly — whatever's easiest."
          inView={inView}
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: 0.25 }}
        >
          <DesignerDesk />
        </motion.div>

        {/* direct links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
          className="mt-16 text-center"
        >
          <p className="mb-6 text-sm text-[#4A5568]">Or reach out directly</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-2 text-sm text-[#8892A4] transition-colors hover:text-[#E8EEFF]"
            >
              <Mail size={14} className="text-[#4F8EF7]" />
              {profile.email}
            </a>
            <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden="true" />
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#8892A4] transition-colors hover:text-[#E8EEFF]"
            >
              <LinkedinIcon size={14} className="text-[#4F8EF7]" />
              LinkedIn
            </a>
            <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden="true" />
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#8892A4] transition-colors hover:text-[#E8EEFF]"
            >
              <GithubIcon size={14} className="text-[#4F8EF7]" />
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
