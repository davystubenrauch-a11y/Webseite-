import type { Category } from '@/types/database';

export const CATEGORIES: Category[] = [
  'pasta',
  'reis_getreide',
  'suppen_eintoepfe',
  'salate',
  'ofen_auflauf',
  'pfanne_wok',
  'kartoffeln',
  'brot_snacks',
  'fruehstueck_suesses',
];

/**
 * Platzhalter-Illustration je Kategorie. Sobald ein Rezept in der Datenbank eine
 * `image_url` (z. B. aus Supabase Storage) hat, wird stattdessen das Foto angezeigt.
 */
export const CATEGORY_IMAGES: Record<Category, number> = {
  pasta: require('@/assets/images/categories/pasta.jpg'),
  reis_getreide: require('@/assets/images/categories/reis_getreide.jpg'),
  suppen_eintoepfe: require('@/assets/images/categories/suppen_eintoepfe.jpg'),
  salate: require('@/assets/images/categories/salate.jpg'),
  ofen_auflauf: require('@/assets/images/categories/ofen_auflauf.jpg'),
  pfanne_wok: require('@/assets/images/categories/pfanne_wok.jpg'),
  kartoffeln: require('@/assets/images/categories/kartoffeln.jpg'),
  brot_snacks: require('@/assets/images/categories/brot_snacks.jpg'),
  fruehstueck_suesses: require('@/assets/images/categories/fruehstueck_suesses.jpg'),
};
