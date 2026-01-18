import React from 'react';
import { Link } from 'react-router-dom';

// Shared Header Component
const Header = () => (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">O</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">OnTru</span>
            </Link>
            <nav className="hidden md:flex gap-8">
                <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Home</Link>
                <Link to="/about" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">About</Link>
                <Link to="/pricing" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Pricing</Link>
                <Link to="/contact" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center gap-3">
                <a href="https://app.ontru.in/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors hidden sm:block">
                    Sign In
                </a>
                <a href="https://app.ontru.in/register" className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm">
                    Get Started
                </a>
            </div>
        </div>
    </header>
);

// Shared Footer Component
const Footer = () => (
    <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">O</span>
                        </div>
                        <span className="text-2xl font-bold text-white">OnTru</span>
                    </div>
                    <p className="text-slate-400 mb-4 max-w-md leading-relaxed">
                        India's leading CCTV business management platform. Streamline your operations, boost productivity, and scale with confidence.
                    </p>
                    <p className="text-sm text-slate-500">
                        A product of <span className="text-primary-400">Software License Hub</span>
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        <li><a href="https://app.ontru.in/login" className="hover:text-white transition-colors">Sign In</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Contact</h4>
                    <ul className="space-y-3 text-sm">
                        <li>
                            <a href="mailto:info@softwarelicensehub.in" className="hover:text-white transition-colors">
                                info@softwarelicensehub.in
                            </a>
                        </li>
                        <li>+91 7777 955 344</li>
                        <li>+91 7777 997 309</li>
                        <li className="pt-2 text-xs text-slate-500">
                            E-702 PNTC, Radio Mirchi Road<br />
                            Vejalpur, Ahmedabad 380007
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm">© 2025 OnTru by Software License Hub. All rights reserved.</div>
                <div className="text-xs text-slate-500">GSTIN: 24AFKFS3394E1ZT</div>
            </div>
        </div>
    </footer>
);

// Icons
const ProjectIcon = () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const InventoryIcon = () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

const UsersIcon = () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const BillingIcon = () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const AMCIcon = () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MonitorIcon = () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const features = [
    {
        icon: <ProjectIcon />,
        title: "Project Management",
        description: "Track every installation from quote to completion with Kanban boards, timelines, and real-time updates."
    },
    {
        icon: <InventoryIcon />,
        title: "Inventory Control",
        description: "Multi-godown stock management with serial number tracking. Never lose track of equipment again."
    },
    {
        icon: <UsersIcon />,
        title: "Technician Portal",
        description: "Mobile-optimized dashboard for field technicians with job assignments and instant updates."
    },
    {
        icon: <BillingIcon />,
        title: "GST Billing",
        description: "Professional invoices with automated GST calculation and payment tracking in one click."
    },
    {
        icon: <AMCIcon />,
        title: "AMC Automation",
        description: "Never miss a renewal. Automated reminders with complete service history tracking."
    },
    {
        icon: <MonitorIcon />,
        title: "Site Monitoring",
        description: "Proactive NVR health checks via ping/HTTP. Know about issues before clients call."
    }
];

const stats = [
    { value: "500+", label: "Active Projects" },
    { value: "12,000+", label: "Cameras Managed" },
    { value: "150+", label: "Dealers Trust Us" },
    { value: "99.9%", label: "Uptime Guaranteed" }
];

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            <span className="text-sm font-medium text-primary-700">India's #1 CCTV Business Platform</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                            Run Your CCTV Business
                            <span className="block mt-2 text-primary-600">Like Never Before</span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
                            The all-in-one platform that helps CCTV dealers manage projects, inventory, technicians, billing, and AMCs from a single powerful dashboard.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <a
                                href="https://app.ontru.in/register"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all hover:-translate-y-0.5"
                            >
                                Start 14-Day Free Trial
                                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                            <a
                                href="https://app.ontru.in/login"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-primary-300 hover:text-primary-600 transition-all"
                            >
                                Sign In
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                    <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 text-sm font-semibold text-primary-600 bg-primary-50 rounded-full mb-4">
                            POWERFUL FEATURES
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                            Everything You Need to Scale
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg text-slate-600">
                            Built specifically for CCTV dealers by people who understand the security installation business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 text-sm font-semibold text-primary-600 bg-primary-50 rounded-full mb-4">
                            SIMPLE PRICING
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                            Start Free. Scale as You Grow.
                        </h2>
                    </div>

                    <div className="max-w-md mx-auto">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                            <div className="text-center mb-8">
                                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Starter Plan</span>
                                <div className="mt-4 flex items-baseline justify-center gap-2">
                                    <span className="text-5xl font-extrabold text-slate-900">₹0</span>
                                    <span className="text-slate-500">/month</span>
                                </div>
                                <p className="mt-2 text-slate-600">Perfect to get started</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {["Up to 25 Projects", "5 Technicians", "Basic Inventory", "Standard Invoices", "Email Support"].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <CheckIcon />
                                        <span className="text-slate-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://app.ontru.in/register"
                                className="block w-full py-4 px-6 text-center text-lg font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/25 transition-all"
                            >
                                Get Started Free
                            </a>
                        </div>
                    </div>

                    <p className="text-center mt-8 text-slate-500">
                        Need more? Check our <Link to="/pricing" className="text-primary-600 hover:underline font-medium">Professional & Enterprise plans</Link>
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-xl text-primary-100 mb-10">
                        Join hundreds of successful CCTV dealers who have streamlined their operations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://app.ontru.in/register"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-xl hover:bg-primary-50 shadow-lg transition-all hover:-translate-y-0.5"
                        >
                            Start Your Free Trial
                        </a>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;
