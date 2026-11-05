const { chromium } = require('playwright');
const [,, mode, out] = process.argv; // mode: preview | full
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/ad.html'); await p.waitForTimeout(800);
  await p.evaluate(() => new Promise(r => { const v = document.getElementById('vid'); if (v.readyState >= 2) r(); else v.addEventListener('loadeddata', r); }));
  const DUR = await p.evaluate(() => window.DUR), fps = 30;
  const times = mode === 'preview' ? [1.5, 4, 5.6, 8, 12, 14.5, 18.5, 23.5] : [...Array(Math.round(DUR * fps)).keys()].map(i => i / fps);
  let i = 0;
  for (const t of times) {
    await p.evaluate(async (t) => { render(t); const v = document.getElementById('vid'); const vt = Math.min(window.VT * 0.9, v.duration - .05); if (Math.abs(v.currentTime - vt) > 1e-3) { await new Promise(r => { v.addEventListener('seeked', r, { once: true }); v.currentTime = vt; }); } }, t);
    await p.screenshot({ path: `${out}/f${String(i++).padStart(4, '0')}.${mode === 'preview' ? 'png' : 'jpg'}`, ...(mode === 'preview' ? {} : { type: 'jpeg', quality: 92 }) });
  }
  console.log('frames', i, errs);
  await b.close();
})();
