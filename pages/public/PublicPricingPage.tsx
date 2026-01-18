import React from 'react';
import { Link } from 'react-router-dom';

const CheckIcon = () => (
    <svg className="w-5 h-5 text-teal-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const CrossIcon = () => (
    <svg className="w-5 h-5 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                        Simple, Transparent <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Pricing</span>
                    </h1>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        Start free. Upgrade as you grow. No hidden fees.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative rounded-3xl overflow-hidden flex flex-col border-2 transition-all ${plan.recommended
                                        ? 'border-teal-500 shadow-xl shadow-teal-500/10'
                                        : 'border-slate-200 hover:border-teal-300'
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full">
                                        POPULAR
                                    </div>
                                )}
                                <div className="p-8 text-center border-b border-slate-100">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                                    <p className="text-sm text-slate-500 mb-6">{plan.description}</p>
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                                        <span className="text-slate-500 ml-1">{plan.period}</span>
                                    </div>
                                    <a
                                        href="https://app.ontru.in/register"
                                        className={`mt-8 block w-full py-3.5 px-6 rounded-xl font-semibold transition-all ${plan.recommended
                                                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-md shadow-teal-500/20'
                                                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                            }`}
                                    >
                                        Start Free Trial
                                    </a>
                                </div>
                                <div className="p-8 flex-1 bg-slate-50/50">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3">
                                                {feature.included ? <CheckIcon /> : <CrossIcon />}
                                                <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
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

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Need a Custom Plan?
                    </h2>
                    <p className="text-lg text-teal-100 mb-10">
                        Contact us for enterprise solutions tailored to your specific requirements.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-white text-teal-600 rounded-xl hover:bg-teal-50 transition-all shadow-lg"
                    >
                        Contact Sales
                    </Link>
                </div>
            </section>
        </>
    );
};

export default PublicPricingPage;
