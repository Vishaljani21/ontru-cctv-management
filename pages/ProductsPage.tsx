import React, { useState, useEffect, useCallback } from 'react';
import type { Brand, Product } from '../types';
import { api } from '../services/api';

// Reusable Modal Component
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; }> = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800">&times;</button>
            </div>
            {children}
        </div>
    </div>
);


const BrandForm: React.FC<{ brand?: Brand; onSave: (name: string) => void; onCancel: () => void; }> = ({ brand, onSave, onCancel }) => {
    const [name, setName] = useState(brand?.name || '');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="brandName" className="block text-sm font-medium text-slate-700">Brand Name</label>
                <input id="brandName" type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">Save Brand</button>
            </div>
        </form>
    );
};

const ProductForm: React.FC<{ brands: Brand[]; product?: Product; onSave: (productData: Omit<Product, 'id' | 'brandName'>) => void; onCancel: () => void; }> = ({ brands, product, onSave, onCancel }) => {
    const [brandId, setBrandId] = useState(product?.brandId.toString() || '');
    const [model, setModel] = useState(product?.model || '');
    const [category, setCategory] = useState<Product['category']>(product?.category || 'camera');
    const [isSerialized, setIsSerialized] = useState(product?.isSerialized ?? true);
    const [lowStockThreshold, setLowStockThreshold] = useState<number>(product?.lowStockThreshold ?? 10);
    const [hsnSacCode, setHsnSacCode] = useState(product?.hsnSacCode || '');
    const [gstRate, setGstRate] = useState<Product['gstRate']>(product?.gstRate || 18);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ brandId: parseInt(brandId), model, category, isSerialized, lowStockThreshold, hsnSacCode, gstRate });
    };

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-slate-700">Brand</label>
                    <select id="brand" value={brandId} onChange={e => setBrandId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                        <option value="" disabled>Select a brand</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="model" className="block text-sm font-medium text-slate-700">Model Name</label>
                    <input id="model" type="text" value={model} onChange={e => setModel(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value as Product['category'])} required className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                        <option value="camera">Camera</option>
                        <option value="nvr">NVR</option>
                        <option value="cable">Cable</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                     <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-slate-700">Low Stock Threshold</label>
                     <input id="lowStockThreshold" type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(parseInt(e.target.value) || 0)} required min="0" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                 <div>
                     <label htmlFor="hsnSacCode" className="block text-sm font-medium text-slate-700">HSN/SAC Code</label>
                     <input id="hsnSacCode" type="text" value={hsnSacCode} onChange={e => setHsnSacCode(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                 <div>
                     <label htmlFor="gstRate" className="block text-sm font-medium text-slate-700">GST Rate</label>
                     <select id="gstRate" value={gstRate} onChange={e => setGstRate(Number(e.target.value) as Product['gstRate'])} required className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                        <option value={28}>28%</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center pt-2">
                <input id="isSerialized" type="checkbox" checked={isSerialized} onChange={e => setIsSerialized(e.target.checked)} className="h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                <label htmlFor="isSerialized" className="ml-2 block text-sm text-slate-900">This product has a unique serial number</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">Save Product</button>
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

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [brandsData, productsData] = await Promise.all([
                api.getBrands(),
                api.getAllProducts()
            ]);
            setBrands(brandsData);
            setProducts(productsData);
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
    
    const handleSaveProduct = async (productData: Omit<Product, 'id' | 'brandName'>) => {
        if (modal === 'editProduct' && selectedProduct) {
            await api.updateProduct({ ...productData, id: selectedProduct.id });
        } else {
            await api.addProduct(productData);
        }
        setModal(null);
        fetchData();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            {modal === 'addBrand' && <Modal title="Add New Brand" onClose={() => setModal(null)}><BrandForm onSave={handleSaveBrand} onCancel={() => setModal(null)} /></Modal>}
            {modal === 'editBrand' && selectedBrand && <Modal title="Edit Brand" onClose={() => setModal(null)}><BrandForm brand={selectedBrand} onSave={handleSaveBrand} onCancel={() => setModal(null)} /></Modal>}
            {modal === 'addProduct' && <Modal title="Add New Product" onClose={() => setModal(null)}><ProductForm brands={brands} onSave={handleSaveProduct} onCancel={() => setModal(null)} /></Modal>}
            {modal === 'editProduct' && selectedProduct && <Modal title="Edit Product" onClose={() => setModal(null)}><ProductForm brands={brands} product={selectedProduct} onSave={handleSaveProduct} onCancel={() => setModal(null)} /></Modal>}
            
            <h2 className="text-3xl font-bold text-slate-800">Brand & Product Management</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Brands Column */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-800">Brands</h3>
                            <button id="add-brand-btn" onClick={() => setModal('addBrand')} className="flex items-center px-3 py-1 text-sm font-semibold text-white bg-primary-500 rounded-md hover:bg-primary-600">
                                + <kbd className="ml-2 bg-primary-700 border border-primary-600 border-b-2 rounded px-1.5 py-0.5 text-xs font-mono">F3</kbd>
                            </button>
                        </div>
                        <ul className="divide-y divide-slate-200">
                            {brands.map(brand => (
                                <li key={brand.id} className="p-4 flex justify-between items-center">
                                    <span className="font-medium text-slate-700">{brand.name}</span>
                                    <button onClick={() => { setSelectedBrand(brand); setModal('editBrand'); }} className="text-sm text-primary-600 hover:underline">Edit</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Products Column */}
                <div className="lg:col-span-2">
                     <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-800">Products</h3>
                            <button id="add-product-btn" onClick={() => setModal('addProduct')} className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-primary-500 rounded-md hover:bg-primary-600">
                                Add Product
                                <kbd className="ml-2 bg-primary-700 border border-primary-600 border-b-2 rounded px-1.5 py-0.5 text-xs font-mono">F2</kbd>
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Model</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">HSN/GST</th>
                                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{product.model}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-500">{product.brandName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                                <div>{product.hsnSacCode || '-'}</div>
                                                <div className="text-xs">{product.gstRate ?? 0}%</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => { setSelectedProduct(product); setModal('editProduct'); }} className="text-primary-600 hover:text-primary-800">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
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