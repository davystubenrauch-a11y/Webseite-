"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import ReviewCard, { type ScrollState } from "./ReviewCard";
import Particles from "./Particles";
import Studio from "./Studio";

type Props = {
  className?: string;
  scroll?: ScrollState;
  followFlip?: boolean;
  spin?: number;
  particles?: number;
  cameraZ?: number;
};

/** Pauses rendering while scrolled out of view to save GPU time. */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

export default function CardCanvas({ className, scroll, followFlip, spin, particles = 420, cameraZ = 6.2 }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0, cameraZ], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ touchAction: "pan-y" }}
      >
        <Suspense fallback={null}>
          <Studio />
          <ReviewCard scroll={scroll} followFlip={followFlip} spin={spin} />
          <Particles count={particles} />
        </Suspense>
      </Canvas>
    </div>
  );
}
