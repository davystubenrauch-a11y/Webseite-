import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';

import { asUser, createTestDb, createUser, expectError, insertTestRecipes, type TestDb } from './helpers';

describe('Echtzeit-Matching (Datenbanklogik)', () => {
  let db: TestDb;
  let recipes: string[];
  let anna: string;
  let ben: string;
  let carla: string;
  let groupId: string;
  let sessionId: string;

  const swipe = (userId: string, recipeId: string, liked: boolean, session = sessionId) =>
    asUser(db.pool, userId, (c) =>
      c.query(
        `insert into public.swipes (session_id, user_id, recipe_id, liked) values ($1, $2, $3, $4)
         on conflict (session_id, user_id, recipe_id) do update set liked = excluded.liked`,
        [session, userId, recipeId, liked],
      ),
    );

  const matches = async () =>
    (await db.pool.query(`select * from public.matches where group_id = $1 order by created_at`, [groupId])).rows;

  before(async () => {
    db = await createTestDb();
    recipes = await insertTestRecipes(db.pool);
  });

  after(async () => {
    await db?.drop();
  });

  beforeEach(async () => {
    anna = await createUser(db.pool, 'Anna');
    ben = await createUser(db.pool, 'Ben');
    carla = await createUser(db.pool, 'Carla');
    const group = await asUser(db.pool, anna, (c) => c.query(`select * from public.create_group('Familie')`));
    groupId = group.rows[0].id;
    for (const user of [ben, carla]) {
      await asUser(db.pool, user, (c) => c.query(`select public.join_group($1)`, [group.rows[0].invite_code]));
    }
    const session = await asUser(db.pool, anna, (c) => c.query(`select * from public.start_session($1)`, [groupId]));
    sessionId = session.rows[0].id;
  });

  test('kein Match, solange nicht alle aktiven Mitglieder zugestimmt haben', async () => {
    await swipe(anna, recipes[0], true);
    await swipe(ben, recipes[0], true);
    assert.equal((await matches()).length, 0);
    await swipe(carla, recipes[0], false);
    assert.equal((await matches()).length, 0);
  });

  test('Match, sobald alle aktiven Mitglieder dasselbe Gericht mögen', async () => {
    await swipe(anna, recipes[1], true);
    await swipe(ben, recipes[1], true);
    await swipe(carla, recipes[1], true);
    const result = await matches();
    assert.equal(result.length, 1);
    assert.equal(result[0].recipe_id, recipes[1]);
    const session = await db.pool.query(`select status, matched_at from public.sessions where id = $1`, [sessionId]);
    assert.equal(session.rows[0].status, 'matched');
    assert.ok(session.rows[0].matched_at);
  });

  test('nach einem Match sind keine weiteren Swipes in der Runde möglich', async () => {
    for (const user of [anna, ben, carla]) await swipe(user, recipes[0], true);
    await expectError(swipe(anna, recipes[1], true), /row-level security/);
  });

  test('eine nachträgliche Zustimmung (Update statt Insert) löst ebenfalls ein Match aus', async () => {
    await swipe(anna, recipes[2], true);
    await swipe(ben, recipes[2], true);
    await swipe(carla, recipes[2], false);
    await swipe(carla, recipes[2], true);
    assert.equal((await matches()).length, 1);
  });

  test('inaktive Mitglieder („esse heute nicht mit“) zählen nicht', async () => {
    await asUser(db.pool, carla, (c) =>
      c.query(`update public.group_members set is_active = false where group_id = $1 and user_id = $2`, [groupId, carla]),
    );
    await swipe(anna, recipes[0], true);
    await swipe(ben, recipes[0], true);
    assert.equal((await matches()).length, 1);
  });

  test('wird das letzte fehlende Mitglied inaktiv, entsteht das Match sofort', async () => {
    await swipe(anna, recipes[0], true);
    await swipe(ben, recipes[0], true);
    assert.equal((await matches()).length, 0);
    await asUser(db.pool, carla, (c) =>
      c.query(`update public.group_members set is_active = false where group_id = $1 and user_id = $2`, [groupId, carla]),
    );
    assert.equal((await matches()).length, 1);
  });

  test('verlässt jemand die Gruppe, wird neu ausgewertet', async () => {
    await swipe(anna, recipes[1], true);
    await swipe(ben, recipes[1], true);
    await asUser(db.pool, carla, (c) => c.query(`select public.leave_group($1)`, [groupId]));
    const result = await matches();
    assert.equal(result.length, 1);
    assert.equal(result[0].recipe_id, recipes[1]);
  });

  test('Swipes eines inaktiven Mitglieds verhindern kein Match', async () => {
    await swipe(carla, recipes[0], false);
    await asUser(db.pool, carla, (c) =>
      c.query(`update public.group_members set is_active = false where group_id = $1 and user_id = $2`, [groupId, carla]),
    );
    await swipe(anna, recipes[0], true);
    await swipe(ben, recipes[0], true);
    assert.equal((await matches()).length, 1);
  });

  test('gleichzeitige letzte Swipes führen zu genau einem Match (kein verlorenes Match)', async () => {
    await swipe(anna, recipes[0], true);
    // Ben und Carla swipen exakt gleichzeitig in zwei offenen Transaktionen
    const clientBen = await db.pool.connect();
    const clientCarla = await db.pool.connect();
    try {
      for (const [client, user] of [
        [clientBen, ben],
        [clientCarla, carla],
      ] as const) {
        await client.query('begin');
        await client.query('set local role authenticated');
        await client.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: user })]);
      }
      await clientBen.query(
        `insert into public.swipes (session_id, user_id, recipe_id, liked) values ($1, $2, $3, true)`,
        [sessionId, ben, recipes[0]],
      );
      // Carlas Insert wartet auf Bens Sperre; erst nach Bens Commit wertet er aus.
      const carlaInsert = clientCarla.query(
        `insert into public.swipes (session_id, user_id, recipe_id, liked) values ($1, $2, $3, true)`,
        [sessionId, carla, recipes[0]],
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
      await clientBen.query('commit');
      await carlaInsert;
      await clientCarla.query('commit');
    } finally {
      clientBen.release();
      clientCarla.release();
    }
    assert.equal((await matches()).length, 1);
  });

  test('eine neue Runde schließt die alte und Swipes zählen nur pro Runde', async () => {
    await swipe(anna, recipes[0], true);
    await swipe(ben, recipes[0], true);
    const next = await asUser(db.pool, ben, (c) =>
      c.query(`select * from public.start_session($1, 30, 'vegan', null)`, [groupId]),
    );
    const old = await db.pool.query(`select status from public.sessions where id = $1`, [sessionId]);
    assert.equal(old.rows[0].status, 'closed');
    assert.equal(next.rows[0].max_minutes, 30);
    assert.equal(next.rows[0].diet, 'vegan');
    await swipe(carla, recipes[0], true, next.rows[0].id);
    assert.equal((await matches()).length, 0);
  });

  test('ungültige Filterwerte werden abgelehnt', async () => {
    await expectError(
      asUser(db.pool, anna, (c) => c.query(`select public.start_session($1, 45, null, null)`, [groupId])),
      /check constraint/,
    );
  });

  test('Swipes übernehmen die Gruppe aus der Session (kein Spoofing)', async () => {
    await swipe(anna, recipes[0], false);
    const { rows } = await db.pool.query(`select group_id from public.swipes where session_id = $1`, [sessionId]);
    assert.equal(rows[0].group_id, groupId);
  });
});

describe('Konto löschen', () => {
  let db: TestDb;
  let recipes: string[];

  before(async () => {
    db = await createTestDb();
    recipes = await insertTestRecipes(db.pool);
  });

  after(async () => {
    await db?.drop();
  });

  test('löscht alle personenbezogenen Daten und überträgt die Owner-Rolle', async () => {
    const anna = await createUser(db.pool, 'Anna');
    const ben = await createUser(db.pool, 'Ben');
    const group = await asUser(db.pool, anna, (c) => c.query(`select * from public.create_group('Paar')`));
    const groupId = group.rows[0].id;
    await asUser(db.pool, ben, (c) => c.query(`select public.join_group($1)`, [group.rows[0].invite_code]));
    const session = await asUser(db.pool, anna, (c) => c.query(`select * from public.start_session($1)`, [groupId]));
    await asUser(db.pool, anna, async (c) => {
      await c.query(`insert into public.swipes (session_id, user_id, recipe_id, liked) values ($1, $2, $3, false)`, [
        session.rows[0].id,
        anna,
        recipes[0],
      ]);
      await c.query(`insert into public.shopping_items (group_id, label, added_by) values ($1, 'Brot', $2)`, [
        groupId,
        anna,
      ]);
      await c.query(`insert into public.push_tokens (token, user_id, platform) values ('tok', $1, 'android')`, [anna]);
    });

    await asUser(db.pool, anna, (c) => c.query(`select public.delete_account()`));

    const count = async (sql: string) => Number((await db.pool.query(sql, [anna])).rows[0].count);
    assert.equal(await count(`select count(*) from auth.users where id = $1`), 0);
    assert.equal(await count(`select count(*) from public.profiles where id = $1`), 0);
    assert.equal(await count(`select count(*) from public.group_members where user_id = $1`), 0);
    assert.equal(await count(`select count(*) from public.swipes where user_id = $1`), 0);
    assert.equal(await count(`select count(*) from public.push_tokens where user_id = $1`), 0);
    assert.equal(await count(`select count(*) from public.shopping_items where added_by = $1`), 0);
    assert.equal(await count(`select count(*) from public.groups where created_by = $1`), 0);

    const owner = await db.pool.query(`select user_id, role from public.group_members where group_id = $1`, [groupId]);
    assert.deepEqual(owner.rows, [{ user_id: ben, role: 'owner' }]);
    const items = await db.pool.query(`select label from public.shopping_items where group_id = $1`, [groupId]);
    assert.equal(items.rows.length, 1, 'Einkaufsliste der Gruppe bleibt erhalten');
  });

  test('löscht Gruppen, in denen die Person allein war', async () => {
    const solo = await createUser(db.pool, 'Solo');
    const group = await asUser(db.pool, solo, (c) => c.query(`select * from public.create_group('Nur ich')`));
    await asUser(db.pool, solo, (c) => c.query(`select public.delete_account()`));
    const { rows } = await db.pool.query(`select id from public.groups where id = $1`, [group.rows[0].id]);
    assert.equal(rows.length, 0);
  });

  test('ohne Anmeldung nicht aufrufbar', async () => {
    await expectError(asUser(db.pool, null, (c) => c.query(`select public.delete_account()`)), /permission denied/);
  });
});
