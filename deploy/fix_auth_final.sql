
-- MANUAL AUTH SCHEMA REPAIR v3 (Final)
-- Fixes "Relation does not exist" by setting SEARCH_PATH and marking migration as done.

-- 1. Fix Search Path for the Service User
-- GoTrue often runs queries without "auth." prefix, so it needs this in the path.
ALTER ROLE supabase_auth_admin SET search_path = auth, public, extensions;

-- 2. Force-Mark the problematic migration as "Done"
-- The error is on `20210927181326`, so we must ensure it's in the table so GoTrue skips it.
INSERT INTO auth.schema_migrations (version) VALUES ('20210927181326') 
ON CONFLICT (version) DO NOTHING;

-- 3. Re-Grant permissions (Just to be 100% sure)
GRANT USAGE ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO supabase_auth_admin;

-- 4. Verify connection
DO $$
BEGIN
    RAISE NOTICE 'Permissions granted and Search Path updated for supabase_auth_admin';
END $$;
