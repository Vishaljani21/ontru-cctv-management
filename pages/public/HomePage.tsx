import React from 'react';
import { Link } from 'react-router-dom';

// Inline SVG icons for the features
const ProjectIcon = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const InventoryIcon = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

const UsersIcon = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const BillingIcon = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const AMCIcon = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MonitorIcon = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const StarIcon = () => (
    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const features = [
    {
        icon: <ProjectIcon />,
        title: "Project Management",
        description: "Track every installation from quote to completion. Kanban boards, timelines, and real-time progress updates for complete visibility."
    },
    {
        icon: <InventoryIcon />,
        title: "Inventory Control",
        description: "Multi-godown stock management with serial number tracking. Never lose track of cameras, NVRs, or accessories again."
    },
    {
        icon: <UsersIcon />,
        title: "Technician Portal",
        description: "Mobile-optimized dashboard for field technicians. Job assignments, GPS tracking, and instant photo uploads."
    },
    {
        icon: <BillingIcon />,
        title: "GST Billing",
        description: "Professional invoices with automated GST calculation. Payment tracking and financial reports in one click."
    },
    {
        icon: <AMCIcon />,
        title: "AMC Automation",
        description: "Never miss a renewal. Automated reminders for you and clients with complete service history tracking."
    },
    {
        icon: <MonitorIcon />,
        title: "Site Monitoring",
        description: "Proactive NVR health checks via ping/HTTP. Know about issues before your clients call you."
    }
];

const testimonials = [
    {
        name: "Rajesh Kumar",
        role: "Owner, SecureVision Systems",
        content: "OnTru transformed our chaotic operations into a well-oiled machine. We've reduced project delays by 60% and our technicians love the mobile app.",
        image: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=10b981&color=fff"
    },
    {
        name: "Priya Sharma",
        role: "Manager, Eagle Eye Security",
        content: "The AMC management alone has saved us lakhs in missed renewals. Professional invoices impress our clients and payments come faster.",
        image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=8b5cf6&color=fff"
    },
    {
        name: "Mohammed Ismail",
        role: "CEO, Guardian Tech Solutions",
        content: "From 20 installations a month to 60 - and we're more organized than ever. OnTru is the backbone of our growing business.",
        image: "https://ui-avatars.com/api/?name=Mohammed+Ismail&background=3b82f6&color=fff"
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
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMCAwaDFNNDAgMGgxTTAgNDBoMU00MCA0MGgxIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-40"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-sm mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        <span className="text-sm font-medium text-primary-300">India's #1 CCTV Business Management Platform</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6">
                        Run Your CCTV Business
                        <span className="block mt-2 bg-gradient-to-r from-primary-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Like Never Before
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl text-slate-300 mb-10 leading-relaxed">
                        The all-in-one platform that helps CCTV dealers manage projects, inventory, technicians, billing, and AMCs from a single powerful dashboard.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <a
                            href="https://app.ontru.in/register"
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-1"
                        >
                            Start 14-Day Free Trial
                            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                        <a
                            href="https://app.ontru.in/login"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300"
                        >
                            Sign In
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-primary-500/30 transition-colors">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-400">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 text-sm font-semibold text-primary-600 bg-primary-50 rounded-full mb-4">
                            POWERFUL FEATURES
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                            Everything You Need to Scale
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                            Built specifically for CCTV dealers by people who understand the security installation business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/20">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof / Testimonials */}
            <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 text-sm font-semibold text-primary-600 bg-primary-50 rounded-full mb-4">
                            TESTIMONIALS
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                            Loved by 150+ Dealers
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                            See why CCTV professionals across India trust OnTru to run their business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} />)}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"{testimonial.content}"</p>
                                <div className="flex items-center gap-4">
                                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                                        <div className="text-sm text-slate-500">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-24 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 text-sm font-semibold text-primary-600 bg-primary-50 rounded-full mb-4">
                            SIMPLE PRICING
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                            Start Free. Scale as You Grow.
                        </h2>
                    </div>

                    <div className="max-w-lg mx-auto bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-1">
                        <div className="bg-white dark:bg-slate-900 rounded-[22px] p-8">
                            <div className="text-center mb-8">
                                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Starter Plan</span>
                                <div className="mt-4 flex items-baseline justify-center gap-2">
                                    <span className="text-5xl font-extrabold text-slate-900 dark:text-white">₹0</span>
                                    <span className="text-slate-500">/month</span>
                                </div>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">Perfect to get started</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {["Up to 25 Projects", "5 Technicians", "Basic Inventory", "Standard Invoices", "Email Support"].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <CheckIcon />
                                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://app.ontru.in/register"
                                className="block w-full py-4 px-6 text-center text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                            >
                                Get Started Free
                            </a>
                        </div>
                    </div>

                    <p className="text-center mt-8 text-slate-500">
                        Need more? Check our <Link to="/pricing" className="text-primary-600 hover:underline">Professional & Enterprise plans</Link>
                    </p>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-xl text-primary-200 mb-10 max-w-2xl mx-auto">
                        Join hundreds of successful CCTV dealers who have streamlined their operations with OnTru.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://app.ontru.in/register"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-primary-900 bg-white rounded-xl hover:bg-primary-50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            Start Your Free Trial
                        </a>
                        <a
                            href="mailto:info@softwarelicensehub.in"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all"
                        >
                            Contact Sales
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <div className="text-2xl font-bold text-white mb-4">OnTru</div>
                            <p className="text-slate-400 mb-4 max-w-md">
                                India's leading CCTV business management platform. Streamline your operations, boost productivity, and scale with confidence.
                            </p>
                            <p className="text-sm text-slate-500">
                                A product of <span className="text-primary-400">Software License Hub</span>
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                                <li><a href="https://app.ontru.in/login" className="hover:text-white transition-colors">Sign In</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <span className="text-primary-400">📧</span>
                                    <a href="mailto:info@softwarelicensehub.in" className="hover:text-white transition-colors">info@softwarelicensehub.in</a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-primary-400">📱</span>
                                    <span>+91 7777 955 344</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-primary-400">📱</span>
                                    <span>+91 7777 997 309</span>
                                </li>
                                <li className="flex items-center gap-2 mt-4 text-xs">
                                    <span className="text-primary-400">📍</span>
                                    <span>Ahmedabad, Gujarat</span>
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
        </div>
    );
};

export default HomePage;
