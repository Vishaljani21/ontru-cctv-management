-- FIX: Infinite Recursion in Complaints RLS Policy
-- The issue is that complaint_assignments has RLS that references complaints
-- and complaints has RLS that references complaint_assignments, creating a loop.
--
-- Solution: Use SECURITY DEFINER functions to safely check ownership without triggering RLS

-- ============================================
-- PART 1: CREATE SECURITY DEFINER HELPER FUNCTIONS
-- ============================================

-- Function to check if user owns a complaint (bypasses RLS)
CREATE OR REPLACE FUNCTION public.user_owns_complaint(complaint_id_param INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.complaints
        WHERE id = complaint_id_param
        AND user_id = auth.uid()
    );
END;
$$;

-- Function to check if technician is assigned to a complaint (bypasses RLS)
CREATE OR REPLACE FUNCTION public.technician_assigned_to_complaint(complaint_id_param INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.complaint_assignments ca
        JOIN public.technicians t ON t.id = ca.technician_id
        WHERE ca.complaint_id = complaint_id_param
        AND t.profile_id = auth.uid()
        AND ca.is_active = TRUE
    );
END;
$$;

-- ============================================
-- PART 2: DROP ALL EXISTING COMPLAINT POLICIES
-- ============================================

-- Drop all policies on complaints table
DROP POLICY IF EXISTS "Dealers can view own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Technicians can view assigned complaints" ON public.complaints;
DROP POLICY IF EXISTS "Technicians can update assigned complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can view own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can insert own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can update own complaints" ON public.complaints;
DROP POLICY IF EXISTS "complaint_policy" ON public.complaints;

-- Drop all policies on complaint_assignments
DROP POLICY IF EXISTS "Dealers can manage assignments for own complaints" ON public.complaint_assignments;
DROP POLICY IF EXISTS "Technicians can view assigned complaints" ON public.complaint_assignments;
DROP POLICY IF EXISTS "complaint_assignments_policy" ON public.complaint_assignments;

-- Drop all policies on complaint_status_history
DROP POLICY IF EXISTS "Dealers can manage history for own complaints" ON public.complaint_status_history;
DROP POLICY IF EXISTS "complaint_status_history_policy" ON public.complaint_status_history;

-- Drop all policies on complaint_notes
DROP POLICY IF EXISTS "Dealers can manage notes for own complaints" ON public.complaint_notes;
DROP POLICY IF EXISTS "complaint_notes_policy" ON public.complaint_notes;

-- Drop all policies on complaint_visits
DROP POLICY IF EXISTS "complaint_visits_policy" ON public.complaint_visits;

-- Drop all policies on complaint_attachments
DROP POLICY IF EXISTS "complaint_attachments_policy" ON public.complaint_attachments;

-- ============================================
-- PART 3: CREATE NEW NON-RECURSIVE POLICIES
-- ============================================

-- COMPLAINTS TABLE
-- Simple policy: Dealers can do everything on their own complaints
CREATE POLICY "Dealers full access to own complaints" ON public.complaints
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Technicians can view complaints they're assigned to (using SECURITY DEFINER function)
CREATE POLICY "Technicians view assigned complaints" ON public.complaints
    FOR SELECT
    USING (public.technician_assigned_to_complaint(id));

-- Technicians can update complaints they're assigned to
CREATE POLICY "Technicians update assigned complaints" ON public.complaints
    FOR UPDATE
    USING (public.technician_assigned_to_complaint(id));

-- COMPLAINT_ASSIGNMENTS TABLE  
-- Dealers can manage assignments for complaints they own
CREATE POLICY "Dealers manage own complaint assignments" ON public.complaint_assignments
    FOR ALL
    USING (public.user_owns_complaint(complaint_id))
    WITH CHECK (public.user_owns_complaint(complaint_id));

-- Technicians can view their own assignments
CREATE POLICY "Technicians view own assignments" ON public.complaint_assignments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.technicians t
            WHERE t.id = technician_id
            AND t.profile_id = auth.uid()
        )
    );

-- COMPLAINT_STATUS_HISTORY TABLE
CREATE POLICY "Dealers manage own complaint history" ON public.complaint_status_history
    FOR ALL
    USING (public.user_owns_complaint(complaint_id))
    WITH CHECK (public.user_owns_complaint(complaint_id));

CREATE POLICY "Technicians add history for assigned" ON public.complaint_status_history
    FOR INSERT
    WITH CHECK (public.technician_assigned_to_complaint(complaint_id));

CREATE POLICY "Technicians view history for assigned" ON public.complaint_status_history
    FOR SELECT
    USING (public.technician_assigned_to_complaint(complaint_id));

-- COMPLAINT_NOTES TABLE
CREATE POLICY "Dealers manage own complaint notes" ON public.complaint_notes
    FOR ALL
    USING (public.user_owns_complaint(complaint_id))
    WITH CHECK (public.user_owns_complaint(complaint_id));

CREATE POLICY "Technicians add notes for assigned" ON public.complaint_notes
    FOR INSERT
    WITH CHECK (public.technician_assigned_to_complaint(complaint_id));

CREATE POLICY "Technicians view notes for assigned" ON public.complaint_notes
    FOR SELECT
    USING (public.technician_assigned_to_complaint(complaint_id));

-- COMPLAINT_VISITS TABLE
CREATE POLICY "Dealers manage own complaint visits" ON public.complaint_visits
    FOR ALL
    USING (public.user_owns_complaint(complaint_id))
    WITH CHECK (public.user_owns_complaint(complaint_id));

CREATE POLICY "Technicians manage visits for assigned" ON public.complaint_visits
    FOR ALL
    USING (public.technician_assigned_to_complaint(complaint_id))
    WITH CHECK (public.technician_assigned_to_complaint(complaint_id));

-- COMPLAINT_ATTACHMENTS TABLE
CREATE POLICY "Dealers manage own complaint attachments" ON public.complaint_attachments
    FOR ALL
    USING (public.user_owns_complaint(complaint_id))
    WITH CHECK (public.user_owns_complaint(complaint_id));

CREATE POLICY "Technicians manage attachments for assigned" ON public.complaint_attachments
    FOR ALL
    USING (public.technician_assigned_to_complaint(complaint_id))
    WITH CHECK (public.technician_assigned_to_complaint(complaint_id));

-- ============================================
-- PART 4: GRANT EXECUTE ON HELPER FUNCTIONS
-- ============================================
GRANT EXECUTE ON FUNCTION public.user_owns_complaint(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.technician_assigned_to_complaint(INTEGER) TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'SUCCESS: Complaint RLS policies fixed. Infinite recursion resolved.';
END $$;
