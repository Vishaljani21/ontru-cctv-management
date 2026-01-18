import React from 'react';
import { Link } from 'react-router-dom';

// Official OnTru Logo Component
const OnTruLogo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
    const sizes = {
        small: { icon: 'w-8 h-8', text: 'text-lg' },
        default: { icon: 'w-10 h-10', text: 'text-xl' },
        large: { icon: 'w-12 h-12', text: 'text-2xl' }
    };

    return (
        <div className="flex items-center gap-3">
            <div className={`${sizes[size].icon} bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20`}>
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
            </div>
            <span className={`${sizes[size].text} font-bold text-slate-900`}>OnTru</span>
        </div>
    );
};

// Header Component
const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/">
                <OnTruLogo size="small" />
            </Link>
            <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-sm font-medium text-slate-900 hover:text-teal-600 transition-colors">Home</Link>
                <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">About</Link>
                <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Pricing</Link>
                <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center gap-4">
                <a href="https://app.ontru.in/login" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors hidden sm:block">
                    Log in
                </a>
                <a href="https://app.ontru.in/register" className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-md shadow-teal-500/20">
                    Get Started
                </a>
            </div>
        </div>
    </header>
);

// Footer Component
const Footer = () => (
    <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold">OnTru</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        India's #1 CCTV business management platform for modern dealers.
                    </p>
                </div>
                <div>
                    <h4 className="text-sm font-semibold mb-4">Product</h4>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
                        <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold mb-4">Company</h4>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold mb-4">Contact</h4>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li>
                            <a href="mailto:info@softwarelicensehub.in" className="hover:text-white transition-colors">
                                info@softwarelicensehub.in
                            </a>
                        </li>
                        <li>+91 7777 955 344</li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800 gap-4">
                <p className="text-xs text-slate-500">© 2025 OnTru by Software License Hub. GSTIN: 24AFKFS3394E1ZT</p>
                <p className="text-xs text-slate-500">Ahmedabad, Gujarat, India</p>
            </div>
        </div>
    </footer>
);

const features = [
    {
        title: "Project Tracking",
        description: "Manage every installation from quote to completion with visual Kanban boards and timelines.",
        icon: "📋"
    },
    {
        title: "Inventory Control",
        description: "Multi-godown stock management with serial number tracking for every camera and NVR.",
        icon: "📦"
    },
    {
        title: "Technician Portal",
        description: "Mobile-first dashboard for field technicians with real-time job updates and routing.",
        icon: "👷"
    },
    {
        title: "GST Billing",
        description: "Professional invoices with automated tax calculation, payment tracking, and reminders.",
        icon: "🧾"
    },
    {
        title: "AMC Management",
        description: "Never miss a renewal. Automated reminders with complete service history tracking.",
        icon: "🔄"
    },
    {
        title: "Site Monitoring",
        description: "Proactive NVR health checks via ping/HTTP. Know about issues before clients call.",
        icon: "📡"
    }
];

const stats = [
    { value: "500+", label: "Active Projects" },
    { value: "12,000+", label: "Cameras Managed" },
    { value: "150+", label: "Dealers Trust Us" },
    { value: "99.9%", label: "Uptime" }
];

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-teal-700">India's #1 CCTV Business Platform</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                        Run Your CCTV Business<br />
                        <span className="text-teal-600">Like Never Before</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed">
                        The all-in-one platform for CCTV dealers. Manage projects, inventory, technicians, billing, and AMCs from a single powerful dashboard.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <a
                            href="https://app.ontru.in/register"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/25"
                        >
                            Start Free Trial
                            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                        <a
                            href="https://app.ontru.in/login"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-teal-300 hover:text-teal-600 transition-all"
                        >
                            Sign In
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Everything You Need to Scale
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Built specifically for CCTV dealers by people who understand the security installation business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/50 transition-all duration-300"
                            >
                                <div className="text-4xl mb-5">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-slate-600 mb-12">
                        Start free. No credit card required. Upgrade as you grow.
                    </p>

                    <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm max-w-md mx-auto">
                        <div className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-2">Starter Plan</div>
                        <div className="flex items-baseline justify-center gap-1 mb-4">
                            <span className="text-5xl font-bold text-slate-900">₹0</span>
                            <span className="text-slate-500">/month</span>
                        </div>
                        <p className="text-slate-600 mb-8">Perfect to get started</p>
                        <ul className="text-left space-y-3 mb-10">
                            {["Up to 25 Projects", "5 Technicians", "Basic Inventory", "Standard Invoices", "Email Support"].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-slate-700">
                                    <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <a
                            href="https://app.ontru.in/register"
                            className="block w-full py-4 px-6 text-center text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-md shadow-teal-500/20"
                        >
                            Get Started Free
                        </a>
                        <p className="mt-6 text-sm text-slate-500">
                            Need more? <Link to="/pricing" className="text-teal-600 hover:underline font-medium">View all plans →</Link>
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-teal-500 to-teal-600">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to transform your business?
                    </h2>
                    <p className="text-lg text-teal-100 mb-10">
                        Join hundreds of successful CCTV dealers who run smarter with OnTru.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://app.ontru.in/register"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-white text-teal-600 rounded-xl hover:bg-teal-50 transition-all shadow-lg"
                        >
                            Start Your Free Trial
                        </a>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all"
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
