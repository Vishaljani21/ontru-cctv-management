-- COMPREHENSIVE FIX FOR USER CREATION (DEALERS & TECHNICIANS)
-- This script fixes the identity constraint issue by:
-- 1. Creating a BEFORE INSERT trigger to fix null provider_id
-- 2. Creating RPC function for dealer creation  
-- 3. Ensuring the technician creation function exists

-- ============================================
-- PART 1: FIX IDENTITY CONSTRAINT
-- ============================================

-- Step 1: Create a trigger to auto-populate provider_id if NULL
CREATE OR REPLACE FUNCTION auth.fix_identity_provider_id()
RETURNS TRIGGER AS $$
BEGIN
    -- If provider_id is null, set it to the user_id (for email provider)
    IF NEW.provider_id IS NULL THEN
        NEW.provider_id := NEW.user_id::text;
    END IF;
    
    -- Also ensure identity_data has required fields
    IF NEW.identity_data IS NULL THEN
        NEW.identity_data := jsonb_build_object(
            'sub', NEW.user_id::text,
            'email', (SELECT email FROM auth.users WHERE id = NEW.user_id),
            'email_verified', false,
            'phone_verified', false
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create BEFORE INSERT trigger
DROP TRIGGER IF EXISTS fix_identity_before_insert ON auth.identities;
CREATE TRIGGER fix_identity_before_insert
    BEFORE INSERT ON auth.identities
    FOR EACH ROW
    EXECUTE FUNCTION auth.fix_identity_provider_id();

-- ============================================
-- PART 2: CREATE DEALER USER FUNCTION
-- ============================================

-- Ensure pgcrypto extension is installed
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Drop old function if exists
DROP FUNCTION IF EXISTS public.create_dealer_user(TEXT, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.create_dealer_user(
    p_email TEXT,
    p_password TEXT,
    p_name TEXT,
    p_phone TEXT DEFAULT '',
    p_company_name TEXT DEFAULT 'My Company'
) RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
    encrypted_pw TEXT;
BEGIN
    -- Check if user already exists
    SELECT id INTO new_user_id FROM auth.users WHERE email = p_email;
    
    IF new_user_id IS NOT NULL THEN
        RETURN new_user_id; -- User already exists, return their ID
    END IF;
    
    -- Generate new UUID
    new_user_id := gen_random_uuid();
    
    -- Hash the password using bcrypt
    encrypted_pw := extensions.crypt(p_password, extensions.gen_salt('bf'));
    
    -- Insert into auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        email_change_token_current,
        phone_change,
        phone_change_token,
        reauthentication_token,
        raw_user_meta_data,
        raw_app_meta_data,
        is_super_admin,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        p_email,
        encrypted_pw,
        NOW(), -- Confirm email immediately
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        jsonb_build_object('name', p_name, 'phone', p_phone, 'role', 'dealer'),
        jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
        FALSE,
        NOW(),
        NOW()
    );
    
    -- Insert into auth.identities
    IF NOT EXISTS (
        SELECT 1 FROM auth.identities 
        WHERE user_id = new_user_id AND provider = 'email'
    ) THEN
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            provider_id,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            new_user_id,
            jsonb_build_object(
                'sub', new_user_id::text,
                'email', p_email,
                'email_verified', true,
                'phone_verified', false
            ),
            'email',
            new_user_id::text,
            NOW(),
            NOW(),
            NOW()
        );
    END IF;
    
    -- Create profile entry
    INSERT INTO public.profiles (id, name, role, phone, is_setup_complete)
    VALUES (new_user_id, p_name, 'dealer', p_phone, true)
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        is_setup_complete = EXCLUDED.is_setup_complete;

    -- Create dealer_info entry
    INSERT INTO public.dealer_info (
        user_id, company_name, owner_name, mobile,
        subscription_tier, subscription_status, subscription_start_date, subscription_expiry_date
    ) VALUES (
        new_user_id, p_company_name, p_name, p_phone,
        'starter', 'trial', NOW(), NOW() + INTERVAL '30 days'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        owner_name = EXCLUDED.owner_name,
        mobile = EXCLUDED.mobile;
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_dealer_user(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_dealer_user(TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;

-- ============================================
-- PART 3: ENSURE TECHNICIAN FUNCTION EXISTS
-- ============================================

DROP FUNCTION IF EXISTS public.create_technician_user(TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.create_technician_user(
    p_email TEXT,
    p_password TEXT,
    p_name TEXT,
    p_phone TEXT DEFAULT ''
) RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
    encrypted_pw TEXT;
BEGIN
    -- Check if user already exists
    SELECT id INTO new_user_id FROM auth.users WHERE email = p_email;
    
    IF new_user_id IS NOT NULL THEN
        RETURN new_user_id; -- User already exists, return their ID
    END IF;
    
    -- Generate new UUID
    new_user_id := gen_random_uuid();
    
    -- Hash the password using bcrypt
    encrypted_pw := extensions.crypt(p_password, extensions.gen_salt('bf'));
    
    -- Insert into auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        email_change_token_current,
        phone_change,
        phone_change_token,
        reauthentication_token,
        raw_user_meta_data,
        raw_app_meta_data,
        is_super_admin,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        p_email,
        encrypted_pw,
        NOW(),
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        jsonb_build_object('name', p_name, 'phone', p_phone, 'role', 'technician'),
        jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
        FALSE,
        NOW(),
        NOW()
    );
    
    -- Insert into auth.identities
    IF NOT EXISTS (
        SELECT 1 FROM auth.identities 
        WHERE user_id = new_user_id AND provider = 'email'
    ) THEN
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            provider_id,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            new_user_id,
            jsonb_build_object(
                'sub', new_user_id::text,
                'email', p_email,
                'email_verified', true,
                'phone_verified', false
            ),
            'email',
            new_user_id::text,
            NOW(),
            NOW(),
            NOW()
        );
    END IF;
    
    -- Create profile entry
    INSERT INTO public.profiles (id, name, role, phone, is_setup_complete)
    VALUES (new_user_id, p_name, 'technician', p_phone, true)
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone;
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_technician_user(TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_technician_user(TEXT, TEXT, TEXT, TEXT) TO anon;

-- ============================================
-- DONE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'All user creation functions created successfully!';
    RAISE NOTICE 'Available functions:';
    RAISE NOTICE '  - create_dealer_user(email, password, name, phone, company_name)';
    RAISE NOTICE '  - create_technician_user(email, password, name, phone)';
END $$;
