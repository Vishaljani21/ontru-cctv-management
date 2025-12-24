import React, { useState, useEffect, useContext } from 'react';
import type { Payment, PaymentStatus } from '../../types';
import { api } from '../../services/api';
import { AuthContext } from '../../App';

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

const MyPaymentsPage: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
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


    if (loading) {
        return <div>Loading your payment history...</div>;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">My Payments</h2>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Card ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">JC-{payment.jobCardId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">₹{payment.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusIndicator status={payment.status} /></td>
                                </tr>
                            ))}
                             {payments.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500">No payment records found.</td>
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