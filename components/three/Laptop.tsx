"use client";

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { sans } from "@/lib/fonts";

/** Paints a small example website (light, blue accent) onto the laptop screen. */
function paintSite(ctx: CanvasRenderingContext2D, w: number, h: number, font: string) {
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, w, h);
  // Nav bar
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h * 0.11);
  ctx.fillStyle = "#0f172a";
  ctx.font = `700 ${h * 0.045}px ${font}`;
  ctx.textBaseline = "middle";
  ctx.fillText("Café Isarblick", w * 0.05, h * 0.055);
  ctx.fillStyle = "#94a3b8";
  ctx.font = `500 ${h * 0.03}px ${font}`;
  ["Speisekarte", "Über uns", "Kontakt"].forEach((t, i) => ctx.fillText(t, w * (0.52 + i * 0.13), h * 0.055));
  // Hero
  const g = ctx.createLinearGradient(0, h * 0.11, w, h * 0.6);
  g.addColorStop(0, "#2563eb");
  g.addColorStop(1, "#4f46e5");
  ctx.fillStyle = g;
  ctx.fillRect(0, h * 0.11, w, h * 0.46);
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 ${h * 0.075}px ${font}`;
  ctx.fillText("Frühstück mit", w * 0.06, h * 0.24);
  ctx.fillText("Blick auf die Isar.", w * 0.06, h * 0.33);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = `500 ${h * 0.032}px ${font}`;
  ctx.fillText("Täglich ab 8 Uhr · Glockenbachviertel", w * 0.06, h * 0.41);
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.roundRect(w * 0.06, h * 0.46, w * 0.2, h * 0.07, h * 0.035);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.font = `700 ${h * 0.03}px ${font}`;
  ctx.fillText("Tisch reservieren", w * 0.075, h * 0.495);
  // Image placeholder on the right
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.roundRect(w * 0.6, h * 0.16, w * 0.34, h * 0.36, h * 0.03);
  ctx.fill();
  // Cards
  const colors = ["#10b981", "#2563eb", "#f59e0b"];
  for (let i = 0; i < 3; i++) {
    const x = w * (0.05 + i * 0.31);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(x, h * 0.63, w * 0.28, h * 0.3, h * 0.03);
    ctx.fill();
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.roundRect(x + w * 0.02, h * 0.67, h * 0.07, h * 0.07, h * 0.015);
    ctx.fill();
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(x + w * 0.02, h * 0.78, w * 0.22, h * 0.02);
    ctx.fillRect(x + w * 0.02, h * 0.83, w * 0.15, h * 0.02);
  }
}

/** Minimal laptop: aluminium base, dark lid and a live-painted website on the screen. */
export default function Laptop() {
  const gl = useThree((s) => s.gl);
  const screen = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1280;
    c.height = 800;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = gl.capabilities.getMaxAnisotropy();
    return t;
  }, [gl]);

  useEffect(() => {
    const draw = () => {
      const c = screen.image as HTMLCanvasElement;
      paintSite(c.getContext("2d")!, c.width, c.height, sans.style.fontFamily);
      screen.needsUpdate = true;
    };
    draw();
    document.fonts.ready.then(draw);
  }, [screen]);

  return (
    <group position={[0, -0.55, 0]}>
      {/* Base */}
      <RoundedBox args={[3.4, 0.12, 2.3]} radius={0.05} smoothness={4} position={[0, 0, 0.35]}>
        <meshPhysicalMaterial color="#cbd5e1" metalness={0.6} roughness={0.35} clearcoat={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.062, 0.55]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.9, 1.3]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>
      {/* Lid, opened ~105° */}
      <group position={[0, 0.06, -0.8]} rotation-x={-0.25}>
        <RoundedBox args={[3.4, 2.15, 0.08]} radius={0.05} smoothness={4} position={[0, 1.075, 0]}>
          <meshPhysicalMaterial color="#1e293b" metalness={0.4} roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, 1.1, 0.045]}>
          <planeGeometry args={[3.15, 1.97]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
