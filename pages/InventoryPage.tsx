import React, { useState, useEffect, useCallback } from 'react';
import type { InventorySerial, Product, StockSummary, LowStockProduct } from '../types';
import { api } from '../services/api';
import StockInModal from '../components/StockInModal';
import { AlertTriangleIcon } from '../components/icons';
import Skeleton from '../components/Skeleton';
import PageHeader from '../components/PageHeader';

const LowStockAlerts: React.FC<{ items: LowStockProduct[] }> = ({ items }) => {
    if (items.length === 0) {
        return null;
    }
    return (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 p-4 rounded-2xl shadow-sm mb-8 flex items-start animate-fade-in-up">
            <div className="p-2 bg-orange-100 dark:bg-orange-800/40 rounded-xl shrink-0">
                <AlertTriangleIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            </div>
            <div className="ml-4 flex-1">
                <h3 className="text-sm font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wide">
                    Low Stock Attention Needed
                </h3>
                <div className="mt-3 text-sm text-orange-700 dark:text-orange-400">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {items.map(item => (
                            <li key={item.productId} className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-orange-100 dark:border-orange-800/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                <span className="truncate">
                                    <span className="font-bold">{item.brandName} {item.productName}</span> <span className="mx-1 text-orange-300">|</span> <span className="font-bold">{item.totalStock}</span> Left
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
        fetchData();
    };

    const StatusBadge: React.FC<{ status: InventorySerial['status'] }> = ({ status }) => {
        const styles: Record<InventorySerial['status'], string> = {
            in_stock: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
            allocated: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
            installed: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600',
            returned: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
        };
        return (
            <span className={`px-2.5 py-1 inline-flex text-[10px] uppercase tracking-wide font-bold rounded-lg border ${styles[status] || styles.installed}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    const renderSummaryView = () => (
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Brand</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Stock</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                {summary.length > 0 ? summary.map((item) => (
                    <tr key={item.productId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {item.brandName}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 capitalize">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold border ${item.totalStock < 5 ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'}`}>
                                {item.totalStock} Units
                            </span>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={4} className="text-center px-6 py-20 text-slate-500 dark:text-slate-400">
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0l-8 4-8-4M4 7l8 4 8-4M4 7v13l8-4 8 4V7" /></svg>
                                </div>
                                <p className="text-base font-bold text-slate-700 dark:text-white">No stock summary available</p>
                                <p className="text-sm mt-1">Add stock to see summary.</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    const renderSerialsView = () => (
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Serial Number</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                {serials.length > 0 ? serials.map((item) => (
                    <tr key={item.serial} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <code className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                                {item.serial}
                            </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-bold">{getProductName(item.productId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.status} /></td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={3} className="text-center px-6 py-20 text-slate-500 dark:text-slate-400">
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                </div>
                                <p className="text-base font-bold text-slate-700 dark:text-white">No items found</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    const renderSkeleton = () => (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden animate-pulse min-h-[400px]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <Skeleton width={200} height={40} className="rounded-xl" />
            </div>
            <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800/50">
                        <Skeleton width="30%" height={24} />
                        <Skeleton width="20%" height={24} />
                        <Skeleton width="15%" height={24} />
                        <Skeleton width="10%" height={24} />
                    </div>
                ))}
            </div>
        </div>
    );


    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {isModalOpen && <StockInModal onClose={() => setIsModalOpen(false)} onSuccess={handleStockInSuccess} />}

            <PageHeader
                title="Inventory"
                description="Centralized stock management. Track product availability, low stock alerts, and serial numbers."
                action={
                    <button id="stock-in-btn" onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 active:scale-95">
                        <span className="mr-2 text-lg leading-none">+</span> Stock In
                    </button>
                }
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-bold text-white">{products.length}</p>
                        <p className="text-xs text-primary-200 font-bold uppercase tracking-widest mt-1">Products</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-bold text-emerald-300">{summary.reduce((acc, s) => acc + s.totalStock, 0)}</p>
                        <p className="text-xs text-emerald-200 font-bold uppercase tracking-widest mt-1">Total Items</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-bold text-amber-300">{serials.filter(s => s.status === 'allocated').length}</p>
                        <p className="text-xs text-amber-200 font-bold uppercase tracking-widest mt-1">Allocated</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-bold text-rose-300">{lowStockItems.length}</p>
                        <p className="text-xs text-rose-200 font-bold uppercase tracking-widest mt-1">Low Stock</p>
                    </div>
                </div>
            </PageHeader>

            <LowStockAlerts items={lowStockItems} />

            {loading ? renderSkeleton() : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col transition-all duration-300 min-h-[500px]">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center backdrop-blur-sm">
                        <nav className="flex space-x-1 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl w-fit shadow-sm" aria-label="Tabs">
                            <button
                                onClick={() => setView('summary')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'summary'
                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                Stock Summary
                            </button>
                            <button
                                onClick={() => setView('serials')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'serials'
                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                Serial Tracker
                            </button>
                        </nav>

                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">
                            {view === 'summary' ? 'Aggregated View' : 'Itemized View'}
                        </div>
                    </div>
                    <div className="overflow-x-auto flex-1 bg-slate-50/30 dark:bg-black/20 p-6">
                        <div className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            {view === 'summary' ? renderSummaryView() : renderSerialsView()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;