import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { unwrap } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { GroupMemberRow, GroupRow, ProfileRow } from '@/types/database';

export type Member = GroupMemberRow & { profile: Pick<ProfileRow, 'display_name' | 'avatar_emoji'> | null };
export type GroupWithMembers = GroupRow & { members: Member[] };

export const groupKeys = { all: ['groups'] as const };

async function fetchMyGroups(): Promise<GroupWithMembers[]> {
  const rows = unwrap(
    await supabase
      .from('groups')
      .select('*, members:group_members(*, profile:profiles(display_name, avatar_emoji))')
      .order('created_at', { ascending: true }),
  );
  return (rows as unknown as GroupWithMembers[]).map((group) => ({
    ...group,
    members: [...group.members].sort((a, b) => a.joined_at.localeCompare(b.joined_at)),
  }));
}

export function useMyGroups(enabled = true) {
  return useQuery({ queryKey: groupKeys.all, queryFn: fetchMyGroups, enabled });
}

export function useCreateGroup() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => unwrap(await supabase.rpc('create_group', { p_name: name.trim() })),
    onSuccess: () => client.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

export function useJoinGroup() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => unwrap(await supabase.rpc('join_group', { p_code: code })),
    onSuccess: () => client.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

export function useLeaveGroup() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: string) => {
      unwrap(await supabase.rpc('leave_group', { p_group_id: groupId }));
    },
    onSuccess: () => client.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

export function useRenameGroup() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupId, name }: { groupId: string; name: string }) => {
      unwrap(await supabase.from('groups').update({ name: name.trim() }).eq('id', groupId));
    },
    onSuccess: () => client.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

export function useRegenerateCode() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: string) => unwrap(await supabase.rpc('regenerate_invite_code', { p_group_id: groupId })),
    onSuccess: () => client.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

/** „Esse heute mit“ umschalten – optimistisch, damit der Schalter sofort reagiert. */
export function useSetActive(userId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupId, active }: { groupId: string; active: boolean }) => {
      unwrap(await supabase.from('group_members').update({ is_active: active }).eq('group_id', groupId).eq('user_id', userId));
    },
    onMutate: async ({ groupId, active }) => {
      await client.cancelQueries({ queryKey: groupKeys.all });
      const previous = client.getQueryData<GroupWithMembers[]>(groupKeys.all);
      client.setQueryData<GroupWithMembers[]>(groupKeys.all, (groups) =>
        groups?.map((g) =>
          g.id !== groupId ? g : { ...g, members: g.members.map((m) => (m.user_id === userId ? { ...m, is_active: active } : m)) },
        ),
      );
      return { previous };
    },
    onError: (_error, _vars, context) => client.setQueryData(groupKeys.all, context?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: groupKeys.all }),
  });
}
