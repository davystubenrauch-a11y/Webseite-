"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { rooms } from "@/components/three/Walkthrough";

const Walkthrough = dynamic(() => import("@/components/three/Walkthrough"), { ssr: false });

/** Cinematic 3D walkthrough preview with hotspot nodes and an auto-tour mode. */
export default function AirbnbPreview() {
  const [roomId, setRoomId] = useState("overview");
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  const [time, setTime] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { rootMargin: "150px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;
    const id = setInterval(() => {
      setRoomId((cur) => {
        const i = rooms.findIndex((r) => r.id === cur);
        return rooms[(i + 1) % rooms.length].id;
      });
    }, 4200);
    const tick = setInterval(() => setTime((t) => t + 1), 1000);
    return () => {
      clearInterval(id);
      clearInterval(tick);
    };
  }, [playing, inView]);

  const select = (id: string) => {
    setRoomId(id);
    setPlaying(false);
  };

  const room = rooms.find((r) => r.id === roomId)!;
  const tc = `00:${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`;

  return (
    <div>
      <div ref={box} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-navy-900 sm:aspect-[16/10]">
        {seen && <Walkthrough roomId={roomId} onSelect={select} active={inView} />}

        {/* Cinematic letterbox + HUD */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 bg-black"
          animate={{ height: playing ? "9%" : "0%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-black"
          animate={{ height: playing ? "9%" : "0%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
          <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-red-500" : "bg-white/40"}`} />
          {playing ? `REC ${tc}` : "3D Preview"}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-none absolute bottom-5 left-5"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold">Villa Solenne · Lisbon</p>
            <p className="font-serif text-2xl font-semibold text-white drop-shadow">{room.label}</p>
          </motion.div>
        </AnimatePresence>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="absolute bottom-5 right-5 grid h-14 w-14 place-items-center rounded-full border border-gold/60 bg-navy-900/60 text-gold shadow-rim backdrop-blur transition hover:scale-105"
          aria-label={playing ? "Pause tour" : "Play cinematic tour"}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <rect x="3" y="2" width="3.5" height="12" rx="1" />
              <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M4 2.5v11l9-5.5z" />
            </svg>
          )}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {rooms.map((r) => (
          <button
            key={r.id}
            onClick={() => select(r.id)}
            className={`rounded-full border px-4 py-2 text-xs transition ${
              r.id === roomId ? "border-gold bg-gold/15 text-white" : "border-white/10 text-white/60 hover:border-white/30"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
