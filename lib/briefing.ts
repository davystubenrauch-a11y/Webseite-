// Detailed briefings that follow a short inquiry: what the website should look like,
// or which room photos belong to a roomtour. Shared by the forms and /api/briefing.

export type BriefingKind = "website" | "roomtour";

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
  /** Honeypot, must stay empty. */
  website?: string;
};

export const kindLabels: Record<BriefingKind, string> = { website: "Website-Fragebogen", roomtour: "Roomtour-Auftrag" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateBriefing(d: Briefing) {
  const e: Partial<Record<"name" | "contact" | "consent", string>> = {};
  if (!d.name?.trim()) e.name = "Bitte geben Sie Ihren Namen an.";
  const email = d.email?.trim() ?? "";
  if (!email && !d.phone?.trim()) e.contact = "Bitte geben Sie eine Telefonnummer oder E-Mail an.";
  else if (email && !EMAIL.test(email)) e.contact = "Bitte prüfen Sie die E-Mail-Adresse.";
  if (!d.consent) e.consent = "Bitte stimmen Sie der Datenschutzerklärung zu.";
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
    lines.push(`${a.label}: ${a.value}`);
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
  lines.push("", "KONTAKT", `Name: ${d.name}`);
  if (d.email) lines.push(`E-Mail: ${d.email}`);
  if (d.phone) lines.push(`Telefon: ${d.phone}`);
  return lines.join("\n");
}
