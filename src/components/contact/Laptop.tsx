"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { ContactFormData } from "@/types";
import { Send, CheckCircle } from "lucide-react";
import { profile } from "@/data/profile";

export function Laptop() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mailto fallback — opens default mail client
    const subject = encodeURIComponent(`Portfolio Message from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="relative mx-auto" style={{ maxWidth: 380 }}>
      {/* Laptop base */}
      <div
        className="relative rounded-2xl border border-white/10 overflow-hidden"
        style={{
          background: "#1A2540",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Screen bezel */}
        <div
          className="relative p-3 rounded-t-2xl"
          style={{ background: "#0D1526" }}
        >
          {/* Screen */}
          <div
            className="relative rounded-xl overflow-hidden p-5"
            style={{
              background: "#111B2F",
              minHeight: 300,
              boxShadow: "inset 0 0 40px rgba(79,142,247,0.06)",
            }}
          >
            {/* Screen glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,142,247,0.08) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />

            {/* Screen status bar */}
            <div className="flex items-center gap-1.5 mb-4" aria-hidden="true">
              <div className="w-2 h-2 rounded-full bg-[#F87171]/60" />
              <div className="w-2 h-2 rounded-full bg-[#F59E0B]/60" />
              <div className="w-2 h-2 rounded-full bg-[#34D399]/60" />
              <div className="ml-2 flex-1 h-4 rounded bg-white/[0.04] flex items-center justify-center">
                <span className="text-[8px] text-[#4A5568] font-mono-custom">message.send</span>
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-48 text-center gap-3"
              >
                <CheckCircle className="text-[#34D399]" size={40} />
                <p className="text-[#E8EEFF] font-semibold">Message sent!</p>
                <p className="text-[#4A5568] text-xs">Opening your mail client…</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
                <div>
                  <label className="text-[#4A5568] text-[10px] font-mono-custom uppercase tracking-widest block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg text-sm text-[#E8EEFF] border border-white/[0.08] focus:border-[#4F8EF7]/50 focus:outline-none transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-[#4A5568] text-[10px] font-mono-custom uppercase tracking-widest block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg text-sm text-[#E8EEFF] border border-white/[0.08] focus:border-[#4F8EF7]/50 focus:outline-none transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-[#4A5568] text-[10px] font-mono-custom uppercase tracking-widest block mb-1">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg text-sm text-[#E8EEFF] border border-white/[0.08] focus:border-[#4F8EF7]/50 focus:outline-none transition-colors resize-none"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    placeholder="Let's build something together…"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "#4F8EF7",
                    boxShadow: "0 4px 20px rgba(79,142,247,0.3)",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Send size={13} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Laptop keyboard base */}
        <div
          className="h-6 flex items-center justify-center"
          style={{ background: "#1A2540" }}
          aria-hidden="true"
        >
          <div className="w-16 h-1 rounded-full bg-white/[0.06]" />
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-xl pointer-events-none"
        style={{ background: "rgba(79,142,247,0.12)" }}
        aria-hidden="true"
      />
    </div>
  );
}
