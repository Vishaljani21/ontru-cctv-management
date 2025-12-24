import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import type { AMC, Customer, AMCStatus } from '../types';
import CustomSelect from '../components/CustomSelect';
import CustomDatePicker from '../components/CustomDatePicker';
import Modal from '../components/Modal';
import StatsCard from '../components/StatsCard';
import Skeleton from '../components/Skeleton';
import {
    ClipboardDocumentCheckIcon,
    ExclamationTriangleIcon,
    CheckBadgeIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

const AMCStatusBadge: React.FC<{ status: AMCStatus }> = ({ status }) => {
    const styles: Record<string, string> = {
        'Active': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        'Expiring Soon': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
        'Expired': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles['Active']}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : status === 'Expired' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
            {status}
        </span>
    );
};

const AMCForm: React.FC<{
    customers: Customer[];
    onSave: (amcData: Omit<AMC, 'id' | 'status' | 'customerName'>) => void;
    onCancel: () => void;
}> = ({ customers, onSave, onCancel }) => {
    const [customerId, setCustomerId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [cost, setCost] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({
                customerId: parseInt(customerId),
                startDate,
                endDate,
                cost: parseFloat(cost)
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <CustomSelect
                    label="Customer"
                    options={customers.map(c => ({ value: c.id.toString(), label: c.companyName }))}
                    value={customerId}
                    onChange={setCustomerId}
                    placeholder="Select Customer"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <CustomDatePicker
                        label="Start Date"
                        selected={startDate ? new Date(startDate) : null}
                        onChange={(d) => setStartDate(d ? d.toISOString().split('T')[0] : '')}
                        placeholder="Select start date"
                    />
                </div>
                <div>
                    <CustomDatePicker
                        label="End Date"
                        selected={endDate ? new Date(endDate) : null}
                        onChange={(d) => setEndDate(d ? d.toISOString().split('T')[0] : '')}
                        placeholder="Select end date"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="cost" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    AMC Cost (₹)
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 dark:text-slate-400 sm:text-sm">₹</span>
                    </div>
                    <input
                        type="number"
                        id="cost"
                        value={cost}
                        onChange={e => setCost(e.target.value)}
                        required
                        min="0"
                        placeholder="0.00"
                        className="block w-full pl-7 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        'Save Contract'
                    )}
                </button>
            </div>
        </form>
    );
};

const AMCsPage: React.FC = () => {
    const [amcs, setAmcs] = useState<AMC[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<AMCStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Artificial delay for smooth loading state
            const delay = new Promise(resolve => setTimeout(resolve, 600));
            const [amcData, customerData] = await Promise.all([
                api.getAMCs(),
                api.getCustomers(),
                delay
            ]);
            setAmcs(amcData);
            setCustomers(customerData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (amcData: Omit<AMC, 'id' | 'status' | 'customerName'>) => {
        await api.addAMC(amcData);
        await fetchData();
        setIsModalOpen(false);
    };

    const filteredAmcs = useMemo(() => {
        return amcs.filter(amc => {
            const matchesStatus = statusFilter === 'all' || amc.status === statusFilter;
            const matchesSearch = amc.customerName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [amcs, statusFilter, searchQuery]);

    const stats = useMemo(() => {
        const total = amcs.length;
        const active = amcs.filter(a => a.status === 'Active').length;
        const expiring = amcs.filter(a => a.status === 'Expiring Soon').length;
        return { total, active, expiring };
    }, [amcs]);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>)}
                </div>
                <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {isModalOpen && (
                <Modal isOpen={true} onClose={() => setIsModalOpen(false)} title="New Maintenance Contract" maxWidth="max-w-xl" allowOverflow>
                    <AMCForm customers={customers} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">AMC Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track annual maintenance contracts and renewals.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-95 group"
                >
                    <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    New Contract
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Contracts"
                    value={stats.total}
                    icon={<ClipboardDocumentCheckIcon className="w-6 h-6" />}
                    gradient="blue"
                />
                <StatsCard
                    title="Active Contracts"
                    value={stats.active}
                    icon={<CheckBadgeIcon className="w-6 h-6" />}
                    gradient="teal"
                />
                <StatsCard
                    title="Expiring Soon"
                    value={stats.expiring}
                    icon={<ExclamationTriangleIcon className="w-6 h-6" />}
                    gradient="red"
                />
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-72">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-48">
                            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-slate-800 dark:text-white appearance-none cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Expiring Soon">Expiring Soon</option>
                                <option value="Expired">Expired</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Cost
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredAmcs.length > 0 ? (
                                filteredAmcs.map((amc, index) => (
                                    <tr
                                        key={amc.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3 border border-primary-200 dark:border-primary-800">
                                                    {amc.customerName.charAt(0)}
                                                </div>
                                                <div className="font-bold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                    {amc.customerName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-600 dark:text-slate-400 flex flex-col">
                                                <span className="font-medium text-slate-800 dark:text-white">
                                                    {new Date(amc.startDate).toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}
                                                </span>
                                                <span className="text-xs">
                                                    to {new Date(amc.endDate).toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                ₹{amc.cost.toLocaleString('en-IN')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <AMCStatusBadge status={amc.status} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                                                <ClipboardDocumentCheckIcon className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <p className="text-base font-medium">No AMCs found</p>
                                            <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AMCsPage;