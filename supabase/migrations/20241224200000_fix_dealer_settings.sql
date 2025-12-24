-- Ontru CCTV Management System - Fix Dealer Info & RLS
-- Migration: 20241224_fix_dealer_info.sql

-- 1. Ensure dealer_info table exists (idempotent)
CREATE TABLE IF NOT EXISTS dealer_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL DEFAULT 'My Company',
    owner_name TEXT,
    address TEXT,
    gstin TEXT,
    email TEXT,
    mobile TEXT,
    upi_id TEXT,
    bank_name TEXT,
    account_no TEXT,
    ifsc_code TEXT,
    qr_code_url TEXT,
    subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')) DEFAULT 'starter',
    subscription_start_date TIMESTAMPTZ,
    subscription_expiry_date TIMESTAMPTZ,
    subscription_status TEXT CHECK (subscription_status IN ('active', 'expired', 'trial')) DEFAULT 'trial',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE dealer_info ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own dealer info" ON dealer_info;
DROP POLICY IF EXISTS "Users can insert their own dealer info" ON dealer_info;
DROP POLICY IF EXISTS "Users can update their own dealer info" ON dealer_info;

-- 4. Re-create Policies
CREATE POLICY "Users can view their own dealer info"
ON dealer_info FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dealer info"
ON dealer_info FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dealer info"
ON dealer_info FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- 5. Grant permissions just in case
GRANT ALL ON dealer_info TO authenticated;
GRANT ALL ON dealer_info TO service_role;
