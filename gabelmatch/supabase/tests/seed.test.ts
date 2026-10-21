import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

import { asUser, createTestDb, createUser, type TestDb } from './helpers';

describe('Seed-Daten', () => {
  let db: TestDb;

  before(async () => {
    db = await createTestDb({ seed: true });
  });

  after(async () => {
    await db?.drop();
  });

  test('enthält mindestens 120 Rezepte mit Zutaten und Schritten', async () => {
    const user = await createUser(db.pool, 'Leser');
    const { rows } = await asUser(db.pool, user, (c) =>
      c.query(`
        select r.slug, cardinality(r.steps) as steps, count(ri.*)::int as ingredients
        from public.recipes r left join public.recipe_ingredients ri on ri.recipe_id = r.id
        group by r.id`),
    );
    assert.ok(rows.length >= 120, `nur ${rows.length} Rezepte`);
    for (const row of rows) {
      assert.ok(row.steps >= 3, `${row.slug} hat zu wenige Schritte`);
      assert.ok(row.ingredients >= 3, `${row.slug} hat zu wenige Zutaten`);
    }
  });

  test('kann erneut eingespielt werden (idempotent)', async () => {
    const before = await db.pool.query(`select count(*)::int as n from public.recipe_ingredients`);
    const { readFileSync } = await import('node:fs');
    const path = await import('node:path');
    await db.pool.query(readFileSync(path.resolve(__dirname, '../seed.sql'), 'utf8'));
    const after = await db.pool.query(`select count(*)::int as n from public.recipe_ingredients`);
    assert.equal(after.rows[0].n, before.rows[0].n);
  });
});
