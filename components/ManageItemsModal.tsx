
import React, { useState, useEffect } from 'react';
import type { Visit, Godown, GodownStock, JobCardItem } from '../types';
import { api } from '../services/api';
import BarcodeScanner from './BarcodeScanner';
import { CameraIcon } from './icons';

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

    if(existingItem) {
        setCurrentItems(currentItems.map(item => item.productId === productInStock.productId && !item.serial ? {...item, qty: item.qty + quantity} : item));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold text-slate-800">Manage Items for {visit.projectName || `Project #${visit.id}`}</h3>
        
        <div className="flex items-center p-1 bg-slate-200 rounded-lg">
          <button
            onClick={() => setAddMode('product')}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${addMode === 'product' ? 'bg-white text-primary-600 shadow' : 'text-slate-600'}`}
          >
            Add by Product
          </button>
          <button
            onClick={() => setAddMode('serial')}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${addMode === 'serial' ? 'bg-white text-primary-600 shadow' : 'text-slate-600'}`}
          >
            Add by Serial
          </button>
        </div>

        {addMode === 'product' ? (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Source Godown</label>
                    <select value={selectedGodown} onChange={e => setSelectedGodown(e.target.value)} className={`mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${!selectedGodown ? 'text-slate-500' : 'text-slate-900'}`}>
                        <option value="" disabled>Select Godown</option>
                        {godowns.map(g => <option key={g.id} value={g.id} className="text-slate-900">{g.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Product</label>
                    <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} disabled={!selectedGodown} className={`mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-50 ${!selectedProduct ? 'text-slate-500' : 'text-slate-900'}`}>
                        <option value="" disabled>Select Product</option>
                        {stock.map(s => <option key={s.productId} value={s.productId} className="text-slate-900">{s.productName} ({s.quantity} left)</option>)}
                    </select>
                </div>
            </div>

            <div className="flex items-end gap-4">
                <div className="flex-grow">
                    <label className="block text-sm font-medium text-slate-700">Quantity</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} min="1" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <button onClick={handleAddItemByProduct} className="px-4 py-2 font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600">Add Item</button>
            </div>
        </>
        ) : (
            <div className="p-4 border bg-slate-50 rounded-lg">
                <label className="block text-sm font-medium text-slate-700 mb-1">Scan/Enter Serial Number</label>
                <form onSubmit={handleAddItemBySerial} className="flex items-center gap-2">
                    <input 
                        type="text" 
                        value={serialInput}
                        onChange={e => { setSerialInput(e.target.value); setSerialError(null); }}
                        placeholder="Enter serial number"
                        className="flex-grow block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
                    />
                    <button type="button" onClick={() => setIsScannerOpen(true)} className="p-2.5 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300" title="Scan Serial Number">
                        <CameraIcon />
                    </button>
                    <button type="submit" disabled={isSerialLoading} className="px-4 py-2 font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 disabled:bg-primary-300">
                        {isSerialLoading ? '...' : 'Add'}
                    </button>
                </form>
                {serialError && <p className="text-sm text-red-600 mt-2">{serialError}</p>}
            </div>
        )}

        <div>
            <h4 className="font-semibold text-slate-700 mb-2">Allocated Items</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 border-t pt-2">
                {currentItems.map((item, index) => (
                    <div key={`${item.productId}-${item.serial || index}`} className="flex justify-between items-center p-3 bg-slate-100 rounded-md">
                        <div>
                           <p className="font-medium text-slate-800">{item.productName}</p>
                           {item.serial && <p className="text-xs text-slate-500">S/N: {item.serial}</p>}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-slate-800">Qty: {item.qty}</span>
                          <button onClick={() => handleRemoveItem(item)} className="text-lg font-bold text-red-500 hover:text-red-700 leading-none">&times;</button>
                        </div>
                    </div>
                ))}
                {currentItems.length === 0 && <p className="text-sm text-center py-4 text-slate-500">No items allocated yet.</p>}
            </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">Save & Update Items</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ManageItemsModal;
