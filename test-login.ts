import fs from 'fs';
import path from 'path';

// Manual .env loader
const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });
            console.log("Loaded .env.local");
        } else {
            console.log("No .env.local found");
        }
    } catch (e) {
        console.error("Failed to load env:", e);
    }
};

// Load env before importing services
loadEnv();

const testLogin = async () => {
    try {
        console.log("Attempting login as dealer...");
        const { api } = await import('./services/api');
        console.log("Imported API module...");

        // Use credentials that are likely valid or mocked
        const user = await api.login('dealer@example.com', 'password123');
        console.log("Login successful:", user);

        if (user.role === 'dealer') {
            console.log("Attempting to fetch dealer info...");
            const info = await api.getDealerInfo();
            console.log("Dealer info fetched:", info);
        }
    } catch (error: any) {
        console.error("Login test failed:", error.message || error);
        if (error.cause) console.error("Cause:", error.cause);
    }
};

testLogin();
