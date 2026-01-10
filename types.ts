
// FIX: Create full type definitions for the application
export interface User {
  id: number;
  name: string;
  role: 'dealer' | 'technician' | 'admin';
  email?: string;
  phone?: string;
  isSetupComplete?: boolean; // New flag for setup wizard
}

export type JobCardStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type VisitStatus = JobCardStatus;

export interface JobCardItem {
  productId: number;
  productName: string;
  qty: number;
  serial?: string;
}

export interface Chalan {
  id: number;
  chalanNo: string;
  pdfPath: string;
}

export interface WorkLogEntry {
  date: string;
  technicianId: number;
  notes: string;
  cableUsed: number;
}

export interface Visit {
  id: number;
  projectName?: string;
  customerId: number;
  address: string;
  scheduledAt: string;
  technicianIds: number[];
  items: JobCardItem[];
  status: JobCardStatus;
  chalan?: Chalan;
  nvrUsername?: string;
  nvrPassword?: string;
  signatureDataUrl?: string;
  workLog?: WorkLogEntry[];
  // Project Details
  projectCode?: string;
  siteType?: string;
  projectType?: string;
  timelineStatus?: TimelineStep[];
  materialUsage?: MaterialUsageItem[];
  cableUsage?: CableUsageItem[];
  attachments?: string[]; // URLs
  notes?: string;
}

export interface TimelineStep {
  label: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
}

export interface MaterialUsageItem {
  id: string; // productId or unique id
  category: string;
  productName: string;
  qtyPlanned: number;
  qtyUsed: number;
  balance: number;
  remarks?: string;
}

export interface CableUsageItem {
  id: string;
  type: string;
  location: string;
  totalLength: number;
  usedLength: number;
  balance: number;
}

export interface DashboardSummary {
  projects: number;
  pendingInvoicesCount: number;
  pendingPayments: number;
  technicians: number;
}

export interface Technician {
  id: number;
  name: string;
  phone: string;
  specialization: string;
  status: 'active' | 'inactive';
}

export interface Customer {
  id: number;
  companyName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  address: string;
  area: string;
  city: string;
  gst: string;
}

export interface Godown {
  id: number;
  name: string;
  location: string;
}

export interface GodownStock {
  productId: number;
  productName: string;
  brand: string;
  quantity: number;
}

export interface InventorySerial {
  serial: string;
  productId: number;
  status: 'in_stock' | 'allocated' | 'installed' | 'returned';
}

export interface Brand {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  brandId: number;
  brandName: string;
  model: string;
  category: 'camera' | 'nvr' | 'cable' | 'other';
  isSerialized: boolean;
  lowStockThreshold: number;
  hsnSacCode: string;
  gstRate: 0 | 5 | 12 | 18 | 28;
}

export interface StockSummary {
  productId: number;
  productName: string;
  brandName: string;
  category: string;
  totalStock: number;
}

export interface LowStockProduct {
  productId: number;
  productName: string;
  brandName: string;
  totalStock: number;
  lowStockThreshold: number;
}

export type PaymentStatus = 'paid' | 'pending';

export interface Payment {
  id: number;
  technicianName: string;
  jobCardId: number;
  amount: number;
  status: PaymentStatus;
}

export interface TechnicianDashboardSummary {
  assignedVisits: number;
  completedToday: number;
  pendingPayments: number;
}

export interface SignaturePadRef {
  clear: () => void;
  getSignature: () => string | undefined;
}

export type WarrantyStatus = 'Awaiting Pickup' | 'Received at Office' | 'Sent to Service' | 'Under Repair' | 'Repaired' | 'Replaced' | 'Rejected' | 'Returned to Customer';

export interface ServiceStation {
  id: number;
  name: string;
  address: string;
  contact: string;
}

export interface WarrantyFollowUp {
  date: string;
  remarks: string;
  personContacted: string;
}
export interface WarrantyEntry {
  id: number;
  customerName: string;
  productName: string;
  serialNumber: string;
  issue: string;
  pickupPerson: string;
  pickupDate: string; // ISO string
  status: WarrantyStatus;
  officeIntakeDate?: string; // ISO string
  serviceStationId?: number;
  dispatchDate?: string; // ISO string
  courierInfo?: string;
  followUps: WarrantyFollowUp[];
  returnDate?: string; // ISO string
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type HDDStatus = 'Healthy' | 'Error' | 'No HDD' | 'Not Found';
export type RecordingStatus = 'OK' | 'Stopped';

export interface SiteHealth {
  customerId: number;
  customerName: string;
  isOnline: boolean;
  hddStatus: HDDStatus;
  recordingStatus: RecordingStatus;
  camerasOnline: number;
  totalCameras: number;
  lastChecked: string;
  isMonitoringEnabled: boolean;
}

export type AMCStatus = 'Active' | 'Expiring Soon' | 'Expired';

export interface AMC {
  id: number;
  customerId: number;
  customerName: string;
  startDate: string;
  endDate: string;
  cost: number;
  status: AMCStatus;
}

export type InvoiceStatus = 'paid' | 'unpaid' | 'partial';

export interface InvoiceItem {
  productId: number;
  productName: string;
  hsnSacCode: string;
  qty: number;
  rate: number;
  discount: number;
  gstRate: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}
export interface Invoice {
  id: number;
  invoiceNo: string;
  customerId: number;
  customer: Customer;
  date: string; // ISO string
  dueDate: string; // ISO string
  items: InvoiceItem[];
  subTotal: number;
  totalDiscount: number;
  totalGst: number;
  grandTotal: number;
  status: InvoiceStatus;
  notes?: string;
}

// Subscription Types
export type SubscriptionTier = 'starter' | 'professional' | 'enterprise';

export interface SubscriptionDetails {
  tier: SubscriptionTier;
  startDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'trial';
}

export interface LicenseKey {
  id: number;
  key: string;
  tier: SubscriptionTier;
  durationDays: number;
  status: 'active' | 'used' | 'revoked';
  generatedBy: string; // Admin User Name
  generatedAt: string;
  usedBy?: string; // Dealer Company Name
  usedAt?: string;
}

export interface DealerInfo {
  id?: number;
  companyName: string;
  address: string;
  gstin: string;
  upiId: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  qrCodeUrl?: string;
  subscription: SubscriptionDetails;
  email?: string;
  mobile?: string;
  ownerName?: string;
  logoUrl?: string;
  isBillingEnabled?: boolean;
  isAmcEnabled?: boolean;
  isHrEnabled?: boolean;
}

export interface SalaryDetails {
  baseSalary: number;
  hra: number;
  specialAllowance: number;
  taxDeductions: number;
  providentFund: number;
}

export interface IncentiveBonus {
  type: 'incentive' | 'bonus';
  amount: number;
  reason: string;
  date: string;
}

export interface Payslip {
  id: number;
  technicianId: number;
  technicianName: string;
  month: string;
  year: number;
  salaryDetails: SalaryDetails;
  incentives: IncentiveBonus[];
  deductions: any[];
  netPayable: number;
  pdfPath: string;
}

export interface AttendanceRecord {
  technicianId: number;
  technicianName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half-day' | 'Leave';
}

// Support System Types
export type TicketCategory = 'issue' | 'feature_request' | 'billing' | 'general';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string; // UUID
  user_id: string; // UUID
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  // For Admin View (joined data)
  user_email?: string;
  company_name?: string;
}

export type TechnicianAvailability = 'available' | 'busy' | 'on_leave' | 'offline';

export interface Expense {
  id: string;
  user_id: string;
  visit_id?: number;
  amount: number;
  category: 'travel' | 'food' | 'material' | 'other';
  description: string;
  receipt_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
}

export interface TechnicianTask {
  id: number;
  technician_id: number;
  description: string;
  status: 'pending' | 'completed';
  due_date: string;
  created_by?: string;
  created_at?: string;
}

export interface Supplier {
  id: number;
  user_id?: string;
  brand_name: string;
  sales_person_name: string;
  sales_person_mobile: string;
  manager_name?: string;
  manager_mobile?: string;
  distributor_name?: string;
  service_center_details?: string;
  service_center_number?: string;
  product_categories?: string;
  notes?: string;
  created_at?: string;
}

// Enriched project data for technician dashboard
export interface TechnicianProject extends Visit {
  customerName: string;
  customerPhone: string;
  customerCity: string;
  progressPercentage: number;
  currentStep: string;
  currentStepIndex: number;
  nextAction: string;
  isOverdue: boolean;
  estimatedCompletion?: string;
}

