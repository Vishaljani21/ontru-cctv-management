-- FIX IDENTITY CONSTRAINT FOR GOTRUE SIGNUP
-- The issue is GoTrue is trying to insert identity with null provider_id
-- This happens when GoTrue's internal identity creation is broken
-- We need to fix the trigger to handle this case or allow the column temporarily

-- Step 1: Make provider_id allow NULL temporarily (so GoTrue doesn't fail)
ALTER TABLE auth.identities ALTER COLUMN provider_id DROP NOT NULL;

-- Step 2: Create a trigger to auto-populate provider_id if NULL
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

-- Step 3: Create BEFORE INSERT trigger
DROP TRIGGER IF EXISTS fix_identity_before_insert ON auth.identities;
CREATE TRIGGER fix_identity_before_insert
    BEFORE INSERT ON auth.identities
    FOR EACH ROW
    EXECUTE FUNCTION auth.fix_identity_provider_id();

-- Step 4: Fix any existing null provider_ids
UPDATE auth.identities 
SET provider_id = user_id::text 
WHERE provider_id IS NULL;

-- Step 5: Re-enable NOT NULL constraint
ALTER TABLE auth.identities ALTER COLUMN provider_id SET NOT NULL;

-- Notify completion
DO $$
BEGIN
    RAISE NOTICE 'Identity provider_id fix applied! New signups should work now.';
END $$;
