// Exports the full wrap-around label as PNGs for the Blender render.
//   node scripts/label-export/export.mjs OUT_DIR [scale=3]
// Needs Playwright and network access to Google Fonts on first run.
import { execFileSync } from "child_process";
import fs from "fs";
import http from "http";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || "playwright");
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const out = path.resolve(process.argv[2] || ".");
const scale = Number(process.argv[3] || 3);
const work = fs.mkdtempSync(path.join(out, "label-export-"));

execFileSync("npx", ["tsc", "lib/drawLabel.ts", "lib/code39.ts", "--target", "es2020", "--module", "es2020", "--skipLibCheck", "--outDir", path.join(work, "js")], { cwd: root, stdio: "inherit" });
const js = path.join(work, "js", "drawLabel.js");
fs.writeFileSync(js, fs.readFileSync(js, "utf8").replace('from "./code39"', 'from "./code39.js"'));
for (const f of ["swoosh.webp", "swoosh-pbr.webp"]) fs.copyFileSync(path.join(root, "public/label", f), path.join(work, f));
fs.copyFileSync(path.join(here, "export.html"), path.join(work, "export.html"));

// Fonts: same families as the site (Archivo, Josefin Sans), self-hosted for the page.
const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";
let css = "";
for (const fam of ["Archivo:wdth,wght@62..125,100..900", "Josefin+Sans:wght@300;600"]) {
  css += await (await fetch(`https://fonts.googleapis.com/css2?family=${fam}&display=swap`, { headers: { "user-agent": ua } })).text();
}
fs.writeFileSync(path.join(work, "fonts.css"), css);

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp" };
const server = http.createServer((req, res) => {
  const file = path.join(work, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!file.startsWith(work) || !fs.existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", (e) => console.error(e.message));
await page.goto(`http://localhost:${port}/export.html?scale=${scale}`);
await page.waitForFunction(() => window.result, null, { timeout: 120000 });
for (const mode of ["color", "pbr"]) {
  const data = await page.evaluate((m) => window.result[m], mode);
  fs.writeFileSync(path.join(out, `label-${mode}.png`), Buffer.from(data.split(",")[1], "base64"));
}
await browser.close();
server.close();
fs.rmSync(work, { recursive: true });
console.log("wrote", path.join(out, "label-color.png"), path.join(out, "label-pbr.png"));
