import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import type { Invoice, DealerInfo, InvoiceStatus } from '../types';
import { CloseIcon, WhatsAppIcon, ClipboardCopyIcon } from './icons';

const LedgerStatusIndicator: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
    const styles: { [key: string]: string } = {
        'paid': 'text-green-600',
        'unpaid': 'text-red-600',
        'partial': 'text-yellow-600',
    };
    return (
        <span className={`font-semibold capitalize ${styles[status]}`}>
            {status}
        </span>
    );
};

const PaymentReminderModal: React.FC<{ invoice: Invoice, onClose: () => void }> = ({ invoice, onClose }) => {
    const [customerInvoices, setCustomerInvoices] = useState<Invoice[] | null>(null);
    const [dealerInfo, setDealerInfo] = useState<DealerInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [copied, setCopied] = useState(false);

    const totalDue = useMemo(() => {
        if (!customerInvoices) return 0;
        return customerInvoices
            .filter(inv => inv.status === 'unpaid' || inv.status === 'partial')
            .reduce((acc, inv) => acc + inv.grandTotal, 0);
    }, [customerInvoices]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [dealerData, invoicesData] = await Promise.all([
                    api.getDealerInfo(),
                    api.getInvoicesByCustomerId(invoice.customer.id),
                ]);
                setDealerInfo(dealerData);
                setCustomerInvoices(invoicesData);
            } catch (error) {
                console.error("Failed to fetch reminder data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [invoice.customer.id]);

    useEffect(() => {
        if (dealerInfo && customerInvoices) {
            const parts: string[] = [];
            parts.push(`પ્રિય ${invoice.customer.companyName},`);
            parts.push(`\nતમારા ઇન્વોઇસ નંબર ${invoice.invoiceNo} માટે ₹${invoice.grandTotal.toLocaleString('en-IN')} નું પેમેન્ટ બાકી છે. કૃપા કરીને જલ્દીથી પેમેન્ટ કરો.`);
            parts.push(`\nકુલ બાકી રકમ: ₹${totalDue.toLocaleString('en-IN')}`);
            
            const paymentDetails: string[] = [];
            if (dealerInfo.upiId) paymentDetails.push(`UPI ID: ${dealerInfo.upiId}`);
            if (dealerInfo.bankName && dealerInfo.accountNo && dealerInfo.ifscCode) {
                paymentDetails.push(`\nબેંક વિગતો:\n- બેંકનું નામ: ${dealerInfo.bankName}\n- એકાઉન્ટ નંબર: ${dealerInfo.accountNo}\n- IFSC કોડ: ${dealerInfo.ifscCode}`);
            }
            if (paymentDetails.length > 0) {
                 parts.push(`\n\nપેમેન્ટ માટેની વિગતો:\n${paymentDetails.join('')}`);
            }

            parts.push(`\n\nતમારા સહકાર બદલ આભાર,\n${dealerInfo.companyName}`);
            setMessage(parts.join(''));
        }
    }, [dealerInfo, customerInvoices, invoice, totalDue]);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendWhatsApp = () => {
        const whatsappUrl = `https://wa.me/${invoice.customer.mobile}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h3 className="text-xl font-semibold text-slate-800">Payment Reminder for {invoice.customer.companyName}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                        <CloseIcon className="w-5 h-5 text-slate-600" />
                    </button>
                </header>

                {loading ? (
                    <div className="p-8 text-center">Loading reminder details...</div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Side: Message and Actions */}
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-600">Reminder Message (Gujarati)</label>
                                <textarea
                                    readOnly
                                    value={message}
                                    rows={12}
                                    className="mt-1 w-full p-3 bg-slate-50 border border-slate-300 rounded-md text-sm whitespace-pre-wrap"
                                ></textarea>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={handleCopyToClipboard} className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 text-sm font-semibold">
                                    <ClipboardCopyIcon className="w-4 h-4 mr-2" />
                                    {copied ? 'Copied!' : 'Copy Text'}
                                </button>
                                <button onClick={handleSendWhatsApp} className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-semibold">
                                    <WhatsAppIcon className="w-4 h-4 mr-2" />
                                    Send on WhatsApp
                                </button>
                            </div>
                            {dealerInfo?.qrCodeUrl && (
                                <div className="text-center pt-2">
                                     <label className="text-sm font-medium text-slate-600">Scan to Pay</label>
                                     <img src={dealerInfo.qrCodeUrl} alt="Payment QR Code" className="mx-auto mt-1 border p-1 rounded-md" />
                                </div>
                            )}
                        </div>
                        
                        {/* Right Side: Ledger */}
                        <div className="flex flex-col">
                            <h4 className="text-lg font-semibold text-slate-700 mb-2">Customer Ledger</h4>
                             <div className="flex-grow border rounded-lg overflow-hidden">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="p-2 text-left font-semibold text-slate-500">Date</th>
                                            <th className="p-2 text-left font-semibold text-slate-500">Invoice #</th>
                                            <th className="p-2 text-right font-semibold text-slate-500">Amount</th>
                                            <th className="p-2 text-right font-semibold text-slate-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {customerInvoices?.map(inv => (
                                            <tr key={inv.id} className="hover:bg-slate-50">
                                                <td className="p-2 text-slate-600">{new Date(inv.date).toLocaleDateString()}</td>
                                                <td className="p-2 font-mono text-primary-700">{inv.invoiceNo}</td>
                                                <td className="p-2 text-right">₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                                                <td className="p-2 text-right"><LedgerStatusIndicator status={inv.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-slate-100 font-bold">
                                        <tr>
                                            <td colSpan={2} className="p-2 text-right">Total Outstanding:</td>
                                            <td className="p-2 text-right">₹{totalDue.toLocaleString('en-IN')}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentReminderModal;
