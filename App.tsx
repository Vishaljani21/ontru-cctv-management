
// FIX: Create the main App component with routing and context
import React, { useState, createContext, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { User, Visit, WarrantyEntry, SubscriptionTier } from './types';
import { api } from './services/api';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import PublicPricingPage from './pages/public/PublicPricingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import SetupWizardPage from './pages/SetupWizardPage';
import { OnTruFullLogo } from './components/icons';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import VisitsPage from './pages/VisitsPage';
import VisitsPipelinePage from './pages/VisitsPipelinePage';
import InventoryPage from './pages/InventoryPage';
import GodownsPage from './pages/GodownsPage';
import ProductsPage from './pages/ProductsPage';
import SuppliersPage from './pages/SuppliersPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import CustomersPage from './pages/CustomersPage';
import TechniciansPage from './pages/TechniciansPage';
import PaymentsPage from './pages/PaymentsPage';
import SiteHealthPage from './pages/SiteHealthPage';
import AMCsPage from './pages/AMCsPage';
import WarrantyPage from './pages/WarrantyPage';
import SettingsPage from './pages/SettingsPage';
import BillingPage from './pages/BillingPage';
import CreateInvoicePage from './pages/CreateInvoicePage';
import InvoicePrintPage from './pages/InvoicePrintPage';
import PayrollPage from './pages/PayrollPage';
import AttendancePage from './pages/AttendancePage';
import PayslipPrintPage from './pages/PayslipPrintPage';
import ReportsPage from './pages/ReportsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminLicensePage from './pages/AdminLicensePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminDealersPage from './pages/AdminDealersPage';
import SupportPage from './pages/SupportPage';
import AdminSupportPage from './pages/AdminSupportPage';

// Technician Pages
import TechnicianDashboardPage from './pages/technician/TechnicianDashboardPage';
import MyVisitsPage from './pages/technician/MyVisitsPage';
import MyPaymentsPage from './pages/technician/MyPaymentsPage';
import MyExpensesPage from './pages/technician/MyExpensesPage';
import MyTasksPage from './pages/technician/MyTasksPage';
import CCTVInstallationChecklistPage from './pages/technician/CCTVInstallationChecklistPage';
import ProjectsPage from './pages/ProjectsPage';
import TaskManagerPage from './pages/TaskManagerPage';


// --- Auth Context ---
interface AuthContextType {
    user: User | null;
    login: (identifier: string, secret: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}
export const AuthContext = createContext<AuthContextType | null>(null);

// --- App Context ---
export interface AppContextType {
    visits: Visit[];
    setVisits: React.Dispatch<React.SetStateAction<Visit[]>>;
    warrantyEntries: WarrantyEntry[];
    setWarrantyEntries: React.Dispatch<React.SetStateAction<WarrantyEntry[]>>;
    isEnterprise: boolean;
    // Subscription controlled flags
    subscriptionTier: SubscriptionTier;
    isHrModuleEnabled: boolean;
    setIsHrModuleEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    isBillingModuleEnabled: boolean;
    setIsBillingModuleEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    isAmcModuleEnabled: boolean;
    setIsAmcModuleEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    isReportsEnabled: boolean;
    isSiteHealthEnabled: boolean;
}
export const AppContext = createContext<AppContextType | null>(null);

// FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const ProtectedRoute: React.FC<{ children: React.ReactElement, role?: 'dealer' | 'technician' | 'admin' }> = ({ children, role }) => {
    const authContext = React.useContext(AuthContext);
    const location = useLocation();

    if (!authContext?.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If dealer has not completed setup, force them to setup wizard
    if (authContext.user.role === 'dealer' && !authContext.user.isSetupComplete && location.pathname !== '/setup') {
        return <Navigate to="/setup" replace />;
    }

    if (role && authContext.user.role !== role) {
        return <Navigate to="/" replace />; // Redirect to home/landing if role mismatch, which handles further redirection
    }

    return children;
};

const DealerRoutes = () => {
    const appContext = React.useContext(AppContext);
    return (
        <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/pipeline" element={<VisitsPipelinePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/godowns" element={<GodownsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/technicians" element={<TechniciansPage />} />
            <Route path="/tasks" element={<TaskManagerPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Feature Gated Routes */}
            {appContext?.isBillingModuleEnabled && (
                <>
                    <Route path="/payments" element={<PaymentsPage />} />
                    <Route path="/billing" element={<BillingPage />} />
                    <Route path="/billing/new" element={<CreateInvoicePage />} />
                    <Route path="/billing/edit/:id" element={<CreateInvoicePage />} />
                </>
            )}

            {appContext?.isAmcModuleEnabled && (
                <Route path="/amcs" element={<AMCsPage />} />
            )}

            {appContext?.isReportsEnabled && (
                <>
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/warranty" element={<WarrantyPage />} />
                </>
            )}

            {appContext?.isSiteHealthEnabled && (
                <Route path="/site-health" element={<SiteHealthPage />} />
            )}

            {appContext?.isHrModuleEnabled && (
                <>
                    <Route path="/payroll" element={<PayrollPage />} />
                    <Route path="/attendance" element={<AttendancePage />} />
                </>
            )}

            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};

const TechnicianRoutes = () => (
    <Routes>
        <Route path="/tech/dashboard" element={<TechnicianDashboardPage />} />
        <Route path="/tech/my-visits" element={<MyVisitsPage />} />
        <Route path="/tech/my-payments" element={<MyPaymentsPage />} />
        <Route path="/tech/expenses" element={<MyExpensesPage />} />
        <Route path="/tech/tasks" element={<MyTasksPage />} />
        <Route path="/tech/checklist" element={<CCTVInstallationChecklistPage />} />
        <Route path="*" element={<Navigate to="/tech/dashboard" />} />
    </Routes>
);

const AdminRoutes = () => (
    <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/dealers" element={<AdminDealersPage />} />
        <Route path="/admin/license" element={<AdminLicensePage />} />
        <Route path="/admin/support" element={<AdminSupportPage />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
);


const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [visits, setVisits] = useState<Visit[]>([]);
    const [warrantyEntries, setWarrantyEntries] = useState<WarrantyEntry[]>([]);

    // Subscription State
    const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('starter');

    // Modules derived from subscription
    const [isHrModuleEnabled, setIsHrModuleEnabled] = useState(false);
    const [isBillingModuleEnabled, setIsBillingModuleEnabled] = useState(false);
    const [isAmcModuleEnabled, setIsAmcModuleEnabled] = useState(false);
    const [isReportsEnabled, setIsReportsEnabled] = useState(false);
    const [isSiteHealthEnabled, setIsSiteHealthEnabled] = useState(false);

    // Legacy flag
    const isEnterprise = subscriptionTier === 'enterprise';

    // FIX: Removed useEffect that auto-resets module flags based on tier. 
    // This allows persisted user preferences (from DB) to take precedence.
    // Initial tier defaults should be handled when subscription changes or on first setup.

    const login = useCallback(async (identifier: string, secret: string) => {
        const loggedInUser = await api.login(identifier, secret);
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));

        // Fetch subscription on login
        if (loggedInUser.role === 'dealer' && loggedInUser.isSetupComplete) {
            const info = await api.getDealerInfo();
            setSubscriptionTier(info.subscription?.tier || 'starter');

            // Load saved module preferences
            if (info.isBillingEnabled !== undefined) setIsBillingModuleEnabled(info.isBillingEnabled);
            if (info.isAmcEnabled !== undefined) setIsAmcModuleEnabled(info.isAmcEnabled);
            if (info.isHrEnabled !== undefined) setIsHrModuleEnabled(info.isHrEnabled);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
    }, []);

    const updateUser = useCallback((updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }, []);

    useEffect(() => {
        const init = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);

                    if (parsedUser.role === 'dealer' && parsedUser.isSetupComplete) {
                        const info = await api.getDealerInfo();
                        setSubscriptionTier(info.subscription?.tier || 'starter');

                        // Load saved module preferences if available
                        if (info.isBillingEnabled !== undefined) setIsBillingModuleEnabled(info.isBillingEnabled);
                        if (info.isAmcEnabled !== undefined) setIsAmcModuleEnabled(info.isAmcEnabled);
                        if (info.isHrEnabled !== undefined) setIsHrModuleEnabled(info.isHrEnabled);
                    }
                }
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-black">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-48 text-primary-600 dark:text-primary-400 animate-pulse">
                        <OnTruFullLogo className="w-full h-auto" />
                    </div>
                    <div className="flex space-x-2">
                        <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            <AppContext.Provider value={{
                visits, setVisits, warrantyEntries, setWarrantyEntries, isEnterprise,
                subscriptionTier,
                isHrModuleEnabled, setIsHrModuleEnabled,
                isBillingModuleEnabled, setIsBillingModuleEnabled,
                isAmcModuleEnabled, setIsAmcModuleEnabled,
                isReportsEnabled, isSiteHealthEnabled
            }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={user ? <Navigate to="/dashboard" /> : <PublicLayout><HomePage /></PublicLayout>} />
                    <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
                    <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
                    <Route path="/pricing" element={<PublicLayout><PublicPricingPage /></PublicLayout>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Standalone Pages */}
                    <Route path="/invoice/print/:id" element={<InvoicePrintPage />} />
                    <Route path="/payslip/print/:id" element={<PayslipPrintPage />} />

                    {/* Setup Wizard */}
                    <Route path="/setup" element={
                        <ProtectedRoute role="dealer">
                            <SetupWizardPage />
                        </ProtectedRoute>
                    } />

                    {/* Main App Routes */}
                    <Route path="/*" element={
                        <ProtectedRoute>
                            <Layout>
                                {user?.role === 'dealer' ? <DealerRoutes /> :
                                    user?.role === 'technician' ? <TechnicianRoutes /> :
                                        <AdminRoutes />}
                            </Layout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </AppContext.Provider>
        </AuthContext.Provider>
    );
};

export default App;
