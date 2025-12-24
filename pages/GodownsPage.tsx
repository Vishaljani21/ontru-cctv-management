import React, { useState, useEffect, useCallback } from 'react';
import type { Godown, GodownStock } from '../types';
import { api } from '../services/api';

const GodownFormModal: React.FC<{
    godown?: Godown;
    onSave: (data: { name: string; location: string }) => void;
    onClose: () => void;
}> = ({ godown, onSave, onClose }) => {
    const [name, setName] = useState(godown?.name || '');
    const [location, setLocation] = useState(godown?.location || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, location });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">{godown ? 'Edit Godown' : 'Add New Godown'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Godown Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-slate-700">Location</label>
                        <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">Save</button>
                    </div>
                </form>
            </div>
        </div>
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
        return <div>Loading godowns...</div>;
    }

    return (
        <div className="space-y-8">
            {isModalOpen && <GodownFormModal godown={editingGodown} onSave={handleSaveGodown} onClose={handleCloseModal} />}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h2 className="text-3xl font-bold text-slate-800">Godown Management</h2>
                <button id="add-godown-btn" onClick={() => handleOpenModal()} className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Add Godown
                    <kbd className="ml-2 bg-primary-700 border border-primary-600 border-b-2 rounded px-1.5 py-0.5 text-xs font-mono">F2</kbd>
                </button>
            </div>
            
            {godowns.length === 0 ? (
                 <div className="text-center py-12 px-6 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-700">No Godowns Found</h3>
                    <p className="mt-2 text-sm text-slate-500">Click "Add Godown" to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                             <h3 className="p-4 text-lg font-semibold text-slate-800 border-b border-slate-200">Godowns</h3>
                             <ul className="divide-y divide-slate-200">
                                 {godowns.map(godown => (
                                    <li key={godown.id} className={`p-4 hover:bg-slate-50 ${selectedGodown?.id === godown.id ? 'bg-primary-50' : ''}`}>
                                        <div onClick={() => handleSelectGodown(godown)} className="cursor-pointer">
                                            <p className={`font-semibold ${selectedGodown?.id === godown.id ? 'text-primary-800' : 'text-slate-800'}`}>{godown.name}</p>
                                            <p className="text-sm text-slate-500">{godown.location}</p>
                                        </div>
                                        <div className="flex items-center space-x-3 mt-2">
                                            <button onClick={() => handleOpenModal(godown)} className="text-xs font-medium text-primary-600 hover:text-primary-800">Edit</button>
                                            <button onClick={() => handleDeleteGodown(godown.id)} className="text-xs font-medium text-red-600 hover:text-red-800">Delete</button>
                                        </div>
                                    </li>
                                 ))}
                             </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        {selectedGodown ? (
                            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                                 <h3 className="p-6 text-lg font-semibold text-slate-800 border-b border-slate-200">
                                    Stock at {selectedGodown.name}
                                </h3>
                                <div className="overflow-x-auto">
                                    {loadingStock ? <div className="p-6">Loading stock...</div> : (
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-200">
                                            {stock.length > 0 ? stock.map(item => (
                                                <tr key={item.productId} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.productName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.brand}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-bold">{item.quantity}</td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500">No stock found in this godown.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
                                <p className="text-slate-500">Select a godown to view its stock.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GodownsPage;