import React, { useState, useEffect, useMemo } from 'react';
import type { Godown, Product, Brand } from '../types';
import { api } from '../services/api';
import { CameraIcon } from './icons';
import BarcodeScanner from './BarcodeScanner';
import CustomSelect from './CustomSelect';
import Modal from './Modal';

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
      <Modal isOpen={true} title="Stock In" onClose={onClose} allowOverflow>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CustomSelect
              label="Godown"
              options={godowns.map(g => ({ value: g.id.toString(), label: g.name }))}
              value={selectedGodown}
              onChange={setSelectedGodown}
              placeholder="Select Godown"
            />
            <CustomSelect
              label="Brand"
              options={brands.map(b => ({ value: b.id.toString(), label: b.name }))}
              value={selectedBrand}
              onChange={(val) => { setSelectedBrand(val); setSelectedProduct(''); }}
              placeholder="Select Brand"
            />
          </div>

          <CustomSelect
            label="Product"
            options={filteredProducts.map(p => ({ value: p.id.toString(), label: p.model }))}
            value={selectedProduct}
            onChange={setSelectedProduct}
            placeholder="Select Product"
          />

          {selectedProductInfo?.isSerialized ? (
            <div>
              <label htmlFor="serial" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Serial Number</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="serial"
                  value={serial}
                  onChange={e => setSerial(e.target.value)}
                  required
                  className="flex-grow w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-mono text-slate-800 dark:text-white"
                  placeholder="Scan or enter S/N"
                />
                <button type="button" onClick={() => setIsScannerOpen(true)} className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Scan Serial Number">
                  <CameraIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            selectedProductInfo && <div>
              <label htmlFor="quantity" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Quantity</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                required
                min="1"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-800 dark:text-white"
              />
            </div>
          )}

          {error && <p className="text-sm text-center text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-xl font-medium border border-red-100 dark:border-red-900/30">{error}</p>}

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-5 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.02]">
              {isLoading ? 'Saving...' : 'Add to Stock'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default StockInModal;
