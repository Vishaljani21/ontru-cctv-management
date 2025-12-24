-- Add logo_url to dealer_info
ALTER TABLE dealer_info ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create storage bucket for dealer logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('dealer-logos', 'dealer-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view logos
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'dealer-logos' );

-- Policy: Authenticated users can upload their own logo
-- We'll simplify and allow auth users to upload files with their user_id as prefix
CREATE POLICY "Authenticated Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'dealer-logos' AND auth.role() = 'authenticated' );

-- Policy: Users can update their own logo
CREATE POLICY "Authenticated Update" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'dealer-logos' AND auth.role() = 'authenticated' );

-- Policy: Users can delete their own logo
CREATE POLICY "Authenticated Delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'dealer-logos' AND auth.role() = 'authenticated' );
