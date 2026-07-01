"use client";
import { Suspense, lazy, useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { CONTACT_BACKGROUND } from "@/lib/constants";
import { profile } from "@/data/profile";

const WorkbenchScene = lazy(() => import("./WorkbenchScene"));
const EASE = [0.16, 1, 0.3, 1] as const;

export function ContactSection() {
  const { ref, inView } = useScrollAnimation();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  // Close the contact dialog on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section
      id="contact"
      ref={ref}
      style={{ background: CONTACT_BACKGROUND }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20"
    >
      {/* very soft warm vignette behind the desk */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 44% at 50% 50%, rgba(255,196,128,0.06), transparent 70%), radial-gradient(120% 100% at 50% 40%, transparent 58%, rgba(0,0,0,0.4))",
        }}
      />

      <h2 className="sr-only">Contact — welcome to my workspace</h2>

      {/* The 3D workbench (or a calm static workspace for reduced motion) */}
      <div className="relative h-[80vh] min-h-[540px] w-full max-w-[1320px]">
        {reduce ? (
          <StaticWorkspace />
        ) : inView ? (
          <Suspense fallback={<SceneFallback />}>
            <WorkbenchScene reduce={reduce} onOpen={() => setOpen(true)} />
          </Suspense>
        ) : (
          <SceneFallback />
        )}
      </div>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
        className="mt-2 text-center text-sm text-[#8892A4]"
      >
        Welcome to my workspace — click the laptop screen to start a conversation.
      </motion.p>

      {/* Accessible row of direct actions (always real, focusable links) */}
      <motion.nav
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
        aria-label="Direct contact links"
        className="mt-7 flex flex-wrap items-center justify-center gap-x-9 gap-y-3"
      >
        <UnderlineLink href={profile.resumeUrl} download>
          <Download size={14} /> Résumé
        </UnderlineLink>
        <UnderlineLink href={profile.github} external>
          <GithubIcon size={14} /> GitHub
        </UnderlineLink>
        <UnderlineLink href={profile.linkedin} external>
          <LinkedinIcon size={14} /> LinkedIn
        </UnderlineLink>
        <UnderlineLink href={`mailto:${profile.email}`}>Email</UnderlineLink>
      </motion.nav>

      <AnimatePresence>
        {open && <ContactDialog onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Accessible pop-up contact form, opened by clicking the laptop screen.
// ---------------------------------------------------------------------------
function ContactDialog({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Start a conversation"
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 p-7 shadow-2xl"
        style={{ background: "#1A2540" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-[#8892A4] transition-colors hover:text-[#E8EEFF] focus-visible:text-[#E8EEFF]"
        >
          <X size={18} />
        </button>
        <h3 className="font-display text-2xl font-bold text-[#E8EEFF]">
          Let&apos;s Build Something Together
        </h3>
        <p className="mt-2 text-sm text-[#8892A4]">Drop a note — I read every message.</p>
        <div className="mt-6">
          <ContactForm autoFocus onDone={onClose} />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-24 w-40 animate-pulse rounded-2xl bg-white/[0.04]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reduced-motion / no-WebGL path — a calm, fully accessible workspace card.
// ---------------------------------------------------------------------------
function StaticWorkspace() {
  return (
    <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center text-center">
      <h3 className="font-display text-3xl font-bold text-[#E8EEFF] md:text-4xl">
        Let&apos;s Build Something Together
      </h3>
      <p className="mt-3 text-[#8892A4]">
        Always exploring. Always learning. Always building.
      </p>
      <div className="mt-8 w-full">
        <ContactForm />
      </div>
    </div>
  );
}

function ContactForm({ autoFocus = false, onDone }: { autoFocus?: boolean; onDone?: () => void } = {}) {
  const firstRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus) firstRef.current?.focus();
  }, [autoFocus]);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get("name") ?? "");
    const email = String(d.get("email") ?? "");
    const message = String(d.get("message") ?? "");
    const subject = encodeURIComponent(`Portfolio message from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}${email ? ` · ${email}` : ""}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    onDone?.();
  };
  const field =
    "w-full rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2 text-sm text-[#E8EEFF] outline-none transition-colors placeholder:text-[#4A5568] focus:border-[#4F8EF7] focus:bg-white/[0.07]";
  return (
    <form onSubmit={submit} className="mx-auto grid max-w-md gap-3 text-left">
      <label className="block">
        <span className="sr-only">Name</span>
        <input ref={firstRef} name="name" required placeholder="Name" className={field} />
      </label>
      <label className="block">
        <span className="sr-only">Email</span>
        <input name="email" type="email" required placeholder="Email" className={field} />
      </label>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea name="message" required placeholder="Message" rows={3} className={`${field} resize-none`} />
      </label>
      <button
        type="submit"
        className="mt-1 rounded-lg py-2.5 text-sm font-semibold text-white"
        style={{ background: "linear-gradient(135deg,#4F8EF7,#A78BFA)" }}
      >
        Send Message
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
function UnderlineLink({
  href,
  children,
  external,
  download,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: true } : {})}
      className="group relative inline-flex items-center gap-2 py-1 text-sm text-[#8892A4] transition-colors duration-300 hover:text-[#E8EEFF] focus-visible:text-[#E8EEFF]"
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#4F8EF7] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </a>
  );
}
