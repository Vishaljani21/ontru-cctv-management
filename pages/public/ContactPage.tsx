import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const contactInfo = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            label: "Company",
            value: "Software License Hub",
            subvalue: "GSTIN: 24AFKFS3394E1ZT"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            label: "Office",
            value: "E-702 PNTC, Radio Mirchi Road",
            subvalue: "Vejalpur, Ahmedabad, Gujarat 380007"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            label: "Email",
            value: "info@softwarelicensehub.in",
            link: "mailto:info@softwarelicensehub.in"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            label: "Phone",
            value: "+91 7777 955 344",
            subvalue: "+91 7777 997 309"
        }
    ];

    return (
        <div className="bg-slate-950">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <span className="text-sm font-medium text-teal-400">Contact Us</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                        Let's start a
                        <span className="block bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                            conversation
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
                        Have questions about our platform? Want a personalized demo?
                        We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {contactInfo.map((item, idx) => (
                                <div key={idx} className="p-6 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-500/5 flex items-center justify-center text-teal-400 flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{item.label}</div>
                                            {item.link ? (
                                                <a href={item.link} className="text-white font-medium hover:text-teal-400 transition-colors">
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <div className="text-white font-medium">{item.value}</div>
                                            )}
                                            {item.subvalue && (
                                                <div className="text-sm text-slate-400 mt-1">{item.subvalue}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Response Time */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 to-slate-900 border border-teal-500/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse"></div>
                                    <span className="text-sm font-medium text-teal-400">Typically replies within 2 hours</span>
                                </div>
                                <p className="text-sm text-slate-400">
                                    Our team is available Monday to Saturday, 10:00 AM - 7:00 PM IST.
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <div className="p-8 rounded-2xl bg-slate-900/80 border border-white/10">
                                {submitted ? (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Message sent!</h3>
                                        <p className="text-slate-400">We'll get back to you within 24 hours.</p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
                                        <p className="text-slate-400 mb-8">Fill out the form below and we'll be in touch soon.</p>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-white placeholder-slate-500"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">Company</label>
                                                    <input
                                                        type="text"
                                                        id="company"
                                                        value={formData.company}
                                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-white placeholder-slate-500"
                                                        placeholder="Your Company"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-white placeholder-slate-500"
                                                        placeholder="you@company.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-white placeholder-slate-500"
                                                        placeholder="+91 98765 43210"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
                                                <textarea
                                                    id="message"
                                                    rows={5}
                                                    required
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-white placeholder-slate-500 resize-none"
                                                    placeholder="Tell us about your project and requirements..."
                                                ></textarea>
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full py-4 px-6 text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-400 hover:to-teal-500 transition-all shadow-lg shadow-teal-500/25"
                                            >
                                                Send Message
                                                <svg className="inline-block ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
