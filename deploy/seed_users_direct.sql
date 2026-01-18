
-- DIRECT USER SEED
-- Simple, direct inserts without complex logic

-- Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Insert Users directly
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
    created_at, updated_at, is_super_admin, is_sso_user, is_anonymous
) VALUES 
-- Admin
(
    '00000000-0000-0000-0000-000000000000',
    'a1111111-1111-1111-1111-111111111111',
    'authenticated', 'authenticated', 'admin@ontru.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"admin","name":"System Admin"}',
    NOW(), NOW(), false, false, false
),
-- Dealer
(
    '00000000-0000-0000-0000-000000000000',
    'b2222222-2222-2222-2222-222222222222',
    'authenticated', 'authenticated', 'dealer@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"dealer","name":"Demo Dealer"}',
    NOW(), NOW(), false, false, false
),
-- Technician
(
    '00000000-0000-0000-0000-000000000000',
    'c3333333-3333-3333-3333-333333333333',
    'authenticated', 'authenticated', 'tech@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"technician","name":"Demo Technician"}',
    NOW(), NOW(), false, false, false
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Identities
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES 
-- Admin identity
(
    uuid_generate_v4(),
    'a1111111-1111-1111-1111-111111111111',
    '{"sub":"a1111111-1111-1111-1111-111111111111","email":"admin@ontru.com","email_verified":true}',
    'email',
    'a1111111-1111-1111-1111-111111111111',
    NOW(), NOW(), NOW()
),
-- Dealer identity
(
    uuid_generate_v4(),
    'b2222222-2222-2222-2222-222222222222',
    '{"sub":"b2222222-2222-2222-2222-222222222222","email":"dealer@example.com","email_verified":true}',
    'email',
    'b2222222-2222-2222-2222-222222222222',
    NOW(), NOW(), NOW()
),
-- Technician identity
(
    uuid_generate_v4(),
    'c3333333-3333-3333-3333-333333333333',
    '{"sub":"c3333333-3333-3333-3333-333333333333","email":"tech@example.com","email_verified":true}',
    'email',
    'c3333333-3333-3333-3333-333333333333',
    NOW(), NOW(), NOW()
)
ON CONFLICT DO NOTHING;

-- 3. Insert/Update Profiles (trigger might have already done this but just to be safe)
INSERT INTO public.profiles (id, name, role, is_setup_complete)
VALUES 
('a1111111-1111-1111-1111-111111111111', 'System Admin', 'admin', true),
('b2222222-2222-2222-2222-222222222222', 'Demo Dealer', 'dealer', true),
('c3333333-3333-3333-3333-333333333333', 'Demo Technician', 'technician', true)
ON CONFLICT (id) DO NOTHING;

-- Verify
DO $$
DECLARE
    user_count INT;
    identity_count INT;
BEGIN
    SELECT count(*) INTO user_count FROM auth.users;
    SELECT count(*) INTO identity_count FROM auth.identities;
    RAISE NOTICE 'Users: %, Identities: %', user_count, identity_count;
END $$;
