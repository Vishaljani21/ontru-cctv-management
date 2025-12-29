import React, { useState, useEffect } from 'react';
import type { Visit, Godown, GodownStock, JobCardItem } from '../types';
import { api } from '../services/api';
import BarcodeScanner from './BarcodeScanner';
import { CameraIcon, CrossIcon } from './icons';
import CustomSelect from './CustomSelect';
import Modal from './Modal';

const ManageItemsModal: React.FC<{
  visit: Visit;
  onClose: () => void;
  onSave: (visitId: number, items: JobCardItem[]) => void;
}> = ({ visit, onClose, onSave }) => {
  const [godowns, setGodowns] = useState<Godown[]>([]);
  const [stock, setStock] = useState<GodownStock[]>([]);
  const [selectedGodown, setSelectedGodown] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [currentItems, setCurrentItems] = useState<JobCardItem[]>(visit.items);

  // State for adding by serial
  const [addMode, setAddMode] = useState<'product' | 'serial'>('product');
  const [serialInput, setSerialInput] = useState('');
  const [isSerialLoading, setIsSerialLoading] = useState(false);
  const [serialError, setSerialError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    api.getGodowns().then(setGodowns);
  }, []);

  useEffect(() => {
    if (selectedGodown) {
      api.getGodownStock(parseInt(selectedGodown)).then(setStock);
    } else {
      setStock([]);
    }
    setSelectedProduct('');
  }, [selectedGodown]);

  const handleAddItemByProduct = () => {
    if (!selectedProduct || quantity <= 0) {
      alert('Please select a product and enter a valid quantity.');
      return;
    }

    const productInStock = stock.find(p => p.productId === parseInt(selectedProduct));
    if (!productInStock) return;

    const existingItem = currentItems.find(i => i.productId === productInStock.productId && !i.serial);
    const qtyInCart = existingItem ? existingItem.qty : 0;
    if (quantity + qtyInCart > productInStock.quantity) {
      alert(`Not enough stock. Available: ${productInStock.quantity}`);
      return;
    }

    if (existingItem) {
      setCurrentItems(currentItems.map(item => item.productId === productInStock.productId && !item.serial ? { ...item, qty: item.qty + quantity } : item));
    } else {
      setCurrentItems([...currentItems, {
        productId: productInStock.productId,
        productName: productInStock.productName,
        qty: quantity
      }]);
    }

    setSelectedProduct('');
    setQuantity(1);
  };

  const handleAddItemBySerial = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!serialInput) return;

    if (currentItems.some(item => item.serial === serialInput)) {
      setSerialError('This serial number has already been added.');
      return;
    }

    setIsSerialLoading(true);
    setSerialError(null);
    try {
      const { product, serial } = await api.lookupProductBySerial(serialInput);
      const newItem: JobCardItem = {
        productId: product.id,
        productName: `${product.brandName} ${product.model}`,
        qty: 1,
        serial: serial,
      };
      setCurrentItems(prev => [...prev, newItem]);
      setSerialInput('');
    } catch (err: any) {
      setSerialError(err.message || 'Failed to find product.');
    } finally {
      setIsSerialLoading(false);
    }
  };

  const handleRemoveItem = (itemToRemove: JobCardItem) => {
    setCurrentItems(prev => prev.filter(item =>
      item.productId !== itemToRemove.productId || item.serial !== itemToRemove.serial
    ));
  };

  const handleScanSuccess = (data: string) => {
    setSerialInput(data);
    setIsScannerOpen(false);
    setSerialError(null);
  };

  const handleSave = () => {
    onSave(visit.id, currentItems);
    onClose();
  }



  return (
    <>
      {isScannerOpen && <BarcodeScanner onScanSuccess={handleScanSuccess} onClose={() => setIsScannerOpen(false)} />}

      <Modal
        isOpen={true}
        onClose={onClose}
        title="Manage Items"
        maxWidth="max-w-lg"
      >
        <div className="space-y-5">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
            <button
              onClick={() => setAddMode('product')}
              className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-lg transition-all ${addMode === 'product' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              Add by Product
            </button>
            <button
              onClick={() => setAddMode('serial')}
              className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-lg transition-all ${addMode === 'serial' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              Add by Serial
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-1 max-h-[60vh]">
            {addMode === 'product' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomSelect
                    label="Source Godown"
                    options={godowns.map(g => ({ value: g.id.toString(), label: g.name }))}
                    value={selectedGodown}
                    onChange={setSelectedGodown}
                    placeholder="Select Godown"
                  />
                  <CustomSelect
                    label="Product"
                    options={stock.map(s => ({ value: s.productId.toString(), label: `${s.productName} (${s.quantity})` }))}
                    value={selectedProduct}
                    onChange={setSelectedProduct}
                    placeholder={selectedGodown ? "Select Product" : "Select Godown First"}
                    className={!selectedGodown ? 'opacity-50 pointer-events-none' : ''}
                  />
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-grow">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all font-bold"
                    />
                  </div>
                  <button onClick={handleAddItemByProduct} className="px-5 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-95 mb-0.5">
                    Add Item
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Scan/Enter Serial Number</label>
                <form onSubmit={handleAddItemBySerial} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={serialInput}
                    onChange={e => { setSerialInput(e.target.value); setSerialError(null); }}
                    placeholder="Enter serial number"
                    className="flex-grow w-full bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all font-mono"
                  />
                  <button type="button" onClick={() => setIsScannerOpen(true)} className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" title="Scan Serial Number">
                    <CameraIcon className="w-5 h-5" />
                  </button>
                  <button type="submit" disabled={isSerialLoading} className="px-5 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95">
                    {isSerialLoading ? '...' : 'Add'}
                  </button>
                </form>
                {serialError && <p className="text-xs font-bold text-red-500 mt-2 flex items-center"><CrossIcon className="w-3 h-3 mr-1" /> {serialError}</p>}
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">Allocated Items ({currentItems.length})</h4>
              <div className="space-y-2.5">
                {currentItems.map((item, index) => (
                  <div key={`${item.productId}-${item.serial || index}`} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 animate-fade-in-up">
                    <div>
                      <p className="font-bold text-sm text-slate-800 dark:text-white">{item.productName}</p>
                      {item.serial && <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">S/N: <span className="text-slate-700 dark:text-slate-300">{item.serial}</span></p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600">x{item.qty}</span>
                      <button onClick={() => handleRemoveItem(item)} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" aria-label="Remove Item">
                        <CrossIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {currentItems.length === 0 && <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-400">No items allocated yet.</p>
                </div>}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-95">Save Changes</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ManageItemsModal;
