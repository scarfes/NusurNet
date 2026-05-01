-- Enable required extensions for the application
-- Run automatically by Postgres on first container start.

-- pg_trgm: trigram-based fuzzy text search (typo-tolerance in search)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- unaccent: remove accents in search (e.g. "université" matches "universite")
CREATE EXTENSION IF NOT EXISTS unaccent;

-- citext: case-insensitive text type (useful for emails)
CREATE EXTENSION IF NOT EXISTS citext;

-- uuid-ossp: UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
