import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { storage } from '@/lib/storage';

import { useMyGroups, type GroupWithMembers, type Member } from './api';

type CurrentGroupContextValue = {
  groups: GroupWithMembers[];
  group: GroupWithMembers | null;
  me: Member | null;
  activeMembers: Member[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  selectGroup: (groupId: string) => void;
};

const CurrentGroupContext = createContext<CurrentGroupContextValue | null>(null);
const KEY = 'gm.currentGroup';

export function CurrentGroupProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const query = useMyGroups();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    void storage.get(KEY).then((id) => id && setSelectedId((current) => current ?? id));
  }, []);

  const selectGroup = useCallback((groupId: string) => {
    setSelectedId(groupId);
    void storage.set(KEY, groupId);
  }, []);

  const value = useMemo<CurrentGroupContextValue>(() => {
    const groups = query.data ?? [];
    const group = groups.find((g) => g.id === selectedId) ?? groups[0] ?? null;
    const me = group?.members.find((m) => m.user_id === userId) ?? null;
    return {
      groups,
      group,
      me,
      activeMembers: group?.members.filter((m) => m.is_active) ?? [],
      isLoading: query.isLoading,
      error: query.error,
      refetch: () => void query.refetch(),
      selectGroup,
    };
  }, [query, selectedId, userId, selectGroup]);

  return <CurrentGroupContext.Provider value={value}>{children}</CurrentGroupContext.Provider>;
}

export function useCurrentGroup(): CurrentGroupContextValue {
  const context = useContext(CurrentGroupContext);
  if (!context) throw new Error('useCurrentGroup muss innerhalb von CurrentGroupProvider verwendet werden');
  return context;
}
