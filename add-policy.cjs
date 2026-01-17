// Script to add RLS policy for complaint_assignments
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:55321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPolicy() {
    console.log('Adding RLS policy for complaint_assignments...');

    // Run raw SQL using service role (admin access)
    const { data, error } = await supabase.from('complaint_assignments').select('count').limit(1);

    if (error) {
        console.log('Table exists, checking policies via Supabase Studio...');
    } else {
        console.log('Table complaint_assignments exists. Policy needs to be added via Supabase Studio SQL editor.');
    }

    console.log('');
    console.log('=== MANUAL STEP REQUIRED ===');
    console.log('1. Open Supabase Studio: http://127.0.0.1:55323');
    console.log('2. Go to SQL Editor');
    console.log('3. Run this SQL:');
    console.log('');
    console.log(`
DROP POLICY IF EXISTS "Dealers can manage assignments for own complaints" ON complaint_assignments;

CREATE POLICY "Dealers can manage assignments for own complaints" ON complaint_assignments
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM complaints c
            WHERE c.id = complaint_assignments.complaint_id
            AND c.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM complaints c
            WHERE c.id = complaint_id
            AND c.user_id = auth.uid()
        )
    );
`);
}

addPolicy().then(() => process.exit(0));
