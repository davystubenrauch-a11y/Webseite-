export const CATEGORIES = [
  'pasta',
  'reis_getreide',
  'suppen_eintoepfe',
  'salate',
  'ofen_auflauf',
  'pfanne_wok',
  'kartoffeln',
  'brot_snacks',
  'fruehstueck_suesses',
] as const;
export type Category = (typeof CATEGORIES)[number];

export type Diet = 'vegan' | 'vegetarisch' | 'fisch' | 'fleisch';

export const UNITS = [
  'g',
  'kg',
  'ml',
  'l',
  'EL',
  'TL',
  'Prise',
  'Bund',
  'Zehe',
  'Dose',
  'Scheibe',
  'Becher',
  'Pck.',
  'Handvoll',
  'Stange',
  'Zweig',
  'Glas',
  'Blatt',
] as const;
export type Unit = (typeof UNITS)[number];

/** [Zutat-ID, Menge, Einheit, Notiz] – Menge null = „nach Geschmack“ */
export type IngredientLine = [id: string, amount?: number | null, unit?: Unit | null, note?: string];

export type RecipeDef = {
  slug: string;
  title: string;
  description: string;
  category: Category;
  diet: Diet;
  minutes: number;
  difficulty: 1 | 2 | 3;
  servings: number;
  ingredients: IngredientLine[];
  steps: string[];
};
