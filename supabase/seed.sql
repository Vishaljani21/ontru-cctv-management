-- Test Users for Local Development
-- Run with: npx supabase db reset (or manually in Supabase Studio SQL Editor)

-- ============================================
-- Create Test Dealer User
-- Email: dealer@test.com | Password: password123
-- ============================================
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    is_sso_user,
    deleted_at
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'dealer@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Test Dealer", "role": "dealer"}',
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    '',
    false,
    NULL
) ON CONFLICT (id) DO NOTHING;

-- Create dealer profile
INSERT INTO profiles (id, name, role, phone, is_setup_complete)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Test Dealer', 'dealer', '9876543210', true)
ON CONFLICT (id) DO NOTHING;

-- Create dealer_info
INSERT INTO dealer_info (user_id, company_name, owner_name, address, gstin, email, mobile, subscription_tier, subscription_status)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Test Security Solutions',
    'Test Dealer',
    '123 Test Street, Demo City',
    '22AAAAA0000A1Z5',
    'dealer@test.com',
    '9876543210',
    'professional',
    'active'
) ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- Create Test Technician User
-- Email: tech@test.com | Password: password123
-- ============================================
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    is_sso_user,
    deleted_at
) VALUES (
    'b0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'tech@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Test Technician", "role": "technician"}',
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    '',
    false,
    NULL
) ON CONFLICT (id) DO NOTHING;

-- Create technician profile
INSERT INTO profiles (id, name, role, phone, is_setup_complete)
VALUES ('b0000000-0000-0000-0000-000000000002', 'Test Technician', 'technician', '9876543211', true)
ON CONFLICT (id) DO NOTHING;

-- Link technician to dealer
INSERT INTO technicians (user_id, profile_id, name, phone, availability_status)
VALUES (
    'a0000000-0000-0000-0000-000000000001',  -- Dealer's user_id
    'b0000000-0000-0000-0000-000000000002',  -- Technician's profile_id
    'Test Technician',
    '9876543211',
    'available'
) ON CONFLICT DO NOTHING;

-- ============================================
-- Create Test Admin User
-- Email: admin@test.com | Password: password123
-- ============================================
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    is_sso_user,
    deleted_at
) VALUES (
    'c0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'admin@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin User", "role": "admin"}',
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    '',
    false,
    NULL
) ON CONFLICT (id) DO NOTHING;

-- Create admin profile
INSERT INTO profiles (id, name, role, phone, is_setup_complete)
VALUES ('c0000000-0000-0000-0000-000000000003', 'Admin User', 'admin', '9876543212', true)
ON CONFLICT (id) DO NOTHING;
