import React, { useState, useEffect, useContext } from 'react';
import type { Expense, Visit } from '../../types';
import { api } from '../../services/api';
import { AuthContext } from '../../App';
import { PlusIcon, FilterIcon, RefreshIcon, CurrencyRupeeIcon, CrossIcon } from '../../components/icons';
import CustomSelect from '../../components/CustomSelect';

const StatusIndicator: React.FC<{ status: Expense['status'] }> = ({ status }) => {
    const styles = {
        approved: { bg: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', label: 'Approved' },
        pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', label: 'Pending' },
        rejected: { bg: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', label: 'Rejected' },
    };
    const style = styles[status] || styles.pending;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${style.bg} ${style.label === 'Rejected' ? 'ring-1 ring-red-500/10' : ''}`}>
            {style.label}
        </span>
    );
};

const AddExpenseModal: React.FC<{ onClose: () => void; onSave: () => void; userId: number }> = ({ onClose, onSave, userId }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<string>('other');
    const [description, setDescription] = useState('');
    const [visitId, setVisitId] = useState<string>(''); // string for select
    const [visits, setVisits] = useState<Visit[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fetch recent visits for dropdown
        api.getMyVisits(userId).then(data => {
            // Only show active or recently completed
            setVisits(data.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()));
        });
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.createExpense({
                amount: parseFloat(amount),
                category: category as Expense['category'],
                description,
                visit_id: visitId ? parseInt(visitId) : undefined
            });
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to save expense", error);
            alert("Failed to save expense");
        } finally {
            setSaving(false);
        }
    };

    const categoryOptions = [
        { value: 'travel', label: 'Travel', color: 'bg-blue-500' },
        { value: 'food', label: 'Food', color: 'bg-orange-500' },
        { value: 'material', label: 'Material', color: 'bg-indigo-500' },
        { value: 'other', label: 'Other', color: 'bg-slate-500' },
    ];

    const projectOptions = [
        { value: '', label: '-- No Project --' },
        ...visits.map(v => ({ value: v.id.toString(), label: `#${v.id} - ${v.address?.substring(0, 25)}...` }))
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 animate-fade-in transition-all">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 animate-scale-in">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 dark:text-white">Add Expense</h3>
                        <p className="text-sm text-slate-500 mt-1">Enter details for your new expense.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                        <CrossIcon className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Amount (₹)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-lg font-bold text-slate-800 dark:text-white"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            {/* Improved CustomSelect for Category */}
                            <CustomSelect
                                label="Category"
                                options={categoryOptions}
                                value={category}
                                onChange={setCategory}
                                placeholder="Select category"
                            />
                        </div>
                        <div>
                            {/* Improved CustomSelect for Project */}
                            <CustomSelect
                                label="Project (Optional)"
                                options={projectOptions}
                                value={visitId}
                                onChange={setVisitId}
                                placeholder="Select project"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                        <textarea
                            required
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow resize-none"
                            placeholder="Describe the expense details..."
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center gap-2 transition-transform active:scale-95">
                            {saving ? 'Saving...' : 'Submit Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const MyExpensesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const authContext = useContext(AuthContext);

    const fetchData = async () => {
        if (!authContext?.user) return;
        try {
            const data = await api.getMyExpenses();
            setExpenses(data);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [authContext?.user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {isModalOpen && authContext?.user?.id && (
                <AddExpenseModal
                    userId={authContext.user.id}
                    onClose={() => setIsModalOpen(false)}
                    onSave={() => { fetchData(); }}
                />
            )}

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-indigo-700 shadow-2xl ring-1 ring-white/10">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

                <div className="relative p-8 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Expense Tracking</h2>
                        <p className="text-primary-100 text-lg max-w-xl font-medium">Manage and report your project expenses effortlessly.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 transition-all active:scale-95 hover:shadow-primary-500/40"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Expense
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {expenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-medium">
                                        {new Date(expense.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`capitalize px-3 py-1 rounded-lg text-xs font-bold border ${expense.category === 'food' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-slate-100 text-slate-600 border-slate-200'} dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300`}>
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="max-w-xs truncate flex items-center" title={expense.description}>
                                            {expense.visit_id && <span className="flex-shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[10px] font-bold mr-2">#{expense.visit_id}</span>}
                                            {expense.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">₹{expense.amount.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusIndicator status={expense.status} />
                                    </td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
                                                <CurrencyRupeeIcon className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                                            </div>
                                            <p className="font-medium text-lg text-slate-700 dark:text-slate-300">No expenses recorded yet</p>
                                            <p className="text-sm mt-1">Add your first expense to track spending.</p>
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

export default MyExpensesPage;
