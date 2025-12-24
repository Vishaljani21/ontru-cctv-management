import React, { useState, useEffect, useCallback } from 'react';
import type { Godown, GodownStock } from '../types';
import { api } from '../services/api';
import Modal from '../components/Modal';

const GodownForm: React.FC<{
    godown?: Godown;
    onSave: (data: { name: string; location: string }) => void;
    onCancel: () => void;
}> = ({ godown, onSave, onCancel }) => {
    const [name, setName] = useState(godown?.name || '');
    const [location, setLocation] = useState(godown?.location || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, location });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Godown Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white"
                    placeholder="e.g. Main Warehouse"
                />
            </div>
            <div>
                <label htmlFor="location" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Location</label>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white"
                    placeholder="e.g. Building A, Floor 2"
                />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]">Save Godown</button>
            </div>
        </form>
    );
};


const GodownsPage: React.FC = () => {
    const [godowns, setGodowns] = useState<Godown[]>([]);
    const [selectedGodown, setSelectedGodown] = useState<Godown | null>(null);
    const [stock, setStock] = useState<GodownStock[]>([]);
    const [loadingGodowns, setLoadingGodowns] = useState(true);
    const [loadingStock, setLoadingStock] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGodown, setEditingGodown] = useState<Godown | undefined>();

    const fetchData = useCallback(async () => {
        setLoadingGodowns(true);
        try {
            const data = await api.getGodowns();
            setGodowns(data);
            if (data.length > 0 && !selectedGodown) {
                handleSelectGodown(data[0]);
            } else if (data.length === 0) {
                setSelectedGodown(null);
                setStock([]);
            }
        } catch (error) {
            console.error("Failed to fetch godowns", error);
        } finally {
            setLoadingGodowns(false);
        }
    }, [selectedGodown]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSelectGodown = async (godown: Godown) => {
        setSelectedGodown(godown);
        setLoadingStock(true);
        try {
            const stockData = await api.getGodownStock(godown.id);
            setStock(stockData);
        } catch (error) {
            console.error(`Failed to fetch stock for ${godown.name}`, error);
            setStock([]);
        } finally {
            setLoadingStock(false);
        }
    };

    const handleOpenModal = (godown?: Godown) => {
        setEditingGodown(godown);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingGodown(undefined);
    };

    const handleSaveGodown = async (data: { name: string; location: string }) => {
        if (editingGodown) {
            await api.updateGodown(editingGodown.id, data.name, data.location);
        } else {
            await api.addGodown(data.name, data.location);
        }
        handleCloseModal();
        fetchData();
    };

    const handleDeleteGodown = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this godown? This action cannot be undone.')) {
            await api.deleteGodown(id);
            if (selectedGodown?.id === id) {
                setSelectedGodown(null);
                setStock([]);
            }
            fetchData();
        }
    };


    if (loadingGodowns) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl lg:col-span-1"></div>
                    <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl lg:col-span-2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            {isModalOpen && (
                <Modal isOpen={true} title={editingGodown ? "Edit Godown" : "Add New Godown"} onClose={handleCloseModal} allowOverflow>
                    <GodownForm godown={editingGodown} onSave={handleSaveGodown} onCancel={handleCloseModal} />
                </Modal>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Godown Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your Godown Locations.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                    + Add Godown
                </button>
            </div>

            {godowns.length === 0 ? (
                <div className="text-center py-20 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Godowns Found</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Start by adding a godown or warehouse to manage your inventory stock locations.</p>
                    <button onClick={() => handleOpenModal()} className="mt-6 px-6 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]">
                        Create First Godown
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Godown List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm flex justify-between items-center">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Godowns</h3>
                                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">{godowns.length}</span>
                            </div>
                            <div className="overflow-y-auto flex-1 custom-scrollbar p-3 space-y-2">
                                {godowns.map(godown => (
                                    <div
                                        key={godown.id}
                                        onClick={() => handleSelectGodown(godown)}
                                        className={`group relative p-4 rounded-xl cursor-pointer border transition-all duration-200 ${selectedGodown?.id === godown.id
                                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 ring-1 ring-primary-200 dark:ring-primary-800'
                                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className={`font-bold text-base ${selectedGodown?.id === godown.id ? 'text-primary-700 dark:text-primary-300' : 'text-slate-800 dark:text-white'}`}>{godown.name}</h4>
                                                <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    <span className="truncate max-w-[180px]">{godown.location}</span>
                                                </div>
                                            </div>
                                            {selectedGodown?.id === godown.id && (
                                                <span className="flex h-3 w-3 relative transition-opacity group-hover:opacity-0">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-lg shadow-sm" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleOpenModal(godown); }}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteGodown(godown.id); }}
                                                className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stock Details */}
                    <div className="lg:col-span-2">
                        {selectedGodown ? (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Current Stock</h3>
                                            <p className="text-xs text-slate-500 font-medium">at {selectedGodown.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Refresh">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto flex-1 custom-scrollbar">
                                    {loadingStock ? (
                                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                                            <p className="text-slate-500 font-medium animate-pulse">Checking shelves...</p>
                                        </div>
                                    ) : (
                                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                            <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Brand</th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantity</th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                                {stock.length > 0 ? stock.map(item => (
                                                    <tr key={item.productId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 dark:text-white">{item.productName}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                                {item.brand}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="text-sm font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                                                {item.quantity}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {item.quantity <= 10 ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800/30">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                                                    Low Stock
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                                    In Stock
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center justify-center">
                                                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                                                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                                </div>
                                                                <p className="text-base font-medium text-slate-600 dark:text-slate-300">No stock found</p>
                                                                <p className="text-sm text-slate-400">This godown is currently empty.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[600px] p-6 bg-white/50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Select a Godown</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-xs text-center mt-2">Choose a warehouse from the list to view and manage its inventory stock levels.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default GodownsPage;