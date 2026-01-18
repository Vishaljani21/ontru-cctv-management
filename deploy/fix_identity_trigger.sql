
-- FIX IDENTITY AUTO-CREATION
-- Creates a trigger that automatically inserts identity records when users are created

-- Function to create identity for newly created users
CREATE OR REPLACE FUNCTION auth.create_identity_for_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create identity if one doesn't already exist
    IF NOT EXISTS (
        SELECT 1 FROM auth.identities 
        WHERE user_id = NEW.id AND provider = 'email'
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
            uuid_generate_v4(),
            NEW.id,
            jsonb_build_object(
                'sub', NEW.id::text,
                'email', NEW.email,
                'email_verified', true,
                'phone_verified', false
            ),
            'email',
            NEW.id::text,
            NOW(),
            NEW.created_at,
            NOW()
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_identity ON auth.users;
CREATE TRIGGER on_auth_user_created_identity
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION auth.create_identity_for_user();

-- Notify completion
DO $$
BEGIN
    RAISE NOTICE 'Identity auto-creation trigger installed successfully!';
END $$;
