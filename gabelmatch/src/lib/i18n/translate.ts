import { de } from './de';
import { en } from './en';
import type { AppLocale, PluralKey, TranslationKey, Translations } from './types';

export const dictionaries: Record<AppLocale, Translations> = { de, en };

export type Params = Record<string, string | number>;

function lookup(dict: Translations, key: string): string | undefined {
  let node: unknown = dict;
  for (const part of key.split('.')) {
    if (node && typeof node === 'object' && part in node) node = (node as Record<string, unknown>)[part];
    else return undefined;
  }
  return typeof node === 'string' ? node : undefined;
}

export function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
}

/** Übersetzt einen Schlüssel; fällt auf Deutsch und zuletzt auf den Schlüssel selbst zurück. */
export function translate(locale: AppLocale, key: TranslationKey, params?: Params): string {
  const template = lookup(dictionaries[locale], key) ?? lookup(dictionaries.de, key) ?? key;
  return interpolate(template, params);
}

/** Pluralform (Deutsch und Englisch: 1 = „one“, sonst „other“). */
export function translatePlural(locale: AppLocale, key: PluralKey, count: number, params?: Params): string {
  const suffix = count === 1 ? '_one' : '_other';
  return translate(locale, `${key}${suffix}` as TranslationKey, { count, ...params });
}

export function resolveLocale(tag: string | null | undefined): AppLocale {
  return tag?.toLowerCase().startsWith('de') ? 'de' : tag?.toLowerCase().startsWith('en') ? 'en' : 'de';
}
