import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { api } from '../services/api';
import { Customer, ComplaintCategory, ComplaintPriority, ComplaintSource } from '../types';
import { UserIcon, DocumentTextIcon } from './icons';
import CustomSelect from './CustomSelect';

interface ComplaintFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ComplaintFormModal: React.FC<ComplaintFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [fetchingCustomers, setFetchingCustomers] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);

    // Form State
    const [customerId, setCustomerId] = useState<number | ''>('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<ComplaintCategory>('No Video');
    const [priority, setPriority] = useState<ComplaintPriority>('Normal');
    const [source, setSource] = useState<ComplaintSource>('Phone');

    // Site Details (Auto-filled but editable)
    const [siteAddress, setSiteAddress] = useState('');
    const [siteCity, setSiteCity] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadCustomers();
        }
    }, [isOpen]);

    const loadCustomers = async () => {
        setFetchingCustomers(true);
        try {
            const data = await api.getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to load customers", error);
        } finally {
            setFetchingCustomers(false);
        }
    };

    const handleCustomerChange = (value: string) => {
        const id = parseInt(value);
        setCustomerId(id);
        const customer = customers.find(c => c.id === id);
        if (customer) {
            setSiteAddress(customer.address || '');
            setSiteCity(customer.city || '');
            setContactName(customer.contactPerson || customer.companyName);
            setContactPhone(customer.mobile || customer.email || '');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerId) return;

        setLoading(true);
        try {
            await api.createComplaint({
                customerId: Number(customerId),
                title,
                description,
                category,
                priority,
                source,
                siteAddress,
                siteCity,
                contactPersonName: contactName,
                contactPersonPhone: contactPhone
            });
            onSuccess();
            onClose();
            resetForm();
        } catch (error: any) {
            console.error("Failed to create complaint", error);
            alert("Failed to create complaint: " + (error?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCustomerId('');
        setTitle('');
        setDescription('');
        setCategory('No Video');
        setPriority('Normal');
        setSiteAddress('');
        setSiteCity('');
        setContactName('');
        setContactPhone('');
    };

    // Customer options for CustomSelect
    const customerOptions = customers.map(c => ({
        value: String(c.id),
        label: `${c.companyName} (${c.city})`
    }));

    // Category options
    const categoryOptions = [
        { value: 'No Video', label: 'No Video' },
        { value: 'No Power', label: 'No Power' },
        { value: 'DVR/NVR Issue', label: 'DVR/NVR Issue' },
        { value: 'Camera Fault', label: 'Camera Fault' },
        { value: 'HDD Issue', label: 'HDD Issue' },
        { value: 'Network Issue', label: 'Network Issue' },
        { value: 'Mobile App Remote View', label: 'Mobile App Remote View' },
        { value: 'Cable/Connector', label: 'Cable/Connector' },
        { value: 'Other', label: 'Other' }
    ];

    // Priority options
    const priorityOptions = [
        { value: 'Low', label: 'Low' },
        { value: 'Normal', label: 'Normal' },
        { value: 'High', label: 'High' },
        { value: 'Urgent', label: 'Urgent' }
    ];

    // Source options
    const sourceOptions = [
        { value: 'Phone', label: 'Phone' },
        { value: 'WhatsApp', label: 'WhatsApp' },
        { value: 'Walk-in', label: 'Walk-in' },
        { value: 'AMC', label: 'AMC' },
        { value: 'Other', label: 'Other' }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Service Ticket" maxWidth="max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Customer Section */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" /> Customer Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Customer</label>
                            <CustomSelect
                                value={customerId ? String(customerId) : ''}
                                onChange={handleCustomerChange}
                                options={customerOptions}
                                placeholder="Select a customer..."
                            />
                            {fetchingCustomers && <p className="text-xs text-primary-400 mt-1">Loading customers...</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Person</label>
                            <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                            <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Site Address</label>
                            <input type="text" value={siteAddress} onChange={e => setSiteAddress(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
                            <input type="text" value={siteCity} onChange={e => setSiteCity(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                    </div>
                </div>

                {/* Complaint Details */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <DocumentTextIcon className="w-4 h-4" /> Issue Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Ticket Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. Camera 4 No Signal"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                            <CustomSelect
                                value={category}
                                onChange={(val) => setCategory(val as ComplaintCategory)}
                                options={categoryOptions}
                                placeholder="Select category..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                            <CustomSelect
                                value={priority}
                                onChange={(val) => setPriority(val as ComplaintPriority)}
                                options={priorityOptions}
                                placeholder="Select priority..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Source</label>
                            <CustomSelect
                                value={source}
                                onChange={(val) => setSource(val as ComplaintSource)}
                                options={sourceOptions}
                                placeholder="Select source..."
                            />
                        </div>
                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={3}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !customerId}
                        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? 'Creating...' : 'Create Ticket'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ComplaintFormModal;
