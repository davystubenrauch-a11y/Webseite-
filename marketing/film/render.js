// node render.js preview|full <outdir> [fps]   (full: 90 Bilder/s fuer echte Bewegungsunschaerfe)
const { chromium } = require('playwright');
const [,, mode, out, fpsArg] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/film.html'); await p.waitForTimeout(1000);
  const DUR = await p.evaluate(() => window.DUR), fps = +fpsArg || 90;
  const times = mode === 'preview' ? [0.9, 2.2, 3.4, 5.2, 7.6, 9.2, 9.75, 10.6, 12.4, 14.2, 15.6, 17.4, 19.4, 20.6, 22.4, 25.2] : [...Array(Math.round(DUR * fps)).keys()].map(i => i / fps);
  let i = 0;
  for (const t of times) {
    await p.evaluate(async ([t, seek]) => { render(t); if (!seek) return; for (const [id, vt] of [['vid', window.VT], ['vid2', window.VT2]]) { const v = document.getElementById(id); if (v.closest('.sc').style.opacity === '0') continue; const x = Math.min(vt, v.duration - .1); if (Math.abs(v.currentTime - x) > .02) await new Promise(r => { v.addEventListener('seeked', r, { once: true }); v.currentTime = x; }); } }, [t, mode === 'preview' || i % 3 === 0]);
    await p.screenshot({ path: `${out}/f${String(i++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: mode === 'preview' ? 80 : 93 });
  }
  console.log('frames', i, errs);
  await b.close();
})();
