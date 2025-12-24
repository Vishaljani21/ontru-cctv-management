-- Ontru CCTV Management System - Row Level Security Policies
-- Migration: 002_rls_policies.sql

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE godowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE godown_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_serials ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranty_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE amcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- HELPER FUNCTION: Get user's dealer_id (for technicians)
-- ============================================
CREATE OR REPLACE FUNCTION get_dealer_id()
RETURNS UUID AS $$
DECLARE
    dealer_id UUID;
BEGIN
    -- If user is a dealer, return their own id
    SELECT id INTO dealer_id FROM profiles WHERE id = auth.uid() AND role = 'dealer';
    IF dealer_id IS NOT NULL THEN
        RETURN dealer_id;
    END IF;
    
    -- If user is a technician, find their associated dealer
    SELECT t.user_id INTO dealer_id 
    FROM technicians t 
    WHERE t.profile_id = auth.uid();
    
    RETURN dealer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PROFILES POLICIES
-- ============================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Dealers can view their technicians' profiles
CREATE POLICY "Dealers can view technician profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM technicians 
            WHERE technicians.profile_id = profiles.id 
            AND technicians.user_id = auth.uid()
        )
    );

-- ============================================
-- DEALER INFO POLICIES
-- ============================================
CREATE POLICY "Users can view own dealer info" ON dealer_info
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own dealer info" ON dealer_info
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own dealer info" ON dealer_info
    FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- CUSTOMERS POLICIES
-- ============================================
CREATE POLICY "Users can view own customers" ON customers
    FOR SELECT USING (user_id = auth.uid() OR user_id = get_dealer_id());

CREATE POLICY "Users can insert own customers" ON customers
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own customers" ON customers
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own customers" ON customers
    FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- TECHNICIANS POLICIES
-- ============================================
CREATE POLICY "Dealers can view their technicians" ON technicians
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Technicians can view themselves" ON technicians
    FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Dealers can manage technicians" ON technicians
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- BRANDS POLICIES
-- ============================================
CREATE POLICY "Users can view own brands" ON brands
    FOR SELECT USING (user_id = auth.uid() OR user_id = get_dealer_id());

CREATE POLICY "Users can manage own brands" ON brands
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- PRODUCTS POLICIES
-- ============================================
CREATE POLICY "Users can view own products" ON products
    FOR SELECT USING (user_id = auth.uid() OR user_id = get_dealer_id());

CREATE POLICY "Users can manage own products" ON products
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- GODOWNS POLICIES
-- ============================================
CREATE POLICY "Users can view own godowns" ON godowns
    FOR SELECT USING (user_id = auth.uid() OR user_id = get_dealer_id());

CREATE POLICY "Users can manage own godowns" ON godowns
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- GODOWN STOCK POLICIES
-- ============================================
CREATE POLICY "Users can view godown stock" ON godown_stock
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM godowns 
            WHERE godowns.id = godown_stock.godown_id 
            AND (godowns.user_id = auth.uid() OR godowns.user_id = get_dealer_id())
        )
    );

CREATE POLICY "Users can manage godown stock" ON godown_stock
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM godowns 
            WHERE godowns.id = godown_stock.godown_id 
            AND godowns.user_id = auth.uid()
        )
    );

-- ============================================
-- INVENTORY SERIALS POLICIES
-- ============================================
CREATE POLICY "Users can view own serials" ON inventory_serials
    FOR SELECT USING (user_id = auth.uid() OR user_id = get_dealer_id());

CREATE POLICY "Users can manage own serials" ON inventory_serials
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- VISITS POLICIES
-- ============================================
CREATE POLICY "Dealers can view all their visits" ON visits
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Technicians can view assigned visits" ON visits
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM technicians 
            WHERE technicians.profile_id = auth.uid() 
            AND technicians.id = ANY(visits.technician_ids)
        )
    );

CREATE POLICY "Dealers can manage visits" ON visits
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Technicians can update assigned visits" ON visits
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM technicians 
            WHERE technicians.profile_id = auth.uid() 
            AND technicians.id = ANY(visits.technician_ids)
        )
    );

-- ============================================
-- VISIT ITEMS POLICIES
-- ============================================
CREATE POLICY "Users can view visit items" ON visit_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM visits 
            WHERE visits.id = visit_items.visit_id 
            AND (visits.user_id = auth.uid() OR visits.user_id = get_dealer_id())
        )
    );

CREATE POLICY "Users can manage visit items" ON visit_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM visits 
            WHERE visits.id = visit_items.visit_id 
            AND visits.user_id = auth.uid()
        )
    );

-- ============================================
-- PAYMENTS POLICIES
-- ============================================
CREATE POLICY "Dealers can view all payments" ON payments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Technicians can view own payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM technicians 
            WHERE technicians.profile_id = auth.uid() 
            AND technicians.id = payments.technician_id
        )
    );

CREATE POLICY "Dealers can manage payments" ON payments
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- SERVICE STATIONS POLICIES
-- ============================================
CREATE POLICY "Users can view own service stations" ON service_stations
    FOR SELECT USING (user_id = auth.uid() OR user_id = get_dealer_id());

CREATE POLICY "Users can manage own service stations" ON service_stations
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- WARRANTY ENTRIES POLICIES
-- ============================================
CREATE POLICY "Users can view own warranty entries" ON warranty_entries
    FOR SELECT USING (user_id = auth.uid() OR user_id = get_dealer_id());

CREATE POLICY "Users can manage own warranty entries" ON warranty_entries
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- SITE HEALTH POLICIES
-- ============================================
CREATE POLICY "Users can view own site health" ON site_health
    FOR SELECT USING (user_id = auth.uid() OR user_id = get_dealer_id());

CREATE POLICY "Users can manage own site health" ON site_health
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- AMCS POLICIES
-- ============================================
CREATE POLICY "Users can view own AMCs" ON amcs
    FOR SELECT USING (user_id = auth.uid() OR user_id = get_dealer_id());

CREATE POLICY "Users can manage own AMCs" ON amcs
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- INVOICES POLICIES
-- ============================================
CREATE POLICY "Users can view own invoices" ON invoices
    FOR SELECT USING (user_id = auth.uid() OR user_id = get_dealer_id());

CREATE POLICY "Users can manage own invoices" ON invoices
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- INVOICE ITEMS POLICIES
-- ============================================
CREATE POLICY "Users can view invoice items" ON invoice_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND (invoices.user_id = auth.uid() OR invoices.user_id = get_dealer_id())
        )
    );

CREATE POLICY "Users can manage invoice items" ON invoice_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- ============================================
-- LICENSE KEYS POLICIES (Admin only)
-- ============================================
CREATE POLICY "Admins can view all license keys" ON license_keys
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage license keys" ON license_keys
    FOR ALL USING (is_admin());

-- Allow anyone to check/redeem a specific key
CREATE POLICY "Anyone can check a key" ON license_keys
    FOR SELECT USING (TRUE);

-- ============================================
-- PAYSLIPS POLICIES
-- ============================================
CREATE POLICY "Dealers can view all payslips" ON payslips
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Technicians can view own payslips" ON payslips
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM technicians 
            WHERE technicians.profile_id = auth.uid() 
            AND technicians.id = payslips.technician_id
        )
    );

CREATE POLICY "Dealers can manage payslips" ON payslips
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- ATTENDANCE POLICIES
-- ============================================
CREATE POLICY "Dealers can view all attendance" ON attendance
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Technicians can view own attendance" ON attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM technicians 
            WHERE technicians.profile_id = auth.uid() 
            AND technicians.id = attendance.technician_id
        )
    );

CREATE POLICY "Dealers can manage attendance" ON attendance
    FOR ALL USING (user_id = auth.uid());
