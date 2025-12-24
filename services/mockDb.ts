


import type { 
    User, Visit, Technician, Customer, Godown, GodownStock, InventorySerial,
    Product, Brand, Payment, WarrantyEntry, ServiceStation, SiteHealth, AMC, Invoice, DealerInfo,
    Payslip, AttendanceRecord, LicenseKey
} from '../types';

let dbInstance: any = null;

export const getDb = () => {
  if (!dbInstance) {
    dbInstance = JSON.parse(localStorage.getItem('mockDb') || '{}');
  }
  return dbInstance;
};

export const updateDb = (updates: Partial<typeof dbInstance>) => {
  Object.assign(dbInstance, updates);
  localStorage.setItem('mockDb', JSON.stringify(dbInstance));
};

export let db = getDb();

export const initDb = () => {
    if (localStorage.getItem('mockDb')) {
        db = JSON.parse(localStorage.getItem('mockDb')!);
        return;
    }

    const initialDb = {
        users: [
            { id: 1, name: 'Rajesh Dealer', role: 'dealer', email: 'dealer@example.com', isSetupComplete: true },
            { id: 2, name: 'Suresh Tech', role: 'technician', phone: '9876543210', isSetupComplete: true },
            { id: 99, name: 'Super Admin', role: 'admin', email: 'admin@ontru.com', isSetupComplete: true },
        ] as User[],
        customers: [
            { id: 101, companyName: 'Global Exports', contactPerson: 'Mr. Sharma', mobile: '9988776655', email: 'sharma@global.com', address: '123 Industrial Area, Phase 1', area: 'Industrial Area', city: 'Chandigarh', gst: 'ABCDE1234F1Z5' },
            { id: 102, companyName: 'Modern Retail', contactPerson: 'Ms. Gupta', mobile: '9123456789', email: 'gupta@modern.com', address: 'Shop 45, Sector 17', area: 'Sector 17', city: 'Chandigarh', gst: 'FGHIJ5678K2Z6' },
        ] as Customer[],
        technicians: [
            { id: 2, name: 'Suresh Tech', phone: '9876543210', specialization: 'Hikvision Expert' },
            { id: 3, name: 'Ramesh Kumar', phone: '9876501234', specialization: 'Networking' },
        ] as Technician[],
        brands: [
            { id: 201, name: 'Hikvision' },
            { id: 202, name: 'CP Plus' },
        ] as Brand[],
        products: [
            { id: 301, brandId: 201, model: 'DS-2CE1AD0T-IRPF', category: 'camera', isSerialized: true, lowStockThreshold: 10, hsnSacCode: '85258090', gstRate: 18 },
            { id: 302, brandId: 201, model: 'iDS-7204HQHI-M1/S', category: 'nvr', isSerialized: true, lowStockThreshold: 5, hsnSacCode: '85219090', gstRate: 18 },
            { id: 303, brandId: 202, model: 'CP-UNC-TA21L3', category: 'camera', isSerialized: true, lowStockThreshold: 10, hsnSacCode: '85258090', gstRate: 18 },
            { id: 304, brandId: 202, model: 'CP-UVR-0401E1-HC', category: 'nvr', isSerialized: true, lowStockThreshold: 5, hsnSacCode: '85219090', gstRate: 18 },
            { id: 305, brandId: 201, model: '3+1 Copper Cable', category: 'cable', isSerialized: false, lowStockThreshold: 100, hsnSacCode: '85442090', gstRate: 18 },
        ] as Product[],
        godowns: [
            { id: 401, name: 'Main Godown', location: 'Phase 1, Chandigarh' },
            { id: 402, name: 'Retail Outlet', location: 'Sector 22, Chandigarh' },
        ] as Godown[],
        godownStock: [
            { godownId: 401, productId: 301, quantity: 25 },
            { godownId: 401, productId: 302, quantity: 10 },
            { godownId: 402, productId: 303, quantity: 15 },
            { godownId: 402, productId: 305, quantity: 500 },
        ] as { godownId: number, productId: number, quantity: number }[],
        inventorySerials: [
            { serial: 'HK12345678', productId: 301, status: 'in_stock' },
            { serial: 'HK12345679', productId: 301, status: 'in_stock' },
            { serial: 'HKDVR98765', productId: 302, status: 'installed' },
            { serial: 'CP98765432', productId: 303, status: 'in_stock' },
        ] as InventorySerial[],
        visits: [
            { id: 501, projectName: "Office Security Upgrade", customerId: 101, address: '123 Industrial Area, Phase 1', scheduledAt: new Date().toISOString(), technicianIds: [2], items: [{ productId: 301, productName: 'Hikvision DS-2CE1AD0T-IRPF', qty: 4, serial: 'HK12345678' }], status: 'in_progress' },
            { id: 502, customerId: 102, address: 'Shop 45, Sector 17', scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), technicianIds: [3], items: [{ productId: 303, productName: 'CP Plus CP-UNC-TA21L3', qty: 2 }], status: 'completed', nvrUsername: 'admin', nvrPassword: 'password123' },
        ] as Visit[],
        payments: [
            { id: 601, technicianName: 'Suresh Tech', jobCardId: 501, amount: 500, status: 'pending' },
            { id: 602, technicianName: 'Ramesh Kumar', jobCardId: 502, amount: 750, status: 'paid' },
        ] as Payment[],
        serviceStations: [
            { id: 701, name: 'Hikvision Service Center', address: 'Delhi', contact: 'Mr. Verma' },
            { id: 702, name: 'Aditya Infotech', address: 'Chandigarh', contact: 'Service Desk' },
        ] as ServiceStation[],
        warrantyEntries: [
            { id: 801, customerName: 'Global Exports', productName: 'Hikvision DVR', serialNumber: 'HKDVR98765', issue: 'Not recording', pickupPerson: 'Suresh', pickupDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'Sent to Service', serviceStationId: 701, dispatchDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), followUps: [{date: new Date().toISOString(), remarks: 'Called service center, they said it is under inspection', personContacted: 'Anil'}] },
        ] as WarrantyEntry[],
        siteHealths: [
            { customerId: 101, customerName: 'Global Exports', isOnline: true, hddStatus: 'Healthy', recordingStatus: 'OK', camerasOnline: 8, totalCameras: 8, lastChecked: new Date().toISOString(), isMonitoringEnabled: true },
            { customerId: 102, customerName: 'Modern Retail', isOnline: false, hddStatus: 'Not Found', recordingStatus: 'Stopped', camerasOnline: 0, totalCameras: 4, lastChecked: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), isMonitoringEnabled: true },
        ] as SiteHealth[],
        amcs: [
            { id: 901, customerId: 101, customerName: 'Global Exports', startDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(Date.now() + 165 * 24 * 60 * 60 * 1000).toISOString(), cost: 5000, status: 'Active' },
            { id: 902, customerId: 102, customerName: 'Modern Retail', startDate: new Date(Date.now() - 360 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), cost: 2500, status: 'Expiring Soon' },
        ] as AMC[],
        invoices: [
            { id: 1001, invoiceNo: 'INV-2024-001', customerId: 101, customer: { id: 101, companyName: 'Global Exports', contactPerson: 'Mr. Sharma', mobile: '9988776655', email: 'sharma@global.com', address: '123 Industrial Area, Phase 1', area: 'Industrial Area', city: 'Chandigarh', gst: 'ABCDE1234F1Z5' }, date: new Date().toISOString(), dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), items: [], subTotal: 10000, totalDiscount: 0, totalGst: 1800, grandTotal: 11800, status: 'unpaid' },
        ] as Invoice[],
        dealerInfo: {
            companyName: 'OnTru Security Solutions',
            ownerName: 'Rajesh Dealer',
            address: 'SCO 12, Sector 34, Chandigarh, 160022',
            gstin: '03ABCDE1234F1Z5',
            email: 'dealer@example.com',
            mobile: '9876598765',
            upiId: 'ontru@upi',
            bankName: 'HDFC Bank',
            accountNo: '50200012345678',
            ifscCode: 'HDFC0001234',
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=ontru@upi',
            subscription: {
                tier: 'starter',
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                expiryDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active'
            }
        } as DealerInfo,
        licenseKeys: [] as LicenseKey[],
        payslips: [] as Payslip[],
        attendance: [] as AttendanceRecord[],
    };

    localStorage.setItem('mockDb', JSON.stringify(initialDb));
    db = initialDb;
};
