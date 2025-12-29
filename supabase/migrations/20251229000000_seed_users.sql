-- Seed Data for Users (Admin, Dealer, Technician)
-- Uses pgcrypto for password hashing matching Supabase/GoTrue default (bcrypt)

-- Ensure extensions exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ADMIN USER
-- Email: admin@ontru.com / Password: admin123
DO $$
DECLARE
  new_user_id uuid := uuid_generate_v4();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@ontru.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'admin@ontru.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
    
    -- Create Profile
    INSERT INTO public.profiles (id, name, role, is_setup_complete)
    VALUES (new_user_id, 'System Admin', 'admin', true);
  END IF;
END $$;


-- 2. DEALER USER
-- Email: dealer@example.com / Password: password123
DO $$
DECLARE
  new_user_id uuid := uuid_generate_v4();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dealer@example.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'dealer@example.com',
      crypt('password123', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"dealer"}',
      NOW(),
      NOW()
    );

    -- Create Profile
    INSERT INTO public.profiles (id, name, role, is_setup_complete)
    VALUES (new_user_id, 'Demo Dealer', 'dealer', true);

    -- Create Dealer Info
    INSERT INTO public.dealer_info (id, user_id, company_name, subscription_tier, subscription_status)
    VALUES (uuid_generate_v4(), new_user_id, 'Demo CCTV Solutions', 'professional', 'active');
  END IF;
END $$;


-- 3. TECHNICIAN USER
-- Email: tech@example.com / Password: password123
-- Phone: 9876543210 (Stored in metadata or phone column if available)
DO $$
DECLARE
  new_user_id uuid := uuid_generate_v4();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tech@example.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      phone,
      encrypted_password,
      email_confirmed_at,
      phone_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'tech@example.com',
      '9876543210',
      crypt('password123', gen_salt('bf')),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email", "phone"]}',
      '{"role":"technician"}',
      NOW(),
      NOW()
    );

    -- Create Profile
    INSERT INTO public.profiles (id, name, role, phone, is_setup_complete)
    VALUES (new_user_id, 'Demo Technician', 'technician', '9876543210', true);
  END IF;
END $$;
