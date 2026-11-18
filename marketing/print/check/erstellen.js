// Erstellt aus betriebe.csv ein PDF mit einem persönlichen Google-Check pro Betrieb.
// Aufruf: node erstellen.js   (im Ordner marketing/print/check)
// CSV-Spalten: name;sterne;anzahl;website (ja|nein);stand (Datum der Google-Abfrage)
// Die Empfehlung hängt von den Zahlen ab: keine Website -> Website, unter 100 Bewertungen -> NFC-Platte, sonst -> Werbefilm.
const fs = require('fs'), path = require('path');
const {chromium} = require('playwright');
const dir = __dirname, M = 'file:///home/user/Webseite-/public/';
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rows = fs.readFileSync(path.join(dir, 'betriebe.csv'), 'utf8').trim().split(/\r?\n/).slice(1).filter(l => l && !l.startsWith('#'))
  .map(l => { const [name, sterne, anzahl, website, stand] = l.split(';').map(x => x.trim()); return {name, sterne, anzahl: parseInt(anzahl, 10) || 0, website, stand}; });
const seite = fs.readFileSync(path.join(dir, 'seite.html'), 'utf8');
const monat = new Date().toLocaleDateString('de-DE', {month: 'long', year: 'numeric'});

const OFFER = {
  web: {title: 'Eine eigene Website, die Anfragen bringt.', text: 'Schnell auf jedem Handy, mit Ihren Öffnungszeiten, Ihrem Angebot und einem Knopf zum Anrufen, Reservieren oder Buchen. Online in höchstens 7 Tagen.', price: 'Ab 399 € Festpreis · Hosting inklusive, kein Abo',
        img: M + 'media/ref-spiruli-desk-top.jpg', cls: 'photo', note: '<small>Unsere Referenz SPIRULI</small>',
        short: 'Eine neue Website', shortText: 'Ist Ihre Website älter oder auf dem Handy mühsam? Wir machen sie neu, ab 399 €.'},
  nfc: {title: 'Ein Antippen, und Ihr Kunde ist auf Ihrer Bewertungsseite.', text: 'Eine kleine Platte an Kasse oder Tisch. Kunden halten ihr Handy daran und landen direkt bei Ihrer Google-Bewertung. Ohne App, auf iPhone und Android, auf Wunsch mit Ihrem Logo.', price: 'Ab 12,90 € pro Platte',
        img: M + 'media/disc-weiss.svg', cls: 'disc', note: '',
        short: 'Mehr Google-Bewertungen', shortText: 'Mit einer NFC-Platte an der Kasse, ab 12,90 €.'},
  film: {title: 'Ein Werbefilm aus Ihren eigenen Fotos.', text: 'Für Instagram, TikTok oder Ihre Website. Wir machen aus Ihren Handyfotos einen kurzen Film mit Kamerafahrt, Licht, Musik und Text. Ihre Räume und Produkte bleiben echt.', price: 'Ab 199 € · fertig in 48 Stunden',
        img: M + 'images/ki-videos/spot-start.jpg', cls: 'photo tall', note: '<small>Beispiel, mit KI erstellt</small>',
        short: 'Werbefilme für Social Media', shortText: 'Aus Ihren Fotos, für Instagram und TikTok, ab 199 €.'}
};

const pages = rows.map(r => {
  const noWeb = r.website !== 'ja';
  let main, headline, why;
  if (noWeb) {
    main = 'web';
    headline = 'Ihre Kunden suchen Sie im Internet. Eine Website finden sie nicht.';
    why = 'Wer Sie nicht kennt, sucht zuerst auf dem Handy: Öffnungszeiten, Angebot, Fotos. Bei Google ist für Sie <b>keine Website verlinkt</b>. Viele entscheiden sich dann für den nächsten Treffer.';
  } else if (r.anzahl < 100) {
    main = 'nfc';
    headline = 'Ihre Kunden lieben Sie. Google weiß es nur noch nicht.';
    why = 'Zufriedene Kunden kommen wieder, aber <b>bewerten vergessen sie meistens</b>. Wer neu im Viertel ist, entscheidet nach Sternen und Anzahl, bevor er Ihren Laden je gesehen hat.';
  } else {
    main = 'film';
    headline = r.sterne + ' Sterne bei ' + r.anzahl + ' Bewertungen. Zeigen Sie es auch auf Instagram.';
    why = 'Ihre Kunden sind begeistert, das zeigen Ihre Bewertungen. Auf Instagram und TikTok entdecken neue Kunden aber vor allem <b>Bilder und kurze Filme</b>. Genau die fehlen den meisten Betrieben im Viertel.';
  }
  const others = ['web', 'nfc', 'film'].filter(k => k !== main);
  const o = OFFER[main];
  const v = {datum: 'München, im ' + monat, name: esc(r.name), stand: esc(r.stand), sterne: esc(r.sterne), anzahl: r.anzahl,
    anzahl_text: r.anzahl < 50 ? 'Da geht mehr' : r.anzahl < 100 ? 'gute Basis' : 'stark', web: noWeb ? 'Keine' : 'Ja', web_text: noWeb ? 'bei Google verlinkt' : 'gefunden',
    headline: esc(headline), why, p_title: o.title, p_text: o.text, p_price: o.price, p_img: o.img, p_cls: o.cls, p_note: o.note,
    o1_title: OFFER[others[0]].short, o1_text: OFFER[others[0]].shortText, o2_title: OFFER[others[1]].short, o2_text: OFFER[others[1]].shortText};
  return seite.replace(/\{(\w+)\}/g, (m, k) => k in v ? v[k] : m);
}).join('\n');
const html = fs.readFileSync(path.join(dir, 'vorlage.html'), 'utf8').replace('<!--PAGES-->', pages);
fs.writeFileSync(path.join(dir, '_druck.html'), html);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.join(dir, '_druck.html')); await p.waitForTimeout(1000);
  await p.pdf({path: path.join(dir, 'Google-Check-Briefe.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true});
  await p.setViewportSize({width: 794, height: 1123});
  const ps = await p.$$('.page');
  const over = await p.$$eval('.page', x => x.filter(e => e.scrollHeight > e.clientHeight + 2).length);
  for (const [i, f] of [[0, 'vorschau.png'], [Math.min(1, ps.length - 1), 'vorschau-2.png'], [ps.length - 1, 'vorschau-3.png']]) await ps[i].screenshot({path: path.join(dir, f)});
  console.log(rows.length + ' Brief(e) erstellt, überlaufende Seiten: ' + over); await b.close();
})();
