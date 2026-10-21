import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

import { asUser, createTestDb, createUser, expectError, insertTestRecipes, type TestDb } from './helpers';

const RLS = /row-level security|permission denied/;

describe('Row Level Security', () => {
  let db: TestDb;
  let anna: string;
  let ben: string;
  let carla: string; // gehört NICHT zur Gruppe
  let groupId: string;
  let inviteCode: string;
  let sessionId: string;
  let recipes: string[];

  before(async () => {
    db = await createTestDb();
    recipes = await insertTestRecipes(db.pool);
    anna = await createUser(db.pool, 'Anna');
    ben = await createUser(db.pool, 'Ben');
    carla = await createUser(db.pool, 'Carla');

    const group = await asUser(db.pool, anna, (c) =>
      c.query(`select * from public.create_group('WG Sonnenallee')`),
    );
    groupId = group.rows[0].id;
    inviteCode = group.rows[0].invite_code;
    await asUser(db.pool, ben, (c) => c.query(`select public.join_group($1)`, [inviteCode]));
    const session = await asUser(db.pool, anna, (c) =>
      c.query(`select * from public.start_session($1)`, [groupId]),
    );
    sessionId = session.rows[0].id;
    await asUser(db.pool, anna, (c) =>
      c.query(`insert into public.shopping_items (group_id, label, added_by) values ($1, 'Milch', $2)`, [
        groupId,
        anna,
      ]),
    );
    await asUser(db.pool, anna, (c) =>
      c.query(`insert into public.group_pantry (group_id, ingredient_id, added_by) values ($1, 'tomate', $2)`, [
        groupId,
        anna,
      ]),
    );
    await asUser(db.pool, anna, (c) =>
      c.query(`insert into public.swipes (session_id, user_id, recipe_id, liked) values ($1, $2, $3, false)`, [
        sessionId,
        anna,
        recipes[0],
      ]),
    );
  });

  after(async () => {
    await db?.drop();
  });

  test('Profil wird bei Registrierung ohne E-Mail angelegt', async () => {
    const { rows } = await db.pool.query(`select * from public.profiles where id = $1`, [anna]);
    assert.equal(rows[0].display_name, 'Anna');
    assert.ok(!('email' in rows[0]));
  });

  test('anonyme Nutzer sehen nichts – auch keine Rezepte', async () => {
    await expectError(asUser(db.pool, null, (c) => c.query(`select * from public.recipes`)), RLS);
    await expectError(asUser(db.pool, null, (c) => c.query(`select * from public.groups`)), RLS);
    await expectError(asUser(db.pool, null, (c) => c.query(`select public.create_group('x')`)), RLS);
  });

  test('angemeldete Nutzer können den Rezeptkatalog lesen, aber nicht ändern', async () => {
    const { rows } = await asUser(db.pool, carla, (c) => c.query(`select id from public.recipes`));
    assert.equal(rows.length, 3);
    await expectError(
      asUser(db.pool, carla, (c) => c.query(`update public.recipes set title = 'Hack'`)),
      RLS,
    );
  });

  test('Fremde sehen weder Gruppe, Mitglieder, Sessions, Swipes, Vorrat noch Einkaufsliste', async () => {
    for (const table of ['groups', 'group_members', 'sessions', 'swipes', 'matches', 'group_pantry', 'shopping_items']) {
      const { rows } = await asUser(db.pool, carla, (c) => c.query(`select * from public.${table}`));
      assert.equal(rows.length, 0, `Carla sieht Zeilen in ${table}`);
    }
  });

  test('Mitglieder sehen ihre Gruppe und die Profile der anderen Mitglieder', async () => {
    const groups = await asUser(db.pool, ben, (c) => c.query(`select * from public.groups`));
    assert.equal(groups.rows.length, 1);
    const members = await asUser(db.pool, ben, (c) => c.query(`select user_id from public.group_members`));
    assert.equal(members.rows.length, 2);
    const profiles = await asUser(db.pool, ben, (c) => c.query(`select id from public.profiles order by display_name`));
    assert.deepEqual(profiles.rows.map((r) => r.id).sort(), [anna, ben].sort());
    const shopping = await asUser(db.pool, ben, (c) => c.query(`select * from public.shopping_items`));
    assert.equal(shopping.rows.length, 1);
  });

  test('Profile von Nicht-Gruppenmitgliedern sind unsichtbar und nicht änderbar', async () => {
    const { rows } = await asUser(db.pool, carla, (c) => c.query(`select id from public.profiles`));
    assert.deepEqual(rows.map((r) => r.id), [carla]);
    const res = await asUser(db.pool, carla, (c) =>
      c.query(`update public.profiles set display_name = 'Hacker' where id = $1`, [anna]),
    );
    assert.equal(res.rowCount, 0);
  });

  test('Fremde können nichts in eine fremde Gruppe schreiben', async () => {
    await expectError(
      asUser(db.pool, carla, (c) =>
        c.query(`insert into public.swipes (session_id, user_id, recipe_id, liked) values ($1, $2, $3, true)`, [
          sessionId,
          carla,
          recipes[1],
        ]),
      ),
      RLS,
    );
    await expectError(
      asUser(db.pool, carla, (c) =>
        c.query(`insert into public.shopping_items (group_id, label, added_by) values ($1, 'Spam', $2)`, [
          groupId,
          carla,
        ]),
      ),
      RLS,
    );
    await expectError(
      asUser(db.pool, carla, (c) =>
        c.query(`insert into public.group_pantry (group_id, ingredient_id, added_by) values ($1, 'nudeln', $2)`, [
          groupId,
          carla,
        ]),
      ),
      RLS,
    );
    const del = await asUser(db.pool, carla, (c) => c.query(`delete from public.shopping_items`));
    assert.equal(del.rowCount, 0);
    await expectError(asUser(db.pool, carla, (c) => c.query(`select public.start_session($1)`, [groupId])), /not_a_member/);
    await expectError(asUser(db.pool, carla, (c) => c.query(`select public.leave_group($1)`, [groupId])), /not_a_member/);
  });

  test('niemand kann im Namen anderer swipen', async () => {
    await expectError(
      asUser(db.pool, ben, (c) =>
        c.query(`insert into public.swipes (session_id, user_id, recipe_id, liked) values ($1, $2, $3, true)`, [
          sessionId,
          anna,
          recipes[1],
        ]),
      ),
      RLS,
    );
    const res = await asUser(db.pool, ben, (c) =>
      c.query(`update public.swipes set liked = true where user_id = $1`, [anna]),
    );
    assert.equal(res.rowCount, 0);
  });

  test('Matches können nicht direkt angelegt werden', async () => {
    await expectError(
      asUser(db.pool, anna, (c) =>
        c.query(`insert into public.matches (group_id, session_id, recipe_id) values ($1, $2, $3)`, [
          groupId,
          sessionId,
          recipes[0],
        ]),
      ),
      RLS,
    );
  });

  test('Mitglieder können sich nicht selbst zum Owner machen oder andere deaktivieren', async () => {
    await expectError(
      asUser(db.pool, ben, (c) => c.query(`update public.group_members set role = 'owner' where user_id = $1`, [ben])),
      RLS,
    );
    const res = await asUser(db.pool, ben, (c) =>
      c.query(`update public.group_members set is_active = false where user_id = $1`, [anna]),
    );
    assert.equal(res.rowCount, 0);
    await expectError(
      asUser(db.pool, ben, (c) =>
        c.query(`insert into public.group_members (group_id, user_id) values ($1, $2)`, [groupId, carla]),
      ),
      RLS,
    );
  });

  test('nur der Owner kann die Gruppe umbenennen und den Code erneuern', async () => {
    const byBen = await asUser(db.pool, ben, (c) => c.query(`update public.groups set name = 'Bens WG'`));
    assert.equal(byBen.rowCount, 0);
    const byAnna = await asUser(db.pool, anna, (c) => c.query(`update public.groups set name = 'Annas WG'`));
    assert.equal(byAnna.rowCount, 1);
    await expectError(
      asUser(db.pool, ben, (c) => c.query(`select public.regenerate_invite_code($1)`, [groupId])),
      /not_owner/,
    );
    await expectError(
      asUser(db.pool, anna, (c) => c.query(`update public.groups set invite_code = 'AAAAAA'`)),
      RLS,
    );
  });

  test('Push-Tokens sind nur für den Besitzer sichtbar', async () => {
    await asUser(db.pool, anna, (c) =>
      c.query(`insert into public.push_tokens (token, user_id, platform) values ('ExponentPushToken[a]', $1, 'ios')`, [
        anna,
      ]),
    );
    const { rows } = await asUser(db.pool, ben, (c) => c.query(`select * from public.push_tokens`));
    assert.equal(rows.length, 0);
    await expectError(
      asUser(db.pool, ben, (c) =>
        c.query(`insert into public.push_tokens (token, user_id, platform) values ('x', $1, 'ios')`, [anna]),
      ),
      RLS,
    );
  });

  test('Beitritt mit ungültigem Code schlägt fehl, Code ist unempfindlich gegen Format', async () => {
    await expectError(asUser(db.pool, carla, (c) => c.query(`select public.join_group('ZZZZZZ')`)), /invalid_code/);
    const messy = ` ${inviteCode.slice(0, 3).toLowerCase()}-${inviteCode.slice(3)} `;
    const { rows } = await asUser(db.pool, carla, (c) => c.query(`select * from public.join_group($1)`, [messy]));
    assert.equal(rows[0].id, groupId);
    await asUser(db.pool, carla, (c) => c.query(`select public.leave_group($1)`, [groupId]));
    const after = await asUser(db.pool, carla, (c) => c.query(`select * from public.groups`));
    assert.equal(after.rows.length, 0);
  });
});
