import React, { useState, useEffect, useCallback } from 'react';
import type { InventorySerial, Product, StockSummary, LowStockProduct } from '../types';
import { api } from '../services/api';
import StockInModal from '../components/StockInModal';
import { AlertTriangleIcon } from '../components/icons';

const LowStockAlerts: React.FC<{ items: LowStockProduct[] }> = ({ items }) => {
    if (items.length === 0) {
        return null;
    }
    return (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
            <div className="flex">
                <div className="flex-shrink-0">
                    <AlertTriangleIcon className="h-5 w-5 text-orange-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-orange-700 font-semibold">
                        Low Stock Alert
                    </p>
                    <div className="mt-2 text-sm text-orange-700">
                        <ul className="list-disc pl-5 space-y-1">
                            {items.map(item => (
                                <li key={item.productId}>
                                    <span className="font-medium">{item.brandName} {item.productName}</span> is low on stock. 
                                    Current: <span className="font-bold">{item.totalStock}</span>, Threshold: {item.lowStockThreshold}.
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};


const InventoryPage: React.FC = () => {
    const [serials, setSerials] = useState<InventorySerial[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [summary, setSummary] = useState<StockSummary[]>([]);
    const [lowStockItems, setLowStockItems] = useState<LowStockProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'summary' | 'serials'>('summary');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [serialsData, productsData, summaryData, lowStockData] = await Promise.all([
                api.getInventorySerials(),
                api.getAllProducts(),
                api.getStockSummary(),
                api.getLowStockProducts()
            ]);
            setSerials(serialsData);
            setProducts(productsData);
            setSummary(summaryData);
            setLowStockItems(lowStockData);
        } catch (error) {
            console.error("Failed to fetch inventory data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getProductName = (productId: number) => {
        const product = products.find(p => p.id === productId);
        return product ? `${product.brandName} ${product.model}` : 'Unknown Product';
    };
    
    const handleStockInSuccess = () => {
        // Refetch data to show the latest state
        fetchData();
    };

    const StatusBadge: React.FC<{ status: InventorySerial['status'] }> = ({ status }) => {
        const styles: Record<InventorySerial['status'], string> = {
            in_stock: 'bg-green-100 text-green-800',
            allocated: 'bg-blue-100 text-blue-800',
            installed: 'bg-slate-100 text-slate-800',
            returned: 'bg-yellow-100 text-yellow-800',
        };
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${styles[status] || styles.installed}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    const renderSummaryView = () => (
        <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Stock</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {summary.length > 0 ? summary.map((item) => (
                    <tr key={item.productId} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.brandName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 capitalize">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-bold">{item.totalStock}</td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={4} className="text-center px-6 py-12 text-slate-500">
                            No stock summary available.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    const renderSerialsView = () => (
         <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Serial Number</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {serials.length > 0 ? serials.map((item) => (
                    <tr key={item.serial} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">{item.serial}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{getProductName(item.productId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500"><StatusBadge status={item.status} /></td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={3} className="text-center px-6 py-12 text-slate-500">
                            No serialized items found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    return (
        <div className="space-y-8">
            {isModalOpen && <StockInModal onClose={() => setIsModalOpen(false)} onSuccess={handleStockInSuccess} />}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h2 className="text-3xl font-bold text-slate-800">Inventory Dashboard</h2>
                <button id="stock-in-btn" onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Stock In
                    <kbd className="ml-2 bg-primary-700 border border-primary-600 border-b-2 rounded px-1.5 py-0.5 text-xs font-mono">F2</kbd>
                </button>
            </div>

            <LowStockAlerts items={lowStockItems} />
            
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-slate-200">
                    <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                        <button onClick={() => setView('summary')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${view === 'summary' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                            Stock Summary
                        </button>
                        <button onClick={() => setView('serials')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${view === 'serials' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                            Serial Tracker
                        </button>
                    </nav>
                </div>
                <div className="overflow-x-auto">
                    {loading ? <div className="p-6 text-center">Loading inventory...</div> : (
                        view === 'summary' ? renderSummaryView() : renderSerialsView()
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;