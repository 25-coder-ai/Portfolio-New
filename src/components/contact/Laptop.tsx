"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { ContactFormData } from "@/types";
import { Send, CheckCircle } from "lucide-react";
import { profile } from "@/data/profile";

const FIELD_BASE =
  "w-full rounded-lg px-3 py-2 text-sm text-[#E8EEFF] border border-white/[0.08] placeholder:text-[#3F4860] transition-all duration-300 focus:outline-none focus:border-[#4F8EF7]/60 focus:shadow-[0_0_0_3px_rgba(79,142,247,0.16)]";

export function Laptop() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const subject = encodeURIComponent(form.subject || `Portfolio message from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const update = (key: keyof ContactFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="relative mx-auto" style={{ maxWidth: 400 }}>
      {/* Lid / screen */}
      <div
        className="relative rounded-t-2xl border border-white/10"
        style={{ background: "#0C1322", boxShadow: "0 24px 60px -20px rgba(0,0,0,0.7)" }}
      >
        {/* camera */}
        <div className="flex justify-center pt-2" aria-hidden="true">
          <span className="h-1 w-1 rounded-full bg-white/20" />
        </div>

        <div className="px-3 pb-3 pt-2">
          {/* Screen */}
          <div
            className="relative overflow-hidden rounded-xl p-5"
            style={{
              background: "linear-gradient(180deg, #101B30 0%, #0E1729 100%)",
              minHeight: 332,
              boxShadow: "inset 0 0 50px rgba(79,142,247,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* screen glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(79,142,247,0.1) 0%, transparent 70%)" }}
            />
            {/* glass reflection sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.06) 0%, transparent 28%)" }}
            />

            {/* window chrome */}
            <div className="relative mb-4 flex items-center gap-1.5" aria-hidden="true">
              <div className="h-2 w-2 rounded-full bg-[#F87171]/50" />
              <div className="h-2 w-2 rounded-full bg-[#F59E0B]/50" />
              <div className="h-2 w-2 rounded-full bg-[#34D399]/50" />
              <div className="ml-2 flex h-4 flex-1 items-center justify-center rounded bg-white/[0.04]">
                <span className="font-mono-custom text-[8px] text-[#4A5568]">new-message</span>
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-56 flex-col items-center justify-center gap-3 text-center"
              >
                <CheckCircle className="text-[#34D399]" size={40} />
                <p className="font-semibold text-[#E8EEFF]">Message ready to send</p>
                <p className="text-xs text-[#4A5568]">Opening your mail client…</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Name">
                    <input
                      type="text"
                      value={form.name}
                      onChange={update("name")}
                      required
                      className={FIELD_BASE}
                      style={{ background: "rgba(255,255,255,0.04)" }}
                      placeholder="Your name"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      required
                      className={FIELD_BASE}
                      style={{ background: "rgba(255,255,255,0.04)" }}
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>
                <Field label="Subject">
                  <input
                    type="text"
                    value={form.subject}
                    onChange={update("subject")}
                    className={FIELD_BASE}
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    placeholder="What's this about?"
                  />
                </Field>
                <Field label="Message">
                  <textarea
                    value={form.message}
                    onChange={update("message")}
                    required
                    rows={3}
                    className={`${FIELD_BASE} resize-none`}
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    placeholder="Let's build something together…"
                  />
                </Field>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={loading ? undefined : { scale: 1.015 }}
                  whileTap={loading ? undefined : { scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #4F8EF7 0%, #6BA2FF 100%)",
                    boxShadow: "0 6px 22px -6px rgba(79,142,247,0.55)",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                  ) : (
                    <>
                      <Send size={13} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Hinge + deck */}
      <div
        className="relative mx-auto h-3 rounded-b-xl"
        style={{ width: "104%", marginLeft: "-2%", background: "linear-gradient(180deg, #1A2540, #0D1526)", boxShadow: "0 14px 30px -10px rgba(0,0,0,0.7)" }}
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 h-1 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.07]" />
      </div>

      {/* desk reflection */}
      <div
        className="pointer-events-none absolute -bottom-5 left-1/2 h-5 w-3/4 -translate-x-1/2 rounded-[50%] blur-xl"
        style={{ background: "rgba(79,142,247,0.12)" }}
        aria-hidden="true"
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono-custom text-[10px] uppercase tracking-widest text-[#4A5568]">
        {label}
      </span>
      {children}
    </label>
  );
}
