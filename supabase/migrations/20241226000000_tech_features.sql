-- Migration: 20241226000000_tech_features.sql
-- Description: Add technician availability and expenses tracking

-- 1. Add Availability to Technicians
ALTER TABLE technicians 
ADD COLUMN IF NOT EXISTS availability_status TEXT CHECK (availability_status IN ('available', 'busy', 'on_leave', 'offline')) DEFAULT 'offline';

-- 2. Create Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- The technician's user ID
    visit_id BIGINT REFERENCES visits(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category TEXT CHECK (category IN ('travel', 'food', 'material', 'other')) DEFAULT 'other',
    description TEXT,
    receipt_url TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS for Expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy: Techs can view their own expenses
CREATE POLICY "Techs can view own expenses" ON expenses
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Techs can insert expenses
CREATE POLICY "Techs can insert expenses" ON expenses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Techs can update own pending expenses
CREATE POLICY "Techs can update own pending expenses" ON expenses
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Policy: Dealers can view expenses of their technicians
-- This complex generic policy assumes strict hierarchy. 
-- Ideally we check if auth.uid() is the user_id (owner) of the technician who owns this expense.
-- Join: technicians table maps profile_id (tech) -> user_id (dealer)
CREATE POLICY "Dealers can view tech expenses" ON expenses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM technicians 
            WHERE profile_id = expenses.user_id 
            AND user_id = auth.uid()
        )
    );

-- Policy: Dealers can approve/reject expenses
CREATE POLICY "Dealers can update tech expenses" ON expenses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM technicians 
            WHERE profile_id = expenses.user_id 
            AND user_id = auth.uid()
        )
    );
