import React, { useState } from 'react';
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
                <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">About</Link>
                <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Pricing</Link>
                <Link to="/contact" className="text-sm font-medium text-slate-900 hover:text-teal-600 transition-colors">Contact</Link>
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

const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-12 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                        Get in <span className="text-teal-600">Touch</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Have questions about our platform? Want a demo? We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            {/* Company Card */}
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl">
                                        🏢
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Company</h3>
                                        <p className="text-slate-600">Software License Hub</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500">GSTIN: 24AFKFS3394E1ZT</p>
                            </div>

                            {/* Address Card */}
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl">
                                        📍
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Office</h3>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    E-702 PNTC, Radio Mirchi Road<br />
                                    Vejalpur, Ahmedabad<br />
                                    Gujarat 380007, India
                                </p>
                            </div>

                            {/* Contact Details Card */}
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                                        📞
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Contact</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-sm text-slate-500 mb-1">Email</div>
                                        <a href="mailto:info@softwarelicensehub.in" className="text-slate-900 hover:text-teal-600 font-medium transition-colors">
                                            info@softwarelicensehub.in
                                        </a>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500 mb-1">Phone</div>
                                        <div className="text-slate-900 font-medium">
                                            <a href="tel:+917777955344" className="hover:text-teal-600 transition-colors">+91 7777 955 344</a>
                                            <span className="text-slate-400 mx-2">/</span>
                                            <a href="tel:+917777997309" className="hover:text-teal-600 transition-colors">+91 7777 997 309</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
                            {submitted ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                    <p className="text-slate-600">We'll get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-900 placeholder-slate-400"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-900 placeholder-slate-400"
                                                    placeholder="+91"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-900 placeholder-slate-400"
                                                placeholder="you@company.com"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                            <textarea
                                                id="message"
                                                rows={5}
                                                required
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-900 placeholder-slate-400 resize-none"
                                                placeholder="Tell us about your project..."
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-4 px-6 text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-md shadow-teal-500/20"
                                        >
                                            Send Message
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ContactPage;
