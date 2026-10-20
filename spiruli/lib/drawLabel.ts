import { code39 } from "./code39";

/** Label wraps the can body: circumference : label height ≈ 1.46 : 1. */
export const LABEL_W = 2048;
export const LABEL_H = 1408;

export type Mode = "color" | "pbr";
export type LabelFonts = { display: string; sans: string };

/**
 * Inks used on the label. In "pbr" mode each ink is painted as
 * (0, roughness, metalness) so the same layout drives the PBR maps:
 * three.js reads roughness from G and metalness from B.
 */
const INKS = {
  petrol: { color: "#0f3340", rough: 0.36, metal: 0.55 },
  gold: { color: "#d8b66a", rough: 0.2, metal: 1 },
  green: { color: "#5fb548", rough: 0.32, metal: 0.65 },
  white: { color: "#f3efe6", rough: 0.55, metal: 0 },
} as const;
type Ink = keyof typeof INKS;

function ink(mode: Mode, name: Ink, alpha = 1) {
  const i = INKS[name];
  if (mode === "pbr") return `rgba(0,${Math.round(i.rough * 255)},${Math.round(i.metal * 255)},${alpha})`;
  if (alpha === 1) return i.color;
  const n = parseInt(i.color.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/** Brushed-gold gradient across a span (flat gold in PBR mode). */
function goldFill(ctx: CanvasRenderingContext2D, mode: Mode, x0: number, x1: number) {
  if (mode === "pbr") return ink(mode, "gold");
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, "#9b7834");
  g.addColorStop(0.25, "#e2c47a");
  g.addColorStop(0.45, "#fbefc2");
  g.addColorStop(0.65, "#c9a55a");
  g.addColorStop(1, "#8e6e2e");
  return g;
}

/** Deterministic PRNG so colour and PBR passes paint identical strokes. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function spacedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  // Canvas letterSpacing is not universal yet; lay glyphs out manually.
  const widths = [...text].map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (text.length - 1);
  let cx = x - total / 2;
  const prev = ctx.textAlign;
  ctx.textAlign = "left";
  [...text].forEach((c, i) => {
    ctx.fillText(c, cx, y);
    cx += widths[i] + spacing;
  });
  ctx.textAlign = prev;
  return total;
}

/**
 * One brushed crescent of the "S" swoosh: many thin arcs whose angular
 * extent tapers toward the inner and outer edge, giving a lens shape.
 */
function crescent(
  ctx: CanvasRenderingContext2D,
  mode: Mode,
  seed: number,
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
  anticlockwise: boolean,
  width: number,
) {
  const rand = rng(seed);
  const span = anticlockwise ? -(((start - end) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) : end - start;
  const mid = start + span / 2;
  const strokes = 140;
  for (let k = 0; k < strokes; k++) {
    const o = (rand() * 2 - 1) * width;
    const f = Math.sqrt(1 - (o / width) ** 2);
    const ext = (Math.abs(span) / 2) * f * (0.82 + rand() * 0.2);
    ctx.beginPath();
    ctx.arc(cx, cy, r + o, mid - ext, mid + ext, false);
    const light = rand();
    if (mode === "pbr") {
      ctx.strokeStyle = ink(mode, "green", 0.5);
    } else {
      const h = 95 + light * 30;
      const l = 30 + light * 35;
      ctx.strokeStyle = `hsla(${h}, ${55 + light * 20}%, ${l}%, ${0.35 + rand() * 0.5})`;
    }
    ctx.lineWidth = 1.2 + rand() * 4.5;
    ctx.lineCap = "round";
    ctx.stroke();
  }
}

function goldArc(
  ctx: CanvasRenderingContext2D,
  mode: Mode,
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
  width: number,
) {
  // Tapered by layering progressively shorter arcs.
  const layers = 10;
  for (let i = 0; i < layers; i++) {
    const f = i / layers;
    const trim = ((end - start) / 2) * f * 0.9;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start + trim, end - trim, false);
    ctx.strokeStyle = goldFill(ctx, mode, cx - r, cx + r);
    ctx.lineWidth = width * (0.25 + f * 0.75) / 1.4;
    ctx.stroke();
  }
}

function badge(ctx: CanvasRenderingContext2D, mode: Mode, fonts: LabelFonts, x: number, y: number, r: number, top: string, bottom?: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = ink(mode, "petrol");
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = ink(mode, "gold");
  ctx.stroke();
  ctx.fillStyle = ink(mode, "gold");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (bottom) {
    ctx.font = `700 ${r * 0.62}px ${fonts.sans}`;
    ctx.fillText(top, x, y - r * 0.2);
    ctx.font = `600 ${r * 0.34}px ${fonts.sans}`;
    ctx.fillText(bottom, x, y + r * 0.42);
  } else {
    // Vegan leaf mark.
    ctx.lineWidth = 6;
    ctx.strokeStyle = ink(mode, "gold");
    ctx.beginPath();
    ctx.moveTo(x - r * 0.42, y - r * 0.35);
    ctx.lineTo(x - r * 0.05, y + r * 0.45);
    ctx.lineTo(x + r * 0.15, y - r * 0.05);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x + r * 0.28, y - r * 0.28, r * 0.28, r * 0.14, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function front(ctx: CanvasRenderingContext2D, mode: Mode, fonts: LabelFonts, cx: number) {
  const H = LABEL_H;

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = goldFill(ctx, mode, cx - 260, cx + 260);
  ctx.font = `600 40px ${fonts.display}`;
  spacedText(ctx, "HEALTH & VITALITY", cx, 150, 5);

  // The "S" swoosh behind the wordmark.
  crescent(ctx, mode, 7, cx - 18, 470, 215, -Math.PI / 3, Math.PI / 2, true, 58);
  crescent(ctx, mode, 13, cx + 18, 860, 215, -Math.PI / 2, (Math.PI * 2) / 3, false, 58);
  goldArc(ctx, mode, cx - 18, 470, 290, Math.PI * 0.62, Math.PI * 1.72, 14);
  goldArc(ctx, mode, cx + 18, 860, 290, -Math.PI * 0.38, Math.PI * 0.62, 14);
  goldArc(ctx, mode, cx - 18, 470, 150, Math.PI * 0.75, Math.PI * 1.5, 7);
  goldArc(ctx, mode, cx + 18, 860, 150, -Math.PI * 0.25, Math.PI * 0.45, 7);

  // Vertical wordmark: gold outline with a green inline, like the can art.
  ctx.save();
  ctx.translate(cx + 6, 665);
  ctx.rotate(-Math.PI / 2);
  ctx.font = `300 240px ${fonts.display}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const word = "SPIRULI";
  const natural = ctx.measureText(word).width + 30 * (word.length - 1);
  const s = 820 / natural;
  ctx.scale(s, s);
  const strokeWord = (style: string | CanvasGradient, w: number) => {
    const widths = [...word].map((c) => ctx.measureText(c).width);
    let x = -natural / 2;
    [...word].forEach((c, i) => {
      ctx.lineWidth = w;
      ctx.strokeStyle = style;
      ctx.strokeText(c, x + widths[i] / 2, 12);
      x += widths[i] + 30;
    });
  };
  ctx.lineJoin = "round";
  strokeWord(goldFill(ctx, mode, -400, 400), 15);
  strokeWord(ink(mode, "petrol"), 8);
  strokeWord(ink(mode, "green"), 3);
  ctx.restore();

  // Copy block.
  ctx.textAlign = "center";
  ctx.fillStyle = ink(mode, "white");
  ctx.font = `700 42px ${fonts.sans}`;
  spacedText(ctx, "ALGEN-FITNESS-GETRÄNK", cx, 1130, 1);
  ctx.fillStyle = goldFill(ctx, mode, cx - 520, cx + 520);
  ctx.font = `700 40px ${fonts.sans}`;
  spacedText(ctx, "NATÜRLICHE ENERGIE", cx, 1188, 2);

  const by = H - 120;
  badge(ctx, mode, fonts, cx - 130, by, 50, "");
  badge(ctx, mode, fonts, cx, by, 50, "B11", "12mg");
  badge(ctx, mode, fonts, cx + 130, by, 50, "B12", "2µg");
}

function back(ctx: CanvasRenderingContext2D, mode: Mode, fonts: LabelFonts, cx: number) {
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = goldFill(ctx, mode, cx - 200, cx + 200);
  ctx.font = `300 96px ${fonts.display}`;
  spacedText(ctx, "SPIRULI", cx, 230, 18);
  ctx.font = `600 30px ${fonts.display}`;
  spacedText(ctx, "®", cx + 230, 170, 0);

  ctx.fillStyle = ink(mode, "white", 0.85);
  ctx.font = `600 30px ${fonts.sans}`;
  spacedText(ctx, "FERMENTIERTE BASIS", cx, 320, 4);
  ctx.fillStyle = ink(mode, "green");
  ctx.font = `700 36px ${fonts.sans}`;
  spacedText(ctx, "HOLUNDER · ZITRUS · ALGEN", cx, 372, 2);

  ctx.strokeStyle = ink(mode, "gold", 0.6);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 240, 420);
  ctx.lineTo(cx + 240, 420);
  ctx.stroke();

  const lines = [
    "Natürlicher B-Komplex: B2 · B6 · B12 · Niacin",
    "Vitamin C · Folsäure",
    "18+ Aminosäuren inkl. BCAA & GABA",
    "Vegan · Natürliche Energie",
  ];
  ctx.fillStyle = ink(mode, "white", 0.8);
  ctx.font = `500 28px ${fonts.sans}`;
  lines.forEach((l, i) => ctx.fillText(l, cx, 480 + i * 50));

  // SGS-style quality seal (generic ring, not a reproduction of the mark).
  const sy = 800;
  ctx.beginPath();
  ctx.arc(cx, sy, 82, 0, Math.PI * 2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = ink(mode, "gold");
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, sy, 70, 0, Math.PI * 2);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = ink(mode, "gold");
  ctx.font = `700 26px ${fonts.sans}`;
  ctx.fillText("SGS", cx, sy - 8);
  ctx.font = `600 17px ${fonts.sans}`;
  ctx.fillText("FRESENIUS", cx, sy + 18);
  ctx.font = `500 14px ${fonts.sans}`;
  ctx.fillText("GEPRÜFT", cx, sy + 40);

  // PZN barcode on a white field.
  const { bars, width } = code39("-11110571");
  const bw = 380;
  const m = bw / width;
  const bx = cx - bw / 2;
  const top = 950;
  ctx.fillStyle = ink(mode, "white");
  ctx.fillRect(bx - 26, top - 24, bw + 52, 190);
  ctx.fillStyle = mode === "pbr" ? ink(mode, "petrol") : "#0b0f12";
  bars.forEach((b) => ctx.fillRect(bx + b.x * m, top, b.w * m, 110));
  ctx.font = `700 24px ${fonts.sans}`;
  ctx.fillText("PZN - 11110571", cx, top + 148);
}

/** Paints the full wrap-around label. Front centred at u = 0.5, back at the seam. */
export function paintLabel(ctx: CanvasRenderingContext2D, mode: Mode, fonts: LabelFonts) {
  const W = LABEL_W;
  const H = LABEL_H;
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = ink(mode, "petrol");
  ctx.fillRect(0, 0, W, H);

  if (mode === "color") {
    // Satin depth in the lacquer.
    const v = ctx.createLinearGradient(0, 0, 0, H);
    v.addColorStop(0, "rgba(0,0,0,0.18)");
    v.addColorStop(0.5, "rgba(255,255,255,0.02)");
    v.addColorStop(1, "rgba(0,0,0,0.25)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }

  // Gold band, wrapping all the way round.
  const by = H - 120;
  ctx.fillStyle = goldFill(ctx, mode, 0, W / 3);
  if (mode === "color") {
    const g = ctx.createLinearGradient(0, 0, W, 0);
    for (let i = 0; i <= 8; i++) g.addColorStop(i / 8, i % 2 ? "#f1dc9c" : "#b38f45");
    ctx.fillStyle = g;
  }
  ctx.fillRect(0, by - 42, W, 84);

  // Hairlines framing the top of the label.
  ctx.fillStyle = ink(mode, "gold", 0.7);
  ctx.fillRect(0, 34, W, 3);
  ctx.fillRect(0, 46, W, 1.5);

  front(ctx, mode, fonts, W / 2);
  back(ctx, mode, fonts, 0);
  back(ctx, mode, fonts, W);
  ctx.restore();
}
