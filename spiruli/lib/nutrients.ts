export type Group = "b" | "vit" | "amino";
export type Nutrient = {
  symbol: string;
  name: string;
  alt?: string;
  group: Group;
  tags: string[];
  text: string;
  /**
   * EU-authorised health claims (VO (EU) Nr. 432/2012), shortened. Only
   * usable on-pack if the product supplies a significant amount.
   */
  claims?: string[];
};

export const groups: Record<Group, { label: string; color: string }> = {
  b: { label: "B-Komplex", color: "#134A5A" },
  vit: { label: "Vitamine", color: "#B8740A" },
  amino: { label: "Aminosäuren", color: "#2F8A4E" },
};

export const nutrients: Nutrient[] = [
  {
    symbol: "B2",
    name: "Riboflavin",
    group: "b",
    tags: ["Natürlich", "Wasserlöslich"],
    text: "Bestandteil der Coenzyme FAD und FMN, die in zahlreichen Redoxreaktionen des Stoffwechsels mitwirken.",
    claims: ["Normaler Energiestoffwechsel", "Verringerung von Müdigkeit und Ermüdung", "Schutz der Zellen vor oxidativem Stress"],
  },
  {
    symbol: "B3",
    name: "Niacin",
    group: "b",
    tags: ["Natürlich", "Wasserlöslich"],
    text: "Vorstufe von NAD und NADP – zentrale Elektronenüberträger im Energiestoffwechsel jeder Zelle.",
    claims: ["Normaler Energiestoffwechsel", "Normale psychische Funktion", "Verringerung von Müdigkeit und Ermüdung"],
  },
  {
    symbol: "B6",
    name: "Pyridoxin",
    alt: "Vitamin B6",
    group: "b",
    tags: ["Natürlich", "Wasserlöslich"],
    text: "Als Pyridoxalphosphat Coenzym im Aminosäurestoffwechsel – das Bindeglied zwischen B-Komplex und Aminosäuren.",
    claims: ["Normaler Energiestoffwechsel", "Normale Cysteinsynthese", "Regulierung der Hormontätigkeit", "Verringerung von Müdigkeit und Ermüdung"],
  },
  {
    symbol: "B12",
    name: "Cobalamin",
    alt: "Vitamin B12",
    group: "b",
    tags: ["Natürlich", "Vegan relevant"],
    text: "Für vegane Ernährung besonders relevant, da es in pflanzlichen Lebensmitteln kaum vorkommt.",
    claims: ["Normaler Energiestoffwechsel", "Normale Bildung roter Blutkörperchen", "Normale Funktion des Immunsystems", "Verringerung von Müdigkeit und Ermüdung"],
  },
  {
    symbol: "B9",
    name: "Folsäure",
    alt: "Folat",
    group: "vit",
    tags: ["Wasserlöslich"],
    text: "Beteiligt an Zellteilung und am Aufbau von Aminosäuren – eng verzahnt mit Vitamin B12.",
    claims: ["Normale Blutbildung", "Normale Aminosäuresynthese", "Normale Funktion des Immunsystems", "Verringerung von Müdigkeit und Ermüdung"],
  },
  {
    symbol: "C",
    name: "Vitamin C",
    alt: "Ascorbinsäure",
    group: "vit",
    tags: ["Zitrus", "Antioxidans"],
    text: "Aus der Zitrus-Komponente: ein frisches Plus, das die B-Vitamine der Algenbasis ergänzt.",
    claims: ["Normale Funktion des Immunsystems", "Normale Kollagenbildung", "Normaler Energiestoffwechsel", "Verringerung von Müdigkeit und Ermüdung"],
  },
  // Essential amino acids
  { symbol: "Leu", name: "Leucin", group: "amino", tags: ["Essentiell", "BCAA"], text: "Verzweigtkettige Aminosäure (BCAA) und häufigster Proteinbaustein in der Muskulatur." },
  { symbol: "Ile", name: "Isoleucin", group: "amino", tags: ["Essentiell", "BCAA"], text: "Verzweigtkettige Aminosäure (BCAA) – vom Körper nicht selbst herstellbar." },
  { symbol: "Val", name: "Valin", group: "amino", tags: ["Essentiell", "BCAA"], text: "Die dritte der drei verzweigtkettigen Aminosäuren (BCAA)." },
  { symbol: "Trp", name: "Tryptophan", group: "amino", tags: ["Essentiell"], text: "Essentielle Aminosäure; im Stoffwechsel Vorstufe von Serotonin und Melatonin." },
  { symbol: "Lys", name: "Lysin", group: "amino", tags: ["Essentiell"], text: "Essentieller Baustein, beteiligt am Aufbau von Strukturproteinen wie Kollagen." },
  { symbol: "Met", name: "Methionin", group: "amino", tags: ["Essentiell"], text: "Schwefelhaltige, essentielle Aminosäure und Startpunkt jeder Proteinsynthese." },
  { symbol: "Phe", name: "Phenylalanin", group: "amino", tags: ["Essentiell"], text: "Essentielle aromatische Aminosäure; Vorstufe von Tyrosin." },
  { symbol: "Thr", name: "Threonin", group: "amino", tags: ["Essentiell"], text: "Essentielle Aminosäure, wichtiger Bestandteil vieler Struktur- und Schleimhautproteine." },
  { symbol: "His", name: "Histidin", group: "amino", tags: ["Essentiell"], text: "Für Erwachsene essentiell; Vorstufe von Histamin." },
  // Non-essential and conditionally essential
  { symbol: "Glu", name: "Glutaminsäure", group: "amino", tags: ["Nicht-essentiell"], text: "Häufigste Aminosäure in vielen Proteinen und Vorstufe von GABA." },
  { symbol: "Asp", name: "Asparaginsäure", group: "amino", tags: ["Nicht-essentiell"], text: "Beteiligt am Harnstoffzyklus und an der Synthese weiterer Aminosäuren." },
  { symbol: "Ala", name: "Alanin", group: "amino", tags: ["Nicht-essentiell"], text: "Zentral im Glucose-Alanin-Zyklus zwischen Muskel und Leber." },
  { symbol: "Arg", name: "Arginin", group: "amino", tags: ["Semi-essentiell"], text: "Vorstufe von Stickstoffmonoxid (NO) im Stoffwechsel." },
  { symbol: "Gly", name: "Glycin", group: "amino", tags: ["Nicht-essentiell"], text: "Kleinste Aminosäure und wichtiger Baustein von Kollagen." },
  { symbol: "Ser", name: "Serin", group: "amino", tags: ["Nicht-essentiell"], text: "Baustein von Phospholipiden in Zellmembranen." },
  { symbol: "Pro", name: "Prolin", group: "amino", tags: ["Nicht-essentiell"], text: "Gibt Kollagen gemeinsam mit Glycin seine Struktur." },
  { symbol: "Tyr", name: "Tyrosin", group: "amino", tags: ["Semi-essentiell"], text: "Vorstufe von Dopamin, Noradrenalin und Schilddrüsenhormonen." },
  { symbol: "Cys", name: "Cystein", group: "amino", tags: ["Semi-essentiell"], text: "Schwefelhaltig; Baustein des Antioxidans Glutathion." },
  { symbol: "GABA", name: "γ-Aminobuttersäure", group: "amino", tags: ["Nicht-proteinogen", "Fermentation"], text: "Entsteht u. a. bei der Fermentation aus Glutaminsäure; im Nervensystem ein Botenstoff." },
];

export type Filter = { id: string; label: string; test: (n: Nutrient) => boolean };

export const filters: Filter[] = [
  { id: "all", label: "Alle", test: () => true },
  { id: "b", label: "B-Komplex", test: (n) => n.group === "b" },
  { id: "vit", label: "Vitamin C & Folsäure", test: (n) => n.group === "vit" },
  { id: "amino", label: "Aminosäuren", test: (n) => n.group === "amino" },
  { id: "ess", label: "Essentiell", test: (n) => n.tags.includes("Essentiell") },
  { id: "bcaa", label: "BCAA", test: (n) => n.tags.includes("BCAA") },
];
