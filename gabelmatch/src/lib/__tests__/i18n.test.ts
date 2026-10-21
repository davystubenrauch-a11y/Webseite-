import { de } from '../i18n/de';
import { en } from '../i18n/en';
import { interpolate, resolveLocale, translate, translatePlural } from '../i18n/translate';

function keys(node: unknown, prefix = ''): string[] {
  if (typeof node === 'string') return [prefix];
  return Object.entries(node as Record<string, unknown>).flatMap(([key, value]) => keys(value, prefix ? `${prefix}.${key}` : key));
}

function placeholders(text: string): string[] {
  return (text.match(/\{\w+\}/g) ?? []).sort();
}

describe('Übersetzungen', () => {
  it('Englisch hat genau dieselben Schlüssel wie Deutsch', () => {
    expect(keys(en).sort()).toEqual(keys(de).sort());
  });

  it('Platzhalter stimmen in beiden Sprachen überein', () => {
    for (const key of keys(de)) {
      const deText = key.split('.').reduce<unknown>((n, k) => (n as Record<string, unknown>)[k], de) as string;
      const enText = key.split('.').reduce<unknown>((n, k) => (n as Record<string, unknown>)[k], en) as string;
      expect([key, placeholders(enText)]).toEqual([key, placeholders(deText)]);
    }
  });

  it('keine leeren Texte', () => {
    for (const key of keys(en)) {
      expect(translate('en', key as never).trim().length).toBeGreaterThan(0);
    }
  });

  it('setzt Parameter und Pluralformen ein', () => {
    expect(interpolate('Hallo {name}', { name: 'Anna' })).toBe('Hallo Anna');
    expect(translatePlural('de', 'common.servings', 1)).toBe('1 Portion');
    expect(translatePlural('de', 'common.servings', 4)).toBe('4 Portionen');
    expect(translatePlural('en', 'common.servings', 2)).toBe('2 servings');
    expect(translate('de', 'difficulty.2')).toBe('Mittel');
  });

  it('erkennt die Gerätesprache', () => {
    expect(resolveLocale('de-AT')).toBe('de');
    expect(resolveLocale('en-US')).toBe('en');
    expect(resolveLocale('fr-FR')).toBe('de');
    expect(resolveLocale(undefined)).toBe('de');
  });
});
