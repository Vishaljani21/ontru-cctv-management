import React, { useState, useEffect, useCallback } from 'react';
import type { Customer } from '../types';
import { api } from '../services/api';

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; }> = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
                <button onClick={onClose} className="text-2xl font-light text-slate-500 hover:text-slate-800">&times;</button>
            </div>
            {children}
        </div>
    </div>
);

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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Contact Person" required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="Area" required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
            </div>
             <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Full Address" required rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
             <input type="text" name="gst" value={formData.gst} onChange={handleChange} placeholder="GST Number (Optional)" className="w-full px-3 py-2 border border-slate-300 rounded-md" />
             <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">Save Customer</button>
            </div>
        </form>
    );
};


const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();

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


    if (loading) {
        return <div>Loading customers...</div>;
    }

    return (
        <div className="space-y-8">
            {isModalOpen && <Modal title={editingCustomer ? "Edit Customer" : "Add New Customer"} onClose={handleCloseModal}>
                <CustomerForm onSave={handleSave} onCancel={handleCloseModal} customer={editingCustomer} />
            </Modal>}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h2 className="text-3xl font-bold text-slate-800">Customers</h2>
                <button id="add-customer-btn" onClick={() => handleOpenModal()} className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Add Customer
                    <kbd className="ml-2 bg-primary-700 border border-primary-600 border-b-2 rounded px-1.5 py-0.5 text-xs font-mono">F2</kbd>
                </button>
            </div>
            
             <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{customer.companyName}</div>
                                        <div className="text-sm text-slate-500">{customer.gst || 'No GST'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900">{customer.contactPerson}</div>
                                        <div className="text-sm text-slate-500">{customer.mobile}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{customer.area}, {customer.city}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleOpenModal(customer)} className="text-primary-600 hover:text-primary-800">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomersPage;