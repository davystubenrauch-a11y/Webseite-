// Rendert die SVG-Quellen aus illustrations.mjs als PNG nach assets/images/.
// Aufruf: node scripts/art/render.mjs   (benötigt Playwright: npm i -D playwright)
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import * as art from './illustrations.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const out = (...p) => path.join(root, 'assets', 'images', ...p);

const jobs = [
  ...Object.entries(art.categories).map(([name, svg]) => ({ svg, file: out('categories', `${name}.png`), w: 1200, h: 900, jpegLike: false })),
  { svg: art.icon, file: out('icon.png'), w: 1024, h: 1024 },
  { svg: art.adaptiveForeground, file: out('android-icon-foreground.png'), w: 1024, h: 1024, transparent: true },
  { svg: art.adaptiveBackground, file: out('android-icon-background.png'), w: 1024, h: 1024 },
  { svg: art.adaptiveMonochrome, file: out('android-icon-monochrome.png'), w: 1024, h: 1024, transparent: true },
  { svg: art.splash, file: out('splash-icon.png'), w: 1024, h: 1024, transparent: true },
  { svg: art.favicon, file: out('favicon.png'), w: 48, h: 48 },
  { svg: art.notificationIcon, file: out('notification-icon.png'), w: 96, h: 96, transparent: true },
];

mkdirSync(out('categories'), { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();
for (const job of jobs) {
  await page.setViewportSize({ width: job.w, height: job.h });
  const html = `<html><body style="margin:0;background:transparent">${job.svg.replace('<svg ', `<svg style="width:${job.w}px;height:${job.h}px;display:block" `)}</body></html>`;
  await page.setContent(html);
  await page.screenshot({ path: job.file, omitBackground: !!job.transparent, clip: { x: 0, y: 0, width: job.w, height: job.h } });
  console.log('✓', path.relative(root, job.file));
}
await browser.close();

// Kategorie-Illustrationen zusätzlich als kompaktes JPEG ablegen (kleineres App-Bundle)
for (const file of readdirSync(out('categories')).filter((f) => f.endsWith('.png'))) {
  const src = out('categories', file);
  execFileSync('python3', ['-c', `from PIL import Image; Image.open(${JSON.stringify(src)}).convert('RGB').save(${JSON.stringify(src.replace(/\.png$/, '.jpg'))}, quality=84, optimize=True, progressive=True)`]);
  unlinkSync(src);
}
console.log('✓ Kategorie-Illustrationen nach JPEG konvertiert');
