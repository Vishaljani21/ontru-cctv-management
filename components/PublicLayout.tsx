
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { OnTruFullLogo } from './icons';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header - Sticky with glass effect */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none">
                                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                                </svg>
                            </div>
                            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">OnTru</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}>Home</NavLink>
                            <NavLink to="/about" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}>About Us</NavLink>
                            <NavLink to="/pricing" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}>Pricing</NavLink>
                            <NavLink to="/contact" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}>Contact</NavLink>
                        </nav>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <a href="https://app.ontru.in/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
                                Sign In
                            </a>
                            <a href="https://app.ontru.in/register" className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all">
                                Get Started Free
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4">
                        <nav className="flex flex-col space-y-3">
                            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 hover:text-primary-600">Home</NavLink>
                            <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 hover:text-primary-600">About Us</NavLink>
                            <NavLink to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 hover:text-primary-600">Pricing</NavLink>
                            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 hover:text-primary-600">Contact</NavLink>
                            <hr className="border-slate-100" />
                            <a href="https://app.ontru.in/login" className="text-sm font-medium text-slate-700 hover:text-primary-600">Sign In</a>
                            <a href="https://app.ontru.in/register" className="w-full py-2.5 text-center text-sm font-bold text-white bg-primary-600 rounded-lg">Get Started Free</a>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content with padding for fixed header */}
            <main className="flex-grow pt-16">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none">
                                        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="4" fill="currentColor" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold text-white">OnTru</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                India's #1 platform for CCTV dealers. Manage projects, inventory, technicians, and billing from one dashboard.
                            </p>
                        </div>

                        {/* Product Links */}
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
                                <li><a href="https://app.ontru.in/register" className="text-slate-400 hover:text-white transition-colors">Sign Up</a></li>
                                <li><a href="https://app.ontru.in/login" className="text-slate-400 hover:text-white transition-colors">Login</a></li>
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Us</h4>
                            <div className="space-y-3 text-sm text-slate-400">
                                <p className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Gujarat, India
                                </p>
                                <p className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-primary-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    support@ontru.in
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">© 2025 OnTru. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
