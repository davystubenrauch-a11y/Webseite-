import { CATEGORIES as SEED_CATEGORIES, RECIPES } from '../../../../supabase/seed';
import { validateRecipes } from '../../../../supabase/seed/validate';
import { CATEGORIES, CATEGORY_IMAGES } from '../categories';

describe('Rezeptdatensatz', () => {
  it('ist gültig (≥ 120 Rezepte, bekannte Zutaten, korrekte Ernährungsform)', () => {
    expect(validateRecipes(RECIPES)).toEqual([]);
  });

  it('App und Seed kennen dieselben Kategorien und jede hat eine Illustration', () => {
    expect([...CATEGORIES].sort()).toEqual([...SEED_CATEGORIES].sort());
    for (const category of CATEGORIES) expect(CATEGORY_IMAGES[category]).toBeDefined();
  });

  it('bietet genug schnelle und vegane Gerichte für die Filter', () => {
    expect(RECIPES.filter((r) => r.minutes <= 15).length).toBeGreaterThanOrEqual(10);
    expect(RECIPES.filter((r) => r.minutes <= 30).length).toBeGreaterThanOrEqual(50);
    expect(RECIPES.filter((r) => r.diet === 'vegan').length).toBeGreaterThanOrEqual(25);
  });
});
