import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { Client, Pool, type PoolClient } from 'pg';

const ROOT = path.resolve(__dirname, '..');

export type TestDb = {
  pool: Pool;
  drop: () => Promise<void>;
};

function baseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL fehlt – bitte über `npm run test:db` starten.');
  return url;
}

/** Legt eine frische Datenbank an und spielt Shim + alle Migrationen (+ optional Seed) ein. */
export async function createTestDb(options: { seed?: boolean } = {}): Promise<TestDb> {
  const name = `gm_test_${process.pid}_${Math.random().toString(36).slice(2, 8)}`;
  const admin = new Client({ connectionString: baseUrl() });
  await admin.connect();
  await admin.query(`create database ${name}`);
  await admin.end();

  const url = new URL(baseUrl());
  url.pathname = `/${name}`;
  const pool = new Pool({ connectionString: url.toString(), max: 10 });

  const files = [path.join(ROOT, 'tests', 'supabase-shim.sql')];
  const migrationsDir = path.join(ROOT, 'migrations');
  for (const file of readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()) {
    files.push(path.join(migrationsDir, file));
  }
  if (options.seed) files.push(path.join(ROOT, 'seed.sql'));
  for (const file of files) {
    try {
      await pool.query(readFileSync(file, 'utf8'));
    } catch (error) {
      throw new Error(`Fehler in ${path.basename(file)}: ${(error as Error).message}`);
    }
  }

  return {
    pool,
    drop: async () => {
      await pool.end();
      const cleanup = new Client({ connectionString: baseUrl() });
      await cleanup.connect();
      await cleanup.query(`drop database if exists ${name} with (force)`);
      await cleanup.end();
    },
  };
}

/** Legt einen Auth-Nutzer an (wie Supabase Auth es täte) und gibt die ID zurück. */
export async function createUser(pool: Pool, displayName: string): Promise<string> {
  const { rows } = await pool.query<{ id: string }>(
    `insert into auth.users (email, raw_user_meta_data) values ($1, $2) returning id`,
    [`${displayName.toLowerCase()}@example.com`, { display_name: displayName }],
  );
  return rows[0].id;
}

/** Führt `fn` in einer Transaktion als angemeldeter Nutzer (Rolle `authenticated`) aus. */
export async function asUser<T>(
  pool: Pool,
  userId: string | null,
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query(`set local role ${userId ? 'authenticated' : 'anon'}`);
    await client.query(`select set_config('request.jwt.claims', $1, true)`, [
      JSON.stringify(userId ? { sub: userId, role: 'authenticated' } : { role: 'anon' }),
    ]);
    const result = await fn(client);
    await client.query('commit');
    return result;
  } catch (error) {
    await client.query('rollback').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

/** Erwartet, dass die Abfrage mit einem Fehler (z. B. RLS-Verletzung) scheitert. */
export async function expectError(promise: Promise<unknown>, pattern?: RegExp): Promise<string> {
  try {
    await promise;
  } catch (error) {
    const message = (error as Error).message;
    if (pattern && !pattern.test(message)) {
      throw new Error(`Unerwartete Fehlermeldung: ${message}`);
    }
    return message;
  }
  throw new Error('Fehler erwartet, aber die Abfrage war erfolgreich');
}

/** Kleiner Rezeptbestand für Tests. */
export async function insertTestRecipes(pool: Pool): Promise<string[]> {
  await pool.query(`
    insert into public.ingredients (id, name_de, name_en, aisle, is_staple) values
      ('nudeln', 'Nudeln', 'Pasta', 'vorrat', false),
      ('tomate', 'Tomate', 'Tomato', 'gemuese', false),
      ('salz', 'Salz', 'Salt', 'gewuerze', true)
    on conflict do nothing`);
  const { rows } = await pool.query<{ id: string }>(`
    insert into public.recipes (slug, title, description, category, diet, total_minutes, difficulty, servings, steps)
    values
      ('test-1', 'Testgericht 1', 'Beschreibung', 'pasta', 'vegan', 20, 1, 2, array['Kochen']),
      ('test-2', 'Testgericht 2', 'Beschreibung', 'pasta', 'vegetarisch', 30, 2, 2, array['Kochen']),
      ('test-3', 'Testgericht 3', 'Beschreibung', 'salate', 'fleisch', 45, 3, 4, array['Kochen'])
    returning id`);
  for (const { id } of rows) {
    await pool.query(
      `insert into public.recipe_ingredients (recipe_id, position, ingredient_id, amount, unit)
       values ($1, 1, 'nudeln', 200, 'g'), ($1, 2, 'tomate', 2, null), ($1, 3, 'salz', null, null)`,
      [id],
    );
  }
  return rows.map((r) => r.id);
}
