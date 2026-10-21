import { useMemo, useState } from 'react';

import type { Member } from '../groups/api';
import { buildDeck, pantryCoverage, type RecipeFilters } from '../recipes/ranking';
import type { Catalog, Recipe } from '../recipes/types';
import type { SessionRow, SwipeRow } from '@/types/database';

type Input = {
  catalog: Catalog | undefined;
  session: SessionRow | null;
  filters: RecipeFilters;
  swipes: SwipeRow[] | undefined;
  pantry: Set<string> | undefined;
  lastMatched: Map<string, Date>;
  userId: string;
  activeMembers: Member[];
};

/**
 * Berechnet die Reihenfolge der Karten einmal pro Runde/Filter/Vorrat und entfernt danach nur
 * noch gewischte Karten – so springt die sichtbare Karte nicht, wenn andere parallel swipen.
 */
export function useDeck({ catalog, session, filters, swipes, pantry, lastMatched, userId, activeMembers }: Input) {
  const activeIds = activeMembers.map((m) => m.user_id).join(',');
  const filtersKey = `${filters.maxMinutes}|${filters.diet}|${filters.category}`;

  // Swipes der anderen nur beim Neuaufbau des Stapels berücksichtigen (Snapshot pro Runde/Filter)
  const deckKey = `${session?.id}|${filtersKey}|${activeIds}`;
  const [snapshot, setSnapshot] = useState({ key: deckKey, swipes });
  if (snapshot.key !== deckKey || (snapshot.swipes === undefined && swipes !== undefined)) {
    setSnapshot({ key: deckKey, swipes });
  }
  const snapshotSwipes = snapshot.swipes;

  const ordered = useMemo(() => {
    if (!catalog || !session) return [];
    const others = new Set(activeIds.split(',').filter((id) => id && id !== userId));
    const likedByOthers = new Map<string, number>();
    for (const swipe of snapshotSwipes ?? []) {
      if (swipe.liked && others.has(swipe.user_id)) likedByOthers.set(swipe.recipe_id, (likedByOthers.get(swipe.recipe_id) ?? 0) + 1);
    }
    return buildDeck(catalog.recipes, filters, new Set(), {
      seed: session.id,
      pantry: pantry ?? new Set(),
      staples: catalog.staples,
      lastMatched,
      likedByOthers,
      otherActiveMembers: others.size,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filters/session über filtersKey/session.id
  }, [catalog, session?.id, filtersKey, pantry, lastMatched, activeIds, userId, snapshotSwipes]);

  const mySwiped = useMemo(
    () => new Set((swipes ?? []).filter((s) => s.user_id === userId).map((s) => s.recipe_id)),
    [swipes, userId],
  );

  const deck = useMemo(() => ordered.filter((r) => !mySwiped.has(r.id)), [ordered, mySwiped]);

  const progressByMember = useMemo(() => {
    const ids = new Set(ordered.map((r) => r.id));
    const counts = new Map<string, number>();
    for (const swipe of swipes ?? []) {
      if (ids.has(swipe.recipe_id)) counts.set(swipe.user_id, (counts.get(swipe.user_id) ?? 0) + 1);
    }
    return counts;
  }, [ordered, swipes]);

  const coverage = (recipe: Recipe) =>
    pantry && pantry.size > 0 && catalog ? pantryCoverage(recipe, pantry, catalog.staples) : null;

  return { deck, total: ordered.length, done: ordered.length - deck.length, progressByMember, coverage };
}
