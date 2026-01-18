
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
        <div className="flex flex-col min-h-screen bg-slate-950">
            {/* Premium Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-slate-950/95 backdrop-blur-xl border-b border-white/5'
                : 'bg-transparent'
                }`}>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo - Left */}
                        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
                            <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none">
                                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white">OnTru</span>
                        </Link>

                        {/* Navigation - Center */}
                        <nav className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                            <div className="flex items-center gap-1">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        className={({ isActive }) => `
                                            px-4 py-2 text-sm font-medium transition-colors
                                            ${isActive
                                                ? 'text-white'
                                                : 'text-slate-400 hover:text-white'
                                            }
                                        `}
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                        </nav>

                        {/* CTA Buttons - Right */}
                        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                            <a
                                href="https://app.ontru.in/login"
                                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                            >
                                Sign In
                            </a>
                            <a
                                href="https://app.ontru.in/register"
                                className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-400 transition-colors"
                            >
                                Get Started
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
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
                    <div className="bg-slate-900 border-t border-white/5 py-4 px-6">
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) => `
                                        px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                        ${isActive ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                            <hr className="my-2 border-white/5" />
                            <a href="https://app.ontru.in/login" className="px-4 py-3 text-sm font-medium text-slate-400 hover:text-white rounded-lg">
                                Sign In
                            </a>
                            <a href="https://app.ontru.in/register" className="mx-2 mt-2 py-3 text-sm font-semibold text-white text-center bg-teal-500 rounded-lg">
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
            <footer className="bg-slate-900 border-t border-white/5 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none">
                                        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-white">OnTru</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                India's #1 CCTV business management platform.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><a href="https://app.ontru.in" className="hover:text-white transition-colors">Demo</a></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
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

                    {/* Bottom Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
                        <p className="text-xs text-slate-500">© 2025 OnTru by Software License Hub. GSTIN: 24AFKFS3394E1ZT</p>
                        <p className="text-xs text-slate-500">Ahmedabad, Gujarat, India</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;

