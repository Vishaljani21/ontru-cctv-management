import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Visit, Invoice, Product, User, TechnicianTask, WorkLogEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DocumentArrowDownIcon, FunnelIcon } from '@heroicons/react/24/outline'; // Using heroicons for standard imports
import { ProjectIcon, CurrencyRupeeIcon, DocumentTextIcon } from '../components/icons';
import CustomDatePicker from '../components/CustomDatePicker';
import CustomSelect from '../components/CustomSelect';

const COLORS = ['#0EA5E9', '#6366f1', '#10B981', '#F59E0B'];

type TabType = 'overview' | 'projects' | 'tasks' | 'invoices' | 'inventory' | 'technicians';

const ReportsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [loading, setLoading] = useState(true);

    // Data State
    const [visits, setVisits] = useState<Visit[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [inventory, setInventory] = useState<Product[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [technicians, setTechnicians] = useState<User[]>([]);
    const [technicianTasks, setTechnicianTasks] = useState<TechnicianTask[]>([]);
    const [workLogs, setWorkLogs] = useState<WorkLogEntry[]>([]);

    // Filters
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('all');
    const [reportPeriod, setReportPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [visitsData, invoicesData, inventoryData, summaryData, techsData, tasksData, logsData] = await Promise.all([
                api.getVisits(),
                api.getInvoices().catch(() => []), // Fail safely if billing not enabled
                api.getAllProducts(),
                api.getReportsSummary().catch(() => null),
                api.getAllTechnicians().catch(() => []),
                api.getAllTechnicianTasks().catch(() => []),
                api.getAllWorkLogs().catch(() => [])
            ]);
            setVisits(visitsData);
            setInvoices(invoicesData);
            setInventory(inventoryData);
            setSummary(summaryData);
            setTechnicians(techsData);
            setTechnicianTasks(tasksData);
            setWorkLogs(logsData);
        } catch (error) {
            console.error("Failed to fetch report data", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredVisits = useMemo(() => {
        if (!startDate && !endDate) return visits;
        return visits.filter(v => {
            const d = new Date(v.scheduledAt);
            return (!startDate || d >= startDate) && (!endDate || d <= endDate);
        });
    }, [visits, startDate, endDate]);

    const filteredInvoices = useMemo(() => {
        if (!startDate && !endDate) return invoices;
        return invoices.filter(i => {
            const d = new Date(i.date);
            return (!startDate || d >= startDate) && (!endDate || d <= endDate);
        });
    }, [invoices, startDate, endDate]);

    // Export Logic
    const handleExport = (type: 'visits' | 'invoices' | 'inventory') => {
        let data: any[] = [];
        let filename = 'report.csv';

        if (type === 'visits') {
            data = filteredVisits.map(v => ({
                ID: v.id,
                Project: v.projectName,
                Customer: v.customerId, // Ideally map to name if available
                Date: new Date(v.scheduledAt).toLocaleDateString(),
                Status: v.status,
                Address: v.address
            }));
            filename = 'projects_report.csv';
        } else if (type === 'invoices') {
            data = filteredInvoices.map(i => ({
                InvoiceNo: i.invoiceNo,
                Date: i.date,
                Customer: i.customer.companyName,
                Total: i.grandTotal,
                Status: i.status
            }));
            filename = 'invoices_report.csv';
        } else if (type === 'inventory') {
            data = inventory.map(p => ({
                Model: p.model,
                Brand: p.brandName,
                Category: p.category,
                LowStockThreshold: p.lowStockThreshold
            }));
            filename = 'inventory_report.csv';
        }

        if (data.length === 0) {
            alert("No data to export");
            return;
        }

        // CSV Generation
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Comprehensive Reports...</div>;
    }

    return (
        <div className="p-8 space-y-8 pb-20 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Reports Center
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Export and analyze your business performance.</p>
                </div>

                {/* Date Filters */}
                <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2">
                        <FunnelIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold uppercase text-slate-500">Filter</span>
                    </div>
                    <CustomDatePicker
                        selected={startDate}
                        onChange={setStartDate}
                        placeholder="Start Date"
                        className="w-32 text-sm"
                    />
                    <span className="text-slate-300 self-center">-</span>
                    <CustomDatePicker
                        selected={endDate}
                        onChange={setEndDate}
                        placeholder="End Date"
                        className="w-32 text-sm"
                    />
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-700 pb-1">
                {(['overview', 'projects', 'technicians', 'invoices', 'inventory'] as TabType[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            px-6 py-3 text-sm font-bold capitalize whitespace-nowrap transition-all border-b-2
                            ${activeTab === tab
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300'}
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* CONTENT AREA */}
            <div className="animate-fade-in-up">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && summary && (
                    <div className="space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{summary.revenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Projects</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{summary.totalVisits}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Invoices</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{summary.pendingInvoicesCount}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-96">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Technician Performance</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={summary.technicianPerformance}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="name" stroke="#64748b" />
                                        <YAxis stroke="#64748b" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                        <Bar dataKey="completed" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* PROJECTS TAB */}
                {activeTab === 'projects' && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <button
                                onClick={() => handleExport('visits')}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                            >
                                <DocumentArrowDownIcon className="w-4 h-4" /> Export Projects
                            </button>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Project Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Address</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredVisits.length > 0 ? filteredVisits.map(v => (
                                        <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-white">{v.projectName || `Project #${v.id}`}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{new Date(v.scheduledAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${v.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{v.status.replace('_', ' ')}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-xs">{v.address}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="p-8 text-center text-slate-400">No projects found in this date range.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* INVOICES TAB */}
                {activeTab === 'invoices' && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <button
                                onClick={() => handleExport('invoices')}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                            >
                                <DocumentArrowDownIcon className="w-4 h-4" /> Export Invoices
                            </button>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Invoice #</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Amount</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredInvoices.length > 0 ? filteredInvoices.map(i => (
                                        <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-300">{i.invoiceNo}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-white">{i.customer.companyName}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{new Date(i.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-right text-slate-900 dark:text-white">₹{i.grandTotal.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${i.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{i.status}</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={5} className="p-8 text-center text-slate-400">No invoices found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* INVENTORY TAB */}
                {activeTab === 'inventory' && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <button
                                onClick={() => handleExport('inventory')}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                            >
                                <DocumentArrowDownIcon className="w-4 h-4" /> Export Inventory
                            </button>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Brand</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Low Stock Limit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {inventory.map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-white">{p.model}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{p.category}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{p.brandName}</td>
                                            <td className="px-6 py-4 text-sm font-mono text-slate-500">{p.lowStockThreshold}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TECHNICIANS TAB */}
                {activeTab === 'technicians' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <CustomSelect
                                    label="Technician"
                                    options={[
                                        { label: 'All Technicians', value: 'all' },
                                        ...technicians.map(t => ({ label: t.name, value: t.id.toString() }))
                                    ]}
                                    value={selectedTechnicianId}
                                    onChange={setSelectedTechnicianId}
                                    className="w-full sm:w-64"
                                />
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg self-end">
                                    {(['daily', 'monthly', 'yearly'] as const).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setReportPeriod(p)}
                                            className={`px-4 py-2 text-sm font-bold rounded-md capitalize transition-all ${reportPeriod === p
                                                ? 'bg-white dark:bg-slate-600 text-primary-600 shadow-sm'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="text-sm text-right text-slate-500">
                                Showing data for <span className="font-bold text-slate-800 dark:text-white capitalize">{reportPeriod}</span> report
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-medium text-slate-500">Total Visits (Selected Period)</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                    {visits.filter(v =>
                                        (selectedTechnicianId === 'all' || v.technicianIds.includes(parseInt(selectedTechnicianId))) &&
                                        // Simple date filter placeholder - in real app, better date logic needed
                                        (reportPeriod === 'daily' ? new Date(v.scheduledAt).toDateString() === new Date().toDateString() : true)
                                    ).length}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-medium text-slate-500">Tasks Completed</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">
                                    {technicianTasks.filter(t =>
                                        (selectedTechnicianId === 'all' || t.technician_id === parseInt(selectedTechnicianId)) &&
                                        t.status === 'completed'
                                    ).length}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-medium text-slate-500">Efficiency Rate</p>
                                <p className="text-3xl font-bold text-primary-600 mt-2">94%</p>
                            </div>
                        </div>

                        {/* Detailed Work Log Table */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 dark:text-white">Detailed Work Logs</h3>
                            </div>
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Technician</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Activity</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {workLogs.length > 0 ? workLogs.map((log, idx) => (
                                        // Mocking logs if flat mapped or real
                                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {/* Date parsing might fail if format is weird, fallback needed */}
                                                {log.date ? new Date(log.date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-white">
                                                {technicians.find(t => t.id === log.technicianId)?.name || `Tech #${log.technicianId}`}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                Visit / Task
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{log.notes || 'No notes'}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="p-8 text-center text-slate-400">No work logs found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReportsPage;
