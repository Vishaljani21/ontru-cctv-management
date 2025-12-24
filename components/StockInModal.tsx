
import React, { useState, useEffect, useMemo } from 'react';
import type { Godown, Product, Brand } from '../types';
import { api } from '../services/api';
import { CameraIcon } from './icons';
import BarcodeScanner from './BarcodeScanner';

interface StockInModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const StockInModal: React.FC<StockInModalProps> = ({ onClose, onSuccess }) => {
  const [godowns, setGodowns] = useState<Godown[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [selectedGodown, setSelectedGodown] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const [quantity, setQuantity] = useState(1);
  const [serial, setSerial] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [godownsData, brandsData, productsData] = await Promise.all([
        api.getGodowns(),
        api.getBrands(),
        api.getAllProducts()
      ]);
      setGodowns(godownsData);
      setBrands(brandsData);
      setProducts(productsData);
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedBrand) return [];
    return products.filter(p => p.brandId === parseInt(selectedBrand));
  }, [selectedBrand, products]);

  const selectedProductInfo = products.find(p => p.id === parseInt(selectedProduct));

  const handleScanSuccess = (data: string) => {
    setSerial(data);
    setIsScannerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGodown || !selectedBrand || !selectedProduct) {
      setError('Please select godown, brand, and product.');
      return;
    }
    if (selectedProductInfo?.isSerialized && !serial) {
        setError('Serial number is required for this product.');
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await api.addStockMovement({
        godownId: parseInt(selectedGodown),
        productId: parseInt(selectedProduct),
        quantity: selectedProductInfo?.isSerialized ? 1 : quantity,
        serial: selectedProductInfo?.isSerialized ? serial : undefined,
        direction: 'in',
        reference: 'Stock In',
        by: 'Admin', // Hardcoded for now
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record stock.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isScannerOpen && <BarcodeScanner onScanSuccess={handleScanSuccess} onClose={() => setIsScannerOpen(false)} />}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Stock In</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="godown" className="block text-sm font-medium text-slate-700">Godown</label>
                    <select id="godown" value={selectedGodown} onChange={e => setSelectedGodown(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                        <option value="" disabled>Select Godown</option>
                        {godowns.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-slate-700">Brand</label>
                    <select id="brand" value={selectedBrand} onChange={e => {setSelectedBrand(e.target.value); setSelectedProduct('');}} required className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                        <option value="" disabled>Select Brand</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
            </div>

            <div>
              <label htmlFor="product" className="block text-sm font-medium text-slate-700">Product</label>
              <select id="product" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} required disabled={!selectedBrand} className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-50">
                  <option value="" disabled>Select Product</option>
                  {filteredProducts.map(p => <option key={p.id} value={p.id}>{p.model}</option>)}
              </select>
            </div>
            {selectedProductInfo?.isSerialized ? (
               <div>
                  <label htmlFor="serial" className="block text-sm font-medium text-slate-700">Serial Number</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input type="text" id="serial" value={serial} onChange={e => setSerial(e.target.value)} required className="flex-grow block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                    <button type="button" onClick={() => setIsScannerOpen(true)} className="p-2.5 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300" title="Scan Serial Number">
                        <CameraIcon />
                    </button>
                  </div>
              </div>
            ) : (
              selectedProductInfo && <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Quantity</label>
                  <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} required min="1" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
              </div>
            )}
            
            {error && <p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:bg-primary-300">
                {isLoading ? 'Saving...' : 'Add to Stock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StockInModal;
