import { useQuery } from '@tanstack/react-query';

import { unwrap } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { MatchRow } from '@/types/database';

export const matchKeys = {
  list: (groupId: string) => ['matches', groupId] as const,
  detail: (matchId: string) => ['match', matchId] as const,
};

export function useGroupMatches(groupId: string | undefined) {
  return useQuery({
    queryKey: matchKeys.list(groupId ?? 'none'),
    queryFn: async () =>
      unwrap(
        await supabase.from('matches').select('*').eq('group_id', groupId!).order('created_at', { ascending: false }).limit(200),
      ) as MatchRow[],
    enabled: !!groupId,
  });
}

export function useMatch(matchId: string | undefined) {
  return useQuery({
    queryKey: matchKeys.detail(matchId ?? 'none'),
    queryFn: async () => unwrap(await supabase.from('matches').select('*').eq('id', matchId!).single()) as MatchRow,
    enabled: !!matchId,
  });
}

/** Letztes Match-Datum je Rezept – Grundlage für „seltener vorschlagen“. */
export function lastMatchedMap(matches: MatchRow[] | undefined): Map<string, Date> {
  const map = new Map<string, Date>();
  for (const match of matches ?? []) {
    const date = new Date(match.created_at);
    const known = map.get(match.recipe_id);
    if (!known || known < date) map.set(match.recipe_id, date);
  }
  return map;
}
