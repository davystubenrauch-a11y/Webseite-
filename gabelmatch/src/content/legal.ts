/**
 * Rechtstexte als VORLAGE. Alle Stellen in [ECKIGEN KLAMMERN] müssen vor der Veröffentlichung
 * ersetzt werden. Die Texte ersetzen keine Rechtsberatung – bitte vor dem Launch prüfen lassen
 * (z. B. durch einen Datenschutz-Generator wie e-recht24/Datenschutz-Generator.de oder eine Kanzlei).
 *
 * Dieselben Inhalte werden mit `npm run legal:export` als Markdown nach store/legal/ exportiert,
 * damit sie zusätzlich auf einer Webseite veröffentlicht werden können (App Store und Google Play
 * verlangen eine öffentlich erreichbare URL zur Datenschutzerklärung).
 */
import type { AppLocale } from '@/lib/i18n';

export type LegalSection = { heading: string; paragraphs: string[] };
export type LegalDocument = { title: string; updated: string; sections: LegalSection[] };

const UPDATED = '21.10.2026';

const privacyDe: LegalDocument = {
  title: 'Datenschutzerklärung',
  updated: `Stand: ${UPDATED}`,
  sections: [
    {
      heading: '1. Verantwortlicher',
      paragraphs: [
        'Verantwortlich für die Datenverarbeitung in der App „Gabelmatch“ ist:',
        '[VOR- UND NACHNAME bzw. FIRMA]\n[STRASSE UND HAUSNUMMER]\n[PLZ ORT]\n[LAND]\nE-Mail: [DATENSCHUTZ-E-MAIL-ADRESSE]',
        '[FALLS BENANNT: Kontaktdaten des/der Datenschutzbeauftragten]',
      ],
    },
    {
      heading: '2. Grundsätze',
      paragraphs: [
        'Wir verarbeiten nur die Daten, die für die Funktionen der App nötig sind (Datenminimierung, Art. 5 Abs. 1 lit. c DSGVO). Die App enthält keine Werbung, kein Tracking und keine Analyse-Tools von Drittanbietern. Wir verkaufen keine Daten.',
      ],
    },
    {
      heading: '3. Welche Daten wir verarbeiten',
      paragraphs: [
        'Konto: E-Mail-Adresse und Passwort (nur als sicherer Hash gespeichert) oder – bei „Mit Apple/Google anmelden“ – eine Kennung des jeweiligen Anbieters und ggf. die von dir freigegebene E-Mail-Adresse. Zweck: Anmeldung und Kontosicherheit. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertrag/Nutzungsverhältnis).',
        'Profil: selbst gewählter Anzeigename und Avatar-Emoji, Spracheinstellung, Benachrichtigungseinstellung. Den Anzeigenamen sehen nur Mitglieder deiner Gruppen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.',
        'Gruppendaten: Gruppen, Mitgliedschaften, Status „Esse heute mit“, deine Bewertungen von Gerichten (Swipes), Matches, gemeinsamer Vorrat und Einkaufsliste. Diese Daten sind ausschließlich für Mitglieder derselben Gruppe sichtbar (technisch abgesichert durch Row Level Security). Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.',
        'Push-Benachrichtigungen: Wenn du zustimmst, speichern wir ein Geräte-Token, um dich über Matches zu informieren. Rechtsgrundlage: Einwilligung, Art. 6 Abs. 1 lit. a DSGVO. Du kannst die Einwilligung jederzeit in der App oder in den Systemeinstellungen widerrufen.',
        'Technische Daten: Beim Aufruf unseres Backends fallen technisch bedingt Server-Logdaten an (z. B. IP-Adresse, Zeitpunkt, angefragte Ressource), die unser Hosting-Anbieter zur Sicherstellung des Betriebs und zur Abwehr von Missbrauch kurzzeitig speichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren Betrieb).',
        'Lokal auf deinem Gerät speichert die App deine Anmeldesitzung sowie Einstellungen (z. B. Sprache, Darstellung, zuletzt gewählte Gruppe). Diese Daten verlassen dein Gerät nicht und werden beim Abmelden bzw. Löschen des Kontos entfernt.',
      ],
    },
    {
      heading: '4. Empfänger und Auftragsverarbeiter',
      paragraphs: [
        'Supabase (Supabase Inc., USA) betreibt für uns Datenbank, Anmeldung und Echtzeit-Funktionen als Auftragsverarbeiter (Art. 28 DSGVO). Die Daten werden in einem Rechenzentrum in der EU gespeichert ([REGION EINTRAGEN, z. B. Frankfurt, eu-central-1]). Für etwaige Zugriffe aus Drittländern bestehen Standardvertragsklauseln.',
        'Expo Push Service (650 Industries, Inc., USA) leitet Push-Benachrichtigungen an Apple Push Notification Service (Apple Inc.) bzw. Firebase Cloud Messaging (Google LLC) weiter. Übermittelt werden dabei das Geräte-Token und der Benachrichtigungstext. Grundlage für die Übermittlung in die USA: EU-US Data Privacy Framework bzw. Standardvertragsklauseln.',
        'Anmeldung mit Apple oder Google: Wenn du diese Option wählst, gelten zusätzlich die Datenschutzbestimmungen von Apple bzw. Google. Wir erhalten nur die für die Anmeldung nötigen Angaben.',
        '[WEITERE DIENSTLEISTER, FALLS GENUTZT, z. B. E-Mail-Versand (SMTP-Anbieter) für Bestätigungs-E-Mails]',
      ],
    },
    {
      heading: '5. Speicherdauer und Löschung',
      paragraphs: [
        'Wir speichern deine Daten, solange dein Konto besteht. Du kannst dein Konto jederzeit in der App unter „Profil → Konto löschen“ löschen. Dabei werden dein Konto, dein Profil, deine Swipes, Geräte-Tokens und Mitgliedschaften sofort und endgültig gelöscht. Gruppen, in denen du das einzige Mitglied warst, werden mit allen Inhalten gelöscht. Einträge, die du in geteilten Einkaufslisten angelegt hast, bleiben für die Gruppe ohne Bezug zu deiner Person erhalten.',
        'Server-Logdaten werden von unserem Hosting-Anbieter nach spätestens [ANZAHL] Tagen gelöscht. Gesetzliche Aufbewahrungspflichten bleiben unberührt.',
      ],
    },
    {
      heading: '6. Deine Rechte',
      paragraphs: [
        'Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21). Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3).',
        'Wende dich dazu an [DATENSCHUTZ-E-MAIL-ADRESSE]. Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren, z. B. bei der für unseren Sitz zuständigen Behörde: [ZUSTÄNDIGE AUFSICHTSBEHÖRDE].',
      ],
    },
    {
      heading: '7. Sicherheit',
      paragraphs: [
        'Die Übertragung erfolgt ausschließlich verschlüsselt (TLS). Der Zugriff auf Daten ist in der Datenbank durch Zugriffsregeln (Row Level Security) so beschränkt, dass Nutzer nur ihre eigenen Daten und die ihrer Gruppen sehen können.',
      ],
    },
    {
      heading: '8. Mindestalter',
      paragraphs: ['Die App richtet sich an Personen ab 16 Jahren. Jüngere Personen benötigen die Zustimmung ihrer Erziehungsberechtigten.'],
    },
    {
      heading: '9. Änderungen',
      paragraphs: ['Wir passen diese Datenschutzerklärung an, wenn sich die App oder die Rechtslage ändert. Die aktuelle Fassung findest du jederzeit in der App und unter [URL DER DATENSCHUTZERKLÄRUNG].'],
    },
  ],
};

const privacyEn: LegalDocument = {
  title: 'Privacy policy',
  updated: `Last updated: ${UPDATED}`,
  sections: [
    {
      heading: '1. Controller',
      paragraphs: [
        'The controller responsible for data processing in the “Gabelmatch” app is:',
        '[FULL NAME or COMPANY]\n[STREET AND NUMBER]\n[POSTCODE CITY]\n[COUNTRY]\nEmail: [PRIVACY EMAIL ADDRESS]',
        '[IF APPOINTED: contact details of the data protection officer]',
      ],
    },
    {
      heading: '2. Principles',
      paragraphs: [
        'We only process data required for the app’s features (data minimisation, Art. 5(1)(c) GDPR). The app contains no advertising, no tracking and no third-party analytics. We never sell data.',
      ],
    },
    {
      heading: '3. Data we process',
      paragraphs: [
        'Account: email address and password (stored only as a secure hash) or – with “Sign in with Apple/Google” – an identifier from that provider and, if shared, your email address. Purpose: sign-in and account security. Legal basis: Art. 6(1)(b) GDPR (contract).',
        'Profile: display name and avatar emoji you choose, language and notification settings. Only members of your groups can see your display name. Legal basis: Art. 6(1)(b) GDPR.',
        'Group data: groups, memberships, “eating today” status, your ratings of dishes (swipes), matches, shared pantry and shopping list. This data is visible only to members of the same group (technically enforced via row level security). Legal basis: Art. 6(1)(b) GDPR.',
        'Push notifications: if you agree, we store a device token to notify you about matches. Legal basis: consent, Art. 6(1)(a) GDPR. You can withdraw consent at any time in the app or in your system settings.',
        'Technical data: when our backend is accessed, server log data (e.g. IP address, time, requested resource) is briefly stored by our hosting provider to ensure operation and prevent abuse. Legal basis: Art. 6(1)(f) GDPR (legitimate interest in secure operation).',
        'The app stores your sign-in session and settings (e.g. language, appearance, last selected group) locally on your device. This data never leaves your device and is removed when you sign out or delete your account.',
      ],
    },
    {
      heading: '4. Recipients and processors',
      paragraphs: [
        'Supabase (Supabase Inc., USA) operates our database, authentication and realtime features as a processor (Art. 28 GDPR). Data is stored in an EU data centre ([ENTER REGION, e.g. Frankfurt, eu-central-1]). Standard contractual clauses cover any access from third countries.',
        'Expo Push Service (650 Industries, Inc., USA) forwards push notifications to Apple Push Notification service (Apple Inc.) or Firebase Cloud Messaging (Google LLC). The device token and notification text are transmitted. Basis for the transfer to the USA: EU-US Data Privacy Framework or standard contractual clauses.',
        'Sign in with Apple or Google: if you choose this option, Apple’s or Google’s privacy policies also apply. We only receive the information required for sign-in.',
        '[OTHER PROVIDERS IF USED, e.g. email delivery (SMTP provider) for confirmation emails]',
      ],
    },
    {
      heading: '5. Retention and deletion',
      paragraphs: [
        'We keep your data as long as your account exists. You can delete your account at any time in the app under “Profile → Delete account”. Your account, profile, swipes, device tokens and memberships are deleted immediately and permanently. Groups in which you were the only member are deleted with all their content. Items you added to shared shopping lists remain with the group without any link to you.',
        'Server logs are deleted by our hosting provider after at most [NUMBER] days. Statutory retention obligations remain unaffected.',
      ],
    },
    {
      heading: '6. Your rights',
      paragraphs: [
        'You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and to object to processing based on legitimate interests (Art. 21). You may withdraw consent at any time with effect for the future (Art. 7(3)).',
        'Contact us at [PRIVACY EMAIL ADDRESS]. You also have the right to lodge a complaint with a supervisory authority, e.g. the authority responsible for our place of business: [SUPERVISORY AUTHORITY].',
      ],
    },
    {
      heading: '7. Security',
      paragraphs: [
        'All data is transmitted encrypted (TLS). Database access rules (row level security) ensure that users can only see their own data and the data of their groups.',
      ],
    },
    {
      heading: '8. Minimum age',
      paragraphs: ['The app is intended for people aged 16 and over. Younger people need the consent of a parent or guardian.'],
    },
    {
      heading: '9. Changes',
      paragraphs: ['We update this policy when the app or the law changes. The current version is always available in the app and at [PRIVACY POLICY URL].'],
    },
  ],
};

const imprintDe: LegalDocument = {
  title: 'Impressum',
  updated: `Stand: ${UPDATED}`,
  sections: [
    {
      heading: 'Angaben gemäß § 5 DDG',
      paragraphs: [
        '[VOR- UND NACHNAME bzw. FIRMA inkl. RECHTSFORM]\n[STRASSE UND HAUSNUMMER]\n[PLZ ORT]\n[LAND]',
        '[BEI JURISTISCHEN PERSONEN: Vertretungsberechtigte Person(en)]\n[FALLS VORHANDEN: Registergericht und Registernummer]',
      ],
    },
    {
      heading: 'Kontakt',
      paragraphs: ['E-Mail: [KONTAKT-E-MAIL-ADRESSE]\nTelefon: [TELEFONNUMMER – optional, aber empfohlen]'],
    },
    {
      heading: 'Umsatzsteuer',
      paragraphs: ['[FALLS VORHANDEN: Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE…]'],
    },
    {
      heading: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
      paragraphs: ['[VOR- UND NACHNAME, ANSCHRIFT]'],
    },
    {
      heading: 'Verbraucherstreitbeilegung',
      paragraphs: [
        'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. [BEI BEDARF ANPASSEN]',
      ],
    },
    {
      heading: 'Haftung für Inhalte',
      paragraphs: [
        'Die Rezepte in dieser App wurden mit Sorgfalt erstellt. Bitte achte dennoch selbst auf Unverträglichkeiten, Allergene und eine sichere Zubereitung. Für Schäden, die aus der Nutzung der Rezepte entstehen, haften wir nur bei Vorsatz und grober Fahrlässigkeit.',
      ],
    },
  ],
};

const imprintEn: LegalDocument = {
  title: 'Legal notice',
  updated: `Last updated: ${UPDATED}`,
  sections: [
    {
      heading: 'Information pursuant to § 5 DDG (German Digital Services Act)',
      paragraphs: [
        '[FULL NAME or COMPANY incl. LEGAL FORM]\n[STREET AND NUMBER]\n[POSTCODE CITY]\n[COUNTRY]',
        '[FOR LEGAL ENTITIES: authorised representative(s)]\n[IF APPLICABLE: register court and registration number]',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: ['Email: [CONTACT EMAIL ADDRESS]\nPhone: [PHONE NUMBER – optional but recommended]'],
    },
    {
      heading: 'VAT',
      paragraphs: ['[IF APPLICABLE: VAT identification number pursuant to § 27a UStG: DE…]'],
    },
    {
      heading: 'Responsible for content pursuant to § 18(2) MStV',
      paragraphs: ['[FULL NAME, ADDRESS]'],
    },
    {
      heading: 'Consumer dispute resolution',
      paragraphs: ['We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board. [ADJUST IF NEEDED]'],
    },
    {
      heading: 'Liability for content',
      paragraphs: [
        'The recipes in this app were created with care. Please still check for intolerances, allergens and safe preparation yourself. We are only liable for damages arising from the use of the recipes in cases of intent or gross negligence.',
      ],
    },
  ],
};

export const LEGAL: Record<'privacy' | 'imprint', Record<AppLocale, LegalDocument>> = {
  privacy: { de: privacyDe, en: privacyEn },
  imprint: { de: imprintDe, en: imprintEn },
};
