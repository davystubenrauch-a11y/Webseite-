"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertex = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (34.0 / -mv.z);
    vAlpha = aAlpha;
    vColor = aColor;
  }
`;

const fragment = /* glsl */ `
  uniform float uGlow;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = uGlow > 0.5 ? pow(smoothstep(0.5, 0.0, d), 1.8) : smoothstep(0.5, 0.3, d);
    gl_FragColor = vec4(vColor * (1.0 + a * uGlow), a * vAlpha);
  }
`;

const PALETTES = {
  // Luminous motes: emerald, lime and a little gold dust.
  glow: [new THREE.Color("#2FA35B"), new THREE.Color("#6CC04A"), new THREE.Color("#E2C47A")],
  // Spirulina powder: deep, matte greens.
  powder: [new THREE.Color("#0E4D2C"), new THREE.Color("#1B6B3A"), new THREE.Color("#245E2A")],
};

type Props = { count?: number; variant?: keyof typeof PALETTES; inner?: number; outer?: number; height?: number };

/**
 * Micro-particles drifting in a cylindrical shell around the can: they
 * rise slowly, swirl, and fade in and out over their lifetime.
 */
export default function AlgaeParticles({ count = 600, variant = "glow", inner = 0.85, outer = 2.6, height = 4.2 }: Props) {
  const ref = useRef<THREE.Points>(null);
  const dpr = useThree((s) => s.viewport.dpr);
  const glow = variant === "glow";

  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const alpha = new Float32Array(count);
    const life = new Float32Array(count);
    const maxLife = new Float32Array(count);
    const base = new Float32Array(count);
    const speed = new Float32Array(count);
    const pal = PALETTES[variant];
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      const c = glow ? (r < 0.55 ? pal[0] : r < 0.85 ? pal[1] : pal[2]) : pal[Math.floor(r * pal.length)];
      col.set([c.r, c.g, c.b], i * 3);
      base[i] = glow ? 0.5 + Math.random() * 1.6 : 0.6 + Math.random() * 1.1;
      maxLife[i] = 4 + Math.random() * 6;
      life[i] = Math.random() * maxLife[i];
      speed[i] = 0.05 + Math.random() * 0.16;
      const a = Math.random() * Math.PI * 2;
      const rad = inner + Math.random() * (outer - inner);
      pos.set([Math.cos(a) * rad, (Math.random() - 0.5) * height, Math.sin(a) * rad], i * 3);
    }
    return { pos, col, size, alpha, life, maxLife, base, speed };
  }, [count, variant, glow, inner, outer, height]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.pos, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(data.col, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(data.size, 1));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(data.alpha, 1));
    return g;
  }, [data]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uPixelRatio: { value: 1 }, uGlow: { value: glow ? 1 : 0 } },
        transparent: true,
        depthWrite: false,
        blending: glow ? THREE.AdditiveBlending : THREE.NormalBlending,
      }),
    [glow],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = dpr;
    const half = height / 2;
    for (let i = 0; i < count; i++) {
      const k = i * 3;
      data.life[i] += dt;
      if (data.life[i] > data.maxLife[i]) {
        data.life[i] = 0;
        const a = Math.random() * Math.PI * 2;
        const rad = inner + Math.random() * (outer - inner);
        data.pos[k] = Math.cos(a) * rad;
        data.pos[k + 1] = (Math.random() - 0.5) * height;
        data.pos[k + 2] = Math.sin(a) * rad;
      }
      // Rise with a gentle swirl around the can.
      const x = data.pos[k];
      const z = data.pos[k + 2];
      const swirl = 0.08 * dt;
      data.pos[k] = x - z * swirl + Math.sin(t * 0.7 + i) * 0.002;
      data.pos[k + 2] = z + x * swirl;
      data.pos[k + 1] += data.speed[i] * dt;
      if (data.pos[k + 1] > half) data.pos[k + 1] -= height;
      const p = data.life[i] / data.maxLife[i];
      const fade = Math.sin(Math.PI * p);
      data.alpha[i] = fade * (glow ? 0.85 : 0.7);
      data.size[i] = data.base[i] * (0.7 + fade * 0.4) * (glow ? 1 + Math.sin(t * 3 + i) * 0.15 : 1);
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.aAlpha.needsUpdate = true;
    geometry.attributes.aSize.needsUpdate = true;
    if (ref.current) ref.current.rotation.y = t * 0.02;
  });

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}
