import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import type { Customer, Product, InvoiceItem, Visit, Invoice, InvoiceStatus } from '../types';

// Utility to calculate item totals
const calculateItemTotals = (item: Omit<InvoiceItem, 'total' | 'taxableValue' | 'cgst' | 'sgst' | 'igst'>): InvoiceItem => {
    const taxableValue = (item.qty * item.rate) - item.discount;
    const gstAmount = taxableValue * (item.gstRate / 100);
    // Assuming CGST/SGST split for now
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const total = taxableValue + gstAmount;

    return { ...item, taxableValue, cgst, sgst, igst: 0, total };
};


const CreateInvoicePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const visitFromState = location.state?.visit as Visit | undefined;

    const isEditMode = !!id;

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [originalInvoice, setOriginalInvoice] = useState<Invoice | null>(null);
    const [customerId, setCustomerId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [notes, setNotes] = useState('Thank you for your business.');

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const [customersData, productsData] = await Promise.all([
                api.getCustomers(),
                api.getAllProducts()
            ]);
            setCustomers(customersData);
            setProducts(productsData);

            if (isEditMode && id) {
                const invoiceData = await api.getInvoiceById(parseInt(id));
                setOriginalInvoice(invoiceData);
                setCustomerId(invoiceData.customerId.toString());
                setDate(invoiceData.date.split('T')[0]);
                setDueDate(invoiceData.dueDate.split('T')[0]);
                setItems(invoiceData.items);
                setNotes(invoiceData.notes || '');
            } else if (visitFromState) {
                // Pre-populate from visit
                setCustomerId(visitFromState.customerId.toString());
                const visitItems = visitFromState.items.map(visitItem => {
                    const product = productsData.find(p => p.id === visitItem.productId);
                    if (!product) return null; // Or handle error
                    const newItem = {
                        productId: product.id,
                        productName: `${product.brandName} ${product.model}`,
                        hsnSacCode: product.hsnSacCode,
                        qty: visitItem.qty,
                        rate: 0, // Needs manual entry
                        discount: 0,
                        gstRate: product.gstRate || 18,
                    };
                    return calculateItemTotals(newItem);
                }).filter((item): item is InvoiceItem => item !== null);
                setItems(visitItems);
            }

        } catch (error) {
            console.error("Failed to load data", error);
            // Handle error (e.g., show notification)
        } finally {
            setLoading(false);
        }
    }, [id, isEditMode, visitFromState]);


    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);


    const handleAddItem = () => {
        const newItem = {
            productId: 0,
            productName: '',
            hsnSacCode: '',
            qty: 1,
            rate: 0,
            discount: 0,
            gstRate: 18,
        };
        setItems([...items, calculateItemTotals(newItem)]);
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...items];
        const currentItem = { ...newItems[index] };

        if (field === 'productId') {
            const product = products.find(p => p.id === parseInt(value));
            if (product) {
                currentItem.productId = product.id;
                currentItem.productName = `${product.brandName} ${product.model}`;
                currentItem.hsnSacCode = product.hsnSacCode;
                currentItem.gstRate = product.gstRate || 18;
            }
        } else {
            (currentItem as any)[field] = value;
        }
        
        newItems[index] = calculateItemTotals(currentItem);
        setItems(newItems);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const totals = useMemo(() => {
        const subTotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
        const totalDiscount = items.reduce((acc, item) => acc + item.discount, 0);
        const totalGst = items.reduce((acc, item) => acc + item.cgst + item.sgst + item.igst, 0);
        const grandTotal = items.reduce((acc, item) => acc + item.total, 0);
        return { subTotal, totalDiscount, totalGst, grandTotal };
    }, [items]);
    
    const handleSaveInvoice = async () => {
        if (!customerId) {
            alert("Please select a customer.");
            return;
        }
        
        setIsSaving(true);
        const customer = customers.find(c => c.id === parseInt(customerId));
        if (!customer) {
            setIsSaving(false);
            return;
        }

        const invoiceData = {
            customerId: parseInt(customerId),
            customer: customer,
            date: new Date(date).toISOString(),
            dueDate: new Date(dueDate).toISOString(),
            items,
            notes,
            ...totals,
            status: isEditMode ? originalInvoice!.status : ('unpaid' as InvoiceStatus)
        };

        try {
            if (isEditMode && originalInvoice) {
                await api.updateInvoice({ 
                    ...invoiceData, 
                    id: originalInvoice.id,
                    invoiceNo: originalInvoice.invoiceNo
                });
            } else {
                await api.createInvoice(invoiceData as Omit<Invoice, 'id' | 'invoiceNo'>);
            }
            navigate('/billing');
        } catch (error) {
            console.error("Failed to save invoice", error);
            alert("Failed to save invoice.");
        } finally {
            setIsSaving(false);
        }
    };


    if (loading) {
        return <div>Loading invoice editor...</div>;
    }

    return (
        <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                 <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">{isEditMode ? `Edit Invoice #${originalInvoice?.invoiceNo}` : 'Create Invoice'}</h1>
                    <button onClick={() => navigate('/billing')} className="text-sm font-medium text-primary-600 hover:text-primary-800">&larr; Back to Billing</button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    {/* Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="customer" className="block text-sm font-medium text-slate-700">Bill To</label>
                            <select id="customer" value={customerId} onChange={e => setCustomerId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                <option value="" disabled>Select a customer</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-slate-700">Invoice Date</label>
                                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">Due Date</label>
                                <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Items Table */}
                    <div className="overflow-x-auto -mx-6">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Product</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase w-20">Qty</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase w-28">Rate</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase w-28">Discount</th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 uppercase w-32">Amount</th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-4 py-2">
                                            <select
                                                value={item.productId}
                                                onChange={e => handleItemChange(index, 'productId', e.target.value)}
                                                className="w-full text-sm border-slate-300 rounded-md"
                                            >
                                                <option value="" disabled>Select Product</option>
                                                {products.map(p => <option key={p.id} value={p.id}>{p.brandName} {p.model}</option>)}
                                            </select>
                                        </td>
                                        <td><input type="number" value={item.qty} onChange={e => handleItemChange(index, 'qty', parseInt(e.target.value))} className="w-full text-sm text-center border-slate-300 rounded-md" /></td>
                                        <td><input type="number" value={item.rate} onChange={e => handleItemChange(index, 'rate', parseFloat(e.target.value))} className="w-full text-sm text-right border-slate-300 rounded-md" /></td>
                                        <td><input type="number" value={item.discount} onChange={e => handleItemChange(index, 'discount', parseFloat(e.target.value))} className="w-full text-sm text-right border-slate-300 rounded-md" /></td>
                                        <td className="px-4 py-2 text-right font-medium text-sm">₹{item.total.toFixed(2)}</td>
                                        <td className="text-center"><button onClick={() => handleRemoveItem(index)} className="text-red-500 text-lg font-bold">&times;</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={handleAddItem} className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200">+ Add Item</button>
                    
                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between"><span className="text-slate-600">Subtotal:</span> <span>₹{totals.subTotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-slate-600">Discount:</span> <span>- ₹{totals.totalDiscount.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-slate-600">GST:</span> <span>+ ₹{totals.totalGst.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span className="text-slate-800">Grand Total:</span> <span className="text-slate-800">₹{totals.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                         <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes</label>
                         <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t text-right">
                        <button onClick={handleSaveInvoice} disabled={isSaving} className="px-6 py-2.5 font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:bg-primary-300">
                           {isSaving ? 'Saving...' : (isEditMode ? 'Update Invoice' : 'Save Invoice')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateInvoicePage;