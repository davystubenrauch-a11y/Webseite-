/**
 * Label wraps the can body: circumference : label height ≈ 1.25 : 1, as on
 * the product photo. Must match scripts/bake-label.py.
 */
export const LABEL_W = 2048;
export const LABEL_H = 1640;
/** Gold band, in label pixels (from the photo). */
const BAND_Y = 1477;
const BAND_H = 92;

/** Painted swoosh unwrapped from the product photo by scripts/bake-label.py. */
export type FrontArt = { color: CanvasImageSource; pbr: CanvasImageSource; width: number };

/** Front centre and the lacquer gradient sampled from the product photo. */
const FX = LABEL_W / 2;
const LACQUER: [number, string][] = [
  [0, "#1b8d93"],
  [0.25, "#147b81"],
  [0.45, "#0d6168"],
  [0.62, "#08444a"],
  [0.8, "#052e32"],
  [1, "#032124"],
];

export type Mode = "color" | "pbr";
export type LabelFonts = { display: string; sans: string };

/**
 * Inks used on the label. In "pbr" mode each ink is painted as
 * (0, roughness, metalness) so the same layout drives the PBR maps:
 * scripts/render_can.py reads roughness from G and metalness from B.
 */
const INKS = {
  petrol: { color: "#0e676d", rough: 0.5, metal: 0.2 },
  gold: { color: "#d8b66a", rough: 0.4, metal: 0.55 },
  green: { color: "#5fb548", rough: 0.45, metal: 0.2 },
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

/* ---------------------------------------------------------------------------
 * Front, redrawn as vector art. Positions are measured on the product photo
 * and converted to label space (see scripts/bake-label.py for the mapping).
 * ------------------------------------------------------------------------- */

/** Wordmark letters as centre-line skeletons in a box of height 1 (cap top y=0, baseline y=1). */
type Letter = { w: number; draw: (ctx: CanvasRenderingContext2D, h: number) => void };
const LETTERS: Record<string, Letter> = {
  S: {
    w: 0.8,
    draw(ctx, h) {
      const rx = (0.8 * h) / 2;
      const ry = h / 4;
      ctx.beginPath();
      ctx.ellipse(rx, ry, rx, ry, 0, -0.32, Math.PI / 2, true);
      ctx.ellipse(rx, 3 * ry, rx, ry, 0, -Math.PI / 2, Math.PI - 0.32, false);
      ctx.stroke();
    },
  },
  P: {
    w: 0.64,
    draw(ctx, h) {
      const r = 0.27 * h;
      const w = 0.64 * h;
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, 0);
      ctx.lineTo(w - r, 0);
      ctx.arc(w - r, r, r, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(0, 2 * r);
      ctx.stroke();
    },
  },
  R: {
    w: 0.66,
    draw(ctx, h) {
      const r = 0.25 * h;
      const w = 0.62 * h;
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, 0);
      ctx.lineTo(w - r, 0);
      ctx.arc(w - r, r, r, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(0, 2 * r);
      ctx.moveTo(w - r * 1.2, 2 * r);
      ctx.lineTo(0.66 * h, h);
      ctx.stroke();
    },
  },
  I: {
    w: 0,
    draw(ctx, h) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, h);
      ctx.stroke();
    },
  },
  U: {
    w: 0.72,
    draw(ctx, h) {
      const w = 0.72 * h;
      const r = w / 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, h - r);
      ctx.arc(r, h - r, r, Math.PI, 0, true);
      ctx.lineTo(w, 0);
      ctx.stroke();
    },
  },
  L: {
    w: 0.58,
    draw(ctx, h) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, h);
      ctx.lineTo(0.58 * h, h);
      ctx.stroke();
    },
  },
};

/** Pale satin gold of the wordmark, with a soft sheen along the word. */
function lightGold(ctx: CanvasRenderingContext2D, length: number) {
  const g = ctx.createLinearGradient(0, 0, length, 0);
  g.addColorStop(0, "#d1a94f");
  g.addColorStop(0.35, "#f2d382");
  g.addColorStop(0.6, "#dcb560");
  g.addColorStop(1, "#ecc96f");
  return g;
}

/** Vertical SPIRULI wordmark, reading bottom to top: gold outline, lacquer core, green centre line. */
function wordmark(ctx: CanvasRenderingContext2D, mode: Mode) {
  const word = "SPIRULI";
  const outer = 40; // outer width of a letter stroke
  const cap = 200 - outer; // skeleton cap height
  const top = 236;
  const bottom = 1172;
  const widths = [...word].map((c) => LETTERS[c].w * cap + outer);
  const gap = (bottom - top - widths.reduce((a, b) => a + b, 0)) / (word.length - 1);

  ctx.save();
  ctx.translate(FX + 4, (top + bottom) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.translate(-(bottom - top) / 2, -cap / 2);
  ctx.lineJoin = "miter";
  ctx.miterLimit = 4;
  ctx.lineCap = "butt";
  const passes: [string | CanvasGradient, number][] =
    mode === "pbr"
      ? [[ink(mode, "gold"), outer], [ink(mode, "petrol"), outer - 20], [ink(mode, "green"), 8]]
      : [
          [lightGold(ctx, bottom - top), outer],
          ["#174f57", outer - 20],
          ["#3fae3a", 8],
        ];
  for (const [style, lw] of passes) {
    let x = outer / 2;
    ctx.strokeStyle = style;
    ctx.lineWidth = lw;
    [...word].forEach((c, i) => {
      ctx.save();
      ctx.translate(x, 0);
      LETTERS[c].draw(ctx, cap);
      ctx.restore();
      x += widths[i] + gap;
    });
  }
  ctx.restore();
}

/** Embossed "PREMIUM FORMULA" seal: lacquer-on-lacquer with a lit and a shaded edge. */
function seal(ctx: CanvasRenderingContext2D, mode: Mode, fonts: LabelFonts) {
  const cx = 1272;
  const cy = 283;
  const R = 74;
  const layers: [number, number, string][] =
    mode === "pbr"
      ? [[0, 0, `rgba(0,${Math.round(0.45 * 255)},${Math.round(0.1 * 255)},1)`]]
      : [
          [2, 2.5, "rgba(4,30,32,0.55)"],
          [-1.5, -2, "rgba(170,230,228,0.45)"],
          [0, 0, "#22767a"],
        ];
  for (const [dx, dy, color] of layers) {
    ctx.save();
    ctx.translate(cx + dx, cy + dy);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.6, 0, Math.PI * 2);
    ctx.stroke();
    // Ring text.
    ctx.font = `700 ${R * 0.23}px ${fonts.sans}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const ring = (text: string, start: number, dir: 1 | -1) => {
      const step = 0.24;
      [...text].forEach((ch, i) => {
        const a = start + dir * (i - (text.length - 1) / 2) * step;
        ctx.save();
        ctx.rotate(a);
        ctx.translate(0, -R * 0.8);
        // Bottom text reads left to right, upright.
        if (dir === -1) ctx.rotate(Math.PI);
        ctx.fillText(ch, 0, 0);
        ctx.restore();
      });
    };
    ring("PREMIUM", 0, 1);
    ring("FORMULA", Math.PI, -1);
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(sx * R * 0.8, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Lotus of three petals and two leaves.
    ctx.lineWidth = 3;
    const s = R * 0.42;
    const petal = (rot: number, len: number, wid: number) => {
      ctx.save();
      ctx.translate(0, s * 0.45);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(wid, -len * 0.55, 0, -len);
      ctx.quadraticCurveTo(-wid, -len * 0.55, 0, 0);
      ctx.stroke();
      ctx.restore();
    };
    petal(0, s * 1.25, s * 0.42);
    petal(-0.75, s * 1.0, s * 0.36);
    petal(0.75, s * 1.0, s * 0.36);
    ctx.beginPath();
    ctx.moveTo(-s * 0.9, s * 0.45);
    ctx.quadraticCurveTo(0, s * 0.95, s * 0.9, s * 0.45);
    ctx.stroke();
    ctx.restore();
  }
}

function fitText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, cap: number, weight: number, family: string, spacing = 0.02) {
  const size = cap / 0.72;
  ctx.font = `${weight} ${size}px ${family}`;
  const glyphs = [...text];
  const raw = glyphs.reduce((a, c) => a + ctx.measureText(c).width, 0) + spacing * size * (glyphs.length - 1);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(width / raw, 1);
  spacedText(ctx, text, 0, 0, spacing * size);
  ctx.restore();
}

function badge(ctx: CanvasRenderingContext2D, mode: Mode, fonts: LabelFonts, x: number, kind: "V" | "B11" | "B12") {
  const y = BAND_Y + BAND_H / 2;
  const r = 58;
  const dark = mode === "pbr" ? ink(mode, "petrol") : "#1d2b25";
  if (mode === "color") {
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r);
    g.addColorStop(0, "#f3dc9c");
    g.addColorStop(1, "#c8a256");
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = ink(mode, "gold");
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = dark;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.arc(x, y, r - 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = dark;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  if (kind === "V") {
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x - 24, y - 20);
    ctx.lineTo(x - 4, y + 26);
    ctx.quadraticCurveTo(x + 6, y - 6, x + 22, y - 18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 4);
    ctx.bezierCurveTo(x + 2, y - 26, x + 18, y - 34, x + 30, y - 34);
    ctx.bezierCurveTo(x + 30, y - 16, x + 20, y - 6, x + 4, y - 4);
    ctx.fill();
    ctx.lineCap = "butt";
  } else {
    ctx.font = `800 ${r * 0.62}px ${fonts.sans}`;
    ctx.fillText(kind, x, y + 3);
    ctx.font = `600 ${r * 0.38}px ${fonts.sans}`;
    ctx.fillText(kind === "B11" ? "12mg" : "2µg", x, y + r * 0.62);
  }
}

function frontCopy(ctx: CanvasRenderingContext2D, mode: Mode, fonts: LabelFonts) {
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = mode === "pbr" ? ink(mode, "white") : "#f1f2ee";
  fitText(ctx, "ALGEN-FITNESS-GETRÄNK", FX, 1355, 650, 34, 700, fonts.sans);
  const gold = mode === "pbr" ? ink(mode, "gold") : (() => {
    const g = ctx.createLinearGradient(0, 1370, 0, 1455);
    g.addColorStop(0, "#f0d48c");
    g.addColorStop(1, "#c9a14f");
    return g;
  })();
  ctx.fillStyle = gold;
  fitText(ctx, "NATÜRLICHE ENERGIE", FX, 1408, 520, 29, 700, fonts.sans);
  fitText(ctx, "HEALTH & VITALITY", FX, 1451, 372, 24, 700, fonts.sans);

  // Thin dark rules framing the band.
  ctx.fillStyle = mode === "pbr" ? ink(mode, "petrol") : "rgba(20,30,24,0.55)";
  ctx.fillRect(0, BAND_Y + 6, LABEL_W, 2);
  ctx.fillRect(0, BAND_Y + BAND_H - 8, LABEL_W, 2);
  badge(ctx, mode, fonts, FX - 180, "V");
  badge(ctx, mode, fonts, FX, "B11");
  badge(ctx, mode, fonts, FX + 180, "B12");

  ctx.fillStyle = mode === "pbr" ? ink(mode, "white") : "#b7c1bf";
  fitText(ctx, "PHARMAZENTRALNUMMER PZN 11110571", FX, 1622, 470, 15, 600, fonts.sans, 0.04);
}

/**
 * Paints the full wrap-around label at `scale` × the 2048 × 1640 layout:
 * lacquer, gold band, and the front design (photo swoosh + vector art) twice.
 */
export function paintLabel(ctx: CanvasRenderingContext2D, mode: Mode, fonts: LabelFonts, front: FrontArt | null, scale = 1) {
  const W = LABEL_W;
  const H = LABEL_H;
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, W, H);
  if (mode === "color") {
    const lacquer = ctx.createLinearGradient(0, 0, 0, H);
    for (const [o, c] of LACQUER) lacquer.addColorStop(o, c);
    ctx.fillStyle = lacquer;
  } else {
    ctx.fillStyle = ink(mode, "petrol");
  }
  ctx.fillRect(0, 0, W, H);

  // Gold band, wrapping all the way round.
  if (mode === "color") {
    const g = ctx.createLinearGradient(0, BAND_Y, 0, BAND_Y + BAND_H);
    g.addColorStop(0, "#94742f");
    g.addColorStop(0.12, "#d9ad4f");
    g.addColorStop(0.45, "#f5d47f");
    g.addColorStop(0.6, "#d8a948");
    g.addColorStop(1, "#86682a");
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = ink(mode, "gold");
  }
  ctx.fillRect(0, BAND_Y, W, BAND_H);

  // The artwork covers the whole can: the front design is repeated on the
  // back (centred on the seam), as on the printed can.
  for (const dx of [0, -W / 2, W / 2]) {
    ctx.save();
    ctx.translate(dx, 0);
    if (front) ctx.drawImage(mode === "color" ? front.color : front.pbr, (W - front.width) / 2, 0, front.width, H);
    wordmark(ctx, mode);
    seal(ctx, mode, fonts);
    frontCopy(ctx, mode, fonts);
    ctx.restore();
  }
  ctx.restore();
}
