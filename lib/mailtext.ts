// Texts for the automatic e-mails to customers. Plain text, short, personal.

export const signature = [
  "",
  "Viele Grüße",
  "Florian Dressler und Davy Stubenrauch",
  "FOAV · Websites, KI-Werbevideos, Renderings und NFC-Platten",
  "foav.de · info@foav.de",
  "Telefon: 0155 66456417 (Florian) · 0176 56612709 (Davy)",
].join("\n");

/** "A", "A und B", "A, B und C" */
export const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} und ${xs[xs.length - 1]}`);

export const hello = (name?: string) => (name?.trim() ? `Hallo ${name.trim()},` : "Hallo,");
