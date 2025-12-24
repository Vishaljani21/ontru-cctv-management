
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { OnTruFullLogo } from './icons';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <OnTruFullLogo />
                        </Link>
                        <nav className="hidden md:flex space-x-8">
                            <NavLink to="/" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}>Home</NavLink>
                            <NavLink to="/about" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}>About Us</NavLink>
                            <NavLink to="/pricing" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}>Pricing</NavLink>
                            <NavLink to="/contact" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}>Contact Us</NavLink>
                        </nav>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900">Sign In</Link>
                            <Link to="/register" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">Get Started</Link>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-slate-900 text-slate-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <span className="text-2xl font-bold text-white">OnTru</span>
                            <p className="mt-4 text-sm text-slate-400">Streamlining CCTV business operations for dealers and technicians across India.</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h4>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                                <li><Link to="/register" className="hover:text-white">Sign Up</Link></li>
                                <li><Link to="/login" className="hover:text-white">Technician Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h4>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Connect</h4>
                            <p className="mt-4 text-sm">123 Tech Park, Sector 5<br/>Gujarat, India</p>
                            <p className="mt-2 text-sm">support@ontru.com</p>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm">
                        &copy; 2025 OnTru Solutions. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
