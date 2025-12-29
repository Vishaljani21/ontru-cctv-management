

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
    description: string;
    features: PlanFeature[];
    recommended?: boolean;
}

const plans: Plan[] = [
    {
        id: 'starter',
        name: 'Starter',
        price: '₹999',
        description: 'Perfect for small teams getting started.',
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
        price: '₹2,499',
        description: 'Everything you need to scale your operations.',
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
        price: '₹4,999',
        description: 'Advanced features for large organizations.',
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

    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    const openPurchaseModal = () => setShowPurchaseModal(true);
    const closePurchaseModal = () => setShowPurchaseModal(false);

    return (
        <div className="space-y-12 animate-fade-in-up pb-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight">Simple Pricing, Powerful Features</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">Choose the perfect plan to streamline your CCTV project management and grow your business.</p>
            </div>

            {/* License Key Redemption */}
            <div className="max-w-xl mx-auto">
                <div className="bg-white dark:bg-slate-900 p-1 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <form onSubmit={handleRedeemKey} className="relative flex items-center">
                        <KeyIcon className="absolute left-4 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={licenseKey}
                            onChange={e => setLicenseKey(e.target.value)}
                            placeholder="Enter your license key"
                            className="w-full pl-12 pr-32 py-4 bg-transparent border-none rounded-xl focus:ring-0 text-slate-800 dark:text-white placeholder-slate-400 font-medium"
                        />
                        <button
                            type="submit"
                            disabled={loading || !licenseKey}
                            className="absolute right-2 top-2 bottom-2 px-6 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {loading ? '...' : 'Redeem'}
                        </button>
                    </form>
                </div>
                <div className="flex justify-center mt-3">
                    <button
                        onClick={openPurchaseModal}
                        className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline"
                    >
                        Need a License Key? Buy Online
                    </button>
                </div>
                {redeemStatus && (
                    <div className={`mt-3 text-center text-sm font-bold ${redeemStatus.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {redeemStatus.message}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                {plans.map((plan, index) => {
                    const isCurrent = currentTier === plan.id;
                    return (
                        <div
                            key={plan.id}
                            className={`relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col group hover:-translate-y-2
                            ${isCurrent ? 'ring-2 ring-primary-500 shadow-xl shadow-primary-500/10 scale-[1.02] z-10' : 'border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl'}
                            ${plan.recommended && !isCurrent ? 'border-primary-200 dark:border-primary-900 shadow-lg shadow-primary-500/5' : ''}
                            `}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary-400 to-primary-600"></div>
                            )}

                            <div className="p-8 pb-0">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{plan.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 h-10">{plan.description}</p>
                                    </div>
                                    {plan.recommended && (
                                        <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border border-primary-100 dark:border-primary-800">
                                            Recommended
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-baseline gap-1 mt-6">
                                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{plan.price}</span>
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">/month</span>
                                </div>
                            </div>

                            <div className="p-8 flex-1">
                                <hr className="border-slate-100 dark:border-slate-800 mb-8" />
                                <ul className="space-y-4">
                                    {featureList(plan.features)}
                                </ul>
                            </div>

                            <div className="p-8 pt-0 mt-auto">
                                <button
                                    onClick={() => isCurrent ? null : openPurchaseModal()}
                                    disabled={loading || isCurrent}
                                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] ${isCurrent
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 cursor-default shadow-none hover:shadow-none hover:scale-100'
                                        : plan.recommended
                                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-primary-500/25'
                                            : 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-900 dark:hover:bg-slate-100'
                                        }`}
                                >
                                    {isCurrent ? 'Current Plan' : `Buy ${plan.name} License`}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="max-w-4xl mx-auto mt-16 px-4">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="bg-white dark:bg-indigo-900 p-4 rounded-2xl shadow-lg shadow-indigo-200/50 dark:shadow-none text-indigo-600 dark:text-indigo-400 transform -rotate-3">
                        <CrownIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xl font-bold text-indigo-900 dark:text-white">Need a Custom Enterprise Solution?</h4>
                        <p className="text-indigo-700 dark:text-indigo-300 mt-2 text-sm leading-relaxed">
                            For large organizations with multiple branches and over 50 technicians, we offer custom deployment, dedicated support, and volume pricing.
                        </p>
                    </div>
                    <button onClick={openPurchaseModal} className="whitespace-nowrap px-6 py-3 bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
                        Contact Sales
                    </button>
                </div>
            </div>

            {/* Purchase Modal */}
            {showPurchaseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Get Your License Key</h3>
                            <button onClick={closePurchaseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <CrossIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8 text-center space-y-6">
                            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto text-primary-600 mb-4">
                                <CrownIcon className="w-8 h-8" />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-800 dark:text-white">Contact Us to Purchase</h4>
                            <p className="text-slate-600 dark:text-slate-400">
                                To purchase a license key or upgrade your plan, please contact our sales team directly. We accept UPI, Bank Transfer, and Credit Cards.
                            </p>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3 text-left">
                                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                                    <span className="text-slate-500 text-sm">Sales Email</span>
                                    <a href="mailto:sales@ontru.com" className="font-bold text-primary-600 hover:underline">sales@ontru.com</a>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                                    <span className="text-slate-500 text-sm">WhatsApp / Call</span>
                                    <a href="tel:+919876543210" className="font-bold text-primary-600 hover:underline">+91 98765 43210</a>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 text-sm">Website</span>
                                    <a href="https://ontru.com/pricing" target="_blank" rel="noreferrer" className="font-bold text-primary-600 hover:underline">ontru.com/pricing</a>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500">
                                Once payment is confirmed, you will receive a license key instantly via email and SMS. Enter that key in the dashboard to activate your plan.
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-center">
                            <button onClick={closePurchaseModal} className="text-slate-500 hover:text-slate-700 font-medium text-sm">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper for plan features
const featureList = (features: PlanFeature[]) => features.map((feature, idx) => (
    <li key={idx} className="flex items-start">
        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${feature.included ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600'}`}>
            {feature.included ? <CheckIcon className="w-3 h-3" /> : <CrossIcon className="w-3 h-3" />}
        </div>
        <span className={`text-sm ${feature.included ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-400 dark:text-slate-600'}`}>
            {feature.name}
        </span>
    </li>
));
export default SubscriptionPage;
