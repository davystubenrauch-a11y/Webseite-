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
  user_id    uuid not null references auth.users (id) on delete cascade,
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
