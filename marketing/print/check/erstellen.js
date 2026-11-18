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
const FOOD = /café|cafe|bäckerei|backshop|metzgerei|feinkost|eiscafe|kebap|restaurant|trattoria|bistro|gasthof|gaststätte|brauhaus|kitchen|vu jaa|teatro|locanda|caminetto|sidhartha|halong|tra amici|hirschen|barocco|corso|bacio|garibaldi|naturkost|reformhaus|zuppardo/i;

function letter(r) {
  const a = findAudit(r.name);
  const hasWeb = r.website === 'ja' || !!a.website_url;
  const host = a.website_url && !/xn--/.test(a.website_url) ? new URL(a.website_url).hostname.replace(/^www\./, '') : '';
  const W = (seen, h) => ({k: 'web', h: h || 'Ihre Website arbeitet nicht so gut für Sie, wie sie könnte.', seen,
    fix: 'Eine neue Website im eigenen Design, schnell und sicher auf jedem Handy, mit Öffnungszeiten, Fotos und Anfrage-Knopf. Ihre Inhalte übernehmen wir.', price: 'ab 399 €, Hosting inklusive'});
  const BOOKOBS = {k: 'book', h: 'Ihre Kunden möchten online buchen. Bei Ihnen geht das noch nicht.',
    seen: (FOOD.test(r.name) ? 'Auf Ihrer Website kann man <b>keinen Tisch online reservieren</b>' : 'Auf Ihrer Website kann man <b>keinen Termin online buchen</b>') + ', nur anrufen oder schreiben. Viele planen abends auf dem Sofa, wenn Sie längst geschlossen haben.',
    fix: 'Eine Website mit Online-Buchung oder Reservierung, die rund um die Uhr Anfragen annimmt, ohne dass Sie ans Telefon müssen.', price: 'Paket Business, 799 €'};
  const obs = [];
  const kind = /bäckerei|backshop|café|cafe/i.test(r.name) ? 'Ihre Backwaren, Ihren Laden und Ihre Atmosphäre' : /metzgerei|feinkost|naturkost|reformhaus/i.test(r.name) ? 'Ihre Produkte, Ihren Laden und Ihre Atmosphäre' : FOOD.test(r.name) ? 'Ihre Gerichte, Ihr Lokal und Ihre Atmosphäre' : 'Ihre Arbeit und Ihr Geschäft';
  const sw = a.site_weakness || '';
  let webCard = hasWeb ? 'Ja' : 'Keine';
  if (!hasWeb) obs.push({k: 'web', h: 'Ihre Kunden suchen Sie im Internet. Eine Website finden sie nicht.',
    seen: 'Bei Google ist <b>keine Website</b> verlinkt. Wer Öffnungszeiten, Angebot oder Fotos sucht, findet nur das Nötigste und klickt oft weiter.',
    fix: 'Eine eigene Website, die auf jedem Handy schnell lädt: Angebot, Öffnungszeiten, Fotos und ein Knopf zum Anrufen oder Anfragen. Online in höchstens 7 Tagen.', price: 'ab 399 €, Hosting inklusive'});
  else if (a.note === 'dead') { webCard = 'Nicht erreichbar'; obs.push(W('Bei Google ist die Adresse <b>' + host + '</b> verlinkt. Als wir sie am ' + r.stand + ' aufrufen wollten, war sie <b>nicht erreichbar</b>. Neue Gäste finden dann weder Öffnungszeiten noch Angebot.', 'Wer Sie bei Google anklickt, landet im Leeren.')); }
  else if (a.note === 'cert') obs.push(W('Beim Aufruf von <b>' + host + '</b> zeigte uns der Browser am ' + r.stand + ' eine <b>Sicherheitswarnung zum Zertifikat</b>. An dieser Stelle brechen viele Besucher ab.'));
  else if (a.note === 'demo') obs.push(W('Auf Ihrer Website steht der englische Satz <b>„This is the free demo result“</b>, offenbar ein Rest des Programms, mit dem die Seite erstellt wurde. Auf neue Kunden wirkt das unfertig.'));
  else if (a.https === false) obs.push(W('Ihre Website ist <b>nicht verschlüsselt</b> (http statt https). Viele Browser zeigen deshalb „Nicht sicher“ neben Ihrer Adresse.'));
  else if (a.mobile_ok === false) obs.push(W('Ihre Website ist <b>auf dem Handy schwer zu bedienen</b>. Die meisten Menschen suchen heute mit dem Handy und entscheiden in Sekunden.'));
  else if (/Termin|Online-Buchung|nur Telefon/.test(sw) || (a.online_booking === false && BOOK.test(r.name))) obs.push(BOOKOBS);
  else if (/veraltet|rudimentär|knapp|wenige Informationen|Slider/.test(sw)) obs.push(W('Ihre Website zeigt bisher <b>nur das Nötigste</b>' + (/Öffnungszeiten/.test(sw) ? ', Öffnungszeiten haben wir auf der Startseite nicht gefunden' : '') + '. Wer Sie noch nicht kennt, findet dort wenig, was ihn überzeugt.'));
  else if (/Öffnungszeiten/.test(sw) && !/festen|404/.test(sw)) obs.push(W('Auf Ihrer Startseite sind <b>keine Öffnungszeiten</b> zu sehen. Genau danach suchen die meisten zuerst.'));
  if (hasWeb && webCard === 'Ja' && obs.length) webCard = 'Ausbaufähig';
  if (r.rating < 4.3 || r.anzahl < 50) obs.push({k: 'nfc', h: 'Ihre Kunden lieben Sie. Google weiß es nur noch nicht.',
    seen: r.anzahl < 50 ? 'Bei Google stehen <b>' + r.anzahl + ' Bewertung' + (r.anzahl === 1 ? '' : 'en') + '</b>. Ihre Stammkunden kennen Sie gut, neue Kunden entscheiden aber nach Sternen und Anzahl.'
      : '<b>' + r.sterne + ' Sterne</b>: Neue Kunden schauen bei Google zuerst auf den Schnitt. Zufriedene Kunden bewerten selten von selbst, unzufriedene schon.',
    fix: 'Eine kleine NFC-Platte an Kasse oder Tisch: Ihre Kunden tippen mit dem Handy darauf und landen direkt bei Ihrer Bewertung. So kommen die Stimmen der Zufriedenen dazu.', price: 'ab 12,90 € pro Platte'});
  const igF = a.instagram_followers, ig = a.instagram_handle;
  const rund = n => n < 100 ? 'knapp ' + n : 'rund ' + (n < 1000 ? Math.round(n / 10) * 10 : Math.round(n / 100) * 100).toLocaleString('de-DE');
  const igNone = !ig && !!a.website_url && a.instagram_link_on_site === false;
  const FILM = 'Kurze Werbefilme aus Ihren eigenen Fotos, die ' + kind + ' zeigen, fertig zum Posten für Instagram und TikTok.';
  if (igNone) obs.push({k: 'ig', h: 'Sie sind in Solln bekannt. Auf Instagram noch nicht.',
    seen: 'Ein <b>Instagram-Profil</b> haben wir nicht gefunden, auch keinen Link auf Ihrer Website. Dort entdecken viele aus dem Viertel neue Lieblingsorte.', fix: FILM, price: 'ab 199 €, fertig in 48 Stunden'});
  else if (ig && igF != null && igF < 1000) obs.push({k: 'ig', h: 'Sie sind in Solln bekannt. Auf Instagram noch nicht.',
    seen: 'Ihrem Instagram-Profil <b>@' + esc(ig) + '</b> folgen <b>' + rund(igF) + ' Menschen</b>. Kurze Filme (Reels) zeigt Instagram oft mehr Leuten als einzelne Fotos.', fix: FILM, price: 'ab 199 €, fertig in 48 Stunden'});
  else if (ig && igF >= 1000) obs.push({k: 'film', h: r.sterne + ' Sterne bei Google, ' + rund(igF) + ' Follower auf Instagram. Da geht noch mehr.',
    seen: 'Auf Instagram folgen Ihnen schon <b>' + rund(igF) + ' Menschen</b> (@' + esc(ig) + '). Mit kurzen Filmen erreichen Sie dort auch die, die Sie noch nicht kennen.',
    fix: 'Werbefilme aus Ihren eigenen Fotos, mit ruhiger Kamerafahrt, Licht und Musik, fertig zum Posten. Ihr Geschäft bleibt echt, nichts wird erfunden.', price: 'ab 199 €, fertig in 48 Stunden'});
  if (obs.length < 2 && !obs.some(o => o.k === 'film' || o.k === 'ig')) obs.push({k: 'film', h: r.sterne + ' Sterne bei ' + r.anzahl + ' Bewertungen. Zeigen Sie es auch auf Instagram.',
    seen: 'Ihre Bewertungen sind stark. Neue Kunden sehen online aber vor allem <b>Bilder und kurze Filme</b>, bevor sie zum ersten Mal kommen.',
    fix: 'Ein kurzer Werbefilm aus Ihren eigenen Fotos für Instagram, TikTok und Ihre Website. Ihr Geschäft bleibt echt, wir sorgen für Kamerafahrt, Licht und Musik.', price: 'ab 199 €, fertig in 48 Stunden'});
  if (obs.length < 2 && !obs.some(o => o.k === 'nfc')) obs.push({k: 'nfc2', h: '', seen: 'Viele zufriedene Kunden würden gern bewerten, vergessen es aber, sobald sie zur Tür hinaus sind.',
    fix: 'Eine NFC-Platte an der Kasse: Antippen genügt, und der Kunde ist direkt auf Ihrer Bewertungsseite.', price: 'ab 12,90 € pro Platte'});
  if (obs.length < 2) obs.push(W('Ihre Website ist solide. Eine neue Seite lohnt sich, wenn Sie mehr Anfragen oder Buchungen direkt darüber bekommen möchten.', ''));
  const top = obs.slice(0, 3);
  const lob = r.rating >= 4.6 ? 'Mit ' + r.sterne + ' Sternen machen Sie offensichtlich vieles richtig. Genau deshalb ist uns aufgefallen, was online noch fehlt.'
    : r.rating >= 4.3 ? 'Ihre Kunden schätzen Sie, das zeigen Ihre Bewertungen. Online geht trotzdem mehr.' : 'Online wirkt Ihr Geschäft schwächer, als es ist. Das lässt sich ändern.';
  const obsHtml = top.map((o, i) => '<div class="o"><i>' + (i + 1) + '</i><div class="seen"><small>Aufgefallen</small>' + o.seen + '</div><div class="fix"><small>Unsere Lösung</small>' + o.fix + '<span>' + o.price + '</span></div></div>').join('');
  const kurz = r.name.length > 28 ? 'Sie' : esc(r.name);
  const cell = (s, b, t) => '<div><small>' + s + '</small><strong>' + b + '</strong><span>' + t + '</span></div>';
  let card = cell('Google', '<i>★</i> ' + esc(r.sterne), r.anzahl + ' Bewertung' + (r.anzahl === 1 ? '' : 'en'))
    + cell('Website', webCard, hasWeb ? (host || 'eigene Website') : 'bei Google verlinkt');
  if (ig) card += cell('Instagram', igF != null ? rund(igF).replace(/^(rund|knapp) /, '') : 'Ja', igF != null ? 'Follower, @' + esc(ig) : '@' + esc(ig));
  else if (igNone) card += cell('Instagram', 'Nicht gefunden', 'kein Link auf der Website');
  return {datum: 'München, im ' + monat, name: esc(r.name), kurz, stand: esc(r.stand), card,
    headline: esc(top.find(o => o.h).h || 'Online geht für Sie noch mehr.'), lob, obs: obsHtml};
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
