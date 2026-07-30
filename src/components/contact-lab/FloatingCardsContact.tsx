"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Download, Mail, Send } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { CONTACT_BACKGROUND } from "@/lib/constants";
import { profile } from "@/data/profile";

const EASE = [0.16, 1, 0.3, 1] as const;

interface CardDef {
  key: string;
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  accent: string; // icon-tile accent
  download?: boolean;
  external?: boolean;
  floatDur: number;
  floatAmp: number;
}

const CARDS: CardDef[] = [
  {
    key: "github",
    icon: <GithubIcon size={22} />,
    title: "GitHub",
    description: "Projects & open-source work",
    href: profile.github,
    accent: "rgba(79,142,247,0.16)",
    external: true,
    floatDur: 7.5,
    floatAmp: 6,
  },
  {
    key: "linkedin",
    icon: <LinkedinIcon size={22} />,
    title: "LinkedIn",
    description: "Let's connect professionally",
    href: profile.linkedin,
    accent: "rgba(79,142,247,0.16)",
    external: true,
    floatDur: 8.5,
    floatAmp: 5,
  },
  {
    key: "resume",
    icon: <Download size={22} />,
    title: "Resume",
    description: "Download my experience (PDF)",
    href: profile.resumeUrl,
    accent: "rgba(167,139,250,0.16)",
    download: true,
    floatDur: 8,
    floatAmp: 6,
  },
  {
    key: "email",
    icon: <Mail size={22} />,
    title: "Email",
    description: "Reach out directly",
    href: `mailto:${profile.email}`,
    accent: "rgba(167,139,250,0.16)",
    floatDur: 9,
    floatAmp: 5,
  },
];

export function FloatingCardsContact() {
  const { ref, inView } = useScrollAnimation({ threshold: 0.2 });
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      ref={ref}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-24 sm:py-32"
      style={{ backgroundColor: CONTACT_BACKGROUND }}
    >
      <BackgroundFX inView={inView} />

      <div className="relative z-10 w-full max-w-2xl">
        {/* heading */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#997953]/80"
          >
            Contact
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.18 }}
            className="mt-3 text-3xl font-semibold tracking-tight text-[#E8EEFF] sm:text-[2.7rem]"
          >
            Let&rsquo;s Build Something Together
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.28 }}
            className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#8892A4] sm:text-base"
          >
            Whether it&rsquo;s software, AI, data, or your next big idea — pick a
            channel below or send a note directly.
          </motion.p>
        </div>

        {/* cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CARDS.map((card, i) => (
            <FloatingCard
              key={card.key}
              card={card}
              reduce={reduce}
              inView={inView}
              delay={0.42 + i * 0.12}
            />
          ))}
        </div>

        {/* form */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.0 }}
          className="mx-auto mt-12 max-w-lg"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Floating card — entrance + idle float + cursor magnetism           */
/* ------------------------------------------------------------------ */

function FloatingCard({
  card,
  reduce,
  inView,
  delay,
}: {
  card: CardDef;
  reduce: boolean;
  inView: boolean;
  delay: number;
}) {
  // Magnetism: card drifts a few px toward the cursor.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.5 });
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.5 });

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const relY = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    mx.set(relX * 8); // max ~8px pull
    my.set(relY * 8);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {/* idle float layer */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -card.floatAmp, 0] }}
        transition={{
          duration: card.floatDur,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <motion.a
          href={card.href}
          {...(card.download ? { download: true } : {})}
          {...(card.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ x: reduce ? 0 : x, y: reduce ? 0 : y }}
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.98 }}
          className="group relative flex h-full min-h-[132px] flex-col justify-between gap-6 rounded-[22px] border border-white/[0.08] bg-[#1A2540] p-5 shadow-[0_10px_30px_-16px_rgba(0,0,0,0.7)] transition-[box-shadow,border-color] duration-300 hover:border-white/[0.16] hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#997953]/70"
        >
          <div className="flex items-start justify-between">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-[#E8EEFF]"
              style={{ backgroundColor: card.accent }}
            >
              {card.icon}
            </span>
            <ArrowUpRight
              size={20}
              className="text-[#4A5568] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#997953]"
            />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#E8EEFF]">
              {card.title}
            </h3>
            <p className="mt-0.5 text-sm text-[#8892A4]">{card.description}</p>
          </div>
        </motion.a>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Background                                                          */
/* ------------------------------------------------------------------ */

function BackgroundFX({ inView }: { inView: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <motion.div
        className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(79,142,247,0.10) 0%, rgba(167,139,250,0.05) 42%, transparent 68%)",
          filter: "blur(44px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1.5, ease: EASE }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 60%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Contact form                                                       */
/* ------------------------------------------------------------------ */

function ContactForm() {
  const [sent, setSent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(
      `Portfolio message from ${name || "a visitor"}`,
    );
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const field =
    "w-full rounded-xl border border-white/[0.08] bg-[#1A2540] px-4 py-3 text-sm text-[#E8EEFF] placeholder:text-[#4A5568] outline-none transition-all duration-200 focus:border-[#997953]/60 focus:ring-2 focus:ring-[#997953]/25";

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Name</span>
          <input
            ref={nameRef}
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Name"
            className={field}
          />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            className={field}
          />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Message"
          className={`${field} resize-none`}
        />
      </label>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.015, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#997953] to-[#A78BFA] px-5 py-3 text-sm font-medium text-white shadow-[0_14px_36px_-12px_rgba(79,142,247,0.7)] transition-shadow duration-300 hover:shadow-[0_18px_46px_-10px_rgba(79,142,247,0.85)]"
      >
        {sent ? "Opening your mail…" : "Send"}
        <Send size={16} />
      </motion.button>
    </form>
  );
}
