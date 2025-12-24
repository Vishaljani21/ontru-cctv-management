-- Add module preference columns to dealer_info
ALTER TABLE dealer_info 
ADD COLUMN IF NOT EXISTS is_billing_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_amc_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_hr_enabled BOOLEAN DEFAULT false;
