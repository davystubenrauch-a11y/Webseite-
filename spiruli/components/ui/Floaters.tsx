"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Berries, Bubbles, Leaf, Lemon, Spiral } from "./Illustrations";

const items = [
  { C: Lemon, cls: "left-[4%] top-[18%] w-20 sm:w-28 lg:w-36", depth: 30, rot: -12 },
  { C: Berries, cls: "right-[5%] top-[14%] w-20 sm:w-28 lg:w-32", depth: -24, rot: 10 },
  { C: Spiral, cls: "left-[10%] bottom-[22%] w-24 sm:w-32 lg:w-40", depth: -36, rot: 18 },
  { C: Leaf, cls: "right-[8%] bottom-[24%] w-16 sm:w-24 lg:w-28", depth: 40, rot: -20 },
  { C: Bubbles, cls: "left-[34%] top-[9%] hidden w-16 md:block lg:w-20", depth: 18, rot: 0 },
];

function Item({ C, cls, depth, rot, x, y, i }: (typeof items)[number] & { x: MotionValue<number>; y: MotionValue<number>; i: number }) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return (
    <motion.div className={`absolute ${cls}`} style={{ x: tx, y: ty, rotate: rot }}>
      <motion.div
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.5 + i * 0.1 }}
        className="animate-bob drop-shadow-[4px_6px_0_rgba(18,52,63,0.18)]"
        style={{ animationDelay: `${i * -1.3}s` }}
      >
        <C className="h-auto w-full" />
      </motion.div>
    </motion.div>
  );
}

/** Ingredient illustrations floating around the hero with pointer parallax. */
export default function Floaters() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 18 });
  const y = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {items.map((it, i) => (
        <Item key={i} {...it} x={x} y={y} i={i} />
      ))}
    </div>
  );
}
