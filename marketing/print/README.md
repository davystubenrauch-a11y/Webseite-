# Kampagne „Google weiß es nur noch nicht“

Ein persönlicher Google-Check pro Betrieb mit **einer passenden Empfehlung**: keine Website → Website · unter 100 Bewertungen → NFC-Platte · sonst → Werbefilm. Die anderen beiden Angebote stehen klein darunter. Abschluss: „Wir kommen kurz vorbei und zeigen es Ihnen“ (Vorführplatte nehmen wir wieder mit, keine Testplatten verschenken, weil sie aufgeklebt werden).

1. **Liste:** 150 Betriebe im Viertel mit Name, Sternen, Anzahl Bewertungen und Website (ja/nein/alt) in `check/betriebe.csv` eintragen (Claude kann sie aus Google Maps vorbereiten).
2. **Briefe erstellen:** im Ordner `check` `node erstellen.js` ausführen → `Google-Check-Briefe.pdf` (eine Seite pro Betrieb, mit dessen echten Zahlen).
3. **Umschlag von Hand beschriften:** Name des Betriebs + „Wir haben Sie gegoogelt. Das Ergebnis liegt bei.“
4. **Im Brief von Hand eintragen**, wann ihr vorbeikommt (z. B. „Donnerstag, 21.11.“). Unterschrift ist nicht nötig, die Namen stehen gedruckt da („Ihre Nachbarn aus Solln“).
5. **Einwerfen** (nicht bei „Keine Werbung“), **3–5 Tage später wirklich vorbeigehen**, mit Vorführplatte und Beispielen auf dem Handy.
6. Für Läden ohne Brief: Flyer `FOAV-Flyer-A5-mit-2mm-Beschnitt.pdf` mit derselben Botschaft.

Regeln: nur echte, öffentliche Zahlen aus Google Maps mit Datum; keine Mitbewerber nennen; keine Bewertungen gegen Belohnung.

## Solln-Briefe mit Einzelprüfung (18.11.2026)
- `check/audit.json`: je Betrieb Website (https, Handy, Online-Buchung, Öffnungszeiten), Instagram-Profil und Follower (Firecrawl-Recherche, Follower gerundet).
- Heikle Befunde vor dem Druck selbst nachgeprüft: CORSO-Adresse nicht erreichbar, Iris Horbach Zertifikatswarnung, Fliesen Bischofer „This is the free demo result“. Falsche Meldungen („lädt nicht“ bei Kisslinger und Schott, 404-Links) entfernt.
- Nicht mehr anschreiben: Die Spielzeugkiste (geschlossen seit 29.06.2026), Stickerei Pötzl (übernommen von Stickerei Keinath). In `betriebe.csv` mit `#` auskommentiert.
- Regel: Ein Negativpunkt kommt nur in den Brief, wenn er geprüft ist. Ohne Prüfung wird nichts behauptet (Instagram-Kästchen fällt dann weg).
- Neu erzeugen: `cd marketing/print/check && node erstellen.js`.
