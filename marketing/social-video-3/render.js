// node render.js preview|full <outdir> [fps]
const { chromium } = require('playwright');
const [,, mode, out, fpsArg] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/ad.html'); await p.waitForTimeout(900);
  const DUR = await p.evaluate(() => window.DUR), fps = +fpsArg || 90;
  console.log(JSON.stringify(await p.evaluate(() => window.MARKS)));
  const times = mode === 'preview' ? [0, .6, 1.6, 2.9, 4.4, 4.95, 5.4, 7.0, 7.56, 7.9, 9.4, 10.9, 12.7, 13.6, 15.2, 17.9] : [...Array(Math.round(DUR * fps)).keys()].map(i => i / fps);
  let i = 0;
  for (const t of times) { await p.evaluate((t) => render(t), t); await p.screenshot({ path: `${out}/f${String(i++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: mode === 'preview' ? 80 : 93 }); }
  console.log('frames', i, errs); await b.close();
})();
