-- Minimaler Nachbau der Supabase-Umgebung (Rollen, auth-Schema, auth.uid()),
-- damit Migrationen und RLS gegen ein normales Postgres getestet werden können.
-- Gegen einen echten Supabase-Stack (`supabase start`) ist dieser Schritt ein No-op.
do $$
begin
  begin
    create role anon nologin noinherit;
  exception when duplicate_object or unique_violation then null; -- parallele Testläufe
  end;
  begin
    create role authenticated nologin noinherit;
  exception when duplicate_object or unique_violation then null; -- parallele Testläufe
  end;
  begin
    create role service_role nologin noinherit bypassrls;
  exception when duplicate_object or unique_violation then null; -- parallele Testläufe
  end;
end $$;

do $$
begin
  create schema if not exists auth;
exception when unique_violation then null;
end $$;

create table if not exists auth.users (
  id                  uuid primary key default gen_random_uuid(),
  email               text,
  raw_user_meta_data  jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now()
);

create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'
  ), '')::uuid;
$$;

grant usage on schema auth, public to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;
