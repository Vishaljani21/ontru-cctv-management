
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to load env from .env.local
const loadEnv = () => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const envPath = path.resolve(__dirname, '.env.local');

        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            console.log("Loading .env.local...");
            content.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join('=').trim();
                    if (key && value) {
                        process.env[key] = value;
                    }
                }
            });
        } else {
            console.warn(".env.local file not found at", envPath);
        }
    } catch (e) {
        console.warn("Could not load .env.local", e);
    }
};

loadEnv();

// Retrieve ENV variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials. VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found.");
    console.log("Current Env Keys:", Object.keys(process.env).filter(k => k.startsWith('VITE_')));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const users = [
    {
        email: 'admin@ontru.com',
        password: 'password123',
        role: 'admin',
        name: 'Super Admin',
        phone: '9876543210'
    },
    {
        email: 'dealer@ontru.com',
        password: 'password123',
        role: 'dealer',
        name: 'Demo Dealer',
        phone: '9876543211'
    },
    {
        email: 'tech@ontru.com',
        password: 'password123',
        role: 'technician',
        name: 'John Tech',
        phone: '9876543212'
    }
];

async function seedUsers() {
    console.log("Seeding users...");

    for (const user of users) {
        console.log(`Creating ${user.role}: ${user.email}`);

        const { data, error } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
                data: {
                    name: user.name,
                    role: user.role,
                    phone: user.phone
                }
            }
        });

        if (error) {
            if (error.message.includes('already registered')) {
                console.log(`User ${user.email} already exists.`);
            } else {
                console.error(`Failed to create ${user.email}:`, error.message);
            }
        } else {
            console.log(`Successfully created ${user.email}`);

            if (data.user) {
                if (user.role === 'dealer') {
                    await apiCompleteSetup(data.user.id, user.name);
                }
            }
        }
    }

    console.log("Seeding complete.");
}

async function apiCompleteSetup(userId, name) {
    const { error } = await supabase
        .from('profiles')
        .update({ is_setup_complete: true })
        .eq('id', userId);

    if (!error) {
        await supabase.from('dealer_info').upsert({
            user_id: userId,
            company_name: 'Demo Enterprises',
            owner_name: name,
            subscription_tier: 'professional',
            subscription_status: 'active'
        });
        console.log("Completed verification setup for dealer.");
    } else {
        console.error("Failed to complete setup:", error);
    }
}

seedUsers();
