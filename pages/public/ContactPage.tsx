import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                        Get in <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Touch</span>
                    </h1>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        Have questions about our platform? Want a demo? We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 bg-white">
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
        </>
    );
};

export default ContactPage;
