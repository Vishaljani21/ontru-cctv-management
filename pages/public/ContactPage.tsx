import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Shared Header Component
const Header = () => (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">O</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">OnTru</span>
            </Link>
            <nav className="hidden md:flex gap-8">
                <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Home</Link>
                <Link to="/about" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">About</Link>
                <Link to="/pricing" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Pricing</Link>
                <Link to="/contact" className="text-primary-600 font-medium">Contact</Link>
            </nav>
            <div className="flex items-center gap-3">
                <a href="https://app.ontru.in/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors hidden sm:block">
                    Sign In
                </a>
                <a href="https://app.ontru.in/register" className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm">
                    Get Started
                </a>
            </div>
        </div>
    </header>
);

// Shared Footer Component
const Footer = () => (
    <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">O</span>
                        </div>
                        <span className="text-2xl font-bold text-white">OnTru</span>
                    </div>
                    <p className="text-slate-400 mb-4 max-w-md leading-relaxed">
                        India's leading CCTV business management platform. Streamline your operations, boost productivity, and scale with confidence.
                    </p>
                    <p className="text-sm text-slate-500">
                        A product of <span className="text-primary-400">Software License Hub</span>
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        <li><a href="https://app.ontru.in/login" className="hover:text-white transition-colors">Sign In</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Contact</h4>
                    <ul className="space-y-3 text-sm">
                        <li>
                            <a href="mailto:info@softwarelicensehub.in" className="hover:text-white transition-colors">
                                info@softwarelicensehub.in
                            </a>
                        </li>
                        <li>+91 7777 955 344</li>
                        <li>+91 7777 997 309</li>
                        <li className="pt-2 text-xs text-slate-500">
                            E-702 PNTC, Radio Mirchi Road<br />
                            Vejalpur, Ahmedabad 380007
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
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50 py-20">
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block px-4 py-1.5 text-sm font-semibold text-primary-600 bg-primary-50 rounded-full mb-6">
                        GET IN TOUCH
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
                        Let's Build Something
                        <span className="block mt-2 text-primary-600">Amazing Together</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-600">
                        Have questions about our platform? Want a custom demo? We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            {/* Company Card */}
                            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Company</h3>
                                        <p className="text-slate-600">Software License Hub</p>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-sm">
                                    GSTIN: 24AFKFS3394E1ZT
                                </p>
                            </div>

                            {/* Address Card */}
                            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Our Office</h3>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    E-702 PNTC, Radio Mirchi Road<br />
                                    Vejalpur, Ahmedabad<br />
                                    Gujarat 380007, India
                                </p>
                            </div>

                            {/* Contact Details Card */}
                            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Contact Info</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary-600">📧</span>
                                        <a href="mailto:info@softwarelicensehub.in" className="text-slate-600 hover:text-primary-600 transition-colors">
                                            info@softwarelicensehub.in
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary-600">📱</span>
                                        <div className="text-slate-600">
                                            <a href="tel:+917777955344" className="hover:text-primary-600 transition-colors">+91 7777 955 344</a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary-600">📱</span>
                                        <div className="text-slate-600">
                                            <a href="tel:+917777997309" className="hover:text-primary-600 transition-colors">+91 7777 997 309</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                            {submitted ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                    <p className="text-slate-600">We'll get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
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
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900"
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
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900"
                                                    placeholder="+91 XXXXX XXXXX"
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
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900"
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
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 resize-none"
                                                placeholder="Tell us about your project..."
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-4 px-6 text-lg font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5"
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
