-- Migration: Create Complaint Management System Schema

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Complaint Status Enum (optional, using text check constraints for flexibility)
-- Statuses: New, Assigned, Visit Scheduled, In Progress, Resolved, Closed, Cancelled

-- 2. Create Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id SERIAL PRIMARY KEY,
    complaint_id TEXT UNIQUE NOT NULL, -- Format: CMP-YYYY-0001
    user_id UUID NOT NULL REFERENCES auth.users(id), -- Dealer ID (Owner)
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    
    -- Site Details (Snapshot from customer or custom)
    site_address TEXT NOT NULL,
    site_area TEXT,
    site_city TEXT,
    site_pincode TEXT,
    site_landmark TEXT,
    
    -- Contact Details
    contact_person_name TEXT NOT NULL,
    contact_person_phone TEXT NOT NULL,
    
    -- Complaint Details
    category TEXT NOT NULL, -- No Power, No Video, etc.
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Normal', 'High', 'Urgent')),
    source TEXT NOT NULL CHECK (source IN ('Phone', 'WhatsApp', 'Walk-in', 'AMC', 'Other')),
    title TEXT NOT NULL,
    description TEXT,
    
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Assigned', 'Visit Scheduled', 'In Progress', 'Resolved', 'Closed', 'Cancelled')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Complaint Status History (Audit Trail)
CREATE TABLE IF NOT EXISTS complaint_status_history (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID NOT NULL REFERENCES auth.users(id),
    role TEXT NOT NULL, -- 'dealer' or 'technician'
    remark TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Complaint Assignments
CREATE TABLE IF NOT EXISTS complaint_assignments (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    technician_id INTEGER NOT NULL REFERENCES technicians(id),
    assigned_by UUID NOT NULL REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Unique active assignment constraint (optional, depending on if multiple techs allowed)
    UNIQUE (complaint_id, technician_id) 
);

-- 5. Create Complaint Visits (Scheduling)
CREATE TABLE IF NOT EXISTS complaint_visits (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    technician_id INTEGER NOT NULL REFERENCES technicians(id),
    visit_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    scheduling_notes TEXT,
    
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create Complaint Notes (Service Notes)
CREATE TABLE IF NOT EXISTS complaint_notes (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    role TEXT NOT NULL, -- 'dealer' or 'technician'
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create Complaint Attachments
CREATE TABLE IF NOT EXISTS complaint_attachments (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    file_path TEXT NOT NULL,
    file_type TEXT, -- image, doc
    description TEXT, -- Before/After label
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_complaints_user_id ON complaints(user_id);
CREATE INDEX idx_complaints_customer_id ON complaints(customer_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_assignments_tech ON complaint_assignments(technician_id);

-- RLS POLICIES (Row Level Security)

-- Enable RLS
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_attachments ENABLE ROW LEVEL SECURITY;

-- Policy: Dealers can view/edit their own complaints
CREATE POLICY "Dealers can view own complaints" ON complaints
    FOR ALL
    USING (auth.uid() = user_id);

-- Policy: Technicians can view complaints assigned to them
CREATE POLICY "Technicians can view assigned complaints" ON complaints
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM complaint_assignments ca
            JOIN technicians t ON t.id = ca.technician_id
            WHERE ca.complaint_id = complaints.id
            AND t.profile_id = auth.uid() -- Assuming technicians table has profile_id linking to auth.users
            AND ca.is_active = TRUE
        )
    );

-- Policy: Technicians can update specific fields (status) - Implementing via UPDATE usually requires checking ID
-- Simplified: Allow update if assigned. Trigger/App logic handles specific field restrictions.
CREATE POLICY "Technicians can update assigned complaints" ON complaints
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM complaint_assignments ca
            JOIN technicians t ON t.id = ca.technician_id
            WHERE ca.complaint_id = complaints.id
            AND t.profile_id = auth.uid()
            AND ca.is_active = TRUE
        )
    );

-- Similar policies for other tables... 
-- (For brevity, assuming standard pattern: Owner view/all, Assignee view/add)

-- Function to Auto-Generate Complaint ID (CMP-YYYY-SEQUENCE)
CREATE OR REPLACE FUNCTION generate_complaint_id()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix TEXT;
    next_seq INTEGER;
BEGIN
    year_prefix := 'CMP-' || to_char(NEW.created_at, 'YYYY') || '-';
    
    -- Simple sequence approach per Dealer might be complex, doing global sequence for simplicity or dealer-specific if needed.
    -- Global sequence for uniqueness:
    SELECT COUNT(*) + 1 INTO next_seq FROM complaints WHERE complaint_id LIKE year_prefix || '%';
    
    NEW.complaint_id := year_prefix || lpad(next_seq::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_complaint_id
BEFORE INSERT ON complaints
FOR EACH ROW
WHEN (NEW.complaint_id IS NULL)
EXECUTE FUNCTION generate_complaint_id();
