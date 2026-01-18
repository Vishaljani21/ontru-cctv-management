import React from 'react';
import { Link } from 'react-router-dom';

// Premium Header Component
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
                <Link to="/about" className="text-sm text-white font-medium">About</Link>
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

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-600/20 via-fuchsia-600/10 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
                        <span className="text-white">About </span>
                        <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">OnTru</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Empowering CCTV businesses with technology built specifically for the security installation industry.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: "500+", label: "Active Projects" },
                            { value: "150+", label: "Happy Dealers" },
                            { value: "12,000+", label: "Cameras Managed" },
                            { value: "99.9%", label: "Uptime" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-gradient-to-b from-black to-gray-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="text-sm text-violet-400 font-medium mb-4">OUR STORY</div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                Built by Industry Experts
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
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
                        <div className="bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent p-px rounded-3xl">
                            <div className="bg-gray-950 rounded-3xl p-10">
                                <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    To be the leading operational backbone for security system integrators globally,
                                    fostering efficiency and transparency in the industry.
                                </p>
                                <div className="pt-6 border-t border-white/10">
                                    <div className="text-sm text-violet-400 font-medium mb-2">A Product By</div>
                                    <div className="text-xl font-bold text-white mb-1">Software License Hub</div>
                                    <p className="text-sm text-gray-500">GSTIN: 24AFKFS3394E1ZT</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            What Drives Us
                        </h2>
                        <p className="text-lg text-gray-400">
                            Core principles that guide everything we do.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => (
                            <div
                                key={idx}
                                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all"
                            >
                                <div className="text-4xl mb-6">{value.icon}</div>
                                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
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
                            Start Free Trial
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

export default AboutPage;
