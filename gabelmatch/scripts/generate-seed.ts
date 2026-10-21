/**
 * Erzeugt supabase/seed.sql aus den Rezeptdaten in supabase/seed/.
 * Aufruf: npm run seed:generate
 *
 * Rezepte werden über ihren Slug identifiziert (deterministische UUID), daher kann der
 * Seed beliebig oft eingespielt werden – vorhandene Rezepte werden aktualisiert,
 * bereits hinterlegte Fotos (image_url) bleiben erhalten.
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

import { INGREDIENTS, RECIPES } from '../supabase/seed';
import { validateRecipes } from '../supabase/seed/validate';

const errors = validateRecipes(RECIPES);
if (errors.length) {
  console.error(`Rezeptdaten fehlerhaft:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

export function recipeUuid(slug: string): string {
  const hex = createHash('md5').update(`gabelmatch:recipe:${slug}`).digest('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

const q = (value: string | number | null | undefined): string =>
  value == null ? 'null' : typeof value === 'number' ? String(value) : `'${value.replace(/'/g, "''")}'`;
const arr = (values: string[]) => `array[${values.map(q).join(', ')}]::text[]`;

const out: string[] = [
  '-- AUTOMATISCH ERZEUGT durch scripts/generate-seed.ts – nicht von Hand bearbeiten.',
  `-- ${RECIPES.length} Rezepte, ${Object.keys(INGREDIENTS).length} Zutaten`,
  'begin;',
  '',
  'insert into public.ingredients (id, name_de, name_en, aisle, is_staple) values',
  Object.entries(INGREDIENTS)
    .map(([id, [de, en, aisle, , staple]]) => `  (${q(id)}, ${q(de)}, ${q(en)}, ${q(aisle)}, ${staple ? 'true' : 'false'})`)
    .join(',\n'),
  'on conflict (id) do update set name_de = excluded.name_de, name_en = excluded.name_en,',
  '  aisle = excluded.aisle, is_staple = excluded.is_staple;',
  '',
  'insert into public.recipes (id, slug, title, description, category, diet, total_minutes, difficulty, servings, steps) values',
  RECIPES.map(
    (r) =>
      `  (${q(recipeUuid(r.slug))}, ${q(r.slug)}, ${q(r.title)}, ${q(r.description)}, ${q(r.category)}, ${q(r.diet)}, ` +
      `${r.minutes}, ${r.difficulty}, ${r.servings}, ${arr(r.steps)})`,
  ).join(',\n'),
  'on conflict (slug) do update set title = excluded.title, description = excluded.description,',
  '  category = excluded.category, diet = excluded.diet, total_minutes = excluded.total_minutes,',
  '  difficulty = excluded.difficulty, servings = excluded.servings, steps = excluded.steps;',
  '',
  `delete from public.recipe_ingredients where recipe_id in (select id from public.recipes where slug in (${RECIPES.map((r) => q(r.slug)).join(', ')}));`,
  '',
  'insert into public.recipe_ingredients (recipe_id, position, ingredient_id, amount, unit, note) values',
  RECIPES.flatMap((r) =>
    r.ingredients.map(
      ([id, amount, unit, note], index) =>
        `  (${q(recipeUuid(r.slug))}, ${index + 1}, ${q(id)}, ${q(amount ?? null)}, ${q(unit ?? null)}, ${q(note ?? null)})`,
    ),
  ).join(',\n') + ';',
  '',
  'commit;',
  '',
];

const target = path.resolve(__dirname, '../supabase/seed.sql');
writeFileSync(target, out.join('\n'));
console.log(`seed.sql geschrieben: ${RECIPES.length} Rezepte, ${Object.keys(INGREDIENTS).length} Zutaten`);
