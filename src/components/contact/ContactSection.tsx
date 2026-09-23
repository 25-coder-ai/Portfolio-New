"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Download, Mail, Send } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { CONTACT_BACKGROUND } from "@/lib/constants";
import { profile } from "@/data/profile";

const EASE = [0.16, 1, 0.3, 1] as const;

// Entrance timing (seconds)
const T = { panel: 0.15, heading: 0.45, links: 0.65, form: 0.85 } as const;

interface LinkDef {
  key: string;
  icon: ReactNode;
  title: string;
  href: string;
  download?: boolean;
  external?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// `mailto:` silently does nothing on desktops without a default mail app
// (common on Windows / for webmail users). On desktop, open Gmail's
// compose window in a new tab instead; phones always have a mail app.
function openEmail(subject = "", body = "") {
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if (isMobile) {
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (body) params.set("body", body);
    const qs = params.toString().replace(/\+/g, "%20");
    window.location.href = `mailto:${profile.email}${qs ? `?${qs}` : ""}`;
    return;
  }
  const params = new URLSearchParams({ view: "cm", fs: "1", to: profile.email });
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  window.open(
    `https://mail.google.com/mail/?${params.toString()}`,
    "_blank",
    "noopener,noreferrer",
  );
}

const LINKS: LinkDef[] = [
  {
    key: "github",
    icon: <GithubIcon size={18} />,
    title: "GitHub",
    href: profile.github,
    external: true,
  },
  {
    key: "linkedin",
    icon: <LinkedinIcon size={18} />,
    title: "LinkedIn",
    href: profile.linkedin,
    external: true,
  },
  {
    key: "resume",
    icon: <Download size={18} />,
    title: "Resume",
    href: profile.resumeUrl,
    download: true,
  },
  {
    key: "email",
    icon: <Mail size={18} />,
    title: "Email",
    href: `mailto:${profile.email}`,
    onClick: (e) => {
      e.preventDefault();
      openEmail();
    },
  },
];

export function ContactSection() {
  const { ref, inView } = useScrollAnimation({ threshold: 0.2 });
  const reduce = useReducedMotion();

  // Raw cursor position over the panel (px). Start off-panel.
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  // Smooth, lightly-lagged spotlight so light "settles" rather than snaps.
  const sx = useSpring(mx, { stiffness: 260, damping: 40, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 260, damping: 40, mass: 0.4 });
  // Presence: fades the light in/out as the cursor enters/leaves.
  const glow = useMotionValue(0);
  const glowS = useSpring(glow, { stiffness: 140, damping: 26 });

  // Warm-white soft spotlight that gently brightens nearby glass.
  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${sx}px ${sy}px, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 34%, transparent 62%)`;
  // A wider, cooler reflection that shifts as the light moves.
  const sheen = useMotionTemplate`radial-gradient(620px circle at ${sx}px ${sy}px, rgba(120,170,255,0.10), transparent 58%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
    glow.set(1);
  }
  function onEnter() {
    if (!reduce) glow.set(1);
  }
  function onLeave() {
    glow.set(0);
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-24 sm:py-32"
      style={{ backgroundColor: CONTACT_BACKGROUND }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1, ease: EASE, delay: T.panel }}
        className="group/panel relative z-10 w-full max-w-md overflow-hidden rounded-[30px] border border-white/10 px-6 py-8 sm:px-9 sm:py-10"
        style={{
          backgroundImage:
            "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(20px) saturate(135%)",
          WebkitBackdropFilter: "blur(20px) saturate(135%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -16px 36px -24px rgba(6,10,22,0.7), 0 50px 90px -46px rgba(0,0,0,0.85)",
        }}
      >
        {/* ---- lighting layers (barely noticeable) ---- */}
        {!reduce && (
          <>
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: sheen,
                opacity: glowS,
                mixBlendMode: "screen",
              }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: spotlight,
                opacity: glowS,
                mixBlendMode: "soft-light",
              }}
            />
          </>
        )}
        {/* static top rim highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
          }}
        />

        {/* ---------------- content ---------------- */}
        <div className="relative">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.7, ease: EASE, delay: T.heading }}
            className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#A07856]/80"
          >
            Contact
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8, ease: EASE, delay: T.heading + 0.06 }}
            className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#E8EEFF] sm:text-[2.4rem]"
          >
            Let&rsquo;s Build Something Together
          </motion.h2>

          {/* quick contact links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: EASE, delay: T.links }}
            className="mt-7 grid grid-cols-2 gap-2.5"
          >
            {LINKS.map((l) => (
              <QuickLink key={l.key} link={l} />
            ))}
          </motion.div>

          {/* form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8, ease: EASE, delay: T.form }}
            className="mt-6"
          >
            <ContactForm />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Background                                                          */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Quick link                                                         */
/* ------------------------------------------------------------------ */

function QuickLink({ link }: { link: LinkDef }) {
  return (
    <motion.a
      href={link.href}
      {...(link.download ? { download: true } : {})}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={link.onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-[#E8EEFF] backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A07856]/70"
    >
      <span className="text-[#8892A4] transition-colors duration-300 group-hover:text-[#E8EEFF]">
        {link.icon}
      </span>
      <span className="flex-1 font-medium">{link.title}</span>
      <ArrowUpRight
        size={15}
        className="text-[#4A5568] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#A07856]"
      />
    </motion.a>
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
    openEmail(
      `Portfolio message from ${name || "a visitor"}`,
      `${message}\n\n— ${name}\n${email}`,
    );
    setSent(true);
  }

  // Focus glow: a soft ring + halo that eases in when the field is active.
  const field =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#E8EEFF] placeholder:text-[#4A5568] outline-none transition-all duration-300 focus:border-[#A07856]/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-[#A07856]/25 focus:shadow-[0_0_0_4px_rgba(79,142,247,0.10),0_8px_26px_-10px_rgba(79,142,247,0.5)]";

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
          rows={3}
          placeholder="Message"
          className={`${field} resize-none`}
        />
      </label>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.015, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A07856] via-[#C2A67A] to-[#A07856] px-5 py-3 text-sm font-semibold text-[#1A130B] shadow-[0_14px_36px_-12px_rgba(153,121,83,0.7)] transition-shadow duration-300 hover:shadow-[0_18px_46px_-10px_rgba(153,121,83,0.85)]"
      >
        {sent ? "Opening your mail…" : "Send"}
        <Send size={16} />
      </motion.button>
    </form>
  );
}
