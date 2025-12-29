-- Migration: 20241227000000_project_details.sql
-- Description: Add detailed project tracking fields to visits table

ALTER TABLE visits
ADD COLUMN IF NOT EXISTS project_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS site_type TEXT,
ADD COLUMN IF NOT EXISTS project_type TEXT,
ADD COLUMN IF NOT EXISTS timeline_status JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS material_usage JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS cable_usage JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Create index for project code lookups
CREATE INDEX IF NOT EXISTS visits_project_code_idx ON visits(project_code);
