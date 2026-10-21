import { INGREDIENTS, type DietClass } from './ingredients';
import { CATEGORIES, UNITS, type Diet, type RecipeDef } from './types';

const DIET_RANK: Record<DietClass, number> = { v: 0, veg: 1, fi: 2, fl: 3 };
const DIET_BY_RANK: Diet[] = ['vegan', 'vegetarisch', 'fisch', 'fleisch'];

/** Leitet die Ernährungsform aus den Zutaten ab (strengste Zutat gewinnt). */
export function deriveDiet(recipe: RecipeDef): Diet {
  let rank = 0;
  for (const [id] of recipe.ingredients) {
    const def = INGREDIENTS[id];
    if (def) rank = Math.max(rank, DIET_RANK[def[3]]);
  }
  return DIET_BY_RANK[rank];
}

/** Prüft den Rezeptdatensatz und gibt eine Liste lesbarer Fehler zurück. */
export function validateRecipes(recipes: RecipeDef[]): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();

  if (recipes.length < 120) errors.push(`Nur ${recipes.length} Rezepte – mindestens 120 erwartet`);

  for (const recipe of recipes) {
    const where = `[${recipe.slug}]`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(recipe.slug)) errors.push(`${where} ungültiger Slug`);
    if (slugs.has(recipe.slug)) errors.push(`${where} Slug doppelt`);
    slugs.add(recipe.slug);
    if (!CATEGORIES.includes(recipe.category)) errors.push(`${where} unbekannte Kategorie ${recipe.category}`);
    if (recipe.title.length < 3 || recipe.title.length > 60) errors.push(`${where} Titellänge`);
    if (recipe.description.length < 20 || recipe.description.length > 160) errors.push(`${where} Beschreibungslänge`);
    if (recipe.minutes < 5 || recipe.minutes > 240) errors.push(`${where} unplausible Zeit`);
    if (recipe.servings < 1 || recipe.servings > 8) errors.push(`${where} unplausible Portionen`);
    if (recipe.steps.length < 3) errors.push(`${where} zu wenige Schritte`);
    if (recipe.ingredients.length < 3) errors.push(`${where} zu wenige Zutaten`);

    const seen = new Set<string>();
    for (const [id, amount, unit] of recipe.ingredients) {
      if (!INGREDIENTS[id]) errors.push(`${where} unbekannte Zutat ${id}`);
      if (seen.has(id)) errors.push(`${where} Zutat doppelt: ${id}`);
      seen.add(id);
      if (unit != null && !UNITS.includes(unit)) errors.push(`${where} unbekannte Einheit ${unit}`);
      if (amount != null && !(amount > 0)) errors.push(`${where} ungültige Menge bei ${id}`);
      if (unit != null && amount == null) errors.push(`${where} Einheit ohne Menge bei ${id}`);
    }

    const derived = deriveDiet(recipe);
    if (derived !== recipe.diet) errors.push(`${where} Ernährungsform ${recipe.diet}, laut Zutaten aber ${derived}`);
  }

  for (const category of CATEGORIES) {
    const count = recipes.filter((r) => r.category === category).length;
    if (count < 10) errors.push(`Kategorie ${category} hat nur ${count} Rezepte`);
  }
  return errors;
}
