import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Invoice, InvoiceStatus } from '../types';
import PaymentReminderModal from '../components/PaymentReminderModal';
import StatsCard from '../components/StatsCard';
import {
    DocumentTextIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    PencilSquareIcon,
    CurrencyRupeeIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

const StatusIndicator: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
    const styles = {
        'paid': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        'unpaid': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
        'partial': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    };

    const icons = {
        'paid': CheckCircleIcon,
        'unpaid': ExclamationCircleIcon,
        'partial': ClockIcon
    };

    const Icon = icons[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize border ${styles[status]}`}>
            <Icon className="w-3.5 h-3.5" />
            {status}
        </span>
    );
};



const BillingPage: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [reminderInvoice, setReminderInvoice] = useState<Invoice | null>(null);
    const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');

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

    const stats = useMemo(() => {
        const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.grandTotal, 0);
        const pendingAmount = invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + i.grandTotal, 0);
        const totalInvoices = invoices.length;
        return { totalRevenue, pendingAmount, totalInvoices };
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const matchesSearch =
                invoice.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                invoice.customer.companyName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = statusFilter === 'all' || invoice.status === statusFilter;
            return matchesSearch && matchesFilter;
        });
    }, [invoices, searchQuery, statusFilter]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Billing & Invoices</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage invoices and track payments.</p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
                    icon={<CurrencyRupeeIcon className="w-6 h-6" />}
                    gradient="teal"
                />
                <StatsCard
                    title="Pending Amount"
                    value={`₹${stats.pendingAmount.toLocaleString('en-IN')}`}
                    icon={<ExclamationCircleIcon className="w-6 h-6" />}
                    gradient="red"
                />
                <StatsCard
                    title="Total Invoices"
                    value={stats.totalInvoices.toString()}
                    icon={<DocumentTextIcon className="w-6 h-6" />}
                    gradient="blue"
                />
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 md:max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="appearance-none pl-10 pr-8 py-2.5 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 dark:text-white font-medium cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="partial">Partial</option>
                        </select>
                        <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                </div>
                <Link
                    to="/billing/new"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create New Invoice
                </Link>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-white/5">
                        <thead className="bg-slate-50 dark:bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Invoice #</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map((invoice, index) => (
                                    <tr
                                        key={invoice.id}
                                        className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <DocumentTextIcon className="h-5 w-5 text-slate-400 mr-2" />
                                                <Link to={`/invoice/print/${invoice.id}`} target="_blank" className="font-bold text-sm text-primary-600 dark:text-primary-400 hover:underline">
                                                    {invoice.invoiceNo}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-slate-800 dark:text-white">{invoice.customer.companyName}</div>
                                            <div className="text-xs text-slate-500 dark:text-zinc-500">{invoice.customer.contactPerson}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-zinc-400">
                                            {new Date(invoice.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                ₹{invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusIndicator status={invoice.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                {(invoice.status === 'unpaid' || invoice.status === 'partial') && (
                                                    <button
                                                        onClick={() => handleMarkAsPaid(invoice.id)}
                                                        disabled={updatingStatusId === invoice.id}
                                                        title="Mark as Paid"
                                                        className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                                    >
                                                        {updatingStatusId === invoice.id ? (
                                                            <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                                                        ) : (
                                                            <CheckCircleIcon className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                )}

                                                <Link
                                                    to={`/billing/edit/${invoice.id}`}
                                                    title="Edit Invoice"
                                                    className="p-2 text-slate-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </Link>

                                                <Link
                                                    to={`/invoice/print/${invoice.id}`}
                                                    target="_blank"
                                                    title="Download/Print"
                                                    className="p-2 text-slate-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-zinc-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <DocumentTextIcon className="w-12 h-12 text-slate-300 dark:text-zinc-700 mb-3" />
                                            <p className="text-lg font-medium">No invoices found</p>
                                            <p className="text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {reminderInvoice && (
                <PaymentReminderModal
                    invoice={reminderInvoice}
                    onClose={() => setReminderInvoice(null)}
                />
            )}
        </div>
    );
};

export default BillingPage;