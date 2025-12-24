import React, { useState, useEffect, useCallback } from 'react';
import type { InventorySerial, Product, StockSummary, LowStockProduct } from '../types';
import { api } from '../services/api';
import StockInModal from '../components/StockInModal';
import { AlertTriangleIcon } from '../components/icons';
import Skeleton from '../components/Skeleton';

const LowStockAlerts: React.FC<{ items: LowStockProduct[] }> = ({ items }) => {
    if (items.length === 0) {
        return null;
    }
    return (
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 p-4 rounded-xl shadow-sm mb-6 flex items-start animate-fade-in-up">
            <div className="p-2 bg-orange-100 dark:bg-orange-800/30 rounded-lg shrink-0">
                <AlertTriangleIcon className="h-5 w-5 text-orange-500 dark:text-orange-400" aria-hidden="true" />
            </div>
            <div className="ml-4 flex-1">
                <h3 className="text-sm font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wide">
                    Low Stock Attention Needed
                </h3>
                <div className="mt-2 text-sm text-orange-700 dark:text-orange-400">
                    <ul className="space-y-1.5">
                        {items.map(item => (
                            <li key={item.productId} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                                <span>
                                    <span className="font-bold">{item.brandName} {item.productName}</span> — Only <span className="font-bold">{item.totalStock}</span> left (Threshold: {item.lowStockThreshold})
                                </span>
                            </li>
                        ))}
                    </ul>
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
            // Add slight delay to prevent flicker and show skeleton
            const delay = new Promise(resolve => setTimeout(resolve, 600));
            const [serialsData, productsData, summaryData, lowStockData] = await Promise.all([
                api.getInventorySerials(),
                api.getAllProducts(),
                api.getStockSummary(),
                api.getLowStockProducts(),
                delay
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
            in_stock: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
            allocated: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
            installed: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600',
            returned: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
        };
        return (
            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full capitalize border ${styles[status] || styles.installed}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    const renderSummaryView = () => (
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Brand</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Stock</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                {summary.length > 0 ? summary.map((item) => (
                    <tr key={item.productId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {item.brandName}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 capitalize">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                            <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${item.totalStock < 5 ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'}`}>
                                {item.totalStock} Units
                            </span>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={4} className="text-center px-6 py-12 text-slate-500 dark:text-slate-400">
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-base font-medium">No stock summary available.</p>
                                <p className="text-sm mt-1">Add stock to see summary.</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    const renderSerialsView = () => (
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Serial Number</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                {serials.length > 0 ? serials.map((item) => (
                    <tr key={item.serial} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/50 rounded-md px-2 py-1 mx-6 w-fit inline-block mt-2 mb-2 border border-slate-200 dark:border-slate-700 text-center min-w-[120px]">{item.serial}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium">{getProductName(item.productId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.status} /></td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={3} className="text-center px-6 py-12 text-slate-500 dark:text-slate-400">
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-base font-medium">No serialized items found.</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    const renderSkeleton = () => (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex space-x-6">
                    <Skeleton width={120} height={32} />
                    <Skeleton width={120} height={32} />
                </div>
            </div>
            <div className="p-6">
                {/* Table Header Skeleton */}
                <div className="flex justify-between mb-4">
                    <Skeleton width="15%" height={20} />
                    <Skeleton width="15%" height={20} />
                    <Skeleton width="15%" height={20} />
                    <Skeleton width="15%" height={20} />
                </div>
                {/* Table Rows Skeleton */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between mb-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <Skeleton width="20%" height={20} />
                        <Skeleton width="20%" height={20} />
                        <Skeleton width="20%" height={20} />
                        <Skeleton width="10%" height={20} />
                    </div>
                ))}
            </div>
        </div>
    );


    return (
        <div className="space-y-8 animate-fade-in-up">
            {isModalOpen && <StockInModal onClose={() => setIsModalOpen(false)} onSuccess={handleStockInSuccess} />}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Inventory</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your centralized stock and items.</p>
                </div>

                <button id="stock-in-btn" onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-95">
                    <span className="mr-2 text-lg leading-none">+</span> Stock In
                </button>
            </div>

            <LowStockAlerts items={lowStockItems} />

            {loading ? renderSkeleton() : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-300">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <nav className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit" aria-label="Tabs">
                            <button
                                onClick={() => setView('summary')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'summary'
                                    ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                Stock Summary
                            </button>
                            <button
                                onClick={() => setView('serials')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'serials'
                                    ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                Serial Tracker
                            </button>
                        </nav>
                    </div>
                    <div className="overflow-x-auto">
                        {view === 'summary' ? renderSummaryView() : renderSerialsView()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;