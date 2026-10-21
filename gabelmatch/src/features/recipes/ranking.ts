import type { Category, DietFilter, MaxMinutes } from '@/types/database';

/** Minimal benötigte Rezeptdaten für Filter und Ranking (erleichtert Tests). */
export type RankableRecipe = {
  id: string;
  category: Category;
  diet: 'vegan' | 'vegetarisch' | 'fisch' | 'fleisch';
  total_minutes: number;
  ingredients: { ingredient_id: string }[];
};

export type RecipeFilters = {
  maxMinutes: MaxMinutes | null;
  diet: DietFilter | null;
  category: Category | null;
};

export const NO_FILTERS: RecipeFilters = { maxMinutes: null, diet: null, category: null };

export function matchesFilters(recipe: RankableRecipe, filters: RecipeFilters): boolean {
  if (filters.maxMinutes != null && recipe.total_minutes > filters.maxMinutes) return false;
  if (filters.diet === 'vegan' && recipe.diet !== 'vegan') return false;
  if (filters.diet === 'vegetarisch' && recipe.diet !== 'vegan' && recipe.diet !== 'vegetarisch') return false;
  if (filters.category != null && recipe.category !== filters.category) return false;
  return true;
}

export type PantryCoverage = { have: number; total: number; ratio: number; complete: boolean; missing: string[] };

/** Wie viele (nicht-basis) Zutaten eines Rezepts sind im Vorrat? */
export function pantryCoverage(recipe: RankableRecipe, pantry: ReadonlySet<string>, staples: ReadonlySet<string>): PantryCoverage {
  const needed = [...new Set(recipe.ingredients.map((i) => i.ingredient_id))].filter((id) => !staples.has(id));
  const missing = needed.filter((id) => !pantry.has(id));
  const have = needed.length - missing.length;
  const total = needed.length;
  return { have, total, ratio: total === 0 ? 1 : have / total, complete: missing.length === 0, missing };
}

/**
 * Deterministische Pseudo-Zufallszahl in [0, 1) aus Seed + Schlüssel (cyrb53-Hash).
 * Alle Mitglieder einer Runde erhalten so dieselbe Grundreihenfolge.
 */
export function seededRandom(seed: string, key: string): number {
  const input = `${seed}:${key}`;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)) / 9007199254740992;
}

const DAY = 24 * 60 * 60 * 1000;

/** Abschlag für kürzlich gegessene Gerichte – je frischer, desto stärker. */
export function recencyPenalty(lastMatchedAt: Date | undefined, now: Date): number {
  if (!lastMatchedAt) return 0;
  const days = (now.getTime() - lastMatchedAt.getTime()) / DAY;
  if (days < 7) return -3;
  if (days < 21) return -1.5;
  if (days < 45) return -0.5;
  return 0;
}

export type RankContext = {
  seed: string;
  pantry: ReadonlySet<string>;
  staples: ReadonlySet<string>;
  /** Letztes Match-Datum je Rezept in dieser Gruppe */
  lastMatched: ReadonlyMap<string, Date>;
  /** Anzahl anderer aktiver Mitglieder, die ein Rezept in der Runde schon mögen */
  likedByOthers: ReadonlyMap<string, number>;
  otherActiveMembers: number;
  now?: Date;
};

export const WEIGHTS = {
  random: 1,
  pantryRatio: 2.5,
  pantryComplete: 2,
  othersLiked: 1.5,
} as const;

export function scoreRecipe(recipe: RankableRecipe, context: RankContext): number {
  const now = context.now ?? new Date();
  let score = WEIGHTS.random * seededRandom(context.seed, recipe.id);

  if (context.pantry.size > 0) {
    const coverage = pantryCoverage(recipe, context.pantry, context.staples);
    score += WEIGHTS.pantryRatio * coverage.ratio + (coverage.complete ? WEIGHTS.pantryComplete : 0);
  }

  score += recencyPenalty(context.lastMatched.get(recipe.id), now);

  if (context.otherActiveMembers > 0) {
    const likes = Math.min(context.likedByOthers.get(recipe.id) ?? 0, context.otherActiveMembers);
    score += WEIGHTS.othersLiked * (likes / context.otherActiveMembers);
  }
  return score;
}

/** Sortiert Rezepte absteigend nach Score (stabil über die Rezept-ID). */
export function rankRecipes<T extends RankableRecipe>(recipes: T[], context: RankContext): T[] {
  return recipes
    .map((recipe) => ({ recipe, score: scoreRecipe(recipe, context) }))
    .sort((a, b) => b.score - a.score || a.recipe.id.localeCompare(b.recipe.id))
    .map((entry) => entry.recipe);
}

/** Stellt den Stapel für eine Runde zusammen: filtern, bereits gewischte entfernen, ranken. */
export function buildDeck<T extends RankableRecipe>(
  recipes: T[],
  filters: RecipeFilters,
  alreadySwiped: ReadonlySet<string>,
  context: RankContext,
): T[] {
  return rankRecipes(
    recipes.filter((r) => matchesFilters(r, filters) && !alreadySwiped.has(r.id)),
    context,
  );
}
