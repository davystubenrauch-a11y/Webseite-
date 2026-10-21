import { formatNumber, formatQuantity, roundForKitchen, scaleAmount, unitLabel } from '../scaling';

describe('Portionen skalieren', () => {
  it('skaliert linear', () => {
    expect(scaleAmount(200, 2, 4)).toBe(400);
    expect(scaleAmount(3, 4, 2)).toBe(1.5);
    expect(scaleAmount(null, 2, 4)).toBeNull();
  });

  it('rundet küchentauglich', () => {
    expect(roundForKitchen(333.33, 'g')).toBe(330);
    expect(roundForKitchen(612, 'g')).toBe(600);
    expect(roundForKitchen(23, 'ml')).toBe(25);
    expect(roundForKitchen(0.33, 'EL')).toBe(0.25);
    expect(roundForKitchen(1.33, null)).toBe(1.5);
    expect(roundForKitchen(0.1, 'Zehe')).toBe(0.25);
  });

  it('formatiert Brüche und Einheiten', () => {
    expect(formatNumber(1.5, 'de')).toBe('1½');
    expect(formatNumber(0.25, 'de')).toBe('¼');
    expect(formatNumber(2, 'de')).toBe('2');
    expect(formatNumber(1.2, 'de')).toBe('1,2');
    expect(formatNumber(1.2, 'en')).toBe('1.2');
    expect(unitLabel('Zehe', 1, 'de')).toBe('Zehe');
    expect(unitLabel('Zehe', 2, 'de')).toBe('Zehen');
    expect(unitLabel('EL', 2, 'en')).toBe('tbsp');
  });

  it('kombiniert alles zu einer lesbaren Menge', () => {
    expect(formatQuantity(250, 'g', 2, 4, 'de')).toBe('500 g');
    expect(formatQuantity(1, 'Dose', 2, 3, 'de')).toBe('1½ Dosen');
    expect(formatQuantity(2, 'Zehe', 4, 2, 'en')).toBe('1 clove');
    expect(formatQuantity(null, null, 2, 4, 'de')).toBeNull();
  });
});
