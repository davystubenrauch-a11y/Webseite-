// Central company data. Everything that appears in the footer, legal pages and
// contact sections is read from here, so update it in one place before going live.
export const site = {
  name: "foav.de",
  url: "https://foav.de",
  claim: "Websites, KI-Roomtours und NFC-Platten aus München.",
  email: "info@foav.de",
  city: "München",
  founders: [
    { name: "Florian Dressler", role: "Co-Founder", phone: "+49 155 66456417" },
    { name: "Davy Stubenrauch", role: "Co-Founder", phone: "+49 176 56612709" },
  ],
  // Legal name: a GbR (not in the register) names all partners.
  legalName: "FOAV GbR, Florian Dressler und Davy Stubenrauch",
  address: ["FOAV GbR, Florian Dressler und Davy Stubenrauch", "Sollner Straße 51", "81479 München"],
  // USt-IdNr. if the GbR has one; the imprint only shows the section when this is set.
  vatId: "",
  // Postal address only (no shop, no visits): shown in the imprint, AGB and invoices, nowhere else.
  addressNote: "Kein Ladengeschäft. Termine und Beratung telefonisch oder online.",
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
