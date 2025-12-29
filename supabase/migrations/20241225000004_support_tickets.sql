-- Migration: Support Tickets System
-- Description: Creates the support_tickets table and sets up RLS policies.

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT CHECK (category IN ('issue', 'feature_request', 'billing', 'general')) DEFAULT 'general',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Dealers can view ONLY their own tickets
CREATE POLICY "Users can view own tickets" ON support_tickets
    FOR SELECT USING (auth.uid() = user_id);

-- 2. Dealers can create tickets (user_id is forced to auth.uid() usually, but here we trust the insert or trigger, 
-- but better to check or just let them insert their own)
CREATE POLICY "Users can create tickets" ON support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Admins can view ALL tickets
CREATE POLICY "Admins can view all tickets" ON support_tickets
    FOR SELECT USING (is_admin());

-- 4. Admins can update tickets (e.g. status/priority)
CREATE POLICY "Admins can update tickets" ON support_tickets
    FOR UPDATE USING (is_admin());

-- Optional: Create index for faster lookup by user or status
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
