import React, { useState, useEffect, useCallback } from 'react';
import type { Brand, Product } from '../types';
import { api } from '../services/api';
import CustomSelect from '../components/CustomSelect';
import Modal from '../components/Modal';
import StatsCard from '../components/StatsCard';
import { ArchiveBoxIcon, CheckBadgeIcon, TagIcon } from '@heroicons/react/24/outline';

const BrandForm: React.FC<{ brand?: Brand; onSave: (name: string) => void; onCancel: () => void; }> = ({ brand, onSave, onCancel }) => {
    const [name, setName] = useState(brand?.name || '');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="brandName" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Brand Name</label>
                <input
                    id="brandName"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white"
                    placeholder="e.g. Hikvision"
                />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]">Save Brand</button>
            </div>
        </form>
    );
};

const ProductForm: React.FC<{ brands: Brand[]; product?: Product; currentStock?: number; onSave: (productData: Omit<Product, 'id' | 'brandName'>, quantity?: number) => void; onCancel: () => void; }> = ({ brands, product, currentStock, onSave, onCancel }) => {
    const [brandId, setBrandId] = useState(product?.brandId.toString() || '');
    const [model, setModel] = useState(product?.model || '');
    const [category, setCategory] = useState<Product['category']>(product?.category || 'camera');
    const [isSerialized, setIsSerialized] = useState(product?.isSerialized ?? true);
    const [lowStockThreshold, setLowStockThreshold] = useState<number>(product?.lowStockThreshold ?? 10);
    const [hsnSacCode, setHsnSacCode] = useState(product?.hsnSacCode || '');
    const [gstRate, setGstRate] = useState<Product['gstRate']>(product?.gstRate || 18);
    const [quantity, setQuantity] = useState<number>(currentStock || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ brandId: parseInt(brandId), model, category, isSerialized, lowStockThreshold, hsnSacCode, gstRate }, quantity);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <CustomSelect
                        label="Brand"
                        options={brands.map(b => ({ value: b.id.toString(), label: b.name }))}
                        value={brandId}
                        onChange={setBrandId}
                        placeholder="Select Brand"
                    />
                </div>
                <div>
                    <label htmlFor="model" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Model Name</label>
                    <input id="model" type="text" value={model} onChange={e => setModel(e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" />
                </div>
                <div>
                    <CustomSelect
                        label="Category"
                        options={[
                            { value: 'camera', label: 'Camera' },
                            { value: 'nvr', label: 'NVR' },
                            { value: 'cable', label: 'Cable' },
                            { value: 'other', label: 'Other' }
                        ]}
                        value={category}
                        onChange={(val) => setCategory(val as Product['category'])}
                        placeholder="Select Category"
                    />
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">{product ? 'Update Stock' : 'Opening Stock'}</label>
                    <input id="quantity" type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 0)} min="0" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" />
                </div>
                <div>
                    <label htmlFor="lowStockThreshold" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Low Stock Alert</label>
                    <input id="lowStockThreshold" type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(parseInt(e.target.value) || 0)} required min="0" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" />
                </div>
                <div>
                    <label htmlFor="hsnSacCode" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">HSN/SAC Code</label>
                    <input id="hsnSacCode" type="text" value={hsnSacCode} onChange={e => setHsnSacCode(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white" />
                </div>
                <div>
                    <CustomSelect
                        label="GST Rate"
                        options={[
                            { value: '0', label: '0%' },
                            { value: '5', label: '5%' },
                            { value: '12', label: '12%' },
                            { value: '18', label: '18%' },
                            { value: '28', label: '28%' }
                        ]}
                        value={gstRate.toString()}
                        onChange={(val) => setGstRate(Number(val) as Product['gstRate'])}
                        placeholder="Select GST Rate"
                    />
                </div>
            </div>
            <div className="flex items-center pt-2">
                <input id="isSerialized" type="checkbox" checked={isSerialized} onChange={e => setIsSerialized(e.target.checked)} className="h-5 w-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500 transition-all cursor-pointer" />
                <label htmlFor="isSerialized" className="ml-3 block text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Track Serial Numbers for this product</label>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]">Save Product</button>
            </div>
        </form>
    )
};


const ProductsPage: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<'addBrand' | 'editBrand' | 'addProduct' | 'editProduct' | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>();
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBrandId, setFilterBrandId] = useState<number | null>(null);
    const [stockMap, setStockMap] = useState<Record<number, number>>({});

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [brandsData, productsData, stockData] = await Promise.all([
                api.getBrands(),
                api.getAllProducts(),
                api.getStockSummary()
            ]);
            setBrands(brandsData);
            setProducts(productsData);

            const stock: Record<number, number> = {};
            stockData.forEach(s => {
                stock[s.productId] = s.totalStock;
            });
            setStockMap(stock);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveBrand = async (name: string) => {
        if (modal === 'editBrand' && selectedBrand) {
            await api.updateBrand(selectedBrand.id, name);
        } else {
            await api.addBrand(name);
        }
        setModal(null);
        fetchData();
    };

    const handleDeleteBrand = async (brandId: number) => {
        if (confirm('Are you sure you want to delete this brand? Products associated with it might be affected.')) {
            try {
                await api.deleteBrand(brandId);
                fetchData();
            } catch (error) {
                console.error("Failed to delete brand:", error);
                alert("Failed to delete brand. Ensure no products are using it.");
            }
        }
    };

    const handleSaveProduct = async (productData: Omit<Product, 'id' | 'brandName'>, quantity?: number) => {
        if (modal === 'editProduct' && selectedProduct) {
            await api.updateProduct({ ...productData, id: selectedProduct.id }, quantity);
        } else {
            await api.addProduct(productData, quantity);
        }
        setModal(null);
        fetchData();
    };

    const filteredProducts = products.filter(product => {
        const matchesBrand = filterBrandId ? product.brandId === filterBrandId : true;
        const matchesSearch = product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brandName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesBrand && matchesSearch;
    });

    const stats = [
        { label: 'Total Products', value: products.length, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/20' },
        { label: 'Total Brands', value: brands.length, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/20' },
        { label: 'Serialized', value: products.filter(p => p.isSerialized).length, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
    ];

    if (loading) return (
        <div className="space-y-8 animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl lg:col-span-1"></div>
                <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl lg:col-span-3"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            {modal === 'addBrand' && <Modal isOpen={true} title="Add New Brand" onClose={() => setModal(null)} allowOverflow><BrandForm onSave={handleSaveBrand} onCancel={() => setModal(null)} /></Modal>}
            {modal === 'editBrand' && selectedBrand && <Modal isOpen={true} title="Edit Brand" onClose={() => setModal(null)} allowOverflow><BrandForm brand={selectedBrand} onSave={handleSaveBrand} onCancel={() => setModal(null)} /></Modal>}
            {modal === 'addProduct' && <Modal isOpen={true} title="Add New Product" onClose={() => setModal(null)} allowOverflow><ProductForm brands={brands} onSave={handleSaveProduct} onCancel={() => setModal(null)} /></Modal>}
            {modal === 'editProduct' && selectedProduct && <Modal isOpen={true} title="Edit Product" onClose={() => setModal(null)} allowOverflow><ProductForm brands={brands} product={selectedProduct} currentStock={stockMap[selectedProduct.id]} onSave={handleSaveProduct} onCancel={() => setModal(null)} /></Modal>}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Products & Brands</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your product catalog and brand definitions.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setModal('addBrand')} className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        + Add Brand
                    </button>
                    <button onClick={() => setModal('addProduct')} className="px-5 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]">
                        + Add Product
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Total Products" value={products.length} icon={<ArchiveBoxIcon />} gradient="blue" />
                <StatsCard title="Total Brands" value={brands.length} icon={<TagIcon />} gradient="purple" />
                <StatsCard title="Serialized" value={products.filter(p => p.isSerialized).length} icon={<CheckBadgeIcon />} gradient="teal" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Brands Column - Now Acts as Filter */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)] sticky top-24">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Filter by Brand</h3>
                        </div>
                        <div className="overflow-y-auto flex-1 custom-scrollbar p-3 space-y-1">
                            <button
                                onClick={() => setFilterBrandId(null)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex justify-between items-center group ${filterBrandId === null
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 ring-1 ring-primary-200 dark:ring-primary-800'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span>All Brands</span>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs py-0.5 px-2 rounded-full group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">{products.length}</span>
                            </button>
                            {brands.map(brand => {
                                const count = products.filter(p => p.brandId === brand.id).length;
                                return (
                                    <div key={brand.id} className="group relative flex items-center">
                                        <button
                                            onClick={() => setFilterBrandId(brand.id)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex justify-between items-center ${filterBrandId === brand.id
                                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 ring-1 ring-primary-200 dark:ring-primary-800'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <span className="truncate pr-16">{brand.name}</span>
                                            <span className={`text-xs py-0.5 px-2 rounded-full transition-all duration-200 group-hover:opacity-0 ${filterBrandId === brand.id ? 'bg-white dark:bg-slate-800 text-primary-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-white dark:group-hover:bg-slate-700'}`}>{count}</span>
                                        </button>

                                        {/* Brand Actions: Edit & Delete */}
                                        <div className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedBrand(brand); setModal('editBrand'); }}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
                                                title="Edit Brand"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteBrand(brand.id); }}
                                                className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
                                                title="Delete Brand"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Products Column */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                Products
                                <span className="text-xs font-medium px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">{filteredProducts.length}</span>
                            </h3>
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search model or brand..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                />
                                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Model</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Brand</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tax Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Specs</th>
                                        <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800 dark:text-white">{product.model}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                    {product.brandName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${(stockMap[product.id] || 0) <= product.lowStockThreshold
                                                    ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                                                    }`}>
                                                    {stockMap[product.id] || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-slate-500">HSN: <span className="text-slate-700 dark:text-slate-300">{product.hsnSacCode || '-'}</span></span>
                                                    <span className="text-xs font-medium text-slate-500">GST: <span className="text-slate-700 dark:text-slate-300">{product.gstRate ?? 0}%</span></span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex gap-2">
                                                    {product.isSerialized && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800/30">SERIALIZED</span>
                                                    )}
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800/30">
                                                        LOW STOCK: {product.lowStockThreshold}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() => { setSelectedProduct(product); setModal('editProduct'); }}
                                                    className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    title="Edit Product"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                                <div className="flex flex-col items-center justify-center">
                                                    <p className="text-base font-medium">No products found.</p>
                                                    <p className="text-sm mt-1 text-slate-400">Try adjusting your filters or search.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductsPage;