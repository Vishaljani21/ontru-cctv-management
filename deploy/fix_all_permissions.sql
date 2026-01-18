
-- COMPREHENSIVE PERMISSIONS FIX
-- Grants access and creates RLS policies for ALL application tables

-- ==========================================
-- GRANT TABLE ACCESS
-- ==========================================

-- Profiles
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Dealer related tables
GRANT ALL ON public.dealer_info TO authenticated;
GRANT ALL ON public.dealer_settings TO authenticated;
GRANT SELECT ON public.dealer_info TO anon;

-- Customers
GRANT ALL ON public.customers TO authenticated;

-- Projects
GRANT ALL ON public.projects TO authenticated;
GRANT ALL ON public.project_items TO authenticated;
GRANT ALL ON public.project_notes TO authenticated;
GRANT ALL ON public.project_payments TO authenticated;

-- Visits
GRANT ALL ON public.visits TO authenticated;
GRANT ALL ON public.visit_items TO authenticated;

-- Complaints
GRANT ALL ON public.complaints TO authenticated;
GRANT ALL ON public.complaint_assignments TO authenticated;
GRANT ALL ON public.complaint_status_history TO authenticated;
GRANT ALL ON public.complaint_notes TO authenticated;
GRANT ALL ON public.complaint_media TO authenticated;

-- Inventory
GRANT ALL ON public.inventory_items TO authenticated;
GRANT ALL ON public.stock_transactions TO authenticated;
GRANT ALL ON public.suppliers TO authenticated;

-- Invoices
GRANT ALL ON public.invoices TO authenticated;
GRANT ALL ON public.invoice_items TO authenticated;

-- Warranties
GRANT ALL ON public.warranties TO authenticated;

-- Technicians
GRANT ALL ON public.technicians TO authenticated;
GRANT ALL ON public.technician_expenses TO authenticated;
GRANT ALL ON public.technician_payments TO authenticated;
GRANT ALL ON public.technician_tasks TO authenticated;

-- License Keys
GRANT ALL ON public.license_keys TO authenticated;
GRANT SELECT ON public.license_keys TO anon;

-- Support Tickets
GRANT ALL ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_ticket_messages TO authenticated;

-- ==========================================
-- ENABLE RLS ON ALL TABLES
-- ==========================================
DO $$
DECLARE
    tbl RECORD;
BEGIN
    FOR tbl IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('schema_migrations')
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl.tablename);
    END LOOP;
END $$;

-- ==========================================
-- PROFILES POLICIES
-- ==========================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ==========================================
-- DEALER-OWNED TABLES POLICIES (Generic pattern)
-- ==========================================

-- Helper: Create standard dealer policies for a table
CREATE OR REPLACE FUNCTION create_dealer_policies(table_name TEXT) RETURNS VOID AS $$
BEGIN
    EXECUTE format('DROP POLICY IF EXISTS "Dealers can manage own %s" ON public.%I', table_name, table_name);
    EXECUTE format('CREATE POLICY "Dealers can manage own %s" ON public.%I FOR ALL USING (dealer_id = auth.uid())', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Apply to dealer-owned tables (only if they have dealer_id column)
DO $$
DECLARE
    tbl TEXT;
    tables_with_dealer TEXT[] := ARRAY['customers', 'projects', 'visits', 'complaints', 'inventory_items', 
        'invoices', 'warranties', 'technicians', 'suppliers', 'technician_tasks', 'technician_expenses', 
        'technician_payments', 'stock_transactions'];
BEGIN
    FOREACH tbl IN ARRAY tables_with_dealer LOOP
        BEGIN
            PERFORM create_dealer_policies(tbl);
        EXCEPTION WHEN undefined_column THEN
            -- Table doesn't have dealer_id, skip
            NULL;
        END;
    END LOOP;
END $$;

-- ==========================================
-- COMPLAINT-RELATED POLICIES (special handling)
-- ==========================================
DROP POLICY IF EXISTS "Users can view complaint assignments" ON public.complaint_assignments;
CREATE POLICY "Users can view complaint assignments" ON public.complaint_assignments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Dealers can manage own complaint assignments" ON public.complaint_assignments;
CREATE POLICY "Dealers can manage own complaint assignments" ON public.complaint_assignments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.dealer_id = auth.uid())
    );

DROP POLICY IF EXISTS "Technicians can view assigned complaints" ON public.complaint_assignments;
CREATE POLICY "Technicians can view assigned complaints" ON public.complaint_assignments
    FOR SELECT USING (technician_id = auth.uid());

-- Complaint status history
DROP POLICY IF EXISTS "Users can view complaint history" ON public.complaint_status_history;
CREATE POLICY "Users can view complaint history" ON public.complaint_status_history
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Dealers can insert complaint history" ON public.complaint_status_history;
CREATE POLICY "Dealers can insert complaint history" ON public.complaint_status_history
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.dealer_id = auth.uid())
    );

-- Complaint notes
DROP POLICY IF EXISTS "Users can view complaint notes" ON public.complaint_notes;
CREATE POLICY "Users can view complaint notes" ON public.complaint_notes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Dealers can manage complaint notes" ON public.complaint_notes;
CREATE POLICY "Dealers can manage complaint notes" ON public.complaint_notes
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.dealer_id = auth.uid())
    );

-- ==========================================
-- PROJECT-RELATED POLICIES
-- ==========================================
DROP POLICY IF EXISTS "Dealers can manage project items" ON public.project_items;
CREATE POLICY "Dealers can manage project items" ON public.project_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.dealer_id = auth.uid())
    );

DROP POLICY IF EXISTS "Dealers can manage project notes" ON public.project_notes;
CREATE POLICY "Dealers can manage project notes" ON public.project_notes
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.dealer_id = auth.uid())
    );

DROP POLICY IF EXISTS "Dealers can manage project payments" ON public.project_payments;
CREATE POLICY "Dealers can manage project payments" ON public.project_payments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.dealer_id = auth.uid())
    );

-- ==========================================
-- VISIT-RELATED POLICIES
-- ==========================================
DROP POLICY IF EXISTS "Dealers can manage visit items" ON public.visit_items;
CREATE POLICY "Dealers can manage visit items" ON public.visit_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.visits v WHERE v.id = visit_id AND v.dealer_id = auth.uid())
    );

-- ==========================================
-- INVOICE-RELATED POLICIES
-- ==========================================
DROP POLICY IF EXISTS "Dealers can manage invoice items" ON public.invoice_items;
CREATE POLICY "Dealers can manage invoice items" ON public.invoice_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id AND i.dealer_id = auth.uid())
    );

-- ==========================================
-- SUPPORT TICKETS POLICIES
-- ==========================================
DROP POLICY IF EXISTS "Users can view own support tickets" ON public.support_tickets;
CREATE POLICY "Users can view own support tickets" ON public.support_tickets
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create support tickets" ON public.support_tickets;
CREATE POLICY "Users can create support tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage ticket messages" ON public.support_ticket_messages;
CREATE POLICY "Users can manage ticket messages" ON public.support_ticket_messages
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid())
    );

-- ==========================================
-- LICENSE KEYS POLICIES
-- ==========================================
DROP POLICY IF EXISTS "Anyone can view license keys" ON public.license_keys;
CREATE POLICY "Anyone can view license keys" ON public.license_keys
    FOR SELECT USING (true);

-- ==========================================
-- GRANT SEQUENCES ACCESS
-- ==========================================
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- ==========================================
-- NOTIFY COMPLETION
-- ==========================================
DO $$
BEGIN
    RAISE NOTICE 'All permissions and RLS policies applied successfully!';
END $$;
