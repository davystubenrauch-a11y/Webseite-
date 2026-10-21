import type { de } from './de';

type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };

/** Struktur aller Übersetzungen – abgeleitet aus der deutschen Hauptdatei. */
export type Translations = Widen<typeof de>;

type Join<K, P> = K extends string | number ? (P extends string ? `${K}.${P}` : never) : never;
type Paths<T> = T extends string ? never : { [K in keyof T]: T[K] extends string ? `${K & (string | number)}` : Join<K, Paths<T[K]>> }[keyof T];

export type TranslationKey = Paths<Translations>;
/** Schlüssel mit Pluralformen (`…_one` / `…_other`), ohne Suffix. */
export type PluralKey = TranslationKey extends infer K ? (K extends `${infer Base}_other` ? Base : never) : never;
export type AppLocale = 'de' | 'en';
