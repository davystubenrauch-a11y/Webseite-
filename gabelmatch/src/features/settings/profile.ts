import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { unwrap } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { ProfileRow } from '@/types/database';

import { groupKeys } from '../groups/api';

export const profileKey = (userId: string) => ['profile', userId] as const;

export function useProfile(userId: string) {
  return useQuery({
    queryKey: profileKey(userId),
    queryFn: async () => unwrap(await supabase.from('profiles').select('*').eq('id', userId).single()) as ProfileRow,
  });
}

export type ProfileUpdate = Partial<Pick<ProfileRow, 'display_name' | 'avatar_emoji' | 'locale' | 'push_enabled'>>;

export function useUpdateProfile(userId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (update: ProfileUpdate) =>
      unwrap(await supabase.from('profiles').update(update).eq('id', userId).select().single()) as ProfileRow,
    onSuccess: (profile) => {
      client.setQueryData(profileKey(userId), profile);
      void client.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}

export const AVATARS = ['🍽️', '🍝', '🍕', '🥗', '🍜', '🌮', '🍣', '🥘', '🍲', '🥐', '🧀', '🥑', '🍅', '🥕', '🌶️', '🍋', '🍓', '🍩', '🧁', '☕', '🐻', '🦊', '🐼', '🐸'];
