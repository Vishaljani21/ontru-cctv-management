

import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { api } from '../services/api';
import { CheckIcon, CrossIcon, CrownIcon, KeyIcon } from '../components/icons';
import type { SubscriptionTier } from '../types';

interface PlanFeature {
    name: string;
    included: boolean;
}

interface Plan {
    id: SubscriptionTier;
    name: string;
    price: string;
    features: PlanFeature[];
    recommended?: boolean;
}

const plans: Plan[] = [
    {
        id: 'starter',
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
            { name: 'Reports & Analytics', included: false },
            { name: 'HR & Payroll', included: false },
            { name: 'Site Health Monitoring', included: false },
        ]
    },
    {
        id: 'professional',
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
            { name: 'Reports & Analytics', included: true },
            { name: 'HR & Payroll', included: false },
            { name: 'Site Health Monitoring', included: false },
        ]
    },
    {
        id: 'enterprise',
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
            { name: 'Reports & Analytics', included: true },
            { name: 'HR & Payroll', included: true },
            { name: 'Site Health Monitoring', included: true },
        ]
    }
];

const SubscriptionPage: React.FC = () => {
    const appContext = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [licenseKey, setLicenseKey] = useState('');
    const [redeemStatus, setRedeemStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    
    // Fallback if context is not yet loaded, though parent handles it
    const currentTier = appContext?.subscriptionTier || 'starter';

    const handleUpgrade = async (tier: SubscriptionTier) => {
        setLoading(true);
        try {
            await api.updateSubscription(tier);
            window.location.reload(); 
        } catch (error) {
            console.error("Failed to upgrade subscription", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRedeemKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!licenseKey) return;
        setLoading(true);
        setRedeemStatus(null);
        try {
            await api.redeemLicenseKey(licenseKey);
            setRedeemStatus({ type: 'success', message: 'License redeemed successfully! Refreshing...' });
            setTimeout(() => window.location.reload(), 1500);
        } catch (error: any) {
            setRedeemStatus({ type: 'error', message: error.message || 'Invalid license key.' });
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-slate-800">Choose Your Plan</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">Scale your business with the right set of tools. Upgrade using a plan selection or redeem a license key.</p>
            </div>

            {/* License Key Redemption */}
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-700 flex items-center mb-4">
                    <KeyIcon className="w-5 h-5 mr-2" />
                    Have a License Key?
                </h3>
                <form onSubmit={handleRedeemKey} className="flex gap-4">
                    <input 
                        type="text" 
                        value={licenseKey}
                        onChange={e => setLicenseKey(e.target.value)}
                        placeholder="Enter your license key here (e.g., PRO-ABCD-1234)"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !licenseKey}
                        className="px-6 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 disabled:bg-slate-400"
                    >
                        {loading ? 'Redeeming...' : 'Redeem'}
                    </button>
                </form>
                {redeemStatus && (
                    <div className={`mt-3 text-sm font-medium ${redeemStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {redeemStatus.message}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => {
                    const isCurrent = currentTier === plan.id;
                    return (
                        <div key={plan.id} className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 flex flex-col ${isCurrent ? 'border-primary-500 ring-2 ring-primary-100' : 'border-slate-100'}`}>
                            {plan.recommended && (
                                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    RECOMMENDED
                                </div>
                            )}
                            <div className="p-6 text-center border-b border-slate-100">
                                <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                                <p className="text-3xl font-bold text-slate-900 mt-4">{plan.price}</p>
                                <button
                                    onClick={() => !isCurrent && handleUpgrade(plan.id)}
                                    disabled={loading || isCurrent}
                                    className={`mt-6 w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                                        isCurrent 
                                        ? 'bg-green-100 text-green-700 cursor-default' 
                                        : 'bg-primary-500 text-white hover:bg-primary-600'
                                    }`}
                                >
                                    {isCurrent ? 'Current Plan' : 'Select Plan'}
                                </button>
                            </div>
                            <div className="p-6 flex-1 bg-slate-50">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 ${feature.included ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                                                {feature.included ? <CheckIcon className="w-3 h-3" /> : <CrossIcon className="w-3 h-3" />}
                                            </div>
                                            <span className={`text-sm ${feature.included ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{feature.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 max-w-4xl mx-auto flex items-start gap-4">
                <div className="bg-white p-2 rounded-full shadow-sm text-blue-500">
                    <CrownIcon className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-blue-900">Need a Custom Enterprise Solution?</h4>
                    <p className="text-blue-700 mt-1">For large organizations with multiple branches and over 50 technicians, contact our sales team for a custom quote and dedicated account manager.</p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
