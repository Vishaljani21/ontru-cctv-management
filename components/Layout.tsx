import React, { useState, useContext, useMemo, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, AppContext } from './contexts';
import { useTheme } from '../contexts/ThemeContext';
import {
    DashboardIcon, ProjectIcon, VisitsIcon, InventoryIcon, GodownIcon, ProductIcon,
    CustomersIcon, TechniciansIcon, PaymentsIcon, SiteHealthIcon, AMCIcon, WarrantyIcon,
    SettingsIcon, BillingIcon, PayrollIcon, AttendanceIcon, ReportIcon,
    ChecklistIcon, MyPaymentsIcon, MyVisitsIcon, LogoutIcon, OnTruFullLogo, OnTruLogo, CrownIcon,
    KeyIcon, SunIcon, MoonIcon, UserIcon, MenuIcon, CrossIcon, ChatbotIcon, CurrencyRupeeIcon,
    ClipboardDocumentCheckIcon, SupplierIcon, MagnifyingGlassIcon, FunnelIcon, PlusIcon,
    CheckCircleIcon
} from './icons';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    isCollapsed: boolean;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isCollapsed, onClick }) => (
    <NavLink
        to={to}
        end
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group relative outline-none
            ${isCollapsed
                ? 'justify-center w-10 h-10 rounded-xl mx-auto my-3'
                : 'px-4 py-3.5 my-1.5 mx-3 rounded-xl'
            }
            ${isActive
                ? 'bg-primary-600 text-white shadow-[0_4px_20px_rgba(20,184,166,0.3)] font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }
            ${!isCollapsed && isActive ? 'translate-x-1' : ''}
            `
        }
        aria-label={label}
    >
        {({ isActive }) => (
            <>
                <div className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
                {!isCollapsed && (
                    <span className={`ml-3 text-[15px] font-medium tracking-wide transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                        {label}
                    </span>
                )}

                {/* Custom Tooltip for Collapsed State */}
                {isCollapsed && (
                    <div className="hidden group-hover:block absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg z-50 shadow-xl border border-slate-700 whitespace-nowrap animate-fade-in-right">
                        {label}
                        <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-slate-900"></div>
                    </div>
                )}
            </>
        )}
    </NavLink>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const authContext = useContext(AuthContext);
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleLogout = () => {
        authContext?.logout();
        navigate('/login');
    };

    const getPageTitle = (pathname: string) => {
        const path = pathname.split('/')[1] || 'dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
    };

    const dealerNavLinks = useMemo(() => {
        const links = [
            { to: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
            { to: '/pipeline', icon: <VisitsIcon />, label: 'Complaint Pipeline' },
            { to: '/complaints', icon: <ProjectIcon />, label: 'Complaints' },
            { to: '/products', icon: <ProductIcon />, label: 'Products' },
            { to: '/inventory', icon: <InventoryIcon />, label: 'Inventory' },
            { to: '/customers', icon: <CustomersIcon />, label: 'Customers' },
            { to: '/technicians', icon: <TechniciansIcon />, label: 'Technicians' },
            { to: '/tasks', icon: <ClipboardDocumentCheckIcon />, label: 'Daily Tasks' },
            { to: '/suppliers', icon: <SupplierIcon />, label: 'Suppliers' },
            { to: '/godowns', icon: <GodownIcon />, label: 'Godowns' },
        ];

        if (appContext?.isReportsEnabled) links.push({ to: '/warranty', icon: <WarrantyIcon />, label: 'Warranty' });
        if (appContext?.isSiteHealthEnabled) links.push({ to: '/site-health', icon: <SiteHealthIcon />, label: 'Site Health' });
        if (appContext?.isAmcModuleEnabled) links.push({ to: '/amcs', icon: <AMCIcon />, label: 'AMCs' });
        if (appContext?.isBillingModuleEnabled) links.push({ to: '/billing', icon: <BillingIcon />, label: 'Billing' });
        if (appContext?.isReportsEnabled) links.push({ to: '/reports', icon: <ReportIcon />, label: 'Reports' });

        if (appContext?.isHrModuleEnabled) {
            links.push(
                { to: '/payroll', icon: <PayrollIcon />, label: 'Payroll' },
                { to: '/attendance', icon: <AttendanceIcon />, label: 'Attendance' }
            );
        }

        links.push({ to: '/subscription', icon: <CrownIcon />, label: 'Subscription' });
        links.push({ to: '/support', icon: <ChatbotIcon />, label: 'Support' });
        links.push({ to: '/settings', icon: <SettingsIcon />, label: 'Settings' });

        return links;
    }, [appContext?.isHrModuleEnabled, appContext?.isBillingModuleEnabled, appContext?.isAmcModuleEnabled, appContext?.isReportsEnabled, appContext?.isSiteHealthEnabled]);

    const technicianNavLinks = useMemo(() => [
        { to: '/tech/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
        { to: '/tech/my-complaints', icon: <ProjectIcon />, label: 'My Tickets' },
        { to: '/tech/my-visits', icon: <MyVisitsIcon />, label: 'My Visits' },
        { to: '/tech/tasks', icon: <ClipboardDocumentCheckIcon />, label: 'Daily Tasks' },
        { to: '/tech/expenses', icon: <CurrencyRupeeIcon />, label: 'My Expenses' },
        { to: '/tech/my-payments', icon: <MyPaymentsIcon />, label: 'My Payments' },
        { to: '/tech/checklist', icon: <ChecklistIcon />, label: 'Checklist' },
    ], []);

    const adminNavLinks = useMemo(() => [
        { to: '/admin/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
        { to: '/admin/dealers', icon: <UserIcon />, label: 'Dealers' },
        { to: '/admin/license', icon: <KeyIcon />, label: 'License Keys' },
        { to: '/admin/support', icon: <ChatbotIcon />, label: 'Support Tickets' },
    ], []);

    let navLinks = dealerNavLinks;
    if (authContext?.user?.role === 'technician') navLinks = technicianNavLinks;
    if (authContext?.user?.role === 'admin') navLinks = adminNavLinks;

    const SidebarContent = ({ collapsed }: { collapsed: boolean }) => (
        <div className="flex flex-col h-full bg-slate-900 dark:bg-black text-white selection:bg-primary-500/30">
            {/* Header / Logo */}
            <div className={`h-20 flex items-center ${collapsed ? 'justify-center ml-1' : 'px-8'} shrink-0 border-b border-white/5`}>
                <Link to="/dashboard" className={`focus:outline-none transition-transform hover:scale-105 ${collapsed ? 'mx-auto' : ''}`}>
                    {collapsed ? <OnTruLogo className="w-9 h-9 text-primary-500" /> : <OnTruFullLogo className="h-8 text-white" />}
                </Link>
            </div>

            {/* Navigation */}
            <nav className={`flex-1 overflow-y-auto space-y-1 custom-scrollbar pb-6 mt-4 ${collapsed ? 'px-2' : 'px-3'}`}>
                {navLinks.map(link => <NavItem key={link.to} {...link} isCollapsed={collapsed} onClick={() => setIsMobileMenuOpen(false)} />)}
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 mt-auto shrink-0 border-t border-white/5 bg-slate-900/50 backdrop-blur-sm">
                {authContext?.user?.role === 'dealer' && !collapsed && (
                    <div className="mb-4 px-4 py-3 bg-primary-500/10 rounded-xl border border-primary-500/20 relative overflow-hidden group">
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-primary-200/60 uppercase tracking-wider mb-0.5">Plan</span>
                                <span className="text-sm font-bold text-white capitalize tracking-tight flex items-center gap-1.5">
                                    {appContext?.subscriptionTier || 'Free'}
                                </span>
                            </div>
                            <Link to="/subscription" className="text-primary-300 hover:text-white bg-white/10 p-1.5 rounded-lg transition-all hover:bg-primary-500">
                                <CrownIcon className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}

                <div className={`flex items-center ${collapsed ? 'justify-center w-10 h-10 mx-auto' : 'justify-between px-2'} py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group relative`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-500/30">
                            {authContext?.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col truncate">
                                <span className="text-[14px] font-bold text-white truncate leading-tight">{authContext?.user?.name}</span>
                                <div className="flex items-center mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                    <span className="text-[12px] text-slate-400 font-medium capitalize truncate leading-none">{authContext?.user?.role}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-white/5 transition-colors" title="Logout">
                            <LogoutIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-black font-sans selection:bg-primary-100 selection:text-primary-900 transition-colors duration-300 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside
                className={`
                    hidden lg:flex relative z-30 flex-col h-full bg-slate-900 dark:bg-black border-r border-transparent shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)]
                    ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}
                    transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                `}
                aria-label="Sidebar Navigation"
            >
                <SidebarContent collapsed={isCollapsed} />

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-slate-800 text-slate-400 w-6 h-6 rounded-full shadow-lg border border-slate-700 hover:text-white flex items-center justify-center transition-transform hover:scale-110 z-50 focus:outline-none"
                    aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <svg className={`w-3 h-3 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
            </aside>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-[280px] bg-slate-900 dark:bg-black text-white shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] lg:hidden flex flex-col
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="absolute top-4 right-4 z-50">
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white bg-white/10 rounded-full transition-colors">
                        <CrossIcon className="w-5 h-5" />
                    </button>
                </div>
                <SidebarContent collapsed={false} />
            </aside>


            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 h-full`}>
                <header className="h-16 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold font-heading text-slate-800 dark:text-white tracking-tight leading-none">{getPageTitle(location.pathname)}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-white/10 transition-colors"
                        >
                            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative custom-scrollbar bg-[#F8FAFC] dark:bg-black">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
