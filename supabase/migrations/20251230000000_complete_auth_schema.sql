-- Complete Auth Schema Migration for Self-Hosted Supabase
-- Fixes 500 Internal Server Error due to missing tables/columns

-- 1. Ensure Schema Exists
CREATE SCHEMA IF NOT EXISTS auth;

-- 2. Update auth.users with missing columns if they don't exist
DO $$
BEGIN
    ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS is_sso_user boolean DEFAULT false NOT NULL;
    ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;
    ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT false NOT NULL;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- 3. Create auth.instances
CREATE TABLE IF NOT EXISTS auth.instances (
    id uuid NOT NULL PRIMARY KEY,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

-- 4. Create auth.audit_log_entries
CREATE TABLE IF NOT EXISTS auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL PRIMARY KEY,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);
CREATE INDEX IF NOT EXISTS audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);

-- 5. Create auth.identities
CREATE TABLE IF NOT EXISTS auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower(identity_data->>'email')) STORED,
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS identities_user_id_idx ON auth.identities USING btree (user_id);
CREATE INDEX IF NOT EXISTS identities_email_idx ON auth.identities (email text_pattern_ops);
COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';

-- 6. Create auth.sessions
CREATE TABLE IF NOT EXISTS auth.sessions (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal type_aal DEFAULT 'aal1'::type_aal,
    not_after timestamp with time zone
);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON auth.sessions USING btree (user_id);
CREATE INDEX IF NOT EXISTS sessions_not_after_idx ON auth.sessions USING btree (not_after desc);
COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';

-- 7. Create auth.refresh_tokens
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    instance_id uuid,
    id bigserial PRIMARY KEY,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid REFERENCES auth.sessions(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_token_idx ON auth.refresh_tokens USING btree (token);
CREATE INDEX IF NOT EXISTS refresh_tokens_session_id_idx ON auth.refresh_tokens USING btree (session_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);
COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';

-- 8. Create auth.saml_providers
CREATE TABLE IF NOT EXISTS auth.saml_providers (
    id uuid NOT NULL PRIMARY KEY,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL UNIQUE,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

-- 9. Create auth.saml_relay_states
CREATE TABLE IF NOT EXISTS auth.saml_relay_states (
    id uuid NOT NULL PRIMARY KEY,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    from_ip_address inet,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

-- 10. Create auth.sso_domains
CREATE TABLE IF NOT EXISTS auth.sso_domains (
    id uuid NOT NULL PRIMARY KEY,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

-- 11. Create auth.sso_providers
CREATE TABLE IF NOT EXISTS auth.sso_providers (
    id uuid NOT NULL PRIMARY KEY,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

-- 12. Create auth.schema_migrations
CREATE TABLE IF NOT EXISTS auth.schema_migrations (
    version character varying(255) NOT NULL PRIMARY KEY
);

-- 13. Create auth.flow_state
CREATE TABLE IF NOT EXISTS auth.flow_state (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method type_code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL
);

-- 14. Grant Permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, supabase_admin, dashboard_user, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, supabase_admin, dashboard_user, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO postgres, supabase_admin, dashboard_user, service_role;
