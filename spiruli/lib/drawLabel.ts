import { code39 } from "./code39";

/**
 * Label wraps the can body: circumference : label height ≈ 1.25 : 1, as on
 * the product photo. Must match scripts/bake-label.py.
 */
export const LABEL_W = 2048;
export const LABEL_H = 1640;
/** Gold band, in label pixels (from the photo). */
const BAND_Y = 1463;
const BAND_H = 94;

/** Front artwork unwrapped from the product photo by scripts/bake-label.py. */
export type FrontArt = { color: CanvasImageSource; pbr: CanvasImageSource; width: number };

export type Mode = "color" | "pbr";
export type LabelFonts = { display: string; sans: string };

/**
 * Inks used on the label. In "pbr" mode each ink is painted as
 * (0, roughness, metalness) so the same layout drives the PBR maps:
 * three.js reads roughness from G and metalness from B.
 */
const INKS = {
  petrol: { color: "#153e51", rough: 0.45, metal: 0.1 },
  gold: { color: "#d8b66a", rough: 0.22, metal: 0.65 },
  green: { color: "#5fb548", rough: 0.35, metal: 0.5 },
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

function back(ctx: CanvasRenderingContext2D, mode: Mode, fonts: LabelFonts, cx: number) {
  ctx.save();
  ctx.translate(0, 150);
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
  ctx.restore();
}

/**
 * Paints the full wrap-around label: the photo artwork on the front (centred
 * at u = 0.5), a procedural back at the seam, and the gold band joining them.
 */
export function paintLabel(ctx: CanvasRenderingContext2D, mode: Mode, fonts: LabelFonts, front: FrontArt | null) {
  const W = LABEL_W;
  const H = LABEL_H;
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = ink(mode, "petrol");
  ctx.fillRect(0, 0, W, H);

  // Gold band, wrapping all the way round.
  if (mode === "color") {
    const g = ctx.createLinearGradient(0, BAND_Y, 0, BAND_Y + BAND_H);
    g.addColorStop(0, "#a8925e");
    g.addColorStop(0.08, "#b0904b");
    g.addColorStop(0.5, "#b38f47");
    g.addColorStop(0.92, "#ab8a45");
    g.addColorStop(1, "#9d8a62");
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = ink(mode, "gold");
  }
  ctx.fillRect(0, BAND_Y, W, BAND_H);

  back(ctx, mode, fonts, 0);
  back(ctx, mode, fonts, W);

  if (front) ctx.drawImage(mode === "color" ? front.color : front.pbr, (W - front.width) / 2, 0, front.width, H);
  ctx.restore();
}
