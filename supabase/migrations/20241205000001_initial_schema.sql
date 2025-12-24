-- Ontru CCTV Management System - Complete Database Schema
-- Migration: 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL CHECK (role IN ('dealer', 'technician', 'admin')) DEFAULT 'dealer',
    phone TEXT,
    is_setup_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. DEALER INFO (Business & Subscription)
-- ============================================
CREATE TABLE dealer_info (
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
    -- Subscription fields
    subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')) DEFAULT 'starter',
    subscription_start_date TIMESTAMPTZ,
    subscription_expiry_date TIMESTAMPTZ,
    subscription_status TEXT CHECK (subscription_status IN ('active', 'expired', 'trial')) DEFAULT 'trial',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CUSTOMERS
-- ============================================
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_person TEXT,
    mobile TEXT,
    email TEXT,
    address TEXT,
    area TEXT,
    city TEXT,
    gst TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. TECHNICIANS
-- ============================================
CREATE TABLE technicians (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id), -- Link to technician's own profile
    name TEXT NOT NULL,
    phone TEXT,
    specialization TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. BRANDS
-- ============================================
CREATE TABLE brands (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. PRODUCTS
-- ============================================
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    brand_id BIGINT REFERENCES brands(id) ON DELETE SET NULL,
    model TEXT NOT NULL,
    category TEXT CHECK (category IN ('camera', 'nvr', 'cable', 'other')) DEFAULT 'other',
    is_serialized BOOLEAN DEFAULT FALSE,
    low_stock_threshold INTEGER DEFAULT 10,
    hsn_sac_code TEXT,
    gst_rate INTEGER CHECK (gst_rate IN (0, 5, 12, 18, 28)) DEFAULT 18,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. GODOWNS (Warehouses)
-- ============================================
CREATE TABLE godowns (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. GODOWN STOCK
-- ============================================
CREATE TABLE godown_stock (
    id BIGSERIAL PRIMARY KEY,
    godown_id BIGINT REFERENCES godowns(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(godown_id, product_id)
);

-- ============================================
-- 9. INVENTORY SERIALS
-- ============================================
CREATE TABLE inventory_serials (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    serial TEXT NOT NULL,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('in_stock', 'allocated', 'installed', 'returned')) DEFAULT 'in_stock',
    godown_id BIGINT REFERENCES godowns(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. VISITS / PROJECTS
-- ============================================
CREATE TABLE visits (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    project_name TEXT,
    customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
    address TEXT,
    scheduled_at TIMESTAMPTZ,
    technician_ids BIGINT[] DEFAULT '{}',
    status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
    nvr_username TEXT,
    nvr_password TEXT,
    signature_data_url TEXT,
    -- Chalan info (embedded JSON)
    chalan JSONB,
    -- Work log (embedded JSON array)
    work_log JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. VISIT ITEMS (Products used in visit)
-- ============================================
CREATE TABLE visit_items (
    id BIGSERIAL PRIMARY KEY,
    visit_id BIGINT REFERENCES visits(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id),
    product_name TEXT,
    qty INTEGER DEFAULT 1,
    serial TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. PAYMENTS
-- ============================================
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    technician_id BIGINT REFERENCES technicians(id),
    technician_name TEXT,
    visit_id BIGINT REFERENCES visits(id),
    amount DECIMAL(12, 2) DEFAULT 0,
    status TEXT CHECK (status IN ('paid', 'pending')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. SERVICE STATIONS
-- ============================================
CREATE TABLE service_stations (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    contact TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. WARRANTY ENTRIES
-- ============================================
CREATE TABLE warranty_entries (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    customer_name TEXT,
    product_name TEXT,
    serial_number TEXT,
    issue TEXT,
    pickup_person TEXT,
    pickup_date TIMESTAMPTZ DEFAULT NOW(),
    status TEXT CHECK (status IN (
        'Awaiting Pickup', 'Received at Office', 'Sent to Service', 
        'Under Repair', 'Repaired', 'Replaced', 'Rejected', 'Returned to Customer'
    )) DEFAULT 'Awaiting Pickup',
    office_intake_date TIMESTAMPTZ,
    service_station_id BIGINT REFERENCES service_stations(id),
    dispatch_date TIMESTAMPTZ,
    courier_info TEXT,
    return_date TIMESTAMPTZ,
    -- Follow-ups as JSON array
    follow_ups JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 15. SITE HEALTH MONITORING
-- ============================================
CREATE TABLE site_health (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    customer_id BIGINT REFERENCES customers(id) ON DELETE CASCADE,
    is_online BOOLEAN DEFAULT FALSE,
    hdd_status TEXT CHECK (hdd_status IN ('Healthy', 'Error', 'No HDD', 'Not Found')) DEFAULT 'Not Found',
    recording_status TEXT CHECK (recording_status IN ('OK', 'Stopped')) DEFAULT 'Stopped',
    cameras_online INTEGER DEFAULT 0,
    total_cameras INTEGER DEFAULT 0,
    last_checked TIMESTAMPTZ DEFAULT NOW(),
    is_monitoring_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 16. AMCs (Annual Maintenance Contracts)
-- ============================================
CREATE TABLE amcs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cost DECIMAL(12, 2) DEFAULT 0,
    status TEXT CHECK (status IN ('Active', 'Expiring Soon', 'Expired')) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 17. INVOICES
-- ============================================
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    invoice_no TEXT NOT NULL,
    customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    sub_total DECIMAL(12, 2) DEFAULT 0,
    total_discount DECIMAL(12, 2) DEFAULT 0,
    total_gst DECIMAL(12, 2) DEFAULT 0,
    grand_total DECIMAL(12, 2) DEFAULT 0,
    status TEXT CHECK (status IN ('paid', 'unpaid', 'partial')) DEFAULT 'unpaid',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 18. INVOICE ITEMS
-- ============================================
CREATE TABLE invoice_items (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT REFERENCES invoices(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id),
    product_name TEXT,
    hsn_sac_code TEXT,
    qty INTEGER DEFAULT 1,
    rate DECIMAL(12, 2) DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    gst_rate INTEGER DEFAULT 18,
    taxable_value DECIMAL(12, 2) DEFAULT 0,
    cgst DECIMAL(12, 2) DEFAULT 0,
    sgst DECIMAL(12, 2) DEFAULT 0,
    igst DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) DEFAULT 0
);

-- ============================================
-- 19. LICENSE KEYS (Admin managed)
-- ============================================
CREATE TABLE license_keys (
    id BIGSERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    tier TEXT CHECK (tier IN ('starter', 'professional', 'enterprise')) NOT NULL,
    duration_days INTEGER NOT NULL,
    status TEXT CHECK (status IN ('active', 'used', 'revoked')) DEFAULT 'active',
    generated_by TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    used_by TEXT,
    used_at TIMESTAMPTZ
);

-- ============================================
-- 20. PAYSLIPS
-- ============================================
CREATE TABLE payslips (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    technician_id BIGINT REFERENCES technicians(id),
    technician_name TEXT,
    month TEXT NOT NULL,
    year INTEGER NOT NULL,
    -- Salary details as JSON
    salary_details JSONB DEFAULT '{}',
    -- Incentives as JSON array
    incentives JSONB DEFAULT '[]',
    -- Deductions as JSON array
    deductions JSONB DEFAULT '[]',
    net_payable DECIMAL(12, 2) DEFAULT 0,
    pdf_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 21. ATTENDANCE RECORDS
-- ============================================
CREATE TABLE attendance (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    technician_id BIGINT REFERENCES technicians(id),
    technician_name TEXT,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('Present', 'Absent', 'Half-day', 'Leave')) DEFAULT 'Present',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(technician_id, date)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_technicians_user_id ON technicians(user_id);
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_godowns_user_id ON godowns(user_id);
CREATE INDEX idx_godown_stock_godown_id ON godown_stock(godown_id);
CREATE INDEX idx_godown_stock_product_id ON godown_stock(product_id);
CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_customer_id ON visits(customer_id);
CREATE INDEX idx_visits_status ON visits(status);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_warranty_entries_user_id ON warranty_entries(user_id);
CREATE INDEX idx_amcs_user_id ON amcs(user_id);
CREATE INDEX idx_site_health_customer_id ON site_health(customer_id);

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dealer_info_updated_at BEFORE UPDATE ON dealer_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON technicians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warranty_entries_updated_at BEFORE UPDATE ON warranty_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_health_updated_at BEFORE UPDATE ON site_health FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_amcs_updated_at BEFORE UPDATE ON amcs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, role, is_setup_complete)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'dealer'),
        FALSE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
