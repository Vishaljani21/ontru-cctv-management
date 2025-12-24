


// FIX: Create the main Layout component with sidebar navigation
import React, { useState, useContext, useMemo } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext, AppContext } from '../App';
import ChatbotWidget from './ChatbotWidget';
import {
    DashboardIcon, ProjectIcon, VisitsIcon, InventoryIcon, GodownIcon, ProductIcon,
    CustomersIcon, TechniciansIcon, PaymentsIcon, SiteHealthIcon, AMCIcon, WarrantyIcon,
    SettingsIcon, BillingIcon, PayrollIcon, AttendanceIcon, ReportIcon,
    ChecklistIcon, MyPaymentsIcon, MyVisitsIcon, LogoutIcon, OnTruFullLogo, OnTruLogo, CrownIcon,
    KeyIcon
} from './icons';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isCollapsed }) => (
    <NavLink
        to={to}
        end
        className={({ isActive }) =>
            `flex items-center p-3 my-1 rounded-lg transition-colors ${
            isActive ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`
        }
    >
        <div className="w-6 h-6">{icon}</div>
        {!isCollapsed && <span className="ml-3 font-medium">{label}</span>}
    </NavLink>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const authContext = useContext(AuthContext);
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        authContext?.logout();
        navigate('/login');
    };

    const dealerNavLinks = useMemo(() => {
        const links = [
            { to: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
            { to: '/projects', icon: <ProjectIcon />, label: 'Projects' },
            { to: '/inventory', icon: <InventoryIcon />, label: 'Inventory' },
            { to: '/products', icon: <ProductIcon />, label: 'Products' },
            { to: '/customers', icon: <CustomersIcon />, label: 'Customers' },
            { to: '/technicians', icon: <TechniciansIcon />, label: 'Technicians' },
            { to: '/godowns', icon: <GodownIcon />, label: 'Godowns' },
        ];

        // Conditional Links based on Subscription Tier
        if (appContext?.isReportsEnabled) {
            links.push({ to: '/warranty', icon: <WarrantyIcon />, label: 'Warranty' });
        }

        if (appContext?.isSiteHealthEnabled) {
             links.push({ to: '/site-health', icon: <SiteHealthIcon />, label: 'Site Health' });
        }

        if (appContext?.isAmcModuleEnabled) {
            links.push({ to: '/amcs', icon: <AMCIcon />, label: 'AMCs' });
        }
        
        if (appContext?.isBillingModuleEnabled) {
             links.push({ to: '/billing', icon: <BillingIcon />, label: 'Billing' });
        }
        
        if (appContext?.isReportsEnabled) {
             links.push({ to: '/reports', icon: <ReportIcon />, label: 'Reports' });
        }

        if (appContext?.isHrModuleEnabled) {
            links.push(
                { to: '/payroll', icon: <PayrollIcon />, label: 'Payroll' },
                { to: '/attendance', icon: <AttendanceIcon />, label: 'Attendance' }
            );
        }

        links.push({ to: '/subscription', icon: <CrownIcon />, label: 'Subscription' });
        links.push({ to: '/settings', icon: <SettingsIcon />, label: 'Settings' });
        
        return links;
    }, [appContext?.isHrModuleEnabled, appContext?.isBillingModuleEnabled, appContext?.isAmcModuleEnabled, appContext?.isReportsEnabled, appContext?.isSiteHealthEnabled]);

    const technicianNavLinks = useMemo(() => [
        { to: '/tech/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
        { to: '/tech/my-visits', icon: <MyVisitsIcon />, label: 'My Projects' },
        { to: '/tech/my-payments', icon: <MyPaymentsIcon />, label: 'My Payments' },
        { to: '/tech/checklist', icon: <ChecklistIcon />, label: 'Checklist' },
    ], []);

    const adminNavLinks = useMemo(() => [
        { to: '/admin/license', icon: <KeyIcon />, label: 'License Keys' },
    ], []);

    let navLinks = dealerNavLinks;
    if (authContext?.user?.role === 'technician') navLinks = technicianNavLinks;
    if (authContext?.user?.role === 'admin') navLinks = adminNavLinks;

    return (
        <div className="flex h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className={`bg-white border-r transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <div className="flex flex-col h-full">
                    <div className="h-20 flex items-center justify-center border-b">
                        <Link to="/dashboard" className="w-full px-4">
                            {isCollapsed ? <OnTruLogo /> : <OnTruFullLogo />}
                        </Link>
                    </div>
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {navLinks.map(link => <NavItem key={link.to} {...link} isCollapsed={isCollapsed} />)}
                    </nav>
                    <div className="p-3 border-t">
                         {authContext?.user?.role === 'dealer' && !isCollapsed && (
                            <div className="mb-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-xs text-slate-500 uppercase font-semibold">Current Plan</p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="font-bold text-primary-600 capitalize">{appContext?.subscriptionTier}</span>
                                    <Link to="/subscription" className="text-xs text-blue-500 hover:underline">Upgrade</Link>
                                </div>
                            </div>
                         )}
                        <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600">
                             <div className="w-6 h-6"><LogoutIcon /></div>
                            {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white border-b flex items-center justify-between px-6">
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-slate-500 hover:text-primary-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </button>
                    <div className="flex items-center space-x-4">
                        <span className="font-semibold text-slate-700">Welcome, {authContext?.user?.name || 'User'}</span>
                        {authContext?.user?.role === 'admin' && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold">ADMIN</span>}
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
            {authContext?.user?.role === 'dealer' && <ChatbotWidget />}
        </div>
    );
};

export default Layout;
