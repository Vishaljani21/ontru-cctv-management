-- JOB CARDS SCHEMA
-- Job cards are generated when a complaint is marked as Resolved
-- They serve as service completion documentation

-- Create Job Cards Table
CREATE TABLE IF NOT EXISTS public.job_cards (
    id SERIAL PRIMARY KEY,
    job_card_number TEXT UNIQUE NOT NULL, -- Format: JC-YYYY-0001
    
    -- References
    complaint_id INTEGER NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    dealer_id UUID NOT NULL REFERENCES auth.users(id),
    technician_id INTEGER REFERENCES public.technicians(id),
    customer_id INTEGER NOT NULL REFERENCES public.customers(id),
    
    -- Customer Snapshot (at time of service)
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city TEXT,
    
    -- Service Details
    complaint_title TEXT NOT NULL,
    complaint_category TEXT NOT NULL,
    work_done TEXT, -- Description of work performed
    parts_used TEXT, -- Parts/materials used
    resolution_notes TEXT, -- Final resolution notes
    
    -- Service Times
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    arrival_time TIME,
    departure_time TIME,
    
    -- Signatures (base64 or file paths)
    technician_signature TEXT,
    customer_signature TEXT,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'signed')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_job_cards_complaint ON public.job_cards(complaint_id);
CREATE INDEX IF NOT EXISTS idx_job_cards_dealer ON public.job_cards(dealer_id);
CREATE INDEX IF NOT EXISTS idx_job_cards_technician ON public.job_cards(technician_id);
CREATE INDEX IF NOT EXISTS idx_job_cards_date ON public.job_cards(service_date);

-- Enable RLS
ALTER TABLE public.job_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Dealers can manage their own job cards
CREATE POLICY "Dealers manage own job cards" ON public.job_cards
    FOR ALL
    USING (dealer_id = auth.uid())
    WITH CHECK (dealer_id = auth.uid());

-- Technicians can view/update job cards assigned to them
CREATE POLICY "Technicians view own job cards" ON public.job_cards
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.technicians t
            WHERE t.id = technician_id
            AND t.profile_id = auth.uid()
        )
    );

CREATE POLICY "Technicians update own job cards" ON public.job_cards
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.technicians t
            WHERE t.id = technician_id
            AND t.profile_id = auth.uid()
        )
    );

-- Function to auto-generate job card number
CREATE OR REPLACE FUNCTION generate_job_card_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix TEXT;
    next_seq INTEGER;
BEGIN
    year_prefix := 'JC-' || to_char(NOW(), 'YYYY') || '-';
    
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(job_card_number FROM LENGTH(year_prefix) + 1) AS INTEGER)
    ), 0) + 1 INTO next_seq
    FROM public.job_cards
    WHERE job_card_number LIKE year_prefix || '%';
    
    NEW.job_card_number := year_prefix || lpad(next_seq::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for job card number
DROP TRIGGER IF EXISTS trigger_generate_job_card_number ON public.job_cards;
CREATE TRIGGER trigger_generate_job_card_number
BEFORE INSERT ON public.job_cards
FOR EACH ROW
WHEN (NEW.job_card_number IS NULL)
EXECUTE FUNCTION generate_job_card_number();

-- Function to create job card from resolved complaint
CREATE OR REPLACE FUNCTION public.create_job_card_from_complaint(p_complaint_id INTEGER)
RETURNS public.job_cards
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_job_card public.job_cards;
    v_complaint RECORD;
    v_customer RECORD;
    v_technician_id INTEGER;
BEGIN
    -- Get complaint details
    SELECT c.*, cust.company_name, cust.contact_person, cust.mobile, cust.address, cust.city
    INTO v_complaint
    FROM public.complaints c
    JOIN public.customers cust ON cust.id = c.customer_id
    WHERE c.id = p_complaint_id;
    
    IF v_complaint IS NULL THEN
        RAISE EXCEPTION 'Complaint not found';
    END IF;
    
    -- Check if job card already exists
    IF EXISTS (SELECT 1 FROM public.job_cards WHERE complaint_id = p_complaint_id) THEN
        SELECT * INTO v_job_card FROM public.job_cards WHERE complaint_id = p_complaint_id;
        RETURN v_job_card;
    END IF;
    
    -- Get assigned technician
    SELECT technician_id INTO v_technician_id
    FROM public.complaint_assignments
    WHERE complaint_id = p_complaint_id AND is_active = TRUE
    LIMIT 1;
    
    -- Create job card
    INSERT INTO public.job_cards (
        complaint_id,
        dealer_id,
        technician_id,
        customer_id,
        customer_name,
        customer_phone,
        customer_address,
        customer_city,
        complaint_title,
        complaint_category,
        resolution_notes,
        service_date,
        status
    ) VALUES (
        p_complaint_id,
        v_complaint.user_id,
        v_technician_id,
        v_complaint.customer_id,
        COALESCE(v_complaint.contact_person, v_complaint.company_name),
        v_complaint.mobile,
        v_complaint.site_address,
        v_complaint.site_city,
        v_complaint.title,
        v_complaint.category,
        v_complaint.description,
        CURRENT_DATE,
        'draft'
    )
    RETURNING * INTO v_job_card;
    
    RETURN v_job_card;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_job_card_from_complaint(INTEGER) TO authenticated;

-- Grant table permissions
GRANT ALL ON public.job_cards TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE job_cards_id_seq TO authenticated;

DO $$
BEGIN
    RAISE NOTICE 'SUCCESS: Job cards schema created successfully.';
END $$;
