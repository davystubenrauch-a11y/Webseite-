import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { unwrap, unwrapMaybe } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { Category, DietFilter, MatchRow, MaxMinutes, SessionRow, SwipeRow } from '@/types/database';

import type { RecipeFilters } from '../recipes/ranking';

export const sessionKeys = {
  session: (groupId: string) => ['session', groupId] as const,
  swipes: (sessionId: string) => ['swipes', sessionId] as const,
};

export type SessionState = {
  /** laufende Runde */
  active: SessionRow | null;
  /** zuletzt beendete Runde mit Match (falls die letzte Runde ein Match hatte) */
  lastMatch: (MatchRow & { session: SessionRow }) | null;
};

async function fetchSessionState(groupId: string): Promise<SessionState> {
  const latest = unwrapMaybe(
    await supabase.from('sessions').select('*').eq('group_id', groupId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  );
  if (!latest) return { active: null, lastMatch: null };
  if (latest.status === 'active') return { active: latest, lastMatch: null };
  if (latest.status === 'matched') {
    const match = unwrapMaybe(await supabase.from('matches').select('*').eq('session_id', latest.id).maybeSingle());
    return { active: null, lastMatch: match ? { ...match, session: latest } : null };
  }
  return { active: null, lastMatch: null };
}

export function useSessionState(groupId: string | undefined) {
  return useQuery({
    queryKey: sessionKeys.session(groupId ?? 'none'),
    queryFn: () => fetchSessionState(groupId!),
    enabled: !!groupId,
  });
}

export function sessionFilters(session: Pick<SessionRow, 'max_minutes' | 'diet' | 'category'> | null): RecipeFilters {
  return { maxMinutes: session?.max_minutes ?? null, diet: session?.diet ?? null, category: session?.category ?? null };
}

export function useStartSession(groupId: string | undefined) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (filters: RecipeFilters) =>
      unwrap(
        await supabase.rpc('start_session', {
          p_group_id: groupId!,
          p_max_minutes: filters.maxMinutes,
          p_diet: filters.diet,
          p_category: filters.category,
        }),
      ),
    onSuccess: (session) => {
      client.setQueryData<SessionState>(sessionKeys.session(session.group_id), { active: session, lastMatch: null });
    },
  });
}

export function useUpdateFilters() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ session, filters }: { session: SessionRow; filters: RecipeFilters }) =>
      unwrap(
        await supabase
          .from('sessions')
          .update({ max_minutes: filters.maxMinutes as MaxMinutes | null, diet: filters.diet as DietFilter | null, category: filters.category as Category | null })
          .eq('id', session.id)
          .select()
          .single(),
      ),
    onSuccess: (session) => client.invalidateQueries({ queryKey: sessionKeys.session(session.group_id) }),
  });
}

export function useSessionSwipes(sessionId: string | undefined) {
  return useQuery({
    queryKey: sessionKeys.swipes(sessionId ?? 'none'),
    queryFn: async () => unwrap(await supabase.from('swipes').select('*').eq('session_id', sessionId!)) as SwipeRow[],
    enabled: !!sessionId,
  });
}

/** Einen Swipe speichern (optimistisch, damit die nächste Karte sofort erscheint). */
export function useSwipe(userId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ session, recipeId, liked }: { session: SessionRow; recipeId: string; liked: boolean }) => {
      unwrap(
        await supabase
          .from('swipes')
          .upsert({ session_id: session.id, user_id: userId, recipe_id: recipeId, liked }, { onConflict: 'session_id,user_id,recipe_id' }),
      );
    },
    onMutate: ({ session, recipeId, liked }) => {
      client.setQueryData<SwipeRow[]>(sessionKeys.swipes(session.id), (rows = []) => [
        ...rows.filter((r) => !(r.user_id === userId && r.recipe_id === recipeId)),
        {
          session_id: session.id,
          user_id: userId,
          recipe_id: recipeId,
          group_id: session.group_id,
          liked,
          created_at: new Date().toISOString(),
        },
      ]);
    },
    onError: (_error, { session }) => {
      void client.invalidateQueries({ queryKey: sessionKeys.swipes(session.id) });
      void client.invalidateQueries({ queryKey: sessionKeys.session(session.group_id) });
    },
  });
}
