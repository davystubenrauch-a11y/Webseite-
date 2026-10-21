"use client";

import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import NfcProduct, { type ProductLook } from "./NfcProduct";
import Studio from "./Studio";
import { useInView } from "./useInView";
import { useConfig } from "@/lib/configStore";

type Props = {
  className?: string;
  /** Fixed look. When omitted, the stage mirrors the configurator store. */
  look?: ProductLook;
  cameraZ?: number;
  spin?: number;
  /** Shadow tone: darker on light backgrounds, lighter on the dark band. */
  shadow?: string;
};

function StoreProduct({ spin }: { spin?: number }) {
  const theme = useConfig((s) => s.theme);
  const lang = useConfig((s) => s.lang);
  const business = useConfig((s) => s.business);
  const exploded = useConfig((s) => s.exploded);
  return <NfcProduct theme={theme} lang={lang} business={business} exploded={exploded} spin={spin} />;
}

/** Pulls the camera back on narrow/tall canvases so the product always fits horizontally. */
export function FitCamera({ z, halfWidth = 2.3 }: { z: number; halfWidth?: number }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const { width, height } = useThree((s) => s.size);
  useEffect(() => {
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.position.z = Math.max(z, halfWidth / (tan * (width / height)));
    camera.updateProjectionMatrix();
  }, [camera, width, height, z, halfWidth]);
  return null;
}

/** WebGL stage for the NFC review disc. Rendering pauses while scrolled out of view. */
export default function NfcStage({ className, look, cameraZ = 7, spin, shadow = "#3a3833" }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      <Canvas
        flat
        frameloop={inView ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, cameraZ], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ touchAction: "pan-y" }}
      >
        <FitCamera z={cameraZ} />
        <Suspense fallback={null}>
          <Studio />
          {look ? <NfcProduct {...look} spin={spin} /> : <StoreProduct spin={spin} />}
          <ContactShadows position={[0, -2.1, 0]} opacity={0.32} scale={8} blur={2.8} far={3} color={shadow} />
        </Suspense>
      </Canvas>
    </div>
  );
}
