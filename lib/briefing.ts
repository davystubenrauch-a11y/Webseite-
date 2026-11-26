// Detailed briefings that follow a short inquiry: what the website should look like,
// which photos and mood belong to a KI-Werbevideo order, or the logo for custom NFC plates.
// Shared by the forms and /api/briefing. "roomtour" stays for drafts and mails sent before the switch.

export type BriefingKind = "website" | "shots" | "nfc" | "render" | "roomtour";

export type Photo = { group: string; name: string; url: string };

export type Briefing = {
  kind: BriefingKind;
  /** Ordered question/answer pairs, so the e-mail reads like the form. */
  answers: { section: string; label: string; value: string }[];
  photos: Photo[];
  name: string;
  email: string;
  phone: string;
  consent: boolean;
  /** Website orders: agreed to the hosting agreement incl. data processing agreement (Art. 28 GDPR). */
  hosting?: boolean;
  /** Set by the server when `hosting` is true. */
  hostingAt?: string;
  /** Honeypot, must stay empty. */
  website?: string;
};

export const kindLabels: Record<BriefingKind, string> = { website: "Website-Fragebogen", shots: "KI-Werbevideo-Auftrag", nfc: "NFC-Custom-Auftrag", render: "Rendering-Auftrag", roomtour: "Roomtour-Auftrag" };

export const HOSTING_VERSION = "26.11.2026";
export const HOSTING_URL = "https://www.foav.de/dokumente/hosting-vereinbarung.pdf";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateBriefing(d: Briefing) {
  const e: Partial<Record<"name" | "contact" | "consent" | "hosting", string>> = {};
  if (!d.name?.trim()) e.name = "Bitte geben Sie Ihren Namen an.";
  const email = d.email?.trim() ?? "";
  if (!email && !d.phone?.trim()) e.contact = "Bitte geben Sie eine Telefonnummer oder E-Mail an.";
  else if (email && !EMAIL.test(email)) e.contact = "Bitte prüfen Sie die E-Mail-Adresse.";
  if (!d.consent) e.consent = "Bitte stimmen Sie der Datenschutzerklärung zu.";
  if (d.kind === "website" && !d.hosting) e.hosting = "Bitte stimmen Sie der Hosting-Vereinbarung zu. Ohne sie dürfen wir Ihre Website nicht für Sie bereitstellen.";
  return e;
}

/** Plain-text version for the e-mail and the mailto fallback. */
export function summarizeBriefing(d: Briefing) {
  const lines: string[] = [kindLabels[d.kind], ""];
  let section = "";
  for (const a of d.answers) {
    if (!a.value.trim()) continue;
    if (a.section !== section) {
      section = a.section;
      lines.push("", section.toUpperCase());
    }
    // options are stored as "Pro|3 Werbefilme, 449 €"; show them as "Pro (3 Werbefilme, 449 €)"
    lines.push(`${a.label}: ${a.value.split("; ").map((x) => x.replace(/\|(.+)$/, " ($1)")).join("; ")}`);
  }
  if (d.photos.length) {
    lines.push("", `FOTOS (${d.photos.length})`);
    let group = "";
    for (const p of d.photos) {
      if (p.group !== group) {
        group = p.group;
        lines.push(`${group}:`);
      }
      lines.push(`  ${p.url}`);
    }
  }
  if (d.hosting) lines.push("", "HOSTING-VEREINBARUNG", `Hosting-Vereinbarung mit Auftragsverarbeitung (Fassung ${HOSTING_VERSION}) zugestimmt${d.hostingAt ? ` am ${d.hostingAt}` : ""}`, HOSTING_URL);
  lines.push("", "KONTAKT", `Name: ${d.name}`);
  if (d.email) lines.push(`E-Mail: ${d.email}`);
  if (d.phone) lines.push(`Telefon: ${d.phone}`);
  return lines.join("\n");
}
