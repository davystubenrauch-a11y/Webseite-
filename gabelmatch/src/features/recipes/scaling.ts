import type { AppLocale } from '@/lib/i18n';

/** Skaliert eine Menge von `from` auf `to` Portionen. */
export function scaleAmount(amount: number | null, from: number, to: number): number | null {
  if (amount == null) return null;
  if (from <= 0) return amount;
  return (amount * to) / from;
}

const COUNT_UNITS = new Set([null, 'Zehe', 'Dose', 'Scheibe', 'Becher', 'Pck.', 'Stange', 'Zweig', 'Glas', 'Blatt', 'Bund', 'Handvoll', 'Prise']);

/** Rundet auf küchentaugliche Werte (Gramm in sinnvollen Schritten, Stückzahlen auf Viertel/Halbe). */
export function roundForKitchen(value: number, unit: string | null): number {
  if (unit === 'g' || unit === 'ml') {
    if (value >= 500) return Math.round(value / 25) * 25;
    if (value >= 100) return Math.round(value / 10) * 10;
    if (value >= 20) return Math.round(value / 5) * 5;
    return Math.max(1, Math.round(value));
  }
  if (unit === 'kg' || unit === 'l') return Math.round(value * 20) / 20;
  if (unit === 'EL' || unit === 'TL') return Math.max(0.25, Math.round(value * 4) / 4);
  if (COUNT_UNITS.has(unit)) {
    if (value < 1) return Math.max(0.25, Math.round(value * 4) / 4);
    return Math.round(value * 2) / 2;
  }
  return Math.round(value * 100) / 100;
}

const FRACTIONS: Record<string, string> = { '0.25': '¼', '0.5': '½', '0.75': '¾' };

export function formatNumber(value: number, locale: AppLocale): string {
  const whole = Math.floor(value);
  const rest = Math.round((value - whole) * 100) / 100;
  const fraction = FRACTIONS[String(rest)];
  if (fraction) return whole === 0 ? fraction : `${whole}${fraction}`;
  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-GB', { maximumFractionDigits: 2 }).format(value);
}

const UNIT_LABELS: Record<string, { de: [string, string]; en: [string, string] }> = {
  g: { de: ['g', 'g'], en: ['g', 'g'] },
  kg: { de: ['kg', 'kg'], en: ['kg', 'kg'] },
  ml: { de: ['ml', 'ml'], en: ['ml', 'ml'] },
  l: { de: ['l', 'l'], en: ['l', 'l'] },
  EL: { de: ['EL', 'EL'], en: ['tbsp', 'tbsp'] },
  TL: { de: ['TL', 'TL'], en: ['tsp', 'tsp'] },
  Prise: { de: ['Prise', 'Prisen'], en: ['pinch', 'pinches'] },
  Bund: { de: ['Bund', 'Bund'], en: ['bunch', 'bunches'] },
  Zehe: { de: ['Zehe', 'Zehen'], en: ['clove', 'cloves'] },
  Dose: { de: ['Dose', 'Dosen'], en: ['can', 'cans'] },
  Scheibe: { de: ['Scheibe', 'Scheiben'], en: ['slice', 'slices'] },
  Becher: { de: ['Becher', 'Becher'], en: ['pot', 'pots'] },
  'Pck.': { de: ['Pck.', 'Pck.'], en: ['pack', 'packs'] },
  Handvoll: { de: ['Handvoll', 'Handvoll'], en: ['handful', 'handfuls'] },
  Stange: { de: ['Stange', 'Stangen'], en: ['stalk', 'stalks'] },
  Zweig: { de: ['Zweig', 'Zweige'], en: ['sprig', 'sprigs'] },
  Glas: { de: ['Glas', 'Gläser'], en: ['jar', 'jars'] },
  Blatt: { de: ['Blatt', 'Blätter'], en: ['leaf', 'leaves'] },
};

export function unitLabel(unit: string | null, value: number, locale: AppLocale): string {
  if (!unit) return '';
  const labels = UNIT_LABELS[unit];
  if (!labels) return unit;
  return labels[locale][value > 1 ? 1 : 0];
}

/** „250 g“, „1½ Dosen“, „2“ – oder null, wenn keine Menge angegeben ist (nach Geschmack). */
export function formatQuantity(amount: number | null, unit: string | null, from: number, to: number, locale: AppLocale): string | null {
  const scaled = scaleAmount(amount, from, to);
  if (scaled == null) return null;
  const rounded = roundForKitchen(scaled, unit);
  const label = unitLabel(unit, rounded, locale);
  return label ? `${formatNumber(rounded, locale)} ${label}` : formatNumber(rounded, locale);
}
