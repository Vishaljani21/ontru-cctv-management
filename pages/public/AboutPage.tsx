import React from 'react';

const AboutPage: React.FC = () => {
    const values = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            title: "Innovation First",
            description: "We constantly push boundaries to deliver cutting-edge solutions for the security industry."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: "Customer Success",
            description: "Your growth is our priority. We provide dedicated support and continuous improvements."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "Trust & Security",
            description: "Enterprise-grade security with complete data privacy and reliable uptime."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <a href="/" className="text-2xl font-bold text-white">OnTru</a>
                    <nav className="hidden md:flex gap-8">
                        <a href="/" className="text-slate-300 hover:text-white transition-colors">Home</a>
                        <a href="/about" className="text-white font-medium">About</a>
                        <a href="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
                        <a href="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</a>
                    </nav>
                    <a href="https://app.ontru.in/login" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium">
                        Sign In
                    </a>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block px-4 py-1 text-sm font-semibold text-primary-300 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
                        ABOUT ONTRU
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                        Empowering CCTV Businesses
                        <span className="block mt-2 bg-gradient-to-r from-primary-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            with Technology
                        </span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-slate-300 leading-relaxed">
                        We understand the challenges of running a CCTV business. OnTru was built specifically to help
                        security system integrators manage their operations seamlessly, from project management to
                        inventory tracking, billing, and beyond.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-primary-500/30 transition-colors">
                                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-slate-400 text-sm uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-block px-4 py-1 text-sm font-semibold text-primary-300 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
                                OUR STORY
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                Built by Industry Experts
                            </h2>
                            <div className="space-y-4 text-slate-300 leading-relaxed">
                                <p>
                                    OnTru was founded with a simple mission: to simplify the complex operations of CCTV dealers
                                    and system integrators. We understand that managing inventory, technicians, projects, and
                                    customer relationships can be overwhelming using traditional methods like paper and spreadsheets.
                                </p>
                                <p>
                                    Our platform is built specifically for the security surveillance industry. We combine project
                                    management, CRM, inventory tracking, and billing into a single, cohesive ecosystem. This allows
                                    business owners to focus on growth rather than getting bogged down in administrative tasks.
                                </p>
                                <p>
                                    Today, OnTru powers hundreds of CCTV businesses across India, helping them manage thousands
                                    of cameras and installations with unprecedented efficiency.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-3xl p-8">
                                <h3 className="text-xl font-bold text-white mb-6">Our Vision</h3>
                                <p className="text-slate-300 mb-6 leading-relaxed">
                                    To be the leading operational backbone for security system integrators globally,
                                    fostering efficiency and transparency in the industry.
                                </p>
                                <div className="border-t border-white/10 pt-6">
                                    <h4 className="text-lg font-semibold text-primary-400 mb-4">A Product By</h4>
                                    <div className="text-white font-bold text-xl mb-2">Software License Hub</div>
                                    <p className="text-slate-400 text-sm">GSTIN: 24AFKFS3394E1ZT</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 text-sm font-semibold text-primary-300 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
                            OUR VALUES
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            What Drives Us
                        </h2>
                        <p className="max-w-2xl mx-auto text-slate-400">
                            These core principles guide everything we do at OnTru.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, idx) => (
                            <div
                                key={idx}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-primary-500/30 hover:-translate-y-1 transition-all"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20">
                                    {value.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-xl text-primary-200 mb-10">
                        Join hundreds of successful CCTV dealers who have streamlined their operations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://app.ontru.in/register"
                            className="px-8 py-4 text-lg font-bold text-primary-900 bg-white rounded-xl hover:bg-primary-50 shadow-lg transition-all hover:-translate-y-1"
                        >
                            Start Free Trial
                        </a>
                        <a
                            href="/contact"
                            className="px-8 py-4 text-lg font-medium text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all"
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
                                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm">
                                <li>info@softwarelicensehub.in</li>
                                <li>+91 7777 955 344</li>
                                <li>+91 7777 997 309</li>
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

export default AboutPage;
