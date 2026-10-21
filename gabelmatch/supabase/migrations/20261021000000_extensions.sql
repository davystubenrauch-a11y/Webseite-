-- Erweiterungen. pg_net wird für Push-Benachrichtigungen bei einem Match benötigt
-- (HTTP-Aufruf der Expo Push API direkt aus der Datenbank). Fehlt die Erweiterung
-- (z. B. in reinen Test-Datenbanken), funktioniert alles außer dem Push-Versand.
do $$
begin
  create extension if not exists pg_net;
exception when others then
  raise notice 'pg_net nicht verfügbar – Push-Benachrichtigungen bei Matches sind deaktiviert';
end $$;
