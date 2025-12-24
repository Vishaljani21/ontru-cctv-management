
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { LicenseKey, SubscriptionTier } from '../types';
import { ClipboardCopyIcon, KeyIcon } from '../components/icons';
import CustomSelect from '../components/CustomSelect';

const AdminLicensePage: React.FC = () => {
    const [keys, setKeys] = useState<LicenseKey[]>([]);
    const [loading, setLoading] = useState(true);

    // Generation Form
    const [tier, setTier] = useState<SubscriptionTier>('professional');
    const [duration, setDuration] = useState<number>(365);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const fetchKeys = async () => {
        setLoading(true);
        try {
            const data = await api.getLicenseKeys();
            setKeys(data);
        } catch (error) {
            console.error("Failed to fetch keys", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            await api.generateLicenseKey(tier, duration);
            await fetchKeys();
        } catch (error) {
            alert('Failed to generate key');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(text);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">License Management</h2>

            {/* Generator */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                    <KeyIcon className="w-5 h-5 mr-2" />
                    Generate New License Key
                </h3>
                <form onSubmit={handleGenerate} className="flex flex-col md:flex-row items-end gap-4">
                    <div className="w-full md:w-1/3">
                        <CustomSelect
                            label="Subscription Tier"
                            options={[
                                { value: 'starter', label: 'Starter' },
                                { value: 'professional', label: 'Professional' },
                                { value: 'enterprise', label: 'Enterprise' }
                            ]}
                            value={tier}
                            onChange={(val) => setTier(val as SubscriptionTier)}
                            placeholder="Select Tier"
                        />
                    </div>
                    <div className="w-full md:w-1/3">
                        <CustomSelect
                            label="Duration"
                            options={[
                                { value: '30', label: '30 Days (Monthly)' },
                                { value: '90', label: '90 Days (Quarterly)' },
                                { value: '180', label: '180 Days (Half-Yearly)' },
                                { value: '365', label: '365 Days (Yearly)' }
                            ]}
                            value={duration.toString()}
                            onChange={(val) => setDuration(parseInt(val))}
                            placeholder="Select Duration"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="w-full md:w-auto px-6 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 disabled:bg-primary-300"
                    >
                        {isGenerating ? 'Generating...' : 'Generate Key'}
                    </button>
                </form>
            </div>

            {/* Key List */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800">Generated Keys</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">License Key</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tier</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Generated On</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Used By</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {keys.map((key) => (
                                <tr key={key.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded">
                                                {key.key}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(key.key)}
                                                className="text-slate-400 hover:text-primary-600"
                                                title="Copy"
                                            >
                                                <ClipboardCopyIcon className="w-4 h-4" />
                                            </button>
                                            {copiedKey === key.key && <span className="text-xs text-green-600">Copied!</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-slate-700">{key.tier}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{key.durationDays} Days</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full font-semibold capitalize ${key.status === 'active' ? 'bg-green-100 text-green-800' :
                                            key.status === 'used' ? 'bg-slate-100 text-slate-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {key.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(key.generatedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                        {key.status === 'used' ? (
                                            <div>
                                                <p className="font-medium">{key.usedBy || 'Unknown'}</p>
                                                <p className="text-xs text-slate-500">{key.usedAt ? new Date(key.usedAt).toLocaleDateString() : ''}</p>
                                            </div>
                                        ) : '-'}
                                    </td>
                                </tr>
                            ))}
                            {keys.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No keys generated yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminLicensePage;
