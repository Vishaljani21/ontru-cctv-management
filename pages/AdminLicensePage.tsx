import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { LicenseKey, SubscriptionTier } from '../types';
import {
    ClipboardCopyIcon,
    KeyIcon,
    PlusIcon,
    SearchIcon,
    FilterIcon,
    RefreshIcon,
    CheckCircleIcon,
    UsersIcon,
    SparklesIcon,
    AlertTriangleIcon,
    TrashIcon
} from '../components/icons';
import CustomSelect from '../components/CustomSelect';
import StatsCard from '../components/StatsCard';
import Modal from '../components/Modal';

const AdminLicensePage: React.FC = () => {
    const [keys, setKeys] = useState<LicenseKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Generation Form State
    const [tier, setTier] = useState<string>('professional');
    const [duration, setDuration] = useState<number>(365);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    // Delete Confirmation
    const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Trial Mode Toggle
    const [isTrialMode, setIsTrialMode] = useState(false);

    useEffect(() => {
        fetchKeys();
    }, []);

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

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            // If Trial Mode is active, force Professional Tier + 14 Days
            const finalTier: SubscriptionTier = isTrialMode ? 'professional' : (tier as SubscriptionTier);
            const finalDuration = isTrialMode ? 14 : duration;

            await api.generateLicenseKey(finalTier, finalDuration);
            await fetchKeys();
            // Reset to default after success
            if (isTrialMode) setIsTrialMode(false);
        } catch (error) {
            console.error('Failed to generate key', error);
            alert('Failed to generate key');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteKeyId) return;
        setIsDeleting(true);
        try {
            await api.deleteLicenseKey(deleteKeyId);
            await fetchKeys();
            setDeleteKeyId(null);
        } catch (error) {
            console.error('Failed to delete key', error);
            alert('Failed to delete key');
        } finally {
            setIsDeleting(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(text);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    // Calculate Stats
    const totalKeys = keys.length;
    const activeKeys = keys.filter(k => k.status === 'active').length;
    const usedKeys = keys.filter(k => k.status === 'used').length;
    const trialKeys = keys.filter(k => k.durationDays <= 14).length;

    const filteredKeys = keys.filter(key => {
        const matchesSearch = key.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (key.usedBy && key.usedBy.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilter = statusFilter === 'all' || key.status === statusFilter;

        return matchesSearch && matchesFilter;
    });

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active Only' },
        { value: 'used', label: 'Redeemed Only' }
    ];

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">License Management</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate, monitor, and manage subscription license keys.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Generated"
                    value={totalKeys}
                    icon={<KeyIcon />}
                    gradient="blue"
                />
                <StatsCard
                    title="Active (Unused)"
                    value={activeKeys}
                    icon={<CheckCircleIcon />}
                    gradient="teal"
                />
                <StatsCard
                    title="Redeemed"
                    value={usedKeys}
                    icon={<UsersIcon />}
                    gradient="purple"
                />
                <StatsCard
                    title="Trial Keys"
                    value={trialKeys}
                    icon={<AlertTriangleIcon />}
                    gradient="red"
                />
            </div>

            {/* Generator Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 mr-4">
                            <SparklesIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Generate License</h3>
                            <p className="text-xs text-slate-500">Create new secure 16-character license keys.</p>
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start md:self-auto">
                        <button
                            type="button"
                            onClick={() => setIsTrialMode(false)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${!isTrialMode
                                    ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm ring-1 ring-black/5'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                }`}
                        >
                            Standard Plan
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsTrialMode(true); setTier('professional'); }}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${isTrialMode
                                    ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm ring-1 ring-black/5'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                }`}
                        >
                            Trial Key
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50">
                    <form onSubmit={handleGenerate} className="flex flex-col lg:flex-row items-end gap-6">
                        <div className="w-full lg:flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`transition-opacity duration-300 ${isTrialMode ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Subscription Tier</label>
                                <div className="relative">
                                    <select
                                        value={tier}
                                        onChange={(e) => setTier(e.target.value)}
                                        className="appearance-none block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
                                    >
                                        <option value="starter">Starter Plan</option>
                                        <option value="professional">Professional Plan</option>
                                        <option value="enterprise">Enterprise Plan</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className={`transition-opacity duration-300 ${isTrialMode ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Duration</label>
                                <div className="relative">
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="appearance-none block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
                                    >
                                        <option value={30}>30 Days (Monthly)</option>
                                        <option value={90}>90 Days (Quarterly)</option>
                                        <option value={180}>180 Days (Half-Yearly)</option>
                                        <option value={365}>365 Days (Yearly)</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isGenerating}
                            className={`w-full lg:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg lg:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center min-w-[200px]
                                ${isTrialMode
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-orange-500/25 shadow-orange-500/10'
                                    : 'bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-500 hover:shadow-slate-500/25 dark:hover:shadow-primary-500/25'
                                } disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isGenerating ? (
                                <RefreshIcon className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    {isTrialMode ? 'Generate Trial Key' : 'Generate Key'}
                                </>
                            )}
                        </button>
                    </form>

                    {isTrialMode && (
                        <div className="mt-4 flex items-center p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl text-xs text-orange-700 dark:text-orange-400">
                            <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 shrink-0 animate-pulse"></span>
                            <span className="font-medium">Trial keys grant full Professional access for 14 days. Perfect for client demos.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Keys Table Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 dark:text-white">Recent Keys</h3>
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
                            {filteredKeys.length}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                        {/* Status Filter */}
                        <div className="w-full sm:w-48 z-20">
                            <CustomSelect
                                options={statusOptions}
                                value={statusFilter}
                                onChange={setStatusFilter}
                                placeholder="Filter Status"
                            />
                        </div>

                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search with ID..."
                                className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-auto flex-1">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 relative">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">License Key</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Redeemed By</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredKeys.length > 0 ? (
                                filteredKeys.map((key) => {
                                    const isTrial = key.durationDays <= 14;
                                    return (
                                        <tr key={key.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-3">
                                                    <div className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50 select-all tracking-wide shadow-sm min-w-[220px] text-center">
                                                        {key.key}
                                                    </div>
                                                    <button
                                                        onClick={() => copyToClipboard(key.key)}
                                                        className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-white dark:bg-slate-800 p-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:border-primary-500 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                        title="Copy Key"
                                                    >
                                                        {copiedKey === key.key ? (
                                                            <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                                                        ) : (
                                                            <ClipboardCopyIcon className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm font-bold capitalize ${key.tier === 'enterprise' ? 'text-purple-600 dark:text-purple-400' :
                                                                key.tier === 'professional' ? 'text-blue-600 dark:text-blue-400' :
                                                                    'text-slate-700 dark:text-slate-300'
                                                            }`}>
                                                            {key.tier}
                                                        </span>
                                                        {isTrial && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 uppercase tracking-wide border border-orange-200 dark:border-orange-800">Trial</span>}
                                                    </div>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{key.durationDays} Days Validity</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize border 
                                                    ${key.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-800'
                                                        : key.status === 'used'
                                                            ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                                            : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${key.status === 'active' ? 'bg-emerald-500' :
                                                            key.status === 'used' ? 'bg-slate-500' : 'bg-red-500'
                                                        }`}></span>
                                                    {key.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">{new Date(key.generatedAt).toLocaleDateString()}</span>
                                                    <span className="text-xs text-slate-400">{new Date(key.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {key.status === 'used' ? (
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs mr-3 border border-indigo-200 dark:border-indigo-800">
                                                            {key.usedBy ? key.usedBy.substring(0, 2).toUpperCase() : '??'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 dark:text-white text-sm">{key.usedBy || 'Unknown User'}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                {key.usedAt ? `Redeemed ${new Date(key.usedAt).toLocaleDateString()}` : 'Redeemed'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-slate-600 text-xs italic">Not yet redeemed</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => setDeleteKeyId(key.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    title="Delete Key"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                                <KeyIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                            </div>
                                            <p className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-1">No license keys found</p>
                                            <p className="text-sm text-slate-400 max-w-xs mx-auto">
                                                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters.' : 'Generate a new key to get started.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteKeyId}
                onClose={() => setDeleteKeyId(null)}
                title="Delete License Key"
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 rounded-full w-16 h-16 mx-auto">
                        <TrashIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-center text-slate-600 dark:text-slate-300">
                        Are you sure you want to delete this license key? This action cannot be undone.
                    </p>
                    <div className="flex items-center space-x-3 mt-6">
                        <button
                            onClick={() => setDeleteKeyId(null)}
                            className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md shadow-red-500/20 transition-all flex items-center justify-center"
                        >
                            {isDeleting ? <RefreshIcon className="w-5 h-5 animate-spin" /> : 'Delete Key'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminLicensePage;
