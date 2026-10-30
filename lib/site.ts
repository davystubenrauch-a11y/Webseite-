// Central company data. Everything that appears in the footer, legal pages and
// contact sections is read from here, so update it in one place before going live.
export const site = {
  name: "FOAV",
  url: "https://foav.de",
  claim: "Websites, KI-Roomtours und NFC-Platten aus München.",
  email: "fd.solutions@web.de",
  city: "München",
  founders: [
    { name: "Florian Dressler", role: "Co-Founder", phone: "+49 155 66456417" },
    { name: "Davy Stubenrauch", role: "Co-Founder", phone: "+49 176 56612709" },
  ],
  // TODO: Enter the full postal address before going live (required for the Impressum).
  address: ["[Firmenname laut Gewerbeanmeldung, z. B. FOAV – Dressler & Stubenrauch GbR]", "[Straße Hausnummer]", "[PLZ] München"],
  social: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "TikTok", href: "https://tiktok.com/" },
  ],
};

export const nav = [
  { id: "leistungen", label: "Leistungen" },
  { id: "nfc", label: "NFC-Platte" },
  { id: "prozess", label: "Ablauf" },
  { id: "preise", label: "Preise" },
  { id: "team", label: "Über uns" },
] as const;

/** Formats a phone number for a tel: link. */
export const telHref = (phone: string) => `tel:${phone.replace(/\s+/g, "")}`;
