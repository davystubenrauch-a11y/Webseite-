/**
 * Procedural condensation: a tangent-space normal map of hemispherical
 * droplets plus a few gravity runs. Used as the clearcoat normal map so the
 * beads sit on top of the lacquer.
 */
export function makeCondensation(size = 1024, seed = 3) {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 128;
    d[i + 1] = 128;
    d[i + 2] = 255;
    d[i + 3] = 255;
  }

  const drop = (cx: number, cy: number, rx: number, ry: number) => {
    const x0 = Math.max(0, Math.floor(cx - rx));
    const x1 = Math.min(size - 1, Math.ceil(cx + rx));
    const y0 = Math.max(0, Math.floor(cy - ry));
    const y1 = Math.min(size - 1, Math.ceil(cy + ry));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const nx = (x - cx) / rx;
        // Canvas y grows downward; normal maps expect +y up.
        const ny = -(y - cy) / ry;
        const q = nx * nx + ny * ny;
        if (q >= 1) continue;
        const nz = Math.sqrt(1 - q);
        const k = (y * size + x) * 4;
        d[k] = Math.round((nx * 0.5 + 0.5) * 255);
        d[k + 1] = Math.round((ny * 0.5 + 0.5) * 255);
        d[k + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      }
    }
  };

  // Fine mist, then medium beads.
  for (let i = 0; i < 9000; i++) {
    const r = 0.8 + rand() * 1.6;
    drop(rand() * size, rand() * size, r, r);
  }
  for (let i = 0; i < 1400; i++) {
    const r = 2.5 + rand() ** 2 * 9;
    drop(rand() * size, rand() * size, r, r * (1 + rand() * 0.25));
  }
  // Runs: a trail of beads with a fat drop at the bottom.
  for (let i = 0; i < 14; i++) {
    const x = rand() * size;
    let y = rand() * size * 0.5;
    const len = 120 + rand() * 360;
    const end = y + len;
    while (y < end) {
      const w = 2 + rand() * 2.5;
      drop(x + Math.sin(y * 0.05) * 2, y, w, w * 1.6);
      y += w * 1.6;
    }
    drop(x, end, 9 + rand() * 5, 12 + rand() * 6);
  }

  ctx.putImageData(img, 0, 0);
  return c;
}
