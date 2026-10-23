// Renders label.svg to PNG with headless Chromium.
//   node render.mjs [scale]   -> label.png (default scale 2, i.e. 3330 × 1900 px)
import { createRequire } from "module";
import { pathToFileURL } from "url";
import path from "path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || "playwright");
const scale = Number(process.argv[2] || 2);
const W = 1665 * scale;
const H = 950 * scale;
const svg = pathToFileURL(path.resolve("label.svg")).href;
const out = process.argv[3] || "label.png";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
// Open the SVG directly (file:// pages may load file:// resources) and size it to the viewport.
await page.goto(svg);
await page.evaluate(([w, h]) => {
  const el = document.documentElement;
  el.setAttribute("width", w);
  el.setAttribute("height", h);
}, [W, H]);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();
console.log("wrote", out, `${W}×${H}`);
