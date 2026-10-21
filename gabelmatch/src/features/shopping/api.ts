import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { unwrap } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { ShoppingItemRow } from '@/types/database';

export const shoppingKey = (groupId: string) => ['shopping', groupId] as const;

export type NewShoppingItem = { label: string; quantity?: string | null; ingredient_id?: string | null; recipe_id?: string | null };

export function useShoppingList(groupId: string | undefined) {
  return useQuery({
    queryKey: shoppingKey(groupId ?? 'none'),
    queryFn: async () =>
      unwrap(
        await supabase.from('shopping_items').select('*').eq('group_id', groupId!).order('created_at', { ascending: true }),
      ) as ShoppingItemRow[],
    enabled: !!groupId,
  });
}

/** Lässt Zutaten weg, die schon offen auf der Liste stehen (keine Dubletten). */
export function withoutDuplicates(items: NewShoppingItem[], existing: ShoppingItemRow[]): NewShoppingItem[] {
  const open = new Set(existing.filter((i) => !i.checked).map((i) => i.ingredient_id ?? `label:${i.label.toLowerCase()}`));
  return items.filter((item) => !open.has(item.ingredient_id ?? `label:${item.label.toLowerCase()}`));
}

export function useAddShoppingItems(groupId: string | undefined, userId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (items: NewShoppingItem[]) => {
      const existing = client.getQueryData<ShoppingItemRow[]>(shoppingKey(groupId!)) ?? [];
      const fresh = withoutDuplicates(items, existing);
      if (fresh.length === 0) return 0;
      unwrap(
        await supabase.from('shopping_items').insert(
          fresh.map((item) => ({
            group_id: groupId!,
            added_by: userId,
            label: item.label.trim().slice(0, 80),
            quantity: item.quantity?.slice(0, 40) ?? null,
            ingredient_id: item.ingredient_id ?? null,
            recipe_id: item.recipe_id ?? null,
          })),
        ),
      );
      return fresh.length;
    },
    onSettled: () => client.invalidateQueries({ queryKey: shoppingKey(groupId ?? 'none') }),
  });
}

function useOptimisticShopping(groupId: string | undefined) {
  const client = useQueryClient();
  const key = shoppingKey(groupId ?? 'none');
  return {
    client,
    key,
    apply: async (update: (items: ShoppingItemRow[]) => ShoppingItemRow[]) => {
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<ShoppingItemRow[]>(key);
      client.setQueryData<ShoppingItemRow[]>(key, (items = []) => update(items));
      return { previous };
    },
  };
}

export function useToggleShoppingItem(groupId: string | undefined) {
  const { client, key, apply } = useOptimisticShopping(groupId);
  return useMutation({
    mutationFn: async ({ id, checked }: { id: string; checked: boolean }) => {
      unwrap(await supabase.from('shopping_items').update({ checked }).eq('id', id));
    },
    onMutate: ({ id, checked }) => apply((items) => items.map((i) => (i.id === id ? { ...i, checked } : i))),
    onError: (_e, _v, context) => client.setQueryData(key, context?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: key }),
  });
}

export function useRemoveShoppingItems(groupId: string | undefined) {
  const { client, key, apply } = useOptimisticShopping(groupId);
  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (ids.length) unwrap(await supabase.from('shopping_items').delete().in('id', ids));
    },
    onMutate: (ids) => apply((items) => items.filter((i) => !ids.includes(i.id))),
    onError: (_e, _v, context) => client.setQueryData(key, context?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: key }),
  });
}
