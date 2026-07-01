-- Extensions required by the schema
create extension if not exists "pgcrypto" with schema extensions;   -- gen_random_uuid()
create extension if not exists "vector" with schema extensions;     -- AI embeddings (future semantic search)
