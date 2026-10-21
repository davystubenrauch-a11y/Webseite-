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
