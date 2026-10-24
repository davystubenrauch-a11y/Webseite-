/** Brand facts used across the page. Replace placeholders before launch. */
export const site = {
  name: "SPIRULI",
  pzn: "11110571",
  /** Placeholder contact address. */
  email: "info@spiruli.de",
};

/**
 * Ingredients in label order and nutrition per 100 ml, as published in
 * retail listings for the 200 ml can. Check against the current can before launch.
 */
export const ingredients = [
  { name: "Wasser", note: "" },
  { name: "Agavensirup", note: "sanfte Süße" },
  { name: "Spirulina-Extrakt", note: "Spirulina platensis, die Mikroalge" },
  { name: "Kohlensäure", note: "spritzig" },
  { name: "Extrakt von Lithothamnium calcareum", note: "die Rotalge" },
  { name: "Holunderbeersaftkonzentrat", note: "der Geschmack" },
  { name: "Zitronensaftkonzentrat", note: "" },
  { name: "Fermentiertes Gerstenmalz", note: "liefert vegane Milchsäure" },
  { name: "Orangensaftkonzentrat", note: "" },
];

export const nutrition = [
  { name: "Brennwert", per100: "91,8 kJ / 21,6 kcal", perCan: "184 kJ / 43 kcal" },
  { name: "Fett", per100: "< 0,01 g", perCan: "< 0,02 g" },
  { name: "davon gesättigte Fettsäuren", per100: "< 0,01 g", perCan: "< 0,02 g", sub: true },
  { name: "Kohlenhydrate", per100: "4,2 g", perCan: "8,4 g" },
  { name: "davon Zucker", per100: "3,6 g", perCan: "7,2 g", sub: true },
  { name: "Eiweiß", per100: "0,6 g", perCan: "1,2 g" },
  { name: "Salz", per100: "0,01 g", perCan: "0,02 g" },
  { name: "Vitamin B12", per100: "0,45 µg", perCan: "0,9 µg" },
];

/**
 * PZN-8 check digit: weighted sum of the first seven digits (weights 1–7),
 * modulo 11. Returns true when the eighth digit matches.
 */
export function isValidPzn(pzn: string) {
  if (!/^\d{8}$/.test(pzn)) return false;
  const sum = [...pzn.slice(0, 7)].reduce((acc, d, i) => acc + Number(d) * (i + 1), 0);
  return sum % 11 === Number(pzn[7]);
}
