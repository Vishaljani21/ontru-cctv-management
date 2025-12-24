import React, { useState, useEffect, useCallback } from 'react';
import type { Customer } from '../types';
import { api } from '../services/api';
import Modal from '../components/Modal';

const CustomerForm: React.FC<{ customer?: Customer; onSave: (customer: Omit<Customer, 'id'> | Customer) => void; onCancel: () => void; }> = ({ customer, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Customer, 'id' | 'address'>>({
        companyName: customer?.companyName || '',
        contactPerson: customer?.contactPerson || '',
        mobile: customer?.mobile || '',
        email: customer?.email || '',
        area: customer?.area || '',
        city: customer?.city || '',
        gst: customer?.gst || '',
    });
    const [address, setAddress] = useState(customer?.address || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const customerData = { ...formData, address };
        onSave(customer ? { ...customerData, id: customer.id } : customerData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="companyName" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Company Name</label>
                    <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="e.g. Acme Corp" />
                </div>
                <div>
                    <label htmlFor="contactPerson" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Contact Person</label>
                    <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="e.g. John Doe" />
                </div>
                <div>
                    <label htmlFor="mobile" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Mobile Number</label>
                    <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="e.g. 9876543210" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Email Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="e.g. john@acme.com" />
                </div>
                <div>
                    <label htmlFor="area" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Area</label>
                    <input type="text" id="area" name="area" value={formData.area} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="e.g. Industrial Zone" />
                </div>
                <div>
                    <label htmlFor="city" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">City</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="e.g. Mumbai" />
                </div>
            </div>
            <div>
                <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Full Address</label>
                <textarea id="address" value={address} onChange={e => setAddress(e.target.value)} required rows={3} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="Complete street address..." />
            </div>
            <div>
                <label htmlFor="gst" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">GST Number (Optional)</label>
                <input type="text" id="gst" name="gst" value={formData.gst} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="GSTIN..." />
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]">Save Customer</button>
            </div>
        </form>
    );
};


const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (customer?: Customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCustomer(undefined);
    };

    const handleSave = async (customer: Omit<Customer, 'id'> | Customer) => {
        if ('id' in customer) {
            await api.updateCustomer(customer);
        } else {
            await api.addCustomer(customer);
        }
        fetchData();
        handleCloseModal();
    };

    const handleExportCSV = () => {
        const headers = ['Company Name', 'Contact Person', 'Mobile', 'Email', 'Area', 'City', 'GST', 'Address'];
        const csvContent = [
            headers.join(','),
            ...customers.map(c => [
                `"${c.companyName}"`,
                `"${c.contactPerson}"`,
                `"${c.mobile}"`,
                `"${c.email}"`,
                `"${c.area}"`,
                `"${c.city}"`,
                `"${c.gst || ''}"`,
                `"${c.address.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            if (!text) return;

            const lines = text.split('\n');
            const dataRows = lines.slice(1); // Skip header

            setLoading(true);
            let addedCount = 0;

            for (const row of dataRows) {
                // Simple CSV parser handling basic quotes
                const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                if (cols && cols.length >= 6) {
                    const clean = (val: string) => val ? val.replace(/^"|"$/g, '').trim() : '';

                    const newCustomer: Omit<Customer, 'id'> = {
                        companyName: clean(cols[0]),
                        contactPerson: clean(cols[1]),
                        mobile: clean(cols[2]),
                        email: clean(cols[3]),
                        area: clean(cols[4]),
                        city: clean(cols[5]),
                        gst: cols[6] ? clean(cols[6]) : '',
                        address: cols[7] ? clean(cols[7]) : ''
                    };

                    if (newCustomer.companyName && newCustomer.mobile) {
                        try {
                            await api.addCustomer(newCustomer);
                            addedCount++;
                        } catch (err) {
                            console.error('Failed to import row:', row, err);
                        }
                    }
                }
            }

            setLoading(false);
            fetchData();
            alert(`Imported ${addedCount} customers successfully!`);
            e.target.value = ''; // Reset input
        };
        reader.readAsText(file);
    };

    const filteredCustomers = customers.filter(c =>
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobile.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="flex justify-between">
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
                </div>
                <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            {isModalOpen && <Modal isOpen={true} title={editingCustomer ? "Edit Customer" : "Add New Customer"} onClose={handleCloseModal} allowOverflow>
                <CustomerForm onSave={handleSave} onCancel={handleCloseModal} customer={editingCustomer} />
            </Modal>}

            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Customers</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your client base and contact details.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto items-center">
                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm font-medium"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={handleExportCSV}
                            className="flex-1 md:flex-none px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center gap-2"
                            title="Export to CSV"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Export
                        </button>
                        <label className="flex-1 md:flex-none px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Import
                            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
                        </label>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex-1 md:flex-none px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Add Customer
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact Person</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact Info</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                            {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                                                {customer.companyName.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">{customer.companyName}</div>
                                                <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full inline-block mt-1">{customer.gst || 'No GST'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{customer.contactPerson}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col space-y-1">
                                            <a href={`tel:${customer.mobile}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-2 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                {customer.mobile}
                                            </a>
                                            <a href={`mailto:${customer.email}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-2 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                {customer.email}
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {customer.city}, {customer.area}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleOpenModal(customer)}
                                            className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Edit Customer"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            </div>
                                            <p className="text-lg font-medium text-slate-900 dark:text-white">No customers found</p>
                                            <p className="text-sm mt-1">Try adjusting your search or add a new customer.</p>
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
export default CustomersPage;