# Gabelmatch 🍴

**„Was essen wir heute?“ – gemeinsam per Swipe entschieden.**
Paare, WGs und Familien treten einer Gruppe bei, jede:r wischt auf dem eigenen Handy durch Gerichte. Mögen alle aktiven Mitglieder dasselbe Gericht, gibt es ein **Match** – live bei allen gleichzeitig, mit Animation und Push-Benachrichtigung.

| | |
|---|---|
| **App** | Expo SDK 58 (React Native 0.88, TypeScript, Expo Router, React Compiler) |
| **Backend** | Supabase (Auth, Postgres, Realtime, Row Level Security) |
| **Push** | Expo Notifications + Expo Push API (aus der Datenbank via `pg_net`) |
| **Builds** | EAS Build / EAS Submit |
| **Sprachen** | Deutsch (Hauptsprache), Englisch |

---

## Inhalt

1. [Was ICH noch tun muss – Schritt für Schritt](#1-was-ich-noch-tun-muss--schritt-für-schritt)
2. [Entwicklung & Tests](#2-entwicklung--tests)
3. [Funktionen](#3-funktionen)
4. [Architektur & Projektstruktur](#4-architektur--projektstruktur)
5. [Getroffene Entscheidungen](#5-getroffene-entscheidungen)
6. [Rezepte & Bilder pflegen](#6-rezepte--bilder-pflegen)

---

## 1. Was ICH noch tun muss – Schritt für Schritt

> Plane für den ersten Durchlauf ca. 1–2 Tage ein (der größte Zeitfaktor sind die Prüfungen von Apple/Google). Alle Stellen mit Platzhaltern sind unten aufgelistet.

### Schritt 0 – Voraussetzungen

- **Node.js 22** und **npm** (`node -v`)
- Konten anlegen:
  - [Expo-Konto](https://expo.dev/signup) (kostenlos)
  - [Supabase-Konto](https://supabase.com) (Free Tier reicht zum Start)
  - [Apple Developer Program](https://developer.apple.com/programs/) – **99 USD/Jahr**, Freischaltung kann 1–2 Tage dauern (als Firma wird eine D-U-N-S-Nummer benötigt)
  - [Google Play Console](https://play.google.com/console/signup) – **25 USD einmalig**, Identitätsprüfung nötig
- Für Google-Login: Zugang zur [Google Cloud Console](https://console.cloud.google.com)

```bash
cd gabelmatch
npm install
npm install -g eas-cli      # oder jeweils `npx eas-cli@latest …`
```

### Schritt 1 – Platzhalter ersetzen

| Wo | Was |
|---|---|
| `app.json` → `ios.bundleIdentifier` und `android.package` | `de.deinefirma.gabelmatch` durch deine eigene ID ersetzen (z. B. `de.mustermann.gabelmatch`). **Nach dem ersten Store-Upload nicht mehr änderbar.** |
| `src/content/legal.ts` | Alle `[PLATZHALTER IN ECKIGEN KLAMMERN]` in Datenschutzerklärung und Impressum (DE + EN) ausfüllen. In der App werden offene Platzhalter rot hervorgehoben. Anschließend `npm run legal:export` ausführen. |
| `store/legal/*.md` | Diese (exportierten) Texte auf einer öffentlichen Webseite veröffentlichen, z. B. `https://deine-domain.de/gabelmatch/datenschutz`. Die URL brauchst du für beide Stores. |
| `store/listing.md` | Store-Texte prüfen/anpassen. Danach `npm run store:check` (prüft Zeichenlimits). |

> ⚖️ Die Rechtstexte sind eine sorgfältige Vorlage, aber **keine Rechtsberatung**. Lass sie vor dem Launch prüfen (Kanzlei oder ein Generator wie e-recht24 / datenschutz-generator.de).

### Schritt 2 – Supabase-Projekt anlegen

1. Auf [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
   - Name: `gabelmatch`, sicheres DB-Passwort notieren
   - **Region: Central EU (Frankfurt)** – wichtig für die DSGVO (steht so in der Datenschutzerklärung)
2. **Datenbank einrichten** – Variante A (empfohlen, per CLI):
   ```bash
   npx supabase login
   npx supabase link --project-ref DEIN-PROJEKT-REF     # Ref steht in der Projekt-URL
   npx supabase db push                                 # spielt supabase/migrations/* ein
   psql "DEINE-CONNECTION-STRING" -f supabase/seed.sql   # oder Inhalt im SQL Editor ausführen
   ```
   Den Connection String findest du unter **Project Settings → Database → Connection string (URI)**.

   Variante B (am einfachsten, ohne CLI): Im Dashboard **SQL Editor → New query** den kompletten Inhalt von `supabase/setup-komplett.sql` einfügen und **Run** klicken – fertig (Schema, Sicherheitsregeln und alle Rezepte).

   Variante C (einzeln): Im Dashboard **SQL Editor** öffnen und **nacheinander** den Inhalt dieser Dateien ausführen:
   1. `supabase/migrations/20261021000000_extensions.sql`
   2. `supabase/migrations/20261021000001_schema.sql`
   3. `supabase/migrations/20261021000002_logic.sql`
   4. `supabase/migrations/20261021000003_rls.sql`
   5. `supabase/seed.sql` (127 Rezepte, 188 Zutaten)
3. **Prüfen:**
   - **Database → Extensions:** `pg_net` ist aktiv (sonst aktivieren – nötig für Push bei Match).
   - **Database → Publications → supabase_realtime:** enthält `matches, sessions, group_members, shopping_items, group_pantry, swipes`.
   - **Table Editor → recipes:** 127 Einträge.
4. **Authentication → URL Configuration**
   - Site URL: `gabelmatch://`
   - Redirect URLs hinzufügen: `gabelmatch://**` und (für Entwicklung) `exp://**`
5. **Authentication → Sign In / Providers → Email**
   - „Confirm email“ **an**, minimale Passwortlänge **8**
   - **Eigenen SMTP-Server eintragen** (Project Settings → Authentication → SMTP), z. B. Brevo, Postmark, Mailjet. Der eingebaute Versand von Supabase ist auf wenige Mails pro Stunde begrenzt und nicht für den Produktivbetrieb gedacht. Den Anbieter ggf. in der Datenschutzerklärung ergänzen.
   - Optional: E-Mail-Vorlagen (Authentication → Emails) auf Deutsch übersetzen.
6. **Project Settings → API** (bzw. „API Keys“): `Project URL` und den `anon`-/`publishable`-Key kopieren. **Niemals** den `service_role`-/`secret`-Key in die App eintragen.

### Schritt 3 – Login mit Apple einrichten (Pflicht, sobald Google-Login angeboten wird)

1. [Apple Developer → Identifiers](https://developer.apple.com/account/resources/identifiers/list): App-ID mit deiner Bundle-ID anlegen und **Sign In with Apple** aktivieren (EAS kann die App-ID beim ersten Build auch selbst anlegen – die Capability wird über `usesAppleSignIn` in `app.json` gesetzt).
2. Supabase → **Authentication → Providers → Apple** aktivieren und unter **Client IDs** deine **Bundle-ID** eintragen (z. B. `de.mustermann.gabelmatch`). Für den nativen iOS-Login reicht das – kein Secret nötig.
3. (Optional, nur für Apple-Login im Browser/auf Android: Services ID + Key anlegen und in Supabase eintragen. Die App zeigt den Apple-Button nur auf iOS.)

### Schritt 4 – Login mit Google einrichten

1. [Google Cloud Console](https://console.cloud.google.com) → neues Projekt → **APIs & Dienste → OAuth-Zustimmungsbildschirm** (Typ „Extern“, App-Name, Support-E-Mail, Link zur Datenschutzerklärung) → veröffentlichen.
2. **Anmeldedaten → OAuth-Client-ID erstellen → Typ „Webanwendung“**
   - Autorisierte Weiterleitungs-URI: `https://DEIN-PROJEKT-REF.supabase.co/auth/v1/callback`
3. Client-ID und Client-Secret in Supabase → **Authentication → Providers → Google** eintragen und aktivieren.

(Die App nutzt den sicheren Browser-Flow mit PKCE – dafür ist kein Android-/iOS-OAuth-Client nötig.)

### Schritt 5 – App lokal mit Supabase verbinden

```bash
cp .env.example .env
# .env öffnen und EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY eintragen
```

### Schritt 5b – Sofort ausprobieren mit Expo Go (ohne eigenen Build)

Für einen ersten Test brauchst du weder Apple- noch Google-Entwicklerkonto:

1. **Expo Go** aus dem App Store bzw. Google Play installieren (aktuelle Version, unterstützt SDK 58).
2. Im Ordner `gabelmatch/`:
   ```bash
   npm run start:go          # gleiches WLAN wie das Handy
   npm run start:tunnel      # falls Handy und Rechner nicht im selben Netz sind
   ```
3. QR-Code scannen – iPhone: mit der Kamera-App, Android: in Expo Go („Scan QR code“).

Was in Expo Go funktioniert: Registrierung per E-Mail, Gruppen, Swipen, Echtzeit-Match zwischen zwei Handys, Filter, Vorrat, Rezepte, Einkaufsliste, Verlauf, Einstellungen, Haptik, Dunkelmodus, Login mit Google.

Einschränkungen in Expo Go:
- **Push-Benachrichtigungen** nur auf dem iPhone (Android-Expo-Go unterstützt keine Remote-Pushes mehr – die App blendet die Option dort automatisch aus). Der Match-Screen erscheint trotzdem live bei allen, solange die App offen ist.
- **Mit Apple anmelden** funktioniert in Expo Go nur, wenn du in Supabase unter *Providers → Apple → Client IDs* zusätzlich `host.exp.Exponent` einträgst (nur für Tests, vor dem Launch wieder entfernen).
- Die Links in Bestätigungs-E-Mails öffnen Expo Go nur, solange der Dev-Server läuft (Redirect-URL `exp://**` ist dafür in Schritt 2 freigegeben).

Für Store-Builds und den vollständigen Funktionsumfang folgen die nächsten Schritte.

### Schritt 6 – Expo/EAS-Projekt verknüpfen

```bash
eas login
eas init                      # legt das Projekt auf expo.dev an und schreibt extra.eas.projectId in app.json
```

Umgebungsvariablen für die Cloud-Builds anlegen (für alle drei Umgebungen):

```bash
eas env:create --name EXPO_PUBLIC_SUPABASE_URL      --value https://DEIN-PROJEKT.supabase.co --environment production --environment preview --environment development --visibility plaintext
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value DEIN-ANON-KEY                     --environment production --environment preview --environment development --visibility plaintext
```

### Schritt 7 – Push-Benachrichtigungen einrichten

- **iOS:** Beim ersten `eas build` fragt EAS, ob ein **Push Key (APNs)** erzeugt werden soll → **Ja**. (Nachträglich: `eas credentials -p ios`.)
- **Android (Firebase Cloud Messaging V1):**
  1. [Firebase Console](https://console.firebase.google.com) → Projekt anlegen → Android-App mit deinem `android.package` hinzufügen → `google-services.json` herunterladen und in den Ordner `gabelmatch/` legen.
  2. In `app.json` unter `android` ergänzen: `"googleServicesFile": "./google-services.json"`
  3. Firebase → Projekteinstellungen → Dienstkonten → **Neuen privaten Schlüssel generieren** → JSON in EAS hochladen: `eas credentials -p android` → *Google Service Account* → *Manage your Google Service Account Key for Push Notifications (FCM V1)*.
- Die Datenbank verschickt Pushes bei jedem Match automatisch über die Expo Push API (`public.notify_match`). Wer in den Einstellungen Benachrichtigungen deaktiviert, bekommt keine.

### Schritt 8 – Testen auf echten Geräten (Development Build)

Für Tests mit allen Funktionen (Push auf Android, Apple-Login mit deiner Bundle-ID) einen Development Build erstellen:

```bash
eas build --profile development --platform ios       # iPhone vorher registrieren: eas device:create
eas build --profile development --platform android
npx expo start                                       # Development Build auf dem Gerät öffnen
```

Test-Checkliste (mit zwei Geräten/Konten):
- [ ] Registrieren per E-Mail (Bestätigungslink öffnet die App), Login mit Apple, Login mit Google
- [ ] Gruppe erstellen, Einladungslink teilen, mit zweitem Konto beitreten
- [ ] Runde starten, beide wischen dasselbe Gericht nach rechts → Match-Screen erscheint **auf beiden Geräten gleichzeitig**, Push kommt an (App im Hintergrund)
- [ ] Filter, Vorrat, Rezept mit Portionen, „Fehlende Zutaten auf die Einkaufsliste“, Abhaken auf dem anderen Gerät sichtbar
- [ ] Flugmodus → Offline-Hinweis erscheint
- [ ] Dunkelmodus, VoiceOver/TalkBack (Karte hat Aktionen „Lust drauf“ / „Nein danke“)
- [ ] Konto löschen

### Schritt 9 – Produktions-Builds

```bash
eas build --profile production --platform all
```

Versionsnummern zählt EAS automatisch hoch (`autoIncrement`, `appVersionSource: remote`). Für neue Versionen `version` in `app.json` erhöhen.

### Schritt 10 – App Store (iOS) einreichen

1. [App Store Connect](https://appstoreconnect.apple.com) → **Meine Apps → +** → Neue App: Name „Gabelmatch – Essen entscheiden“, Sprache Deutsch, Bundle-ID wählen, SKU frei wählbar.
2. **App-Informationen:** Kategorie „Essen und Trinken“, Datenschutz-URL, Support-URL (z. B. Seite mit Kontakt-E-Mail).
3. **App-Datenschutz:** Angaben aus `store/listing.md` → „Apple App Privacy“ übernehmen.
4. **Altersfreigabe:** Fragebogen ausfüllen (alles „Nein“ → 4+).
5. **Version 1.0.0:** Screenshots (6,9"-iPhone, mind. 3), Werbetext, Beschreibung, Keywords aus `store/listing.md`; englische Lokalisierung hinzufügen.
6. **App-Review-Informationen:** Demo-Zugang angeben! Lege zwei Testkonten an (z. B. `review1@…`, `review2@…`) und eine gemeinsame Gruppe. Hinweis für das Review-Team: *„Ein Match entsteht, wenn alle aktiven Mitglieder einer Gruppe dasselbe Gericht nach rechts wischen. Für den Test kann Konto 2 in der Gruppe ‚Esse heute mit‘ ausschalten – dann genügt ein Swipe von Konto 1.“* Erwähne außerdem, dass das Konto unter **Profil → Konto löschen** gelöscht werden kann.
7. Hochladen: `eas submit -p ios --latest` (fragt nach App-Store-Connect-Daten bzw. legt einen API-Key an) → in App Store Connect den Build der Version zuordnen → **Zur Prüfung einreichen**.

### Schritt 11 – Google Play einreichen

1. [Play Console](https://play.google.com/console) → **App erstellen** (Name, Standardsprache Deutsch, App, kostenlos).
2. **App-Inhalte** ausfüllen: Datenschutzerklärung (URL), App-Zugriff (Demo-Konten wie oben), Werbung: Nein, Einstufung des Inhalts (Fragebogen), Zielgruppe (ab 16), **Datensicherheit** (Angaben aus `store/listing.md`), **Kontolöschung** (URL zu einer Webseite, die erklärt, wie man das Konto löscht + Kontakt-E-Mail).
3. **Store-Eintrag:** Kurz-/Langbeschreibung aus `store/listing.md`, App-Icon 512 × 512 (`assets/images/icon.png` verkleinern), Feature-Grafik 1024 × 500, mind. 2 Screenshots.
4. **Erster Upload manuell:** Das erste `.aab` muss über die Console hochgeladen werden (Google-API-Einschränkung): Build von expo.dev herunterladen → *Testen → Interner Test → Neuen Release erstellen* → hochladen.
5. Danach automatisiert: In der Google Cloud ein Dienstkonto mit Play-Console-Zugriff anlegen, JSON-Schlüssel als `google-play-service-account.json` in `gabelmatch/` speichern (ist in `.gitignore`) → `eas submit -p android --latest` (lädt in den internen Test-Track als Entwurf, siehe `eas.json`).
6. ⚠️ **Neue private Entwicklerkonten** müssen vor der Produktion einen **geschlossenen Test mit mindestens 12 Testern über 14 Tage** durchführen. Firmenkonten sind davon ausgenommen.
7. Release in **Produktion** hochstufen und zur Prüfung senden.

### Schritt 12 (optional) – Einladungslinks über eigene Domain

Standardmäßig sind Einladungslinks `gabelmatch://join/CODE` (funktionieren nur mit installierter App; der Code steht zusätzlich im Text). Für klickbare `https://`-Links:
1. `EXPO_PUBLIC_INVITE_BASE_URL=https://deine-domain.de` setzen (in `.env` und per `eas env:create`).
2. In `app.json`: `ios.associatedDomains: ["applinks:deine-domain.de"]` und unter `android.intentFilters` einen `autoVerify`-Filter für `https://deine-domain.de/join`.
3. Auf der Domain `/.well-known/apple-app-site-association` und `/.well-known/assetlinks.json` bereitstellen und unter `/join/*` eine kleine Seite mit Store-Links + Code anzeigen.

---

## 2. Entwicklung & Tests

```bash
npm start                 # Expo-Dev-Server für den Development Build
npm run start:go          # Expo-Dev-Server für Expo Go (QR-Code scannen)
npm run check             # Typecheck + Lint + Unit-Tests + Store-Textlimits
npm run test:db           # Datenbank-Tests (Matching + RLS) gegen ein temporäres Postgres
npm run seed:generate     # seed.sql aus supabase/seed/** neu erzeugen (mit Validierung)
npm run legal:export      # Rechtstexte als Markdown nach store/legal/
```

**Datenbank-Tests** (`supabase/tests/*.test.ts`): Starten automatisch einen temporären Postgres-Cluster (benötigt `initdb`/`pg_ctl`, z. B. `brew install postgresql@16` bzw. `apt install postgresql`) **oder** laufen gegen eine vorhandene Datenbank: `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres npm run test:db` (lokaler Stack aus `npx supabase start`). Eine kleine Shim-Datei bildet Supabase-Rollen und `auth.uid()` nach.

Abgedeckt sind u. a.:
- **Matching:** Match erst bei Zustimmung *aller aktiven* Mitglieder; inaktive Mitglieder und Austritte lösen Neubewertung aus; **gleichzeitige letzte Swipes** in zwei Transaktionen erzeugen genau ein Match; Swipes zählen nur pro Runde; nach einem Match keine weiteren Swipes.
- **RLS:** Fremde sehen keine Gruppen, Mitglieder, Swipes, Matches, Vorräte, Einkaufslisten oder Profile; niemand kann im Namen anderer swipen, sich zum Owner machen, Matches fälschen oder fremde Push-Tokens lesen; anonyme Nutzer sehen nichts.
- **Konto löschen:** entfernt alle personenbezogenen Daten, überträgt die Owner-Rolle, löscht verwaiste Gruppen.
- **Seed:** ≥ 120 Rezepte, idempotent einspielbar.

**Unit-Tests** (`src/**/__tests__`): Ranking & Filter (Vorrat zuerst, Kürzlich-Gegessenes seltener, deterministische Reihenfolge pro Runde), Portionsskalierung, Übersetzungen (DE/EN vollständig, Platzhalter identisch), Fehlerübersetzung, **WCAG-AA-Kontraste** beider Farbschemata, Rezeptdatensatz.

Stand dieser Übergabe: `tsc` ✔︎ · ESLint (inkl. React-Compiler-Regeln) ✔︎ · 61 Unit-Tests ✔︎ · 30 DB-Tests ✔︎ · `expo export` für iOS, Android und Web ✔︎ · `expo prebuild` ✔︎ · `expo-doctor` 18/20 (die zwei übrigen Checks benötigen Netzzugriff auf die Expo-API, der in der Build-Umgebung gesperrt war – bitte einmal lokal `npx expo-doctor` ausführen).

---

## 3. Funktionen

| # | Funktion | Umsetzung |
|---|---|---|
| 1 | Onboarding + Registrierung/Login | 3 Slides, E-Mail mit Bestätigung, Passwort-Reset, Apple (nativ, iOS), Google (PKCE-Browser-Flow) |
| 2 | Gruppen | Erstellen, beitreten per 6-stelligem Code oder Link (`gabelmatch://join/CODE`, merkt sich den Code auch vor dem Login), Mitglieder, verlassen, umbenennen, Code erneuern |
| 3 | Swipe-Session | Gesture Handler 3 + Reanimated 4, Stempel „LECKER/NÖ“, nachwachsende Folgekarte, Haptik an der Schwelle & beim Wischen, Buttons als Alternative |
| 4 | Echtzeit-Matching | Postgres-Trigger erzeugt das Match transaktionssicher; Supabase Realtime öffnet den Match-Screen bei allen; Push via Expo |
| 5 | Filter | Max. 15/30/60 Min., vegetarisch/vegan, Kategorie – gelten für die ganze Runde |
| 6 | Vorrat | Gemeinsamer Kühlschrank pro Gruppe; vollständig machbare Gerichte zuerst, teilweise machbare danach |
| 7 | Rezeptansicht | Zutaten mit Vorrats-Status, Portionen 1–12 mit küchentauglicher Rundung, Schritte |
| 8 | Einkaufsliste | Fehlende Zutaten mit einem Tipp (ohne Dubletten), abhaken, live geteilt |
| 9 | Verlauf | Frühere Matches; Abschlag im Ranking für < 7 / < 21 / < 45 Tage |
| 10 | Einstellungen | Profil (Name, Avatar), Benachrichtigungen, Sprache, Darstellung, Rechtliches, Abmelden, **Konto löschen** |

Außerdem: Lade-, Fehler- und Leerzustände auf allen Screens, Offline-Banner (NetInfo, React Query pausiert offline), Dunkelmodus, Screenreader-Labels und -Aktionen, Mindest-Trefferflächen 44 pt, Schriftgrößen-Skalierung.

---

## 4. Architektur & Projektstruktur

```
gabelmatch/
├─ app.json / eas.json          Expo- und Build-Konfiguration
├─ assets/images/               Icon, Splash, Adaptive Icon, Kategorie-Illustrationen
├─ scripts/
│  ├─ art/                      SVG-Quellen + Renderer für Icon/Splash/Illustrationen
│  ├─ generate-seed.ts          Rezepte → supabase/seed.sql
│  ├─ export-legal.ts, check-store.ts, test-db.sh
├─ store/                       Store-Texte, Datenschutz-Labels, exportierte Rechtstexte
├─ supabase/
│  ├─ migrations/               Schema, Matching-Logik + RPCs, RLS-Policies
│  ├─ seed/                     Rezeptdaten (TypeScript) + Validierung
│  ├─ seed.sql                  generiert
│  └─ tests/                    DB-Tests (Matching, RLS, Seed)
└─ src/
   ├─ app/                      Routen (Expo Router)
   │  ├─ onboarding, sign-in, sign-up, forgot-password, auth/callback, join/[code], legal/*
   │  └─ (app)/                 angemeldeter Bereich: (tabs)/{index,pantry,shopping,history,settings},
   │                            groups/*, filters, match/[id], recipe/[id], settings/*, new-password
   ├─ components/               UI-Bausteine (Button, Card, Screen, StateViews, Toast, …)
   ├─ features/                 Fachlogik je Bereich (auth, groups, swipe, recipes, matches, pantry, shopping, …)
   ├─ content/legal.ts          Datenschutzerklärung & Impressum (DE/EN)
   ├─ lib/                      Supabase-Client, i18n, Fehler, Netzwerk, Haptik, Storage
   ├─ theme/                    Farben (geprüfte Kontraste), Typografie, ThemeProvider
   └─ types/database.ts         Datenbanktypen
```

**Datenmodell (vereinfacht):** `profiles` · `groups` · `group_members (is_active)` · `sessions` (eine aktive Runde pro Gruppe, mit Filtern) · `swipes` · `matches` (eins pro Runde) · `group_pantry` · `shopping_items` · `push_tokens` · Katalog: `recipes`, `recipe_ingredients`, `ingredients`.

**Matching:** Jeder positive Swipe ruft `evaluate_session()` auf. Die Funktion sperrt die Runde (`FOR NO KEY UPDATE` – kollidiert nicht mit den Fremdschlüssel-Sperren der Swipes, daher keine Deadlocks), zählt die aktiven Mitglieder und sucht ein Gericht, das alle mögen. So kann bei gleichzeitigen Swipes kein Match verloren gehen. Änderungen an „Esse heute mit“ oder Austritte lösen ebenfalls eine Auswertung aus.

**Ranking:** Alle Mitglieder einer Runde sehen dieselbe Grundreihenfolge (Seed = Runden-ID). Darauf kommen Bonuspunkte für Vorrats-Abdeckung (komplett machbar zuerst), für Gerichte, die andere aktive Mitglieder schon mögen (schnellere Matches), und Abschläge für kürzlich gegessene Gerichte (`src/features/recipes/ranking.ts`).

---

## 5. Getroffene Entscheidungen

| Thema | Entscheidung & Begründung |
|---|---|
| Ablageort | Das Repository enthielt bereits eine Next.js-Website. Die App liegt daher eigenständig in `gabelmatch/` und berührt die Website nicht. |
| Expo SDK | Aktuelles SDK 58 (RN 0.88) – Voraussetzung für aktuelle Xcode-/Android-Ziel-SDK-Anforderungen der Stores. |
| Runden | Swipes gehören zu einer **Runde** (Session). Nach einem Match ist die Runde beendet; „Neue Runde starten“ beginnt von vorn. Filter gelten für die ganze Gruppe, damit alle dieselben Gerichte sehen. |
| Wer zählt | Alle **aktiven** Mitglieder („Esse heute mit“). Ist nur eine Person aktiv, reicht ihr Swipe – nützlich, wenn jemand allein isst, und für das App-Review. |
| Gruppengrößen | Max. 12 Mitglieder pro Gruppe, max. 20 Gruppen pro Person (Missbrauchsschutz). |
| Vorrat | Pro Gruppe geteilt (der Kühlschrank gehört dem Haushalt). Salz, Pfeffer, Zucker, Öl, Wasser gelten als immer vorhanden. |
| Push | Versand direkt aus der Datenbank (`pg_net` → Expo Push API) – keine zusätzliche Edge Function nötig. Fehler beim Versand verhindern nie ein Match. Abfrage der Erlaubnis erst nach einer freundlichen Vorab-Frage im Kontext. |
| Login | Apple nativ auf iOS (App-Store-Regel 4.8), Google per Browser-OAuth mit PKCE (keine nativen Google-SDKs nötig). |
| Datenminimierung | Kein Klarname nötig, keine E-Mail im Profil, keine Analytics, kein Tracking. Lokale Speicherung nur für Sitzung und Einstellungen. |
| Konto löschen | Serverseitige Funktion `delete_account()` löscht den Auth-Nutzer; alles Weitere per Kaskade. Owner-Rolle wird übertragen, verwaiste Gruppen gelöscht. |
| Sprache | UI vollständig DE/EN (folgt dem Gerät, umschaltbar). Rezepttexte sind deutsch; das Feld `recipes.translations` ist für Übersetzungen vorbereitet (`{"en": {"title": …, "description": …, "steps": […]}}`). |
| Bilder | Einheitliche Illustration pro Kategorie (in der App gebündelt, 260 KB gesamt). Echte Fotos über `recipes.image_url` – sobald gesetzt, wird das Foto angezeigt, sonst die Illustration. |
| Mindestalter | 16 Jahre (DSGVO-Einwilligungsalter in Deutschland). |
| Tablets | `supportsTablet: false` – vermeidet Pflicht-Screenshots für iPad; kann später aktiviert werden. |

---

## 6. Rezepte & Bilder pflegen

**Rezepte ändern/ergänzen:** In `supabase/seed/recipes/*.ts` bearbeiten (Zutaten-IDs aus `supabase/seed/ingredients.ts`), dann:

```bash
npm run seed:generate     # validiert (Pflichtfelder, bekannte Zutaten, Ernährungsform passt zu den Zutaten) und schreibt seed.sql
psql "DEINE-CONNECTION-STRING" -f supabase/seed.sql
```

Der Seed ist idempotent: bestehende Rezepte werden über ihren Slug aktualisiert, bereits gesetzte Fotos bleiben erhalten.

**Echte Fotos hinzufügen:**
1. Supabase → **Storage** → Bucket `recipe-images` anlegen (**Public**).
2. Fotos hochladen, Dateiname = Slug, z. B. `spaghetti-carbonara.jpg` (empfohlen 1200 × 900, JPEG, < 250 KB).
3. Im SQL Editor:
   ```sql
   update public.recipes
   set image_url = 'https://DEIN-PROJEKT.supabase.co/storage/v1/object/public/recipe-images/' || slug || '.jpg'
   where slug in ('spaghetti-carbonara', 'shakshuka');   -- nur Rezepte, für die es ein Foto gibt
   ```
Die App lädt Fotos mit Caching; schlägt ein Foto fehl, erscheint automatisch wieder die Illustration.

**Illustrationen/Icon anpassen:** SVG-Quellen in `scripts/art/illustrations.mjs` bearbeiten, dann `node scripts/art/render.mjs` (benötigt `npm i -D playwright` und `npx playwright install chromium`).
