// Renders mockup.html views to PNG. Needs a static server on the repo root:
//   python3 -m http.server 8123 --directory ..   (run from spiruli-dose/)
//   node render-mockups.mjs
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || "playwright");
const base = process.env.BASE || "http://localhost:8123/spiruli-dose/mockup.html";
const views = [
  ["hero", 1800, 1200],
  ["front", 900, 1200],
  ["left", 900, 1200],
  ["right", 900, 1200],
  ["back", 900, 1200],
];

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const [view, w, h] of views) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on("pageerror", (e) => console.error(view, e.message));
  await page.goto(`${base}?view=${view}`);
  await page.waitForFunction(() => window.done === true, null, { timeout: 120000 });
  await page.screenshot({ path: `mockup-${view}.png`, timeout: 120000 });
  await page.close();
  console.log("wrote", `mockup-${view}.png`);
}
await browser.close();
