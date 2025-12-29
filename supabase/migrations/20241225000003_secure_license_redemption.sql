-- Migration: Secure License Redemption
-- Description: Removes insecure RLS policy and adds a secure RPC function for redeeming license keys.

-- 1. Remove insecure policy (if it exists)
DROP POLICY IF EXISTS "Anyone can check a key" ON license_keys;

-- 2. Ensure only Admins can view/manage keys via API directly
DROP POLICY IF EXISTS "Admins can view all license keys" ON license_keys;
DROP POLICY IF EXISTS "Admins can manage license keys" ON license_keys;

CREATE POLICY "Admins can view all license keys" ON license_keys
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage license keys" ON license_keys
    FOR ALL USING (is_admin());

-- 3. Create Secure RPC Function for Redemption
CREATE OR REPLACE FUNCTION redeem_license_key(input_key TEXT)
RETURNS JSONB AS $$
DECLARE
    found_key license_keys%ROWTYPE;
    current_user_id UUID;
    dealer_name TEXT;
    new_expiry TIMESTAMPTZ;
BEGIN
    -- Get current authenticated user
    current_user_id := auth.uid();
    IF current_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Not authenticated');
    END IF;

    -- Find and Lock the Key (Atomic Check)
    SELECT * INTO found_key 
    FROM license_keys 
    WHERE key = input_key AND status = 'active' 
    FOR UPDATE SKIP LOCKED; -- Prevent race conditions
    
    IF found_key.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid or used license key');
    END IF;

    -- Get Dealer's Company Name or Email for 'used_by' log
    SELECT COALESCE(company_name, (SELECT email FROM auth.users WHERE id = current_user_id))
    INTO dealer_name
    FROM dealer_info
    WHERE user_id = current_user_id;

    -- Mark Key as Used
    UPDATE license_keys 
    SET 
        status = 'used', 
        used_by = dealer_name, 
        used_at = NOW()
    WHERE id = found_key.id;

    -- Calculate New Expiry
    new_expiry := NOW() + (found_key.duration_days || ' days')::INTERVAL;

    -- Update Dealer Subscription
    UPDATE dealer_info
    SET 
        subscription_tier = found_key.tier,
        subscription_start_date = NOW(),
        subscription_expiry_date = new_expiry,
        subscription_status = 'active'
    WHERE user_id = current_user_id;

    -- If dealer info doesn't exist (rare edge case), maybe insert? 
    -- Assuming dealer_info exists for a valid logged in dealer.

    RETURN jsonb_build_object(
        'success', true, 
        'tier', found_key.tier, 
        'duration', found_key.duration_days,
        'message', 'License redeemed successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
