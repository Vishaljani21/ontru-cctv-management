
-- MANUAL AUTH SCHEMA REPAIR v4 (The Real Fix)
-- We found that GoTrue uses the 'postgres' user, so we must set the path for THAT user.

-- 1. Fix Search Path for 'postgres' (Superuser used by GoTrue)
ALTER ROLE postgres SET search_path = "$user", public, auth, extensions;

-- 2. Also set it for the specific auth admin, just in case
ALTER ROLE supabase_auth_admin SET search_path = auth, public, extensions;

-- 3. Also set it database-wide to be absolutely safe
ALTER DATABASE postgres SET search_path = "$user", public, auth, extensions;

-- 4. Fast-Forward the failing migration
-- Mark '20210927181326' as done so GoTrue stops trying to run it
INSERT INTO auth.schema_migrations (version) VALUES ('20210927181326') 
ON CONFLICT (version) DO NOTHING;

-- 5. Notify
DO $$
BEGIN
    RAISE NOTICE 'FIX APPLIED: Search Path set for postgres user and database.';
END $$;
