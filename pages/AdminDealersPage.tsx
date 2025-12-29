import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import type { DealerInfo } from '../types';
import Skeleton from '../components/Skeleton';
import StatsCard from '../components/StatsCard';
import { UserIcon, SearchIcon, FilterIcon, EyeIcon, CrossIcon, TrashIcon, CrownIcon, CheckCircleIcon, AlertTriangleIcon } from '../components/icons';
import Modal from '../components/Modal';

const AdminDealersPage: React.FC = () => {
    const [dealers, setDealers] = useState<DealerInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'expired'>('all');
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [selectedDealer, setSelectedDealer] = useState<DealerInfo | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        fetchDealers();
    }, []);

    const fetchDealers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getAllDealers();
            console.log("Fetched Dealers:", data);
            setDealers(data);
        } catch (err: any) {
            console.error("Failed to fetch dealers", err);
            setError(err.message || "Unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this dealer? This cannot be undone.')) {
            try {
                await api.deleteDealer(id);
                setDealers(dealers.filter(d => d.id !== id));
            } catch (error) {
                alert('Failed to delete dealer');
                console.error(error);
            }
        }
    };

    const handleViewDetails = (dealer: DealerInfo) => {
        setSelectedDealer(dealer);
        setIsDetailsOpen(true);
    };

    const filteredDealers = useMemo(() => {
        return dealers.filter(dealer => {
            const matchesSearch =
                dealer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dealer.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dealer.email?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || dealer.subscription.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [dealers, searchTerm, statusFilter]);

    const stats = useMemo(() => {
        return {
            total: dealers.length,
            active: dealers.filter(d => d.subscription.status === 'active').length,
            trial: dealers.filter(d => d.subscription.status === 'trial').length,
            expired: dealers.filter(d => d.subscription.status === 'expired').length
        };
    }, [dealers]);

    // Create Dealer State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        companyName: '',
        ownerName: '',
        email: '',
        password: '',
        mobile: ''
    });
    const [createLoading, setCreateLoading] = useState(false);

    const handleCreateDealer = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            await api.createDealer(createForm);
            setIsCreateOpen(false);
            setCreateForm({ companyName: '', ownerName: '', email: '', password: '', mobile: '' });
            alert("Dealer created successfully!");
            fetchDealers();
        } catch (error: any) {
            console.error("Failed to create dealer", error);
            alert("Failed to create dealer: " + (error.message || "Unknown error"));
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Dealers</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage all registered dealers and companies.</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm font-medium transition-colors flex items-center gap-2"
                >
                    <span className="text-xl">+</span> Add Dealer
                </button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Dealers"
                    value={stats.total}
                    icon={<UserIcon />}
                    gradient="blue"
                />
                <StatsCard
                    title="Active Subs"
                    value={stats.active}
                    icon={<CrownIcon />}
                    gradient="green"
                />
                <StatsCard
                    title="On Trial"
                    value={stats.trial}
                    icon={<CheckCircleIcon />}
                    gradient="purple"
                />
                <StatsCard
                    title="Expired"
                    value={stats.expired}
                    icon={<AlertTriangleIcon />}
                    gradient="red"
                />
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search dealers by name, company or email..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <FilterIcon className="text-slate-400 w-5 h-5" />
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="trial">Trial</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6">
                    <CrossIcon className="w-5 h-5 mr-2" />
                    <span>Error loading dealers: {error}</span>
                    <button onClick={fetchDealers} className="ml-auto text-sm font-bold underline">Retry</button>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company / Owner</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subscription</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx}>
                                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton width={180} height={20} className="mb-2" /><Skeleton width={100} height={16} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton width={150} height={16} className="mb-2" /><Skeleton width={100} height={16} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton width={80} height={20} className="rounded-full" /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton width={60} height={20} className="mx-auto rounded-full" /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton width={60} height={20} className="ml-auto" /></td>
                                    </tr>
                                ))
                            ) : (
                                filteredDealers.map((dealer) => (
                                    <tr key={dealer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3 text-lg">
                                                    {dealer.companyName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{dealer.companyName}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{dealer.ownerName || 'Unknown Owner'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-600 dark:text-slate-300">{dealer.email || '-'}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{dealer.mobile || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${dealer.subscription.tier === 'enterprise' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                                    dealer.subscription.tier === 'professional' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}>
                                                {dealer.subscription.tier}
                                            </span>
                                            <div className="text-xs text-slate-400 mt-1">Exp: {new Date(dealer.subscription.expiryDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${dealer.subscription.status === 'active'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dealer.subscription.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></span>
                                                {dealer.subscription.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(dealer)}
                                                    className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(dealer.id!)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete Dealer"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Dealer Modal */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Create New Dealer"
            >
                <form onSubmit={handleCreateDealer} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                            value={createForm.companyName}
                            onChange={e => setCreateForm({ ...createForm, companyName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Owner Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                            value={createForm.ownerName}
                            onChange={e => setCreateForm({ ...createForm, ownerName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email (Login ID)</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                            value={createForm.email}
                            onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                            value={createForm.password}
                            onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                            value={createForm.mobile}
                            onChange={e => setCreateForm({ ...createForm, mobile: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                        <button type="submit" disabled={createLoading} className="px-6 py-2 bg-primary-600 text-white rounded-lg font-bold">
                            {createLoading ? 'Creating...' : 'Create Dealer'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Dealer Details Modal */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Dealer Details"
                maxWidth="max-w-2xl"
            >
                {selectedDealer && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-2xl">
                                {selectedDealer.companyName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedDealer.companyName}</h3>
                                <p className="text-slate-500 dark:text-slate-400">{selectedDealer.ownerName}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Contact Info</h4>
                                <div className="space-y-2 text-sm">
                                    <p className="flex justify-between"><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-800 dark:text-slate-300">{selectedDealer.email || '-'}</span></p>
                                    <p className="flex justify-between"><span className="text-slate-500">Mobile:</span> <span className="font-medium text-slate-800 dark:text-slate-300">{selectedDealer.mobile || '-'}</span></p>
                                    <p className="flex justify-between"><span className="text-slate-500">Address:</span> <span className="font-medium text-slate-800 dark:text-slate-300 text-right">{selectedDealer.address || '-'}</span></p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Business Info</h4>
                                <div className="space-y-2 text-sm">
                                    <p className="flex justify-between"><span className="text-slate-500">GSTIN:</span> <span className="font-medium text-slate-800 dark:text-slate-300">{selectedDealer.gstin || '-'}</span></p>
                                    <p className="flex justify-between"><span className="text-slate-500">Bank:</span> <span className="font-medium text-slate-800 dark:text-slate-300">{selectedDealer.bankName || '-'}</span></p>
                                    <p className="flex justify-between"><span className="text-slate-500">Account:</span> <span className="font-medium text-slate-800 dark:text-slate-300">{selectedDealer.accountNo || '-'}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Subscription</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-slate-500 text-xs">Current Tier</span>
                                    <span className="font-bold text-primary-600 capitalize">{selectedDealer.subscription.tier}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 text-xs">Status</span>
                                    <span className={`font-bold capitalize ${selectedDealer.subscription.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>{selectedDealer.subscription.status}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 text-xs">Start Date</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-300">{new Date(selectedDealer.subscription.startDate).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 text-xs">Expiry Date</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-300">{new Date(selectedDealer.subscription.expiryDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={() => setIsDetailsOpen(false)}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminDealersPage;
