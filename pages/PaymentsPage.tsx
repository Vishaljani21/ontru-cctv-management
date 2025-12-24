import React, { useState, useEffect } from 'react';
import type { Payment, PaymentStatus } from '../types';
import { api } from '../services/api';

const StatusIndicator: React.FC<{ status: PaymentStatus }> = ({ status }) => {
    const styles: { [key: string]: { bg: string, text: string, label: string } } = {
        paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    };
    const style = styles[status] || { bg: 'bg-slate-100', text: 'text-slate-800', label: status };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
};

const PaymentsPage: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getPayments();
                setPayments(data);
            } catch (error) {
                console.error("Failed to fetch payments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleMarkAsPaid = (paymentId: number) => {
        setPayments(payments.map(p => 
            p.id === paymentId ? { ...p, status: 'paid' as PaymentStatus } : p
        ));
        // In a real app, you'd call api.markPaymentAsPaid(paymentId)
    };

    if (loading) {
        return <div>Loading payments...</div>;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">Technician Payments</h2>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Technician</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Card</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Action</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {payments.length > 0 ? payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{payment.technicianName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">JC-{payment.jobCardId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">₹{payment.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusIndicator status={payment.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {payment.status === 'pending' && (
                                            <button
                                                onClick={() => handleMarkAsPaid(payment.id)}
                                                className="text-primary-600 hover:text-primary-800 font-semibold"
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center px-6 py-12 text-slate-500">
                                        No payment records found.
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

export default PaymentsPage;