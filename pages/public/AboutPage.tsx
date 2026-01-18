import React from 'react';
import { Link } from 'react-router-dom';

const values = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        title: "Innovation First",
        description: "We constantly push boundaries to deliver cutting-edge solutions for the security industry."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        title: "Customer Success",
        description: "Your growth is our priority. We provide dedicated support and continuous platform improvements."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: "Trust & Security",
        description: "Enterprise-grade security protocols ensure complete data privacy and 99.9% uptime."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: "Performance",
        description: "Lightning-fast platform built for scale, handling thousands of operations daily without lag."
    }
];

const stats = [
    { value: "500+", label: "Active Projects", color: "from-teal-400 to-emerald-400" },
    { value: "150+", label: "Happy Dealers", color: "from-blue-400 to-cyan-400" },
    { value: "12,000+", label: "Cameras Managed", color: "from-violet-400 to-purple-400" },
    { value: "99.9%", label: "Uptime", color: "from-orange-400 to-amber-400" }
];

const AboutPage: React.FC = () => {
    return (
        <div className="bg-slate-950">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[100px]"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <span className="text-sm font-medium text-teal-400">Our Story</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
                        We're building the future of
                        <span className="block bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            CCTV business management
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
                        OnTru was founded with a single mission: to give CCTV dealers the same powerful tools
                        that enterprise companies use, without the complexity or cost.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center p-6">
                                <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                                Built by industry experts,<br />
                                <span className="text-slate-400">for industry experts</span>
                            </h2>

                            <div className="space-y-6 text-slate-400 leading-relaxed">
                                <p>
                                    We understand that managing inventory, technicians, projects, and customer
                                    relationships can be overwhelming using spreadsheets and traditional methods.
                                    That's why we built OnTru.
                                </p>
                                <p>
                                    Our platform combines project management, CRM, inventory tracking, and billing
                                    into a single, cohesive ecosystem. This allows business owners to focus on
                                    what matters most: growth and customer satisfaction.
                                </p>
                                <p>
                                    Today, OnTru powers hundreds of CCTV businesses across India, helping them
                                    manage thousands of cameras and installations with unprecedented efficiency.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
                            <div className="relative bg-slate-900/80 border border-white/10 rounded-3xl p-10 backdrop-blur-sm">
                                <div className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-4">Our Vision</div>
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    The operational backbone for security integrators
                                </h3>
                                <p className="text-slate-400 mb-8 leading-relaxed">
                                    To be the leading operational backbone for security system integrators globally,
                                    fostering efficiency and transparency across the entire industry.
                                </p>
                                <div className="pt-6 border-t border-white/10">
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">A Product By</div>
                                    <div className="text-lg font-semibold text-white mb-1">Software License Hub</div>
                                    <p className="text-sm text-slate-500">GSTIN: 24AFKFS3394E1ZT</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            What drives us forward
                        </h2>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto">
                            Core principles that guide every decision we make
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => (
                            <div
                                key={idx}
                                className="group p-8 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-teal-500/30 hover:bg-slate-900 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-500/5 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                                    {value.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-3">{value.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to transform your business?
                    </h2>
                    <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                        Join hundreds of successful CCTV dealers who have streamlined their operations with OnTru.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://app.ontru.in/register"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-400 hover:to-teal-500 transition-all shadow-lg shadow-teal-500/25"
                        >
                            Start Free Trial
                            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-white/20 rounded-xl hover:bg-white/5 transition-all"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
