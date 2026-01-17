import React, { useState, useEffect, useCallback } from 'react';
import type { Supplier } from '../types';
import { api } from '../services/api';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { PlusIcon } from '../components/icons'; // Assuming PlusIcon exists or use SVG

const SupplierForm: React.FC<{ supplier?: Supplier; onSave: (supplier: Omit<Supplier, 'id' | 'user_id' | 'created_at'> | Supplier) => void; onCancel: () => void; }> = ({ supplier, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Supplier, 'id' | 'user_id' | 'created_at'>>({
        brand_name: supplier?.brand_name || '',
        sales_person_name: supplier?.sales_person_name || '',
        sales_person_mobile: supplier?.sales_person_mobile || '',
        manager_name: supplier?.manager_name || '',
        manager_mobile: supplier?.manager_mobile || '',
        distributor_name: supplier?.distributor_name || '',
        service_center_details: supplier?.service_center_details || '',
        service_center_number: supplier?.service_center_number || '',
        product_categories: supplier?.product_categories || '',
        notes: supplier?.notes || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(supplier ? { ...formData, id: supplier.id } : formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b pb-2 mb-4 dark:border-slate-700">Company & Sales Person Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="brand_name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Brand Name</label>
                    <input type="text" id="brand_name" name="brand_name" value={formData.brand_name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="e.g. Hikvision" />
                </div>
                <div>
                    <label htmlFor="distributor_name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Distributor Company Name</label>
                    <input type="text" id="distributor_name" name="distributor_name" value={formData.distributor_name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="e.g. Balaji Electronics" />
                </div>
                <div>
                    <label htmlFor="sales_person_name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Sales Person Name</label>
                    <input type="text" id="sales_person_name" name="sales_person_name" value={formData.sales_person_name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="Name" />
                </div>
                <div>
                    <label htmlFor="sales_person_mobile" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Sales Person Mobile</label>
                    <input type="tel" id="sales_person_mobile" name="sales_person_mobile" value={formData.sales_person_mobile} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="Mobile" />
                </div>
            </div>

            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b pb-2 mb-4 pt-4 dark:border-slate-700">Manager & Service Center</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="manager_name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Manager Name</label>
                    <input type="text" id="manager_name" name="manager_name" value={formData.manager_name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="Manager Name" />
                </div>
                <div>
                    <label htmlFor="manager_mobile" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Manager Mobile</label>
                    <input type="tel" id="manager_mobile" name="manager_mobile" value={formData.manager_mobile} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="Manager Mobile" />
                </div>
                <div>
                    <label htmlFor="service_center_number" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Service Center Number</label>
                    <input type="tel" id="service_center_number" name="service_center_number" value={formData.service_center_number} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="Service Center #" />
                </div>
                <div>
                    <label htmlFor="product_categories" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Product Categories</label>
                    <input type="text" id="product_categories" name="product_categories" value={formData.product_categories} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="e.g. CCTV, Access Control" />
                </div>
            </div>
            <div>
                <label htmlFor="service_center_details" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Service Center Details/Address</label>
                <textarea id="service_center_details" name="service_center_details" value={formData.service_center_details} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="Address or other details..." />
            </div>
            <div>
                <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Notes</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" placeholder="Additional notes..." />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]">Save Supplier</button>
            </div>
        </form>
    );
};


const SuppliersPage: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getSuppliers();
            setSuppliers(data);
        } catch (error) {
            console.error("Failed to fetch suppliers", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (supplier?: Supplier) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSupplier(undefined);
    };

    const handleSave = async (supplier: Omit<Supplier, 'id' | 'user_id' | 'created_at'> | Supplier) => {
        if ('id' in supplier) {
            await api.updateSupplier(supplier.id, supplier);
        } else {
            await api.addSupplier(supplier);
        }
        fetchData();
        handleCloseModal();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            await api.deleteSupplier(id);
            fetchData();
        }
    }

    const filteredSuppliers = suppliers.filter(s =>
        s.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sales_person_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.distributor_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-3xl mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                    <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                    <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {isModalOpen && <Modal isOpen={true} title={editingSupplier ? "Edit Supplier" : "Add New Supplier"} onClose={handleCloseModal} allowOverflow maxWidth="max-w-2xl">
                <SupplierForm onSave={handleSave} onCancel={handleCloseModal} supplier={editingSupplier} />
            </Modal>}

            <PageHeader
                title="Suppliers"
                description="Manage sales persons, distributors, and service center contacts."
                action={
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 whitespace-nowrap"
                    >
                        <span className="mr-2 text-lg leading-none">+</span> Add Supplier
                    </button>
                }
            >
                {/* Embedded Stats in Header */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-bold text-white">{suppliers.length}</p>
                        <p className="text-xs text-primary-200 font-bold uppercase tracking-widest mt-1">Total</p>
                    </div>
                </div>
            </PageHeader>

            {/* Toolbar Area */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by brand, name or distributor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm font-bold text-slate-800 dark:text-white placeholder:font-medium"
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSuppliers.length > 0 ? filteredSuppliers.map((supplier) => (
                    <div key={supplier.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-primary-500/30 transition-all duration-300 overflow-hidden flex flex-col group p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white">{supplier.brand_name}</h3>
                                {supplier.distributor_name && <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{supplier.distributor_name}</p>}
                            </div>
                            <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 shadow-lg shadow-primary-500/20 flex items-center justify-center text-white font-bold text-xl border border-white/10">
                                {supplier.brand_name.charAt(0)}
                            </div>
                        </div>

                        <div className="space-y-4 flex-grow">
                            {supplier.sales_person_name && (
                                <div className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                    <div className="mt-0.5 p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm"><svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{supplier.sales_person_name}</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Sales Person</p>
                                        {supplier.sales_person_mobile && <a href={`tel:${supplier.sales_person_mobile}`} className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">{supplier.sales_person_mobile}</a>}
                                    </div>
                                </div>
                            )}

                            {supplier.manager_name && (
                                <div className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                    <div className="mt-0.5 p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm"><svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{supplier.manager_name}</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Manager</p>
                                        {supplier.manager_mobile && <a href={`tel:${supplier.manager_mobile}`} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">{supplier.manager_mobile}</a>}
                                    </div>
                                </div>
                            )}

                            {(supplier.service_center_number || supplier.service_center_details) && (
                                <div className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                    <div className="mt-0.5 p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm"><svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Service Center</p>
                                        {supplier.service_center_number && <a href={`tel:${supplier.service_center_number}`} className="text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline block">{supplier.service_center_number}</a>}
                                        {supplier.service_center_details && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-medium">{supplier.service_center_details}</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDelete(supplier.id)} className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors" title="Delete">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                            <button onClick={() => handleOpenModal(supplier)} className="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Edit">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                        <p className="text-xl font-bold text-slate-700 dark:text-slate-300">No suppliers found</p>
                        <p className="text-sm mt-1 mb-6">Add your supplier contacts to manage them here.</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-6 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30 transition-all"
                        >
                            Add Your First Supplier
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuppliersPage;
