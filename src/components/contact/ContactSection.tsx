"use client";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Download, Send } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { CONTACT_BACKGROUND } from "@/lib/constants";
import { profile } from "@/data/profile";

const EASE = [0.16, 1, 0.3, 1] as const;

// Entrance choreography (~2s total): background → desk → lamp → screen →
// resume → card → mug. Each object reveals on its own soft delay.
const T = {
  desk: 0.2,
  lamp: 0.7,
  screen: 0.95,
  resume: 1.2,
  card: 1.4,
  mug: 1.6,
} as const;

// ===========================================================================
export function ContactSection() {
  const { ref, inView } = useScrollAnimation({ threshold: 0.2 });
  const reduce = useReducedMotion();

  // Very small cursor parallax (max ~3°).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [3, -3]), { stiffness: 120, damping: 22 });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-3, 3]), { stiffness: 120, damping: 22 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
      id="contact"
      ref={ref}
      style={{ background: CONTACT_BACKGROUND }}
      className="relative min-h-screen w-full overflow-hidden py-24 md:py-28"
    >
      <BackgroundFX inView={inView} />

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-4xl font-bold tracking-tight text-[#E8EEFF] sm:text-5xl"
        >
          Let&apos;s Build Something Together
        </motion.h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="mx-auto mt-4 max-w-xl text-base text-[#8892A4] sm:text-lg"
        >
          Every great project starts with a conversation.
        </motion.p>
      </div>

      {/* ---- Desktop / tablet: the floating workstation ---- */}
      <div
        className="relative z-10 mt-6 hidden md:block"
        style={{ perspective: 1600 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <motion.div
          style={{
            rotateX: reduce ? 0 : rotX,
            rotateY: reduce ? 0 : rotY,
            transformStyle: "preserve-3d",
          }}
          className="mx-auto w-full max-w-[980px] origin-center scale-[0.82] lg:scale-100"
        >
          <IdleFloat reduce={reduce}>
            <Workstation inView={inView} reduce={reduce} />
          </IdleFloat>
        </motion.div>
      </div>

      {/* ---- Mobile: clean vertical composition, laptop/form first ---- */}
      <MobileWorkstation inView={inView} reduce={reduce} />
    </section>
  );
}

// ===========================================================================
// Background: vignette + soft warm radial glow behind the desk + faint dust.
// ===========================================================================
function BackgroundFX({ inView }: { inView: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* soft radial light behind the workstation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1.4, ease: EASE }}
        className="absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(79,142,247,0.10), rgba(255,196,128,0.05) 45%, transparent 72%)",
        }}
      />
      {/* faint static dust */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.18), transparent), radial-gradient(1px 1px at 70% 20%, rgba(255,255,255,0.12), transparent), radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.10), transparent), radial-gradient(1px 1px at 85% 65%, rgba(255,255,255,0.12), transparent), radial-gradient(1px 1px at 60% 85%, rgba(255,255,255,0.08), transparent)",
        }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 42%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}

// ===========================================================================
// Almost-imperceptible idle float wrapper.
// ===========================================================================
function IdleFloat({ reduce, children }: { reduce: boolean; children: ReactNode }) {
  return (
    <motion.div
      style={{ transformStyle: "preserve-3d" }}
      animate={reduce ? undefined : { y: [0, -7, 0] }}
      transition={reduce ? undefined : { duration: 9, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
}

// ===========================================================================
// The workstation stage (desk + objects), grounded with soft contact shadows.
// ===========================================================================
function Workstation({ inView, reduce }: { inView: boolean; reduce: boolean }) {
  return (
    <div className="relative mx-auto h-[560px] w-[960px]">
      {/* -- Desk -- */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.0, ease: EASE, delay: T.desk }}
        className="absolute bottom-[40px] left-1/2 -translate-x-1/2"
        style={{ transformStyle: "preserve-3d" }}
      >
        <Desk />
      </motion.div>

      {/* warm light pool cast by the lamp (turns on with the lamp) */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: EASE, delay: T.lamp }}
        className="pointer-events-none absolute left-[210px] top-[150px] h-[420px] w-[620px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,206,140,0.22), rgba(255,196,128,0.06) 55%, transparent 75%)",
          filter: "blur(6px)",
        }}
      />

      {/* -- Lamp (back-left) -- */}
      <RevealObject inView={inView} reduce={reduce} delay={T.lamp} className="absolute bottom-[150px] left-[70px]">
        <DeskLamp inView={inView} />
      </RevealObject>

      {/* -- Resume (left) -- */}
      <RevealObject inView={inView} reduce={reduce} delay={T.resume} className="absolute bottom-[92px] left-[150px]">
        <Resume />
      </RevealObject>

      {/* -- Coffee mug (back-right) -- */}
      <RevealObject inView={inView} reduce={reduce} delay={T.mug} className="absolute bottom-[172px] right-[96px]">
        <CoffeeMug reduce={reduce} />
      </RevealObject>

      {/* -- Business card (right) -- */}
      <RevealObject inView={inView} reduce={reduce} delay={T.card} className="absolute bottom-[104px] right-[120px]">
        <BusinessCard />
      </RevealObject>

      {/* -- Laptop (centre, focal point) -- */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 26 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE, delay: T.screen }}
        className="absolute bottom-[96px] left-1/2 z-20 -translate-x-1/2"
      >
        <Laptop inView={inView} />
      </motion.div>
    </div>
  );
}

// Small helper: fade/slide an object in on its delay.
function RevealObject({
  inView,
  reduce,
  delay,
  className,
  children,
}: {
  inView: boolean;
  reduce: boolean;
  delay: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Desk — walnut slab with a visible top surface, thickness and floating shadow.
// ---------------------------------------------------------------------------
function Desk() {
  return (
    <div className="relative" style={{ transformStyle: "preserve-3d" }}>
      {/* floating cast shadow */}
      <div className="absolute left-1/2 top-[150px] h-24 w-[760px] -translate-x-1/2 rounded-[50%] bg-black/55 blur-3xl" />
      {/* tilted top surface */}
      <div
        className="relative h-[210px] w-[820px] rounded-[30px]"
        style={{
          transform: "perspective(1200px) rotateX(42deg)",
          transformOrigin: "center bottom",
          background:
            "linear-gradient(160deg, #6b452c 0%, #59381f 38%, #472c18 72%, #3a2314 100%)",
          boxShadow:
            "inset 0 2px 6px rgba(255,210,170,0.14), inset 0 -30px 60px rgba(0,0,0,0.4), 0 26px 40px rgba(0,0,0,0.45)",
        }}
      >
        {/* wood grain */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[30px] opacity-[0.5] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(93deg, rgba(0,0,0,0.10) 0px, rgba(0,0,0,0) 3px, rgba(255,220,180,0.05) 6px, rgba(0,0,0,0) 11px)",
          }}
        />
        {/* warm top highlight near the lamp */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[30px]"
          style={{
            background:
              "radial-gradient(60% 70% at 32% 20%, rgba(255,208,150,0.22), transparent 70%)",
          }}
        />
      </div>
      {/* front edge (thickness) */}
      <div
        className="absolute left-1/2 top-[150px] h-[26px] w-[724px] -translate-x-1/2 rounded-b-[22px]"
        style={{
          background: "linear-gradient(#3a2314, #2c1a0f)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Laptop — already open, screen displays the live contact form.
// ---------------------------------------------------------------------------
function Laptop({ inView }: { inView: boolean }) {
  return (
    <div className="relative" style={{ width: 460 }}>
      {/* keyboard base — trapezoid receding onto the desk */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[292px] h-[54px] w-[520px] -translate-x-1/2"
        style={{
          clipPath: "polygon(9% 0, 91% 0, 100% 100%, 0% 100%)",
          background: "linear-gradient(#c7ccd8, #a3a9b8 55%, #8b91a1)",
          boxShadow: "0 16px 24px rgba(0,0,0,0.45)",
        }}
      >
        {/* key area */}
        <div
          className="absolute left-1/2 top-[8px] h-[24px] w-[74%] -translate-x-1/2 rounded-[3px]"
          style={{
            background:
              "repeating-linear-gradient(90deg, #4a4f5e 0 6px, #3b4050 6px 8px), repeating-linear-gradient(#4a4f5e 0 5px, #3b4050 5px 7px)",
            backgroundBlendMode: "multiply",
            opacity: 0.9,
          }}
        />
        {/* trackpad */}
        <div className="absolute bottom-[5px] left-1/2 h-[9px] w-[120px] -translate-x-1/2 rounded-[3px] bg-[#9aa1b1]" />
      </div>

      {/* screen */}
      <div
        className="relative overflow-hidden rounded-[18px] p-[10px]"
        style={{
          background: "linear-gradient(#20242e, #171a22)",
          boxShadow:
            "0 30px 60px rgba(0,0,0,0.55), 0 2px 0 rgba(255,255,255,0.06) inset",
        }}
      >
        <div
          className="relative overflow-hidden rounded-[11px] px-6 py-5"
          style={{
            background: "linear-gradient(160deg, #0f1a30 0%, #0b1120 100%)",
          }}
        >
          {/* soft screen glow / reflection */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 1.0, ease: EASE, delay: T.screen }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 55% at 30% 0%, rgba(79,142,247,0.18), transparent 60%), linear-gradient(120deg, rgba(255,255,255,0.06) 0%, transparent 32%)",
            }}
          />
          <div className="relative">
            <h3 className="text-lg font-semibold text-[#E8EEFF]">
              Let&apos;s Build Something Together
            </h3>
            <p className="mt-1.5 text-[12px] leading-relaxed text-[#8892A4]">
              Whether it&apos;s software, AI, data or your next big idea, I&apos;d love to hear from you.
            </p>
            <div className="mt-4">
              <ContactForm compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The contact form — premium, accessible, works on-screen and on mobile.
// ---------------------------------------------------------------------------
function ContactForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get("name") ?? "");
    const email = String(d.get("email") ?? "");
    const message = String(d.get("message") ?? "");
    const subject = encodeURIComponent(`Portfolio message from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}${email ? ` · ${email}` : ""}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const pad = compact ? "px-3 py-2 text-[12px]" : "px-4 py-2.5 text-sm";
  const field =
    `w-full rounded-xl border border-white/10 bg-white/[0.04] text-[#E8EEFF] outline-none ` +
    `transition-all duration-200 placeholder:text-[#4A5568] ` +
    `focus:border-[#4F8EF7]/70 focus:bg-white/[0.07] focus:ring-2 focus:ring-[#4F8EF7]/25 ${pad}`;

  return (
    <form onSubmit={submit} className={compact ? "grid gap-2.5" : "grid gap-3.5"}>
      <div className="grid grid-cols-2 gap-2.5">
        <label className="block">
          <span className="sr-only">Name</span>
          <input ref={firstRef} name="name" required autoComplete="name" placeholder="Name" className={field} />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          required
          placeholder="Message"
          rows={compact ? 2 : 3}
          className={`${field} resize-none`}
        />
      </label>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: EASE }}
        className={`mt-0.5 inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-white ${compact ? "py-2 text-[12px]" : "py-3 text-sm"}`}
        style={{
          background: "linear-gradient(135deg, #4F8EF7, #A78BFA)",
          boxShadow: "0 8px 22px rgba(79,142,247,0.35)",
        }}
      >
        {sent ? "Opening your mail…" : "Send Message"}
        <Send size={compact ? 12 : 15} />
      </motion.button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Resume — a real printed sheet; lifts + corner-curls on hover, downloads on click.
// ---------------------------------------------------------------------------
function Resume() {
  return (
    <a
      href={profile.resumeUrl}
      download
      aria-label="Download résumé (PDF)"
      className="group relative block outline-none"
    >
      {/* contact shadow */}
      <div className="absolute -bottom-3 left-1/2 h-5 w-[78%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-md transition-all duration-300 group-hover:h-6 group-hover:w-[86%] group-hover:bg-black/55" />
      <div
        className="relative h-[188px] w-[150px] -rotate-6 rounded-[6px] bg-[#FBFAF5] p-4 transition-transform duration-300 will-change-transform group-hover:-translate-y-2 group-hover:-rotate-3 group-focus-visible:-translate-y-2"
        style={{ boxShadow: "0 10px 22px rgba(0,0,0,0.4)" }}
      >
        <p className="text-[15px] font-bold text-[#1E2636]">Resume</p>
        <div className="mt-1 h-[3px] w-16 rounded bg-[#1E2636]/25" />
        <div className="mt-3 space-y-[6px]">
          {[92, 74, 84, 66, 80, 60, 88].map((w, i) => (
            <div key={i} className="h-[4px] rounded bg-[#1E2636]/14" style={{ width: `${w}%` }} />
          ))}
        </div>
        {/* curling corner */}
        <div
          aria-hidden
          className="absolute bottom-0 right-0 h-5 w-5 origin-bottom-right rounded-tl-[8px] transition-all duration-300 group-hover:h-8 group-hover:w-8"
          style={{
            background: "linear-gradient(135deg, transparent 46%, rgba(0,0,0,0.12) 50%, #eceae1 54%)",
            boxShadow: "-3px -3px 6px rgba(0,0,0,0.12)",
          }}
        />
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Business card — front always visible; lift + tilt + reflection sweep; flips.
// ---------------------------------------------------------------------------
function BusinessCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-label={flipped ? "Business card — show front" : "Business card — show back"}
      className="group relative block outline-none"
      style={{ perspective: 900 }}
    >
      <div className="absolute -bottom-3 left-1/2 h-4 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-md transition-all duration-300 group-hover:h-5 group-hover:bg-black/55" />
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        whileHover={{ y: -6, rotateZ: -2 }}
        className="relative h-[132px] w-[222px] rounded-xl transition-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* front */}
        <div
          className="absolute inset-0 overflow-hidden rounded-xl p-4 text-left [backface-visibility:hidden]"
          style={{
            background: "linear-gradient(155deg, #FDFEFF, #E7ECF7)",
            boxShadow: "0 12px 26px rgba(0,0,0,0.4)",
          }}
        >
          <span className="absolute left-0 top-0 h-full w-[6px] bg-gradient-to-b from-[#4F8EF7] to-[#A78BFA]" />
          {/* reflection sweep */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-[130%] rotate-[8deg] transition-transform duration-700 group-hover:translate-x-[130%]"
            style={{ background: "linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)" }}
          />
          <p className="pl-2 text-[15px] font-bold text-[#16203a]">{profile.name}</p>
          <p className="pl-2 text-[10px] text-[#5b6479]">{profile.subtitle}</p>
          <p className="mt-2 pl-2 text-[11px] text-[#2f6fe0]">{profile.email}</p>
          <div className="mt-2 flex items-center gap-3 pl-2 text-[#16203a]">
            <span className="inline-flex items-center gap-1 text-[10px]">
              <GithubIcon size={12} /> GitHub
            </span>
            <span className="inline-flex items-center gap-1 text-[10px]">
              <LinkedinIcon size={12} /> LinkedIn
            </span>
          </div>
        </div>
        {/* back */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl p-4 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ background: "linear-gradient(135deg, #4F8EF7, #A78BFA)", boxShadow: "0 12px 26px rgba(0,0,0,0.4)" }}
        >
          <p className="font-serif text-sm font-semibold italic text-white">
            Let&apos;s Build Something Together
          </p>
        </div>
      </motion.div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Coffee mug — environmental; tiny steam on hover.
// ---------------------------------------------------------------------------
function CoffeeMug({ reduce }: { reduce: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="absolute -bottom-3 left-1/2 h-3.5 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-md" />

      {/* steam */}
      {hover && !reduce && (
        <div aria-hidden className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute block h-6 w-[6px] rounded-full bg-white/40 blur-[3px]"
              style={{ left: (i - 1) * 10 }}
              initial={{ opacity: 0, y: 6, scaleY: 0.6 }}
              animate={{ opacity: [0, 0.6, 0], y: -22, scaleY: 1.4 }}
              transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </div>
      )}

      {/* mug body */}
      <div className="relative flex h-[62px] w-[70px] items-start justify-center">
        <div
          className="relative h-[62px] w-[62px] rounded-b-[14px] rounded-t-[6px]"
          style={{ background: "linear-gradient(#ffffff, #dfe4ee)", boxShadow: "0 10px 18px rgba(0,0,0,0.35)" }}
        >
          {/* coffee top */}
          <div className="absolute left-1/2 top-[6px] h-[10px] w-[46px] -translate-x-1/2 rounded-[50%] bg-[#3a2415]" />
        </div>
        {/* handle */}
        <div className="absolute right-[2px] top-[20px] h-[26px] w-[20px] rounded-r-full border-[5px] border-l-0 border-[#e4e9f2]" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desk lamp — modern arm lamp; warm head glow turns on with the entrance.
// ---------------------------------------------------------------------------
function DeskLamp({ inView }: { inView: boolean }) {
  return (
    <div className="relative h-[220px] w-[150px]">
      {/* warm head glow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1.0, ease: EASE, delay: T.lamp }}
        className="absolute left-[70px] top-[8px] h-[150px] w-[150px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,206,140,0.5), transparent 70%)", filter: "blur(4px)" }}
      />
      {/* base */}
      <div className="absolute bottom-0 left-[10px] h-[10px] w-[80px] rounded-[50%] bg-gradient-to-b from-[#34456b] to-[#20304f]" />
      {/* lower arm */}
      <div className="absolute bottom-[8px] left-[46px] h-[120px] w-[7px] origin-bottom -rotate-[16deg] rounded bg-[#33456b]" />
      {/* upper arm */}
      <div className="absolute bottom-[118px] left-[24px] h-[74px] w-[7px] origin-bottom rotate-[52deg] rounded bg-[#33456b]" />
      {/* head */}
      <div
        className="absolute left-[74px] top-[6px] h-[30px] w-[46px] rotate-[38deg] rounded-b-[22px] rounded-t-[8px]"
        style={{ background: "linear-gradient(#3a4d76, #24344f)" }}
      >
        <div className="absolute bottom-[3px] left-1/2 h-[7px] w-[26px] -translate-x-1/2 rounded-full bg-[#ffe6b8]" />
      </div>
    </div>
  );
}

// ===========================================================================
// Mobile — clean vertical composition; the form (laptop) stays primary.
// ===========================================================================
function MobileWorkstation({ inView, reduce }: { inView: boolean; reduce: boolean }) {
  return (
    <div className="relative z-10 mx-auto mt-10 flex max-w-md flex-col gap-5 px-6 md:hidden">
      {/* laptop / form card */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        className="rounded-2xl border border-white/10 p-5"
        style={{ background: "linear-gradient(160deg,#141f38,#0f1830)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
      >
        <h3 className="text-lg font-semibold text-[#E8EEFF]">Let&apos;s Build Something Together</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#8892A4]">
          Whether it&apos;s software, AI, data or your next big idea, I&apos;d love to hear from you.
        </p>
        <div className="mt-4">
          <ContactForm />
        </div>
      </motion.div>

      {/* quick links: résumé + card info */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <p className="text-sm font-semibold text-[#E8EEFF]">{profile.name}</p>
        <p className="text-[12px] text-[#8892A4]">{profile.subtitle}</p>
        <p className="mt-1 text-[12px] text-[#4F8EF7]">{profile.email}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#8892A4]">
          <a href={profile.resumeUrl} download className="inline-flex items-center gap-2 hover:text-[#E8EEFF]">
            <Download size={14} /> Résumé
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[#E8EEFF]">
            <GithubIcon size={14} /> GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[#E8EEFF]">
            <LinkedinIcon size={14} /> LinkedIn
          </a>
        </div>
      </motion.div>
    </div>
  );
}
