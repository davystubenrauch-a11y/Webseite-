import type { AppLocale } from '@/lib/i18n';

import type { Ingredient } from './types';

export function ingredientName(ingredient: Ingredient | undefined, fallback: string, locale: AppLocale): string {
  if (!ingredient) return fallback;
  return locale === 'en' ? ingredient.name_en : ingredient.name_de;
}

/** Rezepttexte sind auf Deutsch; Übersetzungen können im Feld `translations` ergänzt werden. */
export function localizedRecipe<T extends { title: string; description: string; steps: string[]; translations: unknown }>(
  recipe: T,
  locale: AppLocale,
): { title: string; description: string; steps: string[] } {
  const translation = (recipe.translations as Record<string, Partial<{ title: string; description: string; steps: string[] }>> | null)?.[
    locale
  ];
  return {
    title: translation?.title ?? recipe.title,
    description: translation?.description ?? recipe.description,
    steps: translation?.steps?.length ? translation.steps : recipe.steps,
  };
}
