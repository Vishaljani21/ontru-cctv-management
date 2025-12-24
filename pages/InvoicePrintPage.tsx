import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Invoice, DealerInfo } from '../types';
import { OnTruFullLogo } from '../components/icons';

// Simple number to words converter for Indian currency format
function numberToWords(num: number) {
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    // FIX: Reassigning a function parameter is not allowed and can lead to unexpected behavior. Using a new variable for the string representation.
    const numStr = num.toString();
    if (numStr.length > 9) return 'overflow';
    const n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] !== '00') ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] !== '00') ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] !== '00') ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] !== '0') ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] !== '00') ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.replace(/\s+/g, ' ').trim().split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}


const InvoicePrintPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [dealerInfo, setDealerInfo] = useState<DealerInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [invoiceData, dealerData] = await Promise.all([
                    api.getInvoiceById(parseInt(id)),
                    api.getDealerInfo()
                ]);
                setInvoice(invoiceData);
                setDealerInfo(dealerData);
            } catch (error) {
                console.error("Failed to fetch invoice", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!loading && invoice) {
            // Automatically trigger print dialog after a short delay
            const timer = setTimeout(() => window.print(), 500);
            return () => clearTimeout(timer);
        }
    }, [loading, invoice]);


    if (loading) {
        return <div className="p-8">Loading invoice...</div>;
    }

    if (!invoice || !dealerInfo) {
        return <div className="p-8">Could not load invoice data.</div>;
    }

    const isIntraState = true; // Simplified for mock. In a real app, this would be determined by dealer/customer GSTIN.

    return (
        <div className="bg-white text-slate-800 font-sans">
            <div className="p-4 sm:p-8 md:p-12 max-w-4xl mx-auto printable-area">
                <header className="flex justify-between items-start pb-6 border-b-2 border-slate-800">
                    <div>
                        {dealerInfo.logoUrl ? (
                            <img src={dealerInfo.logoUrl} alt="Company Logo" className="h-16 w-auto object-contain mb-2" />
                        ) : (
                            <OnTruFullLogo />
                        )}
                        <h1 className="text-2xl font-bold mt-2">{dealerInfo.companyName}</h1>
                        <p className="text-sm max-w-xs">{dealerInfo.address}</p>
                        <p className="text-sm font-semibold">GSTIN: {dealerInfo.gstin}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-bold uppercase tracking-wider">Invoice</h2>
                        <p className="text-sm mt-2"><strong>Invoice No:</strong> {invoice.invoiceNo}</p>
                        <p className="text-sm"><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
                        <p className="text-sm"><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-8 my-6">
                    <div>
                        <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Bill To</h3>
                        <p className="font-bold">{invoice.customer.companyName}</p>
                        <p className="text-sm">{invoice.customer.address}</p>
                        <p className="text-sm">{invoice.customer.mobile}</p>
                        {invoice.customer.gst && <p className="text-sm font-semibold">GSTIN: {invoice.customer.gst}</p>}
                    </div>
                </section>

                <section className="mb-8">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="p-2 text-left font-semibold">S.No</th>
                                <th className="p-2 text-left font-semibold">Item & Description</th>
                                <th className="p-2 text-left font-semibold">HSN/SAC</th>
                                <th className="p-2 text-center font-semibold">Qty</th>
                                <th className="p-2 text-right font-semibold">Rate</th>
                                <th className="p-2 text-right font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={item.productId} className="border-b">
                                    <td className="p-2 align-top">{index + 1}</td>
                                    <td className="p-2 align-top font-medium">{item.productName}</td>
                                    <td className="p-2 align-top">{item.hsnSacCode}</td>
                                    <td className="p-2 align-top text-center">{item.qty}</td>
                                    <td className="p-2 align-top text-right">₹{item.rate.toFixed(2)}</td>
                                    <td className="p-2 align-top text-right font-medium">₹{item.taxableValue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Notes</h3>
                        <p className="text-sm">{invoice.notes}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="font-semibold">Subtotal</span>
                            <span>₹{invoice.subTotal.toFixed(2)}</span>
                        </div>
                        {isIntraState ? (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">CGST</span>
                                    <span>₹{(invoice.totalGst / 2).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">SGST</span>
                                    <span>₹{(invoice.totalGst / 2).toFixed(2)}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex justify-between">
                                <span className="text-slate-600">IGST</span>
                                <span>₹{invoice.totalGst.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xl font-bold border-t-2 border-slate-800 mt-2 pt-2">
                            <span>Grand Total</span>
                            <span>₹{invoice.grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </section>

                <section className="mt-4 text-sm font-semibold capitalize">
                    Amount in Words: {numberToWords(Math.round(invoice.grandTotal))} Rupees Only.
                </section>

                <footer className="mt-12 pt-6 border-t text-center text-xs text-slate-500">
                    <p>This is a computer-generated invoice and does not require a signature.</p>
                </footer>
            </div>

            <div className="fixed bottom-4 right-4 no-print">
                <button onClick={() => window.print()} className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg shadow-lg hover:bg-primary-600">
                    Print Invoice
                </button>
            </div>

            <style>{`
                @media print {
                    .no-print {
                        display: none;
                    }
                    .printable-area {
                        padding: 0 !important;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
};

export default InvoicePrintPage;
