import React from 'react';
import { Link } from 'react-router-dom';

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
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                        About <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">OnTru</span>
                    </h1>
                    <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
                        Empowering CCTV businesses with technology built specifically for the security installation industry.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-white">
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
            <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700">
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
        </>
    );
};

export default AboutPage;
