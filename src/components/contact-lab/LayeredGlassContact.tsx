"use client";

import {
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Download, Mail, Send } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { CONTACT_BACKGROUND } from "@/lib/constants";
import { profile } from "@/data/profile";

const EASE = [0.16, 1, 0.3, 1] as const;

// Per-layer entrance delays (seconds) — each sheet settles individually
const T = { layer1: 0.15, layer2: 0.35, layer3: 0.55 } as const;

interface LinkDef {
  key: string;
  icon: ReactNode;
  title: string;
  hint: string;
  href: string;
  download?: boolean;
  external?: boolean;
}

const LINKS: LinkDef[] = [
  {
    key: "github",
    icon: <GithubIcon size={22} />,
    title: "GitHub",
    hint: "Projects & open source",
    href: profile.github,
    external: true,
  },
  {
    key: "linkedin",
    icon: <LinkedinIcon size={22} />,
    title: "LinkedIn",
    hint: "Let's connect",
    href: profile.linkedin,
    external: true,
  },
  {
    key: "resume",
    icon: <Download size={22} />,
    title: "Resume",
    hint: "Download PDF",
    href: profile.resumeUrl,
    download: true,
  },
  {
    key: "email",
    icon: <Mail size={22} />,
    title: "Email",
    hint: "Reach out directly",
    href: `mailto:${profile.email}`,
  },
];

export function LayeredGlassContact() {
  const { ref, inView } = useScrollAnimation({ threshold: 0.2 });
  const reduce = useReducedMotion();

  // Normalised pointer over the stage, -0.5 .. 0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);

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
        className="relative z-10 w-full max-w-xl"
        style={{ perspective: 1400, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* ---- LAYER 1 — deepest, largest: typography only ---- */}
        <Layer
          px={px}
          py={py}
          reduce={reduce}
          inView={inView}
          depthZ={-90}
          move={10}
          rot={1.4}
          floatDur={11}
          floatAmp={6}
          delay={T.layer1}
          className="mx-auto max-w-lg"
        >
          <div className="rounded-[30px] border border-white/10 bg-white/[0.05] px-7 py-9 text-center backdrop-blur-2xl sm:px-10 sm:py-11">
            <GlassSheen />
            <RimLight />
            <p className="relative text-[11px] font-medium uppercase tracking-[0.35em] text-[#997953]/80">
              Contact
            </p>
            <h2 className="relative mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#E8EEFF] sm:text-[2.7rem]">
              Let&rsquo;s Build
              <br />
              Something Together
            </h2>
          </div>
        </Layer>

        {/* ---- LAYER 2 — mid depth: floating link cards ---- */}
        <Layer
          px={px}
          py={py}
          reduce={reduce}
          inView={inView}
          depthZ={10}
          move={22}
          rot={2}
          floatDur={9}
          floatAmp={5}
          delay={T.layer2}
          className="-mt-6"
        >
          <div className="grid grid-cols-2 gap-3">
            {LINKS.map((l, i) => (
              <LinkCard key={l.key} link={l} inView={inView} delay={T.layer2 + 0.08 + i * 0.07} />
            ))}
          </div>
        </Layer>

        {/* ---- LAYER 3 — frontmost: contact form ---- */}
        <Layer
          px={px}
          py={py}
          reduce={reduce}
          inView={inView}
          depthZ={70}
          move={34}
          rot={2.4}
          floatDur={8}
          floatAmp={4}
          delay={T.layer3}
          className="mt-4"
        >
          <div className="rounded-[26px] border border-white/12 bg-white/[0.06] px-5 py-6 backdrop-blur-2xl sm:px-7 sm:py-7">
            <GlassSheen />
            <RimLight />
            <ContactForm />
          </div>
        </Layer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Layer wrapper — depth + independent parallax + idle float          */
/* ------------------------------------------------------------------ */

function Layer({
  px,
  py,
  reduce,
  inView,
  depthZ,
  move,
  rot,
  floatDur,
  floatAmp,
  delay,
  className,
  children,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  reduce: boolean;
  inView: boolean;
  depthZ: number;
  move: number;
  rot: number;
  floatDur: number;
  floatAmp: number;
  delay: number;
  className?: string;
  children: ReactNode;
}) {
  const spring = { stiffness: 90, damping: 20, mass: 0.6 };
  const tx = useSpring(useTransform(px, [-0.5, 0.5], [-move, move]), spring);
  const ty = useSpring(useTransform(py, [-0.5, 0.5], [-move, move]), spring);
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-rot, rot]), spring);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [rot, -rot]), spring);

  return (
    <motion.div
      className={className}
      style={{
        x: reduce ? 0 : tx,
        y: reduce ? 0 : ty,
        rotateX: reduce ? 0 : rx,
        rotateY: reduce ? 0 : ry,
        z: depthZ,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {/* inner idle float, independent per layer */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -floatAmp, 0] }}
        transition={{ duration: floatDur, ease: "easeInOut", repeat: Infinity }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared glass detailing                                             */
/* ------------------------------------------------------------------ */

function GlassSheen() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      style={{
        background:
          "linear-gradient(150deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, transparent 60%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -16px 34px -22px rgba(6,10,22,0.7), 0 40px 80px -44px rgba(0,0,0,0.8)",
      }}
    />
  );
}

function RimLight() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-8 top-0 h-px"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Background                                                          */
/* ------------------------------------------------------------------ */

function BackgroundFX({ inView }: { inView: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <motion.div
        className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(79,142,247,0.15) 0%, rgba(167,139,250,0.07) 40%, transparent 68%)",
          filter: "blur(34px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
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
/* Link card (layer 2)                                                */
/* ------------------------------------------------------------------ */

function LinkCard({
  link,
  inView,
  delay,
}: {
  link: LinkDef;
  inView: boolean;
  delay: number;
}) {
  return (
    <motion.a
      href={link.href}
      {...(link.download ? { download: true } : {})}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#997953]/70"
    >
      <RimLight />
      <div className="relative flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#E8EEFF] transition-colors duration-300 group-hover:text-white">
          {link.icon}
        </span>
        <ArrowUpRight
          size={18}
          className="text-[#8892A4] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#997953]"
        />
      </div>
      <div className="relative">
        <span className="block text-sm font-medium text-[#E8EEFF]">
          {link.title}
        </span>
        <span className="block text-xs text-[#8892A4]">{link.hint}</span>
      </div>
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/* Contact form (layer 3)                                             */
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
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#E8EEFF] placeholder:text-[#4A5568] outline-none transition-all duration-200 focus:border-[#997953]/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-[#997953]/30";

  return (
    <form onSubmit={submit} className="relative space-y-3">
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
          rows={3}
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
