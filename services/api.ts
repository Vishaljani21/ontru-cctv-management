// Ontru CCTV Management - Supabase API Service
// Replaces mockDb.ts with real Supabase backend

import { supabase } from './supabaseClient';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

import type {
    User, DashboardSummary, Visit, Technician, Customer, Godown, GodownStock, InventorySerial,
    Product, Brand, StockSummary, LowStockProduct, Payment, TechnicianDashboardSummary,
    WarrantyEntry, ServiceStation, SiteHealth, AMC, Invoice, DealerInfo, InvoiceItem,
    Payslip, AttendanceRecord, WorkLogEntry, SubscriptionTier, LicenseKey, JobCardItem,
    SupportTicket, TicketCategory, TicketPriority, TicketStatus,
    TechnicianAvailability, Expense, TechnicianTask, Supplier, TechnicianProject, TimelineStep
} from '../types';


// Helper to get current user ID
const getCurrentUserId = async (): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    return user.id;
};

// Transform database row to frontend types
const transformCustomer = (row: any): Customer => ({
    id: row.id,
    companyName: row.company_name,
    contactPerson: row.contact_person || '',
    mobile: row.mobile || '',
    email: row.email || '',
    address: row.address || '',
    area: row.area || '',
    city: row.city || '',
    gst: row.gst || ''
});

const transformProduct = (row: any): Product => ({
    id: row.id,
    brandId: row.brand_id,
    brandName: row.brands?.name || 'Unknown',
    model: row.model,
    category: row.category,
    isSerialized: row.is_serialized,
    lowStockThreshold: row.low_stock_threshold,
    hsnSacCode: row.hsn_sac_code || '',
    gstRate: row.gst_rate
});

const transformVisit = (row: any): Visit => ({
    id: row.id,
    projectName: row.project_name,
    customerId: row.customer_id,
    address: row.address || '',
    scheduledAt: row.scheduled_at,
    technicianIds: row.technician_ids || [],
    items: row.visit_items?.map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        qty: item.qty,
        serial: item.serial
    })) || [],
    status: row.status,
    chalan: row.chalan,
    nvrUsername: row.nvr_username,
    nvrPassword: row.nvr_password,
    signatureDataUrl: row.signature_data_url,
    workLog: row.work_log || [],
    projectCode: row.project_code,
    siteType: row.site_type,
    projectType: row.project_type,
    timelineStatus: row.timeline_status || [],
    materialUsage: row.material_usage || [],
    cableUsage: row.cable_usage || [],
    attachments: row.attachments || []
});

const transformDealerInfo = (row: any): DealerInfo => ({
    id: row.id,
    companyName: row.company_name,
    ownerName: row.owner_name,
    address: row.address || '',
    gstin: row.gstin || '',
    email: row.email || '',
    mobile: row.mobile || '',
    upiId: row.upi_id || '',
    bankName: row.bank_name || '',
    accountNo: row.account_no || '',
    ifscCode: row.ifsc_code || '',
    qrCodeUrl: row.qr_code_url,
    logoUrl: row.logo_url,
    isBillingEnabled: row.is_billing_enabled,
    isAmcEnabled: row.is_amc_enabled,
    isHrEnabled: row.is_hr_enabled,
    subscription: {
        tier: row.subscription_tier || 'starter',
        startDate: row.subscription_start_date || new Date().toISOString(),
        expiryDate: row.subscription_expiry_date || new Date().toISOString(),
        status: row.subscription_status || 'trial'
    }
});

import type { Complaint, ComplaintHistory, ComplaintVisit, ComplaintNote, ComplaintAssignment, ComplaintStats } from '../types';

const transformComplaint = (row: any): Complaint => ({
    id: row.id,
    complaintId: row.complaint_id,
    userId: row.user_id,
    customerId: row.customer_id,
    customerName: row.customers?.company_name || 'Unknown',
    siteAddress: row.site_address,
    siteArea: row.site_area,
    siteCity: row.site_city,
    contactPersonName: row.contact_person_name,
    contactPersonPhone: row.contact_person_phone,
    category: row.category,
    priority: row.priority,
    source: row.source,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Optional joins logic to be handled in fetch
});

export const api = {
    // ==========================================
    // AUTHENTICATION
    // ==========================================
    login: async (identifier: string, secret: string): Promise<User> => {
        // Check for admin login
        if (identifier === 'admin@ontru.com' && secret === 'admin123') {
            // For admin, we use a special flow
            const { data, error } = await supabase.auth.signInWithPassword({
                email: identifier,
                password: secret
            });

            if (error) {
                // If admin doesn't exist in auth, create them
                if (error.message.includes('Invalid login')) {
                    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                        email: identifier,
                        password: secret,
                        options: {
                            data: { name: 'Super Admin', role: 'admin' }
                        }
                    });
                    if (signUpError) throw signUpError;

                    return {
                        id: 99,
                        name: 'Super Admin',
                        role: 'admin',
                        email: identifier,
                        isSetupComplete: true
                    };
                }
                throw error;
            }

            // Force update metadata to ensure RLS works
            await supabase.auth.updateUser({
                data: { role: 'admin', name: 'Super Admin' }
            });

            return {
                id: 99,
                name: 'Super Admin',
                role: 'admin',
                email: identifier,
                isSetupComplete: true
            };
        }

        // Regular login (dealer/technician)
        const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier,
            password: secret
        });

        if (error) {
            console.error("Supabase Login Error:", error);
            throw error;
        }

        // Get profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) throw profileError;

        return {
            id: parseInt(data.user.id.slice(-8), 16) || Date.now(), // Convert UUID to number for compatibility
            name: profile.name,
            role: profile.role,
            email: data.user.email,
            phone: profile.phone,
            isSetupComplete: profile.is_setup_complete
        };
    },

    register: async (userData: { email: string; phone: string; password?: string }): Promise<User> => {
        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password || 'default123', // You should require password
            options: {
                data: {
                    phone: userData.phone,
                    role: 'dealer'
                }
            }
        });

        if (error) {
            if (error.message.includes('already registered')) {
                throw new Error("User with this email already exists.");
            }
            throw error;
        }

        if (!data.user) throw new Error("Registration failed");

        return {
            id: parseInt(data.user.id.slice(-8), 16) || Date.now(),
            name: '',
            email: userData.email,
            phone: userData.phone,
            role: 'dealer',
            isSetupComplete: false
        };
    },

    completeSetup: async (userId: number, setupData: Partial<DealerInfo> & { name: string }): Promise<User> => {
        const supabaseUserId = await getCurrentUserId();

        // Update profile
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                name: setupData.name,
                is_setup_complete: true
            })
            .eq('id', supabaseUserId);

        if (profileError) throw profileError;

        // Create/Update dealer info
        const { error: dealerError } = await supabase
            .from('dealer_info')
            .upsert({
                user_id: supabaseUserId,
                company_name: setupData.companyName || 'My Company',
                owner_name: setupData.name,
                address: setupData.address || '',
                gstin: setupData.gstin || '',
                email: setupData.email || '',
                mobile: setupData.mobile || '',
                subscription_tier: 'starter',
                subscription_start_date: new Date().toISOString(),
                subscription_expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                subscription_status: 'trial'
            }, { onConflict: 'user_id' });

        if (dealerError) throw dealerError;

        return {
            id: userId,
            name: setupData.name,
            role: 'dealer',
            isSetupComplete: true
        };
    },

    logout: async (): Promise<void> => {
        await supabase.auth.signOut();
    },

    // ==========================================
    // DASHBOARD
    // ==========================================
    getDashboardSummary: async (): Promise<DashboardSummary> => {
        const userId = await getCurrentUserId();

        const [visitsRes, invoicesRes, techniciansRes] = await Promise.all([
            supabase.from('visits').select('id', { count: 'exact' }).eq('user_id', userId),
            supabase.from('invoices').select('id, status, grand_total').eq('user_id', userId),
            supabase.from('technicians').select('id', { count: 'exact' }).eq('user_id', userId)
        ]);

        const unpaidInvoices = invoicesRes.data?.filter(i => i.status !== 'paid') || [];

        return {
            projects: visitsRes.count || 0,
            pendingInvoicesCount: unpaidInvoices.length,
            pendingPayments: unpaidInvoices.reduce((sum, i) => sum + (i.grand_total || 0), 0),
            technicians: techniciansRes.count || 0
        };
    },

    // ==========================================
    // CUSTOMERS
    // ==========================================
    getCustomers: async (): Promise<Customer[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('user_id', userId)
            .order('company_name');

        if (error) throw error;
        return (data || []).map(transformCustomer);
    },

    getCustomerById: async (id: number): Promise<Customer> => {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw new Error("Customer not found");
        return transformCustomer(data);
    },

    addCustomer: async (customerData: Omit<Customer, 'id'>): Promise<Customer> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('customers')
            .insert({
                user_id: userId,
                company_name: customerData.companyName,
                contact_person: customerData.contactPerson,
                mobile: customerData.mobile,
                email: customerData.email,
                address: customerData.address,
                area: customerData.area,
                city: customerData.city,
                gst: customerData.gst
            })
            .select()
            .single();

        if (error) throw error;
        return transformCustomer(data);
    },

    updateCustomer: async (customerData: Customer): Promise<Customer> => {
        const { data, error } = await supabase
            .from('customers')
            .update({
                company_name: customerData.companyName,
                contact_person: customerData.contactPerson,
                mobile: customerData.mobile,
                email: customerData.email,
                address: customerData.address,
                area: customerData.area,
                city: customerData.city,
                gst: customerData.gst
            })
            .eq('id', customerData.id)
            .select()
            .single();

        if (error) throw error;
        return transformCustomer(data);
    },

    deleteCustomer: async (customerId: number): Promise<void> => {
        // Try to use the server-side function first (safer, cleaner)
        const { error: rpcError } = await supabase.rpc('delete_customer_cascade', { p_customer_id: customerId });

        if (!rpcError) return;

        // If RPC failed (e.g. function doesn't exist), try client-side cascade delete
        console.warn("RPC delete_customer_cascade failed, attempting client-side cascade...", rpcError);

        // 1. Delete Job Cards & Complaints
        const { data: complaints } = await supabase.from('complaints').select('id').eq('customer_id', customerId);
        if (complaints && complaints.length > 0) {
            const complaintIds = complaints.map(c => c.id);
            await supabase.from('job_cards').delete().in('complaint_id', complaintIds);
            await supabase.from('complaints').delete().in('id', complaintIds);
        }

        // 2. Delete Invoices & Items
        const { data: invoices } = await supabase.from('invoices').select('id').eq('customer_id', customerId);
        if (invoices && invoices.length > 0) {
            const invoiceIds = invoices.map(i => i.id);
            await supabase.from('invoice_items').delete().in('invoice_id', invoiceIds);
            await supabase.from('invoices').delete().in('id', invoiceIds);
        }

        // 3. Delete Visits & Items
        const { data: visits } = await supabase.from('visits').select('id').eq('customer_id', customerId);
        if (visits && visits.length > 0) {
            const visitIds = visits.map(v => v.id);
            await supabase.from('visit_items').delete().in('visit_id', visitIds);
            await supabase.from('visits').delete().in('id', visitIds);
        }

        // 4. Finally Delete Customer
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', customerId);

        if (error) throw error;
    },

    // ==========================================
    // TECHNICIANS
    // ==========================================
    getTechnicians: async (): Promise<Technician[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('technicians')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return (data || []).map(row => ({
            id: row.id,
            name: row.name,
            phone: row.phone || '',
            specialization: row.specialization || '',
            status: row.status || 'active'
        }));
    },

    addTechnician: async (technicianData: Omit<Technician, 'id'> & { email?: string; password?: string }): Promise<Technician> => {
        const userId = await getCurrentUserId();
        let techUserId = null;

        // 1. Create Login Credential if email/pass provided
        if (technicianData.email && technicianData.password) {
            // Use RPC to create user directly in database (bypasses broken GoTrue identity creation)
            const { data: newUserId, error: rpcError } = await supabase.rpc('create_technician_user', {
                p_email: technicianData.email,
                p_password: technicianData.password,
                p_name: technicianData.name,
                p_phone: technicianData.phone || ''
            });

            if (rpcError) {
                console.error("Failed to create auth user via RPC:", rpcError);
                throw new Error(`Failed to create login: ${rpcError.message}`);
            }

            techUserId = newUserId;

            // 2. Ensure Profile entry exists/updates
            if (techUserId) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: techUserId,
                        name: technicianData.name,
                        role: 'technician',
                        phone: technicianData.phone,
                    }, { onConflict: 'id' });

                if (profileError) console.error("Failed to upsert profile:", profileError);
            }
        }

        // 3. Create or Update Technician Record (linked to Dealer)
        // Check if technician already exists for this dealer/profile to avoid duplicates
        let query = supabase.from('technicians').select('id').eq('user_id', userId);
        if (techUserId) {
            query = query.eq('profile_id', techUserId);
        } else {
            // Fallback to checking phone if no auth user (legacy flow)
            query = query.eq('phone', technicianData.phone);
        }

        const { data: existingTech } = await query.maybeSingle();

        let result;
        if (existingTech) {
            // Update existing
            result = await supabase
                .from('technicians')
                .update({
                    name: technicianData.name,
                    phone: technicianData.phone,
                    specialization: technicianData.specialization,
                    profile_id: techUserId || undefined // Update profile_id if we just found it
                })
                .eq('id', existingTech.id)
                .select()
                .single();
        } else {
            // Insert new
            result = await supabase
                .from('technicians')
                .insert({
                    user_id: userId, // Dealer ID
                    profile_id: techUserId, // Technician Auth ID (if created)
                    name: technicianData.name,
                    phone: technicianData.phone,
                    specialization: technicianData.specialization
                })
                .select()
                .single();
        }

        const { data, error } = result;

        if (error) throw error;
        return {
            id: data.id,
            name: data.name,
            phone: data.phone || '',
            specialization: data.specialization || '',
            status: data.status || 'active'
        };
    },

    updateTechnician: async (id: number, updates: Partial<Technician>): Promise<Technician> => {
        const { data, error } = await supabase
            .from('technicians')
            .update({
                name: updates.name,
                phone: updates.phone,
                specialization: updates.specialization,
                status: updates.status
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return {
            id: data.id,
            name: data.name,
            phone: data.phone || '',
            specialization: data.specialization || '',
            status: data.status || 'active'
        };
    },

    deleteTechnician: async (id: number): Promise<void> => {
        const { error } = await supabase
            .from('technicians')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // ==========================================
    // BRANDS
    // ==========================================
    getBrands: async (): Promise<Brand[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return (data || []).map(row => ({
            id: row.id,
            name: row.name
        }));
    },

    addBrand: async (name: string): Promise<Brand> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('brands')
            .insert({ user_id: userId, name })
            .select()
            .single();

        if (error) throw error;
        return { id: data.id, name: data.name };
    },

    updateBrand: async (id: number, name: string): Promise<Brand> => {
        const { data, error } = await supabase
            .from('brands')
            .update({ name })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { id: data.id, name: data.name };
    },

    deleteBrand: async (id: number): Promise<void> => {
        const { error } = await supabase
            .from('brands')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // ==========================================
    // PRODUCTS
    // ==========================================
    getAllProducts: async (): Promise<Product[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('products')
            .select('*, brands(name)')
            .eq('user_id', userId);

        if (error) throw error;
        return (data || []).map(transformProduct);
    },

    addProduct: async (productData: Omit<Product, 'id' | 'brandName'>, initialStock: number = 0): Promise<Product> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('products')
            .insert({
                user_id: userId,
                brand_id: productData.brandId,
                model: productData.model,
                category: productData.category,
                is_serialized: productData.isSerialized,
                low_stock_threshold: productData.lowStockThreshold,
                hsn_sac_code: productData.hsnSacCode,
                gst_rate: productData.gstRate
            })
            .select('*, brands(name)')
            .single();

        if (error) throw error;

        // Handle Initial Stock
        if (initialStock > 0) {
            // Get or Create Default Godown
            const { data: godowns } = await supabase.from('godowns').select('id').eq('user_id', userId).limit(1);
            let godownId;

            if (godowns && godowns.length > 0) {
                godownId = godowns[0].id;
            } else {
                // Create default godown
                const { data: newGodown } = await supabase.from('godowns').insert({ user_id: userId, name: 'Main Godown', location: 'Office' }).select().single();
                godownId = newGodown?.id;
            }

            if (godownId) {
                await supabase.from('godown_stock').insert({
                    godown_id: godownId,
                    product_id: data.id,
                    quantity: initialStock
                });
            }
        }

        return transformProduct(data);
    },

    updateProduct: async (productData: Omit<Product, 'brandName'>, newStock?: number): Promise<Product> => {
        const { data, error } = await supabase
            .from('products')
            .update({
                brand_id: productData.brandId,
                model: productData.model,
                category: productData.category,
                is_serialized: productData.isSerialized,
                low_stock_threshold: productData.lowStockThreshold,
                hsn_sac_code: productData.hsnSacCode,
                gst_rate: productData.gstRate
            })
            .eq('id', productData.id)
            .select('*, brands(name)')
            .single();

        if (error) throw error;

        // Update Stock if provided
        if (typeof newStock === 'number') {
            const userId = await getCurrentUserId();
            // Find stock entry to update (assuming first/default godown for simplicity of this feature)
            const { data: godowns } = await supabase.from('godowns').select('id').eq('user_id', userId).limit(1);
            const godownId = godowns?.[0]?.id;

            if (godownId) {
                // Check if entry exists
                const { data: stockEntry } = await supabase
                    .from('godown_stock')
                    .select('id')
                    .eq('godown_id', godownId)
                    .eq('product_id', productData.id)
                    .maybeSingle();

                if (stockEntry) {
                    await supabase.from('godown_stock').update({ quantity: newStock }).eq('id', stockEntry.id);
                } else {
                    await supabase.from('godown_stock').insert({
                        godown_id: godownId,
                        product_id: productData.id,
                        quantity: newStock
                    });
                }
            }
        }

        return transformProduct(data);
    },

    // ==========================================
    // GODOWNS
    // ==========================================
    getGodowns: async (): Promise<Godown[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('godowns')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return (data || []).map(row => ({
            id: row.id,
            name: row.name,
            location: row.location || ''
        }));
    },

    getGodownStock: async (godownId: number): Promise<GodownStock[]> => {
        const { data, error } = await supabase
            .from('godown_stock')
            .select('*, products(model, brand_id, brands(name))')
            .eq('godown_id', godownId);

        if (error) throw error;
        return (data || []).map(row => ({
            productId: row.product_id,
            productName: row.products?.model || 'Unknown',
            brand: row.products?.brands?.name || 'Unknown',
            quantity: row.quantity
        }));
    },

    addGodown: async (name: string, location: string): Promise<Godown> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('godowns')
            .insert({ user_id: userId, name, location })
            .select()
            .single();

        if (error) throw error;
        return { id: data.id, name: data.name, location: data.location };
    },

    updateGodown: async (id: number, name: string, location: string): Promise<Godown> => {
        const { data, error } = await supabase
            .from('godowns')
            .update({ name, location })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { id: data.id, name: data.name, location: data.location };
    },

    deleteGodown: async (id: number): Promise<void> => {
        const { error } = await supabase
            .from('godowns')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // ==========================================
    // INVENTORY
    // ==========================================
    getInventorySerials: async (): Promise<InventorySerial[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('inventory_serials')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return (data || []).map(row => ({
            serial: row.serial,
            productId: row.product_id,
            status: row.status
        }));
    },

    getStockSummary: async (): Promise<StockSummary[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('products')
            .select('id, model, category, brands(name), godown_stock(quantity)')
            .eq('user_id', userId);

        if (error) throw error;

        return (data || []).map(p => ({
            productId: p.id,
            productName: p.model,
            brandName: (Array.isArray(p.brands) ? p.brands[0] : p.brands)?.name || 'Unknown',
            category: p.category,
            totalStock: (p.godown_stock || []).reduce((sum: number, s: any) => sum + (s.quantity || 0), 0)
        }));
    },

    getLowStockProducts: async (): Promise<LowStockProduct[]> => {
        const summary = await api.getStockSummary();
        const userId = await getCurrentUserId();

        const { data: products } = await supabase
            .from('products')
            .select('id, low_stock_threshold')
            .eq('user_id', userId);

        const thresholds = new Map((products || []).map(p => [p.id, p.low_stock_threshold]));

        return summary
            .filter(s => s.totalStock < (thresholds.get(s.productId) || 10))
            .map(s => ({
                productId: s.productId,
                productName: s.productName,
                brandName: s.brandName,
                totalStock: s.totalStock,
                lowStockThreshold: thresholds.get(s.productId) || 10
            }));
    },

    addStockMovement: async (data: any): Promise<void> => {
        // Handle stock movement - this would update godown_stock and inventory_serials
        console.log("Stock movement:", data);
        // Implementation depends on the movement type (in/out/transfer)
    },

    lookupProductBySerial: async (serial: string): Promise<{ product: Product, serial: string }> => {
        const { data, error } = await supabase
            .from('inventory_serials')
            .select('*, products(*, brands(name))')
            .eq('serial', serial)
            .single();

        if (error || !data) throw new Error("Serial number not found in inventory.");
        if (data.status !== 'in_stock') throw new Error(`Serial is already ${data.status}.`);

        return {
            product: transformProduct(data.products),
            serial: data.serial
        };
    },

    // ==========================================
    // VISITS / PROJECTS
    // ==========================================
    getVisitById: async (id: number): Promise<Visit> => {
        const { data, error } = await supabase
            .from('visits')
            .select('*, visit_items(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return transformVisit(data);
    },
    getVisits: async (): Promise<Visit[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('visits')
            .select('*, visit_items(*)')
            .eq('user_id', userId)
            .order('scheduled_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(transformVisit);
    },

    addProject: async (projectData: Omit<Visit, 'id'>): Promise<Visit> => {
        const userId = await getCurrentUserId();

        const { data: visit, error: visitError } = await supabase
            .from('visits')
            .insert({
                user_id: userId,
                project_name: projectData.projectName,
                customer_id: projectData.customerId,
                address: projectData.address,
                scheduled_at: projectData.scheduledAt,
                technician_ids: projectData.technicianIds,
                status: projectData.status || 'scheduled',
                project_code: projectData.projectCode,
                site_type: projectData.siteType,
                project_type: projectData.projectType,
                timeline_status: projectData.timelineStatus,
                material_usage: projectData.materialUsage,
                cable_usage: projectData.cableUsage,
                attachments: projectData.attachments
            })
            .select()
            .single();

        if (visitError) throw visitError;

        // Insert visit items
        if (projectData.items && projectData.items.length > 0) {
            const { error: itemsError } = await supabase
                .from('visit_items')
                .insert(projectData.items.map(item => ({
                    visit_id: visit.id,
                    product_id: item.productId,
                    product_name: item.productName,
                    qty: item.qty,
                    serial: item.serial
                })));

            if (itemsError) throw itemsError;
        }

        return transformVisit({ ...visit, visit_items: projectData.items });
    },

    updateVisit: async (id: number, updates: Partial<Visit>): Promise<Visit> => {
        const { data, error } = await supabase
            .from('visits')
            .update({
                project_name: updates.projectName,
                customer_id: updates.customerId,
                address: updates.address,
                scheduled_at: updates.scheduledAt,
                technician_ids: updates.technicianIds,
                status: updates.status,
                project_code: updates.projectCode,
                site_type: updates.siteType,
                project_type: updates.projectType,
                timeline_status: updates.timelineStatus,
                material_usage: updates.materialUsage,
                cable_usage: updates.cableUsage,
                attachments: updates.attachments,
                nvr_username: updates.nvrUsername,
                nvr_password: updates.nvrPassword
            })
            .eq('id', id)
            .select('*, visit_items(*)')
            .single();

        if (error) throw error;
        return transformVisit(data);
    },

    updateVisitStatus: async (visitId: number, status: Visit['status']): Promise<Visit> => {
        const { data, error } = await supabase
            .from('visits')
            .update({ status })
            .eq('id', visitId)
            .select('*, visit_items(*)')
            .single();

        if (error) throw error;
        return transformVisit(data);
    },

    updateProjectTimeline: async (visitId: number, timeline: TimelineStep[]): Promise<Visit> => {
        // Calculate project status based on timeline
        const completedSteps = timeline.filter(s => s.status === 'completed').length;
        const currentSteps = timeline.filter(s => s.status === 'current').length;
        const allCompleted = completedSteps === timeline.length;

        // Determine overall project status
        let projectStatus: Visit['status'] = 'scheduled';
        if (allCompleted) {
            projectStatus = 'completed';
        } else if (completedSteps > 0 || currentSteps > 0) {
            projectStatus = 'in_progress';
        }

        const { data, error } = await supabase
            .from('visits')
            .update({
                timeline_status: timeline,
                status: projectStatus
            })
            .eq('id', visitId)
            .select('*, visit_items(*)')
            .single();

        if (error) throw error;
        return transformVisit(data);
    },

    updateVisitCredentials: async (visitId: number, nvrUsername: string, nvrPassword: string): Promise<Visit> => {
        const { data, error } = await supabase
            .from('visits')
            .update({ nvr_username: nvrUsername, nvr_password: nvrPassword })
            .eq('id', visitId)
            .select('*, visit_items(*)')
            .single();

        if (error) throw error;
        return transformVisit(data);
    },

    generateChalan: async (visitId: number): Promise<Visit['chalan']> => {
        const chalan = {
            id: Date.now(),
            chalanNo: `CHLN-${Date.now()}`,
            pdfPath: '/mock-chalan.pdf'
        };

        const { error } = await supabase
            .from('visits')
            .update({ chalan })
            .eq('id', visitId);

        if (error) throw error;
        return chalan;
    },

    completeVisit: async (
        visitId: number,
        nvrUsername: string,
        nvrPassword: string,
        signature: string,
        workLog: Omit<WorkLogEntry, 'date' | 'technicianId'>
    ): Promise<Visit> => {
        const { data: visit, error: fetchError } = await supabase
            .from('visits')
            .select('work_log, technician_ids')
            .eq('id', visitId)
            .single();

        if (fetchError) throw fetchError;

        const newWorkLog = [
            ...(visit.work_log || []),
            {
                ...workLog,
                date: new Date().toISOString(),
                technicianId: visit.technician_ids?.[0] || 0
            }
        ];

        const { data, error } = await supabase
            .from('visits')
            .update({
                status: 'completed',
                nvr_username: nvrUsername,
                nvr_password: nvrPassword,
                signature_data_url: signature,
                work_log: newWorkLog
            })
            .eq('id', visitId)
            .select('*, visit_items(*)')
            .single();

        if (error) throw error;
        return transformVisit(data);
    },

    // Helper to get technician table ID from profile ID
    getTechnicianIdFromProfile: async (): Promise<number | null> => {
        const userId = await getCurrentUserId();
        const { data, error } = await supabase
            .from('technicians')
            .select('id')
            .eq('profile_id', userId)
            .single();

        if (error || !data) return null;
        return data.id;
    },

    getMyVisits: async (technicianId: number): Promise<Visit[]> => {
        // First, try to get actual technician ID from profile if the passed ID is a profile ID
        const userId = await getCurrentUserId();

        // Check if we need to resolve the technician ID
        const { data: techData } = await supabase
            .from('technicians')
            .select('id')
            .eq('profile_id', userId)
            .single();

        const actualTechId = techData?.id || technicianId;

        const { data, error } = await supabase
            .from('visits')
            .select('*, visit_items(*)')
            .contains('technician_ids', [actualTechId])
            .order('scheduled_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(transformVisit);
    },

    // Get enriched projects for technician dashboard
    getMyProjectsWithTimeline: async (): Promise<TechnicianProject[]> => {
        const userId = await getCurrentUserId();

        // 1. Get technician ID from profile
        const { data: techData, error: techError } = await supabase
            .from('technicians')
            .select('id, user_id')
            .eq('profile_id', userId)
            .single();

        if (techError || !techData) {
            console.warn('User is not a linked technician:', techError);
            return [];
        }

        const technicianId = techData.id;
        const dealerId = techData.user_id; // The dealer who owns this technician

        console.log('Fetching projects for technician ID:', technicianId, 'under dealer:', dealerId);

        // 2. Fetch projects from dealer that have this technician assigned
        // RLS policy "Technicians can view assigned visits" handles filtering
        // We query visits where dealer_id matches and technician_ids contains this tech
        const { data: visits, error: visitsError } = await supabase
            .from('visits')
            .select('*, visit_items(*)')
            .order('scheduled_at', { ascending: false });

        if (visitsError) {
            console.error('Error fetching visits:', visitsError);
            throw visitsError;
        }

        console.log('Received visits from RLS-filtered query:', visits?.length || 0);

        // Filter visits that have this technician assigned (RLS should already do this, but double-check)
        const assignedVisits = (visits || []).filter(v =>
            v.technician_ids && Array.isArray(v.technician_ids) && v.technician_ids.includes(technicianId)
        );

        console.log('Visits assigned to this technician:', assignedVisits.length);

        // 3. Get customer IDs and fetch customer info
        const customerIds = [...new Set(assignedVisits.map(v => v.customer_id))];

        let customerMap = new Map();
        if (customerIds.length > 0) {
            const { data: customers } = await supabase
                .from('customers')
                .select('id, company_name, mobile, city')
                .in('id', customerIds);

            (customers || []).forEach(c => {
                customerMap.set(c.id, c);
            });
        }

        // 4. Transform to TechnicianProject with enriched data
        return assignedVisits.map(visit => {
            const baseVisit = transformVisit(visit);
            const customer = customerMap.get(visit.customer_id);

            // Calculate timeline progress
            const timeline = baseVisit.timelineStatus || [
                { label: 'Enquiry Received', date: baseVisit.scheduledAt, status: 'completed' as const },
                { label: 'Site Survey', date: '', status: 'current' as const },
                { label: 'Quotation', date: '', status: 'pending' as const },
                { label: 'Material', date: '', status: 'pending' as const },
                { label: 'Installation', date: '', status: 'pending' as const },
                { label: 'Testing', date: '', status: 'pending' as const },
                { label: 'Handover', date: '', status: 'pending' as const },
                { label: 'Payment', date: '', status: 'pending' as const }
            ];

            const completedSteps = timeline.filter(s => s.status === 'completed').length;
            const currentStepIndex = timeline.findIndex(s => s.status === 'current');
            const currentStep = timeline[currentStepIndex]?.label || 'Not Started';
            const nextAction = currentStepIndex >= 0 && currentStepIndex < timeline.length - 1
                ? `Complete ${currentStep}`
                : 'Project Complete';

            const progressPercentage = Math.round((completedSteps / timeline.length) * 100);

            // Check if overdue (scheduled date passed and not completed)
            const isOverdue = new Date(baseVisit.scheduledAt) < new Date() && baseVisit.status !== 'completed';

            return {
                ...baseVisit,
                timelineStatus: timeline,
                customerName: customer?.company_name || 'Unknown Customer',
                customerPhone: customer?.mobile || '',
                customerCity: customer?.city || '',
                progressPercentage,
                currentStep,
                currentStepIndex: currentStepIndex >= 0 ? currentStepIndex : 0,
                nextAction,
                isOverdue,
                estimatedCompletion: undefined // Could calculate based on timeline
            };
        });
    },





    // ==========================================
    // PAYMENTS
    // ==========================================
    getPayments: async (): Promise<Payment[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return (data || []).map(row => ({
            id: row.id,
            technicianName: row.technician_name,
            jobCardId: row.visit_id,
            amount: row.amount,
            status: row.status,
            date: row.created_at
        }));
    },

    getMyPayments: async (technicianName: string): Promise<Payment[]> => {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('technician_name', technicianName);

        if (error) throw error;
        return (data || []).map(row => ({
            id: row.id,
            technicianName: row.technician_name,
            jobCardId: row.visit_id,
            amount: row.amount,
            status: row.status,
            date: row.created_at
        }));
    },

    // ==========================================
    // INVOICES
    // ==========================================
    getInvoices: async (): Promise<Invoice[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('invoices')
            .select('*, customers(*), invoice_items(*)')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (error) throw error;

        return (data || []).map(row => ({
            id: row.id,
            invoiceNo: row.invoice_no,
            customerId: row.customer_id,
            customer: transformCustomer(row.customers),
            date: row.date,
            dueDate: row.due_date,
            items: (row.invoice_items || []).map((item: any) => ({
                productId: item.product_id,
                productName: item.product_name,
                hsnSacCode: item.hsn_sac_code,
                qty: item.qty,
                rate: item.rate,
                discount: item.discount,
                gstRate: item.gst_rate,
                taxableValue: item.taxable_value,
                cgst: item.cgst,
                sgst: item.sgst,
                igst: item.igst,
                total: item.total
            })),
            subTotal: row.sub_total,
            totalDiscount: row.total_discount,
            totalGst: row.total_gst,
            grandTotal: row.grand_total,
            status: row.status,
            notes: row.notes
        }));
    },

    getInvoiceById: async (id: number): Promise<Invoice> => {
        const { data, error } = await supabase
            .from('invoices')
            .select('*, customers(*), invoice_items(*)')
            .eq('id', id)
            .single();

        if (error) throw new Error("Invoice not found");

        return {
            id: data.id,
            invoiceNo: data.invoice_no,
            customerId: data.customer_id,
            customer: transformCustomer(data.customers),
            date: data.date,
            dueDate: data.due_date,
            items: (data.invoice_items || []).map((item: any) => ({
                productId: item.product_id,
                productName: item.product_name,
                hsnSacCode: item.hsn_sac_code,
                qty: item.qty,
                rate: item.rate,
                discount: item.discount,
                gstRate: item.gst_rate,
                taxableValue: item.taxable_value,
                cgst: item.cgst,
                sgst: item.sgst,
                igst: item.igst,
                total: item.total
            })),
            subTotal: data.sub_total,
            totalDiscount: data.total_discount,
            totalGst: data.total_gst,
            grandTotal: data.grand_total,
            status: data.status,
            notes: data.notes
        };
    },

    getInvoicesByCustomerId: async (customerId: number): Promise<Invoice[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('invoices')
            .select('*, customers(*), invoice_items(*)')
            .eq('user_id', userId)
            .eq('customer_id', customerId);

        if (error) throw error;

        return (data || []).map(row => ({
            id: row.id,
            invoiceNo: row.invoice_no,
            customerId: row.customer_id,
            customer: transformCustomer(row.customers),
            date: row.date,
            dueDate: row.due_date,
            items: row.invoice_items || [],
            subTotal: row.sub_total,
            totalDiscount: row.total_discount,
            totalGst: row.total_gst,
            grandTotal: row.grand_total,
            status: row.status,
            notes: row.notes
        }));
    },

    createInvoice: async (invoiceData: Omit<Invoice, 'id' | 'invoiceNo'>): Promise<Invoice> => {
        const userId = await getCurrentUserId();
        const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;

        const { data: invoice, error: invoiceError } = await supabase
            .from('invoices')
            .insert({
                user_id: userId,
                invoice_no: invoiceNo,
                customer_id: invoiceData.customerId,
                date: invoiceData.date,
                due_date: invoiceData.dueDate,
                sub_total: invoiceData.subTotal,
                total_discount: invoiceData.totalDiscount,
                total_gst: invoiceData.totalGst,
                grand_total: invoiceData.grandTotal,
                status: invoiceData.status,
                notes: invoiceData.notes
            })
            .select()
            .single();

        if (invoiceError) throw invoiceError;

        // Insert invoice items
        if (invoiceData.items && invoiceData.items.length > 0) {
            const { error: itemsError } = await supabase
                .from('invoice_items')
                .insert(invoiceData.items.map(item => ({
                    invoice_id: invoice.id,
                    product_id: item.productId,
                    product_name: item.productName,
                    hsn_sac_code: item.hsnSacCode,
                    qty: item.qty,
                    rate: item.rate,
                    discount: item.discount,
                    gst_rate: item.gstRate,
                    taxable_value: item.taxableValue,
                    cgst: item.cgst,
                    sgst: item.sgst,
                    igst: item.igst,
                    total: item.total
                })));

            if (itemsError) throw itemsError;
        }

        return {
            ...invoiceData,
            id: invoice.id,
            invoiceNo
        };
    },

    updateInvoice: async (invoiceData: Invoice): Promise<Invoice> => {
        // Update invoice
        const { error: invoiceError } = await supabase
            .from('invoices')
            .update({
                customer_id: invoiceData.customerId,
                date: invoiceData.date,
                due_date: invoiceData.dueDate,
                sub_total: invoiceData.subTotal,
                total_discount: invoiceData.totalDiscount,
                total_gst: invoiceData.totalGst,
                grand_total: invoiceData.grandTotal,
                status: invoiceData.status,
                notes: invoiceData.notes
            })
            .eq('id', invoiceData.id);

        if (invoiceError) throw invoiceError;

        // Delete existing items and re-insert
        await supabase.from('invoice_items').delete().eq('invoice_id', invoiceData.id);

        if (invoiceData.items && invoiceData.items.length > 0) {
            const { error: itemsError } = await supabase
                .from('invoice_items')
                .insert(invoiceData.items.map(item => ({
                    invoice_id: invoiceData.id,
                    product_id: item.productId,
                    product_name: item.productName,
                    hsn_sac_code: item.hsnSacCode,
                    qty: item.qty,
                    rate: item.rate,
                    discount: item.discount,
                    gst_rate: item.gstRate,
                    taxable_value: item.taxableValue,
                    cgst: item.cgst,
                    sgst: item.sgst,
                    igst: item.igst,
                    total: item.total
                })));

            if (itemsError) throw itemsError;
        }

        return invoiceData;
    },

    updateInvoiceStatus: async (invoiceId: number, status: Invoice['status']): Promise<Invoice> => {
        const { data, error } = await supabase
            .from('invoices')
            .update({ status })
            .eq('id', invoiceId)
            .select('*, customers(*), invoice_items(*)')
            .single();

        if (error) throw error;
        return api.getInvoiceById(invoiceId);
    },

    // ==========================================
    // WARRANTY
    // ==========================================
    getWarrantyEntries: async (): Promise<WarrantyEntry[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('warranty_entries')
            .select('*')
            .eq('user_id', userId)
            .order('pickup_date', { ascending: false });

        if (error) throw error;

        return (data || []).map(row => ({
            id: row.id,
            customerName: row.customer_name,
            productName: row.product_name,
            serialNumber: row.serial_number,
            issue: row.issue,
            pickupPerson: row.pickup_person,
            pickupDate: row.pickup_date,
            status: row.status,
            officeIntakeDate: row.office_intake_date,
            serviceStationId: row.service_station_id,
            dispatchDate: row.dispatch_date,
            courierInfo: row.courier_info,
            followUps: row.follow_ups || [],
            returnDate: row.return_date
        }));
    },

    addWarrantyEntry: async (entryData: Omit<WarrantyEntry, 'id' | 'pickupDate' | 'status' | 'followUps'>): Promise<WarrantyEntry> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('warranty_entries')
            .insert({
                user_id: userId,
                customer_name: entryData.customerName,
                product_name: entryData.productName,
                serial_number: entryData.serialNumber,
                issue: entryData.issue,
                pickup_person: entryData.pickupPerson,
                pickup_date: new Date().toISOString(),
                status: 'Awaiting Pickup',
                follow_ups: []
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            customerName: data.customer_name,
            productName: data.product_name,
            serialNumber: data.serial_number,
            issue: data.issue,
            pickupPerson: data.pickup_person,
            pickupDate: data.pickup_date,
            status: data.status,
            followUps: []
        };
    },

    updateWarrantyEntry: async (id: number, updateData: Partial<WarrantyEntry>): Promise<WarrantyEntry> => {
        // Build update object with snake_case keys
        const updates: any = {};
        if (updateData.status) updates.status = updateData.status;
        if (updateData.officeIntakeDate) updates.office_intake_date = updateData.officeIntakeDate;
        if (updateData.serviceStationId) updates.service_station_id = updateData.serviceStationId;
        if (updateData.dispatchDate) updates.dispatch_date = updateData.dispatchDate;
        if (updateData.courierInfo) updates.courier_info = updateData.courierInfo;
        if (updateData.returnDate) updates.return_date = updateData.returnDate;

        // Handle follow-ups specially
        if (updateData.followUps && updateData.followUps.length > 0) {
            const { data: current } = await supabase
                .from('warranty_entries')
                .select('follow_ups')
                .eq('id', id)
                .single();

            updates.follow_ups = [...updateData.followUps, ...(current?.follow_ups || [])];
        }

        const { data, error } = await supabase
            .from('warranty_entries')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            customerName: data.customer_name,
            productName: data.product_name,
            serialNumber: data.serial_number,
            issue: data.issue,
            pickupPerson: data.pickup_person,
            pickupDate: data.pickup_date,
            status: data.status,
            officeIntakeDate: data.office_intake_date,
            serviceStationId: data.service_station_id,
            dispatchDate: data.dispatch_date,
            courierInfo: data.courier_info,
            followUps: data.follow_ups || [],
            returnDate: data.return_date
        };
    },

    getServiceStations: async (): Promise<ServiceStation[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('service_stations')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return (data || []).map(row => ({
            id: row.id,
            name: row.name,
            address: row.address || '',
            contact: row.contact || ''
        }));
    },

    // ==========================================
    // SITE HEALTH
    // ==========================================
    getSiteHealths: async (): Promise<SiteHealth[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('site_health')
            .select('*, customers(company_name)')
            .eq('user_id', userId);

        if (error) throw error;

        return (data || []).map(row => ({
            customerId: row.customer_id,
            customerName: row.customers?.company_name || 'Unknown',
            isOnline: row.is_online,
            hddStatus: row.hdd_status,
            recordingStatus: row.recording_status,
            camerasOnline: row.cameras_online,
            totalCameras: row.total_cameras,
            lastChecked: row.last_checked,
            isMonitoringEnabled: row.is_monitoring_enabled
        }));
    },

    runDiagnostics: async (customerId: number): Promise<SiteHealth> => {
        // Simulate diagnostics
        const isOnline = Math.random() > 0.1;
        const totalCameras = Math.floor(Math.random() * 16) + 4;
        const camerasOnline = isOnline ? Math.floor(Math.random() * (totalCameras + 1)) : 0;

        const { data, error } = await supabase
            .from('site_health')
            .update({
                is_online: isOnline,
                cameras_online: camerasOnline,
                last_checked: new Date().toISOString()
            })
            .eq('customer_id', customerId)
            .select('*, customers(company_name)')
            .single();

        if (error) throw error;

        return {
            customerId: data.customer_id,
            customerName: data.customers?.company_name || 'Unknown',
            isOnline: data.is_online,
            hddStatus: data.hdd_status,
            recordingStatus: data.recording_status,
            camerasOnline: data.cameras_online,
            totalCameras: data.total_cameras,
            lastChecked: data.last_checked,
            isMonitoringEnabled: data.is_monitoring_enabled
        };
    },

    toggleSiteMonitoring: async (customerId: number): Promise<SiteHealth> => {
        const { data: current } = await supabase
            .from('site_health')
            .select('is_monitoring_enabled')
            .eq('customer_id', customerId)
            .single();

        const { data, error } = await supabase
            .from('site_health')
            .update({ is_monitoring_enabled: !current?.is_monitoring_enabled })
            .eq('customer_id', customerId)
            .select('*, customers(company_name)')
            .single();

        if (error) throw error;

        return {
            customerId: data.customer_id,
            customerName: data.customers?.company_name || 'Unknown',
            isOnline: data.is_online,
            hddStatus: data.hdd_status,
            recordingStatus: data.recording_status,
            camerasOnline: data.cameras_online,
            totalCameras: data.total_cameras,
            lastChecked: data.last_checked,
            isMonitoringEnabled: data.is_monitoring_enabled
        };
    },

    // ==========================================
    // AMCs
    // ==========================================
    getAMCs: async (): Promise<AMC[]> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('amcs')
            .select('*, customers(company_name)')
            .eq('user_id', userId);

        if (error) throw error;

        return (data || []).map(row => ({
            id: row.id,
            customerId: row.customer_id,
            customerName: row.customers?.company_name || 'Unknown',
            startDate: row.start_date,
            endDate: row.end_date,
            cost: row.cost,
            status: row.status
        }));
    },

    addAMC: async (amcData: Omit<AMC, 'id' | 'status' | 'customerName'>): Promise<AMC> => {
        const userId = await getCurrentUserId();

        const { data: customer } = await supabase
            .from('customers')
            .select('company_name')
            .eq('id', amcData.customerId)
            .single();

        const { data, error } = await supabase
            .from('amcs')
            .insert({
                user_id: userId,
                customer_id: amcData.customerId,
                start_date: amcData.startDate,
                end_date: amcData.endDate,
                cost: amcData.cost,
                status: 'Active'
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            customerId: data.customer_id,
            customerName: customer?.company_name || 'Unknown',
            startDate: data.start_date,
            endDate: data.end_date,
            cost: data.cost,
            status: data.status
        };
    },

    // ==========================================
    // DEALER INFO & SUBSCRIPTION
    // ==========================================
    getDealerInfo: async (): Promise<DealerInfo> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('dealer_info')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            // Return default if not found
            return {
                companyName: 'My Company',
                ownerName: '',
                address: '',
                gstin: '',
                email: '',
                mobile: '',
                upiId: '',
                bankName: '',
                accountNo: '',
                ifscCode: '',
                logoUrl: '',
                isBillingEnabled: false,
                isAmcEnabled: false,
                isHrEnabled: false,
                subscription: {
                    tier: 'starter',
                    startDate: new Date().toISOString(),
                    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'trial'
                }
            };
        }

        return transformDealerInfo(data);
    },

    updateDealerInfo: async (newInfo: DealerInfo): Promise<DealerInfo> => {
        const userId = await getCurrentUserId();

        const { data, error } = await supabase
            .from('dealer_info')
            .upsert({
                user_id: userId,
                company_name: newInfo.companyName,
                owner_name: newInfo.ownerName,
                address: newInfo.address,
                gstin: newInfo.gstin,
                email: newInfo.email,
                mobile: newInfo.mobile,
                upi_id: newInfo.upiId,
                bank_name: newInfo.bankName,
                account_no: newInfo.accountNo,
                ifsc_code: newInfo.ifscCode,
                qr_code_url: newInfo.qrCodeUrl,
                logo_url: newInfo.logoUrl,
                is_billing_enabled: newInfo.isBillingEnabled,
                is_amc_enabled: newInfo.isAmcEnabled,
                is_hr_enabled: newInfo.isHrEnabled,
                subscription_tier: newInfo.subscription.tier,
                subscription_start_date: newInfo.subscription.startDate,
                subscription_expiry_date: newInfo.subscription.expiryDate,
                subscription_status: newInfo.subscription.status
            }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;
        return transformDealerInfo(data);
    },

    uploadDealerLogo: async (file: File): Promise<string> => {
        const userId = await getCurrentUserId();
        const fileExt = file.name.split('.').pop();
        // Use timestamp to avoid cache issues and ensure uniqueness
        const fileName = `${userId}-${Date.now()}-logo.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('dealer-logos')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('dealer-logos')
            .getPublicUrl(filePath);

        return publicUrl;
    },

    updateSubscription: async (tier: SubscriptionTier): Promise<DealerInfo> => {
        const userId = await getCurrentUserId();
        const now = new Date();
        const expiry = new Date(now);
        expiry.setFullYear(now.getFullYear() + 1);

        const { data, error } = await supabase
            .from('dealer_info')
            .update({
                subscription_tier: tier,
                subscription_start_date: now.toISOString(),
                subscription_expiry_date: expiry.toISOString(),
                subscription_status: 'active'
            })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return transformDealerInfo(data);
    },

    // ==========================================
    // LICENSE KEYS (Admin)
    // ==========================================
    getLicenseKeys: async (): Promise<LicenseKey[]> => {
        const { data, error } = await supabase
            .from('license_keys')
            .select('*')
            .order('generated_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(row => ({
            id: row.id,
            key: row.key,
            tier: row.tier,
            durationDays: row.duration_days,
            status: row.status,
            generatedBy: row.generated_by,
            generatedAt: row.generated_at,
            usedBy: row.used_by,
            usedAt: row.used_at
        }));
    },

    generateLicenseKey: async (tier: SubscriptionTier, durationDays: number): Promise<LicenseKey> => {
        // Generate a secure 16-character key (XXXX-XXXX-XXXX-XXXX)
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes ambiguous chars (I, 1, O, 0)
        let result = '';
        const randomValues = new Uint8Array(16);
        crypto.getRandomValues(randomValues);

        for (let i = 0; i < 16; i++) {
            result += chars[randomValues[i] % chars.length];
            if ((i + 1) % 4 === 0 && i !== 15) result += '-';
        }

        const key = result;

        const { data, error } = await supabase
            .from('license_keys')
            .insert({
                key,
                tier,
                duration_days: durationDays,
                status: 'active',
                generated_by: 'Admin',
                generated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            key: data.key,
            tier: data.tier,
            durationDays: data.duration_days,
            status: data.status,
            generatedBy: data.generated_by,
            generatedAt: data.generated_at
        };
    },

    deleteLicenseKey: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('license_keys')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    redeemLicenseKey: async (key: string): Promise<DealerInfo> => {
        const userId = await getCurrentUserId();

        // Use standard RPC call for atomic and secure redemption
        const { data, error } = await supabase.rpc('redeem_license_key', {
            input_key: key
        });

        if (error) {
            console.error("License Redemption RPC Error:", error);
            throw new Error(error.message || "Failed to redeem license.");
        }

        if (!data || !data.success) {
            throw new Error(data?.message || "Invalid or used license key.");
        }

        // Fetch updated info to return
        const { data: updatedInfo, error: fetchError } = await supabase
            .from('dealer_info')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;

        return transformDealerInfo(updatedInfo);
    },

    // ==========================================
    // TECHNICIAN DASHBOARD
    // ==========================================
    getTechnicianDashboardSummary: async (): Promise<TechnicianDashboardSummary> => {
        const userId = await getCurrentUserId();

        // 1. Get technician ID from profile
        const { data: techData, error: techError } = await supabase
            .from('technicians')
            .select('id')
            .eq('profile_id', userId)
            .single();

        if (techError || !techData) {
            return {
                assignedVisits: 0,
                completedToday: 0,
                pendingPayments: 0
            };
        }

        const technicianId = techData.id;

        // 2. Get assigned visits count (not completed/cancelled)
        const { data: activeVisits } = await supabase
            .from('visits')
            .select('id, status, scheduled_at')
            .contains('technician_ids', [technicianId])
            .in('status', ['scheduled', 'in_progress']);

        const assignedVisits = activeVisits?.length || 0;

        // 3. Get completed today count
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { data: completedTodayVisits } = await supabase
            .from('visits')
            .select('id')
            .contains('technician_ids', [technicianId])
            .eq('status', 'completed')
            .gte('scheduled_at', today.toISOString())
            .lt('scheduled_at', tomorrow.toISOString());

        const completedToday = completedTodayVisits?.length || 0;

        // 4. Get pending payments (technician expenses with pending status)
        const { data: pendingExpenses } = await supabase
            .from('expenses')
            .select('id')
            .eq('user_id', userId)
            .eq('status', 'pending');

        const pendingPayments = pendingExpenses?.length || 0;

        return {
            assignedVisits,
            completedToday,
            pendingPayments
        };
    },


    // ==========================================
    // SUPER ADMIN
    // ==========================================
    getAdminDashboardStats: async () => {
        // Dealers Count
        const { count: dealersCount } = await supabase
            .from('dealer_info')
            .select('*', { count: 'exact', head: true });

        // Licenses Count
        const { count: activeLicenses } = await supabase
            .from('license_keys')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');

        // Active Subscribers (Dealers with active sub)
        const { count: activeSubscribers } = await supabase
            .from('dealer_info')
            .select('*', { count: 'exact', head: true })
            .eq('subscription_status', 'active');

        // Revenue (Mock calculation based on used keys * price)
        // In real app, you'd having a payments table.
        const { data: usedKeys } = await supabase
            .from('license_keys')
            .select('tier, duration_days')
            .eq('status', 'used');

        // Simple Estimation
        const revenue = (usedKeys || []).reduce((acc, key) => {
            let price = 0;
            if (key.tier === 'starter') price = 499;
            if (key.tier === 'professional') price = 999;
            if (key.tier === 'enterprise') price = 1499;

            // Adjust for duration roughly
            const months = key.duration_days / 30;
            return acc + (price * months);
        }, 0);

        return {
            totalDealers: dealersCount || 0,
            activeLicenses: activeLicenses || 0,
            activeSubscribers: activeSubscribers || 0,
            totalRevenue: revenue
        };
    },

    getAllDealers: async () => {
        // Use the secure RPC function to get email/phone from auth
        const { data, error } = await supabase.rpc('get_admin_dealers');

        if (error) {
            console.error("Supabase Error in getAllDealers (RPC):", error);
            throw error;
        }
        console.log("Supabase Raw RPC Dealers Data:", data);

        // Transform and prioritize auth email if dealer info email is empty
        return (data || []).map((row: any) => ({
            ...transformDealerInfo(row),
            email: row.email || row.auth_email || '', // Fallback to auth email
            mobile: row.mobile || row.auth_phone || '' // Fallback to auth phone
        }));
    },

    createDealer: async (formData: { companyName: string; ownerName: string; email: string; password: string; mobile: string }) => {
        // Use RPC to create user directly in database (bypasses broken GoTrue identity creation)
        const { data: newUserId, error: rpcError } = await supabase.rpc('create_dealer_user', {
            p_email: formData.email,
            p_password: formData.password,
            p_name: formData.ownerName,
            p_phone: formData.mobile || '',
            p_company_name: formData.companyName || 'My Company'
        });

        if (rpcError) {
            console.error("Failed to create dealer via RPC:", rpcError);
            throw new Error(`Failed to create dealer: ${rpcError.message}`);
        }

        if (!newUserId) throw new Error('Failed to create dealer user');

        return { userId: newUserId };
    },

    deleteDealer: async (id: number) => {
        const { error } = await supabase
            .from('dealer_info')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- Support Ticketing System ---

    getTickets: async (): Promise<SupportTicket[]> => {
        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as SupportTicket[];
    },

    getAllTickets: async (): Promise<SupportTicket[]> => {
        const { data: tickets, error } = await supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch dealer info manually to avoid complex joins
        const userIds = Array.from(new Set(tickets.map((t: any) => t.user_id)));

        let dealerMap = new Map();
        if (userIds.length > 0) {
            const { data: dealers } = await supabase
                .from('dealer_info')
                .select('user_id, company_name, email')
                .in('user_id', userIds);

            if (dealers) {
                dealerMap = new Map(dealers.map((d: any) => [d.user_id, d]));
            }
        }

        return tickets.map((ticket: any) => {
            const dealer = dealerMap.get(ticket.user_id);
            return {
                ...ticket,
                user_email: dealer?.email || '',
                company_name: dealer?.company_name || 'Unknown'
            };
        }) as SupportTicket[];
    },

    createTicket: async (ticket: Partial<SupportTicket>): Promise<SupportTicket> => {
        const userId = await getCurrentUserId();
        const { data, error } = await supabase
            .from('support_tickets')
            .insert({
                user_id: userId,
                subject: ticket.subject,
                description: ticket.description,
                category: ticket.category,
                priority: ticket.priority,
                status: 'open'
            })
            .select()
            .single();

        if (error) throw error;
        return data as SupportTicket;
    },

    updateTicket: async (id: string, updates: Partial<SupportTicket>): Promise<void> => {
        const { error } = await supabase
            .from('support_tickets')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
    },

    // --- Technician Features ---

    getTechnicianAvailability: async (): Promise<TechnicianAvailability> => {
        const userId = await getCurrentUserId();
        // Technicians table links profile_id to user_id (of auth user)
        // Wait, technicians table: user_id is DEALER/OWNER. profile_id is TECH AUTH ID.
        const { data, error } = await supabase
            .from('technicians')
            .select('availability_status')
            .eq('profile_id', userId)
            .single();

        if (error) {
            // If no tech record found (maybe owner?), return available or offline
            return 'offline';
        }
        return data.availability_status as TechnicianAvailability || 'offline';
    },



    updateTechnicianAvailability: async (status: TechnicianAvailability): Promise<void> => {
        const userId = await getCurrentUserId();
        const { error } = await supabase
            .from('technicians')
            .update({ availability_status: status })
            .eq('profile_id', userId);

        if (error) throw error;
    },

    getMyExpenses: async (): Promise<Expense[]> => {
        const userId = await getCurrentUserId();
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Expense[];
    },

    createExpense: async (expense: Partial<Expense>): Promise<Expense> => {
        const userId = await getCurrentUserId();
        const { data, error } = await supabase
            .from('expenses')
            .insert({
                user_id: userId,
                visit_id: expense.visit_id,
                amount: expense.amount,
                category: expense.category,
                description: expense.description,
                receipt_url: expense.receipt_url,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;
        return data as Expense;
    },

    // ==========================================
    // DAILY TASKS
    // ==========================================
    getTechnicianTasks: async (technicianId: number): Promise<TechnicianTask[]> => {
        const { data, error } = await supabase
            .from('technician_tasks')
            .select('*')
            .eq('technician_id', technicianId)
            .order('due_date', { ascending: true });

        if (error) throw error;
        return data as TechnicianTask[];
    },

    createTask: async (task: Partial<TechnicianTask>): Promise<TechnicianTask> => {
        const userId = await getCurrentUserId();
        const { data, error } = await supabase
            .from('technician_tasks')
            .insert({
                technician_id: task.technician_id,
                description: task.description,
                status: 'pending',
                due_date: task.due_date,
                created_by: userId
            })
            .select()
            .single();

        if (error) throw error;
        return data as TechnicianTask;
    },

    getMyTasks: async (): Promise<TechnicianTask[]> => {
        const userId = await getCurrentUserId();

        // 1. Get Technician ID linked to this user
        const { data: techData, error: techError } = await supabase
            .from('technicians')
            .select('id')
            .eq('profile_id', userId)
            .single();

        if (techError || !techData) {
            console.warn('User is not a linked technician');
            return [];
        }

        // 2. Fetch tasks
        const { data, error } = await supabase
            .from('technician_tasks')
            .select('*')
            .eq('technician_id', techData.id)
            .order('due_date', { ascending: true });

        if (error) throw error;
        return data as TechnicianTask[];
    },

    updateTaskStatus: async (taskId: number, status: 'pending' | 'completed'): Promise<void> => {
        const { error } = await supabase
            .from('technician_tasks')
            .update({ status })
            .eq('id', taskId);

        if (error) throw error;
    },

    // ==========================================
    // REPORTS
    // ==========================================
    getReportsSummary: async (): Promise<{
        totalVisits: number;
        completedVisits: number;
        pendingVisits: number;
        revenue: number;
        technicianPerformance: { name: string; completed: number }[];
    }> => {
        // This should ideally use RPC or specialized queries for performance.
        // For MVP, we calculate from client-side data fetched here or simple queries.

        // Visits
        const { data: visits } = await supabase.from('visits').select('status, technician_ids');
        const totalVisits = visits?.length || 0;
        const completedVisits = visits?.filter(v => v.status === 'completed').length || 0;
        const pendingVisits = visits?.filter(v => v.status !== 'completed' && v.status !== 'cancelled').length || 0;

        // Revenue (Mock or from Invoices)
        // const { data: invoices } = await supabase.from('invoices').select('total_amount, status');
        // Let's assume some mock revenue logic for now if invoices table isn't populated fully or reuse simple logic
        // For now returning mock/placeholder based on visits count to show data
        const revenue = completedVisits * 1500; // Mock average 1500 per visit

        // Technicians
        const { data: technicians } = await supabase.from('technicians').select('id, name');
        const technicianPerformance = (technicians || []).map(tech => {
            const count = visits?.filter(v => v.technician_ids?.includes(tech.id) && v.status === 'completed').length || 0;
            return { name: tech.name, completed: count };
        });

        return {
            totalVisits,
            completedVisits,
            pendingVisits,
            revenue,
            technicianPerformance
        };
    },
    // ==========================================
    // SUPPLIERS
    // ==========================================
    getSuppliers: async (): Promise<Supplier[]> => {
        const userId = await getCurrentUserId();
        const { data, error } = await supabase
            .from('suppliers')
            .select('*')
            .eq('user_id', userId)
            .order('brand_name');

        if (error) throw error;
        return (data || []).map(row => ({
            id: row.id,
            brand_name: row.brand_name,
            sales_person_name: row.sales_person_name,
            sales_person_mobile: row.sales_person_mobile,
            manager_name: row.manager_name,
            manager_mobile: row.manager_mobile,
            distributor_name: row.distributor_name,
            service_center_details: row.service_center_details,
            service_center_number: row.service_center_number,
            product_categories: row.product_categories,
            notes: row.notes,
            created_at: row.created_at
        }));
    },

    addSupplier: async (supplier: Omit<Supplier, 'id' | 'user_id' | 'created_at'>): Promise<Supplier> => {
        const userId = await getCurrentUserId();
        const { data, error } = await supabase
            .from('suppliers')
            .insert({ ...supplier, user_id: userId })
            .select()
            .single();

        if (error) throw error;
        return data; // Auto-transformed by Supabase JS usually returns matches, but for strict typing we might need manual mapping if casing differs. Assuming direct mapping for now as migration used snake_case but TS uses snake_case in interface too? Wait, let me check the interface again.
        // The interface uses snake_case for properties like brand_name. Migration used snake_case. So data returned is snake_case.
        // My interface definition in types.ts used snake_case for these fields.
    },

    updateSupplier: async (id: number, updates: Partial<Supplier>): Promise<Supplier> => {
        const { data, error } = await supabase
            .from('suppliers')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteSupplier: async (id: number): Promise<void> => {
        const { error } = await supabase
            .from('suppliers')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
    // ==========================================
    // ADVANCED REPORTING
    // ==========================================
    getAllTechnicians: async (): Promise<User[]> => {
        // Fetch users from public profiles or a secure function if strict RLS
        // For now assuming we can fetch profiles with role='technician'
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'technician');
        if (error) throw error;
        // Transform to User type
        return (data || []).map(p => ({
            id: p.id,
            email: p.email,
            name: p.full_name || p.email?.split('@')[0] || 'Unknown',
            role: p.role,
            isSetupComplete: true,
            createdAt: p.created_at
        }));
    },

    getAllTechnicianTasks: async (): Promise<TechnicianTask[]> => {
        // For admin, we want ALL tasks.
        const { data, error } = await supabase
            .from('technician_tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(t => ({
            id: t.id,
            technician_id: t.technician_id,
            description: t.description,
            status: t.status,
            due_date: t.due_date,
            created_by: t.created_by,
            created_at: t.created_at
        }));
    },


    getAllWorkLogs: async (): Promise<WorkLogEntry[]> => {
        // Fetch work logs from visits (stored as JSONB in 'work_log' column)
        const { data: visits, error } = await supabase
            .from('visits')
            .select('work_log')
            .not('work_log', 'is', null);

        if (error) throw error;

        // Flatten and return all work log entries
        return (visits || []).flatMap((v: any) => v.work_log || []) as WorkLogEntry[];
    },

    // ==========================================
    // COMPLAINT MANAGEMENT
    // ==========================================

    getComplaints: async (filters?: { status?: string, priority?: string, category?: string }): Promise<Complaint[]> => {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        if (!userId) throw new Error('Not authenticated');

        // Get Role from Profile
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single();
        const role = profile?.role;

        let query = supabase.from('complaints').select('*, customers(company_name)');

        if (role === 'dealer') {
            query = query.eq('user_id', userId);
        } else if (role === 'technician') {
            // For technicians, finding assignments
            // Since complex joins with filtering on join table can be tricky in one go, 
            // we'll filter by existence of assignment or use Supabase's !inner join if setup 
            // Simplified: Fetch assignments first
            const { data: assignments } = await supabase
                .from('complaint_assignments')
                .select('complaint_id')
                .eq('technician_id', (await api.getTechnicianProfileId(userId)))
                .eq('is_active', true);

            const assignedIds = assignments?.map(a => a.complaint_id) || [];
            if (assignedIds.length === 0) return []; // No assignments
            query = query.in('id', assignedIds);
        }

        if (filters?.status) query = query.eq('status', filters.status);
        if (filters?.priority) query = query.eq('priority', filters.priority);
        if (filters?.category) query = query.eq('category', filters.category);

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;

        return data.map(transformComplaint);
    },

    getComplaintById: async (id: number): Promise<Complaint | null> => {
        const { data, error } = await supabase
            .from('complaints')
            .select(`
                *,
                customers(company_name),
                complaint_assignments!left(
                    technician_id,
                    is_active,
                    technicians(id, name, phone)
                )
            `)
            .eq('id', id)
            .single();

        if (error) return null;

        // Find active assignment and get technician
        const activeAssignment = data.complaint_assignments?.find((a: any) => a.is_active);
        const assignedTechnician = activeAssignment?.technicians ? {
            id: activeAssignment.technicians.id,
            name: activeAssignment.technicians.name,
            phone: activeAssignment.technicians.phone
        } : null;

        return {
            ...transformComplaint(data),
            assignedTechnician
        };
    },

    createComplaint: async (complaintData: Partial<Complaint>): Promise<Complaint> => {
        const userId = await getCurrentUserId();

        // Ensure customer exists or use ID. 
        // For MVP, assuming customer_id is passed.

        const { data, error } = await supabase
            .from('complaints')
            .insert({
                user_id: userId,
                customer_id: complaintData.customerId,
                site_address: complaintData.siteAddress,
                site_area: complaintData.siteArea,
                site_city: complaintData.siteCity,
                site_landmark: complaintData.siteLandmark,
                site_pincode: complaintData.sitePincode,
                contact_person_name: complaintData.contactPersonName,
                contact_person_phone: complaintData.contactPersonPhone,
                category: complaintData.category,
                priority: complaintData.priority,
                source: complaintData.source,
                title: complaintData.title,
                description: complaintData.description,
                status: 'New'
            })
            .select('*, customers(company_name)')
            .single();

        if (error) throw error;

        // Create Initial History
        await api.logComplaintHistory(data.id, 'New', 'New', 'Created Complaint');

        return transformComplaint(data);
    },

    updateComplaint: async (id: number, updates: Partial<Complaint>): Promise<Complaint> => {
        const { data, error } = await supabase
            .from('complaints')
            .update({
                category: updates.category,
                priority: updates.priority,
                title: updates.title,
                description: updates.description,
                site_address: updates.siteAddress,
                contact_person_name: updates.contactPersonName,
                contact_person_phone: updates.contactPersonPhone
            })
            .eq('id', id)
            .select('*, customers(company_name)')
            .single();

        if (error) throw error;
        return transformComplaint(data);
    },

    updateComplaintStatus: async (id: number, newStatus: string, remark?: string): Promise<void> => {
        const current = await api.getComplaintById(id);
        if (!current) throw new Error('Complaint not found');

        const { error } = await supabase
            .from('complaints')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;

        await api.logComplaintHistory(id, current.status, newStatus, remark || `Status updated to ${newStatus}`);
    },

    assignTechnician: async (complaintId: number, technicianId: number): Promise<void> => {
        const userId = await getCurrentUserId();

        // Deactivate old assignments for this complaint
        await supabase
            .from('complaint_assignments')
            .update({ is_active: false })
            .eq('complaint_id', complaintId);

        // Delete existing assignment for this technician-complaint pair if exists, then insert new
        await supabase
            .from('complaint_assignments')
            .delete()
            .eq('complaint_id', complaintId)
            .eq('technician_id', technicianId);

        // Create new assignment
        const { error } = await supabase
            .from('complaint_assignments')
            .insert({
                complaint_id: complaintId,
                technician_id: technicianId,
                assigned_by: userId,
                is_active: true
            });

        if (error) throw error;

        // Auto-update status to Assigned if currently New
        const complaint = await api.getComplaintById(complaintId);
        if (complaint?.status === 'New') {
            await api.updateComplaintStatus(complaintId, 'Assigned', 'Technician Assigned');
        } else {
            await api.logComplaintHistory(complaintId, complaint?.status || '', complaint?.status || '', 'Technician Re-assigned');
        }
    },

    removeAssignment: async (complaintId: number): Promise<void> => {
        // Deactivate all assignments for this complaint
        const { error } = await supabase
            .from('complaint_assignments')
            .update({ is_active: false })
            .eq('complaint_id', complaintId);

        if (error) throw error;

        // Log history
        const complaint = await api.getComplaintById(complaintId);
        await api.logComplaintHistory(complaintId, complaint?.status || '', complaint?.status || '', 'Technician removed from assignment');
    },

    // Internal Helper to get Technician ID from Auth ID
    getTechnicianProfileId: async (authId: string): Promise<number | null> => {
        const { data } = await supabase.from('technicians').select('id').eq('profile_id', authId).single();
        // If not linked by profile_id, try finding by user_id owner (which is flawed logic for tech, assume profile_id is consistent)
        // Actually, if I am a technician, my auth.uid() should match technicians.profile_id
        return data?.id || null;
    },

    logComplaintHistory: async (complaintId: number, oldStatus: string, newStatus: string, remark: string) => {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        if (!userId) return;

        // Get Name/Role
        const { data: profile } = await supabase.from('profiles').select('name, role').eq('id', userId).single();

        await supabase.from('complaint_status_history').insert({
            complaint_id: complaintId,
            old_status: oldStatus,
            new_status: newStatus,
            changed_by: userId,
            role: profile?.role || 'unknown',
            remark: remark
        });
    },

    getComplaintHistory: async (complaintId: number): Promise<ComplaintHistory[]> => {
        const { data, error } = await supabase
            .from('complaint_status_history')
            .select('*')
            .eq('complaint_id', complaintId)
            .order('created_at', { ascending: false });

        if (error) return [];

        // Fetch names for changed_by requires join or separate fetch. 
        // For simplicity, returning raw or simple mapping if profile joined.
        return data.map((h: any) => ({
            id: h.id,
            complaintId: h.complaint_id,
            oldStatus: h.old_status,
            newStatus: h.new_status,
            changedBy: 'User', // Requires lookup or join in real app
            role: h.role,
            remark: h.remark,
            createdAt: h.created_at
        }));
    },

    getComplaintStats: async (): Promise<ComplaintStats> => {
        const complaints = await api.getComplaints(); // Reuse logic for scoping

        const total = complaints.length;
        const open = complaints.filter(c => !['Resolved', 'Closed', 'Cancelled'].includes(c.status)).length;
        const resolved = complaints.filter(c => c.status === 'Resolved').length;

        // Today's visits calculation would require fetching visits table
        // Mocking visits count for now based on 'Visit Scheduled' status or similar
        const todayVisits = complaints.filter(c => c.status === 'Visit Scheduled').length;

        return { total, open, resolved, todayVisits };
    },

    // Notes
    getComplaintNotes: async (complaintId: number): Promise<ComplaintNote[]> => {
        const { data, error } = await supabase
            .from('complaint_notes')
            .select('*')
            .eq('complaint_id', complaintId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching notes:", error);
            return [];
        }

        // We need user names. In a real app we'd join. For now, fetch or rely on client?
        // Let's assume we can display without name or fetch name separately if critical.
        // Actually, let's just return the data properly mapped.
        return data.map((n: any) => ({
            id: n.id,
            complaintId: n.complaint_id,
            userId: n.user_id,
            role: n.role,
            note: n.note,
            createdAt: n.created_at,
            userName: 'User' // Placeholder
        }));
    },

    addComplaintNote: async (complaintId: number, note: string): Promise<void> => {
        const userId = await getCurrentUserId();
        const { data: profile } = await supabase.from('profiles').select('name, role').eq('id', userId).single();

        const { error } = await supabase.from('complaint_notes').insert({
            complaint_id: complaintId,
            user_id: userId,
            role: profile?.role || 'dealer',
            note: note
        });

        if (error) throw error;
    },

    // ==========================================
    // JOB CARDS
    // ==========================================

    // Create job card from a resolved complaint
    createJobCard: async (complaintId: number): Promise<any> => {
        const { data, error } = await supabase.rpc('create_job_card_from_complaint', {
            p_complaint_id: complaintId
        });

        if (error) throw error;
        return data;
    },

    // Get job card by complaint ID
    getJobCardByComplaint: async (complaintId: number): Promise<any | null> => {
        const { data, error } = await supabase
            .from('job_cards')
            .select(`
                *,
                technicians(name)
            `)
            .eq('complaint_id', complaintId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        if (!data) return null;

        return {
            id: data.id,
            jobCardNumber: data.job_card_number,
            complaintId: data.complaint_id,
            dealerId: data.dealer_id,
            technicianId: data.technician_id,
            customerId: data.customer_id,
            customerName: data.customer_name,
            customerPhone: data.customer_phone,
            customerAddress: data.customer_address,
            customerCity: data.customer_city,
            complaintTitle: data.complaint_title,
            complaintCategory: data.complaint_category,
            workDone: data.work_done,
            partsUsed: data.parts_used,
            resolutionNotes: data.resolution_notes,
            serviceDate: data.service_date,
            arrivalTime: data.arrival_time,
            departureTime: data.departure_time,
            technicianSignature: data.technician_signature,
            customerSignature: data.customer_signature,
            status: data.status,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            technicianName: data.technicians?.name
        };
    },

    // Get all job cards for dealer
    getJobCards: async (): Promise<any[]> => {
        const userId = await getCurrentUserId();
        const { data, error } = await supabase
            .from('job_cards')
            .select(`
                *,
                technicians(name),
                complaints(complaint_id)
            `)
            .eq('dealer_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((jc: any) => ({
            id: jc.id,
            jobCardNumber: jc.job_card_number,
            complaintId: jc.complaint_id,
            dealerId: jc.dealer_id,
            technicianId: jc.technician_id,
            customerId: jc.customer_id,
            customerName: jc.customer_name,
            customerPhone: jc.customer_phone,
            customerAddress: jc.customer_address,
            customerCity: jc.customer_city,
            complaintTitle: jc.complaint_title,
            complaintCategory: jc.complaint_category,
            workDone: jc.work_done,
            partsUsed: jc.parts_used,
            resolutionNotes: jc.resolution_notes,
            serviceDate: jc.service_date,
            arrivalTime: jc.arrival_time,
            departureTime: jc.departure_time,
            status: jc.status,
            createdAt: jc.created_at,
            updatedAt: jc.updated_at,
            technicianName: jc.technicians?.name,
            complaintNo: jc.complaints?.complaint_id
        }));
    },

    // Get job cards for technician
    getMyJobCards: async (): Promise<any[]> => {
        const userId = await getCurrentUserId();

        // Get technician ID from profile
        const { data: techData } = await supabase
            .from('technicians')
            .select('id')
            .eq('profile_id', userId)
            .single();

        if (!techData) return [];

        const { data, error } = await supabase
            .from('job_cards')
            .select(`
                *,
                complaints(complaint_id)
            `)
            .eq('technician_id', techData.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((jc: any) => ({
            id: jc.id,
            jobCardNumber: jc.job_card_number,
            complaintId: jc.complaint_id,
            dealerId: jc.dealer_id,
            technicianId: jc.technician_id,
            customerId: jc.customer_id,
            customerName: jc.customer_name,
            customerPhone: jc.customer_phone,
            customerAddress: jc.customer_address,
            customerCity: jc.customer_city,
            complaintTitle: jc.complaint_title,
            complaintCategory: jc.complaint_category,
            workDone: jc.work_done,
            partsUsed: jc.parts_used,
            resolutionNotes: jc.resolution_notes,
            serviceDate: jc.service_date,
            status: jc.status,
            createdAt: jc.created_at,
            complaintNo: jc.complaints?.complaint_id
        }));
    },

    // Update job card (work done, parts used, signatures)
    updateJobCard: async (id: number, updates: {
        workDone?: string;
        partsUsed?: string;
        resolutionNotes?: string;
        arrivalTime?: string;
        departureTime?: string;
        technicianSignature?: string;
        customerSignature?: string;
        status?: string;
    }): Promise<void> => {
        const { error } = await supabase
            .from('job_cards')
            .update({
                work_done: updates.workDone,
                parts_used: updates.partsUsed,
                resolution_notes: updates.resolutionNotes,
                arrival_time: updates.arrivalTime,
                departure_time: updates.departureTime,
                technician_signature: updates.technicianSignature,
                customer_signature: updates.customerSignature,
                status: updates.status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;
    }
};

