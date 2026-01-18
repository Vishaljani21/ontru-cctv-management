
-- CREATE TECHNICIAN USER FUNCTION
-- This function creates a user in auth.users AND auth.identities properly
-- bypassing GoTrue's broken identity creation

-- Ensure pgcrypto extension is installed (for password hashing)
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
-- Also try extensions schema (Supabase default)
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Drop old function if it exists (to clear any cached old definition)
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
    
    -- Hash the password using bcrypt (same as GoTrue)
    -- Use extensions schema where Supabase installs pgcrypto
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
        jsonb_build_object('name', p_name, 'phone', p_phone, 'role', 'technician'),
        jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
        FALSE,
        NOW(),
        NOW()
    );
    
    -- Insert into auth.identities only if one doesn't already exist
    -- (trigger might have already created one)
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
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_technician_user(TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_technician_user(TEXT, TEXT, TEXT, TEXT) TO anon;

-- Notify completion
DO $$
BEGIN
    RAISE NOTICE 'create_technician_user function created successfully!';
END $$;
