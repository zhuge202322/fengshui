#!/bin/bash
# Create multiple databases inside the same Postgres instance.
set -e

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
  echo "Creating multiple databases: $POSTGRES_MULTIPLE_DATABASES"
  for db in $(echo "$POSTGRES_MULTIPLE_DATABASES" | tr ',' ' '); do
    echo "  → $db"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
      SELECT 'CREATE DATABASE "$db"'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$db')\gexec
EOSQL
  done
fi
