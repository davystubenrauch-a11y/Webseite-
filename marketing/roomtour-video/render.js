const { chromium } = require('playwright');
const [,, mode, out] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/rt.html'); await p.waitForTimeout(1000);
  await p.evaluate(() => new Promise(r => { const v = document.getElementById('v'); if (v.readyState >= 2) r(); else v.addEventListener('loadeddata', r); }));
  const DUR = await p.evaluate(() => window.DUR), fps = 30;
  const times = mode === 'preview' ? process.argv[4].split(',').map(Number) : [...Array(Math.round(DUR * fps)).keys()].map(i => i / fps);
  let i = 0;
  for (const t of times) {
    await p.evaluate(async ([t, f]) => { render(t, f); const v = document.getElementById('v'); const vt = window.VT; if (Math.abs(v.currentTime - vt) > 1e-3) await new Promise(r => { v.addEventListener('seeked', r, { once: true }); v.currentTime = vt; }); paint(); }, [t, i]);
    await p.screenshot({ path: `${out}/f${String(i++).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  console.log('frames', i, errs);
  await b.close();
})();
