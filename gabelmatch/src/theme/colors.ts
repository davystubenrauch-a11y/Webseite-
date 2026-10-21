/**
 * Farbpalette „Paprika“. Alle Text/Hintergrund-Paare erfüllen WCAG AA (≥ 4,5 : 1),
 * siehe src/theme/__tests__/contrast.test.ts.
 */
export const palette = {
  light: {
    background: '#FFF8F1',
    surface: '#FFFFFF',
    surfaceAlt: '#F7EADF',
    text: '#2B1D16',
    textMuted: '#6B5548',
    border: '#EADBCD',
    primary: '#C93A22',
    onPrimary: '#FFFFFF',
    primarySoft: '#FBE1D8',
    onPrimarySoft: '#8A2414',
    success: '#23854D',
    onSuccess: '#FFFFFF',
    danger: '#B3261E',
    onDanger: '#FFFFFF',
    like: '#23854D',
    nope: '#C93A22',
    highlight: '#FFC94D',
    overlay: 'rgba(43, 29, 22, 0.55)',
    shadow: '#5A3A28',
  },
  dark: {
    background: '#17110E',
    surface: '#241B17',
    surfaceAlt: '#2F241F',
    text: '#F8EDE5',
    textMuted: '#BBA89C',
    border: '#3A2D26',
    primary: '#FF8A6B',
    onPrimary: '#1A0E09',
    primarySoft: '#4A2A20',
    onPrimarySoft: '#FFD5C8',
    success: '#7FDBA0',
    onSuccess: '#0E1A12',
    danger: '#FF8A80',
    onDanger: '#1A0E09',
    like: '#7FDBA0',
    nope: '#FF8A6B',
    highlight: '#FFC94D',
    overlay: 'rgba(0, 0, 0, 0.65)',
    shadow: '#000000',
  },
} as const;

export type ColorScheme = keyof typeof palette;
export type Colors = { [K in keyof (typeof palette)['light']]: string };

/** Relative Leuchtdichte nach WCAG 2.x */
export function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
