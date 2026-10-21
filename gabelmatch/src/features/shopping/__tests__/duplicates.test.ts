import type { ShoppingItemRow } from '@/types/database';

import { withoutDuplicates } from '../api';

jest.mock('@/lib/supabase', () => ({ supabase: {} }));

const row = (overrides: Partial<ShoppingItemRow>): ShoppingItemRow => ({
  id: '1',
  group_id: 'g',
  ingredient_id: null,
  recipe_id: null,
  label: 'x',
  quantity: null,
  checked: false,
  added_by: null,
  created_at: '',
  updated_at: '',
  ...overrides,
});

describe('Einkaufsliste ohne Dubletten', () => {
  it('überspringt Zutaten, die schon offen auf der Liste stehen', () => {
    const existing = [row({ ingredient_id: 'tomate', label: 'Tomate' }), row({ ingredient_id: 'milch', label: 'Milch', checked: true })];
    const result = withoutDuplicates(
      [
        { label: 'Tomate', ingredient_id: 'tomate' },
        { label: 'Milch', ingredient_id: 'milch' },
        { label: 'Basilikum', ingredient_id: 'basilikum' },
      ],
      existing,
    );
    expect(result.map((i) => i.ingredient_id)).toEqual(['milch', 'basilikum']);
  });

  it('vergleicht freie Einträge ohne Groß-/Kleinschreibung', () => {
    expect(withoutDuplicates([{ label: 'brot' }], [row({ label: 'Brot' })])).toEqual([]);
  });
});
