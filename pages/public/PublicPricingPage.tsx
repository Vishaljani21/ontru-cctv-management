import React from 'react';
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
                <Link to="/pricing" className="text-primary-600 font-medium">Pricing</Link>
                <Link to="/contact" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Contact</Link>
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

const CheckIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const plans = [
    {
        name: 'Starter',
        price: '₹999',
        period: '/month',
        description: 'Perfect for small dealers getting started',
        features: [
            { name: 'Up to 50 Projects', included: true },
            { name: '10 Technicians', included: true },
            { name: 'Customer Management', included: true },
            { name: 'Basic Inventory', included: true },
            { name: 'Standard Invoicing', included: true },
            { name: 'AMC Management', included: false },
            { name: 'Warranty Tracker', included: false },
            { name: 'Site Health Monitoring', included: false },
        ]
    },
    {
        name: 'Professional',
        price: '₹2,499',
        period: '/month',
        recommended: true,
        description: 'Most popular for growing businesses',
        features: [
            { name: 'Unlimited Projects', included: true },
            { name: '25 Technicians', included: true },
            { name: 'Customer Management', included: true },
            { name: 'Advanced Inventory', included: true },
            { name: 'GST Invoicing', included: true },
            { name: 'AMC Management', included: true },
            { name: 'Warranty Tracker', included: true },
            { name: 'Site Health Monitoring', included: false },
        ]
    },
    {
        name: 'Enterprise',
        price: '₹4,999',
        period: '/month',
        description: 'For large operations with advanced needs',
        features: [
            { name: 'Unlimited Projects', included: true },
            { name: 'Unlimited Technicians', included: true },
            { name: 'Customer Management', included: true },
            { name: 'Multi-Godown Inventory', included: true },
            { name: 'GST Invoicing', included: true },
            { name: 'AMC Management', included: true },
            { name: 'Warranty Tracker', included: true },
            { name: 'Site Health Monitoring', included: true },
        ]
    }
];

const PublicPricingPage: React.FC = () => {
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
                        PRICING
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
                        Simple, Transparent
                        <span className="block mt-2 text-primary-600">Pricing</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-600">
                        Choose the plan that fits your business. Start free and upgrade as you grow.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative bg-white rounded-3xl overflow-hidden border-2 flex flex-col transition-all duration-300 hover:shadow-xl ${plan.recommended
                                        ? 'border-primary-500 shadow-lg shadow-primary-500/10'
                                        : 'border-slate-200 hover:border-primary-300'
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                                        MOST POPULAR
                                    </div>
                                )}
                                <div className="p-8 text-center border-b border-slate-100">
                                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{plan.description}</p>
                                    <div className="mt-6 flex items-baseline justify-center">
                                        <span className="text-5xl font-extrabold text-slate-900">{plan.price}</span>
                                        <span className="text-slate-500 ml-1">{plan.period}</span>
                                    </div>
                                    <a
                                        href="https://app.ontru.in/register"
                                        className={`mt-8 block w-full py-3.5 px-6 rounded-xl font-semibold transition-all ${plan.recommended
                                                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25'
                                                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                                            }`}
                                    >
                                        Start Free Trial
                                    </a>
                                </div>
                                <div className="p-8 flex-1 bg-slate-50/50">
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">What's included:</p>
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center">
                                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${feature.included
                                                        ? 'bg-primary-100 text-primary-600'
                                                        : 'bg-slate-100 text-slate-400'
                                                    }`}>
                                                    {feature.included ? <CheckIcon /> : <CrossIcon />}
                                                </div>
                                                <span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                                                    {feature.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-center mt-12 text-slate-500">
                        All plans include 14-day free trial. No credit card required.
                    </p>
                </div>
            </section>

            {/* FAQ / CTA */}
            <section className="py-24 bg-primary-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                        Need a Custom Plan?
                    </h2>
                    <p className="text-xl text-primary-100 mb-10">
                        Contact us for enterprise solutions tailored to your specific requirements.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-xl hover:bg-primary-50 shadow-lg transition-all hover:-translate-y-0.5"
                    >
                        Contact Sales
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PublicPricingPage;
