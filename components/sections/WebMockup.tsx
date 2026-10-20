"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

const themes = [
  { id: "aurum", label: "Aurum", accent: "#D4AF37", bg: "#121925", text: "#F5F2EA", name: "Maison Aurum", line: "Fine dining, reimagined." },
  { id: "azure", label: "Azure", accent: "#2563EB", bg: "#F4F6FB", text: "#0F141C", name: "Azure Dental", line: "Smiles, engineered." },
  { id: "noir", label: "Noir", accent: "#E5E7EB", bg: "#0A0A0A", text: "#FFFFFF", name: "Noir Studio", line: "Architecture of calm." },
];

const scores = [
  { label: "Performance", value: 99 },
  { label: "Accessibility", value: 100 },
  { label: "Best Practices", value: 100 },
  { label: "SEO", value: 100 },
];

function Ring({ value, label, accent }: { value: number; label: string; accent: string }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
        <motion.circle
          cx="24"
          cy="24"
          r={r}
          stroke={accent}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="text-[10px] font-semibold text-white">{value}</span>
      <span className="text-[9px] uppercase tracking-wider text-white/40">{label}</span>
    </div>
  );
}

/** Interactive browser mockup: tilt with the pointer, switch device + brand theme. */
export default function WebMockup() {
  const [theme, setTheme] = useState(themes[0]);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [clicks, setClicks] = useState(0);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 150, damping: 18 });

  const dark = theme.bg !== "#F4F6FB";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full border border-white/10 bg-navy-900/60 p-1">
          {(["desktop", "mobile"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`relative rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${device === d ? "text-navy-900" : "text-white/60"}`}
            >
              {device === d && <motion.span layoutId="device" className="absolute inset-0 rounded-full bg-gold-metal" />}
              <span className="relative">{d}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t)}
              aria-label={`${t.label} theme`}
              className={`h-7 w-7 rounded-full border-2 transition ${theme.id === t.id ? "scale-110 border-gold" : "border-white/20"}`}
              style={{ background: `linear-gradient(135deg, ${t.bg} 50%, ${t.accent} 50%)` }}
            />
          ))}
        </div>
      </div>

      <div
        className="grid place-items-center [perspective:1400px]"
        onPointerMove={(e) => {
          const b = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - b.left) / b.width - 0.5);
          my.set((e.clientY - b.top) / b.height - 0.5);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        <motion.div
          layout
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          transition={{ layout: { type: "spring", stiffness: 200, damping: 26 } }}
          className={`relative overflow-hidden border border-white/15 bg-navy-900 shadow-[0_40px_120px_-30px_rgba(37,99,235,0.45)] ${
            device === "desktop" ? "w-full rounded-2xl" : "w-[260px] rounded-[2.2rem] border-[6px] border-navy-600"
          }`}
        >
          {device === "desktop" && (
            <div className="flex items-center gap-2 border-b border-white/10 bg-navy-800 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-3 flex-1 truncate rounded-md bg-white/5 px-3 py-1 text-[11px] text-white/40">
                {theme.name.toLowerCase().replace(/\s/g, "")}.com
              </span>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={theme.id + device}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45 }}
              className={`relative ${device === "desktop" ? "h-[340px] p-6 sm:p-8" : "h-[460px] p-5"}`}
              style={{ background: theme.bg, color: theme.text }}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-serif text-base font-semibold italic">{theme.name}</span>
                {device === "desktop" ? (
                  <span className="flex gap-4 opacity-60">
                    <span>About</span>
                    <span>Menu</span>
                    <span>Reviews</span>
                  </span>
                ) : (
                  <span className="h-3 w-4 border-y-2 opacity-60" style={{ borderColor: theme.text }} />
                )}
              </div>
              <div className={device === "desktop" ? "mt-10 grid grid-cols-[1.3fr_1fr] gap-6" : "mt-8"}>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-50">Since 2014</p>
                  <h4 className={`mt-2 font-serif font-semibold leading-tight ${device === "desktop" ? "text-3xl" : "text-2xl"}`}>{theme.line}</h4>
                  <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: theme.accent }}>
                    ★★★★★ <span className="ml-1 opacity-70" style={{ color: theme.text }}>4.9 · 1,284 reviews</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setClicks((c) => c + 1)}
                    className="mt-5 rounded-full px-5 py-2 text-xs font-semibold"
                    style={{ background: theme.accent, color: dark ? "#0F141C" : "#fff" }}
                  >
                    Reserve now
                  </motion.button>
                  <AnimatePresence>
                    {clicks > 0 && (
                      <motion.span
                        key={clicks}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="ml-3 text-[11px] opacity-70"
                      >
                        +1 booking · {clicks} today
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className={`grid grid-cols-2 gap-2 ${device === "mobile" ? "mt-6" : ""}`}>
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="aspect-square rounded-xl"
                      style={{
                        background: `linear-gradient(${135 + i * 40}deg, ${theme.accent}${i % 2 ? "55" : "99"}, ${dark ? "#ffffff10" : "#0F141C10"})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2 rounded-2xl border border-white/10 bg-navy-900/50 p-4">
        {scores.map((s) => (
          <Ring key={s.label} value={s.value} label={s.label} accent="#D4AF37" />
        ))}
      </div>
    </div>
  );
}
