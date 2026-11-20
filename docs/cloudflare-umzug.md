# Umzug foav.de: Vercel → Cloudflare Workers

Stand 20.11.2026. Code ist fertig und getestet (lokal im Workers-Runtime: alle Seiten, Kontaktformular,
Fragebögen, Foto-Upload auf R2, Weiterleitungen). **Vercel bleibt live, bis Schritt 4 erledigt ist.**

## Was sich im Code geändert hat
- `@opennextjs/cloudflare` + `wrangler`; Next auf 16.4.6 (Mindestversion des Adapters).
- `wrangler.jsonc` (Worker `foav`, R2-Bucket `foav-uploads` als `UPLOADS`), `open-next.config.ts`.
- `worker.ts`: liefert `/`, `/websites`, `/ki-shots`, `/renderings`, `/nfc-platten`, `/links`, `/demo/spiruli`,
  `/entwurf/<slug>` direkt aus `public/` (OpenNext kann nicht auf statische Dateien umschreiben) und leitet
  `foav.de` → `https://www.foav.de` weiter. **Neue Seiten in `next.config.mjs` UND `worker.ts` eintragen.**
- Foto-Upload: statt Vercel Blob jetzt R2 (`lib/storage.ts`, `PUT /api/upload?path=…`, Abruf `/api/datei/<key>`).
  Notfall-Eingang (wenn Resend ausfällt): JSON in R2 unter `eingang/`.
- Stripe mit `fetch` + Web Crypto (`constructEventAsync`), läuft auf Workers.
- Vercel Web Analytics entfernt (Skript + Datenschutz), Datenschutz nennt Cloudflare als Hoster und R2.

## Was die Gründer einmalig tun müssen
Aus der Claude-Sitzung lassen sich die Dateien nicht hochladen (der Sitzungs-Proxy ersetzt das
Upload-Token von Cloudflare). Deshalb baut Cloudflare die Seite selbst aus GitHub, wie bisher Vercel:

1. **Repo verbinden:** dash.cloudflare.com → Workers & Pages → Erstellen → „Repository importieren“ →
   GitHub verbinden → `davystubenrauch-a11y/Webseite-`.
   - Projektname: **foav-website** (muss so heißen, steht in `wrangler.jsonc`; „foav“ ist durch einen leeren Fehlversuch belegt)
   - Produktionszweig: `claude/sharp-cerf-sdkvuk` (zum Testen; nach dem Umzug `claude/hopeful-goodall-m39gmd`)
   - Build-Befehl: `npx opennextjs-cloudflare build`
   - Deploy-Befehl: `npx opennextjs-cloudflare deploy`
2. **Geheimnisse eintragen:** Worker `foav-website` → Einstellungen → Variablen und Geheimnisse → Typ „Geheimnis“:
   `RESEND_API_KEY` (aus Resend oder Vercel → Settings → Environment Variables),
   `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (sobald Stripe eingerichtet ist).
   Danach einmal neu bereitstellen (Deployments → „Erneut bereitstellen“).
3. **Testen** unter `https://foav-website.aged-bonus-c590.workers.dev` – Claude prüft das in einer Sitzung
   (Handy/Computer, Formular, Upload, `/api/status` muss `resend_ok: true` zeigen).
4. **Domain umziehen:** Cloudflare → „Domain hinzufügen“ → `foav.de` (Free-Tarif). Cloudflare liest die
   DNS-Einträge ein – prüfen, dass **MX (Checkdomain-Mail), `send`, `rsend`, `resend._domainkey`, `_dmarc`**
   und SPF-TXT dabei sind. Dann bei Checkdomain die **Nameserver** auf die zwei von Cloudflare umstellen.
   Danach Worker `foav-website` → Einstellungen → Domains → `www.foav.de` und `foav.de` als benutzerdefinierte
   Domain hinzufügen (ersetzt die alten A/CNAME-Einträge auf Vercel).
5. **Stripe-Webhook** bleibt `https://www.foav.de/api/stripe/webhook` (keine Änderung).
6. Ein paar Tage beobachten, dann Vercel-Projekt löschen und Produktionszweig in Cloudflare auf den
   Hauptzweig umstellen.

## Lokal
- `npm run preview` – Build + Vorschau im echten Workers-Runtime (R2 lokal simuliert).
- `npm run dev` – wie bisher, mit lokalen Bindings.
