import {
  buildDeck,
  matchesFilters,
  NO_FILTERS,
  pantryCoverage,
  rankRecipes,
  recencyPenalty,
  seededRandom,
  type RankableRecipe,
  type RankContext,
} from '../ranking';

const recipe = (id: string, overrides: Partial<RankableRecipe> = {}): RankableRecipe => ({
  id,
  category: 'pasta',
  diet: 'vegetarisch',
  total_minutes: 30,
  ingredients: [{ ingredient_id: 'nudeln' }, { ingredient_id: 'tomate' }, { ingredient_id: 'salz' }],
  ...overrides,
});

const context = (overrides: Partial<RankContext> = {}): RankContext => ({
  seed: 'session-1',
  pantry: new Set(),
  staples: new Set(['salz']),
  lastMatched: new Map(),
  likedByOthers: new Map(),
  otherActiveMembers: 0,
  now: new Date('2026-10-21T12:00:00Z'),
  ...overrides,
});

const many = Array.from({ length: 40 }, (_, i) => recipe(`r${String(i).padStart(2, '0')}`));

describe('Filter', () => {
  it('beschränkt die maximale Zeit', () => {
    expect(matchesFilters(recipe('a', { total_minutes: 15 }), { ...NO_FILTERS, maxMinutes: 15 })).toBe(true);
    expect(matchesFilters(recipe('a', { total_minutes: 16 }), { ...NO_FILTERS, maxMinutes: 15 })).toBe(false);
  });

  it('vegetarisch schließt vegane Gerichte ein, aber Fisch und Fleisch aus', () => {
    const filters = { ...NO_FILTERS, diet: 'vegetarisch' as const };
    expect(matchesFilters(recipe('a', { diet: 'vegan' }), filters)).toBe(true);
    expect(matchesFilters(recipe('a', { diet: 'vegetarisch' }), filters)).toBe(true);
    expect(matchesFilters(recipe('a', { diet: 'fisch' }), filters)).toBe(false);
    expect(matchesFilters(recipe('a', { diet: 'fleisch' }), filters)).toBe(false);
  });

  it('vegan lässt nur vegane Gerichte zu', () => {
    const filters = { ...NO_FILTERS, diet: 'vegan' as const };
    expect(matchesFilters(recipe('a', { diet: 'vegan' }), filters)).toBe(true);
    expect(matchesFilters(recipe('a', { diet: 'vegetarisch' }), filters)).toBe(false);
  });

  it('filtert nach Kategorie', () => {
    const filters = { ...NO_FILTERS, category: 'salate' as const };
    expect(matchesFilters(recipe('a', { category: 'salate' }), filters)).toBe(true);
    expect(matchesFilters(recipe('a', { category: 'pasta' }), filters)).toBe(false);
  });
});

describe('Vorrat', () => {
  it('ignoriert Basiszutaten und doppelte Zutaten', () => {
    const r = recipe('a', { ingredients: [{ ingredient_id: 'nudeln' }, { ingredient_id: 'nudeln' }, { ingredient_id: 'salz' }] });
    expect(pantryCoverage(r, new Set(['nudeln']), new Set(['salz']))).toEqual({
      have: 1,
      total: 1,
      ratio: 1,
      complete: true,
      missing: [],
    });
  });

  it('meldet fehlende Zutaten', () => {
    const coverage = pantryCoverage(recipe('a'), new Set(['nudeln']), new Set(['salz']));
    expect(coverage.complete).toBe(false);
    expect(coverage.missing).toEqual(['tomate']);
    expect(coverage.ratio).toBe(0.5);
  });

  it('komplett machbare Gerichte erscheinen zuerst', () => {
    const makeable = recipe('zz-machbar', { ingredients: [{ ingredient_id: 'ei' }, { ingredient_id: 'salz' }] });
    const ranked = rankRecipes([...many, makeable], context({ pantry: new Set(['ei']) }));
    expect(ranked[0].id).toBe('zz-machbar');
  });

  it('teilweise machbare Gerichte stehen vor Gerichten ohne Vorratszutat', () => {
    const partial = recipe('teilweise', { ingredients: [{ ingredient_id: 'ei' }, { ingredient_id: 'speck' }] });
    const none = Array.from({ length: 20 }, (_, i) =>
      recipe(`ohne${i}`, { ingredients: [{ ingredient_id: 'lachs' }, { ingredient_id: 'dill' }] }),
    );
    const ranked = rankRecipes([...none, partial], context({ pantry: new Set(['ei']) }));
    expect(ranked[0].id).toBe('teilweise');
  });
});

describe('Ranking', () => {
  it('ist für alle Mitglieder einer Runde identisch (deterministisch)', () => {
    const a = rankRecipes(many, context()).map((r) => r.id);
    const b = rankRecipes([...many].reverse(), context()).map((r) => r.id);
    expect(a).toEqual(b);
  });

  it('mischt jede Runde neu', () => {
    const a = rankRecipes(many, context({ seed: 'runde-1' })).map((r) => r.id);
    const b = rankRecipes(many, context({ seed: 'runde-2' })).map((r) => r.id);
    expect(a).not.toEqual(b);
  });

  it('seededRandom liefert Werte in [0, 1)', () => {
    for (let i = 0; i < 500; i++) {
      const value = seededRandom('s', String(i));
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('kürzlich gegessene Gerichte rutschen nach hinten', () => {
    const now = new Date('2026-10-21T12:00:00Z');
    const yesterday = new Date('2026-10-20T12:00:00Z');
    const ranked = rankRecipes(many, context({ now, lastMatched: new Map([['r00', yesterday]]) }));
    expect(ranked.map((r) => r.id).indexOf('r00')).toBe(many.length - 1);
  });

  it('der Abschlag nimmt mit der Zeit ab', () => {
    const now = new Date('2026-10-21T00:00:00Z');
    const daysAgo = (days: number) => new Date(now.getTime() - days * 86_400_000);
    expect(recencyPenalty(undefined, now)).toBe(0);
    expect(recencyPenalty(daysAgo(2), now)).toBeLessThan(recencyPenalty(daysAgo(10), now));
    expect(recencyPenalty(daysAgo(10), now)).toBeLessThan(recencyPenalty(daysAgo(30), now));
    expect(recencyPenalty(daysAgo(60), now)).toBe(0);
  });

  it('Gerichte, die andere schon mögen, kommen nach vorne (schnellere Matches)', () => {
    const ranked = rankRecipes(
      many,
      context({ likedByOthers: new Map([['r39', 2]]), otherActiveMembers: 2 }),
    );
    expect(ranked.map((r) => r.id).indexOf('r39')).toBeLessThan(3);
  });
});

describe('Stapel einer Runde', () => {
  it('enthält keine bereits gewischten Gerichte und respektiert Filter', () => {
    const recipes = [recipe('a', { total_minutes: 10 }), recipe('b', { total_minutes: 50 }), recipe('c', { total_minutes: 12 })];
    const deck = buildDeck(recipes, { ...NO_FILTERS, maxMinutes: 15 }, new Set(['c']), context());
    expect(deck.map((r) => r.id)).toEqual(['a']);
  });
});
