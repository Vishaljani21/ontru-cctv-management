CREATE OR REPLACE FUNCTION delete_customer_cascade(p_customer_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_complaint_ids BIGINT[];
    v_invoice_ids BIGINT[];
    v_visit_ids BIGINT[];
BEGIN
    -- 1. DELETE COMPLAINTS & RELATED (Job Cards)
    SELECT ARRAY_AGG(id) INTO v_complaint_ids FROM complaints WHERE customer_id = p_customer_id;

    IF v_complaint_ids IS NOT NULL THEN
        -- Delete Job Cards linked to complaints
        DELETE FROM job_cards WHERE complaint_id = ANY(v_complaint_ids);
        
        -- Delete Complaints
        DELETE FROM complaints WHERE id = ANY(v_complaint_ids);
    END IF;

    -- 2. DELETE INVOICES & ITEMS
    SELECT ARRAY_AGG(id) INTO v_invoice_ids FROM invoices WHERE customer_id = p_customer_id;

    IF v_invoice_ids IS NOT NULL THEN
        -- Delete Invoice Items first
        DELETE FROM invoice_items WHERE invoice_id = ANY(v_invoice_ids);
        
        -- Delete Invoices
        DELETE FROM invoices WHERE id = ANY(v_invoice_ids);
    END IF;

    -- 3. DELETE VISITS & ITEMS
    SELECT ARRAY_AGG(id) INTO v_visit_ids FROM visits WHERE customer_id = p_customer_id;

    IF v_visit_ids IS NOT NULL THEN
        -- Delete Visit Items
        DELETE FROM visit_items WHERE visit_id = ANY(v_visit_ids);
        
        -- Delete Visits
        DELETE FROM visits WHERE id = ANY(v_visit_ids);
    END IF;

    -- 4. DELETE CUSTOMER
    DELETE FROM customers WHERE id = p_customer_id;
END;
$$;
