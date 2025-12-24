-- Add status column to technicians table
ALTER TABLE technicians 
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active';
