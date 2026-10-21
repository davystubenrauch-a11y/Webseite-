import type { IngredientRow, RecipeIngredientRow, RecipeRow } from '@/types/database';

export type RecipeIngredient = Omit<RecipeIngredientRow, 'recipe_id'>;
export type Recipe = RecipeRow & { ingredients: RecipeIngredient[] };
export type Ingredient = IngredientRow;

export type Catalog = {
  recipes: Recipe[];
  recipesById: Map<string, Recipe>;
  ingredients: Map<string, Ingredient>;
  staples: Set<string>;
};
