"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { sans } from "@/lib/fonts";

export type PhoneScreen = { unlocked: boolean; stars: number };

const G = ["#4285F4", "#EA4335", "#FBBC05", "#4285F4", "#34A853", "#EA4335"];

function starPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.closePath();
}

/** Lock screen with an NFC hint, or the Google review form with `stars` filled. */
function paintScreen(ctx: CanvasRenderingContext2D, w: number, h: number, s: PhoneScreen, font: string) {
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (!s.unlocked) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#1e3a8a");
    g.addColorStop(1, "#0f766e");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 ${w * 0.26}px ${font}`;
    ctx.fillText("9:41", w / 2, h * 0.22);
    ctx.font = `500 ${w * 0.055}px ${font}`;
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillText("Dienstag, 21. Oktober", w / 2, h * 0.3);
    // NFC hint bubble
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.roundRect(w * 0.08, h * 0.74, w * 0.84, h * 0.1, w * 0.06);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `600 ${w * 0.05}px ${font}`;
    ctx.fillText("An NFC-Platte halten", w / 2, h * 0.79);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    // Google wordmark
    ctx.font = `600 ${w * 0.12}px ${font}`;
    const letters = "Google".split("");
    const widths = letters.map((l) => ctx.measureText(l).width);
    let x = w / 2 - widths.reduce((a, b) => a + b, 0) / 2;
    ctx.textAlign = "left";
    letters.forEach((l, i) => {
      ctx.fillStyle = G[i];
      ctx.fillText(l, x, h * 0.14);
      x += widths[i];
    });
    ctx.textAlign = "center";
    ctx.fillStyle = "#202124";
    ctx.font = `700 ${w * 0.075}px ${font}`;
    ctx.fillText("Café Isarblick", w / 2, h * 0.26);
    ctx.fillStyle = "#5f6368";
    ctx.font = `500 ${w * 0.045}px ${font}`;
    ctx.fillText("Wie war Ihr Besuch?", w / 2, h * 0.31);
    for (let i = 0; i < 5; i++) {
      starPath(ctx, w * (0.2 + i * 0.15), h * 0.4, w * 0.065);
      if (i < s.stars) {
        ctx.fillStyle = "#FBBC05";
        ctx.fill();
      } else {
        ctx.strokeStyle = "#dadce0";
        ctx.lineWidth = w * 0.01;
        ctx.stroke();
      }
    }
    ctx.strokeStyle = "#dadce0";
    ctx.lineWidth = w * 0.006;
    ctx.beginPath();
    ctx.roundRect(w * 0.08, h * 0.48, w * 0.84, h * 0.2, w * 0.03);
    ctx.stroke();
    ctx.fillStyle = "#80868b";
    ctx.textAlign = "left";
    ctx.font = `500 ${w * 0.045}px ${font}`;
    ctx.fillText(s.stars >= 5 ? "Super Frühstück, sehr nett!" : "Erzählen Sie von Ihrem Besuch", w * 0.12, h * 0.52);
    ctx.textAlign = "center";
    ctx.fillStyle = s.stars >= 5 ? "#1a73e8" : "#e8eaed";
    ctx.beginPath();
    ctx.roundRect(w * 0.55, h * 0.73, w * 0.37, h * 0.065, h * 0.033);
    ctx.fill();
    ctx.fillStyle = s.stars >= 5 ? "#ffffff" : "#9aa0a6";
    ctx.font = `700 ${w * 0.05}px ${font}`;
    ctx.fillText("Posten", w * 0.735, h * 0.763);
  }
  // Dynamic island
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.roundRect(w * 0.36, h * 0.018, w * 0.28, h * 0.03, h * 0.015);
  ctx.fill();
}

/** 3D smartphone whose screen follows `screen.current` (repainted only when it changes). */
export default function Phone({ screen }: { screen: { current: PhoneScreen } }) {
  const gl = useThree((s) => s.gl);
  const last = useRef("");
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 600;
    c.height = 1300;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = gl.capabilities.getMaxAnisotropy();
    return t;
  }, [gl]);

  const repaint = () => {
    const c = tex.image as HTMLCanvasElement;
    paintScreen(c.getContext("2d")!, c.width, c.height, screen.current, sans.style.fontFamily);
    tex.needsUpdate = true;
  };
  useEffect(() => {
    document.fonts.ready.then(() => {
      last.current = "";
    });
  }, []);
  useFrame(() => {
    const key = `${screen.current.unlocked}-${screen.current.stars}`;
    if (key !== last.current) {
      last.current = key;
      repaint();
    }
  });

  return (
    <group>
      <RoundedBox args={[1.25, 2.6, 0.12]} radius={0.16} smoothness={6}>
        <meshPhysicalMaterial color="#1e293b" metalness={0.5} roughness={0.3} clearcoat={1} />
      </RoundedBox>
      <mesh position-z={0.061}>
        <planeGeometry args={[1.13, 2.45]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}
