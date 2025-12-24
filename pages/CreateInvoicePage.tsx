import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import type { Customer, Product, InvoiceItem, Visit, Invoice, InvoiceStatus, DealerInfo } from '../types';
import CustomSelect from '../components/CustomSelect';
import CustomDatePicker from '../components/CustomDatePicker';
import {
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
    DocumentTextIcon,
    CalculatorIcon,
    UserIcon,
    CalendarIcon
} from '@heroicons/react/24/outline'; // Adjust import if needed

// Utility to calculate item totals
const calculateItemTotals = (item: Omit<InvoiceItem, 'total' | 'taxableValue' | 'cgst' | 'sgst' | 'igst'>): InvoiceItem => {
    const taxableValue = (item.qty * item.rate) - item.discount;
    const gstAmount = taxableValue * (item.gstRate / 100);
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
    const [dealerInfo, setDealerInfo] = useState<DealerInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [originalInvoice, setOriginalInvoice] = useState<Invoice | null>(null);
    const [customerId, setCustomerId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [notes, setNotes] = useState('Thank you for your business.');

    const selectedCustomer = customers.find(c => c.id.toString() === customerId);

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const [customersData, productsData, dealerData] = await Promise.all([
                api.getCustomers(),
                api.getAllProducts(),
                api.getDealerInfo()
            ]);
            setCustomers(customersData);
            setProducts(productsData);
            setDealerInfo(dealerData);

            if (isEditMode && id) {
                const invoiceData = await api.getInvoiceById(parseInt(id));
                setOriginalInvoice(invoiceData);
                setCustomerId(invoiceData.customerId.toString());
                setDate(invoiceData.date.split('T')[0]);
                setDueDate(invoiceData.dueDate.split('T')[0]);
                setItems(invoiceData.items);
                setNotes(invoiceData.notes || '');
            } else if (visitFromState) {
                setCustomerId(visitFromState.customerId.toString());
                const visitItems = visitFromState.items.map(visitItem => {
                    const product = productsData.find(p => p.id === visitItem.productId);
                    if (!product) return null;
                    const newItem = {
                        productId: product.id,
                        productName: `${product.brandName} ${product.model}`,
                        hsnSacCode: product.hsnSacCode,
                        qty: visitItem.qty,
                        rate: 0, // Needs manual entry usually, but could default
                        discount: 0,
                        gstRate: product.gstRate || 18,
                    };
                    return calculateItemTotals(newItem);
                }).filter((item): item is InvoiceItem => item !== null);
                setItems(visitItems);
            }
        } catch (error) {
            console.error("Failed to load data", error);
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

        if (items.length === 0) {
            alert("Please add at least one item to the invoice.");
            return;
        }

        const invalidItems = items.filter(i => !i.productId || i.productId === 0);
        if (invalidItems.length > 0) {
            alert("Please select a product for all line items.");
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
            status: isEditMode && originalInvoice ? originalInvoice.status : ('unpaid' as InvoiceStatus)
        };

        try {
            if (isEditMode && originalInvoice) {
                await api.updateInvoice({
                    ...invoiceData,
                    id: originalInvoice.id,
                    invoiceNo: originalInvoice.invoiceNo
                } as Invoice);
            } else {
                await api.createInvoice(invoiceData as any);
            }
            navigate('/billing');
        } catch (error: any) {
            console.error("Failed to save invoice", error);
            alert(`Failed to save invoice: ${error.message || String(error)}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-slate-500 dark:text-zinc-400">Loading invoice editor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black pb-20 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/billing')}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-slate-500 dark:text-zinc-400"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {isEditMode ? `Edit Invoice #${originalInvoice?.invoiceNo}` : 'Create New Invoice'}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-zinc-400">
                                Fill in the details below to generate an invoice.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/billing')}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveInvoice}
                            disabled={isSaving}
                            className="px-6 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <DocumentTextIcon className="w-4 h-4" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Invoice'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Client & Dates */}
                        <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 p-6">
                            {/* Dealer Header (From) */}
                            {dealerInfo && (
                                <div className="flex items-start justify-between mb-8 pb-8 border-b border-dashed border-slate-200 dark:border-white/10">
                                    <div className="flex items-center gap-4">
                                        {dealerInfo.logoUrl ? (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-100 dark:border-white/5">
                                                <img src={dealerInfo.logoUrl} alt={dealerInfo.companyName} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                                <span className="text-2xl font-bold">{dealerInfo.companyName.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{dealerInfo.companyName}</h3>
                                            <p className="text-sm text-slate-500 dark:text-zinc-400 whitespace-pre-line">{dealerInfo.address}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Invoice</p>
                                        <p className="text-slate-600 dark:text-zinc-400">
                                            {isEditMode ? `#${originalInvoice?.invoiceNo}` : 'AUTO-GENERATED'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-primary-500" />
                                Client Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <CustomSelect
                                        label="Bill To"
                                        options={customers.map(c => ({ value: c.id.toString(), label: c.companyName }))}
                                        value={customerId}
                                        onChange={setCustomerId}
                                        placeholder="Select a customer"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 col-span-2 md:col-span-1">
                                    <div className="relative z-20">
                                        <CustomDatePicker
                                            label="Invoice Date"
                                            selected={date ? new Date(date) : null}
                                            onChange={(d) => setDate(d ? d.toISOString().split('T')[0] : '')}
                                        />
                                    </div>
                                    <div className="relative z-20">
                                        <CustomDatePicker
                                            label="Due Date"
                                            selected={dueDate ? new Date(dueDate) : null}
                                            onChange={(d) => setDueDate(d ? d.toISOString().split('T')[0] : '')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Line Items */}
                        <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 p-6 overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <CalculatorIcon className="w-5 h-5 text-primary-500" />
                                    Line Items
                                </h2>
                            </div>

                            <div className="overflow-x-auto -mx-6 px-6">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-500 border-b border-slate-100 dark:border-white/5">
                                            <th className="text-left font-semibold pb-4 pl-2 w-1/3">Product</th>
                                            <th className="text-center font-semibold pb-4 w-20">Qty</th>
                                            <th className="text-right font-semibold pb-4 w-32">Rate</th>
                                            <th className="text-right font-semibold pb-4 w-24">Disc</th>
                                            <th className="text-right font-semibold pb-4 w-32">Total</th>
                                            <th className="pb-4 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {items.map((item, index) => (
                                            <tr key={index} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="py-4 pl-2">
                                                    <select
                                                        value={item.productId}
                                                        onChange={e => handleItemChange(index, 'productId', e.target.value)}
                                                        className="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-800 dark:text-white focus:ring-0 cursor-pointer placeholder-slate-400"
                                                    >
                                                        <option value="" disabled className="bg-white dark:bg-zinc-900 text-slate-500">Select Product</option>
                                                        {products.map(p => (
                                                            <option key={p.id} value={p.id} className="bg-white dark:bg-zinc-900">
                                                                {p.brandName} {p.model}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {item.productId === 0 && <div className="text-xs text-red-400 mt-1">Required</div>}
                                                </td>
                                                <td className="py-4">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.qty}
                                                        onChange={e => handleItemChange(index, 'qty', parseInt(e.target.value) || 0)}
                                                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg py-1.5 text-center text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                                                    />
                                                </td>
                                                <td className="py-4">
                                                    <div className="relative">
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={item.rate}
                                                            onChange={e => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                                                            className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg py-1.5 pl-6 pr-2 text-right text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={item.discount}
                                                        onChange={e => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                                                        className="w-full bg-transparent border-b border-dashed border-slate-300 dark:border-zinc-700 py-1 text-right text-sm text-slate-600 dark:text-zinc-400 focus:ring-0 focus:border-primary-500 transition-all"
                                                        placeholder="0"
                                                    />
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span className="font-bold text-slate-800 dark:text-white">
                                                        ₹{item.total.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-center">
                                                    <button
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button
                                onClick={handleAddItem}
                                className="mt-4 w-full py-3 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl text-sm font-semibold text-slate-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500/30 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all flex items-center justify-center gap-2"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Add Line Item
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Summary & Notes */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Payment Summary</h3>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                                    <span>Subtotal</span>
                                    <span>₹{totals.subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                                    <span>Total Discount</span>
                                    <span className="text-emerald-500">- ₹{totals.totalDiscount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-zinc-400 border-b border-dashed border-slate-200 dark:border-white/10 pb-4">
                                    <span>Total GST</span>
                                    <span>+ ₹{totals.totalGst.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-bold text-slate-800 dark:text-white text-lg">Grand Total</span>
                                    <span className="font-bold text-slate-900 dark:text-white text-2xl">
                                        ₹{totals.grandTotal.toFixed(2)}
                                    </span>
                                </div>
                                {selectedCustomer && (
                                    <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-700">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                                            Billing Details
                                        </label>
                                        <p className="text-slate-600 dark:text-zinc-400">
                                            {selectedCustomer.companyName}<br />
                                            {selectedCustomer.address}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                                <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-2">
                                    Notes / Terms
                                </label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 resize-none"
                                    placeholder="Thank you for your business..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateInvoicePage;