-- HARD RESET AUTH SCHEMA
-- Fixes persistent 500 Errors by wiping and recreating the Auth schema from a verified dump.

-- 0. Ensure Service Roles Exist (Critical for Ownership)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'supabase_auth_admin') THEN
    EXECUTE 'CREATE ROLE supabase_auth_admin LOGIN PASSWORD ''postgres'' SUPERUSER CREATEDB CREATEROLE REPLICATION';
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'supabase_storage_admin') THEN
    EXECUTE 'CREATE ROLE supabase_storage_admin LOGIN PASSWORD ''postgres'' SUPERUSER CREATEDB CREATEROLE REPLICATION';
  END IF;
END
$$;

-- 1. Wipe existing schema (Cascade deletes dependent objects like profiles)
DROP SCHEMA IF EXISTS auth CASCADE;

-- 2. Create Schema
CREATE SCHEMA auth;
ALTER SCHEMA auth OWNER TO supabase_admin;

-- 3. Grants for Schema
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA auth TO postgres, supabase_admin, dashboard_user, service_role;

-- 4. Custom Types
CREATE TYPE auth.aal_level AS ENUM ('aal1', 'aal2', 'aal3');
ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

CREATE TYPE auth.code_challenge_method AS ENUM ('s256', 'plain');
ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

CREATE TYPE auth.factor_status AS ENUM ('unverified', 'verified');
ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

CREATE TYPE auth.factor_type AS ENUM ('totp', 'webauthn', 'phone');
ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

CREATE TYPE auth.oauth_authorization_status AS ENUM ('pending', 'approved', 'denied', 'expired');
ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

CREATE TYPE auth.oauth_client_type AS ENUM ('public', 'confidential');
ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

CREATE TYPE auth.oauth_registration_type AS ENUM ('dynamic', 'manual');
ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

CREATE TYPE auth.oauth_response_type AS ENUM ('code');
ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

CREATE TYPE auth.one_time_token_type AS ENUM ('confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token');
ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

-- 5. Functions
CREATE OR REPLACE FUNCTION auth.email() RETURNS text LANGUAGE sql STABLE AS $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;
ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$
  select coalesce(
    nullif(current_setting('request.jwt.claim', true), ''),
    nullif(current_setting('request.jwt.claims', true), '')
  )::jsonb
$$;
ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

CREATE OR REPLACE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;
ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;
ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

-- 6. Tables
CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL PRIMARY KEY,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);
ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

CREATE TABLE auth.flow_state (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);
ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower(identity_data->>'email')) STORED,
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider)
);
ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

CREATE TABLE auth.instances (
    id uuid NOT NULL PRIMARY KEY,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL PRIMARY KEY,
    CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method)
);
ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL PRIMARY KEY,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);
ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone UNIQUE,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);
ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL PRIMARY KEY,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code),
    CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id)
);
ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL PRIMARY KEY,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);
ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL PRIMARY KEY,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL
);
ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id)
);
ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_user_id_token_type_key UNIQUE (user_id, token_type)
);
ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigserial PRIMARY KEY,
    token character varying(255) UNIQUE,
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);
ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL PRIMARY KEY,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL UNIQUE,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text
);
ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL PRIMARY KEY,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid
);
ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL PRIMARY KEY
);
ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

CREATE TABLE auth.sessions (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text
);
ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL PRIMARY KEY,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL PRIMARY KEY,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean
);
ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

-- Separate Indexes for Functional Uniqueness
CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains (lower(domain));
CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers (lower(resource_id));

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL PRIMARY KEY,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying UNIQUE,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0 CHECK (email_change_confirm_status >= 0 AND email_change_confirm_status <= 2),
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL
);
ALTER TABLE auth.users OWNER TO supabase_auth_admin;

-- 7. Indexes
CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);
CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower(email::text));
CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);
CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);
CREATE INDEX identities_email_idx ON auth.identities (email text_pattern_ops);
CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);
CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after desc);
CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);
CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);
CREATE INDEX refresh_tokens_token_idx ON auth.refresh_tokens USING btree (token);
CREATE INDEX refresh_tokens_session_id_idx ON auth.refresh_tokens USING btree (session_id);
CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);

-- 8. Triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, role, is_setup_complete)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'dealer'),
        FALSE
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Foreign Keys (Constraint Dependencies)
ALTER TABLE auth.identities ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE auth.sessions ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE auth.refresh_tokens ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;
ALTER TABLE auth.mfa_factors ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE auth.one_time_tokens ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 10. Grants (Final)
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, supabase_admin, dashboard_user, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, supabase_admin, dashboard_user, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO postgres, supabase_admin, dashboard_user, service_role;

-- ==========================================
-- 11. RESTORE SEED USERS
-- ==========================================

DO $$
DECLARE
  new_user_id uuid := uuid_generate_v4();
BEGIN
  -- 1. ADMIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@ontru.com') THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_super_admin, is_sso_user, is_anonymous)
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', 'admin@ontru.com', crypt('admin123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', NOW(), NOW(), false, false, false);
    
    INSERT INTO public.profiles (id, name, role, is_setup_complete)
    VALUES (new_user_id, 'System Admin', 'admin', true) ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- 2. DEALER
  new_user_id := uuid_generate_v4();
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dealer@example.com') THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_super_admin, is_sso_user, is_anonymous)
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', 'dealer@example.com', crypt('password123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"role":"dealer"}', NOW(), NOW(), false, false, false);
    
    INSERT INTO public.profiles (id, name, role, is_setup_complete)
    VALUES (new_user_id, 'Demo Dealer', 'dealer', true) ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO public.dealer_info (id, user_id, company_name, subscription_tier, subscription_status)
    VALUES (uuid_generate_v4(), new_user_id, 'Demo CCTV Solutions', 'professional', 'active');
  END IF;

  -- 3. TECHNICIAN
  new_user_id := uuid_generate_v4();
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tech@example.com') THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, phone, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_super_admin, is_sso_user, is_anonymous)
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', 'tech@example.com', '9876543210', crypt('password123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email","phone"]}', '{"role":"technician"}', NOW(), NOW(), false, false, false);
    
    INSERT INTO public.profiles (id, name, role, phone, is_setup_complete)
    VALUES (new_user_id, 'Demo Technician', 'technician', '9876543210', true) ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
