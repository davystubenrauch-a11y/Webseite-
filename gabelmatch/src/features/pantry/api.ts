import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { unwrap } from '@/lib/errors';
import { supabase } from '@/lib/supabase';

export const pantryKey = (groupId: string) => ['pantry', groupId] as const;

export function usePantry(groupId: string | undefined) {
  return useQuery({
    queryKey: pantryKey(groupId ?? 'none'),
    queryFn: async () => {
      const rows = unwrap(await supabase.from('group_pantry').select('ingredient_id').eq('group_id', groupId!));
      return new Set(rows.map((row) => row.ingredient_id));
    },
    enabled: !!groupId,
  });
}

export function useTogglePantry(groupId: string | undefined, userId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ ingredientId, present }: { ingredientId: string; present: boolean }) => {
      if (present) {
        const { error } = await supabase
          .from('group_pantry')
          .upsert({ group_id: groupId!, ingredient_id: ingredientId, added_by: userId }, { onConflict: 'group_id,ingredient_id', ignoreDuplicates: true });
        if (error) throw error;
      } else {
        unwrap(await supabase.from('group_pantry').delete().eq('group_id', groupId!).eq('ingredient_id', ingredientId));
      }
    },
    onMutate: async ({ ingredientId, present }) => {
      const key = pantryKey(groupId ?? 'none');
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<Set<string>>(key);
      const next = new Set(previous);
      if (present) next.add(ingredientId);
      else next.delete(ingredientId);
      client.setQueryData(key, next);
      return { previous };
    },
    onError: (_error, _vars, context) => client.setQueryData(pantryKey(groupId ?? 'none'), context?.previous),
  });
}

export function useClearPantry(groupId: string | undefined) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      unwrap(await supabase.from('group_pantry').delete().eq('group_id', groupId!));
    },
    onSuccess: () => client.setQueryData(pantryKey(groupId ?? 'none'), new Set<string>()),
  });
}
