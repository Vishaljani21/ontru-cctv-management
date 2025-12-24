
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, CrossIcon } from '../../components/icons';

const plans = [
    {
        name: 'Starter',
        price: '₹999/mo',
        features: [
            { name: 'Dashboard & Projects', included: true },
            { name: 'Customer Management', included: true },
            { name: 'Inventory (Basic)', included: true },
            { name: 'Technician App', included: true },
            { name: 'Billing & Invoicing', included: false },
            { name: 'AMC Management', included: false },
            { name: 'Warranty Tracker', included: false },
            { name: 'HR & Payroll', included: false },
        ]
    },
    {
        name: 'Professional',
        price: '₹2,499/mo',
        recommended: true,
        features: [
            { name: 'Dashboard & Projects', included: true },
            { name: 'Customer Management', included: true },
            { name: 'Inventory (Advanced)', included: true },
            { name: 'Technician App', included: true },
            { name: 'Billing & Invoicing', included: true },
            { name: 'AMC Management', included: true },
            { name: 'Warranty Tracker', included: true },
            { name: 'HR & Payroll', included: false },
        ]
    },
    {
        name: 'Enterprise',
        price: '₹4,999/mo',
        features: [
            { name: 'Dashboard & Projects', included: true },
            { name: 'Customer Management', included: true },
            { name: 'Inventory (Unlimited)', included: true },
            { name: 'Technician App', included: true },
            { name: 'Billing & Invoicing', included: true },
            { name: 'AMC Management', included: true },
            { name: 'Warranty Tracker', included: true },
            { name: 'HR & Payroll', included: true },
        ]
    }
];

const PublicPricingPage: React.FC = () => {
    return (
        <div className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Simple, Transparent Pricing</h1>
                <p className="mt-4 text-xl text-slate-500">Choose the plan that fits your business needs.</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                    <div key={index} className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 flex flex-col ${plan.recommended ? 'border-primary-500 ring-2 ring-primary-100' : 'border-slate-100'}`}>
                        {plan.recommended && (
                            <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                POPULAR
                            </div>
                        )}
                        <div className="p-8 text-center border-b border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-800">{plan.name}</h3>
                            <p className="text-4xl font-bold text-slate-900 mt-4">{plan.price}</p>
                            <Link
                                to="/register"
                                className={`mt-8 block w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                                    plan.recommended 
                                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                                }`}
                            >
                                Start Free Trial
                            </Link>
                        </div>
                        <div className="p-8 flex-1">
                            <ul className="space-y-4">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center">
                                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 ${feature.included ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-300'}`}>
                                            {feature.included ? <CheckIcon className="w-3 h-3" /> : <CrossIcon className="w-3 h-3" />}
                                        </div>
                                        <span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>{feature.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublicPricingPage;
