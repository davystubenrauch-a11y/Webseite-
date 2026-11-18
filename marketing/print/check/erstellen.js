// Erstellt aus betriebe.csv (+ optional audit.json) ein PDF mit einem persönlichen Brief pro Betrieb.
// Aufruf: node erstellen.js   (im Ordner marketing/print/check)
// betriebe.csv: name;sterne;anzahl;website (ja|nein);stand
// audit.json:   [{name, website_url, https, mobile_ok, copyright_year, online_booking, instagram_handle, instagram_followers, site_weakness}]
// Jeder Brief nennt bis zu drei konkrete Beobachtungen und daneben die passende Lösung.
const fs = require('fs'), path = require('path');
const {chromium} = require('playwright');
const dir = __dirname;
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm = s => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');
const rows = fs.readFileSync(path.join(dir, 'betriebe.csv'), 'utf8').trim().split(/\r?\n/).slice(1).filter(l => l && !l.startsWith('#'))
  .map(l => { const [name, sterne, anzahl, website, stand] = l.split(';').map(x => x.trim()); return {name, sterne, rating: parseFloat(sterne.replace(',', '.')), anzahl: parseInt(anzahl, 10) || 0, website, stand}; });
let audit = [];
try { audit = JSON.parse(fs.readFileSync(path.join(dir, 'audit.json'), 'utf8')); } catch (e) {}
const findAudit = n => { const k = norm(n); return audit.find(a => norm(a.name) === k) || audit.find(a => k.includes(norm(a.name)) || norm(a.name).includes(k)) || {}; };
const seite = fs.readFileSync(path.join(dir, 'seite.html'), 'utf8');
const monat = new Date().toLocaleDateString('de-DE', {month: 'long', year: 'numeric'});
const BOOK = /friseur|salon|coiffeur|hair|kosmetik|beauty|nagel|spa|massage|restaurant|trattoria|bistro|gasthof|gaststätte|brauhaus|kitchen|vu jaa|teatro|locanda|caminetto|sidhartha|halong|tra amici|hirschen|barocco|corso|dog|thai/i;
const FOOD = /café|cafe|bäckerei|backshop|metzgerei|feinkost|fisch|eis|kebap|restaurant|trattoria|bistro|gasthof|gaststätte|brauhaus|kitchen|vu jaa|teatro|locanda|caminetto|sidhartha|halong|tra amici|hirschen|barocco|corso|bacio|garibaldi|naturkost|reformhaus|zuppardo/i;

function letter(r) {
  const a = findAudit(r.name);
  const hasWeb = r.website === 'ja' || !!a.website_url;
  const obs = []; // {key, seen, fix, price}
  const kind = FOOD.test(r.name) ? 'Ihre Gerichte, Ihren Laden und Ihre Atmosphäre' : 'Ihre Arbeit und Ihr Geschäft';
  if (!hasWeb) obs.push({k: 'web', h: 'Ihre Kunden suchen Sie im Internet. Eine Website finden sie nicht.',
    seen: 'Bei Google ist <b>keine Website</b> verlinkt. Wer Öffnungszeiten, Angebot oder Fotos sucht, findet nur das Nötigste und klickt oft weiter.',
    fix: 'Eine eigene Website, die auf jedem Handy schnell lädt: Angebot, Öffnungszeiten, Fotos und ein Knopf zum Anrufen oder Anfragen. Online in höchstens 7 Tagen.', price: 'ab 399 €, Hosting inklusive'});
  else {
    const p = [];
    if (a.mobile_ok === false) p.push('ist auf dem Handy schwer zu bedienen');
    if (a.https === false) p.push('ist nicht verschlüsselt, manche Browser zeigen dann „Nicht sicher“');
    if (a.copyright_year && a.copyright_year <= 2021) p.push('wirkt nicht mehr aktuell (Stand ' + a.copyright_year + ')');
    if (p.length) obs.push({k: 'web', h: 'Ihre Website arbeitet nicht so gut für Sie, wie sie könnte.',
      seen: 'Ihre Website ' + p.join(' und ') + '. Die meisten Menschen suchen heute mit dem Handy und entscheiden in Sekunden.',
      fix: 'Eine neue Website im eigenen Design, schnell und sicher auf jedem Handy. Ihre Inhalte übernehmen wir. Online in höchstens 7 Tagen.', price: 'ab 399 €, Hosting inklusive'});
    else if (a.online_booking === false && BOOK.test(r.name)) obs.push({k: 'book', h: 'Ihre Kunden möchten online buchen. Bei Ihnen geht das noch nicht.',
      seen: 'Auf Ihrer Website kann man <b>keinen Termin oder Tisch online buchen</b>. Viele planen abends auf dem Sofa, wenn Sie längst geschlossen haben.',
      fix: 'Eine Website mit Online-Buchung oder Reservierung, die rund um die Uhr Anfragen annimmt, ohne dass Sie ans Telefon müssen.', price: 'Paket Business, 799 €'});
    else if (a.site_weakness) obs.push({k: 'web', h: 'Ihre Website arbeitet nicht so gut für Sie, wie sie könnte.',
      seen: 'Auf Ihrer Website ist uns aufgefallen: ' + esc(a.site_weakness) + '.',
      fix: 'Eine neue Website im eigenen Design, schnell auf jedem Handy, mit allem, was neue Kunden suchen.', price: 'ab 399 €, Hosting inklusive'});
  }
  if (r.rating < 4.3 || r.anzahl < 50) obs.push({k: 'nfc', h: 'Ihre Kunden lieben Sie. Google weiß es nur noch nicht.',
    seen: r.anzahl < 50 ? 'Bei Google stehen <b>' + r.anzahl + ' Bewertungen</b>. Ihre Stammkunden kennen Sie gut, neue Kunden entscheiden aber nach Sternen und Anzahl.'
      : '<b>' + r.sterne + ' Sterne</b>: Neue Kunden schauen bei Google zuerst auf den Schnitt. Zufriedene Kunden bewerten selten von selbst, unzufriedene schon.',
    fix: 'Eine kleine NFC-Platte an Kasse oder Tisch: Ihre Kunden tippen mit dem Handy darauf und landen direkt bei Ihrer Bewertung. So kommen die Stimmen der Zufriedenen dazu.', price: 'ab 12,90 € pro Platte'});
  const igF = a.instagram_followers;
  const checked = Object.keys(a).length > 0;
  if (checked && !a.instagram_handle) obs.push({k: 'ig', h: 'Sie sind in Solln bekannt. Auf Instagram noch nicht.',
    seen: 'Ein <b>eigenes Instagram-Profil</b> haben wir nicht gefunden. Dort entdecken viele Menschen aus dem Viertel neue Lieblingsorte.',
    fix: 'Kurze Werbefilme aus Ihren eigenen Fotos, die ' + kind + ' zeigen, fertig zum Posten für Instagram und TikTok. Echt, ohne gestellte Bilder.', price: 'ab 199 €, fertig in 48 Stunden'});
  else if (igF != null && igF < 1000) obs.push({k: 'ig', h: 'Sie sind in Solln bekannt. Auf Instagram noch nicht.',
    seen: 'Ihr Instagram-Profil hat <b>' + igF + ' Follower</b>. Kurze Filme erreichen dort meist mehr Menschen als einzelne Fotos.',
    fix: 'Kurze Werbefilme aus Ihren eigenen Fotos, die ' + kind + ' zeigen, fertig zum Posten. Echt, ohne gestellte Bilder.', price: 'ab 199 €, fertig in 48 Stunden'});
  if (obs.length < 2) obs.push({k: 'film', h: r.sterne + ' Sterne bei ' + r.anzahl + ' Bewertungen. Zeigen Sie es auch auf Instagram.',
    seen: 'Ihre Bewertungen sind stark. Neue Kunden sehen online aber vor allem <b>Bilder und kurze Filme</b>, bevor sie zum ersten Mal kommen.',
    fix: 'Ein kurzer Werbefilm aus Ihren eigenen Fotos für Instagram, TikTok und Ihre Website. Ihr Geschäft bleibt echt, wir sorgen für Kamerafahrt, Licht und Musik.', price: 'ab 199 €, fertig in 48 Stunden'});
  if (obs.length < 2) obs.push({k: 'nfc2', h: '', seen: 'Viele zufriedene Kunden würden bewerten, wenn es einfacher ginge.',
    fix: 'Eine NFC-Platte an der Kasse: Antippen genügt, und der Kunde ist auf Ihrer Bewertungsseite.', price: 'ab 12,90 € pro Platte'});
  const top = obs.slice(0, 3);
  const lob = r.rating >= 4.6 ? 'Mit ' + r.sterne + ' Sternen machen Sie offensichtlich vieles richtig. Genau deshalb ist uns aufgefallen, was online noch fehlt.'
    : r.rating >= 4.3 ? 'Ihre Kunden schätzen Sie, das zeigen Ihre Bewertungen. Online geht trotzdem mehr.' : 'Online wirkt Ihr Geschäft schwächer, als es ist. Das lässt sich ändern.';
  const obsHtml = top.map((o, i) => '<div class="o"><i>' + (i + 1) + '</i><div class="seen"><small>Aufgefallen</small>' + o.seen + '</div><div class="fix"><small>Unsere Lösung</small>' + o.fix + '<span>' + o.price + '</span></div></div>').join('');
  const kurz = r.name.length > 28 ? 'Sie' : esc(r.name);
  const igOk = !!a.instagram_handle; const checked2 = Object.keys(a).length > 0;
  return {datum: 'München, im ' + monat, name: esc(r.name), kurz, stand: esc(r.stand), sterne: esc(r.sterne), anzahl: r.anzahl,
    web: hasWeb ? (top.some(o => o.k === 'web' || o.k === 'book') ? 'Ausbaufähig' : 'Ja') : 'Keine', web_text: hasWeb ? (a.website_url ? 'eigene Website' : 'bei Google verlinkt') : 'bei Google verlinkt',
    ig: igOk ? (igF != null ? igF.toLocaleString('de-DE') : 'Ja') : (checked2 ? 'Nicht gefunden' : '–'), ig_text: igOk ? (igF != null ? 'Follower' : 'Profil vorhanden') : (checked2 ? 'eigenes Profil' : 'nicht geprüft'),
    headline: esc(top[0].h || 'Online geht für Sie noch mehr.'), lob, obs: obsHtml};
}
const pages = rows.map(r => { const v = letter(r); return seite.replace(/\{(\w+)\}/g, (m, k) => k in v ? v[k] : m); }).join('\n');
const html = fs.readFileSync(path.join(dir, 'vorlage.html'), 'utf8').replace('<!--PAGES-->', pages);
fs.writeFileSync(path.join(dir, '_druck.html'), html);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.join(dir, '_druck.html')); await p.waitForTimeout(1000);
  await p.pdf({path: path.join(dir, 'Google-Check-Briefe.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true});
  await p.setViewportSize({width: 794, height: 1123});
  const ps = await p.$$('.page');
  const over = await p.$$eval('.page', x => x.filter(e => e.scrollHeight > e.clientHeight + 2).map(e => e.querySelector('.for b').textContent));
  for (const [i, f] of [[0, 'vorschau.png'], [Math.floor(ps.length / 2), 'vorschau-2.png'], [ps.length - 1, 'vorschau-3.png']]) await ps[i].screenshot({path: path.join(dir, f)});
  console.log(rows.length + ' Brief(e), Audit-Daten für ' + audit.length + ', überlaufend: ' + (over.join(', ') || 'keine')); await b.close();
})();
