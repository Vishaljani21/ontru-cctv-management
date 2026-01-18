
-- FIX MISSING IDENTITIES
-- GoTrue requires identity records for email login to work

-- Insert identity for each user that doesn't have one
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
SELECT 
    uuid_generate_v4(), 
    u.id,
    jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true, 'phone_verified', false),
    'email',
    u.id::text,  -- For email provider, provider_id is the user's UUID
    NOW(),
    u.created_at,
    NOW()
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities i WHERE i.user_id = u.id AND i.provider = 'email'
);

-- Notify
DO $$
DECLARE
    count_added INT;
BEGIN
    SELECT count(*) INTO count_added FROM auth.identities;
    RAISE NOTICE 'Identities table now has % records', count_added;
END $$;
