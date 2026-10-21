import { getLocales } from 'expo-localization';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { storage } from '@/lib/storage';

import { resolveLocale, translate, translatePlural, type Params } from './translate';
import type { AppLocale, PluralKey, TranslationKey } from './types';

export type { AppLocale, PluralKey, TranslationKey } from './types';

export type LocalePreference = AppLocale | 'system';

type I18nContextValue = {
  locale: AppLocale;
  preference: LocalePreference;
  setPreference: (preference: LocalePreference) => void;
  t: (key: TranslationKey, params?: Params) => string;
  tp: (key: PluralKey, count: number, params?: Params) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = 'gm.locale';

export function deviceLocale(): AppLocale {
  try {
    return resolveLocale(getLocales()[0]?.languageTag);
  } catch {
    return 'de';
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<LocalePreference>('system');

  useEffect(() => {
    storage.get(STORAGE_KEY).then((value) => {
      if (value === 'de' || value === 'en' || value === 'system') setPreferenceState(value);
    });
  }, []);

  const locale: AppLocale = preference === 'system' ? deviceLocale() : preference;

  const setPreference = useCallback((next: LocalePreference) => {
    setPreferenceState(next);
    void storage.set(STORAGE_KEY, next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      preference,
      setPreference,
      t: (key, params) => translate(locale, key, params),
      tp: (key, count, params) => translatePlural(locale, key, count, params),
    }),
    [locale, preference, setPreference],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n muss innerhalb von I18nProvider verwendet werden');
  return context;
}
