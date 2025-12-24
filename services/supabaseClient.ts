// Supabase Client Configuration for Ontru CCTV Management
import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Type exports for database schema
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    name: string;
                    role: 'dealer' | 'technician' | 'admin';
                    phone: string | null;
                    is_setup_complete: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
            };
            dealer_info: {
                Row: {
                    id: string;
                    user_id: string;
                    company_name: string;
                    owner_name: string | null;
                    address: string | null;
                    gstin: string | null;
                    email: string | null;
                    mobile: string | null;
                    upi_id: string | null;
                    bank_name: string | null;
                    account_no: string | null;
                    ifsc_code: string | null;
                    qr_code_url: string | null;
                    subscription_tier: 'starter' | 'professional' | 'enterprise';
                    subscription_start_date: string | null;
                    subscription_expiry_date: string | null;
                    subscription_status: 'active' | 'expired' | 'trial';
                    created_at: string;
                    updated_at: string;
                };
            };
            customers: {
                Row: {
                    id: number;
                    user_id: string;
                    company_name: string;
                    contact_person: string | null;
                    mobile: string | null;
                    email: string | null;
                    address: string | null;
                    area: string | null;
                    city: string | null;
                    gst: string | null;
                    created_at: string;
                    updated_at: string;
                };
            };
            // Add more table types as needed
        };
    };
};
