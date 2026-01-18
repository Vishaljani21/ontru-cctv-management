import React from 'react';
import { Link } from 'react-router-dom';

// Premium Header Component
const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <span className="text-white font-bold text-lg">O</span>
                </div>
                <span className="text-xl font-semibold text-white">OnTru</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">Home</Link>
                <Link to="/about" className="text-sm text-gray-300 hover:text-white transition-colors">About</Link>
                <Link to="/pricing" className="text-sm text-white font-medium">Pricing</Link>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center gap-4">
                <a href="https://app.ontru.in/login" className="text-sm text-gray-300 hover:text-white transition-colors hidden sm:block">
                    Log in
                </a>
                <a href="https://app.ontru.in/register" className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-100 transition-colors">
                    Get Started
                </a>
            </div>
        </div>
    </header>
);

// Premium Footer Component
const Footer = () => (
    <footer className="bg-black text-gray-400 py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">O</span>
                        </div>
                        <span className="text-xl font-semibold text-white">OnTru</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">
                        India's #1 CCTV business management platform for modern dealers.
                    </p>
                    <p className="text-xs text-gray-600">
                        By Software License Hub
                    </p>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
                        <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
                    <ul className="space-y-3 text-sm">
                        <li>
                            <a href="mailto:info@softwarelicensehub.in" className="hover:text-white transition-colors">
                                info@softwarelicensehub.in
                            </a>
                        </li>
                        <li>+91 7777 955 344</li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
                <p className="text-xs text-gray-600">© 2025 OnTru by Software License Hub. GSTIN: 24AFKFS3394E1ZT</p>
                <p className="text-xs text-gray-600">Ahmedabad, Gujarat, India</p>
            </div>
        </div>
    </footer>
);

const CheckIcon = () => (
    <svg className="w-5 h-5 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const CrossIcon = () => (
    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const plans = [
    {
        name: 'Starter',
        price: '₹999',
        period: '/month',
        description: 'For small dealers getting started',
        features: [
            { name: 'Up to 50 Projects', included: true },
            { name: '10 Technicians', included: true },
            { name: 'Customer Management', included: true },
            { name: 'Basic Inventory', included: true },
            { name: 'Standard Invoicing', included: true },
            { name: 'AMC Management', included: false },
            { name: 'Site Health Monitoring', included: false },
            { name: 'Priority Support', included: false },
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
            { name: 'Site Health Monitoring', included: false },
            { name: 'Priority Support', included: true },
        ]
    },
    {
        name: 'Enterprise',
        price: '₹4,999',
        period: '/month',
        description: 'For large operations',
        features: [
            { name: 'Unlimited Projects', included: true },
            { name: 'Unlimited Technicians', included: true },
            { name: 'Customer Management', included: true },
            { name: 'Multi-Godown Inventory', included: true },
            { name: 'GST Invoicing', included: true },
            { name: 'AMC Management', included: true },
            { name: 'Site Health Monitoring', included: true },
            { name: 'Dedicated Support', included: true },
        ]
    }
];

const PublicPricingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-600/20 via-fuchsia-600/10 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
                        <span className="text-white">Simple, Transparent </span>
                        <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Pricing</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Start free. Upgrade as you grow. No hidden fees.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative rounded-3xl overflow-hidden flex flex-col ${plan.recommended
                                        ? 'bg-gradient-to-b from-violet-600/20 via-fuchsia-600/10 to-transparent p-px'
                                        : ''
                                    }`}
                            >
                                <div className={`h-full rounded-3xl flex flex-col ${plan.recommended
                                        ? 'bg-gray-950'
                                        : 'bg-white/5 border border-white/10'
                                    }`}>
                                    {plan.recommended && (
                                        <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium bg-violet-500 text-white rounded-full">
                                            POPULAR
                                        </div>
                                    )}
                                    <div className="p-8 text-center border-b border-white/10">
                                        <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                                        <p className="text-sm text-gray-500 mb-6">{plan.description}</p>
                                        <div className="flex items-baseline justify-center">
                                            <span className="text-5xl font-bold text-white">{plan.price}</span>
                                            <span className="text-gray-500 ml-1">{plan.period}</span>
                                        </div>
                                        <a
                                            href="https://app.ontru.in/register"
                                            className={`mt-8 block w-full py-3.5 px-6 rounded-xl font-medium transition-all ${plan.recommended
                                                    ? 'bg-white text-black hover:bg-gray-100'
                                                    : 'bg-white/10 text-white hover:bg-white/20'
                                                }`}
                                        >
                                            Start Free Trial
                                        </a>
                                    </div>
                                    <div className="p-8 flex-1">
                                        <ul className="space-y-4">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-3">
                                                    {feature.included ? <CheckIcon /> : <CrossIcon />}
                                                    <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                                                        {feature.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-center mt-12 text-gray-500">
                        All plans include 14-day free trial. No credit card required.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-b from-black to-gray-950">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Need a Custom Plan?
                    </h2>
                    <p className="text-lg text-gray-400 mb-10">
                        Contact us for enterprise solutions tailored to your specific requirements.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-medium bg-white text-black rounded-xl hover:bg-gray-100 transition-all"
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
