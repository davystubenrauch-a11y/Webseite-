// Canvas artwork for the NFC review products (front, back and the embedded chip inlay).
// The 3D model paints these canvases into textures, so the configurator can re-render
// them live whenever the visitor changes shape, theme, language or company name.

import type { Lang, Shape, Theme } from "./pricing";

export type FaceOptions = {
  shape: Shape;
  theme: Theme;
  lang: Lang;
  business: string;
  /** Resolved font families (next/font hashes the names). */
  sans: string;
  serif: string;
};

const G = { blue: "#4285F4", red: "#EA4335", yellow: "#FBBC05", green: "#34A853" };

/** Physical outline of each product in scene units, plus the canvas resolution. */
export const geometryOf = (shape: Shape) =>
  shape === "card"
    ? { w: 3.4, h: 2.15, r: 0.2, depth: 0.05, px: [1600, 1012] as const }
    : shape === "stand"
      ? { w: 3, h: 3, r: 0.28, depth: 0.12, px: [1400, 1400] as const }
      : { w: 3, h: 3, r: 1.5, depth: 0.12, px: [1400, 1400] as const };

const palette = (theme: Theme) =>
  theme === "navy"
    ? { bg: ["#1e293b", "#0f172a"], ink: "#E9D49B", sub: "#c5a059", star: "#D4AF37" }
    : theme === "carbon"
      ? { bg: ["#26272c", "#08080a"], ink: "#F1F3F4", sub: "#bdc1c6", star: G.yellow }
      : { bg: ["#ffffff", "#e9edf2"], ink: "#202124", sub: "#5f6368", star: G.yellow };

const copy = (lang: Lang) =>
  lang === "de" ? { tap: "HIER ANTIPPEN", review: "Bewerte uns auf" } : { tap: "TAP HERE", review: "Review Us On" };

/** Rounded-rect or circle outline inset from the canvas edge. */
function outline(ctx: CanvasRenderingContext2D, w: number, h: number, shape: Shape, inset: number) {
  ctx.beginPath();
  if (shape === "disc") {
    ctx.arc(w / 2, h / 2, w / 2 - inset, 0, Math.PI * 2);
  } else {
    const r = (shape === "card" ? 0.09 : 0.075) * Math.min(w, h);
    ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, Math.max(r - inset * 0.6, 4));
  }
}

function background(ctx: CanvasRenderingContext2D, w: number, h: number, theme: Theme) {
  const p = palette(theme);
  const g = ctx.createRadialGradient(w * 0.35, h * 0.3, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, p.bg[0]);
  g.addColorStop(1, p.bg[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // Fine frosted-acrylic grain.
  const n = Math.round((w * h) / 900);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = theme === "classic" ? `rgba(0,0,0,${Math.random() * 0.025})` : `rgba(255,255,255,${Math.random() * 0.03})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
  }
}

/** The signature four-colour ring: each quadrant stroked through its own clip. */
function colourRing(ctx: CanvasRenderingContext2D, w: number, h: number, shape: Shape) {
  const s = Math.min(w, h);
  const quads: [number, number, string][] = [
    [0, 0, G.blue],
    [w / 2, 0, G.red],
    [w / 2, h / 2, G.yellow],
    [0, h / 2, G.green],
  ];
  for (const [x, y, c] of quads) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w / 2, h / 2);
    ctx.clip();
    outline(ctx, w, h, shape, s * 0.075);
    ctx.strokeStyle = c;
    ctx.lineWidth = s * 0.03;
    ctx.stroke();
    ctx.restore();
  }
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

function googleWordmark(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, font: string) {
  const letters: [string, string][] = [
    ["G", G.blue],
    ["o", G.red],
    ["o", G.yellow],
    ["g", G.blue],
    ["l", G.green],
    ["e", G.red],
  ];
  ctx.font = `500 ${size}px ${font}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  const widths = letters.map(([l]) => ctx.measureText(l).width);
  const gap = -size * 0.015;
  const total = widths.reduce((a, b) => a + b, 0) + gap * (letters.length - 1);
  let x = cx - total / 2;
  letters.forEach(([l, c], i) => {
    ctx.fillStyle = c;
    ctx.fillText(l, x, cy + size * 0.33);
    x += widths[i] + gap;
  });
}

/** Phone-in-hand pictogram with NFC waves, framed by scan brackets. */
function tapIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, ink: string, font: string) {
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Scan brackets.
  const half = s * 0.5;
  const arm = s * 0.17;
  ctx.lineWidth = s * 0.025;
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
    ctx.beginPath();
    ctx.moveTo(cx + sx * half, cy + sy * (half - arm));
    ctx.lineTo(cx + sx * half, cy + sy * half);
    ctx.lineTo(cx + sx * (half - arm), cy + sy * half);
    ctx.stroke();
  }

  // Phone.
  const pw = s * 0.3;
  const ph = s * 0.52;
  const px = cx - pw / 2 + s * 0.04;
  const py = cy - ph / 2 + s * 0.04;
  ctx.lineWidth = s * 0.028;
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, s * 0.05);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px + pw * 0.38, py + ph * 0.08);
  ctx.lineTo(px + pw * 0.62, py + ph * 0.08);
  ctx.stroke();

  // Hand: fingers wrapping the left edge, thumb on the right, palm below.
  ctx.lineWidth = s * 0.024;
  for (let i = 0; i < 3; i++) {
    const fy = py + ph * (0.45 + i * 0.13);
    ctx.beginPath();
    ctx.roundRect(px - s * 0.09, fy, s * 0.12, ph * 0.1, s * 0.03);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(px + pw, py + ph * 0.55);
  ctx.quadraticCurveTo(px + pw + s * 0.07, py + ph * 0.62, px + pw - s * 0.01, py + ph * 0.78);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px - s * 0.06, py + ph * 0.86);
  ctx.quadraticCurveTo(px - s * 0.04, py + ph * 1.12, px + pw * 0.45, py + ph * 1.12);
  ctx.lineTo(px + pw * 0.95, py + ph * 0.95);
  ctx.stroke();

  // NFC waves + label.
  ctx.lineWidth = s * 0.022;
  const wx = px - s * 0.02;
  const wy = py + s * 0.02;
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(wx, wy, s * 0.045 * i, Math.PI * 1.05, Math.PI * 1.45);
    ctx.stroke();
  }
  ctx.font = `600 ${s * 0.12}px ${font}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("NFC", px + pw * 0.2, py - s * 0.08);
  ctx.restore();
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxW: number, weight: string, px: number, font: string) {
  let size = px;
  ctx.font = `${weight} ${size}px ${font}`;
  while (ctx.measureText(text).width > maxW && size > 8) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${font}`;
  }
}

export function paintFront(ctx: CanvasRenderingContext2D, w: number, h: number, o: FaceOptions) {
  const p = palette(o.theme);
  const t = copy(o.lang);
  ctx.clearRect(0, 0, w, h);
  background(ctx, w, h, o.theme);
  colourRing(ctx, w, h, o.shape);

  ctx.fillStyle = p.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const spaced = (txt: string) => txt.split("").join(" ");

  if (o.shape === "card") {
    // Landscape layout: pictogram left, wordmark and rating right.
    const s = h;
    const lx = w * 0.26;
    fitText(ctx, spaced(t.tap), w * 0.3, "700", s * 0.06, o.sans);
    ctx.fillText(spaced(t.tap), lx, h * 0.25);
    tapIcon(ctx, lx, h * 0.57, s * 0.36, p.ink, o.sans);
    const rx = w * 0.66;
    googleWordmark(ctx, rx, h * 0.39, s * 0.2, o.sans);
    ctx.fillStyle = p.star;
    for (let i = 0; i < 5; i++) star(ctx, rx + (i - 2) * s * 0.085, h * 0.56, s * 0.034);
    ctx.fillStyle = p.ink;
    fitText(ctx, t.review, w * 0.4, "600", s * 0.07, o.sans);
    ctx.fillText(t.review, rx, h * 0.68);
    if (o.business) {
      ctx.fillStyle = p.sub;
      fitText(ctx, o.business, w * 0.42, "600", s * 0.055, o.serif);
      ctx.fillText(o.business, rx, h * 0.8);
    }
    return;
  }

  const s = w;
  ctx.font = `700 ${s * 0.042}px ${o.sans}`;
  ctx.fillText(spaced(t.tap), w / 2, h * 0.215);
  tapIcon(ctx, w / 2, h * 0.37, s * 0.21, p.ink, o.sans);
  googleWordmark(ctx, w / 2, h * 0.585, s * 0.15, o.sans);
  ctx.fillStyle = p.star;
  for (let i = 0; i < 5; i++) star(ctx, w / 2 + (i - 2) * s * 0.06, h * 0.695, s * 0.024);
  ctx.fillStyle = p.ink;
  ctx.font = `600 ${s * 0.047}px ${o.sans}`;
  ctx.fillText(t.review, w / 2, h * 0.765);
  if (o.business) {
    ctx.fillStyle = p.sub;
    fitText(ctx, o.business, w * (o.shape === "disc" ? 0.42 : 0.6), "600", s * 0.04, o.serif);
    ctx.fillText(o.business, w / 2, h * 0.835);
  }
}

/** Back face: faint inlay showing through the acrylic, plus a small maker's mark. */
export function paintBack(ctx: CanvasRenderingContext2D, w: number, h: number, o: FaceOptions) {
  const p = palette(o.theme);
  ctx.clearRect(0, 0, w, h);
  background(ctx, w, h, o.theme);
  ctx.save();
  ctx.globalAlpha = o.theme === "classic" ? 0.28 : 0.18;
  paintInlay(ctx, w, h, o.shape);
  ctx.restore();
  outline(ctx, w, h, o.shape, Math.min(w, h) * 0.075);
  ctx.strokeStyle = o.theme === "classic" ? "rgba(32,33,36,0.12)" : "rgba(197,160,89,0.35)";
  ctx.lineWidth = Math.min(w, h) * 0.006;
  ctx.stroke();

  const s = Math.min(w, h);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = o.theme === "classic" ? "#8a6a2e" : "#d4af37";
  ctx.font = `700 ${s * 0.12}px ${o.serif}`;
  ctx.fillText("F&D", w / 2, h * 0.2);
  ctx.fillStyle = p.sub;
  ctx.font = `600 ${s * 0.032}px ${o.sans}`;
  ctx.fillText("SMART REVIEW · NTAG 215 · 13,56 MHz", w / 2, h * 0.84);
}

/** Copper antenna coil and chip, drawn on a transparent canvas. */
export function paintInlay(ctx: CanvasRenderingContext2D, w: number, h: number, shape: Shape) {
  const s = Math.min(w, h);
  const cx = w / 2;
  const cy = h / 2;
  const turns = 7;
  const outer = shape === "card" ? [w * 0.36, h * 0.34] : [s * 0.3, s * 0.3];
  const pitch = s * 0.016;

  // PET carrier.
  ctx.save();
  ctx.fillStyle = "rgba(240,244,248,0.16)";
  ctx.beginPath();
  if (shape === "disc") ctx.arc(cx, cy, outer[0] + s * 0.04, 0, Math.PI * 2);
  else ctx.roundRect(cx - outer[0] - s * 0.04, cy - outer[1] - s * 0.04, (outer[0] + s * 0.04) * 2, (outer[1] + s * 0.04) * 2, s * 0.05);
  ctx.fill();

  const copper = ctx.createLinearGradient(cx - outer[0], cy - outer[1], cx + outer[0], cy + outer[1]);
  copper.addColorStop(0, "#7a4a1f");
  copper.addColorStop(0.35, "#e3a465");
  copper.addColorStop(0.55, "#b87333");
  copper.addColorStop(1, "#f0c08a");
  ctx.strokeStyle = copper;
  ctx.lineWidth = s * 0.008;
  for (let i = 0; i < turns; i++) {
    const rx = outer[0] - i * pitch;
    const ry = outer[1] - i * pitch;
    ctx.beginPath();
    if (shape === "disc") ctx.arc(cx, cy, rx, 0, Math.PI * 2);
    else ctx.roundRect(cx - rx, cy - ry, rx * 2, ry * 2, Math.max(s * 0.04 - i * 2, 2));
    ctx.stroke();
  }
  // Bridge from the coil to the chip.
  ctx.beginPath();
  ctx.moveTo(cx + outer[0] - turns * pitch, cy);
  ctx.lineTo(cx + s * 0.05, cy);
  ctx.moveTo(cx + outer[0], cy + s * 0.012);
  ctx.lineTo(cx + s * 0.05, cy + s * 0.03);
  ctx.stroke();

  // Chip die with gold bond pads.
  ctx.fillStyle = "#121417";
  ctx.beginPath();
  ctx.roundRect(cx - s * 0.05, cy - s * 0.05, s * 0.1, s * 0.1, s * 0.01);
  ctx.fill();
  ctx.fillStyle = "#d4af37";
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(cx - s * 0.04 + i * s * 0.022, cy - s * 0.035, s * 0.012, s * 0.012);
    ctx.fillRect(cx - s * 0.04 + i * s * 0.022, cy + s * 0.023, s * 0.012, s * 0.012);
  }
  ctx.restore();
}
