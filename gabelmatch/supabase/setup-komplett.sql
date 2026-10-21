-- Gabelmatch – komplette Einrichtung in EINER Datei.
-- Supabase → SQL Editor → New query → alles einfügen → Run. Nur einmal ausführen.
-- (Automatisch zusammengestellt aus migrations/*.sql und seed.sql – npm run setup:sql)

-- ===== migrations/20261021000000_extensions.sql =====
-- Erweiterungen. pg_net wird für Push-Benachrichtigungen bei einem Match benötigt
-- (HTTP-Aufruf der Expo Push API direkt aus der Datenbank). Fehlt die Erweiterung
-- (z. B. in reinen Test-Datenbanken), funktioniert alles außer dem Push-Versand.
do $$
begin
  create extension if not exists pg_net;
exception when others then
  raise notice 'pg_net nicht verfügbar – Push-Benachrichtigungen bei Matches sind deaktiviert';
end $$;

-- ===== migrations/20261021000001_schema.sql =====
-- Gabelmatch – Grundschema
-- Tabellen, Indizes und Hilfsfunktionen. RLS-Policies folgen in der nächsten Migration.

-- ---------------------------------------------------------------------------
-- Profile (Datenminimierung: keine E-Mail, kein Klarname nötig)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text not null default '' check (char_length(display_name) <= 40),
  avatar_emoji  text not null default '🍽️' check (char_length(avatar_emoji) <= 16),
  locale        text not null default 'de' check (locale in ('de', 'en')),
  push_enabled  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.push_tokens (
  token       text primary key check (char_length(token) <= 255),
  user_id     uuid not null references auth.users (id) on delete cascade,
  platform    text not null check (platform in ('ios', 'android', 'web')),
  updated_at  timestamptz not null default now()
);
create index push_tokens_user_idx on public.push_tokens (user_id);

-- ---------------------------------------------------------------------------
-- Rezepte (öffentlicher Katalog, nur lesbar für angemeldete Nutzer)
-- ---------------------------------------------------------------------------
create table public.ingredients (
  id         text primary key,                       -- stabiler Schlüssel, z. B. 'zwiebel'
  name_de    text not null,
  name_en    text not null,
  aisle      text not null,                          -- Gruppierung im Vorrat (gemuese, milch, …)
  is_staple  boolean not null default false          -- Salz, Pfeffer, Öl … gelten als vorhanden
);

create table public.recipes (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  description    text not null,
  category       text not null check (category in (
                   'pasta', 'reis_getreide', 'suppen_eintoepfe', 'salate', 'ofen_auflauf',
                   'pfanne_wok', 'kartoffeln', 'brot_snacks', 'fruehstueck_suesses')),
  diet           text not null check (diet in ('vegan', 'vegetarisch', 'fisch', 'fleisch')),
  total_minutes  integer not null check (total_minutes between 1 and 600),
  difficulty     smallint not null check (difficulty between 1 and 3),
  servings       smallint not null check (servings between 1 and 12),
  image_url      text,                               -- null → Kategorie-Illustration
  steps          text[] not null,
  translations   jsonb not null default '{}'::jsonb, -- z. B. {"en": {"title": …, "steps": […]}}
  created_at     timestamptz not null default now()
);
create index recipes_category_idx on public.recipes (category);

create table public.recipe_ingredients (
  recipe_id      uuid not null references public.recipes (id) on delete cascade,
  position       smallint not null,
  ingredient_id  text not null references public.ingredients (id),
  amount         numeric(8, 2),
  unit           text,
  note           text,
  primary key (recipe_id, position)
);
create index recipe_ingredients_ingredient_idx on public.recipe_ingredients (ingredient_id);

-- ---------------------------------------------------------------------------
-- Gruppen
-- ---------------------------------------------------------------------------
create table public.groups (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(btrim(name)) between 1 and 40),
  invite_code  text not null unique check (invite_code ~ '^[A-Z0-9]{6}$'),
  created_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now()
);

create table public.group_members (
  group_id   uuid not null references public.groups (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade, -- Profil ermöglicht Embeds
  role       text not null default 'member' check (role in ('owner', 'member')),
  is_active  boolean not null default true,          -- „Ich esse heute mit“
  joined_at  timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index group_members_user_idx on public.group_members (user_id);

-- Swipe-Runde einer Gruppe inkl. gemeinsamer Filter
create table public.sessions (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references public.groups (id) on delete cascade,
  status       text not null default 'active' check (status in ('active', 'matched', 'closed')),
  max_minutes  integer check (max_minutes in (15, 30, 60)),
  diet         text check (diet in ('vegetarisch', 'vegan')),
  category     text,
  created_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now(),
  matched_at   timestamptz
);
create unique index sessions_one_active_per_group on public.sessions (group_id) where status = 'active';
create index sessions_group_idx on public.sessions (group_id, created_at desc);

create table public.swipes (
  session_id  uuid not null references public.sessions (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  recipe_id   uuid not null references public.recipes (id) on delete cascade,
  group_id    uuid not null references public.groups (id) on delete cascade, -- wird per Trigger gesetzt
  liked       boolean not null,
  created_at  timestamptz not null default now(),
  primary key (session_id, user_id, recipe_id)
);
create index swipes_session_recipe_idx on public.swipes (session_id, recipe_id) where liked;

create table public.matches (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references public.groups (id) on delete cascade,
  session_id  uuid not null unique references public.sessions (id) on delete cascade,
  recipe_id   uuid not null references public.recipes (id) on delete cascade,
  created_at  timestamptz not null default now()
);
create index matches_group_idx on public.matches (group_id, created_at desc);

-- Gemeinsamer Vorrat („Kühlschrank“) einer Gruppe
create table public.group_pantry (
  group_id       uuid not null references public.groups (id) on delete cascade,
  ingredient_id  text not null references public.ingredients (id) on delete cascade,
  added_by       uuid references auth.users (id) on delete set null,
  created_at     timestamptz not null default now(),
  primary key (group_id, ingredient_id)
);

create table public.shopping_items (
  id             uuid primary key default gen_random_uuid(),
  group_id       uuid not null references public.groups (id) on delete cascade,
  ingredient_id  text references public.ingredients (id) on delete set null,
  recipe_id      uuid references public.recipes (id) on delete set null,
  label          text not null check (char_length(btrim(label)) between 1 and 80),
  quantity       text check (char_length(quantity) <= 40),
  checked        boolean not null default false,
  added_by       uuid references auth.users (id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index shopping_items_group_idx on public.shopping_items (group_id, checked, created_at);

-- ---------------------------------------------------------------------------
-- Hilfsfunktionen
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger shopping_items_touch before update on public.shopping_items
  for each row execute function public.touch_updated_at();

-- Mitgliedschaft prüfen, ohne RLS-Rekursion auf group_members
create or replace function public.is_group_member(p_group_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = (select auth.uid())
  );
$$;

create or replace function public.shares_group_with(p_user_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.group_members a
    join public.group_members b on a.group_id = b.group_id
    where a.user_id = (select auth.uid()) and b.user_id = p_user_id
  );
$$;

-- Profil beim Registrieren anlegen (nur Anzeigename, keine E-Mail)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_name text;
begin
  v_name := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
    ''
  );
  insert into public.profiles (id, display_name, locale)
  values (
    new.id,
    left(v_name, 40),
    case when new.raw_user_meta_data ->> 'locale' = 'en' then 'en' else 'de' end
  )
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- group_id einer Swipe-Zeile immer aus der Session ableiten (nicht vom Client)
create or replace function public.swipes_set_group()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  select s.group_id into new.group_id from public.sessions s where s.id = new.session_id;
  return new;
end $$;

create trigger swipes_set_group before insert or update on public.swipes
  for each row execute function public.swipes_set_group();

-- ===== migrations/20261021000002_logic.sql =====
-- Gabelmatch – Matching-Logik, RPCs, Push-Benachrichtigungen

-- ---------------------------------------------------------------------------
-- Matching
-- Ein Match entsteht, sobald ALLE aktiven Mitglieder einer Gruppe dasselbe
-- Gericht in der laufenden Session positiv bewertet haben.
-- ---------------------------------------------------------------------------
create or replace function public.evaluate_session(p_session_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_session public.sessions;
  v_active  integer;
  v_recipe  uuid;
  v_match   uuid;
begin
  -- Session sperren, damit gleichzeitige Swipes nacheinander ausgewertet werden.
  -- FOR NO KEY UPDATE (statt FOR UPDATE) kollidiert nicht mit den KEY-SHARE-Sperren
  -- der Fremdschlüsselprüfung beim Einfügen von Swipes → keine Deadlocks.
  select * into v_session from public.sessions where id = p_session_id for no key update;
  if not found or v_session.status <> 'active' then
    return null;
  end if;

  select count(*) into v_active
  from public.group_members
  where group_id = v_session.group_id and is_active;

  if v_active = 0 then
    return null;
  end if;

  select sw.recipe_id into v_recipe
  from public.swipes sw
  join public.group_members gm
    on gm.group_id = v_session.group_id and gm.user_id = sw.user_id and gm.is_active
  where sw.session_id = v_session.id and sw.liked
  group by sw.recipe_id
  having count(*) = v_active
  order by max(sw.created_at), sw.recipe_id
  limit 1;

  if v_recipe is null then
    return null;
  end if;

  insert into public.matches (group_id, session_id, recipe_id)
  values (v_session.group_id, v_session.id, v_recipe)
  on conflict (session_id) do nothing
  returning id into v_match;

  update public.sessions
  set status = 'matched', matched_at = now()
  where id = v_session.id;

  return v_match;
end $$;

create or replace function public.swipes_after_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.liked then
    perform public.evaluate_session(new.session_id);
  end if;
  return null;
end $$;

create trigger swipes_evaluate after insert or update of liked on public.swipes
  for each row execute function public.swipes_after_change();

-- Wird jemand inaktiv oder verlässt die Gruppe, kann ein Match entstehen.
create or replace function public.members_after_change()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_group   uuid := coalesce(new.group_id, old.group_id);
  v_session uuid;
begin
  select id into v_session from public.sessions where group_id = v_group and status = 'active';
  if v_session is not null then
    perform public.evaluate_session(v_session);
  end if;
  return null;
end $$;

create trigger members_evaluate after update of is_active or delete on public.group_members
  for each row execute function public.members_after_change();

-- ---------------------------------------------------------------------------
-- Push-Benachrichtigung bei Match (Expo Push API via pg_net)
-- Fehler beim Versand dürfen das Match nie verhindern.
-- ---------------------------------------------------------------------------
create or replace function public.notify_match()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_title    text;
  v_group    text;
  v_messages jsonb;
begin
  if to_regprocedure('net.http_post(text,jsonb,jsonb,jsonb,integer)') is null then
    return null; -- pg_net nicht installiert (z. B. lokale Tests)
  end if;

  select r.title into v_title from public.recipes r where r.id = new.recipe_id;
  select g.name into v_group from public.groups g where g.id = new.group_id;

  select jsonb_agg(jsonb_build_object(
           'to', t.token,
           'sound', 'default',
           'channelId', 'matches',
           'title', case when p.locale = 'en' then 'It''s a match! 🍴' else 'Es ist ein Match! 🍴' end,
           'body', case when p.locale = 'en'
                        then v_group || ': everyone wants „' || v_title || '“'
                        else v_group || ': Alle haben Lust auf „' || v_title || '“' end,
           'data', jsonb_build_object('type', 'match', 'matchId', new.id, 'groupId', new.group_id)))
  into v_messages
  from public.group_members gm
  join public.profiles p on p.id = gm.user_id and p.push_enabled
  join public.push_tokens t on t.user_id = gm.user_id
  where gm.group_id = new.group_id;

  if v_messages is null then
    return null;
  end if;

  perform net.http_post(
    url := 'https://exp.host/--/api/v2/push/send',
    body := v_messages,
    params := '{}'::jsonb,
    headers := '{"Content-Type": "application/json", "Accept": "application/json"}'::jsonb,
    timeout_milliseconds := 5000
  );
  return null;
exception when others then
  raise warning 'notify_match failed: %', sqlerrm;
  return null;
end $$;

create trigger matches_notify after insert on public.matches
  for each row execute function public.notify_match();

-- ---------------------------------------------------------------------------
-- RPCs für Gruppen
-- Fehler werden mit sprechenden Codes geworfen, die der Client übersetzt.
-- ---------------------------------------------------------------------------
create or replace function public.generate_invite_code()
returns text language plpgsql volatile set search_path = '' as $$
declare
  v_alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- ohne 0/O/1/I
  v_code text;
begin
  loop
    v_code := '';
    for i in 1..6 loop
      v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.groups where invite_code = v_code);
  end loop;
  return v_code;
end $$;

create or replace function public.require_user()
returns uuid language plpgsql stable set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  return v_uid;
end $$;

create or replace function public.create_group(p_name text)
returns public.groups language plpgsql security definer set search_path = '' as $$
declare
  v_uid   uuid := public.require_user();
  v_group public.groups;
begin
  if (select count(*) from public.group_members where user_id = v_uid) >= 20 then
    raise exception 'too_many_groups' using errcode = 'P0001';
  end if;
  insert into public.groups (name, invite_code, created_by)
  values (btrim(p_name), public.generate_invite_code(), v_uid)
  returning * into v_group;
  insert into public.group_members (group_id, user_id, role) values (v_group.id, v_uid, 'owner');
  return v_group;
end $$;

create or replace function public.join_group(p_code text)
returns public.groups language plpgsql security definer set search_path = '' as $$
declare
  v_uid   uuid := public.require_user();
  v_group public.groups;
begin
  select * into v_group from public.groups
  where invite_code = upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
  if not found then
    raise exception 'invalid_code' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.group_members where group_id = v_group.id and user_id = v_uid) then
    return v_group;
  end if;
  if (select count(*) from public.group_members where group_id = v_group.id) >= 12 then
    raise exception 'group_full' using errcode = 'P0001';
  end if;
  if (select count(*) from public.group_members where user_id = v_uid) >= 20 then
    raise exception 'too_many_groups' using errcode = 'P0001';
  end if;
  insert into public.group_members (group_id, user_id, role) values (v_group.id, v_uid, 'member');
  return v_group;
end $$;

-- Interne Variante ohne auth-Prüfung, wird auch von delete_account genutzt.
create or replace function public.remove_member(p_group_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_was_owner boolean;
begin
  delete from public.group_members
  where group_id = p_group_id and user_id = p_user_id
  returning role = 'owner' into v_was_owner;

  if not exists (select 1 from public.group_members where group_id = p_group_id) then
    delete from public.groups where id = p_group_id;   -- letzte Person → Gruppe samt Daten löschen
  elsif v_was_owner then
    update public.group_members set role = 'owner'
    where (group_id, user_id) = (
      select group_id, user_id from public.group_members
      where group_id = p_group_id order by joined_at, user_id limit 1);
  end if;
end $$;

create or replace function public.leave_group(p_group_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := public.require_user();
begin
  if not public.is_group_member(p_group_id) then
    raise exception 'not_a_member' using errcode = 'P0001';
  end if;
  perform public.remove_member(p_group_id, v_uid);
end $$;

create or replace function public.regenerate_invite_code(p_group_id uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_uid  uuid := public.require_user();
  v_code text;
begin
  if not exists (select 1 from public.group_members
                 where group_id = p_group_id and user_id = v_uid and role = 'owner') then
    raise exception 'not_owner' using errcode = 'P0001';
  end if;
  v_code := public.generate_invite_code();
  update public.groups set invite_code = v_code where id = p_group_id;
  return v_code;
end $$;

-- Neue Swipe-Runde starten (beendet eine evtl. laufende Runde)
create or replace function public.start_session(
  p_group_id uuid,
  p_max_minutes integer default null,
  p_diet text default null,
  p_category text default null
)
returns public.sessions language plpgsql security definer set search_path = '' as $$
declare
  v_uid     uuid := public.require_user();
  v_session public.sessions;
begin
  if not public.is_group_member(p_group_id) then
    raise exception 'not_a_member' using errcode = 'P0001';
  end if;
  -- Gruppe sperren, damit zwei gleichzeitige Starts nicht kollidieren
  perform 1 from public.groups where id = p_group_id for no key update;
  update public.sessions set status = 'closed' where group_id = p_group_id and status = 'active';
  insert into public.sessions (group_id, max_minutes, diet, category, created_by)
  values (p_group_id, p_max_minutes, p_diet, p_category, v_uid)
  returning * into v_session;
  return v_session;
end $$;

-- ---------------------------------------------------------------------------
-- Konto löschen (Pflicht laut App-Store-Richtlinie 5.1.1(v) und DSGVO Art. 17)
-- Entfernt den Auth-Nutzer; alle personenbezogenen Daten folgen per CASCADE.
-- Gruppen, in denen die Person allein war, werden vollständig gelöscht.
-- ---------------------------------------------------------------------------
create or replace function public.delete_account()
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := public.require_user();
  v_gid uuid;
begin
  for v_gid in select group_id from public.group_members where user_id = v_uid loop
    perform public.remove_member(v_gid, v_uid);
  end loop;
  -- Verweise ohne Personenbezug lösen (Einträge bleiben für die Gruppe erhalten)
  update public.shopping_items set added_by = null where added_by = v_uid;
  update public.group_pantry set added_by = null where added_by = v_uid;
  delete from auth.users where id = v_uid;
end $$;

-- ---------------------------------------------------------------------------
-- Rechte auf Funktionen: standardmäßig nichts, dann gezielt freigeben
-- ---------------------------------------------------------------------------
revoke execute on all functions in schema public from public, anon, authenticated;

grant execute on function
  public.is_group_member(uuid),
  public.shares_group_with(uuid),
  public.create_group(text),
  public.join_group(text),
  public.leave_group(uuid),
  public.regenerate_invite_code(uuid),
  public.start_session(uuid, integer, text, text),
  public.delete_account(),
  public.require_user()
to authenticated;

-- ===== migrations/20261021000003_rls.sql =====
-- Gabelmatch – Row Level Security
-- Grundsatz: Nutzer sehen nur eigene Daten und Daten ihrer Gruppen.
-- Tabellenrechte werden explizit vergeben (anon erhält nichts).

alter table public.profiles           enable row level security;
alter table public.push_tokens        enable row level security;
alter table public.ingredients        enable row level security;
alter table public.recipes            enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.groups             enable row level security;
alter table public.group_members      enable row level security;
alter table public.sessions           enable row level security;
alter table public.swipes             enable row level security;
alter table public.matches            enable row level security;
alter table public.group_pantry       enable row level security;
alter table public.shopping_items     enable row level security;

revoke all on all tables in schema public from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Profile: eigenes Profil lesen/ändern, Profile von Gruppenmitgliedern lesen
-- ---------------------------------------------------------------------------
grant select on public.profiles to authenticated;
grant update (display_name, avatar_emoji, locale, push_enabled) on public.profiles to authenticated;

create policy profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.shares_group_with(id));
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Push-Tokens: ausschließlich eigene
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on public.push_tokens to authenticated;

create policy push_tokens_all on public.push_tokens for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Rezeptkatalog: nur lesen
-- ---------------------------------------------------------------------------
grant select on public.ingredients, public.recipes, public.recipe_ingredients to authenticated;

create policy ingredients_read on public.ingredients for select to authenticated using (true);
create policy recipes_read on public.recipes for select to authenticated using (true);
create policy recipe_ingredients_read on public.recipe_ingredients for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Gruppen: lesen als Mitglied, umbenennen als Owner.
-- Anlegen/Beitreten/Verlassen nur über RPCs (create_group, join_group, leave_group).
-- ---------------------------------------------------------------------------
grant select on public.groups to authenticated;
grant update (name) on public.groups to authenticated;

create policy groups_select on public.groups for select to authenticated
  using (public.is_group_member(id));
create policy groups_update on public.groups for update to authenticated
  using (exists (select 1 from public.group_members m
                 where m.group_id = groups.id and m.user_id = (select auth.uid()) and m.role = 'owner'))
  with check (true);

grant select on public.group_members to authenticated;
grant update (is_active) on public.group_members to authenticated;

create policy group_members_select on public.group_members for select to authenticated
  using (public.is_group_member(group_id));
create policy group_members_update_self on public.group_members for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Sessions: lesen als Mitglied, Filter einer laufenden Runde ändern
-- ---------------------------------------------------------------------------
grant select on public.sessions to authenticated;
grant update (max_minutes, diet, category) on public.sessions to authenticated;

create policy sessions_select on public.sessions for select to authenticated
  using (public.is_group_member(group_id));
create policy sessions_update_filters on public.sessions for update to authenticated
  using (public.is_group_member(group_id) and status = 'active')
  with check (public.is_group_member(group_id) and status = 'active');

-- ---------------------------------------------------------------------------
-- Swipes: Gruppe darf lesen (für Fortschritt & Ranking), schreiben nur eigene
-- in einer laufenden Runde der eigenen Gruppe
-- ---------------------------------------------------------------------------
grant select on public.swipes to authenticated;
grant insert (session_id, user_id, recipe_id, liked) on public.swipes to authenticated;
grant update (liked) on public.swipes to authenticated;

create policy swipes_select on public.swipes for select to authenticated
  using (public.is_group_member(group_id));
create policy swipes_insert on public.swipes for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.sessions s
                where s.id = session_id and s.status = 'active' and public.is_group_member(s.group_id))
  );
create policy swipes_update on public.swipes for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.sessions s where s.id = session_id and s.status = 'active')
  );

-- ---------------------------------------------------------------------------
-- Matches: nur lesen (entstehen ausschließlich per Trigger)
-- ---------------------------------------------------------------------------
grant select on public.matches to authenticated;

create policy matches_select on public.matches for select to authenticated
  using (public.is_group_member(group_id));

-- ---------------------------------------------------------------------------
-- Vorrat & Einkaufsliste: gemeinsam für alle Gruppenmitglieder
-- ---------------------------------------------------------------------------
grant select, insert, delete on public.group_pantry to authenticated;

create policy pantry_select on public.group_pantry for select to authenticated
  using (public.is_group_member(group_id));
create policy pantry_insert on public.group_pantry for insert to authenticated
  with check (public.is_group_member(group_id) and added_by = (select auth.uid()));
create policy pantry_delete on public.group_pantry for delete to authenticated
  using (public.is_group_member(group_id));

grant select, delete on public.shopping_items to authenticated;
grant insert (group_id, ingredient_id, recipe_id, label, quantity, added_by) on public.shopping_items to authenticated;
grant update (label, quantity, checked) on public.shopping_items to authenticated;

create policy shopping_select on public.shopping_items for select to authenticated
  using (public.is_group_member(group_id));
create policy shopping_insert on public.shopping_items for insert to authenticated
  with check (public.is_group_member(group_id) and added_by = (select auth.uid()));
create policy shopping_update on public.shopping_items for update to authenticated
  using (public.is_group_member(group_id)) with check (public.is_group_member(group_id));
create policy shopping_delete on public.shopping_items for delete to authenticated
  using (public.is_group_member(group_id));

-- ---------------------------------------------------------------------------
-- Realtime: Änderungen live an die Clients (RLS gilt auch hier)
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table
      public.matches, public.sessions, public.group_members,
      public.shopping_items, public.group_pantry, public.swipes;
  end if;
end $$;

-- ===== seed.sql =====
-- AUTOMATISCH ERZEUGT durch scripts/generate-seed.ts – nicht von Hand bearbeiten.
-- 127 Rezepte, 188 Zutaten
begin;

insert into public.ingredients (id, name_de, name_en, aisle, is_staple) values
  ('salz', 'Salz', 'Salt', 'gewuerze', true),
  ('pfeffer', 'Pfeffer', 'Pepper', 'gewuerze', true),
  ('zucker', 'Zucker', 'Sugar', 'backen', true),
  ('oel', 'Pflanzenöl', 'Vegetable oil', 'sonstiges', true),
  ('olivenoel', 'Olivenöl', 'Olive oil', 'sonstiges', true),
  ('wasser', 'Wasser', 'Water', 'sonstiges', true),
  ('zwiebel', 'Zwiebel', 'Onion', 'gemuese', false),
  ('rote_zwiebel', 'Rote Zwiebel', 'Red onion', 'gemuese', false),
  ('knoblauch', 'Knoblauch', 'Garlic', 'gemuese', false),
  ('karotte', 'Karotte', 'Carrot', 'gemuese', false),
  ('staudensellerie', 'Staudensellerie', 'Celery', 'gemuese', false),
  ('knollensellerie', 'Knollensellerie', 'Celeriac', 'gemuese', false),
  ('lauch', 'Lauch', 'Leek', 'gemuese', false),
  ('zucchini', 'Zucchini', 'Zucchini', 'gemuese', false),
  ('aubergine', 'Aubergine', 'Eggplant', 'gemuese', false),
  ('paprika', 'Paprika', 'Bell pepper', 'gemuese', false),
  ('tomate', 'Tomate', 'Tomato', 'gemuese', false),
  ('kirschtomaten', 'Kirschtomaten', 'Cherry tomatoes', 'gemuese', false),
  ('gurke', 'Salatgurke', 'Cucumber', 'gemuese', false),
  ('kartoffel', 'Kartoffeln', 'Potatoes', 'gemuese', false),
  ('suesskartoffel', 'Süßkartoffel', 'Sweet potato', 'gemuese', false),
  ('brokkoli', 'Brokkoli', 'Broccoli', 'gemuese', false),
  ('blumenkohl', 'Blumenkohl', 'Cauliflower', 'gemuese', false),
  ('spinat', 'Babyspinat', 'Baby spinach', 'gemuese', false),
  ('champignons', 'Champignons', 'Mushrooms', 'gemuese', false),
  ('kuerbis', 'Hokkaido-Kürbis', 'Hokkaido squash', 'gemuese', false),
  ('rote_bete', 'Rote Bete (vorgegart)', 'Beetroot (cooked)', 'gemuese', false),
  ('fruehlingszwiebel', 'Frühlingszwiebeln', 'Spring onions', 'gemuese', false),
  ('ingwer', 'Ingwer', 'Ginger', 'gemuese', false),
  ('chili', 'Chilischote', 'Chili pepper', 'gemuese', false),
  ('gruene_bohnen', 'Grüne Bohnen', 'Green beans', 'gemuese', false),
  ('zuckerschoten', 'Zuckerschoten', 'Snow peas', 'gemuese', false),
  ('pak_choi', 'Pak Choi', 'Pak choi', 'gemuese', false),
  ('avocado', 'Avocado', 'Avocado', 'gemuese', false),
  ('roemersalat', 'Römersalat', 'Romaine lettuce', 'gemuese', false),
  ('kopfsalat', 'Kopfsalat', 'Butter lettuce', 'gemuese', false),
  ('rucola', 'Rucola', 'Rocket', 'gemuese', false),
  ('radieschen', 'Radieschen', 'Radishes', 'gemuese', false),
  ('sauerkraut', 'Sauerkraut', 'Sauerkraut', 'konserven', false),
  ('weisskohl', 'Weißkohl', 'White cabbage', 'gemuese', false),
  ('zitrone', 'Zitrone', 'Lemon', 'obst', false),
  ('limette', 'Limette', 'Lime', 'obst', false),
  ('apfel', 'Apfel', 'Apple', 'obst', false),
  ('banane', 'Banane', 'Banana', 'obst', false),
  ('beeren_tk', 'Beeren (TK)', 'Berries (frozen)', 'obst', false),
  ('sauerkirschen', 'Sauerkirschen (Glas)', 'Sour cherries (jar)', 'konserven', false),
  ('pflaumen', 'Pflaumen', 'Plums', 'obst', false),
  ('rosinen', 'Rosinen', 'Raisins', 'backen', false),
  ('petersilie', 'Petersilie', 'Parsley', 'kraeuter', false),
  ('schnittlauch', 'Schnittlauch', 'Chives', 'kraeuter', false),
  ('basilikum', 'Basilikum', 'Basil', 'kraeuter', false),
  ('koriander', 'Koriander', 'Coriander', 'kraeuter', false),
  ('minze', 'Minze', 'Mint', 'kraeuter', false),
  ('dill', 'Dill', 'Dill', 'kraeuter', false),
  ('rosmarin', 'Rosmarin', 'Rosemary', 'kraeuter', false),
  ('thymian', 'Thymian', 'Thyme', 'kraeuter', false),
  ('salbei', 'Salbei', 'Sage', 'kraeuter', false),
  ('paprikapulver', 'Paprikapulver (edelsüß)', 'Sweet paprika', 'gewuerze', false),
  ('chiliflocken', 'Chiliflocken', 'Chili flakes', 'gewuerze', false),
  ('kreuzkuemmel', 'Kreuzkümmel', 'Cumin', 'gewuerze', false),
  ('currypulver', 'Currypulver', 'Curry powder', 'gewuerze', false),
  ('kurkuma', 'Kurkuma', 'Turmeric', 'gewuerze', false),
  ('garam_masala', 'Garam Masala', 'Garam masala', 'gewuerze', false),
  ('zimt', 'Zimt', 'Cinnamon', 'gewuerze', false),
  ('muskat', 'Muskatnuss', 'Nutmeg', 'gewuerze', false),
  ('oregano', 'Oregano (getrocknet)', 'Dried oregano', 'gewuerze', false),
  ('majoran', 'Majoran', 'Marjoram', 'gewuerze', false),
  ('kuemmel', 'Kümmel', 'Caraway', 'gewuerze', false),
  ('lorbeer', 'Lorbeerblatt', 'Bay leaf', 'gewuerze', false),
  ('gemuesebruehe', 'Gemüsebrühe', 'Vegetable stock', 'gewuerze', false),
  ('huehnerbruehe', 'Hühnerbrühe', 'Chicken stock', 'gewuerze', false),
  ('rinderbruehe', 'Rinderbrühe', 'Beef stock', 'gewuerze', false),
  ('sojasauce', 'Sojasauce', 'Soy sauce', 'sonstiges', false),
  ('senf', 'Senf', 'Mustard', 'sonstiges', false),
  ('ketchup', 'Ketchup', 'Ketchup', 'sonstiges', false),
  ('mayonnaise', 'Mayonnaise', 'Mayonnaise', 'sonstiges', false),
  ('essig', 'Weißweinessig', 'White wine vinegar', 'sonstiges', false),
  ('balsamico', 'Balsamico', 'Balsamic vinegar', 'sonstiges', false),
  ('honig', 'Honig', 'Honey', 'sonstiges', false),
  ('ahornsirup', 'Ahornsirup', 'Maple syrup', 'sonstiges', false),
  ('erdnussbutter', 'Erdnussbutter', 'Peanut butter', 'sonstiges', false),
  ('tahini', 'Tahini', 'Tahini', 'sonstiges', false),
  ('sesamoel', 'Sesamöl', 'Sesame oil', 'sonstiges', false),
  ('rote_currypaste', 'Rote Currypaste', 'Red curry paste', 'sonstiges', false),
  ('pesto', 'Basilikum-Pesto', 'Basil pesto', 'sonstiges', false),
  ('weisswein', 'Weißwein', 'White wine', 'sonstiges', false),
  ('rotwein', 'Rotwein', 'Red wine', 'sonstiges', false),
  ('vanillezucker', 'Vanillezucker', 'Vanilla sugar', 'backen', false),
  ('puderzucker', 'Puderzucker', 'Icing sugar', 'backen', false),
  ('passierte_tomaten', 'Passierte Tomaten', 'Tomato passata', 'konserven', false),
  ('gehackte_tomaten', 'Gehackte Tomaten (Dose)', 'Chopped tomatoes (can)', 'konserven', false),
  ('tomatenmark', 'Tomatenmark', 'Tomato paste', 'konserven', false),
  ('kokosmilch', 'Kokosmilch', 'Coconut milk', 'konserven', false),
  ('kichererbsen', 'Kichererbsen (Dose)', 'Chickpeas (can)', 'konserven', false),
  ('kidneybohnen', 'Kidneybohnen (Dose)', 'Kidney beans (can)', 'konserven', false),
  ('weisse_bohnen', 'Weiße Bohnen (Dose)', 'White beans (can)', 'konserven', false),
  ('mais', 'Mais (Dose)', 'Sweetcorn (can)', 'konserven', false),
  ('rote_linsen', 'Rote Linsen', 'Red lentils', 'konserven', false),
  ('tellerlinsen', 'Tellerlinsen', 'Brown lentils', 'konserven', false),
  ('oliven', 'Schwarze Oliven', 'Black olives', 'konserven', false),
  ('kapern', 'Kapern', 'Capers', 'konserven', false),
  ('gewuerzgurken', 'Gewürzgurken', 'Pickles', 'konserven', false),
  ('thunfisch', 'Thunfisch (Dose)', 'Tuna (can)', 'konserven', false),
  ('apfelmus', 'Apfelmus', 'Apple sauce', 'konserven', false),
  ('erbsen_tk', 'Erbsen (TK)', 'Peas (frozen)', 'gemuese', false),
  ('spinat_tk', 'Blattspinat (TK)', 'Spinach (frozen)', 'gemuese', false),
  ('spaghetti', 'Spaghetti', 'Spaghetti', 'nudeln_reis', false),
  ('penne', 'Penne', 'Penne', 'nudeln_reis', false),
  ('fusilli', 'Fusilli', 'Fusilli', 'nudeln_reis', false),
  ('tagliatelle', 'Bandnudeln', 'Tagliatelle', 'nudeln_reis', false),
  ('orecchiette', 'Orecchiette', 'Orecchiette', 'nudeln_reis', false),
  ('makkaroni', 'Makkaroni', 'Macaroni', 'nudeln_reis', false),
  ('lasagneplatten', 'Lasagneplatten', 'Lasagne sheets', 'nudeln_reis', false),
  ('suppennudeln', 'Suppennudeln', 'Soup noodles', 'nudeln_reis', false),
  ('spaetzle', 'Spätzle (Kühlregal)', 'Spaetzle (chilled)', 'nudeln_reis', false),
  ('tortellini', 'Tortellini mit Käsefüllung', 'Cheese tortellini', 'nudeln_reis', false),
  ('gnocchi', 'Gnocchi', 'Gnocchi', 'nudeln_reis', false),
  ('schupfnudeln', 'Schupfnudeln', 'Potato noodles', 'nudeln_reis', false),
  ('reisnudeln', 'Reisbandnudeln', 'Rice noodles', 'nudeln_reis', false),
  ('mie_nudeln', 'Mie-Nudeln', 'Egg noodles', 'nudeln_reis', false),
  ('reis', 'Langkornreis', 'Long-grain rice', 'nudeln_reis', false),
  ('basmati', 'Basmatireis', 'Basmati rice', 'nudeln_reis', false),
  ('risottoreis', 'Risottoreis', 'Risotto rice', 'nudeln_reis', false),
  ('milchreis', 'Milchreis', 'Pudding rice', 'nudeln_reis', false),
  ('couscous', 'Couscous', 'Couscous', 'nudeln_reis', false),
  ('bulgur', 'Bulgur', 'Bulgur', 'nudeln_reis', false),
  ('quinoa', 'Quinoa', 'Quinoa', 'nudeln_reis', false),
  ('polenta', 'Polenta (Maisgrieß)', 'Polenta', 'nudeln_reis', false),
  ('griess', 'Weichweizengrieß', 'Semolina', 'nudeln_reis', false),
  ('haferflocken', 'Haferflocken', 'Rolled oats', 'nudeln_reis', false),
  ('mehl', 'Weizenmehl', 'Flour', 'backen', false),
  ('backpulver', 'Backpulver', 'Baking powder', 'backen', false),
  ('hefe', 'Trockenhefe', 'Dry yeast', 'backen', false),
  ('semmelbroesel', 'Semmelbrösel', 'Breadcrumbs', 'backen', false),
  ('speisestaerke', 'Speisestärke', 'Cornstarch', 'backen', false),
  ('walnuesse', 'Walnüsse', 'Walnuts', 'backen', false),
  ('pinienkerne', 'Pinienkerne', 'Pine nuts', 'backen', false),
  ('erdnuesse', 'Erdnüsse', 'Peanuts', 'backen', false),
  ('cashews', 'Cashewkerne', 'Cashews', 'backen', false),
  ('sesam', 'Sesam', 'Sesame seeds', 'backen', false),
  ('baguette', 'Baguette', 'Baguette', 'brot', false),
  ('toastbrot', 'Toastbrot', 'Sandwich bread', 'brot', false),
  ('bauernbrot', 'Bauernbrot', 'Rye bread', 'brot', false),
  ('broetchen', 'Brötchen vom Vortag', 'Day-old bread rolls', 'brot', false),
  ('burgerbroetchen', 'Burgerbrötchen', 'Burger buns', 'brot', false),
  ('tortillas', 'Weizentortillas', 'Flour tortillas', 'brot', false),
  ('pita', 'Pitabrot', 'Pita bread', 'brot', false),
  ('flammkuchenteig', 'Flammkuchenteig (Kühlregal)', 'Tarte flambée dough', 'brot', false),
  ('eier', 'Eier', 'Eggs', 'milch_eier', false),
  ('milch', 'Milch', 'Milk', 'milch_eier', false),
  ('haferdrink', 'Haferdrink', 'Oat milk', 'milch_eier', false),
  ('butter', 'Butter', 'Butter', 'milch_eier', false),
  ('sahne', 'Sahne', 'Cream', 'milch_eier', false),
  ('hafersahne', 'Hafer-Kochsahne', 'Oat cream', 'milch_eier', false),
  ('schmand', 'Schmand', 'Sour cream', 'milch_eier', false),
  ('creme_fraiche', 'Crème fraîche', 'Crème fraîche', 'milch_eier', false),
  ('quark', 'Magerquark', 'Quark', 'milch_eier', false),
  ('joghurt', 'Griechischer Joghurt', 'Greek yogurt', 'milch_eier', false),
  ('sojajoghurt', 'Sojajoghurt', 'Soy yogurt', 'milch_eier', false),
  ('parmesan', 'Parmesan', 'Parmesan', 'milch_eier', false),
  ('mozzarella', 'Mozzarella', 'Mozzarella', 'milch_eier', false),
  ('feta', 'Feta', 'Feta', 'milch_eier', false),
  ('reibekaese', 'Geriebener Käse (Gouda)', 'Grated cheese (Gouda)', 'milch_eier', false),
  ('bergkaese', 'Bergkäse', 'Mountain cheese', 'milch_eier', false),
  ('cheddar', 'Cheddar', 'Cheddar', 'milch_eier', false),
  ('ziegenkaese', 'Ziegenfrischkäse', 'Goat cheese', 'milch_eier', false),
  ('halloumi', 'Halloumi', 'Halloumi', 'milch_eier', false),
  ('frischkaese', 'Frischkäse', 'Cream cheese', 'milch_eier', false),
  ('tofu', 'Tofu (natur)', 'Firm tofu', 'milch_eier', false),
  ('raeuchertofu', 'Räuchertofu', 'Smoked tofu', 'milch_eier', false),
  ('hackfleisch', 'Hackfleisch (gemischt)', 'Mixed minced meat', 'fleisch_fisch', false),
  ('rinderhack', 'Rinderhackfleisch', 'Ground beef', 'fleisch_fisch', false),
  ('haehnchenbrust', 'Hähnchenbrustfilet', 'Chicken breast', 'fleisch_fisch', false),
  ('haehnchenschenkel', 'Hähnchenschenkel', 'Chicken thighs', 'fleisch_fisch', false),
  ('speck', 'Speckwürfel', 'Diced bacon', 'fleisch_fisch', false),
  ('schinken', 'Kochschinken', 'Cooked ham', 'fleisch_fisch', false),
  ('bratwurst', 'Bratwurst', 'Bratwurst', 'fleisch_fisch', false),
  ('wiener', 'Wiener Würstchen', 'Frankfurters', 'fleisch_fisch', false),
  ('fleischwurst', 'Fleischwurst', 'Bologna sausage', 'fleisch_fisch', false),
  ('chorizo', 'Chorizo', 'Chorizo', 'fleisch_fisch', false),
  ('schnitzel', 'Schweineschnitzel', 'Pork escalope', 'fleisch_fisch', false),
  ('geschnetzeltes', 'Schweinegeschnetzeltes', 'Sliced pork', 'fleisch_fisch', false),
  ('rindergulasch', 'Rindergulasch', 'Beef stew meat', 'fleisch_fisch', false),
  ('lachs', 'Lachsfilet', 'Salmon fillet', 'fleisch_fisch', false),
  ('raeucherlachs', 'Räucherlachs', 'Smoked salmon', 'fleisch_fisch', false),
  ('fischfilet', 'Weißes Fischfilet (z. B. Seelachs)', 'White fish fillet', 'fleisch_fisch', false),
  ('garnelen', 'Garnelen', 'Prawns', 'fleisch_fisch', false),
  ('fischstaebchen', 'Fischstäbchen', 'Fish fingers', 'fleisch_fisch', false)
on conflict (id) do update set name_de = excluded.name_de, name_en = excluded.name_en,
  aisle = excluded.aisle, is_staple = excluded.is_staple;

insert into public.recipes (id, slug, title, description, category, diet, total_minutes, difficulty, servings, steps) values
  ('caec4add-dbb2-4594-afe5-97c929c65a5c', 'spaghetti-aglio-olio', 'Spaghetti Aglio e Olio', 'Knoblauch, Olivenöl und eine Prise Chili – mehr braucht es nicht für diesen schnellen Klassiker.', 'pasta', 'vegan', 15, 1, 2, array['Spaghetti in reichlich Salzwasser bissfest garen. Eine Tasse Nudelwasser aufheben.', 'Knoblauch in dünne Scheiben schneiden und im Olivenöl bei schwacher Hitze goldgelb ziehen lassen. Chiliflocken kurz mitrösten.', 'Spaghetti abgießen, in die Pfanne geben und mit etwas Nudelwasser durchschwenken, bis eine leicht cremige Sauce entsteht.', 'Petersilie hacken, untermischen und mit Salz und Pfeffer abschmecken.']::text[]),
  ('4bd49841-52dc-4b87-ae19-768660182577', 'spaghetti-bolognese', 'Spaghetti Bolognese', 'Langsam geschmorte Hackfleischsauce mit Gemüse und einem Schuss Rotwein – Familienliebling.', 'pasta', 'fleisch', 50, 1, 4, array['Zwiebel, Karotte, Sellerie und Knoblauch fein würfeln.', 'Hackfleisch im Olivenöl krümelig braten, dann das Gemüse zugeben und 5 Minuten mitbraten.', 'Tomatenmark kurz anrösten, mit Rotwein ablöschen und einkochen lassen.', 'Passierte Tomaten und Oregano zugeben und die Sauce zugedeckt 30 Minuten leise köcheln lassen.', 'Spaghetti garen, abgießen und mit der Sauce und geriebenem Parmesan servieren.']::text[]),
  ('a3ebc6cd-14c7-41d9-a262-fd233698315b', 'penne-arrabbiata', 'Penne all’Arrabbiata', 'Feurige Tomatensauce mit Knoblauch und Chili – schnell gekocht und herrlich würzig.', 'pasta', 'vegan', 25, 1, 2, array['Knoblauch und Chili fein hacken und im Olivenöl kurz anschwitzen.', 'Tomaten zugeben, mit Salz und einer Prise Zucker würzen und 15 Minuten einköcheln lassen.', 'Inzwischen die Penne bissfest garen.', 'Nudeln abgießen, mit der Sauce mischen und mit gehackter Petersilie bestreuen.']::text[]),
  ('4a750e34-7619-4dbf-aeec-0120fb7e607b', 'pasta-zucchini-zitrone', 'Pasta mit Zucchini und Zitrone', 'Leichte Sommerpasta mit gebratener Zucchini, Zitronenabrieb und Parmesan.', 'pasta', 'vegetarisch', 20, 1, 2, array['Fusilli in Salzwasser garen.', 'Zucchini grob raspeln oder in feine Stifte schneiden und mit dem gehackten Knoblauch im Olivenöl 5 Minuten braten.', 'Zitronenschale abreiben und den Saft auspressen.', 'Nudeln mit etwas Kochwasser zur Zucchini geben, Zitronenschale, Saft und Parmesan unterrühren.', 'Mit Salz, Pfeffer und Basilikum abschmecken.']::text[]),
  ('6e627baf-5417-4cb9-ab58-1fcc2f8cb720', 'kaesespaetzle', 'Käsespätzle mit Röstzwiebeln', 'Schwäbisches Soulfood: Spätzle mit würzigem Bergkäse und knusprigen Zwiebeln.', 'pasta', 'vegetarisch', 35, 2, 4, array['Backofen auf 180 °C Ober-/Unterhitze vorheizen. Käse reiben.', 'Zwiebeln in Ringe schneiden und in der Butter bei mittlerer Hitze 15 Minuten goldbraun rösten.', 'Spätzle nach Packungsangabe erhitzen und abtropfen lassen.', 'Spätzle und Käse abwechselnd in eine Auflaufform schichten, dabei mit Pfeffer und Muskat würzen.', '10 Minuten im Ofen schmelzen lassen, mit Röstzwiebeln und Schnittlauch servieren.']::text[]),
  ('f0e59c88-e106-4591-a265-bcefbacfc2a1', 'gnocchi-salbeibutter', 'Gnocchi in Salbeibutter', 'Goldbraun gebratene Gnocchi in nussiger Butter mit knusprigem Salbei.', 'pasta', 'vegetarisch', 15, 1, 2, array['Butter in einer großen Pfanne aufschäumen lassen, bis sie leicht nussig duftet.', 'Gnocchi zugeben und unter gelegentlichem Wenden 6–8 Minuten goldbraun braten.', 'Salbeiblätter in den letzten 2 Minuten mitbraten, bis sie knusprig sind.', 'Mit Salz, Pfeffer und einem Spritzer Zitrone abschmecken und mit Parmesan servieren.']::text[]),
  ('146be5dd-260a-4cab-a9d0-ed370d8f85a0', 'spaghetti-carbonara', 'Spaghetti Carbonara', 'Cremig ohne Sahne: Ei, Parmesan und knuspriger Speck umhüllen die Spaghetti.', 'pasta', 'fleisch', 25, 2, 2, array['Spaghetti in Salzwasser garen.', 'Speck in einer Pfanne ohne Fett knusprig auslassen und die Pfanne vom Herd nehmen.', 'Eier mit fein geriebenem Parmesan und reichlich Pfeffer verquirlen.', 'Nudeln tropfnass zum Speck geben, kurz abkühlen lassen und die Eimasse mit etwas Nudelwasser unterrühren, bis eine cremige Sauce entsteht. Nicht mehr auf die heiße Platte stellen, sonst stockt das Ei.']::text[]),
  ('d469a619-9e85-4ecb-a158-b0cdf320d435', 'tortellini-schinken-sahne', 'Tortellini in Schinken-Sahne-Sauce', 'Schnelles Feierabendgericht mit Kochschinken, Erbsen und cremiger Sauce.', 'pasta', 'fleisch', 20, 1, 2, array['Zwiebel würfeln, Schinken in Streifen schneiden.', 'Zwiebel in Butter glasig dünsten, Schinken kurz mitbraten.', 'Sahne und Erbsen zugeben und 5 Minuten köcheln lassen. Mit Salz, Pfeffer und Muskat würzen.', 'Tortellini nach Packungsangabe garen, abgießen und in der Sauce schwenken. Mit Parmesan servieren.']::text[]),
  ('946e3942-7811-4466-a1c1-ec93bcb7730f', 'pasta-lachs-spinat', 'Pasta mit Lachs und Spinat', 'Zarte Lachswürfel und Babyspinat in einer leichten Zitronen-Sahnesauce.', 'pasta', 'fisch', 25, 1, 2, array['Bandnudeln in Salzwasser garen.', 'Lachs in Würfel schneiden, salzen und im Olivenöl rundum kurz anbraten. Herausnehmen.', 'Knoblauch in der Pfanne anschwitzen, Sahne angießen und 3 Minuten köcheln lassen.', 'Spinat in der Sauce zusammenfallen lassen, Lachs wieder zugeben und mit Zitronensaft, Dill, Salz und Pfeffer abschmecken.', 'Nudeln untermischen und sofort servieren.']::text[]),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 'linsen-bolognese', 'Linsen-Bolognese', 'Herzhafte Bolognese mit roten Linsen – vegan, sättigend und voller Geschmack.', 'pasta', 'vegan', 35, 1, 4, array['Zwiebel, Karotten und Knoblauch fein würfeln und im Olivenöl 5 Minuten anbraten.', 'Tomatenmark kurz mitrösten, dann Linsen, passierte Tomaten, Brühe und Oregano zugeben.', 'Alles 20 Minuten köcheln lassen, bis die Linsen weich sind. Bei Bedarf etwas Wasser ergänzen.', 'Spaghetti garen und mit der Sauce servieren.']::text[]),
  ('83b7d787-9061-4e64-a36c-cee90f7102e3', 'pasta-pesto-bohnen', 'Pasta Genovese mit Bohnen und Kartoffeln', 'Die ligurische Art: Pesto, grüne Bohnen und Kartoffelwürfel in einem Topf gegart.', 'pasta', 'vegetarisch', 25, 1, 3, array['Kartoffeln schälen und in kleine Würfel schneiden, Bohnen putzen und halbieren.', 'Kartoffeln in kochendes Salzwasser geben, nach 3 Minuten Nudeln und Bohnen zufügen und alles zusammen garen.', 'Pinienkerne ohne Fett goldbraun rösten.', 'Abgießen (etwas Kochwasser auffangen), mit Pesto und einem Schluck Kochwasser vermengen. Mit Parmesan und Pinienkernen servieren.']::text[]),
  ('9190ba4f-165a-4b93-afae-6ba5bdb2db3e', 'orecchiette-brokkoli', 'Orecchiette mit Brokkoli', 'Apulischer Klassiker: Brokkoli zerfällt mit Knoblauch und Chili zu einer würzigen Sauce.', 'pasta', 'vegan', 25, 1, 2, array['Brokkoli in kleine Röschen teilen, den Strunk schälen und würfeln.', 'Orecchiette in Salzwasser garen, den Brokkoli 5 Minuten vor Ende mitkochen.', 'Semmelbrösel in 1 EL Öl knusprig rösten und beiseitestellen.', 'Knoblauch und Chili im restlichen Öl anschwitzen. Nudeln und Brokkoli mit etwas Kochwasser zugeben und kräftig rühren, bis der Brokkoli teilweise zerfällt.', 'Mit Zitronensaft und Salz abschmecken und mit den Bröseln bestreuen.']::text[]),
  ('0f508010-4537-4f56-a095-3a38bb452551', 'mac-and-cheese', 'Mac and Cheese', 'Makkaroni in samtiger Käsesauce, im Ofen überbacken – Gemütlichkeit pur.', 'pasta', 'vegetarisch', 35, 1, 4, array['Backofen auf 200 °C vorheizen. Makkaroni 2 Minuten kürzer als angegeben garen.', 'Butter schmelzen, Mehl einrühren und unter Rühren nach und nach die Milch zugießen. 5 Minuten sämig köcheln.', 'Cheddar und Senf in die Sauce rühren, salzen und pfeffern.', 'Nudeln mit der Sauce mischen, in eine Form geben, mit Reibekäse und Bröseln bestreuen und 15 Minuten goldbraun überbacken.']::text[]),
  ('15a39cdb-ef01-4496-a1b8-f57befcfe34f', 'one-pot-pasta-tomate-spinat', 'One-Pot-Pasta mit Tomaten und Spinat', 'Alles in einen Topf, fertig: Nudeln garen direkt in der würzigen Tomatenbrühe.', 'pasta', 'vegan', 25, 1, 3, array['Zwiebel in Streifen, Knoblauch in Scheiben schneiden, Kirschtomaten halbieren.', 'Nudeln, Tomaten, Zwiebel, Knoblauch, Oregano, Öl und Brühe in einen breiten Topf geben.', 'Aufkochen und ohne Deckel unter häufigem Rühren 10–12 Minuten kochen, bis die Flüssigkeit fast aufgesogen ist.', 'Spinat unterheben, zusammenfallen lassen und mit Salz, Pfeffer und Basilikum abschmecken.']::text[]),
  ('9aca5906-4d7c-4947-a653-6f6761b66a16', 'pasta-thunfisch-tomate', 'Pasta mit Thunfisch-Tomatensauce', 'Vorratsküche at its best: Thunfisch, Kapern und Tomaten für eine würzige Sauce.', 'pasta', 'fisch', 20, 1, 2, array['Zwiebel und Knoblauch würfeln und im Olivenöl glasig dünsten.', 'Tomaten, Kapern und halbierte Oliven zugeben und 10 Minuten köcheln lassen.', 'Thunfisch abtropfen lassen, zerpflücken und in der Sauce erwärmen.', 'Spaghetti garen, mit der Sauce mischen und mit Petersilie bestreuen.']::text[]),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 'pilzrisotto', 'Cremiges Pilzrisotto', 'Geduld zahlt sich aus: Champignons, Parmesan und ein Schluck Weißwein machen es unwiderstehlich.', 'reis_getreide', 'vegetarisch', 40, 2, 3, array['Brühe erhitzen und warm halten. Pilze in Scheiben schneiden und im Öl scharf anbraten, salzen, herausnehmen.', 'Zwiebel und Knoblauch fein würfeln und im selben Topf glasig dünsten. Reis zugeben und 1 Minute mitrösten.', 'Mit Weißwein ablöschen. Dann nach und nach Brühe angießen und unter häufigem Rühren etwa 20 Minuten garen.', 'Pilze und Thymianblättchen unterheben, Topf vom Herd nehmen und Butter und Parmesan einrühren. 2 Minuten ruhen lassen.']::text[]),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 'spanische-reispfanne', 'Spanische Reispfanne mit Hähnchen', 'Paella-Style für zuhause: Hähnchen, Chorizo, Paprika und Erbsen auf würzigem Safran-Paprika-Reis.', 'reis_getreide', 'fleisch', 45, 2, 4, array['Hähnchen in mundgerechte Stücke schneiden, salzen und im Öl in einer großen Pfanne rundum anbraten. Chorizo in Scheiben kurz mitbraten.', 'Zwiebel, Knoblauch und Paprika würfeln, zugeben und 5 Minuten braten.', 'Reis, Paprikapulver und Kurkuma unterrühren, mit der Brühe aufgießen.', 'Ohne Rühren bei mittlerer Hitze etwa 20 Minuten garen. Nach 15 Minuten die Erbsen darauf verteilen.', 'Mit Zitronenspalten servieren.']::text[]),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 'gemuese-couscous-kichererbsen', 'Gemüse-Couscous mit Kichererbsen', 'Orientalisch gewürzt, in 20 Minuten fertig und herrlich bunt.', 'reis_getreide', 'vegan', 20, 1, 2, array['Couscous mit heißer Brühe übergießen und 5 Minuten quellen lassen, dann mit einer Gabel auflockern.', 'Gemüse würfeln und im Olivenöl 6 Minuten braten. Abgetropfte Kichererbsen, Kreuzkümmel und Zimt zugeben.', 'Gemüse unter den Couscous mischen, mit Zitronensaft, Salz und gehackter Minze abschmecken.']::text[]),
  ('c45fa7c2-699f-4d8e-ace3-733bebd04eef', 'bulgur-paprika-feta', 'Bulgurpfanne mit Paprika und Feta', 'Türkisch inspirierte Pfanne mit Tomatenmark, Paprika und cremigem Feta obendrauf.', 'reis_getreide', 'vegetarisch', 25, 1, 2, array['Zwiebel und Paprika würfeln und im Öl 5 Minuten anbraten.', 'Tomatenmark und Paprikapulver kurz anrösten, Bulgur zugeben und mit Brühe ablöschen.', 'Zugedeckt bei schwacher Hitze 12 Minuten quellen lassen.', 'Mit zerbröckeltem Feta und Petersilie servieren.']::text[]),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 'buddha-bowl-erdnuss', 'Buddha Bowl mit Erdnussdressing', 'Reis, Ofen-Süßkartoffel, Kichererbsen und knackiges Gemüse mit cremigem Erdnussdressing.', 'reis_getreide', 'vegan', 35, 1, 2, array['Backofen auf 210 °C vorheizen. Süßkartoffel würfeln, mit Kichererbsen, Öl, Paprika und Salz mischen und 25 Minuten rösten.', 'Reis nach Packungsangabe garen.', 'Erdnussbutter mit Sojasauce, Limettensaft, Ahornsirup und 3 EL warmem Wasser glatt rühren.', 'Karotte raspeln, Gurke und Avocado in Scheiben schneiden.', 'Alles in Schalen anrichten, mit Dressing beträufeln und mit Sesam bestreuen.']::text[]),
  ('92d0f554-7d93-49e1-a21d-3bc85fc0be4b', 'gebratener-reis-ei', 'Gebratener Reis mit Ei', 'Perfekte Resteverwertung: Reis vom Vortag, Gemüse und Ei aus dem Wok.', 'reis_getreide', 'vegetarisch', 20, 1, 2, array['Karotte fein würfeln, Frühlingszwiebeln in Ringe schneiden, Knoblauch hacken.', 'Öl im Wok stark erhitzen, Karotte und Knoblauch 2 Minuten braten, Erbsen zugeben.', 'Gemüse an den Rand schieben, Eier in die Mitte geben und unter Rühren stocken lassen.', 'Kalten Reis zugeben und alles 4–5 Minuten kräftig braten. Mit Sojasauce, Sesamöl und Frühlingszwiebeln abschmecken.']::text[]),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 'chili-sin-carne', 'Chili sin Carne', 'Bohnen, Mais und rote Linsen in einer rauchig-würzigen Sauce, dazu Reis.', 'reis_getreide', 'vegan', 40, 1, 4, array['Zwiebel, Paprika und Knoblauch würfeln und im Öl anbraten. Gewürze kurz mitrösten.', 'Tomaten, Linsen und Brühe zugeben und 20 Minuten köcheln lassen.', 'Bohnen und Mais abspülen, zugeben und weitere 5 Minuten köcheln. Mit Salz abschmecken.', 'Inzwischen den Reis garen und zum Chili servieren.']::text[]),
  ('13936405-89e6-4d4c-a4ac-ff5752b7fc3d', 'risi-e-bisi', 'Risi e Bisi', 'Venezianischer Reis mit Erbsen – irgendwo zwischen Risotto und Suppe, wunderbar mild.', 'reis_getreide', 'vegetarisch', 30, 1, 3, array['Zwiebel fein würfeln und in der Hälfte der Butter glasig dünsten.', 'Reis zugeben, kurz mitdünsten und mit der heißen Brühe aufgießen.', 'Etwa 15 Minuten köcheln lassen, dann die Erbsen zugeben und weitere 5 Minuten garen. Die Konsistenz soll leicht suppig sein.', 'Restliche Butter, Parmesan und Petersilie unterrühren und abschmecken.']::text[]),
  ('81ca65aa-30d1-4a03-aaba-081d4210fe89', 'lachs-bowl', 'Lachs-Bowl mit Gurke und Avocado', 'Gebratener Lachs auf Reis mit knackigem Gemüse und Sesam-Soja-Dressing.', 'reis_getreide', 'fisch', 30, 1, 2, array['Reis garen. Sojasauce, Honig und Limettensaft verrühren.', 'Lachs in Würfel schneiden und im Öl 3–4 Minuten rundum braten. Mit der Hälfte der Sauce glasieren.', 'Gurke, Avocado, Radieschen und Frühlingszwiebeln schneiden.', 'Reis in Schalen verteilen, Lachs und Gemüse darauf anrichten, mit restlicher Sauce und Sesam vollenden.']::text[]),
  ('accf6bab-8ad5-43e4-af0d-83f561097fca', 'quinoa-ofengemuese', 'Quinoa mit Ofengemüse und Tahini', 'Geröstetes Gemüse, nussige Quinoa und eine Zitronen-Tahini-Sauce.', 'reis_getreide', 'vegan', 40, 1, 2, array['Ofen auf 220 °C vorheizen. Blumenkohl in Röschen teilen, Karotten in Stifte und Zwiebel in Spalten schneiden.', 'Gemüse und Kichererbsen mit Öl, Kreuzkümmel und Salz mischen und 25 Minuten rösten.', 'Quinoa gründlich abspülen und in der doppelten Menge Salzwasser 15 Minuten garen.', 'Tahini mit Zitronensaft und etwas Wasser cremig rühren. Alles anrichten und mit Petersilie bestreuen.']::text[]),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 'kuerbisrisotto', 'Kürbisrisotto mit Salbei', 'Herbst im Teller: Hokkaido schmilzt ins Risotto, knuspriger Salbei obendrauf.', 'reis_getreide', 'vegetarisch', 45, 2, 3, array['Kürbis entkernen und mit Schale in kleine Würfel schneiden. Zwiebel fein würfeln.', 'Zwiebel und Kürbis im Öl 5 Minuten andünsten, Reis zugeben und glasig werden lassen.', 'Mit Wein ablöschen und nach und nach die heiße Brühe unter Rühren zugeben, bis der Reis nach etwa 20 Minuten cremig ist.', 'Salbeiblätter in der Butter knusprig braten. Parmesan und Muskat ins Risotto rühren und mit der Salbeibutter servieren.']::text[]),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 'rote-linsen-dal', 'Rote-Linsen-Dal mit Reis', 'Indisch gewürzte Linsen mit Kokosmilch – wärmend, günstig und in einem Topf gekocht.', 'reis_getreide', 'vegan', 35, 1, 4, array['Zwiebel, Knoblauch und Ingwer fein hacken und im Öl anschwitzen. Gewürze kurz mitrösten.', 'Linsen, Tomaten, Kokosmilch und Brühe zugeben und 20 Minuten sanft köcheln lassen, bis die Linsen zerfallen.', 'Parallel den Reis garen.', 'Dal mit Salz abschmecken und mit Koriander zum Reis servieren.']::text[]),
  ('23f4c532-6cc6-4d09-ab88-f18b78a60831', 'haehnchen-teriyaki-reis', 'Hähnchen-Teriyaki mit Reis', 'Glänzend glasiertes Hähnchen mit hausgemachter Teriyakisauce und Brokkoli.', 'reis_getreide', 'fleisch', 30, 1, 2, array['Reis garen. Brokkoli in Röschen teilen und die letzten 4 Minuten über dem Reis dämpfen oder kurz blanchieren.', 'Sojasauce, Honig, geriebenen Ingwer, Knoblauch, Stärke und 4 EL Wasser verrühren.', 'Hähnchen in Streifen schneiden und im Öl 5 Minuten goldbraun braten.', 'Sauce zugeben und unter Rühren eindicken lassen, bis das Fleisch glänzt. Mit Reis, Brokkoli und Sesam servieren.']::text[]),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 'polenta-pilzragout', 'Cremige Polenta mit Pilzragout', 'Weiche Parmesan-Polenta mit einem würzigen Ragout aus Champignons und Thymian.', 'reis_getreide', 'vegetarisch', 35, 2, 3, array['Brühe aufkochen, Polenta unter Rühren einrieseln lassen und bei kleiner Hitze 10–15 Minuten quellen lassen. Häufig rühren.', 'Pilze vierteln und im Öl kräftig anbraten. Zwiebel, Knoblauch und Thymian zugeben und 3 Minuten weiterbraten.', 'Sahne angießen, kurz einkochen lassen und abschmecken.', 'Butter und Parmesan in die Polenta rühren und mit dem Ragout servieren.']::text[]),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 'kartoffelsuppe-wuerstchen', 'Kartoffelsuppe mit Würstchen', 'Wie bei Oma: sämige Kartoffelsuppe mit Suppengemüse, Majoran und Wiener Würstchen.', 'suppen_eintoepfe', 'fleisch', 40, 1, 4, array['Kartoffeln, Karotten und Sellerie schälen und würfeln. Lauch und Zwiebel in Ringe bzw. Würfel schneiden.', 'Zwiebel und Lauch in Butter andünsten, restliches Gemüse zugeben und mit Brühe aufgießen.', 'Zugedeckt 20 Minuten köcheln lassen. Etwa ein Drittel der Suppe pürieren und zurückgeben.', 'Würstchen in Scheiben schneiden und mit Sahne und Majoran in der Suppe erwärmen. Mit Petersilie servieren.']::text[]),
  ('6693396c-1840-4518-a869-91fb996b50f6', 'tomatensuppe', 'Samtige Tomatensuppe', 'Aus der Dose zur Lieblingssuppe: Tomaten, Zwiebeln und Basilikum, fein püriert.', 'suppen_eintoepfe', 'vegan', 30, 1, 3, array['Zwiebel, Knoblauch und Karotte würfeln und im Olivenöl 5 Minuten andünsten.', 'Tomatenmark kurz mitrösten, Tomaten und Brühe zugeben und 15 Minuten köcheln lassen.', 'Fein pürieren, Hafersahne einrühren und mit Salz, Pfeffer und Zucker abschmecken.', 'Mit Basilikumblättern servieren.']::text[]),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 'linseneintopf', 'Linseneintopf', 'Deftig und vegan: Tellerlinsen mit Kartoffeln, Gemüse und einem Schuss Essig.', 'suppen_eintoepfe', 'vegan', 50, 1, 4, array['Zwiebel, Karotten und Kartoffeln würfeln, Lauch in Ringe schneiden.', 'Zwiebel im Öl andünsten, Linsen, Gemüse, Lorbeer und Brühe zugeben.', '35 Minuten köcheln lassen, bis Linsen und Kartoffeln weich sind.', 'Räuchertofu würfeln, knusprig braten und unterheben. Mit Essig, Majoran, Salz und Pfeffer kräftig abschmecken.']::text[]),
  ('6078e6a8-4b68-4127-a06a-77872b6cba76', 'kuerbissuppe-ingwer', 'Kürbissuppe mit Ingwer', 'Cremige Hokkaido-Suppe mit Kokosmilch und einer frischen Ingwernote.', 'suppen_eintoepfe', 'vegan', 35, 1, 4, array['Kürbis entkernen und mit Schale würfeln. Zwiebel, Karotte und Ingwer klein schneiden.', 'Alles im Öl 5 Minuten andünsten, Curry kurz mitrösten.', 'Mit Brühe aufgießen und 20 Minuten köcheln lassen.', 'Kokosmilch zugeben, fein pürieren und abschmecken.']::text[]),
  ('087ab2d7-fccc-4614-aab0-c7f92a7d9607', 'huehnersuppe-nudeln', 'Hühnersuppe mit Nudeln', 'Selbst gekochte Brühe mit zartem Hähnchen, Gemüse und Suppennudeln – Seelenwärmer.', 'suppen_eintoepfe', 'fleisch', 70, 2, 4, array['Hähnchenschenkel mit halbierter Zwiebel, Lorbeer und 1 EL Salz in 2 l kaltem Wasser aufsetzen.', 'Aufkochen, Schaum abschöpfen und 45 Minuten leise köcheln lassen.', 'Fleisch herausnehmen, von Haut und Knochen lösen und zerpflücken. Brühe durch ein Sieb gießen.', 'Gemüse würfeln und in der Brühe 10 Minuten garen. Nudeln zugeben und nach Packungsangabe garen.', 'Fleisch zurückgeben, abschmecken und mit viel Petersilie servieren.']::text[]),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 'minestrone', 'Minestrone', 'Italienische Gemüsesuppe mit weißen Bohnen und kleinen Nudeln.', 'suppen_eintoepfe', 'vegan', 40, 1, 4, array['Alle Gemüse klein würfeln, Knoblauch hacken.', 'Zwiebel, Karotten, Sellerie und Knoblauch im Öl 5 Minuten andünsten.', 'Kartoffeln, Zucchini, Tomaten und Brühe zugeben und 15 Minuten köcheln lassen.', 'Bohnen und Nudeln zugeben und weitere 8–10 Minuten garen. Mit Basilikum und einem Schuss Olivenöl servieren.']::text[]),
  ('3779bd39-3fa1-4e6e-aff2-455d3c888645', 'erbsensuppe-minze', 'Erbsensuppe mit Minze', 'Leuchtend grün, frisch und in 25 Minuten auf dem Tisch.', 'suppen_eintoepfe', 'vegan', 25, 1, 3, array['Zwiebel und Kartoffel würfeln und im Öl andünsten.', 'Mit Brühe aufgießen und 10 Minuten köcheln lassen.', 'Erbsen zugeben und 5 Minuten mitkochen.', 'Minzblätter zugeben, fein pürieren und mit Zitronensaft, Salz und Pfeffer abschmecken.']::text[]),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 'chili-con-carne', 'Chili con Carne', 'Würziges Hackfleisch-Chili mit Bohnen und Mais – perfekt für viele Esser.', 'suppen_eintoepfe', 'fleisch', 50, 1, 4, array['Hackfleisch im Öl krümelig braten. Zwiebeln, Paprika und Knoblauch würfeln und mitbraten.', 'Tomatenmark und Gewürze kurz anrösten, dann Tomaten zugeben.', '25 Minuten bei schwacher Hitze köcheln lassen.', 'Bohnen und Mais zufügen, 5 Minuten erhitzen und abschmecken. Mit Schmand servieren.']::text[]),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 'gulaschsuppe', 'Gulaschsuppe', 'Kräftig, paprikarot und lange geschmort – ideal für kalte Abende.', 'suppen_eintoepfe', 'fleisch', 100, 2, 4, array['Fleisch in kleine Würfel schneiden und portionsweise im Öl kräftig anbraten.', 'Gewürfelte Zwiebeln zugeben und 10 Minuten mitbraten, bis sie bräunen. Tomatenmark, Paprikapulver und Knoblauch kurz mitrösten.', 'Mit Brühe ablöschen, Kümmel und Majoran zugeben und zugedeckt 50 Minuten schmoren.', 'Kartoffeln und Paprika würfeln, zugeben und weitere 25 Minuten garen. Kräftig abschmecken.']::text[]),
  ('24393fba-05f1-42d0-a44c-bc2872c3f0cc', 'brokkoli-cremesuppe', 'Brokkoli-Cremesuppe', 'Grüne Cremesuppe mit Frischkäse und gerösteten Kernen.', 'suppen_eintoepfe', 'vegetarisch', 25, 1, 3, array['Brokkoli in Röschen teilen, Strunk schälen und würfeln. Kartoffel und Zwiebel würfeln.', 'Zwiebel in Butter andünsten, Kartoffel und Brokkoli zugeben und mit Brühe aufgießen.', '15 Minuten köcheln lassen, dann mit dem Frischkäse fein pürieren.', 'Mit Muskat, Salz und Pfeffer abschmecken und mit gerösteten Pinienkernen servieren.']::text[]),
  ('38ee3d74-fd6a-4f8a-a7c8-4b2bb23ccb57', 'moehren-ingwer-suppe', 'Möhren-Ingwer-Suppe mit Kokos', 'Fruchtig-scharf, samtig und in einer halben Stunde fertig.', 'suppen_eintoepfe', 'vegan', 30, 1, 3, array['Karotten schälen und in Scheiben schneiden, Zwiebel und Ingwer würfeln.', 'Im Öl andünsten, mit Brühe aufgießen und 20 Minuten köcheln lassen.', 'Kokosmilch zugeben und fein pürieren.', 'Mit Limettensaft und Salz abschmecken und mit Koriander servieren.']::text[]),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 'kichererbsen-spinat-eintopf', 'Kichererbsen-Spinat-Eintopf', 'Mediterraner Eintopf mit Tomaten, Kreuzkümmel und viel Spinat.', 'suppen_eintoepfe', 'vegan', 30, 1, 3, array['Zwiebel und Knoblauch würfeln und im Olivenöl anschwitzen. Gewürze kurz mitrösten.', 'Tomaten, Brühe und abgespülte Kichererbsen zugeben und 15 Minuten köcheln lassen.', 'Spinat unterheben und zusammenfallen lassen.', 'Mit Zitronensaft, Salz und Pfeffer abschmecken. Dazu passt Brot.']::text[]),
  ('23504c64-94dd-4356-a7e0-e5eeb5e05528', 'thai-kokossuppe-garnelen', 'Thai-Kokossuppe mit Garnelen', 'Cremig, zitronig und leicht scharf – inspiriert von Tom Kha.', 'suppen_eintoepfe', 'fisch', 30, 2, 2, array['Currypaste in einem Topf kurz anrösten, dann Kokosmilch und Brühe zugießen.', 'Ingwer in Scheiben und Pilze in Viertel schneiden, zugeben und 10 Minuten köcheln lassen.', 'Garnelen zugeben und 3 Minuten gar ziehen lassen.', 'Mit Limettensaft, Sojasauce und Zucker abschmecken und mit Frühlingszwiebeln und Koriander servieren.']::text[]),
  ('b1eaa5f8-d62f-4cba-abb8-dc5f4c21a07c', 'zwiebelsuppe-kaesetoast', 'Französische Zwiebelsuppe', 'Langsam karamellisierte Zwiebeln, kräftige Brühe und überbackene Käsecroûtons.', 'suppen_eintoepfe', 'vegetarisch', 60, 2, 4, array['Zwiebeln in dünne Ringe schneiden und in der Butter mit Zucker bei mittlerer Hitze 30 Minuten goldbraun karamellisieren. Regelmäßig rühren.', 'Mit Weißwein ablöschen, Brühe und Thymian zugeben und 15 Minuten köcheln lassen.', 'Baguette in Scheiben schneiden, mit geriebenem Käse belegen und unter dem Grill überbacken.', 'Suppe abschmecken und mit den Käsetoasts servieren.']::text[]),
  ('0047643e-babf-41ab-ae19-ae7c7f99a75b', 'griechischer-salat', 'Griechischer Bauernsalat', 'Tomaten, Gurke, Paprika, Oliven und ein großes Stück Feta – Urlaub auf dem Teller.', 'salate', 'vegetarisch', 15, 1, 2, array['Tomaten in Spalten, Gurke in dicke Halbmonde, Paprika in Streifen und Zwiebel in Ringe schneiden.', 'Gemüse mit Oliven in eine Schüssel geben, salzen und pfeffern.', 'Feta in einem Stück darauflegen, mit Oregano bestreuen und mit Öl und Essig beträufeln.', 'Mit Brot servieren.']::text[]),
  ('7c6640e0-5d4f-49ca-aaf3-aa04418c34a3', 'nudelsalat-pesto', 'Nudelsalat mit Pesto und Tomaten', 'Der Grillparty-Klassiker ohne Mayo: Pesto, Kirschtomaten, Rucola und Mozzarella.', 'salate', 'vegetarisch', 25, 1, 4, array['Nudeln in Salzwasser garen, abgießen, kalt abschrecken und abtropfen lassen.', 'Pinienkerne ohne Fett rösten. Tomaten halbieren, Mozzarella würfeln.', 'Nudeln mit Pesto, Öl und Balsamico mischen, Tomaten und Mozzarella unterheben.', 'Kurz vor dem Servieren Rucola und Pinienkerne unterziehen.']::text[]),
  ('98028916-4846-4225-ab41-5e575be188d9', 'schwaebischer-kartoffelsalat', 'Schwäbischer Kartoffelsalat', 'Mit warmer Brühe angemacht, saftig und ganz ohne Mayonnaise.', 'salate', 'vegan', 45, 1, 4, array['Kartoffeln mit Schale etwa 20 Minuten kochen, pellen und noch warm in dünne Scheiben schneiden.', 'Zwiebel fein würfeln und in der Brühe kurz aufkochen. Essig, Senf, Zucker, Salz und Pfeffer einrühren.', 'Die heiße Marinade über die Kartoffeln gießen, vorsichtig mischen und 15 Minuten ziehen lassen.', 'Öl, dünn gehobelte Gurke und Schnittlauch unterheben und lauwarm servieren.']::text[]),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 'caesar-salad-haehnchen', 'Caesar Salad mit Hähnchen', 'Knackiger Römersalat, Knoblauchcroûtons und ein cremiges Parmesandressing.', 'salate', 'fleisch', 30, 2, 2, array['Hähnchen salzen, pfeffern und in 1 EL Öl von jeder Seite 5–6 Minuten braten. Ruhen lassen und in Streifen schneiden.', 'Toast würfeln und mit gehacktem Knoblauch im restlichen Öl knusprig rösten.', 'Mayonnaise, Joghurt, Zitronensaft, Senf und die Hälfte des geriebenen Parmesans verrühren.', 'Salat in Stücke zupfen, mit Dressing mischen, Hähnchen und Croûtons darauf verteilen und mit Parmesan bestreuen.']::text[]),
  ('1b9b274b-1ebf-400c-abd2-842d7990b54a', 'couscous-salat-minze', 'Couscous-Salat mit Minze', 'Frisch wie Taboulé: Couscous mit Gurke, Tomaten, viel Petersilie und Minze.', 'salate', 'vegan', 20, 1, 3, array['Couscous mit heißer Brühe übergießen, 5 Minuten quellen lassen und auflockern. Abkühlen lassen.', 'Gurke und Tomaten klein würfeln, Frühlingszwiebeln in Ringe schneiden, Kräuter fein hacken.', 'Alles mit Zitronensaft und Olivenöl mischen und kräftig abschmecken.']::text[]),
  ('201fe2fb-ef9c-4ab7-af2c-041a7010944b', 'linsensalat-feta', 'Linsensalat mit Feta', 'Würzige Tellerlinsen, knackiges Gemüse und Feta – sättigt auch als Hauptgericht.', 'salate', 'vegetarisch', 30, 1, 3, array['Linsen in ungesalzenem Wasser 20–25 Minuten bissfest garen, abgießen und abkühlen lassen.', 'Paprika und Zwiebel fein würfeln, Petersilie hacken.', 'Essig, Senf, Öl, Salz und Pfeffer verrühren und mit Linsen und Gemüse mischen.', 'Feta darüberbröseln.']::text[]),
  ('90a6fd93-1c55-461c-aae6-85acb9989151', 'caprese', 'Caprese mit Ciabatta', 'Tomate, Mozzarella, Basilikum – drei Zutaten, ein perfekter Sommerabend.', 'salate', 'vegetarisch', 10, 1, 2, array['Tomaten und Mozzarella in Scheiben schneiden und abwechselnd auf einer Platte anrichten.', 'Mit Salz und Pfeffer würzen, Basilikumblätter dazwischenstecken.', 'Mit Olivenöl und Balsamico beträufeln und mit Brot servieren.']::text[]),
  ('bee26fe9-0196-4531-a52b-f12099bde428', 'thunfisch-bohnen-salat', 'Thunfisch-Bohnen-Salat', 'Toskanischer Vorratsschrank-Salat mit weißen Bohnen, roten Zwiebeln und Zitrone.', 'salate', 'fisch', 15, 1, 2, array['Bohnen abspülen und abtropfen lassen. Zwiebel in feine Ringe schneiden, Tomaten halbieren.', 'Thunfisch abtropfen lassen und grob zerpflücken.', 'Alles mit Zitronensaft, Olivenöl, Petersilie, Salz und Pfeffer mischen.']::text[]),
  ('e7e32c8d-3458-4c8c-a529-58f8c089ce5c', 'gurkensalat-tofu', 'Asiatischer Gurkensalat mit Knusper-Tofu', 'Erfrischender Gurkensalat mit Sesam-Dressing und knusprig gebratenem Tofu.', 'salate', 'vegan', 25, 1, 2, array['Tofu trocken tupfen, würfeln, in Stärke wenden und im Öl rundum knusprig braten. Mit 1 EL Sojasauce ablöschen.', 'Gurke leicht andrücken und in mundgerechte Stücke schneiden.', 'Restliche Sojasauce, Essig, Sesamöl, Ahornsirup, gehackten Knoblauch und Chili verrühren.', 'Gurke mit Dressing mischen, Tofu darauf verteilen und mit Sesam bestreuen.']::text[]),
  ('8af90b88-4d79-476b-a975-e17acdda5a55', 'rote-bete-ziegenkaese', 'Rote-Bete-Salat mit Ziegenkäse', 'Erdige Rote Bete, cremiger Ziegenkäse, Rucola und karamellisierte Walnüsse.', 'salate', 'vegetarisch', 20, 1, 2, array['Walnüsse in einer Pfanne mit 1 EL Honig karamellisieren lassen und auf Backpapier abkühlen lassen.', 'Rote Bete in Spalten, Apfel in dünne Scheiben schneiden.', 'Restlichen Honig mit Balsamico, Öl, Salz und Pfeffer verrühren.', 'Rucola, Rote Bete und Apfel anrichten, Ziegenkäse darüberzupfen, mit Dressing und Nüssen vollenden.']::text[]),
  ('ed54bac9-659a-4914-ae27-e6df69ac285b', 'quinoa-avocado-salat', 'Quinoa-Salat mit Avocado und Mais', 'Mexikanisch angehaucht mit Limette, Koriander, Bohnen und cremiger Avocado.', 'salate', 'vegan', 25, 1, 3, array['Quinoa abspülen und in der doppelten Menge Salzwasser 15 Minuten garen. Abkühlen lassen.', 'Mais und Bohnen abspülen. Paprika, Zwiebel und Avocado würfeln.', 'Limettensaft, Öl, Kreuzkümmel und Salz verrühren.', 'Alles mischen und mit gehacktem Koriander bestreuen.']::text[]),
  ('ee0c9cb1-c549-4287-aa7d-df0aee066313', 'wurstsalat', 'Schweizer Wurstsalat', 'Fleischwurst und Käse in würziger Essig-Öl-Marinade – Biergarten-Feeling zuhause.', 'salate', 'fleisch', 15, 1, 2, array['Wurst und Käse in feine Streifen schneiden, Zwiebel in dünne Ringe, Gurken in Scheiben.', 'Essig, Senf, Öl, 2 EL Gurkenwasser, Salz und Pfeffer verrühren.', 'Alles mischen und mindestens 10 Minuten ziehen lassen.', 'Mit Schnittlauch bestreuen und mit Bauernbrot servieren.']::text[]),
  ('7dc3505f-2a0e-46f4-aff1-68f951303f64', 'bunter-bohnensalat', 'Bunter Bohnensalat', 'Grüne, weiße und rote Bohnen in einer würzigen Vinaigrette – lässt sich super vorbereiten.', 'salate', 'vegan', 20, 1, 4, array['Grüne Bohnen putzen, halbieren und in Salzwasser 8 Minuten garen. Kalt abschrecken.', 'Dosenbohnen abspülen, Zwiebel fein würfeln, Petersilie hacken.', 'Essig, Senf, Öl, Zucker, Salz und Pfeffer verrühren.', 'Alles mischen und 10 Minuten durchziehen lassen.']::text[]),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 'lasagne-klassisch', 'Klassische Lasagne', 'Schicht für Schicht: Bolognese, Béchamel und goldbraun überbackener Käse.', 'ofen_auflauf', 'fleisch', 80, 2, 4, array['Zwiebel, Karotte und Knoblauch fein würfeln. Hack im Öl krümelig braten, Gemüse und Tomatenmark kurz mitbraten.', 'Passierte Tomaten und Oregano zugeben und 20 Minuten köcheln lassen. Kräftig abschmecken.', 'Für die Béchamel Butter schmelzen, Mehl einrühren und nach und nach die Milch zugießen. 5 Minuten köcheln, mit Salz und Muskat würzen.', 'Ofen auf 180 °C Umluft vorheizen. In einer Form Sauce, Platten, Béchamel abwechselnd schichten; mit Béchamel abschließen.', 'Mit Mozzarella und Parmesan bestreuen und 35 Minuten backen. Vor dem Anschneiden 10 Minuten ruhen lassen.']::text[]),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 'gemueselasagne', 'Gemüselasagne mit Spinat', 'Saftig gefüllt mit Zucchini, Paprika, Spinat und Ricotta-ähnlicher Quarkcreme.', 'ofen_auflauf', 'vegetarisch', 75, 2, 4, array['Spinat auftauen und gut ausdrücken. Zucchini, Paprika und Zwiebel würfeln.', 'Gemüse und Knoblauch im Öl 8 Minuten braten, Tomaten und Oregano zugeben und 10 Minuten köcheln.', 'Quark mit Ei, Spinat, Parmesan, Salz, Pfeffer und Muskat verrühren.', 'Ofen auf 180 °C Umluft vorheizen. Tomatengemüse, Platten und Spinatcreme in eine Form schichten, mit Tomatensauce enden.', 'Mozzarella darauf verteilen und 40 Minuten backen.']::text[]),
  ('453263d1-99dd-4aab-a3b5-4680654b7690', 'nudelauflauf-schinken', 'Nudelauflauf mit Schinken und Käse', 'Das Kantinen-Lieblingsessen, nur besser: Penne, Schinken, Erbsen und Käsekruste.', 'ofen_auflauf', 'fleisch', 45, 1, 4, array['Ofen auf 200 °C vorheizen. Penne 3 Minuten kürzer als angegeben garen.', 'Schinken würfeln. Sahne, Milch und Eier verquirlen und mit Salz, Pfeffer und Muskat würzen.', 'Nudeln, Schinken und Erbsen in einer Auflaufform mischen und die Eiersahne darübergießen.', 'Mit Käse bestreuen und 25 Minuten goldbraun backen. Mit Schnittlauch servieren.']::text[]),
  ('93d52b82-a042-4be0-ab28-c670003ef0f5', 'gefuellte-paprika', 'Gefüllte Paprika in Tomatensauce', 'Paprikaschoten mit Hack-Reis-Füllung, im Ofen in Tomatensauce geschmort.', 'ofen_auflauf', 'fleisch', 60, 2, 4, array['Reis 10 Minuten vorgaren und abgießen. Ofen auf 190 °C vorheizen.', 'Paprika halbieren und entkernen. Zwiebel fein würfeln.', 'Hack mit Reis, Zwiebel, Ei, Paprikapulver, Petersilie, Salz und Pfeffer verkneten und in die Paprikahälften füllen.', 'Passierte Tomaten würzen, in eine Form gießen, Paprika hineinsetzen und zugedeckt 30 Minuten garen.', 'Mit Käse bestreuen und offen weitere 10 Minuten überbacken.']::text[]),
  ('6d6f57af-ead9-48bf-a83a-b4469053aeab', 'ofengemuese-feta', 'Ofengemüse mit Feta', 'Ein Blech, viel Farbe: geröstetes Gemüse mit schmelzendem Feta und Kräutern.', 'ofen_auflauf', 'vegetarisch', 40, 1, 2, array['Ofen auf 220 °C vorheizen. Kartoffeln in Spalten schneiden, mit 2 EL Öl und Salz aufs Blech geben und 10 Minuten vorbacken.', 'Restliches Gemüse grob schneiden, mit Knoblauch, Rosmarin und Öl mischen und dazugeben.', 'Weitere 15 Minuten rösten, dann Feta in Stücken darauf verteilen und 10 Minuten weiterbacken.']::text[]),
  ('aac1e868-8476-4160-a976-e244d124e404', 'zitronen-haehnchen-blech', 'Zitronen-Hähnchen vom Blech', 'Knusprige Hähnchenschenkel mit Kartoffeln, Zitrone und Thymian – alles auf einem Blech.', 'ofen_auflauf', 'fleisch', 60, 1, 4, array['Ofen auf 200 °C Umluft vorheizen. Kartoffeln vierteln, Zwiebeln in Spalten, Zitronen in Scheiben schneiden.', 'Hähnchen mit Öl, Paprikapulver, Salz und Pfeffer einreiben.', 'Kartoffeln, Zwiebeln, Zitronen, ungeschälten Knoblauch und Thymian auf einem Blech verteilen, Hähnchen mit der Haut nach oben darauflegen.', '45 Minuten backen, bis die Haut knusprig und das Fleisch durchgegart ist.']::text[]),
  ('ef7024f3-c02c-4f6c-adc6-cf8afac54e2c', 'brokkoli-auflauf', 'Brokkoli-Kartoffel-Auflauf', 'Cremig überbacken mit Käsesauce – ein Wohlfühlessen für die ganze Familie.', 'ofen_auflauf', 'vegetarisch', 50, 1, 4, array['Kartoffeln schälen, in Scheiben schneiden und 8 Minuten in Salzwasser vorgaren. Brokkoli in Röschen die letzten 3 Minuten mitgaren.', 'Ofen auf 200 °C vorheizen, eine Form mit Butter einfetten.', 'Sahne, Milch, Eier und die Hälfte des Käses verquirlen und mit Salz, Pfeffer und Muskat würzen.', 'Gemüse in die Form geben, Guss darübergießen, restlichen Käse darauf verteilen und 25 Minuten backen.']::text[]),
  ('2c10def2-a2c6-442f-a666-c2124d682d22', 'ofenlachs-gemuese', 'Ofenlachs mit Zitronengemüse', 'Lachsfilet auf Zucchini und Kirschtomaten, mit Dill und Zitrone in 30 Minuten fertig.', 'ofen_auflauf', 'fisch', 30, 1, 2, array['Ofen auf 200 °C vorheizen. Reis garen.', 'Zucchini in Scheiben schneiden, mit Tomaten, gehacktem Knoblauch, 2 EL Öl, Salz und Pfeffer in einer Form mischen. 10 Minuten backen.', 'Lachs salzen, auf das Gemüse legen, mit Zitronenscheiben belegen und mit restlichem Öl beträufeln.', 'Weitere 12–15 Minuten garen. Mit Dill bestreuen und mit Reis servieren.']::text[]),
  ('8d92253d-0196-4939-afd3-2a936dd2fa29', 'ofen-suesskartoffel-kichererbsen', 'Ofen-Süßkartoffeln mit Kichererbsen', 'Halbierte Süßkartoffeln, gefüllt mit würzigen Kichererbsen und Tahini-Joghurt.', 'ofen_auflauf', 'vegan', 45, 1, 2, array['Ofen auf 210 °C vorheizen. Süßkartoffeln längs halbieren, mit 1 EL Öl einpinseln und mit der Schnittfläche nach unten 35 Minuten backen.', 'Kichererbsen abtropfen lassen, mit restlichem Öl und Gewürzen mischen und die letzten 20 Minuten mitrösten.', 'Joghurt mit Tahini, Zitronensaft und Salz verrühren.', 'Süßkartoffeln aufbrechen, mit Spinat, Kichererbsen und Tahini-Joghurt füllen.']::text[]),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 'moussaka', 'Moussaka', 'Griechischer Auberginen-Auflauf mit Zimt-Hack und luftiger Béchamelhaube.', 'ofen_auflauf', 'fleisch', 100, 3, 4, array['Auberginen in Scheiben schneiden, salzen und 15 Minuten ziehen lassen. Trocken tupfen, mit Öl bepinseln und im Ofen bei 220 °C 15 Minuten rösten.', 'Kartoffeln in Scheiben schneiden und 8 Minuten vorkochen.', 'Hack mit Zwiebel und Knoblauch anbraten, Tomaten, Zimt und Oregano zugeben und 15 Minuten köcheln.', 'Béchamel aus Butter, Mehl und Milch kochen, vom Herd nehmen, Ei und Hälfte des Parmesans einrühren, mit Muskat würzen.', 'Kartoffeln, Auberginen und Hack schichten, mit Béchamel und Parmesan abschließen und bei 180 °C 45 Minuten backen. 15 Minuten ruhen lassen.']::text[]),
  ('42c7ca93-4ccc-4709-aa8d-612495a92db7', 'zucchini-hack-auflauf', 'Zucchini-Hack-Auflauf', 'Low Carb und herzhaft: Zucchinischeiben, würziges Hack und Mozzarella.', 'ofen_auflauf', 'fleisch', 50, 1, 4, array['Ofen auf 200 °C vorheizen. Zucchini in Scheiben schneiden.', 'Hack im Öl krümelig braten, Zwiebel und Knoblauch mitbraten, passierte Tomaten und Oregano zugeben und 5 Minuten köcheln.', 'Zucchini und Hacksauce in einer Form schichten. Schmand darauf verstreichen.', 'Mit Mozzarella belegen und 30 Minuten backen.']::text[]),
  ('bd62c90c-c16b-48ff-adbe-5f78430dbd2a', 'blumenkohl-kaese-auflauf', 'Blumenkohl-Käse-Auflauf', 'Blumenkohl in würziger Cheddarsauce, knusprig überbacken.', 'ofen_auflauf', 'vegetarisch', 45, 1, 3, array['Blumenkohl in Röschen teilen und 6 Minuten in Salzwasser vorgaren. Ofen auf 200 °C vorheizen.', 'Butter schmelzen, Mehl einrühren und mit Milch zu einer sämigen Sauce kochen. Zwei Drittel des Käses und den Senf einrühren.', 'Blumenkohl in eine Form geben, Sauce darübergießen, mit restlichem Käse und Bröseln bestreuen.', '20 Minuten goldbraun backen.']::text[]),
  ('e26237f2-799e-4e92-a8eb-90de336aef57', 'quiche-lorraine', 'Quiche Lorraine', 'Mürber Boden, Speck, Zwiebeln und ein seidiger Guss aus Eiern und Sahne.', 'ofen_auflauf', 'fleisch', 75, 2, 4, array['Mehl, kalte Butter in Stücken, 1 Ei, eine Prise Salz und 2 EL kaltes Wasser rasch zu einem Teig verkneten. 20 Minuten kühlen.', 'Ofen auf 200 °C vorheizen. Teig ausrollen, eine Tarteform damit auslegen, mehrmals einstechen und 10 Minuten blind backen.', 'Speck und gewürfelte Zwiebeln braten. Restliche Eier mit Sahne, Milch, geriebenem Käse, Muskat, Salz und Pfeffer verquirlen.', 'Speck-Zwiebeln auf dem Boden verteilen, Guss darübergießen und bei 180 °C 30–35 Minuten backen, bis die Mitte gerade gestockt ist.']::text[]),
  ('d942571a-24b9-4633-aa9f-6aec0b6cf6f6', 'spinat-feta-quiche', 'Spinat-Feta-Quiche', 'Würziger Spinat und salziger Feta in einem knusprigen Mürbeteig.', 'ofen_auflauf', 'vegetarisch', 70, 2, 4, array['Mehl, Butter, 1 Ei, Salz und 2 EL Wasser zu einem Mürbeteig kneten und 20 Minuten kühlen.', 'Spinat auftauen und kräftig ausdrücken. Zwiebel und Knoblauch würfeln, kurz andünsten und mit dem Spinat mischen.', 'Ofen auf 200 °C vorheizen. Form mit Teig auslegen und 10 Minuten blind backen.', 'Spinat und zerbröselten Feta auf dem Boden verteilen. Restliche Eier mit Sahne und Gewürzen verquirlen und darübergießen.', 'Bei 180 °C etwa 30 Minuten backen.']::text[]),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 'gemuese-curry-kokos', 'Gemüse-Curry mit Kokosmilch', 'Mildes rotes Curry mit Süßkartoffel, Paprika und Zuckerschoten.', 'pfanne_wok', 'vegan', 30, 1, 3, array['Reis garen. Süßkartoffel in kleine Würfel, Paprika in Streifen, Zwiebel in Spalten schneiden.', 'Zwiebel im Öl anbraten, Currypaste 1 Minute mitrösten.', 'Kokosmilch, Brühe und Süßkartoffel zugeben und 12 Minuten köcheln lassen.', 'Paprika und Zuckerschoten zugeben und 4 Minuten mitgaren. Mit Sojasauce und Limettensaft abschmecken und mit Koriander servieren.']::text[]),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 'haehnchen-curry', 'Cremiges Hähnchen-Curry', 'Zartes Hähnchen in einer milden Tomaten-Sahne-Currysauce, inspiriert von Butter Chicken.', 'pfanne_wok', 'fleisch', 35, 2, 4, array['Hähnchen würfeln und mit Joghurt, der Hälfte der Gewürze und Salz mischen. 10 Minuten ziehen lassen. Reis garen.', 'Zwiebel, Knoblauch und Ingwer fein hacken und in Butter weich dünsten, restliche Gewürze kurz mitrösten.', 'Hähnchen samt Marinade zugeben und 5 Minuten braten.', 'Tomaten und Sahne zugeben und 12 Minuten sanft köcheln lassen. Abschmecken und mit Koriander und Reis servieren.']::text[]),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 'erdnuss-nudeln', 'Asia-Nudeln mit Erdnusssauce', 'Klebrige, würzige Nudeln mit knackigem Gemüse und gerösteten Erdnüssen.', 'pfanne_wok', 'vegan', 20, 1, 2, array['Nudeln nach Packungsangabe einweichen bzw. garen.', 'Erdnussbutter, Sojasauce, Limettensaft, Ahornsirup, gehackten Knoblauch und 4 EL heißes Wasser glatt rühren.', 'Karotte und Paprika in feine Streifen schneiden und im Öl im Wok 3 Minuten braten.', 'Nudeln und Sauce zugeben und gut durchschwenken. Mit Frühlingszwiebeln, gehackten Erdnüssen und Chili servieren.']::text[]),
  ('dcb320f8-b4d5-4aa3-a7b3-bdb10b6bd843', 'gebratene-nudeln-haehnchen', 'Gebratene Nudeln mit Hähnchen', 'Wie vom Lieblingsimbiss: Mie-Nudeln, Hähnchen, Gemüse und würzige Sojasauce.', 'pfanne_wok', 'fleisch', 25, 1, 2, array['Nudeln nach Packungsangabe garen und abtropfen lassen.', 'Hähnchen in dünne Streifen schneiden und im heißen Öl im Wok 4 Minuten braten.', 'Karotte in Streifen, Pak Choi in Stücke schneiden und mit Knoblauch und Ingwer 3 Minuten mitbraten.', 'Nudeln, Sojasauce, Honig und Sesamöl zugeben und kräftig durchschwenken. Mit Frühlingszwiebeln servieren.']::text[]),
  ('729491f1-bad0-457a-a471-31e02e9be634', 'zuercher-geschnetzeltes', 'Geschnetzeltes Zürcher Art', 'Zartes Geschnetzeltes mit Champignons in Rahmsauce – traditionell mit Rösti oder Spätzle.', 'pfanne_wok', 'fleisch', 30, 2, 3, array['Fleisch trocken tupfen, mit Mehl bestäuben und portionsweise im heißen Öl kurz scharf anbraten. Herausnehmen.', 'Zwiebel und Pilze in Butter anbraten, mit Wein ablöschen und etwas einkochen lassen.', 'Sahne zugießen, 3 Minuten köcheln lassen, Fleisch zurückgeben und nur noch erhitzen.', 'Mit Salz, Pfeffer und Petersilie abschmecken. Spätzle erhitzen und dazu servieren.']::text[]),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 'shakshuka', 'Shakshuka', 'In würziger Paprika-Tomatensauce pochierte Eier – großartig mit frischem Brot.', 'pfanne_wok', 'vegetarisch', 30, 1, 2, array['Zwiebel und Paprika würfeln und im Öl 6 Minuten weich braten. Knoblauch und Gewürze kurz mitrösten.', 'Tomaten zugeben, salzen und 10 Minuten einköcheln lassen.', 'Vier Mulden in die Sauce drücken, Eier hineinschlagen und zugedeckt 6–8 Minuten stocken lassen.', 'Mit Feta und Petersilie bestreuen und direkt aus der Pfanne mit Brot servieren.']::text[]),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 'tofu-teriyaki-pfanne', 'Tofu-Gemüse-Pfanne Teriyaki', 'Knuspriger Tofu und buntes Gemüse in glänzender Teriyakisauce.', 'pfanne_wok', 'vegan', 25, 1, 2, array['Reis garen. Tofu trocken tupfen, würfeln, mit 1 TL Stärke bestäuben und im Öl rundum knusprig braten. Herausnehmen.', 'Gemüse klein schneiden und in derselben Pfanne 5 Minuten bissfest braten.', 'Sojasauce, Ahornsirup, geriebenen Ingwer, Knoblauch, restliche Stärke und 4 EL Wasser verrühren, zugießen und aufkochen.', 'Tofu unterheben, mit Sesam bestreuen und mit Reis servieren.']::text[]),
  ('df8c38ce-af05-40fb-a9d8-c285ee4775fa', 'knoblauch-chili-garnelen', 'Knoblauch-Chili-Garnelen', 'In Olivenöl gebratene Garnelen mit viel Knoblauch – dazu Baguette zum Tunken.', 'pfanne_wok', 'fisch', 15, 1, 2, array['Knoblauch in Scheiben, Chili in Ringe schneiden.', 'Öl in einer Pfanne erhitzen, Knoblauch und Chili 1 Minute anschwitzen.', 'Garnelen zugeben und 2–3 Minuten braten, bis sie rosa sind. Salzen.', 'Mit Zitronensaft und Petersilie vollenden und mit Baguette servieren.']::text[]),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 'pad-thai-tofu', 'Pad Thai mit Tofu', 'Thailändische Reisnudeln mit Ei, Tofu, Limette und Erdnüssen.', 'pfanne_wok', 'vegetarisch', 30, 2, 2, array['Reisnudeln in heißem Wasser einweichen, bis sie weich, aber noch bissfest sind. Abgießen.', 'Sojasauce, Zucker, Limettensaft, Tomatenmark und 3 EL Wasser verrühren.', 'Tofu würfeln und im Öl im Wok goldbraun braten. Knoblauch zugeben, dann an den Rand schieben und die Eier darin verrühren.', 'Nudeln und Sauce zugeben und 2–3 Minuten schwenken. Mit Frühlingszwiebeln, gehackten Erdnüssen, Koriander und Chili servieren.']::text[]),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 'frikadellen-gurkensalat', 'Frikadellen mit Gurkensalat', 'Saftige Frikadellen nach Hausmacherart mit frischem Dill-Gurkensalat.', 'pfanne_wok', 'fleisch', 35, 1, 4, array['Brötchen in Wasser einweichen und gut ausdrücken. Zwiebel fein würfeln.', 'Hack mit Brötchen, Zwiebel, Ei, Senf, Majoran, Salz und Pfeffer verkneten und zu 8 Frikadellen formen.', 'Im Öl bei mittlerer Hitze von jeder Seite 5–6 Minuten braten.', 'Gurke hobeln, mit Joghurt, Essig, Dill, Salz und Pfeffer mischen und dazu servieren.']::text[]),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 'chana-masala', 'Kichererbsen-Curry (Chana Masala)', 'Nordindisches Kichererbsen-Curry mit Tomaten, Ingwer und Garam Masala.', 'pfanne_wok', 'vegan', 30, 1, 3, array['Reis garen. Zwiebeln fein würfeln und im Öl 8 Minuten goldbraun braten.', 'Knoblauch und Ingwer fein hacken, mit allen Gewürzen 1 Minute mitrösten.', 'Tomaten und abgespülte Kichererbsen zugeben, mit 150 ml Wasser auffüllen und 15 Minuten köcheln lassen.', 'Einige Kichererbsen zerdrücken, damit die Sauce bindet. Mit Zitronensaft, Salz und Koriander abschmecken.']::text[]),
  ('8db737dd-29eb-4b03-aa55-ff46ae1c15e5', 'schnitzel-wiener-art', 'Schnitzel Wiener Art', 'Hauchdünn geklopft, goldbraun paniert, dazu Zitrone und Gurkensalat oder Pommes.', 'pfanne_wok', 'fleisch', 30, 2, 4, array['Schnitzel zwischen Frischhaltefolie dünn klopfen, salzen und pfeffern.', 'Mehl, verquirlte Eier und Semmelbrösel in drei tiefe Teller geben. Schnitzel nacheinander darin wenden, die Panade nicht andrücken.', 'Öl und Butter in einer großen Pfanne erhitzen. Schnitzel schwimmend von jeder Seite 2–3 Minuten goldbraun backen, dabei die Pfanne schwenken, damit die Panade souffliert.', 'Auf Küchenpapier abtropfen lassen und mit Zitronenspalten servieren.']::text[]),
  ('a79d5cd5-520c-43b0-ae6c-82a0ee21c7d1', 'pilzpfanne-semmelknoedel', 'Rahmpilze mit gebratenen Knödeln', 'Champignons in Rahmsauce mit in Scheiben gebratenen Semmelknödeln aus Brötchen vom Vortag.', 'pfanne_wok', 'vegetarisch', 45, 2, 3, array['Brötchen klein würfeln, mit warmer Milch übergießen und 10 Minuten ziehen lassen. Eine Zwiebel würfeln und in etwas Butter anschwitzen.', 'Mit Eiern, der Hälfte der Petersilie, Salz und Muskat zur Brötchenmasse geben, verkneten und zu zwei Rollen formen. In Frischhaltefolie wickeln und 20 Minuten in siedendem Wasser garen.', 'Pilze in Scheiben schneiden und mit der zweiten gewürfelten Zwiebel in Butter kräftig braten. Sahne zugeben und sämig einkochen.', 'Knödelrollen in Scheiben schneiden und in einer Pfanne goldbraun braten. Mit Rahmpilzen und Petersilie servieren.']::text[]),
  ('48ea8a50-a4e3-4f84-ad8a-5fe69592a08b', 'fisch-zitronenbutter', 'Fischfilet in Zitronenbutter', 'Gebratenes Fischfilet mit Kapern-Zitronenbutter, Petersilienkartoffeln und Erbsen.', 'pfanne_wok', 'fisch', 25, 1, 2, array['Kartoffeln schälen und in Salzwasser 20 Minuten garen. Erbsen die letzten 3 Minuten mitgaren.', 'Fisch trocken tupfen, salzen, in Mehl wenden und im Öl von jeder Seite 2–3 Minuten braten. Herausnehmen.', 'Butter in der Pfanne aufschäumen lassen, Kapern und Zitronensaft zugeben.', 'Kartoffeln mit Petersilie schwenken und mit Fisch und Erbsen anrichten. Zitronenbutter darüberträufeln.']::text[]),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 'ratatouille', 'Ratatouille', 'Provenzalisches Schmorgemüse mit Kräutern – schmeckt aufgewärmt sogar noch besser.', 'pfanne_wok', 'vegan', 50, 1, 4, array['Gemüse in gleich große Würfel schneiden.', 'Aubergine im Öl 5 Minuten anbraten, dann Zwiebel, Paprika und Zucchini zugeben und weitere 5 Minuten braten.', 'Knoblauch, Tomaten und Kräuter zugeben und zugedeckt bei kleiner Hitze 25 Minuten schmoren.', 'Abschmecken, mit Basilikum bestreuen und mit Baguette servieren.']::text[]),
  ('7bc39229-ea6f-47cb-afb4-2498ce164597', 'kartoffelgratin', 'Kartoffelgratin', 'Dünne Kartoffelscheiben in Knoblauchsahne, goldbraun und butterzart gebacken.', 'kartoffeln', 'vegetarisch', 70, 1, 4, array['Ofen auf 180 °C vorheizen. Eine Form mit Butter einfetten und mit der halbierten Knoblauchzehe ausreiben.', 'Kartoffeln schälen und in 2–3 mm dünne Scheiben hobeln.', 'Sahne und Milch mit Salz, Pfeffer, Muskat und Thymian aufkochen, Kartoffeln zugeben und 5 Minuten köcheln lassen.', 'In die Form füllen, mit Käse bestreuen und 45 Minuten backen, bis die Kartoffeln weich sind.']::text[]),
  ('1be4808c-d2dd-43e7-a5c0-5f539682f3b0', 'bratkartoffeln-spiegelei', 'Bratkartoffeln mit Spiegelei', 'Knusprige Bratkartoffeln mit Zwiebeln, dazu Spiegeleier und Gewürzgurken.', 'kartoffeln', 'vegetarisch', 30, 1, 2, array['Gekochte Kartoffeln pellen und in Scheiben schneiden. Zwiebel würfeln.', 'Kartoffeln im Öl in einer großen Pfanne bei mittlerer Hitze 10 Minuten braten, ohne sie zu oft zu wenden.', 'Zwiebeln zugeben und weitere 5 Minuten braten, bis alles knusprig ist. Mit Salz, Pfeffer und Majoran würzen.', 'In einer zweiten Pfanne Spiegeleier in Butter braten. Mit Schnittlauch und Gurken servieren.']::text[]),
  ('7795ac46-0509-467c-a56f-19d45c159e14', 'kartoffelpuffer-apfelmus', 'Kartoffelpuffer mit Apfelmus', 'Außen knusprig, innen weich – Reibekuchen wie vom Weihnachtsmarkt.', 'kartoffeln', 'vegetarisch', 35, 2, 3, array['Kartoffeln schälen und mit der Zwiebel fein reiben. In einem Tuch kräftig ausdrücken.', 'Mit Eiern, Mehl, Salz und Muskat zu einem Teig vermengen.', 'Öl in einer Pfanne erhitzen, pro Puffer 2 EL Teig hineingeben, flach drücken und von jeder Seite 3–4 Minuten goldbraun backen.', 'Auf Küchenpapier abtropfen lassen und mit Apfelmus servieren.']::text[]),
  ('4799915c-7279-4a57-a2cf-2642853cbaf6', 'ofenkartoffel-kraeuterquark', 'Ofenkartoffeln mit Kräuterquark', 'Große Kartoffeln aus dem Ofen mit einem cremigen Quark voller frischer Kräuter.', 'kartoffeln', 'vegetarisch', 60, 1, 2, array['Ofen auf 200 °C vorheizen. Kartoffeln waschen, mehrfach einstechen, mit Öl und Salz einreiben und 50 Minuten backen.', 'Quark mit Joghurt, gehackten Kräutern, gepresstem Knoblauch, Salz und Pfeffer cremig rühren.', 'Radieschen in Scheiben schneiden.', 'Kartoffeln kreuzweise einschneiden, auseinanderdrücken und mit Kräuterquark und Radieschen füllen.']::text[]),
  ('e69284bd-c68e-4b7c-abc7-9d01a21d8bdb', 'rosmarin-kartoffelpfanne', 'Rosmarin-Kartoffelpfanne mit Gemüse', 'Goldene Kartoffeln mit Paprika, Zucchini und Rosmarin – unkompliziert und vegan.', 'kartoffeln', 'vegan', 35, 1, 2, array['Kartoffeln in kleine Würfel schneiden und 5 Minuten in Salzwasser vorgaren. Gut abtropfen lassen.', 'Im Öl in einer großen Pfanne 10 Minuten knusprig braten.', 'Gemüse würfeln, mit Knoblauch und Rosmarin zugeben und weitere 8 Minuten braten.', 'Mit Paprikapulver, Salz und Pfeffer abschmecken.']::text[]),
  ('ace22d59-1919-44b5-a7c7-fbf5646efb1b', 'schupfnudeln-sauerkraut', 'Schupfnudeln mit Sauerkraut', 'Gebratene Schupfnudeln mit Sauerkraut und Zwiebeln – herzhaft und schnell.', 'kartoffeln', 'vegetarisch', 25, 1, 3, array['Zwiebel in Streifen schneiden und in der Hälfte der Butter glasig dünsten.', 'Sauerkraut abtropfen lassen, mit Kümmel zugeben und 8 Minuten mitdünsten.', 'In einer zweiten Pfanne Schupfnudeln in der restlichen Butter goldbraun braten.', 'Alles mischen, abschmecken und mit Schmand und Petersilie servieren.']::text[]),
  ('d2ab625a-a61a-4c6d-a497-64ab8d0589cc', 'kartoffel-spinat-curry', 'Kartoffel-Spinat-Curry', 'Inspiriert von Saag Aloo: zarte Kartoffeln mit Spinat in einer duftenden Gewürzsauce.', 'kartoffeln', 'vegan', 35, 1, 3, array['Kartoffeln schälen und in 2 cm große Würfel schneiden. Zwiebel, Knoblauch und Ingwer fein hacken.', 'Zwiebel im Öl goldgelb braten, Knoblauch, Ingwer und Gewürze 1 Minute mitrösten.', 'Kartoffeln, Tomaten und Kokosmilch zugeben und zugedeckt 20 Minuten köcheln lassen.', 'Spinat unterheben, zusammenfallen lassen und mit Salz abschmecken.']::text[]),
  ('85ef3088-d938-411a-a75e-aa7c469a93a6', 'pellkartoffeln-quark-leinoel', 'Pellkartoffeln mit Quark', 'Ein schlichter Klassiker aus der Lausitz: Pellkartoffeln, Kräuterquark und Gurke.', 'kartoffeln', 'vegetarisch', 30, 1, 2, array['Kartoffeln mit Schale in Salzwasser etwa 20–25 Minuten garen.', 'Quark mit Milch glatt rühren, fein gewürfelte Zwiebel und Schnittlauch unterrühren, salzen und pfeffern.', 'Gurke in Scheiben schneiden.', 'Kartoffeln pellen und mit Quark, einem Schuss Öl und Gurke servieren.']::text[]),
  ('e5daa9b3-5488-4144-a392-69dbc609d972', 'bauernfruehstueck', 'Bauernfrühstück', 'Bratkartoffeln, Speck und Ei in einer Pfanne – deftig und schnell.', 'kartoffeln', 'fleisch', 30, 1, 2, array['Kartoffeln in Scheiben schneiden und im Öl 10 Minuten knusprig braten.', 'Speck und gewürfelte Zwiebel zugeben und 4 Minuten mitbraten.', 'Eier mit Milch, Salz und Pfeffer verquirlen, über die Kartoffeln gießen und bei mittlerer Hitze stocken lassen.', 'Mit Schnittlauch bestreuen und mit Gewürzgurken servieren.']::text[]),
  ('9e5f7bf0-b436-47f3-aeea-d1f34f734cf2', 'roesti-raeucherlachs', 'Rösti mit Räucherlachs', 'Knusprige Kartoffelrösti mit Räucherlachs, Dill-Schmand und Zitrone.', 'kartoffeln', 'fisch', 35, 2, 2, array['Kartoffeln schälen, grob raspeln, gut ausdrücken und salzen.', 'Öl und Butter in einer Pfanne erhitzen, die Masse zu 4 flachen Rösti formen und von jeder Seite 6–7 Minuten goldbraun braten.', 'Schmand mit gehacktem Dill, Zitronensaft, Salz und Pfeffer verrühren.', 'Rösti mit Lachs und Dill-Schmand anrichten.']::text[]),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 'kartoffelpueree-bratwurst', 'Kartoffelpüree mit Bratwurst und Zwiebelsauce', 'Cremiges Püree, gebräunte Bratwurst und eine dunkle Zwiebelsauce – deutsche Hausmannskost.', 'kartoffeln', 'fleisch', 35, 1, 4, array['Kartoffeln schälen, würfeln und in Salzwasser 20 Minuten weich kochen.', 'Bratwürste im Öl rundum braun braten und warm halten. Zwiebeln in Ringe schneiden und im Bratfett 8 Minuten bräunen.', 'Mehl über die Zwiebeln stäuben, mit Brühe ablöschen, Senf einrühren und 5 Minuten sämig köcheln.', 'Kartoffeln abgießen, mit warmer Milch und Butter zu Püree stampfen und mit Muskat und Salz würzen.']::text[]),
  ('83f998f8-24cf-410d-a0d1-d38f29f566ec', 'suesskartoffel-pommes-dip', 'Süßkartoffel-Pommes mit Avocado-Dip', 'Ofen-Pommes aus Süßkartoffeln mit cremigem Limetten-Avocado-Dip.', 'kartoffeln', 'vegan', 40, 1, 2, array['Ofen auf 220 °C Umluft vorheizen. Süßkartoffeln in gleichmäßige Stifte schneiden.', 'Mit Stärke bestäuben, dann mit Öl, Paprikapulver und Salz mischen.', 'Mit Abstand auf einem Blech verteilen und 25–30 Minuten backen, nach der Hälfte wenden.', 'Avocado mit Limettensaft, Knoblauch, Koriander und Salz zerdrücken und zu den Pommes servieren.']::text[]),
  ('b64ec92a-d350-4db5-a8cf-e6685ca32251', 'stampfkartoffeln-fischstaebchen', 'Erbsenstampf mit Fischstäbchen', 'Kinderliebling mit Upgrade: Kartoffel-Erbsen-Stampf und knusprige Fischstäbchen.', 'kartoffeln', 'fisch', 30, 1, 3, array['Kartoffeln schälen, würfeln und in Salzwasser 15 Minuten garen. Erbsen die letzten 4 Minuten mitkochen.', 'Fischstäbchen im Öl von jeder Seite 3–4 Minuten knusprig braten.', 'Kartoffeln und Erbsen abgießen und mit Milch und Butter grob stampfen. Mit Muskat, Salz und Pfeffer würzen.', 'Mit Fischstäbchen und Zitronenspalten servieren.']::text[]),
  ('a02f6e58-c801-4a44-a342-86468409197a', 'gefuellte-kartoffeln-brokkoli', 'Gefüllte Kartoffeln mit Brokkoli und Käse', 'Ausgehöhlte Ofenkartoffeln, gefüllt mit Brokkoli, Frischkäse und Cheddar.', 'kartoffeln', 'vegetarisch', 65, 2, 2, array['Ofen auf 200 °C vorheizen. Kartoffeln mit Öl einreiben, einstechen und 45 Minuten backen.', 'Brokkoli in kleine Röschen teilen und 4 Minuten in Salzwasser garen.', 'Kartoffeln längs halbieren, aushöhlen und das Innere mit Frischkäse, Brokkoli, Frühlingszwiebeln, Salz und Pfeffer vermengen.', 'Masse zurück in die Schalen füllen, mit Cheddar bestreuen und 10 Minuten überbacken.']::text[]),
  ('6b8c2c71-0a53-4ef9-a10a-dd6cece626d4', 'flammkuchen-klassisch', 'Flammkuchen Elsässer Art', 'Hauchdünn und knusprig mit Schmand, Speck und Zwiebeln.', 'brot_snacks', 'fleisch', 25, 1, 2, array['Ofen auf höchster Stufe (mind. 230 °C) vorheizen.', 'Teig samt Backpapier auf ein Blech legen. Schmand mit Salz, Pfeffer und Muskat verrühren und dünn darauf verstreichen.', 'Zwiebeln in sehr feine Ringe schneiden und mit dem Speck darauf verteilen.', '10–12 Minuten backen, bis der Rand knusprig braun ist.']::text[]),
  ('68f98118-03b5-41f7-a8e2-0478f10b03cc', 'flammkuchen-ziegenkaese', 'Flammkuchen mit Ziegenkäse und Honig', 'Vegetarische Variante mit Ziegenkäse, roten Zwiebeln, Walnüssen und einem Hauch Honig.', 'brot_snacks', 'vegetarisch', 25, 1, 2, array['Ofen auf höchster Stufe vorheizen.', 'Teig ausbreiten, mit gewürzter Crème fraîche bestreichen.', 'Zwiebel in feine Ringe schneiden, mit zerbröseltem Ziegenkäse, Walnüssen und Thymian verteilen.', '10–12 Minuten backen, mit Honig beträufeln und mit Rucola belegen.']::text[]),
  ('dd3dc1af-4b12-4c5a-abb2-91ca7abe22de', 'pizza-margherita', 'Pizza Margherita', 'Selbst gemachter Hefeteig, fruchtige Tomatensauce und Mozzarella – Pizzaabend!', 'brot_snacks', 'vegetarisch', 90, 2, 2, array['Mehl, Hefe, Salz, Wasser und 1 EL Öl 8 Minuten zu einem glatten Teig kneten. Zugedeckt 1 Stunde gehen lassen.', 'Ofen mit Blech auf 250 °C vorheizen. Passierte Tomaten mit Oregano, Salz und restlichem Öl verrühren.', 'Teig halbieren, dünn ausrollen und auf Backpapier legen. Mit Sauce bestreichen und mit zerzupftem Mozzarella belegen.', 'Auf dem heißen Blech 8–10 Minuten backen. Mit Basilikum servieren.']::text[]),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 'haehnchen-wraps', 'Hähnchen-Wraps mit Joghurtsauce', 'Würzige Hähnchenstreifen, knackiger Salat und Knoblauch-Joghurt im warmen Wrap.', 'brot_snacks', 'fleisch', 25, 1, 2, array['Hähnchen in Streifen schneiden, mit Gewürzen, Salz und Pfeffer mischen und im Öl 6 Minuten braten.', 'Joghurt mit gepresstem Knoblauch und Salz verrühren. Salat, Tomaten und Gurke schneiden.', 'Tortillas in einer trockenen Pfanne kurz erwärmen.', 'Mit Sauce bestreichen, mit Salat, Gemüse und Hähnchen belegen und fest einrollen.']::text[]),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 'falafel-wraps', 'Ofen-Falafel im Wrap', 'Falafel aus Dosen-Kichererbsen, im Ofen gebacken, mit Tahini-Sauce und Gemüse.', 'brot_snacks', 'vegan', 40, 2, 2, array['Ofen auf 200 °C vorheizen. Kichererbsen gut abtropfen lassen und trocken tupfen.', 'Mit Zwiebel, Knoblauch, Petersilie, Kreuzkümmel, Mehl, Backpulver und Salz im Mixer zu einer groben Masse verarbeiten.', '12 kleine Bällchen formen, flach drücken, mit Öl bepinseln und 20 Minuten backen, nach der Hälfte wenden.', 'Tahini mit Zitronensaft, Salz und Wasser cremig rühren. Wraps mit Salat, Tomaten, Falafel und Sauce füllen.']::text[]),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 'burger-klassisch', 'Klassischer Cheeseburger', 'Saftiges Rindfleisch-Patty, geschmolzener Cheddar und eine schnelle Burgersauce.', 'brot_snacks', 'fleisch', 30, 2, 4, array['Hack nur kurz zu 4 flachen Patties formen, die etwas größer als die Brötchen sind. Erst kurz vor dem Braten salzen und pfeffern.', 'Mayonnaise, Ketchup, Senf und fein gehackte Gurke zu einer Sauce verrühren.', 'Patties in einer sehr heißen Pfanne mit wenig Öl von jeder Seite 3 Minuten braten. Käse in der letzten Minute darauflegen.', 'Brötchen anrösten und mit Sauce, Salat, Tomate, Zwiebel und Patty belegen.']::text[]),
  ('988ba92d-0d38-4d29-a74f-ff6337646d1d', 'quesadillas-bohnen', 'Quesadillas mit Bohnen und Mais', 'Knusprig gebratene Tortillas mit schmelzendem Käse, Bohnen und Mais.', 'brot_snacks', 'vegetarisch', 20, 1, 2, array['Bohnen abspülen und grob zerdrücken, mit Mais, gewürfelter Paprika, Kreuzkümmel und Salz mischen.', 'Je eine Tortillahälfte mit Käse und Füllung belegen, zuklappen.', 'In einer trockenen Pfanne von jeder Seite 2–3 Minuten knusprig braten, bis der Käse schmilzt.', 'In Ecken schneiden und mit Schmand, Limette und Koriander servieren.']::text[]),
  ('a26f6461-e1db-432c-ada3-aeb2fa7b1669', 'croque-monsieur', 'Croque Monsieur', 'Das Pariser Bistro-Sandwich mit Schinken, Käse und Béchamel.', 'brot_snacks', 'fleisch', 20, 1, 2, array['Ofengrill auf 220 °C vorheizen. Butter schmelzen, Mehl einrühren, Milch zugießen und zu einer dicken Béchamel kochen. Mit Salz und Muskat würzen.', 'Zwei Toastscheiben mit Senf bestreichen, mit Schinken und der Hälfte des Käses belegen und mit den anderen Scheiben bedecken.', 'Béchamel obenauf streichen, mit restlichem Käse bestreuen.', '6–8 Minuten überbacken, bis der Käse blubbert.']::text[]),
  ('d251b073-1e53-4560-a8a9-b7cd3a4ae000', 'bruschetta', 'Bruschetta mit Tomaten', 'Geröstetes Brot mit Knoblauch, marinierten Tomaten und Basilikum.', 'brot_snacks', 'vegan', 15, 1, 2, array['Tomaten entkernen und fein würfeln, mit 2 EL Öl, Balsamico, gehacktem Basilikum, Salz und Pfeffer mischen.', 'Baguette schräg in Scheiben schneiden und im Ofen oder in der Pfanne goldbraun rösten.', 'Brotscheiben mit der halbierten Knoblauchzehe einreiben und mit restlichem Öl beträufeln.', 'Tomaten darauf verteilen und sofort servieren.']::text[]),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 'tacos-hackfleisch', 'Tacos mit Hackfleisch', 'Würziges Taco-Hack, frische Salsa und Schmand in warmen Tortillas.', 'brot_snacks', 'fleisch', 30, 1, 4, array['Hack im Öl krümelig braten, Zwiebel und Knoblauch mitbraten. Tomatenmark, Gewürze und 50 ml Wasser zugeben und 5 Minuten schmoren.', 'Tomaten und rote Zwiebel fein würfeln und mit Limettensaft und Salz zu einer Salsa mischen.', 'Tortillas kurz in einer trockenen Pfanne erwärmen.', 'Mit Salat, Hack, Salsa, Käse und Schmand füllen.']::text[]),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 'linsen-burger', 'Linsen-Burger', 'Würzige Patties aus roten Linsen und Haferflocken – vegan und richtig saftig.', 'brot_snacks', 'vegan', 45, 2, 4, array['Linsen in 300 ml Wasser 12 Minuten weich kochen, bis das Wasser aufgesogen ist. Abkühlen lassen.', 'Karotte fein raspeln, Zwiebel und Knoblauch fein würfeln und kurz anbraten.', 'Linsen mit Gemüse, Haferflocken, Tomatenmark, Senf und Gewürzen verkneten. 10 Minuten quellen lassen und 4 Patties formen.', 'Im Öl von jeder Seite 4 Minuten braten. Brötchen mit Ketchup, Salat, Tomate und Patty belegen.']::text[]),
  ('b8f78835-dc33-45b1-a552-e5a6be424d8d', 'avocado-toast-ei', 'Avocado-Toast mit pochiertem Ei', 'Cremige Avocado, Chili und ein perfekt pochiertes Ei auf knusprigem Brot.', 'brot_snacks', 'vegetarisch', 15, 2, 2, array['Wasser mit Essig aufkochen und auf kleine Hitze schalten, sodass es nur noch simmert.', 'Eier einzeln in eine Tasse schlagen, mit einem Strudel ins Wasser gleiten lassen und 3–4 Minuten pochieren.', 'Brot toasten. Avocado mit Zitronensaft, Salz und Pfeffer zerdrücken und aufstreichen.', 'Mit Radieschenscheiben, Ei und Chiliflocken belegen.']::text[]),
  ('dd2209a0-39b0-41c1-a54d-86bfb7eb5386', 'pita-halloumi', 'Pita mit Halloumi und Gemüse', 'Gegrillter Halloumi, Paprika und Minz-Joghurt in warmem Pitabrot.', 'brot_snacks', 'vegetarisch', 20, 1, 2, array['Paprika und Zucchini in Streifen schneiden und im Öl 5 Minuten braten. Salzen.', 'Halloumi in Scheiben schneiden und in derselben Pfanne von jeder Seite 2 Minuten goldbraun braten.', 'Joghurt mit gehackter Minze, Zitronensaft, Salz und Pfeffer verrühren.', 'Pita aufbacken, aufschneiden und mit Gemüse, Tomate, Halloumi und Joghurt füllen.']::text[]),
  ('499bffa1-8e46-4876-a269-a47bb060447c', 'strammer-max', 'Strammer Max', 'Bauernbrot, Schinken und Spiegelei – in zehn Minuten satt und glücklich.', 'brot_snacks', 'fleisch', 10, 1, 2, array['Brot dünn mit Butter bestreichen und mit Schinken belegen.', 'Restliche Butter in einer Pfanne erhitzen und zwei Spiegeleier braten. Salzen und pfeffern.', 'Eier auf die Brote setzen, mit Schnittlauch bestreuen und mit Gurken servieren.']::text[]),
  ('27467d7d-e902-43cc-a9f8-f3b4e1505e9a', 'pfannkuchen', 'Pfannkuchen', 'Dünne, goldene Pfannkuchen – süß mit Zimtzucker oder herzhaft gefüllt.', 'fruehstueck_suesses', 'vegetarisch', 25, 1, 3, array['Mehl, Milch, Eier, Zucker und Salz zu einem glatten Teig verquirlen und 10 Minuten ruhen lassen.', 'Etwas Butter in einer Pfanne erhitzen, eine Kelle Teig hineingeben und durch Schwenken verteilen.', 'Von jeder Seite 1–2 Minuten goldbraun backen. So fortfahren, bis der Teig aufgebraucht ist.', 'Mit Zimtzucker und Apfelmus servieren.']::text[]),
  ('f71432dc-eef3-457a-a06d-bf2b20430c4a', 'kaiserschmarrn', 'Kaiserschmarrn', 'Fluffig, karamellisiert und in Stücke gerissen – mit Puderzucker und Apfelmus.', 'fruehstueck_suesses', 'vegetarisch', 30, 2, 2, array['Eier trennen. Eigelb mit Mehl, Milch, Vanillezucker und Salz glatt rühren. Eiweiß mit 1 EL Zucker steif schlagen und unterheben.', 'Die Hälfte der Butter in einer großen Pfanne schmelzen, Teig hineingeben, Rosinen darüberstreuen und bei mittlerer Hitze 5 Minuten stocken lassen.', 'Vierteln, wenden und weitere 3 Minuten backen. Mit zwei Gabeln in Stücke reißen.', 'Restliche Butter und Zucker zugeben und unter Wenden karamellisieren. Mit Puderzucker und Apfelmus servieren.']::text[]),
  ('dcbab098-d901-42a5-aa05-3fb7d2705c9e', 'milchreis-zimt', 'Milchreis mit Zimt und Kirschen', 'Cremig gekocht, mit Zimtzucker und warmen Sauerkirschen.', 'fruehstueck_suesses', 'vegetarisch', 40, 1, 3, array['Milch mit Butter, 2 EL Zucker, Vanillezucker und Salz aufkochen. Reis einrühren.', 'Bei kleinster Hitze 30 Minuten quellen lassen, gelegentlich umrühren.', 'Kirschen mit Saft erhitzen, mit in wenig Wasser angerührter Stärke binden.', 'Restlichen Zucker mit Zimt mischen und den Milchreis mit Zimtzucker und Kirschen servieren.']::text[]),
  ('d7cd68a1-1b37-4798-a61f-bb071ea0a0e1', 'arme-ritter', 'Arme Ritter', 'In Eiermilch getränktes Brot, goldbraun gebraten – die beste Brotresteverwertung.', 'fruehstueck_suesses', 'vegetarisch', 20, 1, 2, array['Eier, Milch und Vanillezucker verquirlen. Zucker mit Zimt mischen.', 'Brotscheiben kurz in der Eiermilch wenden.', 'In Butter von jeder Seite 2–3 Minuten goldbraun braten.', 'In Zimtzucker wenden und mit aufgetauten Beeren servieren.']::text[]),
  ('b28cfcad-45a0-4f9b-a5c1-3d0a55e66109', 'ruehrei-schnittlauch', 'Cremiges Rührei mit Schnittlauch', 'Langsam gegart, weich und cremig – dazu frisches Brot.', 'fruehstueck_suesses', 'vegetarisch', 10, 1, 2, array['Eier mit Milch, Salz und Pfeffer verquirlen.', 'Butter bei schwacher Hitze schmelzen, Eier zugeben und mit einem Spatel langsam zu großen, weichen Flocken schieben.', 'Vom Herd nehmen, solange das Ei noch leicht glänzt.', 'Mit Schnittlauch bestreuen und mit Brot und Tomaten servieren.']::text[]),
  ('416343ee-ad35-42fc-a036-48f4eae155b8', 'porridge-apfel', 'Apfel-Zimt-Porridge', 'Warmer Haferbrei mit Apfel, Zimt und gerösteten Walnüssen.', 'fruehstueck_suesses', 'vegan', 10, 1, 2, array['Haferflocken mit Haferdrink, Salz und Zimt aufkochen und 5 Minuten unter Rühren köcheln lassen.', 'Apfel reiben und die Hälfte unterrühren.', 'Walnüsse grob hacken und ohne Fett rösten.', 'Porridge mit restlichem Apfel, Nüssen und Ahornsirup servieren.']::text[]),
  ('23e3934b-9e1f-4c5c-a062-dc3737a70202', 'griessbrei-kirschen', 'Grießbrei mit Kirschen', 'Kindheitserinnerung in der Schüssel: cremiger Grießbrei mit Kirschkompott.', 'fruehstueck_suesses', 'vegetarisch', 20, 1, 3, array['Milch mit Zucker, Vanillezucker, Butter und Salz aufkochen. Grieß einrieseln lassen und 5 Minuten unter Rühren quellen lassen.', 'Vom Herd nehmen, Eigelb unterrühren. Eiweiß steif schlagen und unterheben.', 'Kirschen mit Saft erhitzen und mit angerührter Stärke binden.', 'Grießbrei mit warmen Kirschen servieren.']::text[]),
  ('632b1350-753c-4f91-abeb-29702bd3e801', 'gemuese-omelette', 'Gemüse-Omelette', 'Fluffiges Omelette mit Paprika, Spinat und Käse – schnelles Abendessen.', 'fruehstueck_suesses', 'vegetarisch', 15, 1, 2, array['Paprika würfeln, Frühlingszwiebeln in Ringe schneiden. Eier mit Milch, Salz und Pfeffer verquirlen.', 'Gemüse in der Butter 3 Minuten anbraten, Spinat kurz zusammenfallen lassen.', 'Eier darübergießen und bei mittlerer Hitze stocken lassen, dabei die Ränder gelegentlich zur Mitte schieben.', 'Käse darüberstreuen, Omelette zusammenklappen und halbiert servieren.']::text[]),
  ('2892bfe1-7b30-4621-a92f-fe45f0bdddff', 'apfelpfannkuchen', 'Apfelpfannkuchen', 'Dicke Pfannkuchen mit eingebackenen Apfelscheiben und Zimtzucker.', 'fruehstueck_suesses', 'vegetarisch', 30, 1, 3, array['Mehl, Backpulver, Milch, Eier, 1 EL Zucker und Salz zu einem dickflüssigen Teig rühren.', 'Äpfel schälen, entkernen und in dünne Scheiben schneiden.', 'Etwas Butter in einer Pfanne erhitzen, einige Apfelscheiben hineinlegen und mit Teig übergießen.', 'Bei mittlerer Hitze von jeder Seite 3 Minuten backen. Restlichen Zucker mit Zimt mischen und darüberstreuen.']::text[]),
  ('56a8a994-e5b1-4fca-a5c3-3c1f18d4de94', 'dampfnudeln', 'Dampfnudeln mit Vanillesauce', 'Fluffige Hefeklöße mit Salzkruste und warmer Vanillesauce – Wochenendprojekt.', 'fruehstueck_suesses', 'vegetarisch', 120, 3, 4, array['Mehl, Hefe, 250 ml lauwarme Milch, 2 EL Zucker, 1 Ei, 50 g weiche Butter und eine Prise Salz zu einem glatten Teig kneten. 1 Stunde gehen lassen.', 'Teig in 8 Stücke teilen, zu Kugeln formen und zugedeckt weitere 15 Minuten gehen lassen.', 'In einem breiten Topf mit Deckel restliche Butter, 100 ml Milch und 1 TL Salz erhitzen. Klöße hineinsetzen und mit geschlossenem Deckel bei mittlerer Hitze 25 Minuten garen. Deckel nicht öffnen!', 'Für die Sauce restliche Milch mit Vanillezucker und Zucker aufkochen, mit Stärke und Eigelb binden.', 'Dampfnudeln mit der knusprigen Unterseite nach oben mit Vanillesauce servieren.']::text[]),
  ('94625f52-6ada-4e7a-a624-3f61a2884f97', 'waffeln', 'Knusprige Waffeln', 'Klassische Waffeln mit heißen Beeren – ein Fest für Sonntagnachmittage.', 'fruehstueck_suesses', 'vegetarisch', 30, 1, 4, array['Weiche Butter mit Zucker und Vanillezucker cremig rühren, Eier nacheinander unterrühren.', 'Mehl mit Backpulver und Salz mischen und abwechselnd mit der Milch unterrühren.', 'Waffeleisen vorheizen, leicht fetten und den Teig portionsweise goldbraun backen.', 'Beeren in einem Topf erhitzen und mit den Waffeln und Puderzucker servieren.']::text[]),
  ('493b05e3-8edd-4eeb-a107-5554f1b97457', 'quarkkeulchen', 'Quarkkeulchen', 'Sächsische Kartoffel-Quark-Plätzchen, in Butter gebraten, mit Zimtzucker und Apfelmus.', 'fruehstueck_suesses', 'vegetarisch', 45, 2, 3, array['Gekochte, abgekühlte Kartoffeln fein reiben oder durchpressen.', 'Mit Quark, Ei, Mehl, 1 EL Zucker, Vanillezucker, Salz und Rosinen zu einem formbaren Teig verkneten.', 'Mit bemehlten Händen 12 flache Plätzchen formen und in Butter von jeder Seite 3–4 Minuten goldbraun braten.', 'Restlichen Zucker mit Zimt mischen, die Keulchen darin wälzen und mit Apfelmus servieren.']::text[]),
  ('4dcec7f3-5cd2-4fbe-a3bc-c01e3b6efaf6', 'vegane-bananen-pancakes', 'Vegane Bananen-Pancakes', 'Fluffige Pancakes ohne Ei und Milch – mit Banane gesüßt und Ahornsirup.', 'fruehstueck_suesses', 'vegan', 20, 1, 2, array['Eine Banane zerdrücken und mit Haferdrink verrühren.', 'Mehl, Backpulver, Zimt und Salz mischen und kurz unter die Bananenmischung rühren – der Teig darf klümpchen haben.', 'Eine Pfanne dünn ölen und pro Pancake 2 EL Teig bei mittlerer Hitze backen, bis sich Bläschen zeigen. Wenden und fertig backen.', 'Mit Bananenscheiben, Beeren und Ahornsirup servieren.']::text[]),
  ('fe9d0277-0c06-4b47-a6b1-6f3965a63ba3', 'tofu-scramble', 'Tofu-Scramble mit Spinat', 'Die vegane Rührei-Alternative mit Kurkuma, Gemüse und knusprigem Brot.', 'fruehstueck_suesses', 'vegan', 15, 1, 2, array['Tofu mit einer Gabel grob zerbröseln.', 'Frühlingszwiebeln im Öl anbraten, Tofu zugeben und 4 Minuten braten. Kurkuma, Paprika und Haferdrink unterrühren.', 'Halbierte Tomaten und Spinat zugeben und kurz mitgaren.', 'Mit Salz und Pfeffer abschmecken und mit geröstetem Brot servieren.']::text[])
on conflict (slug) do update set title = excluded.title, description = excluded.description,
  category = excluded.category, diet = excluded.diet, total_minutes = excluded.total_minutes,
  difficulty = excluded.difficulty, servings = excluded.servings, steps = excluded.steps;

delete from public.recipe_ingredients where recipe_id in (select id from public.recipes where slug in ('spaghetti-aglio-olio', 'spaghetti-bolognese', 'penne-arrabbiata', 'pasta-zucchini-zitrone', 'kaesespaetzle', 'gnocchi-salbeibutter', 'spaghetti-carbonara', 'tortellini-schinken-sahne', 'pasta-lachs-spinat', 'linsen-bolognese', 'pasta-pesto-bohnen', 'orecchiette-brokkoli', 'mac-and-cheese', 'one-pot-pasta-tomate-spinat', 'pasta-thunfisch-tomate', 'pilzrisotto', 'spanische-reispfanne', 'gemuese-couscous-kichererbsen', 'bulgur-paprika-feta', 'buddha-bowl-erdnuss', 'gebratener-reis-ei', 'chili-sin-carne', 'risi-e-bisi', 'lachs-bowl', 'quinoa-ofengemuese', 'kuerbisrisotto', 'rote-linsen-dal', 'haehnchen-teriyaki-reis', 'polenta-pilzragout', 'kartoffelsuppe-wuerstchen', 'tomatensuppe', 'linseneintopf', 'kuerbissuppe-ingwer', 'huehnersuppe-nudeln', 'minestrone', 'erbsensuppe-minze', 'chili-con-carne', 'gulaschsuppe', 'brokkoli-cremesuppe', 'moehren-ingwer-suppe', 'kichererbsen-spinat-eintopf', 'thai-kokossuppe-garnelen', 'zwiebelsuppe-kaesetoast', 'griechischer-salat', 'nudelsalat-pesto', 'schwaebischer-kartoffelsalat', 'caesar-salad-haehnchen', 'couscous-salat-minze', 'linsensalat-feta', 'caprese', 'thunfisch-bohnen-salat', 'gurkensalat-tofu', 'rote-bete-ziegenkaese', 'quinoa-avocado-salat', 'wurstsalat', 'bunter-bohnensalat', 'lasagne-klassisch', 'gemueselasagne', 'nudelauflauf-schinken', 'gefuellte-paprika', 'ofengemuese-feta', 'zitronen-haehnchen-blech', 'brokkoli-auflauf', 'ofenlachs-gemuese', 'ofen-suesskartoffel-kichererbsen', 'moussaka', 'zucchini-hack-auflauf', 'blumenkohl-kaese-auflauf', 'quiche-lorraine', 'spinat-feta-quiche', 'gemuese-curry-kokos', 'haehnchen-curry', 'erdnuss-nudeln', 'gebratene-nudeln-haehnchen', 'zuercher-geschnetzeltes', 'shakshuka', 'tofu-teriyaki-pfanne', 'knoblauch-chili-garnelen', 'pad-thai-tofu', 'frikadellen-gurkensalat', 'chana-masala', 'schnitzel-wiener-art', 'pilzpfanne-semmelknoedel', 'fisch-zitronenbutter', 'ratatouille', 'kartoffelgratin', 'bratkartoffeln-spiegelei', 'kartoffelpuffer-apfelmus', 'ofenkartoffel-kraeuterquark', 'rosmarin-kartoffelpfanne', 'schupfnudeln-sauerkraut', 'kartoffel-spinat-curry', 'pellkartoffeln-quark-leinoel', 'bauernfruehstueck', 'roesti-raeucherlachs', 'kartoffelpueree-bratwurst', 'suesskartoffel-pommes-dip', 'stampfkartoffeln-fischstaebchen', 'gefuellte-kartoffeln-brokkoli', 'flammkuchen-klassisch', 'flammkuchen-ziegenkaese', 'pizza-margherita', 'haehnchen-wraps', 'falafel-wraps', 'burger-klassisch', 'quesadillas-bohnen', 'croque-monsieur', 'bruschetta', 'tacos-hackfleisch', 'linsen-burger', 'avocado-toast-ei', 'pita-halloumi', 'strammer-max', 'pfannkuchen', 'kaiserschmarrn', 'milchreis-zimt', 'arme-ritter', 'ruehrei-schnittlauch', 'porridge-apfel', 'griessbrei-kirschen', 'gemuese-omelette', 'apfelpfannkuchen', 'dampfnudeln', 'waffeln', 'quarkkeulchen', 'vegane-bananen-pancakes', 'tofu-scramble'));

insert into public.recipe_ingredients (recipe_id, position, ingredient_id, amount, unit, note) values
  ('caec4add-dbb2-4594-afe5-97c929c65a5c', 1, 'spaghetti', 250, 'g', null),
  ('caec4add-dbb2-4594-afe5-97c929c65a5c', 2, 'knoblauch', 4, 'Zehe', null),
  ('caec4add-dbb2-4594-afe5-97c929c65a5c', 3, 'olivenoel', 5, 'EL', null),
  ('caec4add-dbb2-4594-afe5-97c929c65a5c', 4, 'chiliflocken', 0.5, 'TL', null),
  ('caec4add-dbb2-4594-afe5-97c929c65a5c', 5, 'petersilie', 0.5, 'Bund', null),
  ('caec4add-dbb2-4594-afe5-97c929c65a5c', 6, 'salz', null, null, null),
  ('caec4add-dbb2-4594-afe5-97c929c65a5c', 7, 'pfeffer', null, null, null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 1, 'spaghetti', 400, 'g', null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 2, 'rinderhack', 400, 'g', null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 3, 'zwiebel', 1, null, null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 4, 'karotte', 1, null, null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 5, 'staudensellerie', 1, 'Stange', null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 6, 'knoblauch', 2, 'Zehe', null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 7, 'tomatenmark', 2, 'EL', null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 8, 'passierte_tomaten', 500, 'ml', null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 9, 'rotwein', 100, 'ml', 'optional'),
  ('4bd49841-52dc-4b87-ae19-768660182577', 10, 'oregano', 1, 'TL', null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 11, 'olivenoel', 2, 'EL', null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 12, 'parmesan', 40, 'g', null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 13, 'salz', null, null, null),
  ('4bd49841-52dc-4b87-ae19-768660182577', 14, 'pfeffer', null, null, null),
  ('a3ebc6cd-14c7-41d9-a262-fd233698315b', 1, 'penne', 250, 'g', null),
  ('a3ebc6cd-14c7-41d9-a262-fd233698315b', 2, 'gehackte_tomaten', 1, 'Dose', null),
  ('a3ebc6cd-14c7-41d9-a262-fd233698315b', 3, 'knoblauch', 2, 'Zehe', null),
  ('a3ebc6cd-14c7-41d9-a262-fd233698315b', 4, 'chili', 1, null, null),
  ('a3ebc6cd-14c7-41d9-a262-fd233698315b', 5, 'olivenoel', 3, 'EL', null),
  ('a3ebc6cd-14c7-41d9-a262-fd233698315b', 6, 'petersilie', 0.5, 'Bund', null),
  ('a3ebc6cd-14c7-41d9-a262-fd233698315b', 7, 'zucker', 1, 'Prise', null),
  ('a3ebc6cd-14c7-41d9-a262-fd233698315b', 8, 'salz', null, null, null),
  ('4a750e34-7619-4dbf-aeec-0120fb7e607b', 1, 'fusilli', 250, 'g', null),
  ('4a750e34-7619-4dbf-aeec-0120fb7e607b', 2, 'zucchini', 2, null, null),
  ('4a750e34-7619-4dbf-aeec-0120fb7e607b', 3, 'knoblauch', 1, 'Zehe', null),
  ('4a750e34-7619-4dbf-aeec-0120fb7e607b', 4, 'zitrone', 1, null, null),
  ('4a750e34-7619-4dbf-aeec-0120fb7e607b', 5, 'parmesan', 40, 'g', null),
  ('4a750e34-7619-4dbf-aeec-0120fb7e607b', 6, 'olivenoel', 3, 'EL', null),
  ('4a750e34-7619-4dbf-aeec-0120fb7e607b', 7, 'basilikum', 0.5, 'Bund', null),
  ('4a750e34-7619-4dbf-aeec-0120fb7e607b', 8, 'salz', null, null, null),
  ('4a750e34-7619-4dbf-aeec-0120fb7e607b', 9, 'pfeffer', null, null, null),
  ('6e627baf-5417-4cb9-ab58-1fcc2f8cb720', 1, 'spaetzle', 800, 'g', null),
  ('6e627baf-5417-4cb9-ab58-1fcc2f8cb720', 2, 'bergkaese', 250, 'g', null),
  ('6e627baf-5417-4cb9-ab58-1fcc2f8cb720', 3, 'zwiebel', 3, null, null),
  ('6e627baf-5417-4cb9-ab58-1fcc2f8cb720', 4, 'butter', 40, 'g', null),
  ('6e627baf-5417-4cb9-ab58-1fcc2f8cb720', 5, 'schnittlauch', 0.5, 'Bund', null),
  ('6e627baf-5417-4cb9-ab58-1fcc2f8cb720', 6, 'muskat', 1, 'Prise', null),
  ('6e627baf-5417-4cb9-ab58-1fcc2f8cb720', 7, 'salz', null, null, null),
  ('6e627baf-5417-4cb9-ab58-1fcc2f8cb720', 8, 'pfeffer', null, null, null),
  ('f0e59c88-e106-4591-a265-bcefbacfc2a1', 1, 'gnocchi', 500, 'g', null),
  ('f0e59c88-e106-4591-a265-bcefbacfc2a1', 2, 'butter', 50, 'g', null),
  ('f0e59c88-e106-4591-a265-bcefbacfc2a1', 3, 'salbei', 1, 'Bund', null),
  ('f0e59c88-e106-4591-a265-bcefbacfc2a1', 4, 'parmesan', 30, 'g', null),
  ('f0e59c88-e106-4591-a265-bcefbacfc2a1', 5, 'zitrone', 0.5, null, null),
  ('f0e59c88-e106-4591-a265-bcefbacfc2a1', 6, 'salz', null, null, null),
  ('f0e59c88-e106-4591-a265-bcefbacfc2a1', 7, 'pfeffer', null, null, null),
  ('146be5dd-260a-4cab-a9d0-ed370d8f85a0', 1, 'spaghetti', 250, 'g', null),
  ('146be5dd-260a-4cab-a9d0-ed370d8f85a0', 2, 'speck', 120, 'g', null),
  ('146be5dd-260a-4cab-a9d0-ed370d8f85a0', 3, 'eier', 2, null, null),
  ('146be5dd-260a-4cab-a9d0-ed370d8f85a0', 4, 'parmesan', 60, 'g', null),
  ('146be5dd-260a-4cab-a9d0-ed370d8f85a0', 5, 'pfeffer', null, null, null),
  ('146be5dd-260a-4cab-a9d0-ed370d8f85a0', 6, 'salz', null, null, null),
  ('d469a619-9e85-4ecb-a158-b0cdf320d435', 1, 'tortellini', 500, 'g', null),
  ('d469a619-9e85-4ecb-a158-b0cdf320d435', 2, 'schinken', 150, 'g', null),
  ('d469a619-9e85-4ecb-a158-b0cdf320d435', 3, 'erbsen_tk', 100, 'g', null),
  ('d469a619-9e85-4ecb-a158-b0cdf320d435', 4, 'sahne', 200, 'ml', null),
  ('d469a619-9e85-4ecb-a158-b0cdf320d435', 5, 'zwiebel', 1, null, null),
  ('d469a619-9e85-4ecb-a158-b0cdf320d435', 6, 'butter', 1, 'EL', null),
  ('d469a619-9e85-4ecb-a158-b0cdf320d435', 7, 'parmesan', 30, 'g', null),
  ('d469a619-9e85-4ecb-a158-b0cdf320d435', 8, 'muskat', 1, 'Prise', null),
  ('d469a619-9e85-4ecb-a158-b0cdf320d435', 9, 'salz', null, null, null),
  ('d469a619-9e85-4ecb-a158-b0cdf320d435', 10, 'pfeffer', null, null, null),
  ('946e3942-7811-4466-a1c1-ec93bcb7730f', 1, 'tagliatelle', 250, 'g', null),
  ('946e3942-7811-4466-a1c1-ec93bcb7730f', 2, 'lachs', 250, 'g', null),
  ('946e3942-7811-4466-a1c1-ec93bcb7730f', 3, 'spinat', 100, 'g', null),
  ('946e3942-7811-4466-a1c1-ec93bcb7730f', 4, 'sahne', 150, 'ml', null),
  ('946e3942-7811-4466-a1c1-ec93bcb7730f', 5, 'knoblauch', 1, 'Zehe', null),
  ('946e3942-7811-4466-a1c1-ec93bcb7730f', 6, 'zitrone', 0.5, null, null),
  ('946e3942-7811-4466-a1c1-ec93bcb7730f', 7, 'dill', 0.5, 'Bund', null),
  ('946e3942-7811-4466-a1c1-ec93bcb7730f', 8, 'olivenoel', 1, 'EL', null),
  ('946e3942-7811-4466-a1c1-ec93bcb7730f', 9, 'salz', null, null, null),
  ('946e3942-7811-4466-a1c1-ec93bcb7730f', 10, 'pfeffer', null, null, null),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 1, 'spaghetti', 400, 'g', null),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 2, 'rote_linsen', 150, 'g', null),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 3, 'zwiebel', 1, null, null),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 4, 'karotte', 2, null, null),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 5, 'knoblauch', 2, 'Zehe', null),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 6, 'tomatenmark', 2, 'EL', null),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 7, 'passierte_tomaten', 700, 'ml', null),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 8, 'gemuesebruehe', 200, 'ml', null),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 9, 'oregano', 1, 'TL', null),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 10, 'olivenoel', 2, 'EL', null),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 11, 'salz', null, null, null),
  ('49299b17-4356-4e87-abbe-c5bbc67e876d', 12, 'pfeffer', null, null, null),
  ('83b7d787-9061-4e64-a36c-cee90f7102e3', 1, 'fusilli', 300, 'g', null),
  ('83b7d787-9061-4e64-a36c-cee90f7102e3', 2, 'gruene_bohnen', 200, 'g', null),
  ('83b7d787-9061-4e64-a36c-cee90f7102e3', 3, 'kartoffel', 2, null, null),
  ('83b7d787-9061-4e64-a36c-cee90f7102e3', 4, 'pesto', 120, 'g', null),
  ('83b7d787-9061-4e64-a36c-cee90f7102e3', 5, 'parmesan', 30, 'g', null),
  ('83b7d787-9061-4e64-a36c-cee90f7102e3', 6, 'pinienkerne', 2, 'EL', null),
  ('83b7d787-9061-4e64-a36c-cee90f7102e3', 7, 'salz', null, null, null),
  ('9190ba4f-165a-4b93-afae-6ba5bdb2db3e', 1, 'orecchiette', 250, 'g', null),
  ('9190ba4f-165a-4b93-afae-6ba5bdb2db3e', 2, 'brokkoli', 1, null, null),
  ('9190ba4f-165a-4b93-afae-6ba5bdb2db3e', 3, 'knoblauch', 2, 'Zehe', null),
  ('9190ba4f-165a-4b93-afae-6ba5bdb2db3e', 4, 'chiliflocken', 0.5, 'TL', null),
  ('9190ba4f-165a-4b93-afae-6ba5bdb2db3e', 5, 'olivenoel', 4, 'EL', null),
  ('9190ba4f-165a-4b93-afae-6ba5bdb2db3e', 6, 'zitrone', 0.5, null, null),
  ('9190ba4f-165a-4b93-afae-6ba5bdb2db3e', 7, 'semmelbroesel', 3, 'EL', null),
  ('9190ba4f-165a-4b93-afae-6ba5bdb2db3e', 8, 'salz', null, null, null),
  ('0f508010-4537-4f56-a095-3a38bb452551', 1, 'makkaroni', 400, 'g', null),
  ('0f508010-4537-4f56-a095-3a38bb452551', 2, 'cheddar', 200, 'g', null),
  ('0f508010-4537-4f56-a095-3a38bb452551', 3, 'reibekaese', 100, 'g', null),
  ('0f508010-4537-4f56-a095-3a38bb452551', 4, 'butter', 40, 'g', null),
  ('0f508010-4537-4f56-a095-3a38bb452551', 5, 'mehl', 3, 'EL', null),
  ('0f508010-4537-4f56-a095-3a38bb452551', 6, 'milch', 600, 'ml', null),
  ('0f508010-4537-4f56-a095-3a38bb452551', 7, 'senf', 1, 'TL', null),
  ('0f508010-4537-4f56-a095-3a38bb452551', 8, 'semmelbroesel', 3, 'EL', null),
  ('0f508010-4537-4f56-a095-3a38bb452551', 9, 'salz', null, null, null),
  ('0f508010-4537-4f56-a095-3a38bb452551', 10, 'pfeffer', null, null, null),
  ('15a39cdb-ef01-4496-a1b8-f57befcfe34f', 1, 'penne', 300, 'g', null),
  ('15a39cdb-ef01-4496-a1b8-f57befcfe34f', 2, 'kirschtomaten', 250, 'g', null),
  ('15a39cdb-ef01-4496-a1b8-f57befcfe34f', 3, 'zwiebel', 1, null, null),
  ('15a39cdb-ef01-4496-a1b8-f57befcfe34f', 4, 'knoblauch', 2, 'Zehe', null),
  ('15a39cdb-ef01-4496-a1b8-f57befcfe34f', 5, 'gemuesebruehe', 750, 'ml', null),
  ('15a39cdb-ef01-4496-a1b8-f57befcfe34f', 6, 'spinat', 100, 'g', null),
  ('15a39cdb-ef01-4496-a1b8-f57befcfe34f', 7, 'oregano', 1, 'TL', null),
  ('15a39cdb-ef01-4496-a1b8-f57befcfe34f', 8, 'olivenoel', 2, 'EL', null),
  ('15a39cdb-ef01-4496-a1b8-f57befcfe34f', 9, 'basilikum', 0.5, 'Bund', null),
  ('15a39cdb-ef01-4496-a1b8-f57befcfe34f', 10, 'salz', null, null, null),
  ('15a39cdb-ef01-4496-a1b8-f57befcfe34f', 11, 'pfeffer', null, null, null),
  ('9aca5906-4d7c-4947-a653-6f6761b66a16', 1, 'spaghetti', 250, 'g', null),
  ('9aca5906-4d7c-4947-a653-6f6761b66a16', 2, 'thunfisch', 1, 'Dose', null),
  ('9aca5906-4d7c-4947-a653-6f6761b66a16', 3, 'gehackte_tomaten', 1, 'Dose', null),
  ('9aca5906-4d7c-4947-a653-6f6761b66a16', 4, 'zwiebel', 1, null, null),
  ('9aca5906-4d7c-4947-a653-6f6761b66a16', 5, 'knoblauch', 1, 'Zehe', null),
  ('9aca5906-4d7c-4947-a653-6f6761b66a16', 6, 'kapern', 1, 'EL', null),
  ('9aca5906-4d7c-4947-a653-6f6761b66a16', 7, 'oliven', 50, 'g', null),
  ('9aca5906-4d7c-4947-a653-6f6761b66a16', 8, 'olivenoel', 2, 'EL', null),
  ('9aca5906-4d7c-4947-a653-6f6761b66a16', 9, 'petersilie', 0.5, 'Bund', null),
  ('9aca5906-4d7c-4947-a653-6f6761b66a16', 10, 'salz', null, null, null),
  ('9aca5906-4d7c-4947-a653-6f6761b66a16', 11, 'pfeffer', null, null, null),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 1, 'risottoreis', 250, 'g', null),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 2, 'champignons', 300, 'g', null),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 3, 'zwiebel', 1, null, null),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 4, 'knoblauch', 1, 'Zehe', null),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 5, 'weisswein', 100, 'ml', null),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 6, 'gemuesebruehe', 900, 'ml', null),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 7, 'butter', 30, 'g', null),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 8, 'parmesan', 50, 'g', null),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 9, 'thymian', 3, 'Zweig', null),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 10, 'olivenoel', 2, 'EL', null),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 11, 'salz', null, null, null),
  ('c0610f0a-d303-4d5b-a733-dc3f065eb621', 12, 'pfeffer', null, null, null),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 1, 'reis', 300, 'g', null),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 2, 'haehnchenschenkel', 500, 'g', 'ohne Knochen'),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 3, 'chorizo', 100, 'g', null),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 4, 'paprika', 2, null, null),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 5, 'zwiebel', 1, null, null),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 6, 'knoblauch', 2, 'Zehe', null),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 7, 'erbsen_tk', 150, 'g', null),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 8, 'paprikapulver', 2, 'TL', null),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 9, 'kurkuma', 1, 'TL', null),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 10, 'huehnerbruehe', 800, 'ml', null),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 11, 'zitrone', 1, null, null),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 12, 'olivenoel', 3, 'EL', null),
  ('d02fb390-2b30-4e26-a30e-eb9e8502767b', 13, 'salz', null, null, null),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 1, 'couscous', 150, 'g', null),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 2, 'kichererbsen', 1, 'Dose', null),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 3, 'zucchini', 1, null, null),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 4, 'paprika', 1, null, null),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 5, 'rote_zwiebel', 1, null, null),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 6, 'kreuzkuemmel', 1, 'TL', null),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 7, 'zimt', 1, 'Prise', null),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 8, 'gemuesebruehe', 200, 'ml', null),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 9, 'minze', 0.5, 'Bund', null),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 10, 'zitrone', 0.5, null, null),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 11, 'olivenoel', 3, 'EL', null),
  ('5f2fd04f-b846-4908-a2a5-8de2ed311c12', 12, 'salz', null, null, null),
  ('c45fa7c2-699f-4d8e-ace3-733bebd04eef', 1, 'bulgur', 150, 'g', null),
  ('c45fa7c2-699f-4d8e-ace3-733bebd04eef', 2, 'paprika', 2, null, null),
  ('c45fa7c2-699f-4d8e-ace3-733bebd04eef', 3, 'zwiebel', 1, null, null),
  ('c45fa7c2-699f-4d8e-ace3-733bebd04eef', 4, 'tomatenmark', 2, 'EL', null),
  ('c45fa7c2-699f-4d8e-ace3-733bebd04eef', 5, 'gemuesebruehe', 350, 'ml', null),
  ('c45fa7c2-699f-4d8e-ace3-733bebd04eef', 6, 'paprikapulver', 1, 'TL', null),
  ('c45fa7c2-699f-4d8e-ace3-733bebd04eef', 7, 'feta', 100, 'g', null),
  ('c45fa7c2-699f-4d8e-ace3-733bebd04eef', 8, 'petersilie', 0.5, 'Bund', null),
  ('c45fa7c2-699f-4d8e-ace3-733bebd04eef', 9, 'olivenoel', 2, 'EL', null),
  ('c45fa7c2-699f-4d8e-ace3-733bebd04eef', 10, 'salz', null, null, null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 1, 'basmati', 150, 'g', null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 2, 'suesskartoffel', 1, null, null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 3, 'kichererbsen', 1, 'Dose', null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 4, 'karotte', 1, null, null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 5, 'gurke', 0.5, null, null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 6, 'avocado', 1, null, null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 7, 'erdnussbutter', 2, 'EL', null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 8, 'sojasauce', 1, 'EL', null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 9, 'limette', 1, null, null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 10, 'ahornsirup', 1, 'TL', null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 11, 'sesam', 1, 'EL', null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 12, 'oel', 2, 'EL', null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 13, 'paprikapulver', 1, 'TL', null),
  ('deaf5a12-aa49-4320-a5c3-62e732d6ea79', 14, 'salz', null, null, null),
  ('92d0f554-7d93-49e1-a21d-3bc85fc0be4b', 1, 'reis', 150, 'g', 'gekocht vom Vortag (ca. 400 g)'),
  ('92d0f554-7d93-49e1-a21d-3bc85fc0be4b', 2, 'eier', 3, null, null),
  ('92d0f554-7d93-49e1-a21d-3bc85fc0be4b', 3, 'erbsen_tk', 100, 'g', null),
  ('92d0f554-7d93-49e1-a21d-3bc85fc0be4b', 4, 'karotte', 1, null, null),
  ('92d0f554-7d93-49e1-a21d-3bc85fc0be4b', 5, 'fruehlingszwiebel', 3, null, null),
  ('92d0f554-7d93-49e1-a21d-3bc85fc0be4b', 6, 'knoblauch', 1, 'Zehe', null),
  ('92d0f554-7d93-49e1-a21d-3bc85fc0be4b', 7, 'sojasauce', 3, 'EL', null),
  ('92d0f554-7d93-49e1-a21d-3bc85fc0be4b', 8, 'sesamoel', 1, 'TL', null),
  ('92d0f554-7d93-49e1-a21d-3bc85fc0be4b', 9, 'oel', 2, 'EL', null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 1, 'reis', 250, 'g', null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 2, 'kidneybohnen', 1, 'Dose', null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 3, 'mais', 1, 'Dose', null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 4, 'rote_linsen', 100, 'g', null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 5, 'gehackte_tomaten', 2, 'Dose', null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 6, 'zwiebel', 1, null, null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 7, 'paprika', 1, null, null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 8, 'knoblauch', 2, 'Zehe', null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 9, 'kreuzkuemmel', 1, 'TL', null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 10, 'paprikapulver', 2, 'TL', null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 11, 'chiliflocken', 0.5, 'TL', null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 12, 'gemuesebruehe', 250, 'ml', null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 13, 'oel', 2, 'EL', null),
  ('fb6b91a0-953f-423a-ad73-a9796251c89b', 14, 'salz', null, null, null),
  ('13936405-89e6-4d4c-a4ac-ff5752b7fc3d', 1, 'risottoreis', 200, 'g', null),
  ('13936405-89e6-4d4c-a4ac-ff5752b7fc3d', 2, 'erbsen_tk', 300, 'g', null),
  ('13936405-89e6-4d4c-a4ac-ff5752b7fc3d', 3, 'zwiebel', 1, null, null),
  ('13936405-89e6-4d4c-a4ac-ff5752b7fc3d', 4, 'butter', 30, 'g', null),
  ('13936405-89e6-4d4c-a4ac-ff5752b7fc3d', 5, 'gemuesebruehe', 1, 'l', null),
  ('13936405-89e6-4d4c-a4ac-ff5752b7fc3d', 6, 'parmesan', 40, 'g', null),
  ('13936405-89e6-4d4c-a4ac-ff5752b7fc3d', 7, 'petersilie', 0.5, 'Bund', null),
  ('13936405-89e6-4d4c-a4ac-ff5752b7fc3d', 8, 'salz', null, null, null),
  ('13936405-89e6-4d4c-a4ac-ff5752b7fc3d', 9, 'pfeffer', null, null, null),
  ('81ca65aa-30d1-4a03-aaba-081d4210fe89', 1, 'basmati', 150, 'g', null),
  ('81ca65aa-30d1-4a03-aaba-081d4210fe89', 2, 'lachs', 250, 'g', null),
  ('81ca65aa-30d1-4a03-aaba-081d4210fe89', 3, 'gurke', 0.5, null, null),
  ('81ca65aa-30d1-4a03-aaba-081d4210fe89', 4, 'avocado', 1, null, null),
  ('81ca65aa-30d1-4a03-aaba-081d4210fe89', 5, 'radieschen', 6, null, null),
  ('81ca65aa-30d1-4a03-aaba-081d4210fe89', 6, 'fruehlingszwiebel', 2, null, null),
  ('81ca65aa-30d1-4a03-aaba-081d4210fe89', 7, 'sojasauce', 3, 'EL', null),
  ('81ca65aa-30d1-4a03-aaba-081d4210fe89', 8, 'honig', 1, 'TL', null),
  ('81ca65aa-30d1-4a03-aaba-081d4210fe89', 9, 'limette', 1, null, null),
  ('81ca65aa-30d1-4a03-aaba-081d4210fe89', 10, 'sesam', 1, 'EL', null),
  ('81ca65aa-30d1-4a03-aaba-081d4210fe89', 11, 'oel', 1, 'EL', null),
  ('accf6bab-8ad5-43e4-af0d-83f561097fca', 1, 'quinoa', 150, 'g', null),
  ('accf6bab-8ad5-43e4-af0d-83f561097fca', 2, 'blumenkohl', 0.5, null, null),
  ('accf6bab-8ad5-43e4-af0d-83f561097fca', 3, 'karotte', 2, null, null),
  ('accf6bab-8ad5-43e4-af0d-83f561097fca', 4, 'rote_zwiebel', 1, null, null),
  ('accf6bab-8ad5-43e4-af0d-83f561097fca', 5, 'kichererbsen', 1, 'Dose', null),
  ('accf6bab-8ad5-43e4-af0d-83f561097fca', 6, 'tahini', 2, 'EL', null),
  ('accf6bab-8ad5-43e4-af0d-83f561097fca', 7, 'zitrone', 1, null, null),
  ('accf6bab-8ad5-43e4-af0d-83f561097fca', 8, 'kreuzkuemmel', 1, 'TL', null),
  ('accf6bab-8ad5-43e4-af0d-83f561097fca', 9, 'olivenoel', 3, 'EL', null),
  ('accf6bab-8ad5-43e4-af0d-83f561097fca', 10, 'petersilie', 0.5, 'Bund', null),
  ('accf6bab-8ad5-43e4-af0d-83f561097fca', 11, 'salz', null, null, null),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 1, 'risottoreis', 250, 'g', null),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 2, 'kuerbis', 400, 'g', null),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 3, 'zwiebel', 1, null, null),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 4, 'weisswein', 100, 'ml', null),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 5, 'gemuesebruehe', 900, 'ml', null),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 6, 'parmesan', 50, 'g', null),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 7, 'butter', 30, 'g', null),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 8, 'salbei', 8, 'Blatt', null),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 9, 'olivenoel', 2, 'EL', null),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 10, 'muskat', 1, 'Prise', null),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 11, 'salz', null, null, null),
  ('688f390d-c94f-4de8-ae9a-b1ec047f88c5', 12, 'pfeffer', null, null, null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 1, 'rote_linsen', 250, 'g', null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 2, 'basmati', 250, 'g', null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 3, 'kokosmilch', 400, 'ml', null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 4, 'gehackte_tomaten', 1, 'Dose', null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 5, 'zwiebel', 1, null, null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 6, 'knoblauch', 2, 'Zehe', null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 7, 'ingwer', 20, 'g', null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 8, 'kurkuma', 1, 'TL', null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 9, 'garam_masala', 2, 'TL', null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 10, 'kreuzkuemmel', 1, 'TL', null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 11, 'gemuesebruehe', 500, 'ml', null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 12, 'koriander', 0.5, 'Bund', null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 13, 'oel', 2, 'EL', null),
  ('da007133-9e4c-4fd0-af11-a287a7da4e4f', 14, 'salz', null, null, null),
  ('23f4c532-6cc6-4d09-ab88-f18b78a60831', 1, 'reis', 150, 'g', null),
  ('23f4c532-6cc6-4d09-ab88-f18b78a60831', 2, 'haehnchenbrust', 300, 'g', null),
  ('23f4c532-6cc6-4d09-ab88-f18b78a60831', 3, 'brokkoli', 0.5, null, null),
  ('23f4c532-6cc6-4d09-ab88-f18b78a60831', 4, 'sojasauce', 4, 'EL', null),
  ('23f4c532-6cc6-4d09-ab88-f18b78a60831', 5, 'honig', 2, 'EL', null),
  ('23f4c532-6cc6-4d09-ab88-f18b78a60831', 6, 'ingwer', 10, 'g', null),
  ('23f4c532-6cc6-4d09-ab88-f18b78a60831', 7, 'knoblauch', 1, 'Zehe', null),
  ('23f4c532-6cc6-4d09-ab88-f18b78a60831', 8, 'speisestaerke', 1, 'TL', null),
  ('23f4c532-6cc6-4d09-ab88-f18b78a60831', 9, 'sesam', 1, 'EL', null),
  ('23f4c532-6cc6-4d09-ab88-f18b78a60831', 10, 'oel', 1, 'EL', null),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 1, 'polenta', 200, 'g', null),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 2, 'gemuesebruehe', 800, 'ml', null),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 3, 'parmesan', 50, 'g', null),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 4, 'butter', 30, 'g', null),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 5, 'champignons', 400, 'g', null),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 6, 'zwiebel', 1, null, null),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 7, 'knoblauch', 1, 'Zehe', null),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 8, 'thymian', 3, 'Zweig', null),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 9, 'sahne', 100, 'ml', null),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 10, 'olivenoel', 2, 'EL', null),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 11, 'salz', null, null, null),
  ('ebd8cca8-6b4f-4a47-af88-9589d673e8b5', 12, 'pfeffer', null, null, null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 1, 'kartoffel', 800, 'g', null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 2, 'karotte', 2, null, null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 3, 'lauch', 1, null, null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 4, 'knollensellerie', 150, 'g', null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 5, 'zwiebel', 1, null, null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 6, 'gemuesebruehe', 1.2, 'l', null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 7, 'wiener', 4, null, null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 8, 'majoran', 1, 'TL', null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 9, 'sahne', 100, 'ml', null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 10, 'butter', 1, 'EL', null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 11, 'petersilie', 0.5, 'Bund', null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 12, 'salz', null, null, null),
  ('5654db93-5c27-44ce-aced-b8cf0dc3d98e', 13, 'pfeffer', null, null, null),
  ('6693396c-1840-4518-a869-91fb996b50f6', 1, 'gehackte_tomaten', 2, 'Dose', null),
  ('6693396c-1840-4518-a869-91fb996b50f6', 2, 'zwiebel', 1, null, null),
  ('6693396c-1840-4518-a869-91fb996b50f6', 3, 'knoblauch', 2, 'Zehe', null),
  ('6693396c-1840-4518-a869-91fb996b50f6', 4, 'karotte', 1, null, null),
  ('6693396c-1840-4518-a869-91fb996b50f6', 5, 'gemuesebruehe', 400, 'ml', null),
  ('6693396c-1840-4518-a869-91fb996b50f6', 6, 'tomatenmark', 1, 'EL', null),
  ('6693396c-1840-4518-a869-91fb996b50f6', 7, 'zucker', 1, 'TL', null),
  ('6693396c-1840-4518-a869-91fb996b50f6', 8, 'olivenoel', 2, 'EL', null),
  ('6693396c-1840-4518-a869-91fb996b50f6', 9, 'basilikum', 0.5, 'Bund', null),
  ('6693396c-1840-4518-a869-91fb996b50f6', 10, 'hafersahne', 100, 'ml', null),
  ('6693396c-1840-4518-a869-91fb996b50f6', 11, 'salz', null, null, null),
  ('6693396c-1840-4518-a869-91fb996b50f6', 12, 'pfeffer', null, null, null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 1, 'tellerlinsen', 250, 'g', null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 2, 'kartoffel', 400, 'g', null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 3, 'karotte', 2, null, null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 4, 'lauch', 1, null, null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 5, 'zwiebel', 1, null, null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 6, 'gemuesebruehe', 1.5, 'l', null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 7, 'lorbeer', 1, 'Blatt', null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 8, 'majoran', 1, 'TL', null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 9, 'essig', 2, 'EL', null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 10, 'raeuchertofu', 150, 'g', null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 11, 'oel', 2, 'EL', null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 12, 'salz', null, null, null),
  ('a49c35c5-4ab1-45c3-a4b3-baef317ee10b', 13, 'pfeffer', null, null, null),
  ('6078e6a8-4b68-4127-a06a-77872b6cba76', 1, 'kuerbis', 1000, 'g', null),
  ('6078e6a8-4b68-4127-a06a-77872b6cba76', 2, 'zwiebel', 1, null, null),
  ('6078e6a8-4b68-4127-a06a-77872b6cba76', 3, 'karotte', 1, null, null),
  ('6078e6a8-4b68-4127-a06a-77872b6cba76', 4, 'ingwer', 25, 'g', null),
  ('6078e6a8-4b68-4127-a06a-77872b6cba76', 5, 'kokosmilch', 400, 'ml', null),
  ('6078e6a8-4b68-4127-a06a-77872b6cba76', 6, 'gemuesebruehe', 600, 'ml', null),
  ('6078e6a8-4b68-4127-a06a-77872b6cba76', 7, 'currypulver', 1, 'TL', null),
  ('6078e6a8-4b68-4127-a06a-77872b6cba76', 8, 'oel', 2, 'EL', null),
  ('6078e6a8-4b68-4127-a06a-77872b6cba76', 9, 'salz', null, null, null),
  ('6078e6a8-4b68-4127-a06a-77872b6cba76', 10, 'pfeffer', null, null, null),
  ('087ab2d7-fccc-4614-aab0-c7f92a7d9607', 1, 'haehnchenschenkel', 600, 'g', null),
  ('087ab2d7-fccc-4614-aab0-c7f92a7d9607', 2, 'karotte', 3, null, null),
  ('087ab2d7-fccc-4614-aab0-c7f92a7d9607', 3, 'knollensellerie', 150, 'g', null),
  ('087ab2d7-fccc-4614-aab0-c7f92a7d9607', 4, 'lauch', 1, null, null),
  ('087ab2d7-fccc-4614-aab0-c7f92a7d9607', 5, 'zwiebel', 1, null, null),
  ('087ab2d7-fccc-4614-aab0-c7f92a7d9607', 6, 'lorbeer', 2, 'Blatt', null),
  ('087ab2d7-fccc-4614-aab0-c7f92a7d9607', 7, 'suppennudeln', 120, 'g', null),
  ('087ab2d7-fccc-4614-aab0-c7f92a7d9607', 8, 'petersilie', 1, 'Bund', null),
  ('087ab2d7-fccc-4614-aab0-c7f92a7d9607', 9, 'wasser', 2, 'l', null),
  ('087ab2d7-fccc-4614-aab0-c7f92a7d9607', 10, 'salz', null, null, null),
  ('087ab2d7-fccc-4614-aab0-c7f92a7d9607', 11, 'pfeffer', null, null, null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 1, 'zwiebel', 1, null, null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 2, 'karotte', 2, null, null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 3, 'staudensellerie', 2, 'Stange', null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 4, 'zucchini', 1, null, null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 5, 'kartoffel', 2, null, null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 6, 'gehackte_tomaten', 1, 'Dose', null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 7, 'weisse_bohnen', 1, 'Dose', null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 8, 'suppennudeln', 80, 'g', null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 9, 'gemuesebruehe', 1.2, 'l', null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 10, 'knoblauch', 2, 'Zehe', null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 11, 'olivenoel', 3, 'EL', null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 12, 'basilikum', 0.5, 'Bund', null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 13, 'salz', null, null, null),
  ('7c7602fe-fbff-4883-a0fd-e2da0aef212d', 14, 'pfeffer', null, null, null),
  ('3779bd39-3fa1-4e6e-aff2-455d3c888645', 1, 'erbsen_tk', 600, 'g', null),
  ('3779bd39-3fa1-4e6e-aff2-455d3c888645', 2, 'zwiebel', 1, null, null),
  ('3779bd39-3fa1-4e6e-aff2-455d3c888645', 3, 'kartoffel', 1, null, null),
  ('3779bd39-3fa1-4e6e-aff2-455d3c888645', 4, 'gemuesebruehe', 800, 'ml', null),
  ('3779bd39-3fa1-4e6e-aff2-455d3c888645', 5, 'minze', 0.5, 'Bund', null),
  ('3779bd39-3fa1-4e6e-aff2-455d3c888645', 6, 'zitrone', 0.5, null, null),
  ('3779bd39-3fa1-4e6e-aff2-455d3c888645', 7, 'olivenoel', 2, 'EL', null),
  ('3779bd39-3fa1-4e6e-aff2-455d3c888645', 8, 'salz', null, null, null),
  ('3779bd39-3fa1-4e6e-aff2-455d3c888645', 9, 'pfeffer', null, null, null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 1, 'rinderhack', 500, 'g', null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 2, 'kidneybohnen', 1, 'Dose', null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 3, 'mais', 1, 'Dose', null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 4, 'gehackte_tomaten', 2, 'Dose', null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 5, 'zwiebel', 2, null, null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 6, 'paprika', 1, null, null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 7, 'knoblauch', 2, 'Zehe', null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 8, 'tomatenmark', 2, 'EL', null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 9, 'kreuzkuemmel', 1, 'TL', null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 10, 'paprikapulver', 2, 'TL', null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 11, 'chiliflocken', 1, 'TL', null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 12, 'schmand', 150, 'g', null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 13, 'oel', 2, 'EL', null),
  ('dfbd830d-4bf9-4551-a06f-cebae7da13a8', 14, 'salz', null, null, null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 1, 'rindergulasch', 500, 'g', null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 2, 'zwiebel', 3, null, null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 3, 'paprika', 2, null, null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 4, 'kartoffel', 400, 'g', null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 5, 'knoblauch', 2, 'Zehe', null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 6, 'tomatenmark', 2, 'EL', null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 7, 'paprikapulver', 2, 'EL', null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 8, 'kuemmel', 1, 'TL', null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 9, 'majoran', 1, 'TL', null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 10, 'rinderbruehe', 1.2, 'l', null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 11, 'oel', 2, 'EL', null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 12, 'salz', null, null, null),
  ('2cd11a48-8945-408e-a8c5-de8218873827', 13, 'pfeffer', null, null, null),
  ('24393fba-05f1-42d0-a44c-bc2872c3f0cc', 1, 'brokkoli', 1, null, null),
  ('24393fba-05f1-42d0-a44c-bc2872c3f0cc', 2, 'kartoffel', 1, null, null),
  ('24393fba-05f1-42d0-a44c-bc2872c3f0cc', 3, 'zwiebel', 1, null, null),
  ('24393fba-05f1-42d0-a44c-bc2872c3f0cc', 4, 'gemuesebruehe', 800, 'ml', null),
  ('24393fba-05f1-42d0-a44c-bc2872c3f0cc', 5, 'frischkaese', 100, 'g', null),
  ('24393fba-05f1-42d0-a44c-bc2872c3f0cc', 6, 'pinienkerne', 2, 'EL', null),
  ('24393fba-05f1-42d0-a44c-bc2872c3f0cc', 7, 'butter', 1, 'EL', null),
  ('24393fba-05f1-42d0-a44c-bc2872c3f0cc', 8, 'muskat', 1, 'Prise', null),
  ('24393fba-05f1-42d0-a44c-bc2872c3f0cc', 9, 'salz', null, null, null),
  ('24393fba-05f1-42d0-a44c-bc2872c3f0cc', 10, 'pfeffer', null, null, null),
  ('38ee3d74-fd6a-4f8a-a7c8-4b2bb23ccb57', 1, 'karotte', 600, 'g', null),
  ('38ee3d74-fd6a-4f8a-a7c8-4b2bb23ccb57', 2, 'zwiebel', 1, null, null),
  ('38ee3d74-fd6a-4f8a-a7c8-4b2bb23ccb57', 3, 'ingwer', 30, 'g', null),
  ('38ee3d74-fd6a-4f8a-a7c8-4b2bb23ccb57', 4, 'kokosmilch', 200, 'ml', null),
  ('38ee3d74-fd6a-4f8a-a7c8-4b2bb23ccb57', 5, 'gemuesebruehe', 700, 'ml', null),
  ('38ee3d74-fd6a-4f8a-a7c8-4b2bb23ccb57', 6, 'limette', 1, null, null),
  ('38ee3d74-fd6a-4f8a-a7c8-4b2bb23ccb57', 7, 'koriander', 0.5, 'Bund', null),
  ('38ee3d74-fd6a-4f8a-a7c8-4b2bb23ccb57', 8, 'oel', 1, 'EL', null),
  ('38ee3d74-fd6a-4f8a-a7c8-4b2bb23ccb57', 9, 'salz', null, null, null),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 1, 'kichererbsen', 2, 'Dose', null),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 2, 'spinat', 200, 'g', null),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 3, 'gehackte_tomaten', 1, 'Dose', null),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 4, 'zwiebel', 1, null, null),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 5, 'knoblauch', 2, 'Zehe', null),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 6, 'kreuzkuemmel', 1, 'TL', null),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 7, 'paprikapulver', 1, 'TL', null),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 8, 'gemuesebruehe', 400, 'ml', null),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 9, 'zitrone', 0.5, null, null),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 10, 'olivenoel', 2, 'EL', null),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 11, 'salz', null, null, null),
  ('1aacf3a6-cf81-4026-a4b7-4537f9d81ccf', 12, 'pfeffer', null, null, null),
  ('23504c64-94dd-4356-a7e0-e5eeb5e05528', 1, 'garnelen', 200, 'g', null),
  ('23504c64-94dd-4356-a7e0-e5eeb5e05528', 2, 'kokosmilch', 400, 'ml', null),
  ('23504c64-94dd-4356-a7e0-e5eeb5e05528', 3, 'gemuesebruehe', 400, 'ml', null),
  ('23504c64-94dd-4356-a7e0-e5eeb5e05528', 4, 'champignons', 150, 'g', null),
  ('23504c64-94dd-4356-a7e0-e5eeb5e05528', 5, 'ingwer', 20, 'g', null),
  ('23504c64-94dd-4356-a7e0-e5eeb5e05528', 6, 'rote_currypaste', 1, 'EL', null),
  ('23504c64-94dd-4356-a7e0-e5eeb5e05528', 7, 'limette', 1, null, null),
  ('23504c64-94dd-4356-a7e0-e5eeb5e05528', 8, 'fruehlingszwiebel', 2, null, null),
  ('23504c64-94dd-4356-a7e0-e5eeb5e05528', 9, 'koriander', 0.5, 'Bund', null),
  ('23504c64-94dd-4356-a7e0-e5eeb5e05528', 10, 'sojasauce', 1, 'EL', null),
  ('23504c64-94dd-4356-a7e0-e5eeb5e05528', 11, 'zucker', 1, 'TL', null),
  ('b1eaa5f8-d62f-4cba-abb8-dc5f4c21a07c', 1, 'zwiebel', 1, 'kg', null),
  ('b1eaa5f8-d62f-4cba-abb8-dc5f4c21a07c', 2, 'butter', 40, 'g', null),
  ('b1eaa5f8-d62f-4cba-abb8-dc5f4c21a07c', 3, 'zucker', 1, 'TL', null),
  ('b1eaa5f8-d62f-4cba-abb8-dc5f4c21a07c', 4, 'weisswein', 150, 'ml', null),
  ('b1eaa5f8-d62f-4cba-abb8-dc5f4c21a07c', 5, 'gemuesebruehe', 1.2, 'l', null),
  ('b1eaa5f8-d62f-4cba-abb8-dc5f4c21a07c', 6, 'thymian', 3, 'Zweig', null),
  ('b1eaa5f8-d62f-4cba-abb8-dc5f4c21a07c', 7, 'baguette', 0.5, null, null),
  ('b1eaa5f8-d62f-4cba-abb8-dc5f4c21a07c', 8, 'bergkaese', 150, 'g', null),
  ('b1eaa5f8-d62f-4cba-abb8-dc5f4c21a07c', 9, 'salz', null, null, null),
  ('b1eaa5f8-d62f-4cba-abb8-dc5f4c21a07c', 10, 'pfeffer', null, null, null),
  ('0047643e-babf-41ab-ae19-ae7c7f99a75b', 1, 'tomate', 3, null, null),
  ('0047643e-babf-41ab-ae19-ae7c7f99a75b', 2, 'gurke', 1, null, null),
  ('0047643e-babf-41ab-ae19-ae7c7f99a75b', 3, 'paprika', 1, null, null),
  ('0047643e-babf-41ab-ae19-ae7c7f99a75b', 4, 'rote_zwiebel', 1, null, null),
  ('0047643e-babf-41ab-ae19-ae7c7f99a75b', 5, 'oliven', 60, 'g', null),
  ('0047643e-babf-41ab-ae19-ae7c7f99a75b', 6, 'feta', 200, 'g', null),
  ('0047643e-babf-41ab-ae19-ae7c7f99a75b', 7, 'oregano', 1, 'TL', null),
  ('0047643e-babf-41ab-ae19-ae7c7f99a75b', 8, 'olivenoel', 4, 'EL', null),
  ('0047643e-babf-41ab-ae19-ae7c7f99a75b', 9, 'essig', 1, 'EL', null),
  ('0047643e-babf-41ab-ae19-ae7c7f99a75b', 10, 'salz', null, null, null),
  ('0047643e-babf-41ab-ae19-ae7c7f99a75b', 11, 'pfeffer', null, null, null),
  ('7c6640e0-5d4f-49ca-aaf3-aa04418c34a3', 1, 'fusilli', 400, 'g', null),
  ('7c6640e0-5d4f-49ca-aaf3-aa04418c34a3', 2, 'pesto', 150, 'g', null),
  ('7c6640e0-5d4f-49ca-aaf3-aa04418c34a3', 3, 'kirschtomaten', 300, 'g', null),
  ('7c6640e0-5d4f-49ca-aaf3-aa04418c34a3', 4, 'mozzarella', 125, 'g', null),
  ('7c6640e0-5d4f-49ca-aaf3-aa04418c34a3', 5, 'rucola', 50, 'g', null),
  ('7c6640e0-5d4f-49ca-aaf3-aa04418c34a3', 6, 'pinienkerne', 3, 'EL', null),
  ('7c6640e0-5d4f-49ca-aaf3-aa04418c34a3', 7, 'balsamico', 2, 'EL', null),
  ('7c6640e0-5d4f-49ca-aaf3-aa04418c34a3', 8, 'olivenoel', 2, 'EL', null),
  ('7c6640e0-5d4f-49ca-aaf3-aa04418c34a3', 9, 'salz', null, null, null),
  ('98028916-4846-4225-ab41-5e575be188d9', 1, 'kartoffel', 1, 'kg', 'festkochend'),
  ('98028916-4846-4225-ab41-5e575be188d9', 2, 'zwiebel', 1, null, null),
  ('98028916-4846-4225-ab41-5e575be188d9', 3, 'gemuesebruehe', 250, 'ml', null),
  ('98028916-4846-4225-ab41-5e575be188d9', 4, 'essig', 4, 'EL', null),
  ('98028916-4846-4225-ab41-5e575be188d9', 5, 'senf', 1, 'TL', null),
  ('98028916-4846-4225-ab41-5e575be188d9', 6, 'oel', 4, 'EL', null),
  ('98028916-4846-4225-ab41-5e575be188d9', 7, 'schnittlauch', 1, 'Bund', null),
  ('98028916-4846-4225-ab41-5e575be188d9', 8, 'gurke', 0.5, null, null),
  ('98028916-4846-4225-ab41-5e575be188d9', 9, 'zucker', 1, 'Prise', null),
  ('98028916-4846-4225-ab41-5e575be188d9', 10, 'salz', null, null, null),
  ('98028916-4846-4225-ab41-5e575be188d9', 11, 'pfeffer', null, null, null),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 1, 'roemersalat', 2, null, null),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 2, 'haehnchenbrust', 300, 'g', null),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 3, 'toastbrot', 2, 'Scheibe', null),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 4, 'knoblauch', 1, 'Zehe', null),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 5, 'parmesan', 40, 'g', null),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 6, 'mayonnaise', 3, 'EL', null),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 7, 'joghurt', 2, 'EL', null),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 8, 'zitrone', 0.5, null, null),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 9, 'senf', 1, 'TL', null),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 10, 'olivenoel', 3, 'EL', null),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 11, 'salz', null, null, null),
  ('46e71092-9875-405c-aa3e-b1e486ba7a6b', 12, 'pfeffer', null, null, null),
  ('1b9b274b-1ebf-400c-abd2-842d7990b54a', 1, 'couscous', 200, 'g', null),
  ('1b9b274b-1ebf-400c-abd2-842d7990b54a', 2, 'gemuesebruehe', 250, 'ml', null),
  ('1b9b274b-1ebf-400c-abd2-842d7990b54a', 3, 'gurke', 0.5, null, null),
  ('1b9b274b-1ebf-400c-abd2-842d7990b54a', 4, 'tomate', 2, null, null),
  ('1b9b274b-1ebf-400c-abd2-842d7990b54a', 5, 'fruehlingszwiebel', 3, null, null),
  ('1b9b274b-1ebf-400c-abd2-842d7990b54a', 6, 'petersilie', 1, 'Bund', null),
  ('1b9b274b-1ebf-400c-abd2-842d7990b54a', 7, 'minze', 0.5, 'Bund', null),
  ('1b9b274b-1ebf-400c-abd2-842d7990b54a', 8, 'zitrone', 1, null, null),
  ('1b9b274b-1ebf-400c-abd2-842d7990b54a', 9, 'olivenoel', 4, 'EL', null),
  ('1b9b274b-1ebf-400c-abd2-842d7990b54a', 10, 'salz', null, null, null),
  ('1b9b274b-1ebf-400c-abd2-842d7990b54a', 11, 'pfeffer', null, null, null),
  ('201fe2fb-ef9c-4ab7-af2c-041a7010944b', 1, 'tellerlinsen', 200, 'g', null),
  ('201fe2fb-ef9c-4ab7-af2c-041a7010944b', 2, 'paprika', 1, null, null),
  ('201fe2fb-ef9c-4ab7-af2c-041a7010944b', 3, 'rote_zwiebel', 1, null, null),
  ('201fe2fb-ef9c-4ab7-af2c-041a7010944b', 4, 'feta', 150, 'g', null),
  ('201fe2fb-ef9c-4ab7-af2c-041a7010944b', 5, 'petersilie', 1, 'Bund', null),
  ('201fe2fb-ef9c-4ab7-af2c-041a7010944b', 6, 'essig', 3, 'EL', null),
  ('201fe2fb-ef9c-4ab7-af2c-041a7010944b', 7, 'senf', 1, 'TL', null),
  ('201fe2fb-ef9c-4ab7-af2c-041a7010944b', 8, 'olivenoel', 4, 'EL', null),
  ('201fe2fb-ef9c-4ab7-af2c-041a7010944b', 9, 'salz', null, null, null),
  ('201fe2fb-ef9c-4ab7-af2c-041a7010944b', 10, 'pfeffer', null, null, null),
  ('90a6fd93-1c55-461c-aae6-85acb9989151', 1, 'tomate', 4, null, null),
  ('90a6fd93-1c55-461c-aae6-85acb9989151', 2, 'mozzarella', 250, 'g', null),
  ('90a6fd93-1c55-461c-aae6-85acb9989151', 3, 'basilikum', 1, 'Bund', null),
  ('90a6fd93-1c55-461c-aae6-85acb9989151', 4, 'olivenoel', 3, 'EL', null),
  ('90a6fd93-1c55-461c-aae6-85acb9989151', 5, 'balsamico', 1, 'EL', null),
  ('90a6fd93-1c55-461c-aae6-85acb9989151', 6, 'baguette', 0.5, null, null),
  ('90a6fd93-1c55-461c-aae6-85acb9989151', 7, 'salz', null, null, null),
  ('90a6fd93-1c55-461c-aae6-85acb9989151', 8, 'pfeffer', null, null, null),
  ('bee26fe9-0196-4531-a52b-f12099bde428', 1, 'thunfisch', 1, 'Dose', null),
  ('bee26fe9-0196-4531-a52b-f12099bde428', 2, 'weisse_bohnen', 1, 'Dose', null),
  ('bee26fe9-0196-4531-a52b-f12099bde428', 3, 'rote_zwiebel', 1, null, null),
  ('bee26fe9-0196-4531-a52b-f12099bde428', 4, 'kirschtomaten', 200, 'g', null),
  ('bee26fe9-0196-4531-a52b-f12099bde428', 5, 'petersilie', 0.5, 'Bund', null),
  ('bee26fe9-0196-4531-a52b-f12099bde428', 6, 'zitrone', 1, null, null),
  ('bee26fe9-0196-4531-a52b-f12099bde428', 7, 'olivenoel', 3, 'EL', null),
  ('bee26fe9-0196-4531-a52b-f12099bde428', 8, 'salz', null, null, null),
  ('bee26fe9-0196-4531-a52b-f12099bde428', 9, 'pfeffer', null, null, null),
  ('e7e32c8d-3458-4c8c-a529-58f8c089ce5c', 1, 'gurke', 1, null, null),
  ('e7e32c8d-3458-4c8c-a529-58f8c089ce5c', 2, 'tofu', 200, 'g', null),
  ('e7e32c8d-3458-4c8c-a529-58f8c089ce5c', 3, 'speisestaerke', 1, 'EL', null),
  ('e7e32c8d-3458-4c8c-a529-58f8c089ce5c', 4, 'sojasauce', 3, 'EL', null),
  ('e7e32c8d-3458-4c8c-a529-58f8c089ce5c', 5, 'essig', 1, 'EL', null),
  ('e7e32c8d-3458-4c8c-a529-58f8c089ce5c', 6, 'sesamoel', 1, 'TL', null),
  ('e7e32c8d-3458-4c8c-a529-58f8c089ce5c', 7, 'ahornsirup', 1, 'TL', null),
  ('e7e32c8d-3458-4c8c-a529-58f8c089ce5c', 8, 'knoblauch', 1, 'Zehe', null),
  ('e7e32c8d-3458-4c8c-a529-58f8c089ce5c', 9, 'chiliflocken', 0.5, 'TL', null),
  ('e7e32c8d-3458-4c8c-a529-58f8c089ce5c', 10, 'sesam', 1, 'EL', null),
  ('e7e32c8d-3458-4c8c-a529-58f8c089ce5c', 11, 'oel', 2, 'EL', null),
  ('8af90b88-4d79-476b-a975-e17acdda5a55', 1, 'rote_bete', 400, 'g', null),
  ('8af90b88-4d79-476b-a975-e17acdda5a55', 2, 'ziegenkaese', 150, 'g', null),
  ('8af90b88-4d79-476b-a975-e17acdda5a55', 3, 'rucola', 75, 'g', null),
  ('8af90b88-4d79-476b-a975-e17acdda5a55', 4, 'walnuesse', 50, 'g', null),
  ('8af90b88-4d79-476b-a975-e17acdda5a55', 5, 'honig', 2, 'EL', null),
  ('8af90b88-4d79-476b-a975-e17acdda5a55', 6, 'balsamico', 2, 'EL', null),
  ('8af90b88-4d79-476b-a975-e17acdda5a55', 7, 'olivenoel', 3, 'EL', null),
  ('8af90b88-4d79-476b-a975-e17acdda5a55', 8, 'apfel', 1, null, null),
  ('8af90b88-4d79-476b-a975-e17acdda5a55', 9, 'salz', null, null, null),
  ('8af90b88-4d79-476b-a975-e17acdda5a55', 10, 'pfeffer', null, null, null),
  ('ed54bac9-659a-4914-ae27-e6df69ac285b', 1, 'quinoa', 150, 'g', null),
  ('ed54bac9-659a-4914-ae27-e6df69ac285b', 2, 'avocado', 1, null, null),
  ('ed54bac9-659a-4914-ae27-e6df69ac285b', 3, 'mais', 1, 'Dose', null),
  ('ed54bac9-659a-4914-ae27-e6df69ac285b', 4, 'kidneybohnen', 1, 'Dose', null),
  ('ed54bac9-659a-4914-ae27-e6df69ac285b', 5, 'paprika', 1, null, null),
  ('ed54bac9-659a-4914-ae27-e6df69ac285b', 6, 'rote_zwiebel', 1, null, null),
  ('ed54bac9-659a-4914-ae27-e6df69ac285b', 7, 'limette', 2, null, null),
  ('ed54bac9-659a-4914-ae27-e6df69ac285b', 8, 'koriander', 0.5, 'Bund', null),
  ('ed54bac9-659a-4914-ae27-e6df69ac285b', 9, 'kreuzkuemmel', 0.5, 'TL', null),
  ('ed54bac9-659a-4914-ae27-e6df69ac285b', 10, 'olivenoel', 3, 'EL', null),
  ('ed54bac9-659a-4914-ae27-e6df69ac285b', 11, 'salz', null, null, null),
  ('ee0c9cb1-c549-4287-aa7d-df0aee066313', 1, 'fleischwurst', 250, 'g', null),
  ('ee0c9cb1-c549-4287-aa7d-df0aee066313', 2, 'bergkaese', 100, 'g', null),
  ('ee0c9cb1-c549-4287-aa7d-df0aee066313', 3, 'zwiebel', 1, null, null),
  ('ee0c9cb1-c549-4287-aa7d-df0aee066313', 4, 'gewuerzgurken', 3, null, null),
  ('ee0c9cb1-c549-4287-aa7d-df0aee066313', 5, 'essig', 4, 'EL', null),
  ('ee0c9cb1-c549-4287-aa7d-df0aee066313', 6, 'oel', 3, 'EL', null),
  ('ee0c9cb1-c549-4287-aa7d-df0aee066313', 7, 'senf', 1, 'TL', null),
  ('ee0c9cb1-c549-4287-aa7d-df0aee066313', 8, 'schnittlauch', 0.5, 'Bund', null),
  ('ee0c9cb1-c549-4287-aa7d-df0aee066313', 9, 'bauernbrot', 2, 'Scheibe', null),
  ('ee0c9cb1-c549-4287-aa7d-df0aee066313', 10, 'salz', null, null, null),
  ('ee0c9cb1-c549-4287-aa7d-df0aee066313', 11, 'pfeffer', null, null, null),
  ('7dc3505f-2a0e-46f4-aff1-68f951303f64', 1, 'gruene_bohnen', 300, 'g', null),
  ('7dc3505f-2a0e-46f4-aff1-68f951303f64', 2, 'weisse_bohnen', 1, 'Dose', null),
  ('7dc3505f-2a0e-46f4-aff1-68f951303f64', 3, 'kidneybohnen', 1, 'Dose', null),
  ('7dc3505f-2a0e-46f4-aff1-68f951303f64', 4, 'rote_zwiebel', 1, null, null),
  ('7dc3505f-2a0e-46f4-aff1-68f951303f64', 5, 'petersilie', 1, 'Bund', null),
  ('7dc3505f-2a0e-46f4-aff1-68f951303f64', 6, 'essig', 4, 'EL', null),
  ('7dc3505f-2a0e-46f4-aff1-68f951303f64', 7, 'senf', 1, 'TL', null),
  ('7dc3505f-2a0e-46f4-aff1-68f951303f64', 8, 'olivenoel', 4, 'EL', null),
  ('7dc3505f-2a0e-46f4-aff1-68f951303f64', 9, 'zucker', 1, 'Prise', null),
  ('7dc3505f-2a0e-46f4-aff1-68f951303f64', 10, 'salz', null, null, null),
  ('7dc3505f-2a0e-46f4-aff1-68f951303f64', 11, 'pfeffer', null, null, null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 1, 'lasagneplatten', 250, 'g', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 2, 'hackfleisch', 500, 'g', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 3, 'zwiebel', 1, null, null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 4, 'karotte', 1, null, null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 5, 'knoblauch', 2, 'Zehe', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 6, 'passierte_tomaten', 700, 'ml', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 7, 'tomatenmark', 2, 'EL', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 8, 'butter', 50, 'g', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 9, 'mehl', 50, 'g', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 10, 'milch', 600, 'ml', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 11, 'mozzarella', 125, 'g', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 12, 'parmesan', 50, 'g', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 13, 'oregano', 1, 'TL', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 14, 'muskat', 1, 'Prise', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 15, 'olivenoel', 2, 'EL', null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 16, 'salz', null, null, null),
  ('dee0631a-8d39-47d5-ab3e-c593fc1b4f9c', 17, 'pfeffer', null, null, null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 1, 'lasagneplatten', 250, 'g', null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 2, 'zucchini', 2, null, null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 3, 'paprika', 2, null, null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 4, 'zwiebel', 1, null, null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 5, 'spinat_tk', 300, 'g', null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 6, 'gehackte_tomaten', 2, 'Dose', null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 7, 'quark', 250, 'g', null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 8, 'eier', 1, null, null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 9, 'mozzarella', 250, 'g', null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 10, 'parmesan', 40, 'g', null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 11, 'knoblauch', 2, 'Zehe', null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 12, 'oregano', 1, 'TL', null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 13, 'olivenoel', 3, 'EL', null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 14, 'muskat', 1, 'Prise', null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 15, 'salz', null, null, null),
  ('d87e171d-b2ff-48b3-a35b-7078b5b4dd83', 16, 'pfeffer', null, null, null),
  ('453263d1-99dd-4aab-a3b5-4680654b7690', 1, 'penne', 400, 'g', null),
  ('453263d1-99dd-4aab-a3b5-4680654b7690', 2, 'schinken', 200, 'g', null),
  ('453263d1-99dd-4aab-a3b5-4680654b7690', 3, 'erbsen_tk', 150, 'g', null),
  ('453263d1-99dd-4aab-a3b5-4680654b7690', 4, 'sahne', 200, 'ml', null),
  ('453263d1-99dd-4aab-a3b5-4680654b7690', 5, 'milch', 200, 'ml', null),
  ('453263d1-99dd-4aab-a3b5-4680654b7690', 6, 'eier', 2, null, null),
  ('453263d1-99dd-4aab-a3b5-4680654b7690', 7, 'reibekaese', 150, 'g', null),
  ('453263d1-99dd-4aab-a3b5-4680654b7690', 8, 'muskat', 1, 'Prise', null),
  ('453263d1-99dd-4aab-a3b5-4680654b7690', 9, 'schnittlauch', 0.5, 'Bund', null),
  ('453263d1-99dd-4aab-a3b5-4680654b7690', 10, 'salz', null, null, null),
  ('453263d1-99dd-4aab-a3b5-4680654b7690', 11, 'pfeffer', null, null, null),
  ('93d52b82-a042-4be0-ab28-c670003ef0f5', 1, 'paprika', 4, null, null),
  ('93d52b82-a042-4be0-ab28-c670003ef0f5', 2, 'hackfleisch', 400, 'g', null),
  ('93d52b82-a042-4be0-ab28-c670003ef0f5', 3, 'reis', 80, 'g', null),
  ('93d52b82-a042-4be0-ab28-c670003ef0f5', 4, 'zwiebel', 1, null, null),
  ('93d52b82-a042-4be0-ab28-c670003ef0f5', 5, 'eier', 1, null, null),
  ('93d52b82-a042-4be0-ab28-c670003ef0f5', 6, 'passierte_tomaten', 500, 'ml', null),
  ('93d52b82-a042-4be0-ab28-c670003ef0f5', 7, 'paprikapulver', 1, 'TL', null),
  ('93d52b82-a042-4be0-ab28-c670003ef0f5', 8, 'reibekaese', 80, 'g', null),
  ('93d52b82-a042-4be0-ab28-c670003ef0f5', 9, 'petersilie', 0.5, 'Bund', null),
  ('93d52b82-a042-4be0-ab28-c670003ef0f5', 10, 'salz', null, null, null),
  ('93d52b82-a042-4be0-ab28-c670003ef0f5', 11, 'pfeffer', null, null, null),
  ('6d6f57af-ead9-48bf-a83a-b4469053aeab', 1, 'zucchini', 1, null, null),
  ('6d6f57af-ead9-48bf-a83a-b4469053aeab', 2, 'paprika', 2, null, null),
  ('6d6f57af-ead9-48bf-a83a-b4469053aeab', 3, 'rote_zwiebel', 2, null, null),
  ('6d6f57af-ead9-48bf-a83a-b4469053aeab', 4, 'kirschtomaten', 250, 'g', null),
  ('6d6f57af-ead9-48bf-a83a-b4469053aeab', 5, 'kartoffel', 400, 'g', null),
  ('6d6f57af-ead9-48bf-a83a-b4469053aeab', 6, 'feta', 200, 'g', null),
  ('6d6f57af-ead9-48bf-a83a-b4469053aeab', 7, 'rosmarin', 2, 'Zweig', null),
  ('6d6f57af-ead9-48bf-a83a-b4469053aeab', 8, 'knoblauch', 3, 'Zehe', null),
  ('6d6f57af-ead9-48bf-a83a-b4469053aeab', 9, 'olivenoel', 4, 'EL', null),
  ('6d6f57af-ead9-48bf-a83a-b4469053aeab', 10, 'salz', null, null, null),
  ('6d6f57af-ead9-48bf-a83a-b4469053aeab', 11, 'pfeffer', null, null, null),
  ('aac1e868-8476-4160-a976-e244d124e404', 1, 'haehnchenschenkel', 4, null, null),
  ('aac1e868-8476-4160-a976-e244d124e404', 2, 'kartoffel', 800, 'g', null),
  ('aac1e868-8476-4160-a976-e244d124e404', 3, 'zitrone', 2, null, null),
  ('aac1e868-8476-4160-a976-e244d124e404', 4, 'knoblauch', 6, 'Zehe', null),
  ('aac1e868-8476-4160-a976-e244d124e404', 5, 'thymian', 5, 'Zweig', null),
  ('aac1e868-8476-4160-a976-e244d124e404', 6, 'rote_zwiebel', 2, null, null),
  ('aac1e868-8476-4160-a976-e244d124e404', 7, 'olivenoel', 4, 'EL', null),
  ('aac1e868-8476-4160-a976-e244d124e404', 8, 'paprikapulver', 1, 'TL', null),
  ('aac1e868-8476-4160-a976-e244d124e404', 9, 'salz', null, null, null),
  ('aac1e868-8476-4160-a976-e244d124e404', 10, 'pfeffer', null, null, null),
  ('ef7024f3-c02c-4f6c-adc6-cf8afac54e2c', 1, 'brokkoli', 1, null, null),
  ('ef7024f3-c02c-4f6c-adc6-cf8afac54e2c', 2, 'kartoffel', 800, 'g', null),
  ('ef7024f3-c02c-4f6c-adc6-cf8afac54e2c', 3, 'sahne', 200, 'ml', null),
  ('ef7024f3-c02c-4f6c-adc6-cf8afac54e2c', 4, 'milch', 200, 'ml', null),
  ('ef7024f3-c02c-4f6c-adc6-cf8afac54e2c', 5, 'eier', 2, null, null),
  ('ef7024f3-c02c-4f6c-adc6-cf8afac54e2c', 6, 'reibekaese', 150, 'g', null),
  ('ef7024f3-c02c-4f6c-adc6-cf8afac54e2c', 7, 'muskat', 1, 'Prise', null),
  ('ef7024f3-c02c-4f6c-adc6-cf8afac54e2c', 8, 'butter', 1, 'EL', null),
  ('ef7024f3-c02c-4f6c-adc6-cf8afac54e2c', 9, 'salz', null, null, null),
  ('ef7024f3-c02c-4f6c-adc6-cf8afac54e2c', 10, 'pfeffer', null, null, null),
  ('2c10def2-a2c6-442f-a666-c2124d682d22', 1, 'lachs', 2, null, '2 Filets à 150 g'),
  ('2c10def2-a2c6-442f-a666-c2124d682d22', 2, 'zucchini', 1, null, null),
  ('2c10def2-a2c6-442f-a666-c2124d682d22', 3, 'kirschtomaten', 250, 'g', null),
  ('2c10def2-a2c6-442f-a666-c2124d682d22', 4, 'zitrone', 1, null, null),
  ('2c10def2-a2c6-442f-a666-c2124d682d22', 5, 'dill', 0.5, 'Bund', null),
  ('2c10def2-a2c6-442f-a666-c2124d682d22', 6, 'knoblauch', 1, 'Zehe', null),
  ('2c10def2-a2c6-442f-a666-c2124d682d22', 7, 'olivenoel', 3, 'EL', null),
  ('2c10def2-a2c6-442f-a666-c2124d682d22', 8, 'reis', 120, 'g', null),
  ('2c10def2-a2c6-442f-a666-c2124d682d22', 9, 'salz', null, null, null),
  ('2c10def2-a2c6-442f-a666-c2124d682d22', 10, 'pfeffer', null, null, null),
  ('8d92253d-0196-4939-afd3-2a936dd2fa29', 1, 'suesskartoffel', 2, null, null),
  ('8d92253d-0196-4939-afd3-2a936dd2fa29', 2, 'kichererbsen', 1, 'Dose', null),
  ('8d92253d-0196-4939-afd3-2a936dd2fa29', 3, 'paprikapulver', 1, 'TL', null),
  ('8d92253d-0196-4939-afd3-2a936dd2fa29', 4, 'kreuzkuemmel', 1, 'TL', null),
  ('8d92253d-0196-4939-afd3-2a936dd2fa29', 5, 'sojajoghurt', 150, 'g', null),
  ('8d92253d-0196-4939-afd3-2a936dd2fa29', 6, 'tahini', 1, 'EL', null),
  ('8d92253d-0196-4939-afd3-2a936dd2fa29', 7, 'zitrone', 0.5, null, null),
  ('8d92253d-0196-4939-afd3-2a936dd2fa29', 8, 'spinat', 50, 'g', null),
  ('8d92253d-0196-4939-afd3-2a936dd2fa29', 9, 'olivenoel', 3, 'EL', null),
  ('8d92253d-0196-4939-afd3-2a936dd2fa29', 10, 'salz', null, null, null),
  ('8d92253d-0196-4939-afd3-2a936dd2fa29', 11, 'pfeffer', null, null, null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 1, 'aubergine', 3, null, null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 2, 'kartoffel', 400, 'g', null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 3, 'rinderhack', 500, 'g', null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 4, 'zwiebel', 1, null, null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 5, 'knoblauch', 2, 'Zehe', null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 6, 'gehackte_tomaten', 1, 'Dose', null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 7, 'zimt', 0.5, 'TL', null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 8, 'oregano', 1, 'TL', null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 9, 'butter', 50, 'g', null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 10, 'mehl', 50, 'g', null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 11, 'milch', 500, 'ml', null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 12, 'eier', 1, null, null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 13, 'parmesan', 50, 'g', null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 14, 'olivenoel', 5, 'EL', null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 15, 'muskat', 1, 'Prise', null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 16, 'salz', null, null, null),
  ('c874ed1b-6ed1-4f65-a591-f0d9b7c3f26e', 17, 'pfeffer', null, null, null),
  ('42c7ca93-4ccc-4709-aa8d-612495a92db7', 1, 'zucchini', 3, null, null),
  ('42c7ca93-4ccc-4709-aa8d-612495a92db7', 2, 'hackfleisch', 400, 'g', null),
  ('42c7ca93-4ccc-4709-aa8d-612495a92db7', 3, 'zwiebel', 1, null, null),
  ('42c7ca93-4ccc-4709-aa8d-612495a92db7', 4, 'knoblauch', 1, 'Zehe', null),
  ('42c7ca93-4ccc-4709-aa8d-612495a92db7', 5, 'passierte_tomaten', 400, 'ml', null),
  ('42c7ca93-4ccc-4709-aa8d-612495a92db7', 6, 'oregano', 1, 'TL', null),
  ('42c7ca93-4ccc-4709-aa8d-612495a92db7', 7, 'mozzarella', 250, 'g', null),
  ('42c7ca93-4ccc-4709-aa8d-612495a92db7', 8, 'schmand', 150, 'g', null),
  ('42c7ca93-4ccc-4709-aa8d-612495a92db7', 9, 'olivenoel', 1, 'EL', null),
  ('42c7ca93-4ccc-4709-aa8d-612495a92db7', 10, 'salz', null, null, null),
  ('42c7ca93-4ccc-4709-aa8d-612495a92db7', 11, 'pfeffer', null, null, null),
  ('bd62c90c-c16b-48ff-adbe-5f78430dbd2a', 1, 'blumenkohl', 1, null, null),
  ('bd62c90c-c16b-48ff-adbe-5f78430dbd2a', 2, 'butter', 40, 'g', null),
  ('bd62c90c-c16b-48ff-adbe-5f78430dbd2a', 3, 'mehl', 40, 'g', null),
  ('bd62c90c-c16b-48ff-adbe-5f78430dbd2a', 4, 'milch', 500, 'ml', null),
  ('bd62c90c-c16b-48ff-adbe-5f78430dbd2a', 5, 'cheddar', 150, 'g', null),
  ('bd62c90c-c16b-48ff-adbe-5f78430dbd2a', 6, 'senf', 1, 'TL', null),
  ('bd62c90c-c16b-48ff-adbe-5f78430dbd2a', 7, 'semmelbroesel', 3, 'EL', null),
  ('bd62c90c-c16b-48ff-adbe-5f78430dbd2a', 8, 'muskat', 1, 'Prise', null),
  ('bd62c90c-c16b-48ff-adbe-5f78430dbd2a', 9, 'salz', null, null, null),
  ('bd62c90c-c16b-48ff-adbe-5f78430dbd2a', 10, 'pfeffer', null, null, null),
  ('e26237f2-799e-4e92-a8eb-90de336aef57', 1, 'mehl', 200, 'g', null),
  ('e26237f2-799e-4e92-a8eb-90de336aef57', 2, 'butter', 100, 'g', null),
  ('e26237f2-799e-4e92-a8eb-90de336aef57', 3, 'eier', 4, null, null),
  ('e26237f2-799e-4e92-a8eb-90de336aef57', 4, 'speck', 150, 'g', null),
  ('e26237f2-799e-4e92-a8eb-90de336aef57', 5, 'zwiebel', 2, null, null),
  ('e26237f2-799e-4e92-a8eb-90de336aef57', 6, 'sahne', 200, 'ml', null),
  ('e26237f2-799e-4e92-a8eb-90de336aef57', 7, 'milch', 100, 'ml', null),
  ('e26237f2-799e-4e92-a8eb-90de336aef57', 8, 'bergkaese', 100, 'g', null),
  ('e26237f2-799e-4e92-a8eb-90de336aef57', 9, 'muskat', 1, 'Prise', null),
  ('e26237f2-799e-4e92-a8eb-90de336aef57', 10, 'salz', null, null, null),
  ('e26237f2-799e-4e92-a8eb-90de336aef57', 11, 'pfeffer', null, null, null),
  ('d942571a-24b9-4633-aa9f-6aec0b6cf6f6', 1, 'mehl', 200, 'g', null),
  ('d942571a-24b9-4633-aa9f-6aec0b6cf6f6', 2, 'butter', 100, 'g', null),
  ('d942571a-24b9-4633-aa9f-6aec0b6cf6f6', 3, 'eier', 4, null, null),
  ('d942571a-24b9-4633-aa9f-6aec0b6cf6f6', 4, 'spinat_tk', 450, 'g', null),
  ('d942571a-24b9-4633-aa9f-6aec0b6cf6f6', 5, 'feta', 200, 'g', null),
  ('d942571a-24b9-4633-aa9f-6aec0b6cf6f6', 6, 'zwiebel', 1, null, null),
  ('d942571a-24b9-4633-aa9f-6aec0b6cf6f6', 7, 'knoblauch', 1, 'Zehe', null),
  ('d942571a-24b9-4633-aa9f-6aec0b6cf6f6', 8, 'sahne', 200, 'ml', null),
  ('d942571a-24b9-4633-aa9f-6aec0b6cf6f6', 9, 'muskat', 1, 'Prise', null),
  ('d942571a-24b9-4633-aa9f-6aec0b6cf6f6', 10, 'salz', null, null, null),
  ('d942571a-24b9-4633-aa9f-6aec0b6cf6f6', 11, 'pfeffer', null, null, null),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 1, 'suesskartoffel', 1, null, null),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 2, 'paprika', 1, null, null),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 3, 'zuckerschoten', 150, 'g', null),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 4, 'zwiebel', 1, null, null),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 5, 'rote_currypaste', 2, 'EL', null),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 6, 'kokosmilch', 400, 'ml', null),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 7, 'gemuesebruehe', 150, 'ml', null),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 8, 'limette', 1, null, null),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 9, 'basmati', 200, 'g', null),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 10, 'koriander', 0.5, 'Bund', null),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 11, 'sojasauce', 1, 'EL', null),
  ('e5c794bc-6147-40e9-a381-69c3260fddf2', 12, 'oel', 1, 'EL', null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 1, 'haehnchenbrust', 600, 'g', null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 2, 'joghurt', 150, 'g', null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 3, 'zwiebel', 1, null, null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 4, 'knoblauch', 3, 'Zehe', null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 5, 'ingwer', 20, 'g', null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 6, 'garam_masala', 2, 'TL', null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 7, 'kurkuma', 1, 'TL', null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 8, 'passierte_tomaten', 400, 'ml', null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 9, 'sahne', 150, 'ml', null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 10, 'butter', 30, 'g', null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 11, 'basmati', 300, 'g', null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 12, 'koriander', 0.5, 'Bund', null),
  ('fe6313b2-7c46-43b6-aedf-1e885f184e27', 13, 'salz', null, null, null),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 1, 'reisnudeln', 200, 'g', null),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 2, 'erdnussbutter', 3, 'EL', null),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 3, 'sojasauce', 3, 'EL', null),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 4, 'limette', 1, null, null),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 5, 'ahornsirup', 1, 'EL', null),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 6, 'knoblauch', 1, 'Zehe', null),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 7, 'karotte', 1, null, null),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 8, 'paprika', 1, null, null),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 9, 'fruehlingszwiebel', 3, null, null),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 10, 'erdnuesse', 30, 'g', null),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 11, 'chiliflocken', 0.5, 'TL', null),
  ('5a6cbc10-e630-4838-a71f-80ee2b510d8b', 12, 'oel', 1, 'EL', null),
  ('dcb320f8-b4d5-4aa3-a7b3-bdb10b6bd843', 1, 'mie_nudeln', 200, 'g', null),
  ('dcb320f8-b4d5-4aa3-a7b3-bdb10b6bd843', 2, 'haehnchenbrust', 250, 'g', null),
  ('dcb320f8-b4d5-4aa3-a7b3-bdb10b6bd843', 3, 'pak_choi', 2, null, null),
  ('dcb320f8-b4d5-4aa3-a7b3-bdb10b6bd843', 4, 'karotte', 1, null, null),
  ('dcb320f8-b4d5-4aa3-a7b3-bdb10b6bd843', 5, 'fruehlingszwiebel', 2, null, null),
  ('dcb320f8-b4d5-4aa3-a7b3-bdb10b6bd843', 6, 'knoblauch', 1, 'Zehe', null),
  ('dcb320f8-b4d5-4aa3-a7b3-bdb10b6bd843', 7, 'ingwer', 10, 'g', null),
  ('dcb320f8-b4d5-4aa3-a7b3-bdb10b6bd843', 8, 'sojasauce', 4, 'EL', null),
  ('dcb320f8-b4d5-4aa3-a7b3-bdb10b6bd843', 9, 'honig', 1, 'TL', null),
  ('dcb320f8-b4d5-4aa3-a7b3-bdb10b6bd843', 10, 'sesamoel', 1, 'TL', null),
  ('dcb320f8-b4d5-4aa3-a7b3-bdb10b6bd843', 11, 'oel', 2, 'EL', null),
  ('729491f1-bad0-457a-a471-31e02e9be634', 1, 'geschnetzeltes', 500, 'g', null),
  ('729491f1-bad0-457a-a471-31e02e9be634', 2, 'champignons', 250, 'g', null),
  ('729491f1-bad0-457a-a471-31e02e9be634', 3, 'zwiebel', 1, null, null),
  ('729491f1-bad0-457a-a471-31e02e9be634', 4, 'weisswein', 100, 'ml', null),
  ('729491f1-bad0-457a-a471-31e02e9be634', 5, 'sahne', 200, 'ml', null),
  ('729491f1-bad0-457a-a471-31e02e9be634', 6, 'mehl', 1, 'EL', null),
  ('729491f1-bad0-457a-a471-31e02e9be634', 7, 'butter', 20, 'g', null),
  ('729491f1-bad0-457a-a471-31e02e9be634', 8, 'petersilie', 0.5, 'Bund', null),
  ('729491f1-bad0-457a-a471-31e02e9be634', 9, 'spaetzle', 500, 'g', null),
  ('729491f1-bad0-457a-a471-31e02e9be634', 10, 'oel', 2, 'EL', null),
  ('729491f1-bad0-457a-a471-31e02e9be634', 11, 'salz', null, null, null),
  ('729491f1-bad0-457a-a471-31e02e9be634', 12, 'pfeffer', null, null, null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 1, 'eier', 4, null, null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 2, 'gehackte_tomaten', 1, 'Dose', null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 3, 'paprika', 1, null, null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 4, 'zwiebel', 1, null, null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 5, 'knoblauch', 2, 'Zehe', null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 6, 'kreuzkuemmel', 1, 'TL', null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 7, 'paprikapulver', 1, 'TL', null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 8, 'chiliflocken', 0.5, 'TL', null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 9, 'feta', 60, 'g', null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 10, 'petersilie', 0.5, 'Bund', null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 11, 'olivenoel', 2, 'EL', null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 12, 'baguette', 0.5, null, null),
  ('97b9322c-cab7-4cbd-a1b5-a9419acd23f4', 13, 'salz', null, null, null),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 1, 'tofu', 250, 'g', null),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 2, 'brokkoli', 0.5, null, null),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 3, 'paprika', 1, null, null),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 4, 'karotte', 1, null, null),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 5, 'sojasauce', 4, 'EL', null),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 6, 'ahornsirup', 2, 'EL', null),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 7, 'ingwer', 10, 'g', null),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 8, 'knoblauch', 1, 'Zehe', null),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 9, 'speisestaerke', 2, 'TL', null),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 10, 'reis', 150, 'g', null),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 11, 'sesam', 1, 'EL', null),
  ('4e1e002c-8218-4800-a7f3-956ec781c6d3', 12, 'oel', 2, 'EL', null),
  ('df8c38ce-af05-40fb-a9d8-c285ee4775fa', 1, 'garnelen', 300, 'g', null),
  ('df8c38ce-af05-40fb-a9d8-c285ee4775fa', 2, 'knoblauch', 4, 'Zehe', null),
  ('df8c38ce-af05-40fb-a9d8-c285ee4775fa', 3, 'chili', 1, null, null),
  ('df8c38ce-af05-40fb-a9d8-c285ee4775fa', 4, 'olivenoel', 5, 'EL', null),
  ('df8c38ce-af05-40fb-a9d8-c285ee4775fa', 5, 'zitrone', 0.5, null, null),
  ('df8c38ce-af05-40fb-a9d8-c285ee4775fa', 6, 'petersilie', 0.5, 'Bund', null),
  ('df8c38ce-af05-40fb-a9d8-c285ee4775fa', 7, 'baguette', 1, null, null),
  ('df8c38ce-af05-40fb-a9d8-c285ee4775fa', 8, 'salz', null, null, null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 1, 'reisnudeln', 200, 'g', null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 2, 'tofu', 150, 'g', null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 3, 'eier', 2, null, null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 4, 'fruehlingszwiebel', 3, null, null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 5, 'knoblauch', 2, 'Zehe', null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 6, 'sojasauce', 3, 'EL', null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 7, 'zucker', 1, 'EL', null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 8, 'limette', 1, null, null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 9, 'tomatenmark', 1, 'TL', null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 10, 'erdnuesse', 40, 'g', null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 11, 'koriander', 0.5, 'Bund', null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 12, 'chiliflocken', 0.5, 'TL', null),
  ('838ef3a5-2509-49f1-aad6-a77783850158', 13, 'oel', 3, 'EL', null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 1, 'hackfleisch', 500, 'g', null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 2, 'broetchen', 1, null, null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 3, 'zwiebel', 1, null, null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 4, 'eier', 1, null, null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 5, 'senf', 1, 'TL', null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 6, 'majoran', 1, 'TL', null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 7, 'gurke', 1, null, null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 8, 'joghurt', 150, 'g', null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 9, 'dill', 0.5, 'Bund', null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 10, 'essig', 1, 'EL', null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 11, 'oel', 3, 'EL', null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 12, 'salz', null, null, null),
  ('26d2757d-295a-4228-afbd-7fd5cdcab520', 13, 'pfeffer', null, null, null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 1, 'kichererbsen', 2, 'Dose', null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 2, 'gehackte_tomaten', 1, 'Dose', null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 3, 'zwiebel', 2, null, null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 4, 'knoblauch', 3, 'Zehe', null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 5, 'ingwer', 20, 'g', null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 6, 'garam_masala', 2, 'TL', null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 7, 'kreuzkuemmel', 1, 'TL', null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 8, 'kurkuma', 0.5, 'TL', null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 9, 'chiliflocken', 0.5, 'TL', null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 10, 'zitrone', 0.5, null, null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 11, 'koriander', 0.5, 'Bund', null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 12, 'basmati', 200, 'g', null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 13, 'oel', 2, 'EL', null),
  ('c4c00d25-21da-4fda-a358-557d6ecc434e', 14, 'salz', null, null, null),
  ('8db737dd-29eb-4b03-aa55-ff46ae1c15e5', 1, 'schnitzel', 4, null, null),
  ('8db737dd-29eb-4b03-aa55-ff46ae1c15e5', 2, 'mehl', 50, 'g', null),
  ('8db737dd-29eb-4b03-aa55-ff46ae1c15e5', 3, 'eier', 2, null, null),
  ('8db737dd-29eb-4b03-aa55-ff46ae1c15e5', 4, 'semmelbroesel', 100, 'g', null),
  ('8db737dd-29eb-4b03-aa55-ff46ae1c15e5', 5, 'butter', 30, 'g', null),
  ('8db737dd-29eb-4b03-aa55-ff46ae1c15e5', 6, 'oel', 150, 'ml', null),
  ('8db737dd-29eb-4b03-aa55-ff46ae1c15e5', 7, 'zitrone', 1, null, null),
  ('8db737dd-29eb-4b03-aa55-ff46ae1c15e5', 8, 'salz', null, null, null),
  ('8db737dd-29eb-4b03-aa55-ff46ae1c15e5', 9, 'pfeffer', null, null, null),
  ('a79d5cd5-520c-43b0-ae6c-82a0ee21c7d1', 1, 'broetchen', 5, null, null),
  ('a79d5cd5-520c-43b0-ae6c-82a0ee21c7d1', 2, 'milch', 250, 'ml', null),
  ('a79d5cd5-520c-43b0-ae6c-82a0ee21c7d1', 3, 'eier', 2, null, null),
  ('a79d5cd5-520c-43b0-ae6c-82a0ee21c7d1', 4, 'zwiebel', 2, null, null),
  ('a79d5cd5-520c-43b0-ae6c-82a0ee21c7d1', 5, 'petersilie', 1, 'Bund', null),
  ('a79d5cd5-520c-43b0-ae6c-82a0ee21c7d1', 6, 'champignons', 500, 'g', null),
  ('a79d5cd5-520c-43b0-ae6c-82a0ee21c7d1', 7, 'sahne', 200, 'ml', null),
  ('a79d5cd5-520c-43b0-ae6c-82a0ee21c7d1', 8, 'butter', 30, 'g', null),
  ('a79d5cd5-520c-43b0-ae6c-82a0ee21c7d1', 9, 'muskat', 1, 'Prise', null),
  ('a79d5cd5-520c-43b0-ae6c-82a0ee21c7d1', 10, 'salz', null, null, null),
  ('a79d5cd5-520c-43b0-ae6c-82a0ee21c7d1', 11, 'pfeffer', null, null, null),
  ('48ea8a50-a4e3-4f84-ad8a-5fe69592a08b', 1, 'fischfilet', 300, 'g', null),
  ('48ea8a50-a4e3-4f84-ad8a-5fe69592a08b', 2, 'kartoffel', 500, 'g', null),
  ('48ea8a50-a4e3-4f84-ad8a-5fe69592a08b', 3, 'erbsen_tk', 150, 'g', null),
  ('48ea8a50-a4e3-4f84-ad8a-5fe69592a08b', 4, 'butter', 40, 'g', null),
  ('48ea8a50-a4e3-4f84-ad8a-5fe69592a08b', 5, 'zitrone', 1, null, null),
  ('48ea8a50-a4e3-4f84-ad8a-5fe69592a08b', 6, 'kapern', 1, 'EL', null),
  ('48ea8a50-a4e3-4f84-ad8a-5fe69592a08b', 7, 'mehl', 2, 'EL', null),
  ('48ea8a50-a4e3-4f84-ad8a-5fe69592a08b', 8, 'petersilie', 0.5, 'Bund', null),
  ('48ea8a50-a4e3-4f84-ad8a-5fe69592a08b', 9, 'oel', 1, 'EL', null),
  ('48ea8a50-a4e3-4f84-ad8a-5fe69592a08b', 10, 'salz', null, null, null),
  ('48ea8a50-a4e3-4f84-ad8a-5fe69592a08b', 11, 'pfeffer', null, null, null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 1, 'aubergine', 1, null, null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 2, 'zucchini', 2, null, null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 3, 'paprika', 2, null, null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 4, 'zwiebel', 1, null, null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 5, 'knoblauch', 3, 'Zehe', null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 6, 'gehackte_tomaten', 1, 'Dose', null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 7, 'thymian', 3, 'Zweig', null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 8, 'rosmarin', 1, 'Zweig', null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 9, 'olivenoel', 5, 'EL', null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 10, 'basilikum', 0.5, 'Bund', null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 11, 'baguette', 1, null, null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 12, 'salz', null, null, null),
  ('32a89cc6-1e2b-440f-a9b7-e858b21a1223', 13, 'pfeffer', null, null, null),
  ('7bc39229-ea6f-47cb-afb4-2498ce164597', 1, 'kartoffel', 1, 'kg', 'festkochend'),
  ('7bc39229-ea6f-47cb-afb4-2498ce164597', 2, 'sahne', 300, 'ml', null),
  ('7bc39229-ea6f-47cb-afb4-2498ce164597', 3, 'milch', 200, 'ml', null),
  ('7bc39229-ea6f-47cb-afb4-2498ce164597', 4, 'knoblauch', 1, 'Zehe', null),
  ('7bc39229-ea6f-47cb-afb4-2498ce164597', 5, 'reibekaese', 100, 'g', null),
  ('7bc39229-ea6f-47cb-afb4-2498ce164597', 6, 'butter', 1, 'EL', null),
  ('7bc39229-ea6f-47cb-afb4-2498ce164597', 7, 'muskat', 1, 'Prise', null),
  ('7bc39229-ea6f-47cb-afb4-2498ce164597', 8, 'thymian', 2, 'Zweig', null),
  ('7bc39229-ea6f-47cb-afb4-2498ce164597', 9, 'salz', null, null, null),
  ('7bc39229-ea6f-47cb-afb4-2498ce164597', 10, 'pfeffer', null, null, null),
  ('1be4808c-d2dd-43e7-a5c0-5f539682f3b0', 1, 'kartoffel', 600, 'g', 'am Vortag gekocht'),
  ('1be4808c-d2dd-43e7-a5c0-5f539682f3b0', 2, 'zwiebel', 1, null, null),
  ('1be4808c-d2dd-43e7-a5c0-5f539682f3b0', 3, 'eier', 4, null, null),
  ('1be4808c-d2dd-43e7-a5c0-5f539682f3b0', 4, 'butter', 1, 'EL', null),
  ('1be4808c-d2dd-43e7-a5c0-5f539682f3b0', 5, 'oel', 3, 'EL', null),
  ('1be4808c-d2dd-43e7-a5c0-5f539682f3b0', 6, 'majoran', 0.5, 'TL', null),
  ('1be4808c-d2dd-43e7-a5c0-5f539682f3b0', 7, 'gewuerzgurken', 4, null, null),
  ('1be4808c-d2dd-43e7-a5c0-5f539682f3b0', 8, 'schnittlauch', 0.5, 'Bund', null),
  ('1be4808c-d2dd-43e7-a5c0-5f539682f3b0', 9, 'salz', null, null, null),
  ('1be4808c-d2dd-43e7-a5c0-5f539682f3b0', 10, 'pfeffer', null, null, null),
  ('7795ac46-0509-467c-a56f-19d45c159e14', 1, 'kartoffel', 1, 'kg', 'mehligkochend'),
  ('7795ac46-0509-467c-a56f-19d45c159e14', 2, 'zwiebel', 1, null, null),
  ('7795ac46-0509-467c-a56f-19d45c159e14', 3, 'eier', 2, null, null),
  ('7795ac46-0509-467c-a56f-19d45c159e14', 4, 'mehl', 2, 'EL', null),
  ('7795ac46-0509-467c-a56f-19d45c159e14', 5, 'oel', 100, 'ml', null),
  ('7795ac46-0509-467c-a56f-19d45c159e14', 6, 'apfelmus', 400, 'g', null),
  ('7795ac46-0509-467c-a56f-19d45c159e14', 7, 'muskat', 1, 'Prise', null),
  ('7795ac46-0509-467c-a56f-19d45c159e14', 8, 'salz', null, null, null),
  ('4799915c-7279-4a57-a2cf-2642853cbaf6', 1, 'kartoffel', 4, null, 'große'),
  ('4799915c-7279-4a57-a2cf-2642853cbaf6', 2, 'quark', 250, 'g', null),
  ('4799915c-7279-4a57-a2cf-2642853cbaf6', 3, 'joghurt', 100, 'g', null),
  ('4799915c-7279-4a57-a2cf-2642853cbaf6', 4, 'schnittlauch', 0.5, 'Bund', null),
  ('4799915c-7279-4a57-a2cf-2642853cbaf6', 5, 'petersilie', 0.5, 'Bund', null),
  ('4799915c-7279-4a57-a2cf-2642853cbaf6', 6, 'dill', 0.5, 'Bund', null),
  ('4799915c-7279-4a57-a2cf-2642853cbaf6', 7, 'knoblauch', 1, 'Zehe', null),
  ('4799915c-7279-4a57-a2cf-2642853cbaf6', 8, 'olivenoel', 1, 'EL', null),
  ('4799915c-7279-4a57-a2cf-2642853cbaf6', 9, 'radieschen', 6, null, null),
  ('4799915c-7279-4a57-a2cf-2642853cbaf6', 10, 'salz', null, null, null),
  ('4799915c-7279-4a57-a2cf-2642853cbaf6', 11, 'pfeffer', null, null, null),
  ('e69284bd-c68e-4b7c-abc7-9d01a21d8bdb', 1, 'kartoffel', 600, 'g', null),
  ('e69284bd-c68e-4b7c-abc7-9d01a21d8bdb', 2, 'paprika', 1, null, null),
  ('e69284bd-c68e-4b7c-abc7-9d01a21d8bdb', 3, 'zucchini', 1, null, null),
  ('e69284bd-c68e-4b7c-abc7-9d01a21d8bdb', 4, 'rote_zwiebel', 1, null, null),
  ('e69284bd-c68e-4b7c-abc7-9d01a21d8bdb', 5, 'rosmarin', 2, 'Zweig', null),
  ('e69284bd-c68e-4b7c-abc7-9d01a21d8bdb', 6, 'knoblauch', 2, 'Zehe', null),
  ('e69284bd-c68e-4b7c-abc7-9d01a21d8bdb', 7, 'olivenoel', 4, 'EL', null),
  ('e69284bd-c68e-4b7c-abc7-9d01a21d8bdb', 8, 'paprikapulver', 1, 'TL', null),
  ('e69284bd-c68e-4b7c-abc7-9d01a21d8bdb', 9, 'salz', null, null, null),
  ('e69284bd-c68e-4b7c-abc7-9d01a21d8bdb', 10, 'pfeffer', null, null, null),
  ('ace22d59-1919-44b5-a7c7-fbf5646efb1b', 1, 'schupfnudeln', 600, 'g', null),
  ('ace22d59-1919-44b5-a7c7-fbf5646efb1b', 2, 'sauerkraut', 400, 'g', null),
  ('ace22d59-1919-44b5-a7c7-fbf5646efb1b', 3, 'zwiebel', 1, null, null),
  ('ace22d59-1919-44b5-a7c7-fbf5646efb1b', 4, 'butter', 30, 'g', null),
  ('ace22d59-1919-44b5-a7c7-fbf5646efb1b', 5, 'kuemmel', 0.5, 'TL', null),
  ('ace22d59-1919-44b5-a7c7-fbf5646efb1b', 6, 'schmand', 100, 'g', null),
  ('ace22d59-1919-44b5-a7c7-fbf5646efb1b', 7, 'petersilie', 0.5, 'Bund', null),
  ('ace22d59-1919-44b5-a7c7-fbf5646efb1b', 8, 'salz', null, null, null),
  ('ace22d59-1919-44b5-a7c7-fbf5646efb1b', 9, 'pfeffer', null, null, null),
  ('d2ab625a-a61a-4c6d-a497-64ab8d0589cc', 1, 'kartoffel', 700, 'g', null),
  ('d2ab625a-a61a-4c6d-a497-64ab8d0589cc', 2, 'spinat', 200, 'g', null),
  ('d2ab625a-a61a-4c6d-a497-64ab8d0589cc', 3, 'zwiebel', 1, null, null),
  ('d2ab625a-a61a-4c6d-a497-64ab8d0589cc', 4, 'knoblauch', 2, 'Zehe', null),
  ('d2ab625a-a61a-4c6d-a497-64ab8d0589cc', 5, 'ingwer', 15, 'g', null),
  ('d2ab625a-a61a-4c6d-a497-64ab8d0589cc', 6, 'gehackte_tomaten', 1, 'Dose', null),
  ('d2ab625a-a61a-4c6d-a497-64ab8d0589cc', 7, 'kokosmilch', 200, 'ml', null),
  ('d2ab625a-a61a-4c6d-a497-64ab8d0589cc', 8, 'currypulver', 2, 'TL', null),
  ('d2ab625a-a61a-4c6d-a497-64ab8d0589cc', 9, 'kreuzkuemmel', 1, 'TL', null),
  ('d2ab625a-a61a-4c6d-a497-64ab8d0589cc', 10, 'oel', 2, 'EL', null),
  ('d2ab625a-a61a-4c6d-a497-64ab8d0589cc', 11, 'salz', null, null, null),
  ('85ef3088-d938-411a-a75e-aa7c469a93a6', 1, 'kartoffel', 800, 'g', null),
  ('85ef3088-d938-411a-a75e-aa7c469a93a6', 2, 'quark', 500, 'g', null),
  ('85ef3088-d938-411a-a75e-aa7c469a93a6', 3, 'milch', 50, 'ml', null),
  ('85ef3088-d938-411a-a75e-aa7c469a93a6', 4, 'zwiebel', 0.5, null, null),
  ('85ef3088-d938-411a-a75e-aa7c469a93a6', 5, 'schnittlauch', 1, 'Bund', null),
  ('85ef3088-d938-411a-a75e-aa7c469a93a6', 6, 'gurke', 0.5, null, null),
  ('85ef3088-d938-411a-a75e-aa7c469a93a6', 7, 'olivenoel', 2, 'EL', null),
  ('85ef3088-d938-411a-a75e-aa7c469a93a6', 8, 'salz', null, null, null),
  ('85ef3088-d938-411a-a75e-aa7c469a93a6', 9, 'pfeffer', null, null, null),
  ('e5daa9b3-5488-4144-a392-69dbc609d972', 1, 'kartoffel', 500, 'g', 'gekocht'),
  ('e5daa9b3-5488-4144-a392-69dbc609d972', 2, 'speck', 100, 'g', null),
  ('e5daa9b3-5488-4144-a392-69dbc609d972', 3, 'zwiebel', 1, null, null),
  ('e5daa9b3-5488-4144-a392-69dbc609d972', 4, 'eier', 4, null, null),
  ('e5daa9b3-5488-4144-a392-69dbc609d972', 5, 'milch', 3, 'EL', null),
  ('e5daa9b3-5488-4144-a392-69dbc609d972', 6, 'schnittlauch', 0.5, 'Bund', null),
  ('e5daa9b3-5488-4144-a392-69dbc609d972', 7, 'oel', 2, 'EL', null),
  ('e5daa9b3-5488-4144-a392-69dbc609d972', 8, 'gewuerzgurken', 3, null, null),
  ('e5daa9b3-5488-4144-a392-69dbc609d972', 9, 'salz', null, null, null),
  ('e5daa9b3-5488-4144-a392-69dbc609d972', 10, 'pfeffer', null, null, null),
  ('9e5f7bf0-b436-47f3-aeea-d1f34f734cf2', 1, 'kartoffel', 600, 'g', 'festkochend'),
  ('9e5f7bf0-b436-47f3-aeea-d1f34f734cf2', 2, 'raeucherlachs', 150, 'g', null),
  ('9e5f7bf0-b436-47f3-aeea-d1f34f734cf2', 3, 'schmand', 150, 'g', null),
  ('9e5f7bf0-b436-47f3-aeea-d1f34f734cf2', 4, 'dill', 0.5, 'Bund', null),
  ('9e5f7bf0-b436-47f3-aeea-d1f34f734cf2', 5, 'zitrone', 0.5, null, null),
  ('9e5f7bf0-b436-47f3-aeea-d1f34f734cf2', 6, 'butter', 30, 'g', null),
  ('9e5f7bf0-b436-47f3-aeea-d1f34f734cf2', 7, 'oel', 2, 'EL', null),
  ('9e5f7bf0-b436-47f3-aeea-d1f34f734cf2', 8, 'salz', null, null, null),
  ('9e5f7bf0-b436-47f3-aeea-d1f34f734cf2', 9, 'pfeffer', null, null, null),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 1, 'kartoffel', 1, 'kg', 'mehligkochend'),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 2, 'bratwurst', 4, null, null),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 3, 'milch', 200, 'ml', null),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 4, 'butter', 50, 'g', null),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 5, 'zwiebel', 3, null, null),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 6, 'mehl', 1, 'EL', null),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 7, 'rinderbruehe', 300, 'ml', null),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 8, 'senf', 1, 'TL', null),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 9, 'muskat', 1, 'Prise', null),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 10, 'oel', 1, 'EL', null),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 11, 'salz', null, null, null),
  ('28a9349e-45b6-4501-ad05-67061fecf0aa', 12, 'pfeffer', null, null, null),
  ('83f998f8-24cf-410d-a0d1-d38f29f566ec', 1, 'suesskartoffel', 2, null, null),
  ('83f998f8-24cf-410d-a0d1-d38f29f566ec', 2, 'speisestaerke', 1, 'EL', null),
  ('83f998f8-24cf-410d-a0d1-d38f29f566ec', 3, 'paprikapulver', 1, 'TL', null),
  ('83f998f8-24cf-410d-a0d1-d38f29f566ec', 4, 'olivenoel', 3, 'EL', null),
  ('83f998f8-24cf-410d-a0d1-d38f29f566ec', 5, 'avocado', 1, null, null),
  ('83f998f8-24cf-410d-a0d1-d38f29f566ec', 6, 'limette', 1, null, null),
  ('83f998f8-24cf-410d-a0d1-d38f29f566ec', 7, 'knoblauch', 1, 'Zehe', null),
  ('83f998f8-24cf-410d-a0d1-d38f29f566ec', 8, 'koriander', 0.5, 'Bund', null),
  ('83f998f8-24cf-410d-a0d1-d38f29f566ec', 9, 'salz', null, null, null),
  ('b64ec92a-d350-4db5-a8cf-e6685ca32251', 1, 'kartoffel', 700, 'g', null),
  ('b64ec92a-d350-4db5-a8cf-e6685ca32251', 2, 'erbsen_tk', 250, 'g', null),
  ('b64ec92a-d350-4db5-a8cf-e6685ca32251', 3, 'fischstaebchen', 15, null, null),
  ('b64ec92a-d350-4db5-a8cf-e6685ca32251', 4, 'butter', 30, 'g', null),
  ('b64ec92a-d350-4db5-a8cf-e6685ca32251', 5, 'milch', 100, 'ml', null),
  ('b64ec92a-d350-4db5-a8cf-e6685ca32251', 6, 'zitrone', 0.5, null, null),
  ('b64ec92a-d350-4db5-a8cf-e6685ca32251', 7, 'oel', 2, 'EL', null),
  ('b64ec92a-d350-4db5-a8cf-e6685ca32251', 8, 'muskat', 1, 'Prise', null),
  ('b64ec92a-d350-4db5-a8cf-e6685ca32251', 9, 'salz', null, null, null),
  ('b64ec92a-d350-4db5-a8cf-e6685ca32251', 10, 'pfeffer', null, null, null),
  ('a02f6e58-c801-4a44-a342-86468409197a', 1, 'kartoffel', 4, null, 'große'),
  ('a02f6e58-c801-4a44-a342-86468409197a', 2, 'brokkoli', 0.5, null, null),
  ('a02f6e58-c801-4a44-a342-86468409197a', 3, 'frischkaese', 100, 'g', null),
  ('a02f6e58-c801-4a44-a342-86468409197a', 4, 'cheddar', 80, 'g', null),
  ('a02f6e58-c801-4a44-a342-86468409197a', 5, 'fruehlingszwiebel', 2, null, null),
  ('a02f6e58-c801-4a44-a342-86468409197a', 6, 'olivenoel', 1, 'EL', null),
  ('a02f6e58-c801-4a44-a342-86468409197a', 7, 'salz', null, null, null),
  ('a02f6e58-c801-4a44-a342-86468409197a', 8, 'pfeffer', null, null, null),
  ('6b8c2c71-0a53-4ef9-a10a-dd6cece626d4', 1, 'flammkuchenteig', 1, 'Pck.', null),
  ('6b8c2c71-0a53-4ef9-a10a-dd6cece626d4', 2, 'schmand', 200, 'g', null),
  ('6b8c2c71-0a53-4ef9-a10a-dd6cece626d4', 3, 'speck', 100, 'g', null),
  ('6b8c2c71-0a53-4ef9-a10a-dd6cece626d4', 4, 'zwiebel', 2, null, null),
  ('6b8c2c71-0a53-4ef9-a10a-dd6cece626d4', 5, 'muskat', 1, 'Prise', null),
  ('6b8c2c71-0a53-4ef9-a10a-dd6cece626d4', 6, 'salz', null, null, null),
  ('6b8c2c71-0a53-4ef9-a10a-dd6cece626d4', 7, 'pfeffer', null, null, null),
  ('68f98118-03b5-41f7-a8e2-0478f10b03cc', 1, 'flammkuchenteig', 1, 'Pck.', null),
  ('68f98118-03b5-41f7-a8e2-0478f10b03cc', 2, 'creme_fraiche', 150, 'g', null),
  ('68f98118-03b5-41f7-a8e2-0478f10b03cc', 3, 'ziegenkaese', 120, 'g', null),
  ('68f98118-03b5-41f7-a8e2-0478f10b03cc', 4, 'rote_zwiebel', 1, null, null),
  ('68f98118-03b5-41f7-a8e2-0478f10b03cc', 5, 'walnuesse', 30, 'g', null),
  ('68f98118-03b5-41f7-a8e2-0478f10b03cc', 6, 'honig', 1, 'EL', null),
  ('68f98118-03b5-41f7-a8e2-0478f10b03cc', 7, 'thymian', 2, 'Zweig', null),
  ('68f98118-03b5-41f7-a8e2-0478f10b03cc', 8, 'rucola', 30, 'g', null),
  ('68f98118-03b5-41f7-a8e2-0478f10b03cc', 9, 'salz', null, null, null),
  ('68f98118-03b5-41f7-a8e2-0478f10b03cc', 10, 'pfeffer', null, null, null),
  ('dd3dc1af-4b12-4c5a-abb2-91ca7abe22de', 1, 'mehl', 300, 'g', null),
  ('dd3dc1af-4b12-4c5a-abb2-91ca7abe22de', 2, 'hefe', 0.5, 'Pck.', null),
  ('dd3dc1af-4b12-4c5a-abb2-91ca7abe22de', 3, 'wasser', 180, 'ml', 'lauwarm'),
  ('dd3dc1af-4b12-4c5a-abb2-91ca7abe22de', 4, 'olivenoel', 2, 'EL', null),
  ('dd3dc1af-4b12-4c5a-abb2-91ca7abe22de', 5, 'salz', 1, 'TL', null),
  ('dd3dc1af-4b12-4c5a-abb2-91ca7abe22de', 6, 'passierte_tomaten', 200, 'ml', null),
  ('dd3dc1af-4b12-4c5a-abb2-91ca7abe22de', 7, 'oregano', 1, 'TL', null),
  ('dd3dc1af-4b12-4c5a-abb2-91ca7abe22de', 8, 'mozzarella', 250, 'g', null),
  ('dd3dc1af-4b12-4c5a-abb2-91ca7abe22de', 9, 'basilikum', 0.5, 'Bund', null),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 1, 'tortillas', 4, null, null),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 2, 'haehnchenbrust', 300, 'g', null),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 3, 'paprikapulver', 1, 'TL', null),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 4, 'kreuzkuemmel', 0.5, 'TL', null),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 5, 'kopfsalat', 0.5, null, null),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 6, 'tomate', 2, null, null),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 7, 'gurke', 0.5, null, null),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 8, 'joghurt', 150, 'g', null),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 9, 'knoblauch', 1, 'Zehe', null),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 10, 'oel', 1, 'EL', null),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 11, 'salz', null, null, null),
  ('6bb53cc3-bfaa-4eba-a432-75997a44f944', 12, 'pfeffer', null, null, null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 1, 'kichererbsen', 1, 'Dose', null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 2, 'zwiebel', 0.5, null, null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 3, 'knoblauch', 2, 'Zehe', null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 4, 'petersilie', 1, 'Bund', null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 5, 'kreuzkuemmel', 1, 'TL', null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 6, 'mehl', 2, 'EL', null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 7, 'backpulver', 0.5, 'TL', null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 8, 'tortillas', 4, null, null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 9, 'tahini', 3, 'EL', null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 10, 'zitrone', 1, null, null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 11, 'tomate', 2, null, null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 12, 'kopfsalat', 0.5, null, null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 13, 'olivenoel', 3, 'EL', null),
  ('fc7b6a77-4fe1-46da-a5e7-aa363be21b64', 14, 'salz', null, null, null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 1, 'rinderhack', 600, 'g', null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 2, 'burgerbroetchen', 4, null, null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 3, 'cheddar', 4, 'Scheibe', null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 4, 'tomate', 2, null, null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 5, 'kopfsalat', 0.5, null, null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 6, 'rote_zwiebel', 1, null, null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 7, 'gewuerzgurken', 2, null, null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 8, 'mayonnaise', 3, 'EL', null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 9, 'ketchup', 2, 'EL', null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 10, 'senf', 1, 'TL', null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 11, 'oel', 1, 'EL', null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 12, 'salz', null, null, null),
  ('e1725eb1-60dc-4a95-ad2a-1f839f0d5ef2', 13, 'pfeffer', null, null, null),
  ('988ba92d-0d38-4d29-a74f-ff6337646d1d', 1, 'tortillas', 4, null, null),
  ('988ba92d-0d38-4d29-a74f-ff6337646d1d', 2, 'kidneybohnen', 1, 'Dose', null),
  ('988ba92d-0d38-4d29-a74f-ff6337646d1d', 3, 'mais', 0.5, 'Dose', null),
  ('988ba92d-0d38-4d29-a74f-ff6337646d1d', 4, 'reibekaese', 150, 'g', null),
  ('988ba92d-0d38-4d29-a74f-ff6337646d1d', 5, 'paprika', 1, null, null),
  ('988ba92d-0d38-4d29-a74f-ff6337646d1d', 6, 'kreuzkuemmel', 0.5, 'TL', null),
  ('988ba92d-0d38-4d29-a74f-ff6337646d1d', 7, 'schmand', 100, 'g', null),
  ('988ba92d-0d38-4d29-a74f-ff6337646d1d', 8, 'limette', 1, null, null),
  ('988ba92d-0d38-4d29-a74f-ff6337646d1d', 9, 'koriander', 0.5, 'Bund', null),
  ('988ba92d-0d38-4d29-a74f-ff6337646d1d', 10, 'salz', null, null, null),
  ('a26f6461-e1db-432c-ada3-aeb2fa7b1669', 1, 'toastbrot', 4, 'Scheibe', null),
  ('a26f6461-e1db-432c-ada3-aeb2fa7b1669', 2, 'schinken', 4, 'Scheibe', null),
  ('a26f6461-e1db-432c-ada3-aeb2fa7b1669', 3, 'bergkaese', 100, 'g', null),
  ('a26f6461-e1db-432c-ada3-aeb2fa7b1669', 4, 'butter', 20, 'g', null),
  ('a26f6461-e1db-432c-ada3-aeb2fa7b1669', 5, 'mehl', 1, 'EL', null),
  ('a26f6461-e1db-432c-ada3-aeb2fa7b1669', 6, 'milch', 150, 'ml', null),
  ('a26f6461-e1db-432c-ada3-aeb2fa7b1669', 7, 'senf', 1, 'TL', null),
  ('a26f6461-e1db-432c-ada3-aeb2fa7b1669', 8, 'muskat', 1, 'Prise', null),
  ('a26f6461-e1db-432c-ada3-aeb2fa7b1669', 9, 'salz', null, null, null),
  ('d251b073-1e53-4560-a8a9-b7cd3a4ae000', 1, 'baguette', 1, null, null),
  ('d251b073-1e53-4560-a8a9-b7cd3a4ae000', 2, 'tomate', 4, null, null),
  ('d251b073-1e53-4560-a8a9-b7cd3a4ae000', 3, 'knoblauch', 1, 'Zehe', null),
  ('d251b073-1e53-4560-a8a9-b7cd3a4ae000', 4, 'basilikum', 0.5, 'Bund', null),
  ('d251b073-1e53-4560-a8a9-b7cd3a4ae000', 5, 'olivenoel', 4, 'EL', null),
  ('d251b073-1e53-4560-a8a9-b7cd3a4ae000', 6, 'balsamico', 1, 'TL', null),
  ('d251b073-1e53-4560-a8a9-b7cd3a4ae000', 7, 'salz', null, null, null),
  ('d251b073-1e53-4560-a8a9-b7cd3a4ae000', 8, 'pfeffer', null, null, null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 1, 'tortillas', 8, null, null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 2, 'rinderhack', 500, 'g', null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 3, 'zwiebel', 1, null, null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 4, 'knoblauch', 1, 'Zehe', null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 5, 'tomatenmark', 1, 'EL', null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 6, 'kreuzkuemmel', 1, 'TL', null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 7, 'paprikapulver', 2, 'TL', null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 8, 'tomate', 3, null, null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 9, 'rote_zwiebel', 1, null, null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 10, 'limette', 1, null, null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 11, 'kopfsalat', 0.5, null, null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 12, 'reibekaese', 100, 'g', null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 13, 'schmand', 150, 'g', null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 14, 'oel', 1, 'EL', null),
  ('22904653-985c-49d6-a6c9-b7e9158b7c70', 15, 'salz', null, null, null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 1, 'rote_linsen', 150, 'g', null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 2, 'haferflocken', 60, 'g', null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 3, 'karotte', 1, null, null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 4, 'zwiebel', 1, null, null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 5, 'knoblauch', 1, 'Zehe', null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 6, 'tomatenmark', 1, 'EL', null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 7, 'paprikapulver', 1, 'TL', null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 8, 'senf', 1, 'TL', null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 9, 'burgerbroetchen', 4, null, null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 10, 'tomate', 1, null, null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 11, 'kopfsalat', 0.5, null, null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 12, 'ketchup', 2, 'EL', null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 13, 'oel', 3, 'EL', null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 14, 'salz', null, null, null),
  ('89b73f99-40ea-4563-a32a-9349ed08c746', 15, 'pfeffer', null, null, null),
  ('b8f78835-dc33-45b1-a552-e5a6be424d8d', 1, 'bauernbrot', 2, 'Scheibe', null),
  ('b8f78835-dc33-45b1-a552-e5a6be424d8d', 2, 'avocado', 1, null, null),
  ('b8f78835-dc33-45b1-a552-e5a6be424d8d', 3, 'eier', 2, null, null),
  ('b8f78835-dc33-45b1-a552-e5a6be424d8d', 4, 'zitrone', 0.5, null, null),
  ('b8f78835-dc33-45b1-a552-e5a6be424d8d', 5, 'chiliflocken', 1, 'Prise', null),
  ('b8f78835-dc33-45b1-a552-e5a6be424d8d', 6, 'essig', 1, 'EL', null),
  ('b8f78835-dc33-45b1-a552-e5a6be424d8d', 7, 'radieschen', 3, null, null),
  ('b8f78835-dc33-45b1-a552-e5a6be424d8d', 8, 'salz', null, null, null),
  ('b8f78835-dc33-45b1-a552-e5a6be424d8d', 9, 'pfeffer', null, null, null),
  ('dd2209a0-39b0-41c1-a54d-86bfb7eb5386', 1, 'pita', 2, null, null),
  ('dd2209a0-39b0-41c1-a54d-86bfb7eb5386', 2, 'halloumi', 200, 'g', null),
  ('dd2209a0-39b0-41c1-a54d-86bfb7eb5386', 3, 'paprika', 1, null, null),
  ('dd2209a0-39b0-41c1-a54d-86bfb7eb5386', 4, 'zucchini', 0.5, null, null),
  ('dd2209a0-39b0-41c1-a54d-86bfb7eb5386', 5, 'joghurt', 150, 'g', null),
  ('dd2209a0-39b0-41c1-a54d-86bfb7eb5386', 6, 'minze', 0.5, 'Bund', null),
  ('dd2209a0-39b0-41c1-a54d-86bfb7eb5386', 7, 'zitrone', 0.5, null, null),
  ('dd2209a0-39b0-41c1-a54d-86bfb7eb5386', 8, 'tomate', 1, null, null),
  ('dd2209a0-39b0-41c1-a54d-86bfb7eb5386', 9, 'olivenoel', 2, 'EL', null),
  ('dd2209a0-39b0-41c1-a54d-86bfb7eb5386', 10, 'salz', null, null, null),
  ('dd2209a0-39b0-41c1-a54d-86bfb7eb5386', 11, 'pfeffer', null, null, null),
  ('499bffa1-8e46-4876-a269-a47bb060447c', 1, 'bauernbrot', 2, 'Scheibe', null),
  ('499bffa1-8e46-4876-a269-a47bb060447c', 2, 'schinken', 4, 'Scheibe', null),
  ('499bffa1-8e46-4876-a269-a47bb060447c', 3, 'eier', 2, null, null),
  ('499bffa1-8e46-4876-a269-a47bb060447c', 4, 'butter', 1, 'EL', null),
  ('499bffa1-8e46-4876-a269-a47bb060447c', 5, 'gewuerzgurken', 2, null, null),
  ('499bffa1-8e46-4876-a269-a47bb060447c', 6, 'schnittlauch', 0.5, 'Bund', null),
  ('499bffa1-8e46-4876-a269-a47bb060447c', 7, 'salz', null, null, null),
  ('499bffa1-8e46-4876-a269-a47bb060447c', 8, 'pfeffer', null, null, null),
  ('27467d7d-e902-43cc-a9f8-f3b4e1505e9a', 1, 'mehl', 200, 'g', null),
  ('27467d7d-e902-43cc-a9f8-f3b4e1505e9a', 2, 'milch', 400, 'ml', null),
  ('27467d7d-e902-43cc-a9f8-f3b4e1505e9a', 3, 'eier', 3, null, null),
  ('27467d7d-e902-43cc-a9f8-f3b4e1505e9a', 4, 'zucker', 1, 'EL', null),
  ('27467d7d-e902-43cc-a9f8-f3b4e1505e9a', 5, 'salz', 1, 'Prise', null),
  ('27467d7d-e902-43cc-a9f8-f3b4e1505e9a', 6, 'butter', 30, 'g', null),
  ('27467d7d-e902-43cc-a9f8-f3b4e1505e9a', 7, 'zimt', 1, 'TL', null),
  ('27467d7d-e902-43cc-a9f8-f3b4e1505e9a', 8, 'apfelmus', 200, 'g', null),
  ('f71432dc-eef3-457a-a06d-bf2b20430c4a', 1, 'eier', 4, null, null),
  ('f71432dc-eef3-457a-a06d-bf2b20430c4a', 2, 'mehl', 150, 'g', null),
  ('f71432dc-eef3-457a-a06d-bf2b20430c4a', 3, 'milch', 250, 'ml', null),
  ('f71432dc-eef3-457a-a06d-bf2b20430c4a', 4, 'zucker', 2, 'EL', null),
  ('f71432dc-eef3-457a-a06d-bf2b20430c4a', 5, 'vanillezucker', 1, 'Pck.', null),
  ('f71432dc-eef3-457a-a06d-bf2b20430c4a', 6, 'rosinen', 30, 'g', 'optional'),
  ('f71432dc-eef3-457a-a06d-bf2b20430c4a', 7, 'butter', 40, 'g', null),
  ('f71432dc-eef3-457a-a06d-bf2b20430c4a', 8, 'puderzucker', 2, 'EL', null),
  ('f71432dc-eef3-457a-a06d-bf2b20430c4a', 9, 'apfelmus', 200, 'g', null),
  ('f71432dc-eef3-457a-a06d-bf2b20430c4a', 10, 'salz', 1, 'Prise', null),
  ('dcbab098-d901-42a5-aa05-3fb7d2705c9e', 1, 'milchreis', 200, 'g', null),
  ('dcbab098-d901-42a5-aa05-3fb7d2705c9e', 2, 'milch', 1, 'l', null),
  ('dcbab098-d901-42a5-aa05-3fb7d2705c9e', 3, 'zucker', 3, 'EL', null),
  ('dcbab098-d901-42a5-aa05-3fb7d2705c9e', 4, 'vanillezucker', 1, 'Pck.', null),
  ('dcbab098-d901-42a5-aa05-3fb7d2705c9e', 5, 'butter', 1, 'EL', null),
  ('dcbab098-d901-42a5-aa05-3fb7d2705c9e', 6, 'salz', 1, 'Prise', null),
  ('dcbab098-d901-42a5-aa05-3fb7d2705c9e', 7, 'zimt', 1, 'TL', null),
  ('dcbab098-d901-42a5-aa05-3fb7d2705c9e', 8, 'sauerkirschen', 1, 'Glas', null),
  ('dcbab098-d901-42a5-aa05-3fb7d2705c9e', 9, 'speisestaerke', 1, 'EL', null),
  ('d7cd68a1-1b37-4798-a61f-bb071ea0a0e1', 1, 'toastbrot', 6, 'Scheibe', null),
  ('d7cd68a1-1b37-4798-a61f-bb071ea0a0e1', 2, 'eier', 2, null, null),
  ('d7cd68a1-1b37-4798-a61f-bb071ea0a0e1', 3, 'milch', 200, 'ml', null),
  ('d7cd68a1-1b37-4798-a61f-bb071ea0a0e1', 4, 'zucker', 2, 'EL', null),
  ('d7cd68a1-1b37-4798-a61f-bb071ea0a0e1', 5, 'zimt', 1, 'TL', null),
  ('d7cd68a1-1b37-4798-a61f-bb071ea0a0e1', 6, 'vanillezucker', 1, 'Pck.', null),
  ('d7cd68a1-1b37-4798-a61f-bb071ea0a0e1', 7, 'butter', 30, 'g', null),
  ('d7cd68a1-1b37-4798-a61f-bb071ea0a0e1', 8, 'beeren_tk', 200, 'g', null),
  ('b28cfcad-45a0-4f9b-a5c1-3d0a55e66109', 1, 'eier', 5, null, null),
  ('b28cfcad-45a0-4f9b-a5c1-3d0a55e66109', 2, 'butter', 20, 'g', null),
  ('b28cfcad-45a0-4f9b-a5c1-3d0a55e66109', 3, 'milch', 2, 'EL', null),
  ('b28cfcad-45a0-4f9b-a5c1-3d0a55e66109', 4, 'schnittlauch', 0.5, 'Bund', null),
  ('b28cfcad-45a0-4f9b-a5c1-3d0a55e66109', 5, 'bauernbrot', 2, 'Scheibe', null),
  ('b28cfcad-45a0-4f9b-a5c1-3d0a55e66109', 6, 'tomate', 2, null, null),
  ('b28cfcad-45a0-4f9b-a5c1-3d0a55e66109', 7, 'salz', null, null, null),
  ('b28cfcad-45a0-4f9b-a5c1-3d0a55e66109', 8, 'pfeffer', null, null, null),
  ('416343ee-ad35-42fc-a036-48f4eae155b8', 1, 'haferflocken', 100, 'g', null),
  ('416343ee-ad35-42fc-a036-48f4eae155b8', 2, 'haferdrink', 400, 'ml', null),
  ('416343ee-ad35-42fc-a036-48f4eae155b8', 3, 'apfel', 1, null, null),
  ('416343ee-ad35-42fc-a036-48f4eae155b8', 4, 'zimt', 1, 'TL', null),
  ('416343ee-ad35-42fc-a036-48f4eae155b8', 5, 'ahornsirup', 2, 'EL', null),
  ('416343ee-ad35-42fc-a036-48f4eae155b8', 6, 'walnuesse', 30, 'g', null),
  ('416343ee-ad35-42fc-a036-48f4eae155b8', 7, 'salz', 1, 'Prise', null),
  ('23e3934b-9e1f-4c5c-a062-dc3737a70202', 1, 'griess', 80, 'g', null),
  ('23e3934b-9e1f-4c5c-a062-dc3737a70202', 2, 'milch', 750, 'ml', null),
  ('23e3934b-9e1f-4c5c-a062-dc3737a70202', 3, 'zucker', 3, 'EL', null),
  ('23e3934b-9e1f-4c5c-a062-dc3737a70202', 4, 'vanillezucker', 1, 'Pck.', null),
  ('23e3934b-9e1f-4c5c-a062-dc3737a70202', 5, 'butter', 1, 'EL', null),
  ('23e3934b-9e1f-4c5c-a062-dc3737a70202', 6, 'eier', 1, null, null),
  ('23e3934b-9e1f-4c5c-a062-dc3737a70202', 7, 'sauerkirschen', 1, 'Glas', null),
  ('23e3934b-9e1f-4c5c-a062-dc3737a70202', 8, 'speisestaerke', 1, 'EL', null),
  ('23e3934b-9e1f-4c5c-a062-dc3737a70202', 9, 'salz', 1, 'Prise', null),
  ('632b1350-753c-4f91-abeb-29702bd3e801', 1, 'eier', 5, null, null),
  ('632b1350-753c-4f91-abeb-29702bd3e801', 2, 'paprika', 1, null, null),
  ('632b1350-753c-4f91-abeb-29702bd3e801', 3, 'spinat', 50, 'g', null),
  ('632b1350-753c-4f91-abeb-29702bd3e801', 4, 'fruehlingszwiebel', 2, null, null),
  ('632b1350-753c-4f91-abeb-29702bd3e801', 5, 'reibekaese', 50, 'g', null),
  ('632b1350-753c-4f91-abeb-29702bd3e801', 6, 'butter', 1, 'EL', null),
  ('632b1350-753c-4f91-abeb-29702bd3e801', 7, 'milch', 2, 'EL', null),
  ('632b1350-753c-4f91-abeb-29702bd3e801', 8, 'salz', null, null, null),
  ('632b1350-753c-4f91-abeb-29702bd3e801', 9, 'pfeffer', null, null, null),
  ('2892bfe1-7b30-4621-a92f-fe45f0bdddff', 1, 'mehl', 200, 'g', null),
  ('2892bfe1-7b30-4621-a92f-fe45f0bdddff', 2, 'milch', 300, 'ml', null),
  ('2892bfe1-7b30-4621-a92f-fe45f0bdddff', 3, 'eier', 3, null, null),
  ('2892bfe1-7b30-4621-a92f-fe45f0bdddff', 4, 'backpulver', 1, 'TL', null),
  ('2892bfe1-7b30-4621-a92f-fe45f0bdddff', 5, 'zucker', 2, 'EL', null),
  ('2892bfe1-7b30-4621-a92f-fe45f0bdddff', 6, 'apfel', 2, null, null),
  ('2892bfe1-7b30-4621-a92f-fe45f0bdddff', 7, 'zimt', 1, 'TL', null),
  ('2892bfe1-7b30-4621-a92f-fe45f0bdddff', 8, 'butter', 30, 'g', null),
  ('2892bfe1-7b30-4621-a92f-fe45f0bdddff', 9, 'salz', 1, 'Prise', null),
  ('56a8a994-e5b1-4fca-a5c3-3c1f18d4de94', 1, 'mehl', 500, 'g', null),
  ('56a8a994-e5b1-4fca-a5c3-3c1f18d4de94', 2, 'hefe', 1, 'Pck.', null),
  ('56a8a994-e5b1-4fca-a5c3-3c1f18d4de94', 3, 'milch', 600, 'ml', null),
  ('56a8a994-e5b1-4fca-a5c3-3c1f18d4de94', 4, 'zucker', 4, 'EL', null),
  ('56a8a994-e5b1-4fca-a5c3-3c1f18d4de94', 5, 'eier', 2, null, null),
  ('56a8a994-e5b1-4fca-a5c3-3c1f18d4de94', 6, 'butter', 80, 'g', null),
  ('56a8a994-e5b1-4fca-a5c3-3c1f18d4de94', 7, 'vanillezucker', 2, 'Pck.', null),
  ('56a8a994-e5b1-4fca-a5c3-3c1f18d4de94', 8, 'speisestaerke', 2, 'EL', null),
  ('56a8a994-e5b1-4fca-a5c3-3c1f18d4de94', 9, 'salz', 1, 'TL', null),
  ('94625f52-6ada-4e7a-a624-3f61a2884f97', 1, 'mehl', 250, 'g', null),
  ('94625f52-6ada-4e7a-a624-3f61a2884f97', 2, 'butter', 125, 'g', null),
  ('94625f52-6ada-4e7a-a624-3f61a2884f97', 3, 'zucker', 75, 'g', null),
  ('94625f52-6ada-4e7a-a624-3f61a2884f97', 4, 'eier', 3, null, null),
  ('94625f52-6ada-4e7a-a624-3f61a2884f97', 5, 'milch', 250, 'ml', null),
  ('94625f52-6ada-4e7a-a624-3f61a2884f97', 6, 'backpulver', 2, 'TL', null),
  ('94625f52-6ada-4e7a-a624-3f61a2884f97', 7, 'vanillezucker', 1, 'Pck.', null),
  ('94625f52-6ada-4e7a-a624-3f61a2884f97', 8, 'beeren_tk', 300, 'g', null),
  ('94625f52-6ada-4e7a-a624-3f61a2884f97', 9, 'puderzucker', 1, 'EL', null),
  ('94625f52-6ada-4e7a-a624-3f61a2884f97', 10, 'salz', 1, 'Prise', null),
  ('493b05e3-8edd-4eeb-a107-5554f1b97457', 1, 'kartoffel', 400, 'g', 'mehligkochend, gekocht'),
  ('493b05e3-8edd-4eeb-a107-5554f1b97457', 2, 'quark', 250, 'g', null),
  ('493b05e3-8edd-4eeb-a107-5554f1b97457', 3, 'eier', 1, null, null),
  ('493b05e3-8edd-4eeb-a107-5554f1b97457', 4, 'mehl', 80, 'g', null),
  ('493b05e3-8edd-4eeb-a107-5554f1b97457', 5, 'zucker', 3, 'EL', null),
  ('493b05e3-8edd-4eeb-a107-5554f1b97457', 6, 'vanillezucker', 1, 'Pck.', null),
  ('493b05e3-8edd-4eeb-a107-5554f1b97457', 7, 'rosinen', 30, 'g', 'optional'),
  ('493b05e3-8edd-4eeb-a107-5554f1b97457', 8, 'butter', 40, 'g', null),
  ('493b05e3-8edd-4eeb-a107-5554f1b97457', 9, 'zimt', 1, 'TL', null),
  ('493b05e3-8edd-4eeb-a107-5554f1b97457', 10, 'apfelmus', 300, 'g', null),
  ('493b05e3-8edd-4eeb-a107-5554f1b97457', 11, 'salz', 1, 'Prise', null),
  ('4dcec7f3-5cd2-4fbe-a3bc-c01e3b6efaf6', 1, 'banane', 2, null, null),
  ('4dcec7f3-5cd2-4fbe-a3bc-c01e3b6efaf6', 2, 'mehl', 150, 'g', null),
  ('4dcec7f3-5cd2-4fbe-a3bc-c01e3b6efaf6', 3, 'backpulver', 2, 'TL', null),
  ('4dcec7f3-5cd2-4fbe-a3bc-c01e3b6efaf6', 4, 'haferdrink', 200, 'ml', null),
  ('4dcec7f3-5cd2-4fbe-a3bc-c01e3b6efaf6', 5, 'zimt', 0.5, 'TL', null),
  ('4dcec7f3-5cd2-4fbe-a3bc-c01e3b6efaf6', 6, 'ahornsirup', 3, 'EL', null),
  ('4dcec7f3-5cd2-4fbe-a3bc-c01e3b6efaf6', 7, 'beeren_tk', 150, 'g', null),
  ('4dcec7f3-5cd2-4fbe-a3bc-c01e3b6efaf6', 8, 'oel', 1, 'EL', null),
  ('4dcec7f3-5cd2-4fbe-a3bc-c01e3b6efaf6', 9, 'salz', 1, 'Prise', null),
  ('fe9d0277-0c06-4b47-a6b1-6f3965a63ba3', 1, 'tofu', 250, 'g', null),
  ('fe9d0277-0c06-4b47-a6b1-6f3965a63ba3', 2, 'spinat', 60, 'g', null),
  ('fe9d0277-0c06-4b47-a6b1-6f3965a63ba3', 3, 'kirschtomaten', 150, 'g', null),
  ('fe9d0277-0c06-4b47-a6b1-6f3965a63ba3', 4, 'fruehlingszwiebel', 2, null, null),
  ('fe9d0277-0c06-4b47-a6b1-6f3965a63ba3', 5, 'kurkuma', 0.5, 'TL', null),
  ('fe9d0277-0c06-4b47-a6b1-6f3965a63ba3', 6, 'paprikapulver', 0.5, 'TL', null),
  ('fe9d0277-0c06-4b47-a6b1-6f3965a63ba3', 7, 'haferdrink', 3, 'EL', null),
  ('fe9d0277-0c06-4b47-a6b1-6f3965a63ba3', 8, 'bauernbrot', 2, 'Scheibe', null),
  ('fe9d0277-0c06-4b47-a6b1-6f3965a63ba3', 9, 'olivenoel', 2, 'EL', null),
  ('fe9d0277-0c06-4b47-a6b1-6f3965a63ba3', 10, 'salz', null, null, null),
  ('fe9d0277-0c06-4b47-a6b1-6f3965a63ba3', 11, 'pfeffer', null, null, null);

commit;
