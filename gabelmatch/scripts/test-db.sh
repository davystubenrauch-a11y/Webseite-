#!/usr/bin/env bash
# Führt die Datenbank-Tests (Matching-Logik + RLS) aus.
#
# Variante A: DATABASE_URL ist gesetzt (z. B. lokaler Supabase-Stack aus `supabase start`:
#   postgresql://postgres:postgres@127.0.0.1:54322/postgres) → Tests laufen dort in einer
#   eigenen Test-Datenbank.
# Variante B: Kein DATABASE_URL → es wird ein temporärer Postgres-Cluster gestartet
#   (benötigt initdb/pg_ctl im PATH oder unter /usr/lib/postgresql/*/bin).
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -n "${DATABASE_URL:-}" ]]; then
  exec npx tsx --test --test-concurrency=1 supabase/tests/*.test.ts
fi

PG_BIN="$(dirname "$(command -v initdb 2>/dev/null || ls -d /usr/lib/postgresql/*/bin/initdb 2>/dev/null | sort -V | tail -1)")"
if [[ ! -x "$PG_BIN/initdb" ]]; then
  echo "Kein Postgres gefunden. Bitte Postgres installieren oder DATABASE_URL setzen." >&2
  exit 1
fi

TMP="$(mktemp -d)"
PORT="${PGTEST_PORT:-54329}"
RUN=()
if [[ "$(id -u)" == "0" ]]; then
  # initdb verweigert root – als Benutzer postgres ausführen
  chown -R postgres "$TMP"
  RUN=(runuser -u postgres --)
fi

cleanup() {
  "${RUN[@]}" "$PG_BIN/pg_ctl" -D "$TMP/data" -m immediate stop >/dev/null 2>&1 || true
  rm -rf "$TMP"
}
trap cleanup EXIT

"${RUN[@]}" "$PG_BIN/initdb" -D "$TMP/data" -U postgres --auth=trust -E UTF8 >/dev/null
"${RUN[@]}" "$PG_BIN/pg_ctl" -D "$TMP/data" -o "-p $PORT -k $TMP -c listen_addresses=127.0.0.1" -l "$TMP/log" -w start >/dev/null

DATABASE_URL="postgresql://postgres@127.0.0.1:$PORT/postgres" npx tsx --test --test-concurrency=1 supabase/tests/*.test.ts
