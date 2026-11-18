// Erstellt aus betriebe.csv ein PDF mit einem persönlichen Google-Check pro Betrieb.
// Aufruf: node erstellen.js   (im Ordner marketing/print/check)
// CSV-Spalten: name;sterne;anzahl;website (ja|nein|alt);stand (Datum der Google-Abfrage)
const fs = require('fs'), path = require('path');
const {chromium} = require('playwright');
const dir = __dirname;
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rows = fs.readFileSync(path.join(dir, 'betriebe.csv'), 'utf8').trim().split(/\r?\n/).slice(1).filter(Boolean)
  .map(l => { const [name, sterne, anzahl, website, stand] = l.split(';').map(x => x.trim()); return {name, sterne, anzahl, website, stand}; });
const seite = fs.readFileSync(path.join(dir, 'seite.html'), 'utf8');
const monat = new Date().toLocaleDateString('de-DE', {month: 'long', year: 'numeric'});
const pages = rows.map(r => {
  const n = parseInt(r.anzahl, 10) || 0;
  const web = r.website === 'ja' ? ['Ja', 'gefunden'] : r.website === 'alt' ? ['Alt', 'nicht für Handys gemacht'] : ['Keine', 'bei Google verlinkt'];
  const v = {datum: 'München, im ' + monat, name: r.name, stand: r.stand, sterne: r.sterne, anzahl: n,
    anzahl_text: n < 50 ? 'Da geht mehr' : 'gute Basis', web: web[0], web_text: web[1]};
  return seite.replace(/\{(\w+)\}/g, (m, k) => k in v ? esc(v[k]) : m);
}).join('\n');
const html = fs.readFileSync(path.join(dir, 'vorlage.html'), 'utf8').replace('<!--PAGES-->', pages);
fs.writeFileSync(path.join(dir, '_druck.html'), html);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.join(dir, '_druck.html')); await p.waitForTimeout(800);
  await p.pdf({path: path.join(dir, 'Google-Check-Briefe.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true});
  await p.setViewportSize({width: 794, height: 1123});
  await (await p.$('.page')).screenshot({path: path.join(dir, 'vorschau.png')});
  console.log(rows.length + ' Brief(e) erstellt'); await b.close();
})();
