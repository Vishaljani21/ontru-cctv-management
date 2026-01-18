
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Premium Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-white shadow-xl shadow-slate-900/5 border-b border-slate-100'
                    : 'bg-slate-900/80 backdrop-blur-md'
                }`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-teal-500/25 transition-all">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none">
                                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                                </svg>
                            </div>
                            <span className={`text-xl font-bold transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                                OnTru
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        px-4 py-2 text-sm font-medium rounded-lg transition-all
                                        ${scrolled
                                            ? isActive
                                                ? 'text-teal-600 bg-teal-50'
                                                : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                                            : isActive
                                                ? 'text-white bg-white/15'
                                                : 'text-slate-300 hover:text-white hover:bg-white/10'
                                        }
                                    `}
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <a
                                href="https://app.ontru.in/login"
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${scrolled
                                        ? 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                Sign In
                            </a>
                            <a
                                href="https://app.ontru.in/register"
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg hover:shadow-teal-500/25"
                            >
                                Get Started
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled
                                    ? 'text-slate-700 hover:bg-slate-100'
                                    : 'text-white hover:bg-white/10'
                                }`}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-80' : 'max-h-0'}`}>
                    <div className="bg-white border-t border-slate-100 py-4 px-6 shadow-lg">
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) => `
                                        px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                        ${isActive ? 'text-teal-600 bg-teal-50' : 'text-slate-700 hover:bg-slate-50'}
                                    `}
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                            <hr className="my-2 border-slate-100" />
                            <a href="https://app.ontru.in/login" className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                                Sign In
                            </a>
                            <a href="https://app.ontru.in/register" className="mx-2 mt-2 py-3 text-sm font-semibold text-white text-center bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-md">
                                Get Started
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none">
                                        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-white">OnTru</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                India's #1 CCTV business management platform.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link to="/" className="hover:text-teal-400 transition-colors">Features</Link></li>
                                <li><Link to="/pricing" className="hover:text-teal-400 transition-colors">Pricing</Link></li>
                                <li><a href="https://app.ontru.in" className="hover:text-teal-400 transition-colors">Demo</a></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link to="/about" className="hover:text-teal-400 transition-colors">About</Link></li>
                                <li><Link to="/contact" className="hover:text-teal-400 transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li>
                                    <a href="mailto:info@softwarelicensehub.in" className="hover:text-teal-400 transition-colors">
                                        info@softwarelicensehub.in
                                    </a>
                                </li>
                                <li>+91 7777 955 344</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800 gap-4">
                        <p className="text-xs text-slate-500">© 2025 OnTru by Software License Hub. GSTIN: 24AFKFS3394E1ZT</p>
                        <p className="text-xs text-slate-500">Ahmedabad, Gujarat, India</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
