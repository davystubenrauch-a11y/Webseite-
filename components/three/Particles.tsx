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
    gl_PointSize = aSize * uPixelRatio * (260.0 / -mv.z);
    vAlpha = aAlpha;
    vColor = aColor;
  }
`;

const fragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.8);
    gl_FragColor = vec4(vColor * (1.0 + a), a * vAlpha);
  }
`;

const GOLD = new THREE.Color("#D4AF37");
const SOFT = new THREE.Color("#F3E2A9");
const ROYAL = new THREE.Color("#3B7BFF");

/**
 * Ambient emission: motes spawn on the card's rim, drift outward and upward,
 * and fade over their lifetime.
 */
export default function Particles({ count = 420, radius = 1.6 }: { count?: number; radius?: number }) {
  const ref = useRef<THREE.Points>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const alpha = new Float32Array(count);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count);
    const maxLife = new Float32Array(count);
    const base = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      const c = r < 0.72 ? GOLD : r < 0.88 ? SOFT : ROYAL;
      col.set([c.r, c.g, c.b], i * 3);
      base[i] = 0.6 + Math.random() * 1.8;
      maxLife[i] = 2.5 + Math.random() * 4;
      life[i] = Math.random() * maxLife[i];
    }
    return { pos, col, size, alpha, vel, life, maxLife, base };
  }, [count]);

  const respawn = (i: number) => {
    const a = Math.random() * Math.PI * 2;
    const r = radius + (Math.random() - 0.3) * 0.25;
    const z = (Math.random() - 0.5) * 0.6;
    data.pos.set([Math.cos(a) * r, Math.sin(a) * r, z], i * 3);
    const out = 0.08 + Math.random() * 0.25;
    data.vel.set(
      [Math.cos(a) * out, Math.sin(a) * out + 0.12 + Math.random() * 0.1, (Math.random() - 0.5) * 0.2],
      i * 3,
    );
    data.life[i] = 0;
    data.maxLife[i] = 2.5 + Math.random() * 4;
  };

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    for (let i = 0; i < count; i++) respawn(i);
    g.setAttribute("position", new THREE.BufferAttribute(data.pos, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(data.col, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(data.size, 1));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(data.alpha, 1));
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uPixelRatio: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = dpr;
    for (let i = 0; i < count; i++) {
      data.life[i] += dt;
      if (data.life[i] > data.maxLife[i]) respawn(i);
      const k = i * 3;
      // Gentle swirl.
      const x = data.pos[k];
      const y = data.pos[k + 1];
      data.vel[k] += -y * 0.015 * dt + Math.sin(t + i) * 0.02 * dt;
      data.vel[k + 1] += x * 0.015 * dt;
      data.pos[k] += data.vel[k] * dt;
      data.pos[k + 1] += data.vel[k + 1] * dt;
      data.pos[k + 2] += data.vel[k + 2] * dt;
      const p = data.life[i] / data.maxLife[i];
      const dist = Math.hypot(data.pos[k], data.pos[k + 1]);
      const fade = Math.sin(Math.PI * p) * THREE.MathUtils.clamp((2.7 - dist) / 0.8, 0, 1);
      data.alpha[i] = fade * 0.9;
      data.size[i] = data.base[i] * (0.6 + fade * 0.6) * (1 + Math.sin(t * 3 + i) * 0.15);
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.aAlpha.needsUpdate = true;
    geometry.attributes.aSize.needsUpdate = true;
    if (ref.current) ref.current.rotation.z = t * 0.03;
  });

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}
