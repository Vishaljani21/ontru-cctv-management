import React from 'react';
import { Link } from 'react-router-dom';

// Premium Header Component - Linear/Stripe inspired
const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <span className="text-white font-bold text-lg">O</span>
                </div>
                <span className="text-xl font-semibold text-white">OnTru</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">Home</Link>
                <Link to="/about" className="text-sm text-gray-300 hover:text-white transition-colors">About</Link>
                <Link to="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</Link>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center gap-4">
                <a href="https://app.ontru.in/login" className="text-sm text-gray-300 hover:text-white transition-colors hidden sm:block">
                    Log in
                </a>
                <a href="https://app.ontru.in/register" className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-100 transition-colors">
                    Get Started
                </a>
            </div>
        </div>
    </header>
);

// Premium Footer Component
const Footer = () => (
    <footer className="bg-black text-gray-400 py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">O</span>
                        </div>
                        <span className="text-xl font-semibold text-white">OnTru</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">
                        India's #1 CCTV business management platform for modern dealers.
                    </p>
                    <p className="text-xs text-gray-600">
                        By Software License Hub
                    </p>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
                        <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                        <li><a href="https://app.ontru.in" className="hover:text-white transition-colors">Dashboard</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
                    <ul className="space-y-3 text-sm">
                        <li>
                            <a href="mailto:info@softwarelicensehub.in" className="hover:text-white transition-colors">
                                info@softwarelicensehub.in
                            </a>
                        </li>
                        <li>+91 7777 955 344</li>
                        <li>+91 7777 997 309</li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
                <p className="text-xs text-gray-600">© 2025 OnTru by Software License Hub. GSTIN: 24AFKFS3394E1ZT</p>
                <p className="text-xs text-gray-600">Ahmedabad, Gujarat, India</p>
            </div>
        </div>
    </footer>
);

const features = [
    {
        title: "Project Tracking",
        description: "Manage every installation from quote to completion with visual Kanban boards.",
        icon: "📋"
    },
    {
        title: "Inventory Control",
        description: "Multi-godown stock management with serial number tracking for every camera.",
        icon: "📦"
    },
    {
        title: "Technician Portal",
        description: "Mobile-first dashboard for field technicians with real-time job updates.",
        icon: "👷"
    },
    {
        title: "GST Billing",
        description: "Professional invoices with automated tax calculation and payment tracking.",
        icon: "🧾"
    },
    {
        title: "AMC Management",
        description: "Never miss a renewal. Automated reminders with complete service history.",
        icon: "🔄"
    },
    {
        title: "Site Monitoring",
        description: "Proactive NVR health checks. Know about issues before clients call you.",
        icon: "📡"
    }
];

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-violet-600/20 via-fuchsia-600/10 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        <span className="text-sm text-gray-300">India's #1 CCTV Business Platform</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        <span className="text-white">Run Your CCTV</span><br />
                        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                            Business Smarter
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-12 leading-relaxed">
                        The all-in-one platform for CCTV dealers. Manage projects, inventory, technicians, billing, and AMCs from a single powerful dashboard.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                        <a
                            href="https://app.ontru.in/register"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium bg-white text-black rounded-xl hover:bg-gray-100 transition-all shadow-lg shadow-white/10"
                        >
                            Start Free Trial
                            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                        <a
                            href="https://app.ontru.in/login"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                        >
                            Sign In
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {[
                            { value: "500+", label: "Active Projects" },
                            { value: "12,000+", label: "Cameras Managed" },
                            { value: "150+", label: "Dealers Trust Us" },
                            { value: "99.9%", label: "Uptime" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gradient-to-b from-black via-gray-950 to-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Everything You Need to Scale
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Built specifically for CCTV dealers by people who understand the security installation business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/[0.07] transition-all duration-300"
                            >
                                <div className="text-4xl mb-6">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-24 bg-black">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-gray-400 mb-12">
                        Start free. No credit card required. Upgrade as you grow.
                    </p>

                    <div className="bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent p-px rounded-3xl">
                        <div className="bg-gray-950 rounded-3xl p-10">
                            <div className="text-sm text-violet-400 font-medium mb-2">STARTER PLAN</div>
                            <div className="flex items-baseline justify-center gap-2 mb-4">
                                <span className="text-6xl font-bold text-white">₹0</span>
                                <span className="text-gray-500">/month</span>
                            </div>
                            <p className="text-gray-400 mb-8">Perfect to get started with basic features</p>
                            <ul className="text-left max-w-md mx-auto space-y-3 mb-10">
                                {["Up to 25 Projects", "5 Technicians", "Basic Inventory", "Standard Invoices", "Email Support"].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-gray-300">
                                        <svg className="w-5 h-5 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://app.ontru.in/register"
                                className="inline-flex items-center justify-center w-full max-w-sm px-8 py-4 text-base font-medium bg-white text-black rounded-xl hover:bg-gray-100 transition-all"
                            >
                                Get Started Free
                            </a>
                            <p className="mt-6 text-sm text-gray-500">
                                Need more? <Link to="/pricing" className="text-violet-400 hover:text-violet-300">View all plans →</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-b from-black to-gray-950">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to transform your business?
                    </h2>
                    <p className="text-lg text-gray-400 mb-10">
                        Join hundreds of successful CCTV dealers who run smarter with OnTru.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://app.ontru.in/register"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium bg-white text-black rounded-xl hover:bg-gray-100 transition-all"
                        >
                            Start Your Free Trial
                        </a>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
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
