import React from 'react';
import { Link } from 'react-router-dom';

const CheckIcon = () => (
    <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon = () => (
    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const plans = [
    {
        name: 'Starter',
        price: '₹999',
        period: '/month',
        description: 'Perfect for small dealers just getting started',
        features: [
            { name: 'Up to 50 Projects', included: true },
            { name: '10 Technicians', included: true },
            { name: 'Customer Management', included: true },
            { name: 'Basic Inventory', included: true },
            { name: 'Standard Invoicing', included: true },
            { name: 'AMC Management', included: false },
            { name: 'Site Health Monitoring', included: false },
            { name: 'Priority Support', included: false },
        ],
        cta: 'Start Free Trial',
        popular: false
    },
    {
        name: 'Professional',
        price: '₹2,499',
        period: '/month',
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
        ],
        cta: 'Start Free Trial',
        popular: true
    },
    {
        name: 'Enterprise',
        price: '₹4,999',
        period: '/month',
        description: 'For large-scale operations and teams',
        features: [
            { name: 'Unlimited Projects', included: true },
            { name: 'Unlimited Technicians', included: true },
            { name: 'Customer Management', included: true },
            { name: 'Multi-Godown Inventory', included: true },
            { name: 'GST Invoicing', included: true },
            { name: 'AMC Management', included: true },
            { name: 'Site Health Monitoring', included: true },
            { name: 'Dedicated Support', included: true },
        ],
        cta: 'Contact Sales',
        popular: false
    }
];

const faqs = [
    {
        q: "Can I try before I buy?",
        a: "Absolutely! All plans come with a 14-day free trial. No credit card required."
    },
    {
        q: "Can I change plans later?",
        a: "Yes, you can upgrade or downgrade your plan at any time from your dashboard."
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI, and bank transfers for annual plans."
    },
    {
        q: "Is there a setup fee?",
        a: "No, there are no setup fees or hidden charges. You only pay for your subscription."
    }
];

const PublicPricingPage: React.FC = () => {
    return (
        <div className="bg-slate-950">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[120px]"></div>
                <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px]"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <span className="text-sm font-medium text-teal-400">Pricing</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                        Simple pricing,
                        <span className="block bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                            powerful features
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
                        Start free. Upgrade as you grow. No hidden fees, no surprises.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${plan.popular
                                    ? 'bg-gradient-to-b from-teal-500/10 to-slate-900 border-2 border-teal-500/50 scale-[1.02] shadow-2xl shadow-teal-500/10'
                                    : 'bg-slate-900/80 border border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400"></div>
                                )}

                                <div className="p-8">
                                    {plan.popular && (
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-semibold mb-4">
                                            MOST POPULAR
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-sm text-slate-400 mb-6">{plan.description}</p>

                                    <div className="flex items-baseline gap-1 mb-8">
                                        <span className="text-5xl font-bold text-white">{plan.price}</span>
                                        <span className="text-slate-400">{plan.period}</span>
                                    </div>

                                    <a
                                        href={plan.name === 'Enterprise' ? '/contact' : 'https://app.ontru.in/register'}
                                        className={`block w-full py-3.5 px-6 rounded-xl font-semibold text-center transition-all ${plan.popular
                                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-400 hover:to-teal-500 shadow-lg shadow-teal-500/25'
                                            : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        {plan.cta}
                                    </a>

                                    <a href="tel:+917777955344" className="block text-center mt-3 text-sm font-medium text-slate-400 hover:text-teal-400 transition-colors">
                                        <span className="mr-1">📞</span> Call: +91 7777 955 344
                                    </a>
                                </div>

                                <div className="p-8 pt-0 flex-1">
                                    <div className="pt-6 border-t border-white/5">
                                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">What's included</div>
                                        <ul className="space-y-4">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-3">
                                                    {feature.included ? <CheckIcon /> : <CrossIcon />}
                                                    <span className={feature.included ? 'text-slate-300' : 'text-slate-600'}>
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

                    <p className="text-center mt-10 text-slate-500 text-sm">
                        All plans include 14-day free trial • No credit card required • Cancel anytime
                    </p>
                </div>
            </section >

            {/* FAQ Section */}
            < section className="py-24 bg-slate-900/50" >
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Frequently asked questions
                        </h2>
                        <p className="text-slate-400">
                            Everything you need to know about our pricing
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-slate-900/80 border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                                <p className="text-slate-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="py-24" >
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Need a custom solution?
                    </h2>
                    <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                        Let's discuss enterprise solutions tailored to your specific requirements.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-400 hover:to-teal-500 transition-all shadow-lg shadow-teal-500/25"
                    >
                        Contact Sales
                        <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </section >
        </div >
    );
};

export default PublicPricingPage;
