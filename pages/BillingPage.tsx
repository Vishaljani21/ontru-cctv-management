import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Invoice, InvoiceStatus } from '../types';
import PaymentReminderModal from '../components/PaymentReminderModal';

const StatusIndicator: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
    const styles: { [key: string]: string } = {
        'paid': 'bg-green-100 text-green-800',
        'unpaid': 'bg-red-100 text-red-800',
        'partial': 'bg-yellow-100 text-yellow-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
};

const BillingPage: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [reminderInvoice, setReminderInvoice] = useState<Invoice | null>(null);
    const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await api.getInvoices();
                setInvoices(data);
            } catch (error) {
                console.error("Failed to fetch invoices", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleMarkAsPaid = async (invoiceId: number) => {
        setUpdatingStatusId(invoiceId);
        try {
            const updatedInvoice = await api.updateInvoiceStatus(invoiceId, 'paid');
            setInvoices(prevInvoices => 
                prevInvoices.map(inv => inv.id === invoiceId ? updatedInvoice : inv)
            );
        } catch (error) {
            console.error("Failed to update invoice status", error);
            alert("Failed to mark invoice as paid.");
        } finally {
            setUpdatingStatusId(null);
        }
    };


    if (loading) {
        return <div>Loading invoices...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h2 className="text-3xl font-bold text-slate-800">Billing & Invoices</h2>
                <Link to="/billing/new" className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Create New Invoice
                </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice #</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-slate-200">
                            {invoices.map(invoice => (
                                <tr key={invoice.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-primary-600">
                                        <Link to={`/invoice/print/${invoice.id}`} target="_blank">{invoice.invoiceNo}</Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{invoice.customer.companyName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(invoice.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">₹{invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusIndicator status={invoice.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        {(invoice.status === 'unpaid' || invoice.status === 'partial') && (
                                            <>
                                                <button
                                                    onClick={() => handleMarkAsPaid(invoice.id)}
                                                    disabled={updatingStatusId === invoice.id}
                                                    className="text-green-600 hover:text-green-800 disabled:text-slate-400"
                                                >
                                                    {updatingStatusId === invoice.id ? 'Updating...' : 'Mark Paid'}
                                                </button>
                                                <button onClick={() => setReminderInvoice(invoice)} className="text-blue-600 hover:text-blue-800">Reminder</button>
                                            </>
                                        )}
                                        {invoice.status === 'paid' && (
                                            <Link to={`/billing/edit/${invoice.id}`} className="text-indigo-600 hover:text-indigo-800">Edit</Link>
                                        )}
                                        <Link to={`/invoice/print/${invoice.id}`} target="_blank" className="text-primary-600 hover:text-primary-800">View/Print</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {reminderInvoice && <PaymentReminderModal invoice={reminderInvoice} onClose={() => setReminderInvoice(null)} />}
        </div>
    );
};

export default BillingPage;