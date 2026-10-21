import { useQuery } from '@tanstack/react-query';

import { unwrap } from '@/lib/errors';
import { supabase } from '@/lib/supabase';

import type { Catalog, Ingredient, Recipe } from './types';

async function fetchCatalog(): Promise<Catalog> {
  const [recipeRows, ingredientRows] = await Promise.all([
    supabase
      .from('recipes')
      .select('*, ingredients:recipe_ingredients(position, ingredient_id, amount, unit, note)')
      .order('slug'),
    supabase.from('ingredients').select('*').order('name_de'),
  ]);
  const recipes = (unwrap(recipeRows) as unknown as Recipe[]).map((recipe) => ({
    ...recipe,
    ingredients: [...recipe.ingredients]
      .map((i) => ({ ...i, amount: i.amount == null ? null : Number(i.amount) }))
      .sort((a, b) => a.position - b.position),
  }));
  const ingredients = unwrap(ingredientRows) as Ingredient[];
  return {
    recipes,
    recipesById: new Map(recipes.map((r) => [r.id, r])),
    ingredients: new Map(ingredients.map((i) => [i.id, i])),
    staples: new Set(ingredients.filter((i) => i.is_staple).map((i) => i.id)),
  };
}

/** Rezeptkatalog – ändert sich selten und wird daher lange zwischengespeichert. */
export function useCatalog() {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: fetchCatalog,
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}
