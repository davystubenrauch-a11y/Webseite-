const { chromium } = require('playwright');
const [,, mode, out] = process.argv; // mode: preview | full
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/ad.html'); await p.waitForTimeout(800);
  
  const DUR = await p.evaluate(() => window.DUR), fps = 30;
  const times = mode === 'preview' ? [0, 0.6, 1.6, 2.5, 3.05, 3.9, 4.3, 5.8, 6.7, 7.6, 8.7, 9.9, 11.6, 12.4, 13.5, 13.9] : [...Array(Math.round(DUR * fps)).keys()].map(i => i / fps);
  let i = 0;
  for (const t of times) {
    await p.evaluate((t) => render(t), t);
    await p.screenshot({ path: `${out}/f${String(i++).padStart(4, '0')}.${mode === 'preview' ? 'png' : 'jpg'}`, ...(mode === 'preview' ? {} : { type: 'jpeg', quality: 92 }) });
  }
  console.log('frames', i, errs);
  await b.close();
})();
