// FIX: This file was empty. Adding WarrantyPage component.
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import type { WarrantyEntry, WarrantyStatus } from '../types';
import { api } from '../services/api';
import { AppContext, AppContextType } from '../App';
import WarrantyEntryModal from '../components/WarrantyEntryModal';

const warrantyStatuses: WarrantyStatus[] = [
    'Awaiting Pickup', 'Received at Office', 'Sent to Service', 'Under Repair', 'Repaired', 'Replaced', 'Rejected', 'Returned to Customer'
];

const StatusIndicator: React.FC<{ status: WarrantyStatus }> = ({ status }) => {
    const styles: { [key: string]: string } = {
        'Awaiting Pickup': 'bg-slate-100 text-slate-800',
        'Received at Office': 'bg-blue-100 text-blue-800',
        'Sent to Service': 'bg-indigo-100 text-indigo-800',
        'Under Repair': 'bg-yellow-100 text-yellow-800',
        'Repaired': 'bg-green-100 text-green-800',
        'Replaced': 'bg-cyan-100 text-cyan-800',
        'Rejected': 'bg-red-100 text-red-800',
        'Returned to Customer': 'bg-purple-100 text-purple-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${styles[status]}`}>
            {status}
        </span>
    );
};

const WarrantyPage: React.FC = () => {
    const appContext = useContext(AppContext) as AppContextType;
    const { warrantyEntries: entries, setWarrantyEntries: setEntries } = appContext;
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState<{ isOpen: boolean, entry?: WarrantyEntry }>({ isOpen: false });
    const [statusFilter, setStatusFilter] = useState<WarrantyStatus | 'all'>('all');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getWarrantyEntries();
            setEntries(data);
        } catch (error) {
            console.error("Failed to fetch warranty entries", error);
        } finally {
            setLoading(false);
        }
    }, [setEntries]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSuccess = () => {
        fetchData(); // Refetch data after a change
    };

    const openModal = (entry?: WarrantyEntry) => setModalState({ isOpen: true, entry });
    const closeModal = () => setModalState({ isOpen: false });

    const filteredEntries = useMemo(() => {
        if (statusFilter === 'all') {
            return entries;
        }
        return entries.filter(entry => entry.status === statusFilter);
    }, [entries, statusFilter]);

    if (loading) {
        return <div>Loading warranty tracker...</div>;
    }

    return (
        <div className="space-y-8">
            {modalState.isOpen && <WarrantyEntryModal onClose={closeModal} onSuccess={handleSuccess} entry={modalState.entry} />}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h2 className="text-3xl font-bold text-slate-800">Warranty Service Tracker</h2>
                <button
                    id="add-warranty-btn"
                    onClick={() => openModal()}
                    className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    Add New Entry
                    <kbd className="ml-2 bg-primary-700 border border-primary-600 border-b-2 rounded px-1.5 py-0.5 text-xs font-mono">F2</kbd>
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                    <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700">Filter by status:</label>
                    <select 
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as WarrantyStatus | 'all')}
                        className="mt-1 block w-full md:w-1/3 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                        <option value="all">All Statuses</option>
                        {warrantyStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer / Product</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Issue</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pickup Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{entry.customerName}</div>
                                        <div className="text-sm text-slate-500">{entry.productName}</div>
                                        <div className="text-xs font-mono text-slate-500">{entry.serialNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-slate-500 max-w-xs">{entry.issue}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(entry.pickupDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusIndicator status={entry.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(entry)} className="text-primary-600 hover:text-primary-800">
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center px-6 py-12 text-slate-500">
                                        No warranty entries found for this filter.
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

export default WarrantyPage;