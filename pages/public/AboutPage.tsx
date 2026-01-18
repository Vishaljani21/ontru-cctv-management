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
                <Link to="/" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Home</Link>
                <Link to="/about" className="text-sm font-medium text-slate-900 hover:text-teal-600 transition-colors">About</Link>
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

const values = [
    {
        icon: "💡",
        title: "Innovation First",
        description: "Constantly pushing boundaries to deliver cutting-edge solutions for the security industry."
    },
    {
        icon: "🤝",
        title: "Customer Success",
        description: "Your growth is our priority. Dedicated support and continuous improvements."
    },
    {
        icon: "🛡️",
        title: "Trust & Security",
        description: "Enterprise-grade security with complete data privacy and reliable uptime."
    },
    {
        icon: "⚡",
        title: "Performance",
        description: "Lightning-fast platform built for scale, handling thousands of operations daily."
    }
];

const stats = [
    { value: "500+", label: "Active Projects" },
    { value: "150+", label: "Happy Dealers" },
    { value: "12,000+", label: "Cameras Managed" },
    { value: "99.9%", label: "Uptime" }
];

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                        About <span className="text-teal-600">OnTru</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Empowering CCTV businesses with technology built specifically for the security installation industry.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-4">Our Story</div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                                Built by Industry Experts
                            </h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    OnTru was founded with a simple mission: to simplify the complex operations of CCTV dealers
                                    and system integrators. We understand that managing inventory, technicians, projects, and
                                    customer relationships can be overwhelming using traditional methods.
                                </p>
                                <p>
                                    Our platform combines project management, CRM, inventory tracking, and billing into a single,
                                    cohesive ecosystem. This allows business owners to focus on growth rather than administrative tasks.
                                </p>
                                <p>
                                    Today, OnTru powers hundreds of CCTV businesses across India, helping them manage thousands
                                    of cameras and installations with unprecedented efficiency.
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Our Vision</h3>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                To be the leading operational backbone for security system integrators globally,
                                fostering efficiency and transparency in the industry.
                            </p>
                            <div className="pt-6 border-t border-slate-200">
                                <div className="text-sm font-semibold text-teal-600 mb-2">A Product By</div>
                                <div className="text-xl font-bold text-slate-900 mb-1">Software License Hub</div>
                                <p className="text-sm text-slate-500">GSTIN: 24AFKFS3394E1ZT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            What Drives Us
                        </h2>
                        <p className="text-lg text-slate-600">
                            Core principles that guide everything we do.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => (
                            <div
                                key={idx}
                                className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all"
                            >
                                <div className="text-4xl mb-5">{value.icon}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
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
                            Start Free Trial
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

export default AboutPage;
