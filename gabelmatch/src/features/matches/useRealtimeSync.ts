import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { supabase } from '@/lib/supabase';
import type { GroupMemberRow, MatchRow, PantryRow, SessionRow, ShoppingItemRow, SwipeRow } from '@/types/database';

import { groupKeys } from '../groups/api';
import { pantryKey } from '../pantry/api';
import { shoppingKey } from '../shopping/api';
import { sessionKeys } from '../swipe/api';
import { matchKeys } from './api';

/**
 * Ein Realtime-Kanal für alle Gruppen des Nutzers. RLS sorgt dafür, dass nur Zeilen
 * eigener Gruppen ankommen. Bei einem neuen Match wird `onMatch` aufgerufen.
 */
export function useRealtimeSync(userId: string, onMatch: (match: MatchRow) => void) {
  const client = useQueryClient();
  const onMatchRef = useRef(onMatch);
  onMatchRef.current = onMatch;

  useEffect(() => {
    const channel = supabase
      .channel(`sync:${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches' }, (payload) => {
        const match = payload.new as MatchRow;
        void client.invalidateQueries({ queryKey: matchKeys.list(match.group_id) });
        void client.invalidateQueries({ queryKey: sessionKeys.session(match.group_id) });
        onMatchRef.current(match);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, (payload) => {
        const row = (payload.new ?? payload.old) as Partial<SessionRow>;
        if (row.group_id) void client.invalidateQueries({ queryKey: sessionKeys.session(row.group_id) });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'swipes' }, (payload) => {
        const row = (payload.new ?? payload.old) as Partial<SwipeRow>;
        if (row.session_id && row.user_id !== userId) void client.invalidateQueries({ queryKey: sessionKeys.swipes(row.session_id) });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members' }, (payload) => {
        const row = (payload.new ?? payload.old) as Partial<GroupMemberRow>;
        void client.invalidateQueries({ queryKey: groupKeys.all });
        if (row.group_id) void client.invalidateQueries({ queryKey: sessionKeys.session(row.group_id) });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_items' }, (payload) => {
        const row = payload.new as Partial<ShoppingItemRow>;
        if (row?.group_id) void client.invalidateQueries({ queryKey: shoppingKey(row.group_id) });
        else void client.invalidateQueries({ queryKey: ['shopping'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_pantry' }, (payload) => {
        const row = (payload.new ?? payload.old) as Partial<PantryRow>;
        if (row.group_id) void client.invalidateQueries({ queryKey: pantryKey(row.group_id) });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [client, userId]);
}
