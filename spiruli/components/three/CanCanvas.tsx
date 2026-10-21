"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import SpiruliCan, { type Driven } from "./SpiruliCan";
import AlgaeParticles from "./AlgaeParticles";
import CitrusDrops from "./CitrusDrops";
import Studio from "./Studio";

type Props = {
  className?: string;
  driven?: Driven;
  spin?: number;
  particles?: number;
  drops?: boolean;
  cameraZ?: number;
  accent?: string;
  interactive?: boolean;
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

export default function CanCanvas({
  className,
  driven,
  spin,
  particles = 120,
  drops = true,
  cameraZ = 7,
  accent,
  interactive = true,
}: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`fade-edges ${className ?? ""}`}>
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0.35, cameraZ], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ touchAction: "pan-y" }}
      >
        <Suspense fallback={null}>
          <Studio accent={accent} />
          <SpiruliCan driven={driven} spin={spin} interactive={interactive} />
          <AlgaeParticles count={particles} variant="powder" inner={1.0} outer={2.3} />
          {drops && <CitrusDrops />}
          <ContactShadows position={[0, -1.68, 0]} opacity={0.35} scale={5} blur={2.8} far={2.2} color="#000000" />
        </Suspense>
      </Canvas>
    </div>
  );
}
