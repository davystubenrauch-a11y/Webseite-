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
