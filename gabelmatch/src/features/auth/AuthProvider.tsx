import type { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { isConfigured } from '@/lib/env';
import { storage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

type AuthContextValue = {
  session: Session | null;
  userId: string | null;
  initializing: boolean;
  /** true, nachdem ein Passwort-Reset-Link geöffnet wurde */
  passwordRecovery: boolean;
  clearPasswordRecovery: () => void;
  markPasswordRecovery: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(isConfigured);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  useEffect(() => {
    if (!isConfigured) return;
    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) setSession(data.session);
      })
      .finally(() => mounted && setInitializing(false));

    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);
      if (event === 'SIGNED_OUT') queryClient.clear();
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [queryClient]);

  const signOut = useCallback(async () => {
    const { removePushToken } = await import('@/features/notifications/register');
    await removePushToken().catch(() => undefined);
    await supabase.auth.signOut().catch(() => supabase.auth.signOut({ scope: 'local' }));
    await storage.remove('gm.currentGroup');
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      userId: session?.user.id ?? null,
      initializing,
      passwordRecovery,
      clearPasswordRecovery: () => setPasswordRecovery(false),
      markPasswordRecovery: () => setPasswordRecovery(true),
      signOut,
    }),
    [session, initializing, passwordRecovery, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden');
  return context;
}

/** Für Bereiche, die nur angemeldet erreichbar sind. */
export function useUserId(): string {
  const { userId } = useAuth();
  if (!userId) throw new Error('Kein angemeldeter Nutzer');
  return userId;
}
