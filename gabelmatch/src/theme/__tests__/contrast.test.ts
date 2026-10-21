import { contrastRatio, palette } from '../colors';

describe('Farbkontraste (WCAG AA)', () => {
  for (const scheme of ['light', 'dark'] as const) {
    const c = palette[scheme];
    const pairs: [string, string, string][] = [
      ['Text auf Hintergrund', c.text, c.background],
      ['Text auf Fläche', c.text, c.surface],
      ['Sekundärtext auf Hintergrund', c.textMuted, c.background],
      ['Sekundärtext auf Fläche', c.textMuted, c.surface],
      ['Button-Text auf Primärfarbe', c.onPrimary, c.primary],
      ['Primärfarbe als Text auf Hintergrund', c.primary, c.background],
      ['Text auf Primär-Soft', c.onPrimarySoft, c.primarySoft],
      ['Text auf Erfolg', c.onSuccess, c.success],
      ['Text auf Gefahr', c.onDanger, c.danger],
      ['Hintergrund auf Text (Banner)', c.background, c.text],
    ];
    for (const [name, fg, bg] of pairs) {
      it(`${scheme}: ${name} ≥ 4,5:1`, () => {
        expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
