import React, { useState } from 'react';
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
                <Link to="/about" className="text-sm text-gray-300 hover:text-white transition-colors">About</Link>
                <Link to="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</Link>
                <Link to="/contact" className="text-sm text-white font-medium">Contact</Link>
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

const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-600/20 via-fuchsia-600/10 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
                        <span className="text-white">Get in </span>
                        <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Touch</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Have questions about our platform? Want a demo? We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            {/* Company Card */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-2xl">
                                        🏢
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Company</h3>
                                        <p className="text-gray-400">Software License Hub</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    GSTIN: 24AFKFS3394E1ZT
                                </p>
                            </div>

                            {/* Address Card */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl">
                                        📍
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Office</h3>
                                </div>
                                <p className="text-gray-400 leading-relaxed">
                                    E-702 PNTC, Radio Mirchi Road<br />
                                    Vejalpur, Ahmedabad<br />
                                    Gujarat 380007, India
                                </p>
                            </div>

                            {/* Contact Details Card */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                                        📞
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Contact</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Email</div>
                                        <a href="mailto:info@softwarelicensehub.in" className="text-white hover:text-violet-400 transition-colors">
                                            info@softwarelicensehub.in
                                        </a>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Phone</div>
                                        <div className="text-white">
                                            <a href="tel:+917777955344" className="hover:text-violet-400 transition-colors">+91 7777 955 344</a>
                                            <span className="text-gray-600 mx-2">/</span>
                                            <a href="tel:+917777997309" className="hover:text-violet-400 transition-colors">+91 7777 997 309</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent p-px rounded-3xl">
                            <div className="bg-gray-950 rounded-3xl p-10 h-full">
                                {submitted ? (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                                            ✓
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                        <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-white placeholder-gray-600"
                                                        placeholder="Your name"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-white placeholder-gray-600"
                                                        placeholder="+91"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-white placeholder-gray-600"
                                                    placeholder="you@company.com"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                                <textarea
                                                    id="message"
                                                    rows={5}
                                                    required
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-white placeholder-gray-600 resize-none"
                                                    placeholder="Tell us about your project..."
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full py-4 px-6 text-base font-medium text-black bg-white rounded-xl hover:bg-gray-100 transition-all"
                                            >
                                                Send Message
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ContactPage;
