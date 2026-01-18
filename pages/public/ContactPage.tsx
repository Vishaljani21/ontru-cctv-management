import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <a href="/" className="text-2xl font-bold text-white">OnTru</a>
                    <nav className="hidden md:flex gap-8">
                        <a href="/" className="text-slate-300 hover:text-white transition-colors">Home</a>
                        <a href="/about" className="text-slate-300 hover:text-white transition-colors">About</a>
                        <a href="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
                        <a href="/contact" className="text-white font-medium">Contact</a>
                    </nav>
                    <a href="https://app.ontru.in/login" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium">
                        Sign In
                    </a>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 text-sm font-semibold text-primary-300 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
                            GET IN TOUCH
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                            Let's Build Something
                            <span className="block mt-2 bg-gradient-to-r from-primary-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                Amazing Together
                            </span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-300">
                            Have questions about our platform? Want a custom demo? We'd love to hear from you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="relative pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info Cards */}
                        <div className="space-y-6">
                            {/* Company Card */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-primary-500/30 transition-colors">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Company</h3>
                                        <p className="text-slate-400">SOFTWARE LICENSE HUB</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm">
                                    <span className="text-slate-500">GSTIN:</span> 24AFKFS3394E1ZT
                                </p>
                            </div>

                            {/* Address Card */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-primary-500/30 transition-colors">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Our Office</h3>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                    E-702 PNTC, Radio Mirchi Road<br />
                                    Vejalpur, Ahmedabad<br />
                                    Gujarat 380007, India
                                </p>
                            </div>

                            {/* Contact Details Card */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-primary-500/30 transition-colors">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Contact Info</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary-400">📧</span>
                                        <a href="mailto:info@softwarelicensehub.in" className="text-slate-300 hover:text-primary-400 transition-colors">
                                            info@softwarelicensehub.in
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary-400">📱</span>
                                        <div className="text-slate-300">
                                            <a href="tel:+917777955344" className="hover:text-primary-400 transition-colors">+91 7777 955 344</a>
                                            <span className="text-slate-500 mx-2">/</span>
                                            <a href="tel:+917777997309" className="hover:text-primary-400 transition-colors">+91 7777 997 309</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl">
                            {submitted ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                                    <p className="text-slate-600 dark:text-slate-400">We'll get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a Message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white"
                                                    placeholder="+91 XXXXX XXXXX"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white"
                                                placeholder="you@company.com"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                                            <textarea
                                                id="message"
                                                rows={5}
                                                required
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white resize-none"
                                                placeholder="Tell us about your project..."
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-4 px-6 text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all"
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

export default ContactPage;
