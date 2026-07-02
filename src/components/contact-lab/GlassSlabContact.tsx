"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Download, Mail, Send } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { CONTACT_BACKGROUND } from "@/lib/constants";
import { profile } from "@/data/profile";

const EASE = [0.16, 1, 0.3, 1] as const;

// Entrance choreography (seconds)
const T = {
  slab: 0.15,
  heading: 0.55,
  intro: 0.7,
  cards: 0.9, // first card; each subsequent staggers +0.09
  form: 1.5,
} as const;

interface CardDef {
  key: string;
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  download?: boolean;
  external?: boolean;
}

const CARDS: CardDef[] = [
  {
    key: "github",
    icon: <GithubIcon size={20} />,
    title: "GitHub",
    description: "Explore my projects and open-source work",
    href: profile.github,
    external: true,
  },
  {
    key: "linkedin",
    icon: <LinkedinIcon size={20} />,
    title: "LinkedIn",
    description: "Let's connect and build our network",
    href: profile.linkedin,
    external: true,
  },
  {
    key: "resume",
    icon: <Download size={20} />,
    title: "Resume",
    description: "Download my full experience as a PDF",
    href: profile.resumeUrl,
    download: true,
  },
  {
    key: "email",
    icon: <Mail size={20} />,
    title: "Email",
    description: "Reach out directly — I reply quickly",
    href: `mailto:${profile.email}`,
  },
];

export function GlassSlabContact() {
  const { ref, inView } = useScrollAnimation({ threshold: 0.2 });
  const reduce = useReducedMotion();

  // Normalised cursor position over the slab, -0.5 .. 0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [2, -2]), {
    stiffness: 120,
    damping: 20,
  });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-2, 2]), {
    stiffness: 120,
    damping: 20,
  });

  // Glare / reflection sweep follows the cursor across the glass
  const glareX = useTransform(px, [-0.5, 0.5], ["25%", "75%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["10%", "70%"]);
  const glare = useMotionTemplate`radial-gradient(650px circle at ${glareX} ${glareY}, rgba(255,255,255,0.14), rgba(255,255,255,0.04) 35%, transparent 60%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-24 sm:py-32"
      style={{ backgroundColor: CONTACT_BACKGROUND }}
    >
      <BackgroundFX inView={inView} />

      <div
        className="relative z-10 w-full max-w-2xl"
        style={{ perspective: 1600 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <IdleFloat reduce={reduce}>
          <motion.div
            initial={{ opacity: 0, y: 120, scale: 0.96 }}
            animate={
              inView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 120, scale: 0.96 }
            }
            transition={{ duration: 1.1, ease: EASE, delay: T.slab }}
            style={{
              rotateX: reduce ? 0 : rotX,
              rotateY: reduce ? 0 : rotY,
              transformStyle: "preserve-3d",
            }}
          >
            <GlassSlab glare={reduce ? undefined : glare} inView={inView} />
          </motion.div>
        </IdleFloat>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Background                                                          */
/* ------------------------------------------------------------------ */

function BackgroundFX({ inView }: { inView: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* faint radial light behind the slab */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(79,142,247,0.16) 0%, rgba(167,139,250,0.08) 38%, transparent 68%)",
          filter: "blur(30px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Idle vertical float                                                */
/* ------------------------------------------------------------------ */

function IdleFloat({
  reduce,
  children,
}: {
  reduce: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -7, 0] }}
      transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* The glass slab                                                     */
/* ------------------------------------------------------------------ */

function GlassSlab({
  glare,
  inView,
}: {
  glare?: ReturnType<typeof useMotionTemplate>;
  inView: boolean;
}) {
  return (
    <div className="relative" style={{ transformStyle: "preserve-3d" }}>
      {/* --- ambient contact shadow beneath the slab --- */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-6 bottom-[-46px] h-24 rounded-[50%]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.55), transparent 72%)",
          filter: "blur(26px)",
          transform: "translateZ(-40px)",
        }}
      />

      {/* --- edge thickness: a slightly larger, darker slab behind --- */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[34px]"
        style={{
          transform: "translateY(12px) translateZ(-24px)",
          background:
            "linear-gradient(180deg, rgba(120,140,180,0.22), rgba(10,16,30,0.55))",
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8)",
        }}
      />

      {/* --- the frosted face --- */}
      <div
        className="relative overflow-hidden rounded-[34px] border border-white/12 px-7 py-9 sm:px-10 sm:py-11"
        style={{
          backgroundImage:
            "linear-gradient(160deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.03) 100%)",
          backdropFilter: "blur(22px) saturate(140%)",
          WebkitBackdropFilter: "blur(22px) saturate(140%)",
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.35)", // top bevel highlight
            "inset 0 0 0 1px rgba(255,255,255,0.04)",
            "inset 0 -18px 40px -20px rgba(8,12,24,0.7)", // bottom inner shadow
            "0 50px 90px -40px rgba(0,0,0,0.85)", // soft cast shadow
          ].join(", "),
          transformStyle: "preserve-3d",
        }}
      >
        {/* top rim light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
          }}
        />
        {/* cursor-driven glare */}
        {glare ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: glare }}
          />
        ) : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(650px circle at 40% 20%, rgba(255,255,255,0.1), transparent 55%)",
            }}
          />
        )}

        {/* ---------------- content ---------------- */}
        <div className="relative">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8, ease: EASE, delay: T.heading }}
            className="text-balance text-3xl font-semibold tracking-tight text-[#E8EEFF] sm:text-4xl"
          >
            Let&rsquo;s Build Something Together
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.8, ease: EASE, delay: T.intro }}
            className="mt-3 max-w-md text-sm leading-relaxed text-[#8892A4] sm:text-base"
          >
            Whether it&rsquo;s software, AI, data, or your next big idea — pick a
            channel below or send a note directly.
          </motion.p>

          {/* contact cards */}
          <div className="mt-8 space-y-3">
            {CARDS.map((card, i) => (
              <ContactCard
                key={card.key}
                card={card}
                inView={inView}
                delay={T.cards + i * 0.09}
              />
            ))}
          </div>

          {/* divider */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={
              inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }
            }
            transition={{ duration: 0.9, ease: EASE, delay: T.form - 0.15 }}
            className="my-8 h-px origin-center bg-gradient-to-r from-transparent via-white/12 to-transparent"
          />

          {/* form */}
          <ContactForm inView={inView} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Contact card                                                       */
/* ------------------------------------------------------------------ */

function ContactCard({
  card,
  inView,
  delay,
}: {
  card: CardDef;
  inView: boolean;
  delay: number;
}) {
  return (
    <motion.a
      href={card.href}
      {...(card.download ? { download: true } : {})}
      {...(card.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8EF7]/70 sm:px-5"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#E8EEFF] transition-colors duration-300 group-hover:border-white/25 group-hover:text-white">
        {card.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-[#E8EEFF] sm:text-base">
          {card.title}
        </span>
        <span className="block truncate text-xs text-[#8892A4] sm:text-sm">
          {card.description}
        </span>
      </span>
      <ArrowRight
        size={18}
        className="shrink-0 text-[#8892A4] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#4F8EF7]"
      />
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/* Contact form                                                       */
/* ------------------------------------------------------------------ */

function ContactForm({ inView }: { inView: boolean }) {
  const [sent, setSent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(`Portfolio message from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#E8EEFF] placeholder:text-[#4A5568] outline-none transition-all duration-200 focus:border-[#4F8EF7]/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-[#4F8EF7]/30";

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.8, ease: EASE, delay: T.form }}
      className="space-y-3"
    >
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
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4F8EF7] to-[#A78BFA] px-5 py-3 text-sm font-medium text-white shadow-[0_14px_36px_-12px_rgba(79,142,247,0.7)] transition-shadow duration-300 hover:shadow-[0_18px_46px_-10px_rgba(79,142,247,0.85)]"
      >
        {sent ? "Opening your mail…" : "Send"}
        <Send size={16} />
      </motion.button>
    </motion.form>
  );
}
