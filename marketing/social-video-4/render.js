// node render.js preview|full <outdir> [fps]
const { chromium } = require('playwright');
const [,, mode, out, fpsArg] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/ad.html'); await p.waitForTimeout(900);
  const DUR = await p.evaluate(() => window.DUR), fps = +fpsArg || 90;
  console.log(JSON.stringify(await p.evaluate(() => window.M)));
  const times = mode === 'preview' ? [0, 4.6, 8.2, 8.9, 10.2, 11.25, 14.2, 16.0, 17.6, 18.0, 19.45, 19.7, 19.95, 23.4, 25.6, 27.8] : [...Array(Math.round(DUR * fps)).keys()].map(i => i / fps);
  let i = 0;
  for (const t of times) { await p.evaluate((t) => render(t), t); await p.screenshot({ path: `${out}/f${String(i++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: mode === 'preview' ? 80 : 93 }); }
  console.log('frames', i, errs); await b.close();
})();
