/**
 * Minimal Code 39 encoder for PZN barcodes ("-" + 8 digits, framed by "*").
 * Each pattern is 9 elements (bar, space, bar, …), "1" marks a wide element.
 */
const PATTERNS: Record<string, string> = {
  "0": "000110100",
  "1": "100100001",
  "2": "001100001",
  "3": "101100000",
  "4": "000110001",
  "5": "100110000",
  "6": "001110000",
  "7": "000100101",
  "8": "100100100",
  "9": "001100100",
  "-": "010000101",
  "*": "010010100",
};

export type Bar = { x: number; w: number };

/** Returns the bars (dark modules) and total width in narrow-module units. */
export function code39(text: string, wide = 2.6): { bars: Bar[]; width: number } {
  const bars: Bar[] = [];
  let x = 0;
  const chars = `*${text}*`.split("");
  chars.forEach((ch, ci) => {
    const p = PATTERNS[ch];
    if (!p) throw new Error(`Code 39: unsupported character "${ch}"`);
    for (let i = 0; i < 9; i++) {
      const w = p[i] === "1" ? wide : 1;
      if (i % 2 === 0) bars.push({ x, w });
      x += w;
    }
    if (ci < chars.length - 1) x += 1; // inter-character gap
  });
  return { bars, width: x };
}
