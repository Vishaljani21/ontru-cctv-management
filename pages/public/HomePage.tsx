import React from 'react';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
        title: "Project Tracking",
        description: "Manage every installation from quote to completion with visual Kanban boards and automated timelines."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        title: "Inventory Control",
        description: "Multi-godown stock management with serial number tracking for every camera, NVR, and accessory."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: "Technician Portal",
        description: "Mobile-first dashboard for field technicians with real-time job updates and smart routing."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
            </svg>
        ),
        title: "GST Billing",
        description: "Professional invoices with automated GST calculation, payment tracking, and smart reminders."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        ),
        title: "AMC Management",
        description: "Never miss a renewal. Automated reminders with complete service history and contract tracking."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        title: "Site Monitoring",
        description: "Proactive NVR health checks via ping/HTTP. Know about issues before your clients call."
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
        <div className="bg-slate-950">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                {/* Animated Gradient Orbs */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[150px] animate-pulse-glow"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[120px] animate-pulse-glow delay-200"></div>
                <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] animate-pulse-glow delay-400"></div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        <span className="text-sm font-medium text-slate-300">India's #1 CCTV Business Platform</span>
                    </div>

                    {/* Headline */}
                    <h1 className="animate-slide-up text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
                        Run your CCTV business
                        <span className="block bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            like never before
                        </span>
                    </h1>

                    <p className="animate-slide-up delay-100 max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-12 leading-relaxed">
                        The all-in-one platform for CCTV dealers. Manage projects, inventory,
                        technicians, billing, and AMCs from a single powerful dashboard.
                    </p>

                    {/* CTA Buttons */}
                    <div className="animate-slide-up delay-200 flex flex-col sm:flex-row gap-4 justify-center mb-20">
                        <a
                            href="https://app.ontru.in/register"
                            className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-400 hover:to-teal-500 transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5"
                        >
                            Start Free Trial
                            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                        <a
                            href="https://app.ontru.in/login"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-white/20 rounded-xl hover:bg-white/5 hover:-translate-y-0.5 transition-all"
                        >
                            Sign In
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {stats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="animate-scale-in p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all"
                                style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
                            >
                                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                            <span className="text-sm font-medium text-teal-400">Features</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Everything you need to scale
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Built specifically for CCTV dealers by people who understand
                            the security installation business inside and out.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group p-8 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-teal-500/30 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-500/5 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-24 bg-slate-900/50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                        <span className="text-sm font-medium text-teal-400">Pricing</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Start free, scale when ready
                    </h2>
                    <p className="text-lg text-slate-400 mb-12">
                        No credit card required. 14-day free trial on all plans.
                    </p>

                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-3xl blur-xl animate-pulse-glow"></div>
                        <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-10 max-w-md mx-auto hover:border-white/20 transition-all">
                            <div className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-3">Free Plan</div>
                            <div className="flex items-baseline justify-center gap-1 mb-4">
                                <span className="text-6xl font-bold text-white">₹0</span>
                                <span className="text-slate-400">/month</span>
                            </div>
                            <p className="text-slate-400 mb-8">Perfect to get started and explore the platform</p>

                            <ul className="text-left space-y-4 mb-10">
                                {["Up to 25 Projects", "5 Technicians", "Basic Inventory", "Standard Invoices", "Email Support"].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-300">
                                        <svg className="w-5 h-5 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="https://app.ontru.in/register"
                                className="block w-full py-4 px-6 text-center text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-400 hover:to-teal-500 transition-all shadow-lg shadow-teal-500/25 hover:-translate-y-0.5"
                            >
                                Get Started Free
                            </a>

                            <p className="mt-6 text-sm text-slate-500">
                                Need more? <Link to="/pricing" className="text-teal-400 hover:text-teal-300 font-medium">View all plans →</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to transform your business?
                    </h2>
                    <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                        Join hundreds of successful CCTV dealers who have streamlined their operations with OnTru.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://app.ontru.in/register"
                            className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-400 hover:to-teal-500 transition-all shadow-lg shadow-teal-500/25 hover:-translate-y-0.5"
                        >
                            Start Your Free Trial
                            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-white/20 rounded-xl hover:bg-white/5 hover:-translate-y-0.5 transition-all"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
