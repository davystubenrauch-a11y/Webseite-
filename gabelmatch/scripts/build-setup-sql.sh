#!/usr/bin/env bash
# Fasst alle Migrationen + Seed zu supabase/setup-komplett.sql zusammen (einmal im SQL Editor ausführen).
set -euo pipefail
cd "$(dirname "$0")/../supabase"
{
  echo "-- Gabelmatch – komplette Einrichtung in EINER Datei."
  echo "-- Supabase → SQL Editor → New query → alles einfügen → Run. Nur einmal ausführen."
  echo "-- (Automatisch zusammengestellt aus migrations/*.sql und seed.sql – npm run setup:sql)"
  for f in migrations/*.sql seed.sql; do echo; echo "-- ===== $f ====="; cat "$f"; done
} > setup-komplett.sql
echo "supabase/setup-komplett.sql geschrieben"
