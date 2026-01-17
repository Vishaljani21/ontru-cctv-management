-- Migration: Add RLS policies for complaint_assignments table
-- Fixes: Dealers cannot assign technicians because insert policy was missing

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Dealers can manage assignments for own complaints" ON complaint_assignments;
DROP POLICY IF EXISTS "Dealers can manage history for own complaints" ON complaint_status_history;
DROP POLICY IF EXISTS "Dealers can manage notes for own complaints" ON complaint_notes;

-- Allow dealers to manage assignments for their own complaints
CREATE POLICY "Dealers can manage assignments for own complaints" ON complaint_assignments
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM complaints c
            WHERE c.id = complaint_assignments.complaint_id
            AND c.user_id = auth.uid()
        )
    );

-- Add policy for complaint_status_history
CREATE POLICY "Dealers can manage history for own complaints" ON complaint_status_history
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM complaints c
            WHERE c.id = complaint_status_history.complaint_id
            AND c.user_id = auth.uid()
        )
    );

-- Add policy for complaint_notes
CREATE POLICY "Dealers can manage notes for own complaints" ON complaint_notes
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM complaints c
            WHERE c.id = complaint_notes.complaint_id
            AND c.user_id = auth.uid()
        )
    );
