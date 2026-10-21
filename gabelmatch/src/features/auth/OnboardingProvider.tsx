import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { storage } from '@/lib/storage';

const KEY = 'gm.onboarded';

type OnboardingContextValue = { state: 'loading' | 'pending' | 'done'; complete: () => void };

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingContextValue['state']>('loading');
  useEffect(() => {
    storage.get(KEY).then((value) => setState(value === '1' ? 'done' : 'pending'));
  }, []);
  const complete = useCallback(() => {
    setState('done');
    void storage.set(KEY, '1');
  }, []);
  const value = useMemo(() => ({ state, complete }), [state, complete]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding muss innerhalb von OnboardingProvider verwendet werden');
  return context;
}
