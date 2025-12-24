// Ontru CCTV Management - Supabase API Service
// Replaces mockDb.ts with real Supabase backend

import { supabase } from './supabaseClient';
import type {
    User, DashboardSummary, Visit, Technician, Customer, Godown, GodownStock, InventorySerial,
    Product, Brand, StockSummary, LowStockProduct, Payment, TechnicianDashboardSummary,
    WarrantyEntry, ServiceStation, SiteHealth, AMC, Invoice, DealerInfo, InvoiceItem,
    Payslip, AttendanceRecord, WorkLogEntry, SubscriptionTier, LicenseKey, JobCardItem
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
    workLog: row.work_log || []
});

const transformDealerInfo = (row: any): DealerInfo => ({
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
    subscription: {
        tier: row.subscription_tier || 'starter',
        startDate: row.subscription_start_date || new Date().toISOString(),
        expiryDate: row.subscription_expiry_date || new Date().toISOString(),
        status: row.subscription_status || 'trial'
    }
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

        if (error) throw new Error('Invalid credentials');

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
                subscription_tier: 'starter',
                subscription_start_date: new Date().toISOString(),
                subscription_expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                subscription_status: 'trial'
            });

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
            specialization: row.specialization || ''
        }));
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

    addProduct: async (productData: Omit<Product, 'id' | 'brandName'>): Promise<Product> => {
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
        return transformProduct(data);
    },

    updateProduct: async (productData: Omit<Product, 'brandName'>): Promise<Product> => {
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
            brandName: p.brands?.name || 'Unknown',
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
                status: projectData.status || 'scheduled'
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

    getMyVisits: async (technicianId: number): Promise<Visit[]> => {
        const { data, error } = await supabase
            .from('visits')
            .select('*, visit_items(*)')
            .contains('technician_ids', [technicianId])
            .order('scheduled_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(transformVisit);
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
            status: row.status
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
            status: row.status
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
            .single();

        if (error) {
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
                subscription_tier: newInfo.subscription.tier,
                subscription_start_date: newInfo.subscription.startDate,
                subscription_expiry_date: newInfo.subscription.expiryDate,
                subscription_status: newInfo.subscription.status
            })
            .select()
            .single();

        if (error) throw error;
        return transformDealerInfo(data);
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
        const prefix = tier === 'enterprise' ? 'ENT' : tier === 'professional' ? 'PRO' : 'STR';
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const key = `${prefix}-${randomStr}-${Date.now().toString().slice(-4)}`;

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

    redeemLicenseKey: async (key: string): Promise<DealerInfo> => {
        // Find the license key
        const { data: licenseKey, error: keyError } = await supabase
            .from('license_keys')
            .select('*')
            .eq('key', key)
            .eq('status', 'active')
            .single();

        if (keyError || !licenseKey) {
            throw new Error("Invalid or used license key.");
        }

        const userId = await getCurrentUserId();

        // Get dealer info for company name
        const { data: dealerInfo } = await supabase
            .from('dealer_info')
            .select('company_name')
            .eq('user_id', userId)
            .single();

        // Mark key as used
        await supabase
            .from('license_keys')
            .update({
                status: 'used',
                used_at: new Date().toISOString(),
                used_by: dealerInfo?.company_name || 'Unknown'
            })
            .eq('id', licenseKey.id);

        // Update subscription
        const now = new Date();
        const expiry = new Date(now);
        expiry.setDate(now.getDate() + licenseKey.duration_days);

        const { data, error } = await supabase
            .from('dealer_info')
            .update({
                subscription_tier: licenseKey.tier,
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
    // TECHNICIAN DASHBOARD
    // ==========================================
    getTechnicianDashboardSummary: async (): Promise<TechnicianDashboardSummary> => {
        // This would query based on technician's profile_id
        return {
            assignedVisits: 5,
            completedToday: 1,
            pendingPayments: 2
        };
    }
};
