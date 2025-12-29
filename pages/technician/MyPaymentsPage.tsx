import React, { useState, useEffect, useContext } from 'react';
import type { Payment, PaymentStatus } from '../../types';
import { api } from '../../services/api';
import { AuthContext } from '../../App';
import { DownloadIcon, FilterIcon, RefreshIcon } from '../../components/icons';

const StatusIndicator: React.FC<{ status: PaymentStatus }> = ({ status }) => {
    const styles: { [key: string]: { bg: string, text: string, label: string } } = {
        paid: { bg: 'bg-green-100 text-green-700 ring-green-600/20', text: 'text-green-700', label: 'Paid' },
        pending: { bg: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20', text: 'text-yellow-700', label: 'Pending' },
        failed: { bg: 'bg-red-100 text-red-700 ring-red-600/20', text: 'text-red-700', label: 'Failed' },
    };
    const style = styles[status] || { bg: 'bg-slate-100 text-slate-700', text: 'text-slate-700', label: status };

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style.bg}`}>
            {style.label}
        </span>
    );
};

const MyPaymentsPage: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            // In current API, getMyPayments expects userName, which is a bit weird, usually techId. 
            // Assuming existing logic works.
            if (!authContext?.user?.name) return;
            try {
                const data = await api.getMyPayments(authContext.user.name);
                setPayments(data);
            } catch (error) {
                console.error("Failed to fetch payments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [authContext?.user?.name]);

    const totalEarned = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">My Payments</h2>
                {/* <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                    <DownloadIcon className="w-4 h-4" />
                    Export Report
                </button> */}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-green-500/20">
                    <p className="text-green-100 font-medium mb-1">Total Earned</p>
                    <p className="text-3xl font-bold">₹{totalEarned.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Pending Amount</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">₹{pendingAmount.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job Ref</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-bold text-slate-800 dark:text-white">JC-{payment.jobCardId}</div>
                                        <div className="text-xs text-slate-500">Video Surveillance Install</div> {/* Placeholder description */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {/* Assuming payment has date, if not, placeholder */}
                                        {payment.date ? new Date(payment.date).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 dark:text-white">₹{payment.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusIndicator status={payment.status} /></td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                                                <FilterIcon className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <p>No payment records found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyPaymentsPage;