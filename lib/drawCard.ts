import QRCode from "qrcode";
import { finishes, type Finish } from "./cardStore";

/**
 * Card faces are painted twice: once in "color" mode (albedo map) and once in
 * "pbr" mode, where the green channel encodes roughness and the blue channel
 * metalness (three.js convention). That lets printed gold ink read as real
 * metal while the navy body stays matte.
 */
export type PaintMode = "color" | "pbr";

export type FaceOptions = {
  name: string;
  tagline: string;
  finish: Finish;
  serif: string;
  sans: string;
  qrUrl: string;
};

const PBR = {
  body: "rgb(0,190,30)", // rough, non-metal
  gold: "rgb(0,70,255)", // glossy metal
  ink: "rgb(0,120,0)", // satin white print
};

type Ink = string | CanvasGradient | CanvasPattern;

let noisePattern: CanvasPattern | null = null;

function getNoise(ctx: CanvasRenderingContext2D) {
  if (noisePattern) return noisePattern;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const n = c.getContext("2d")!;
  const img = n.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 10;
  }
  n.putImageData(img, 0, 0);
  noisePattern = ctx.createPattern(c, "repeat");
  return noisePattern!;
}

function goldInk(ctx: CanvasRenderingContext2D, size: number, finish: Finish, mode: PaintMode): Ink {
  if (mode === "pbr") return PBR.gold;
  const g = ctx.createLinearGradient(0, 0, size, size);
  const stops = finishes[finish].stops;
  stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c));
  return g;
}

function paintBody(ctx: CanvasRenderingContext2D, size: number, mode: PaintMode) {
  const c = size / 2;
  if (mode === "pbr") {
    ctx.fillStyle = PBR.body;
    ctx.fillRect(0, 0, size, size);
    return;
  }
  const g = ctx.createRadialGradient(c * 0.8, c * 0.6, 0, c, c, c);
  g.addColorStop(0, "#26314A");
  g.addColorStop(0.55, "#172033");
  g.addColorStop(1, "#0C121D");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = getNoise(ctx);
  ctx.fillRect(0, 0, size, size);
}

function rings(ctx: CanvasRenderingContext2D, size: number, gold: Ink) {
  const c = size / 2;
  ctx.strokeStyle = gold;
  ctx.lineWidth = size * 0.0022;
  ctx.beginPath();
  ctx.arc(c, c, size * 0.471, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = size * 0.0012;
  ctx.beginPath();
  ctx.arc(c, c, size * 0.427, 0, Math.PI * 2);
  ctx.stroke();
}

function arcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  r: number,
  center: number,
  font: string,
  fill: Ink,
  spacing: number,
  bottom: boolean,
) {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const chars = [...text];
  const widths = chars.map((ch) => ctx.measureText(ch).width + spacing);
  const total = widths.reduce((a, b) => a + b, 0) - spacing;
  // Top text runs clockwise, bottom text counter-clockwise so both read upright.
  const dir = bottom ? -1 : 1;
  let a = center - (dir * total) / 2 / r;
  chars.forEach((ch, i) => {
    const half = widths[i] - spacing;
    a += (dir * half) / 2 / r;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.rotate(bottom ? a - Math.PI / 2 : a + Math.PI / 2);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    a += (dir * (half / 2 + spacing)) / r;
  });
  ctx.restore();
}

function spacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  fill: Ink,
  spacingEm: number,
) {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // letterSpacing is supported in modern browsers; fall back gracefully.
  const c = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
  const px = parseFloat(font.match(/(\d+(\.\d+)?)px/)?.[1] ?? "40");
  if ("letterSpacing" in c) c.letterSpacing = `${px * spacingEm}px`;
  ctx.fillText(text, x + (px * spacingEm) / 2, y);
  ctx.restore();
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
}

function nfcWaves(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  dir: 1 | -1,
  ink: Ink,
) {
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.lineCap = "round";
  ctx.lineWidth = scale * 0.11;
  const base = dir === 1 ? 0 : Math.PI;
  for (let i = 0; i < 3; i++) {
    const r = scale * (0.35 + i * 0.32);
    ctx.beginPath();
    ctx.arc(x, y, r, base - 0.62, base + 0.62);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.fillStyle = ink;
  ctx.arc(x, y, scale * 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function googleG(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, mode: PaintMode) {
  const w = R * 0.4;
  const r = R - w / 2;
  const deg = Math.PI / 180;
  const seg = (color: string, a0: number, a1: number) => {
    ctx.strokeStyle = mode === "pbr" ? PBR.ink : color;
    ctx.lineWidth = w;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0 * deg, a1 * deg);
    ctx.stroke();
  };
  seg("#EA4335", 222, 318); // red
  seg("#FBBC05", 140, 224); // yellow
  seg("#34A853", 42, 142); // green
  seg("#4285F4", -2, 44); // blue
  ctx.fillStyle = mode === "pbr" ? PBR.ink : "#4285F4";
  ctx.fillRect(cx - w * 0.06, cy - w / 2, R - w * 0.06 + 1, w * 0.92);
}

const qrCache = new Map<string, QRCode.QRCode>();

function qr(
  ctx: CanvasRenderingContext2D,
  url: string,
  x: number,
  y: number,
  size: number,
  mode: PaintMode,
  gold: Ink,
) {
  let code = qrCache.get(url);
  if (!code) {
    code = QRCode.create(url, { errorCorrectionLevel: "M" });
    qrCache.set(url, code);
  }
  const n = code.modules.size;
  const pad = size * 0.07;
  const cell = (size - pad * 2) / n;

  ctx.save();
  ctx.fillStyle = mode === "pbr" ? PBR.ink : "#F7F4EC";
  roundRect(ctx, x, y, size, size, size * 0.08);
  ctx.fill();
  ctx.fillStyle = mode === "pbr" ? PBR.body : "#121A28";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (code.modules.get(r, c)) {
        ctx.fillRect(x + pad + c * cell, y + pad + r * cell, cell + 0.6, cell + 0.6);
      }
    }
  }
  // Gold scanning brackets.
  ctx.strokeStyle = gold;
  ctx.lineWidth = size * 0.022;
  ctx.lineCap = "round";
  const o = size * 0.07;
  const l = size * 0.18;
  const corners: [number, number, number, number][] = [
    [x - o, y - o, 1, 1],
    [x + size + o, y - o, -1, 1],
    [x - o, y + size + o, 1, -1],
    [x + size + o, y + size + o, -1, -1],
  ];
  corners.forEach(([cx, cy, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy + dy * l);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + dx * l, cy);
    ctx.stroke();
  });
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  start: number,
  min: number,
  build: (px: number) => string,
) {
  let px = start;
  ctx.font = build(px);
  while (px > min && ctx.measureText(text).width > maxWidth) {
    px -= 4;
    ctx.font = build(px);
  }
  return px;
}

export function paintFront(ctx: CanvasRenderingContext2D, size: number, o: FaceOptions, mode: PaintMode) {
  const S = size / 2048; // layout authored on a 2048 grid
  const cx = size / 2;
  const gold = goldInk(ctx, size, o.finish, mode);
  const white = mode === "pbr" ? PBR.ink : "#F5F2EA";

  ctx.clearRect(0, 0, size, size);
  paintBody(ctx, size, mode);
  rings(ctx, size, gold);

  arcText(ctx, "TAP  ·  SCAN  ·  REVIEW", cx, cx, 922 * S, -Math.PI / 2, `600 ${40 * S}px ${o.sans}`, gold, 10 * S, false);
  arcText(ctx, "F&D SOLUTIONS  ·  SMART REVIEW CARD", cx, cx, 922 * S, Math.PI / 2, `600 ${36 * S}px ${o.sans}`, gold, 9 * S, true);

  const tagline = (o.tagline || "Review us on Google").toUpperCase();
  const tagPx = fitFont(ctx, tagline, 940 * S, 50 * S, 28 * S, (px) => `600 ${px}px ${o.sans}`);
  spacedText(ctx, tagline, cx, 318 * S, `600 ${tagPx}px ${o.sans}`, white, 0.28);

  const name = o.name.trim() || "Your Business";
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const namePx = fitFont(ctx, name, 1180 * S, 168 * S, 60 * S, (px) => `600 ${px}px ${o.serif}`);
  ctx.font = `600 ${namePx}px ${o.serif}`;
  ctx.fillStyle = gold;
  if (mode === "color") {
    ctx.shadowColor = "rgba(212,175,55,0.35)";
    ctx.shadowBlur = 24 * S;
  }
  ctx.fillText(name, cx, 448 * S);
  ctx.restore();

  ctx.fillStyle = gold;
  for (let i = -2; i <= 2; i++) star(ctx, cx + i * 78 * S, 572 * S, 30 * S);

  // Google "G" on a white disk, flanked by NFC waves.
  const gy = 820 * S;
  ctx.fillStyle = white;
  ctx.beginPath();
  ctx.arc(cx, gy, 172 * S, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 8 * S;
  ctx.beginPath();
  ctx.arc(cx, gy, 190 * S, 0, Math.PI * 2);
  ctx.stroke();
  googleG(ctx, cx, gy, 112 * S, mode);
  nfcWaves(ctx, cx + 250 * S, gy, 150 * S, 1, gold);
  nfcWaves(ctx, cx - 250 * S, gy, 150 * S, -1, gold);

  spacedText(ctx, "TAP OR SCAN", cx, 1078 * S, `700 ${42 * S}px ${o.sans}`, white, 0.4);

  const qs = 400 * S;
  qr(ctx, o.qrUrl, cx - qs / 2, 1160 * S, qs, mode, gold);
}

export function paintBack(ctx: CanvasRenderingContext2D, size: number, o: FaceOptions, mode: PaintMode) {
  const S = size / 2048;
  const cx = size / 2;
  const gold = goldInk(ctx, size, o.finish, mode);
  const white = mode === "pbr" ? PBR.ink : "#F5F2EA";

  ctx.clearRect(0, 0, size, size);
  paintBody(ctx, size, mode);
  rings(ctx, size, gold);

  // Fine guilloche-style lines.
  ctx.save();
  ctx.strokeStyle = gold;
  ctx.globalAlpha = mode === "pbr" ? 1 : 0.18;
  ctx.lineWidth = 2 * S;
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(cx, cx, 860 * S, 300 * S, a, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.fillStyle = mode === "pbr" ? PBR.body : "#121A28";
  ctx.beginPath();
  ctx.arc(cx, cx, 520 * S, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 6 * S;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = gold;
  ctx.font = `italic 600 ${400 * S}px ${o.serif}`;
  ctx.fillText("f&d", cx, 930 * S);
  ctx.restore();
  spacedText(ctx, "SOLUTIONS", cx, 1180 * S, `600 ${58 * S}px ${o.sans}`, white, 0.55);

  nfcWaves(ctx, cx - 40 * S, 1340 * S, 90 * S, 1, gold);
  spacedText(ctx, "HOLD PHONE HERE", cx, 1660 * S, `600 ${38 * S}px ${o.sans}`, gold, 0.35);
  arcText(ctx, "ELEVATE YOUR ONLINE REPUTATION", cx, cx, 922 * S, -Math.PI / 2, `600 ${38 * S}px ${o.sans}`, gold, 10 * S, false);
}
