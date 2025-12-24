import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import type { AMC, Customer, AMCStatus } from '../types';

const AMCStatusIndicator: React.FC<{ status: AMCStatus }> = ({ status }) => {
    const styles: { [key: string]: string } = {
        'Active': 'bg-green-100 text-green-800',
        'Expiring Soon': 'bg-yellow-100 text-yellow-800',
        'Expired': 'bg-red-100 text-red-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
            {status}
        </span>
    );
};

const AMCFormModal: React.FC<{ customers: Customer[]; onSave: (amcData: Omit<AMC, 'id' | 'status' | 'customerName'>) => void; onClose: () => void }> = ({ customers, onSave, onClose }) => {
    const [customerId, setCustomerId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [cost, setCost] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            customerId: parseInt(customerId),
            startDate,
            endDate,
            cost: parseFloat(cost)
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Add New AMC</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="customer" className="block text-sm font-medium text-slate-700">Customer</label>
                        <select id="customer" value={customerId} onChange={e => setCustomerId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                            <option value="" disabled>Select a customer</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">Start Date</label>
                            <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-slate-700">End Date</label>
                            <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="cost" className="block text-sm font-medium text-slate-700">AMC Cost (₹)</label>
                        <input type="number" id="cost" value={cost} onChange={e => setCost(e.target.value)} required min="0" placeholder="e.g., 5000" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">Save AMC</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AMCsPage: React.FC = () => {
    const [amcs, setAmcs] = useState<AMC[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<AMCStatus | 'all'>('all');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [amcData, customerData] = await Promise.all([
                api.getAMCs(),
                api.getCustomers()
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
        fetchData();
        setIsModalOpen(false);
    };

    const filteredAmcs = useMemo(() => {
        if (statusFilter === 'all') return amcs;
        return amcs.filter(amc => amc.status === statusFilter);
    }, [amcs, statusFilter]);

    if (loading) {
        return <div>Loading AMC data...</div>;
    }

    return (
        <div className="space-y-8">
            {isModalOpen && <AMCFormModal customers={customers} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h2 className="text-3xl font-bold text-slate-800">AMC Management</h2>
                <button id="add-amc-btn" onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Add New AMC
                    <kbd className="ml-2 bg-primary-700 border border-primary-600 border-b-2 rounded px-1.5 py-0.5 text-xs font-mono">F2</kbd>
                </button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                    <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700">Filter by status:</label>
                    <select 
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as AMCStatus | 'all')}
                        className="mt-1 block w-full md:w-1/3 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                        <option value="all">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Expiring Soon">Expiring Soon</option>
                        <option value="Expired">Expired</option>
                    </select>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredAmcs.map(amc => (
                                <tr key={amc.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{amc.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(amc.startDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(amc.endDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold">₹{amc.cost.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><AMCStatusIndicator status={amc.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AMCsPage;