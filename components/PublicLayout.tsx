
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header - Transparent to Glass on scroll */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/50'
                    : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                <div className="relative w-11 h-11 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none">
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                                    </svg>
                                </div>
                            </div>
                            <span className={`text-2xl font-extrabold tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                                OnTru
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {['Home', 'About Us', 'Pricing', 'Contact'].map((item) => {
                                const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-').replace('-us', '')}`;
                                return (
                                    <NavLink
                                        key={item}
                                        to={path}
                                        className={({ isActive }) => `
                                            px-4 py-2 rounded-lg text-sm font-medium transition-all
                                            ${isActive
                                                ? scrolled ? 'text-primary-600 bg-primary-50' : 'text-white bg-white/10'
                                                : scrolled ? 'text-slate-600 hover:text-primary-600 hover:bg-slate-50' : 'text-white/80 hover:text-white hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        {item}
                                    </NavLink>
                                );
                            })}
                        </nav>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            <a
                                href="https://app.ontru.in/login"
                                className={`px-4 py-2 text-sm font-semibold transition-colors ${scrolled ? 'text-slate-700 hover:text-primary-600' : 'text-white/90 hover:text-white'
                                    }`}
                            >
                                Sign In
                            </a>
                            <a
                                href="https://app.ontru.in/register"
                                className="group relative px-6 py-2.5 text-sm font-bold text-white overflow-hidden rounded-full"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 bg-[length:200%_100%] animate-gradient-x"></div>
                                <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="relative flex items-center gap-2">
                                    Get Started Free
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-white'
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
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-white/95 backdrop-blur-xl border-t border-slate-100 py-4 px-4 shadow-lg">
                        <nav className="flex flex-col space-y-1">
                            {['Home', 'About Us', 'Pricing', 'Contact'].map((item) => {
                                const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-').replace('-us', '')}`;
                                return (
                                    <NavLink
                                        key={item}
                                        to={path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    >
                                        {item}
                                    </NavLink>
                                );
                            })}
                            <hr className="my-2 border-slate-100" />
                            <a href="https://app.ontru.in/login" className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-lg">Sign In</a>
                            <a href="https://app.ontru.in/register" className="mx-4 mt-2 py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/25">
                                Get Started Free
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Premium Footer */}
            <footer className="relative bg-slate-900 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none">
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold text-white">OnTru</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
                                India's leading platform for CCTV dealers. Manage your entire business from projects to payments in one powerful dashboard.
                            </p>
                            {/* Social Links */}
                            <div className="flex gap-4">
                                {['twitter', 'linkedin', 'youtube'].map((social) => (
                                    <a key={social} href="#" className="w-10 h-10 bg-slate-800 hover:bg-primary-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all hover:-translate-y-1">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            {social === 'twitter' && <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />}
                                            {social === 'linkedin' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}
                                            {social === 'youtube' && <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />}
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Product</h4>
                            <ul className="space-y-4">
                                {[{ name: 'Features', href: '/#features' }, { name: 'Pricing', href: '/pricing' }, { name: 'Demo', href: 'https://app.ontru.in' }].map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-slate-400 hover:text-primary-400 transition-colors text-sm">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Company</h4>
                            <ul className="space-y-4">
                                {[{ name: 'About', href: '/about' }, { name: 'Contact', href: '/contact' }, { name: 'Careers', href: '#' }].map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.href} className="text-slate-400 hover:text-primary-400 transition-colors text-sm">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Support</h4>
                            <ul className="space-y-4">
                                {[{ name: 'Help Center', href: '#' }, { name: 'Terms', href: '#' }, { name: 'Privacy', href: '#' }].map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-slate-400 hover:text-primary-400 transition-colors text-sm">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">© 2025 OnTru. Made with ❤️ in India</p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                            All systems operational
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
