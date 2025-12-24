import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { api } from '../services/api';
import type { DealerInfo } from '../types';
// --- Icons (Inline to avoid dependencies) ---
const CreditCardIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
);

const CompanyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
);

const BankIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
);

const ModulesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

const PreferencesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
);


const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; label: string; description: string; }> = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-5 bg-white dark:bg-[#111] rounded-xl border border-slate-200 dark:border-white/10 transition-all hover:bg-slate-50 dark:hover:bg-white/5">
        <div>
            <p className="font-bold text-slate-800 dark:text-white">{label}</p>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">{description}</p>
        </div>
        <button
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex items-center h-7 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${enabled ? 'bg-primary-500' : 'bg-slate-300 dark:bg-zinc-700'}`}
        >
            <span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform shadow-sm ${enabled ? 'translate-x-[22px]' : 'translate-x-1'}`} />
        </button>
    </div>
);

const InputGroup: React.FC<{ label: string; name: string; value: string; onChange: (e: any) => void; placeholder?: string; type?: string; fullWidth?: boolean }> = ({ label, name, value, onChange, placeholder, type = "text", fullWidth = false }) => (
    <div className={`${fullWidth ? 'col-span-full' : ''}`}>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
            {label}
        </label>
        {type === 'textarea' ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows={3}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white placeholder-slate-400 resize-none"
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white placeholder-slate-400"
            />
        )}
    </div>
);

const SettingsPage: React.FC = () => {
    const appContext = useContext(AppContext);
    const {
        isHrModuleEnabled, setIsHrModuleEnabled,
        isBillingModuleEnabled, setIsBillingModuleEnabled,
        isAmcModuleEnabled, setIsAmcModuleEnabled
    } = appContext || {};

    const [dealerInfo, setDealerInfo] = useState<DealerInfo | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'profile' | 'bank' | 'modules' | 'preferences'>('profile');

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.getDealerInfo()
            .then(setDealerInfo)
            .catch(err => {
                console.error("Failed to load settings:", err);
                setError(err.message || "Unknown error occurred");
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!dealerInfo) return;
        const { name, value } = e.target;
        setDealerInfo({ ...dealerInfo, [name]: value });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const url = await api.uploadDealerLogo(file);
                if (dealerInfo) {
                    setDealerInfo({ ...dealerInfo, logoUrl: url });
                }
            } catch (err) {
                console.error("Logo upload failed", err);
                setSaveMessage('Failed to upload logo.');
                setTimeout(() => setSaveMessage(''), 3000);
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dealerInfo) return;
        setIsSaving(true);
        setSaveMessage('');
        try {
            await api.updateDealerInfo(dealerInfo);
            setSaveMessage('Settings saved successfully!');
        } catch (error: any) {
            console.error("Save error details:", error);
            setSaveMessage(`Failed: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    const handleModuleToggle = (module: 'billing' | 'amc' | 'hr', value: boolean) => {
        if (!dealerInfo) return;

        // 1. Update Context (Immediate Effect)
        if (module === 'billing' && setIsBillingModuleEnabled) setIsBillingModuleEnabled(value);
        if (module === 'amc' && setIsAmcModuleEnabled) setIsAmcModuleEnabled(value);
        if (module === 'hr' && setIsHrModuleEnabled) setIsHrModuleEnabled(value);

        // 2. Update Form State (For Saving)
        setDealerInfo(prev => prev ? ({
            ...prev,
            isBillingEnabled: module === 'billing' ? value : prev.isBillingEnabled,
            isAmcEnabled: module === 'amc' ? value : prev.isAmcEnabled,
            isHrEnabled: module === 'hr' ? value : prev.isHrEnabled,
        }) : null);
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="text-red-500 font-bold text-lg">Error: {error}</div>
                <p className="text-slate-500 text-sm">Please check console for more details.</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Retry
                </button>
            </div>
        );
    }

    if (!dealerInfo || !appContext) {
        return (
            <div className="space-y-8 animate-pulse max-w-5xl mx-auto">
                <div className="h-8 bg-slate-200 dark:bg-zinc-800 rounded w-1/4"></div>
                <div className="flex gap-4">
                    <div className="w-64 h-96 bg-slate-200 dark:bg-zinc-800 rounded-2xl"></div>
                    <div className="flex-1 h-96 bg-slate-200 dark:bg-zinc-800 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Company Profile', icon: CompanyIcon },
        { id: 'bank', label: 'Bank Details', icon: BankIcon },
        { id: 'modules', label: 'Modules', icon: ModulesIcon },
        { id: 'preferences', label: 'Preferences', icon: PreferencesIcon },
    ] as const;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Settings</h2>
                <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Manage your company details, preferences, and modules.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === tab.id
                                ? 'bg-white dark:bg-[#111] text-primary-600 dark:text-primary-400 shadow-md shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/10'
                                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary-500' : 'text-slate-400'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Tab Content: Company Profile */}
                        {activeTab === 'profile' && (
                            <div className="bg-white dark:bg-[#111] p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Company Profile</h3>
                                    <p className="text-slate-500 dark:text-zinc-400 text-sm">Update your official company information.</p>
                                </div>

                                {/* Logo Upload */}
                                <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                                    <div className="relative group flex-shrink-0">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-black flex items-center justify-center">
                                            {dealerInfo.logoUrl ? (
                                                <img src={dealerInfo.logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <CompanyIcon className="w-8 h-8 text-slate-400" />
                                            )}
                                        </div>
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full text-white font-bold text-xs">
                                            Upload
                                            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                        </label>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white">Company Logo</h4>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                                            This logo will appear on your invoices and reports.<br />
                                            Recommended: Square PNG/JPG, max 2MB.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Company Name" name="companyName" value={dealerInfo.companyName} onChange={handleChange} placeholder="e.g. Acme Security Solutions" />
                                    <InputGroup label="GSTIN" name="gstin" value={dealerInfo.gstin} onChange={handleChange} placeholder="e.g. 29ABCDE1234F1Z5" />
                                    <InputGroup label="Address" name="address" value={dealerInfo.address} onChange={handleChange} placeholder="Enter full business address" type="textarea" fullWidth />
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Bank Details */}
                        {activeTab === 'bank' && (
                            <div className="bg-white dark:bg-[#111] p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Bank & Payment Details</h3>
                                        <p className="text-slate-500 dark:text-zinc-400 text-sm">This info appears on your invoices.</p>
                                    </div>
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                                        <CreditCardIcon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="UPI ID / VPA" name="upiId" value={dealerInfo.upiId} onChange={handleChange} placeholder="e.g. business@upi" />
                                    <InputGroup label="QR Code URL" name="qrCodeUrl" value={dealerInfo.qrCodeUrl || ''} onChange={handleChange} placeholder="https://..." />
                                </div>
                                <hr className="border-slate-100 dark:border-white/10" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InputGroup label="Bank Name" name="bankName" value={dealerInfo.bankName} onChange={handleChange} placeholder="e.g. HDFC Bank" />
                                    <InputGroup label="Account Number" name="accountNo" value={dealerInfo.accountNo} onChange={handleChange} placeholder="Your Account No." />
                                    <InputGroup label="IFSC Code" name="ifscCode" value={dealerInfo.ifscCode} onChange={handleChange} placeholder="e.g. HDFC0001234" />
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Modules */}
                        {activeTab === 'modules' && (
                            <div className="bg-white dark:bg-[#111] p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Module Management</h3>
                                    <p className="text-slate-500 dark:text-zinc-400 text-sm">Turn features on or off based on your needs.</p>
                                </div>
                                <div className="space-y-4">
                                    <ToggleSwitch
                                        enabled={isBillingModuleEnabled || false}
                                        onChange={(val) => handleModuleToggle('billing', val)}
                                        label="Billing & Invoicing"
                                        description="Generate GST invoices, track payments, and send reminders."
                                    />
                                    <ToggleSwitch
                                        enabled={isAmcModuleEnabled || false}
                                        onChange={(val) => handleModuleToggle('amc', val)}
                                        label="AMC Management"
                                        description="Track Annual Maintenance Contracts, renewal dates, and services."
                                    />
                                    <ToggleSwitch
                                        enabled={isHrModuleEnabled || false}
                                        onChange={(val) => handleModuleToggle('hr', val)}
                                        label="HR & Payroll"
                                        description="Manage technician attendance, salaries, and payslips."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Preferences */}
                        {activeTab === 'preferences' && (
                            <div className="bg-white dark:bg-[#111] p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Preferences</h3>
                                    <p className="text-slate-500 dark:text-zinc-400 text-sm">Customize your application experience.</p>
                                </div>
                                <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                                    <p className="text-slate-500 dark:text-zinc-400 font-medium">Dark Mode & Notification settings coming soon!</p>
                                </div>
                            </div>
                        )}

                        {/* Sticky Save Bar (only for Profile & Answer) */}
                        {(activeTab === 'profile' || activeTab === 'bank') && (
                            <div className="flex justify-end items-center gap-4 pt-4">
                                {saveMessage && (
                                    <span className={`text-sm font-bold animate-fade-in ${saveMessage.includes('Failed') ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {saveMessage}
                                    </span>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:scale-100 flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;