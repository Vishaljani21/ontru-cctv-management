
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import type { Invoice, Visit, Technician, StockSummary, AMC } from '../types';
import { DownloadIcon, CurrencyRupeeIcon, DocumentTextIcon, CheckCircleIcon, UsersIcon, InventoryIcon, AMCIcon } from '../components/icons';
import CustomDatePicker from '../components/CustomDatePicker';

const ReportCard: React.FC<{ title: string; value: string | number; color?: string }> = ({ title, value, color = 'bg-white' }) => (
    <div className={`${color} border border-slate-200 rounded-lg p-4 shadow-sm`}>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
);

const ReportsPage: React.FC = () => {
    // State for data
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [stock, setStock] = useState<StockSummary[]>([]);
    const [amcs, setAmcs] = useState<AMC[]>([]);
    const [loading, setLoading] = useState(true);

    // State for filtering
    const [activeTab, setActiveTab] = useState<'financial' | 'operations' | 'inventory' | 'amc'>('financial');
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(1); // First day of current month
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [invoicesData, visitsData, techniciansData, stockData, amcsData] = await Promise.all([
                    api.getInvoices(),
                    api.getVisits(),
                    api.getTechnicians(),
                    api.getStockSummary(),
                    api.getAMCs()
                ]);
                setInvoices(invoicesData);
                setVisits(visitsData);
                setTechnicians(techniciansData);
                setStock(stockData);
                setAmcs(amcsData);
            } catch (error) {
                console.error("Error fetching report data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filterDate = (dateString: string) => {
        const date = new Date(dateString);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return date >= start && date <= end;
    };

    // --- Computed Data ---

    const filteredInvoices = useMemo(() => invoices.filter(i => filterDate(i.date)), [invoices, startDate, endDate]);
    const filteredVisits = useMemo(() => visits.filter(v => filterDate(v.scheduledAt)), [visits, startDate, endDate]);
    const filteredAmcs = useMemo(() => amcs.filter(a => filterDate(a.endDate)), [amcs, startDate, endDate]);

    const financialData = useMemo(() => {
        const totalSales = filteredInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
        const totalReceived = filteredInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.grandTotal, 0);
        const totalPending = filteredInvoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.grandTotal, 0);
        const totalGST = filteredInvoices.reduce((sum, i) => sum + i.totalGst, 0);
        return { totalSales, totalReceived, totalPending, totalGST };
    }, [filteredInvoices]);

    const operationsData = useMemo(() => {
        const completed = filteredVisits.filter(v => v.status === 'completed').length;
        const scheduled = filteredVisits.filter(v => v.status === 'scheduled').length;
        const total = filteredVisits.length;

        const techPerformance = technicians.map(t => {
            const jobs = filteredVisits.filter(v => v.technicianIds.includes(t.id));
            const completedJobs = jobs.filter(v => v.status === 'completed').length;
            return { name: t.name, total: jobs.length, completed: completedJobs };
        });

        return { completed, scheduled, total, techPerformance };
    }, [filteredVisits, technicians]);

    const inventoryData = useMemo(() => {
        const totalItems = stock.reduce((sum, s) => sum + s.totalStock, 0);
        const lowStockCount = stock.filter(s => s.totalStock < 5).length; // Arbitrary low stock threshold for visual report
        const categorySplit = stock.reduce((acc, s) => {
            acc[s.category] = (acc[s.category] || 0) + s.totalStock;
            return acc;
        }, {} as Record<string, number>);
        return { totalItems, lowStockCount, categorySplit };
    }, [stock]);


    const handleExport = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        let filename = `report_${activeTab}_${startDate}_to_${endDate}.csv`;

        if (activeTab === 'financial') {
            csvContent += "Date,Invoice No,Customer,Status,Total Amount,GST Amount\n";
            filteredInvoices.forEach(row => {
                csvContent += `${new Date(row.date).toLocaleDateString()},${row.invoiceNo},"${row.customer.companyName}",${row.status},${row.grandTotal},${row.totalGst}\n`;
            });
        } else if (activeTab === 'operations') {
            csvContent += "Date,Project,Customer,Status,Technicians\n";
            filteredVisits.forEach(row => {
                const techNames = row.technicianIds.map(tid => technicians.find(t => t.id === tid)?.name).join('; ');
                csvContent += `${new Date(row.scheduledAt).toLocaleDateString()},"${row.projectName || 'Project ' + row.id}","Customer ID ${row.customerId}",${row.status},"${techNames}"\n`;
            });
        } else if (activeTab === 'inventory') {
            csvContent += "Product,Brand,Category,Total Stock\n";
            stock.forEach(row => {
                csvContent += `"${row.productName}","${row.brandName}",${row.category},${row.totalStock}\n`;
            });
        } else if (activeTab === 'amc') {
            csvContent += "Customer,Start Date,End Date,Cost,Status\n";
            filteredAmcs.forEach(row => {
                csvContent += `"${row.customerName}",${new Date(row.startDate).toLocaleDateString()},${new Date(row.endDate).toLocaleDateString()},${row.cost},${row.status}\n`;
            });
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div>Loading reports...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-bold text-slate-800">Reports</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-slate-300">
                        <span className="text-sm text-slate-500 pl-2">From</span>
                        <div className="w-36">
                            <CustomDatePicker
                                selected={startDate ? new Date(startDate) : null}
                                onChange={(d) => setStartDate(d ? d.toISOString().split('T')[0] : '')}
                                placeholder="Start Date"
                                className="border-none shadow-none"
                            />
                        </div>
                        <span className="text-sm text-slate-500">To</span>
                        <div className="w-36">
                            <CustomDatePicker
                                selected={endDate ? new Date(endDate) : null}
                                onChange={(d) => setEndDate(d ? d.toISOString().split('T')[0] : '')}
                                placeholder="End Date"
                                className="border-none shadow-none"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-900"
                    >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('financial')} className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'financial' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        <CurrencyRupeeIcon className="w-4 h-4 mr-2" /> Financial
                    </button>
                    <button onClick={() => setActiveTab('operations')} className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'operations' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        <DocumentTextIcon className="w-4 h-4 mr-2" /> Operations
                    </button>
                    <button onClick={() => setActiveTab('inventory')} className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'inventory' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        <InventoryIcon className="w-4 h-4 mr-2" /> Inventory
                    </button>
                    <button onClick={() => setActiveTab('amc')} className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'amc' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        <AMCIcon className="w-4 h-4 mr-2" /> AMC Expiry
                    </button>
                </nav>
            </div>

            {/* Financial Tab */}
            {activeTab === 'financial' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <ReportCard title="Total Sales" value={`₹${financialData.totalSales.toLocaleString('en-IN')}`} color="bg-blue-50" />
                        <ReportCard title="Collected" value={`₹${financialData.totalReceived.toLocaleString('en-IN')}`} color="bg-green-50" />
                        <ReportCard title="Outstanding" value={`₹${financialData.totalPending.toLocaleString('en-IN')}`} color="bg-red-50" />
                        <ReportCard title="Total GST Output" value={`₹${financialData.totalGST.toLocaleString('en-IN')}`} color="bg-purple-50" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Invoice #</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredInvoices.map(inv => (
                                    <tr key={inv.id}>
                                        <td className="px-6 py-4 text-sm text-slate-500">{new Date(inv.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-primary-600">{inv.invoiceNo}</td>
                                        <td className="px-6 py-4 text-sm text-slate-900">{inv.customer.companyName}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs capitalize ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{inv.status}</span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredInvoices.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No invoices found in this period.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Operations Tab */}
            {activeTab === 'operations' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ReportCard title="Projects Completed" value={operationsData.completed} color="bg-green-50" />
                        <ReportCard title="Projects Scheduled" value={operationsData.scheduled} color="bg-blue-50" />
                        <ReportCard title="Total Visits" value={operationsData.total} color="bg-slate-50" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                            <h3 className="p-4 bg-slate-50 font-semibold text-slate-700 border-b">Technician Performance</h3>
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Technician</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Completed</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Total Assigned</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {operationsData.techPerformance.map((tech, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{tech.name}</td>
                                            <td className="px-6 py-4 text-sm text-green-600 font-semibold">{tech.completed}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{tech.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                            <h3 className="p-4 bg-slate-50 font-semibold text-slate-700 border-b">Recent Completed Projects</h3>
                            <ul className="divide-y divide-slate-200">
                                {filteredVisits.filter(v => v.status === 'completed').slice(0, 5).map(visit => (
                                    <li key={visit.id} className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{visit.projectName || `Project #${visit.id}`}</p>
                                            <p className="text-xs text-slate-500">{new Date(visit.scheduledAt).toLocaleDateString()}</p>
                                        </div>
                                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                    </li>
                                ))}
                                {filteredVisits.filter(v => v.status === 'completed').length === 0 && (
                                    <li className="p-4 text-center text-sm text-slate-500">No completed projects in this period.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReportCard title="Total Stock Items" value={inventoryData.totalItems} color="bg-blue-50" />
                        <ReportCard title="Low Stock Alerts" value={inventoryData.lowStockCount} color="bg-orange-50" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Brand</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Current Stock</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {stock.map(s => (
                                    <tr key={s.productId} className={s.totalStock < 5 ? 'bg-orange-50' : ''}>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{s.productName}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{s.brandName}</td>
                                        <td className="px-6 py-4 text-sm capitalize text-slate-500">{s.category}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                            {s.totalStock}
                                            {s.totalStock < 5 && <span className="ml-2 text-xs text-orange-600 font-normal">(Low)</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* AMC Tab */}
            {activeTab === 'amc' && (
                <div className="space-y-6">
                    <p className="text-sm text-slate-500">Showing AMCs expiring between {startDate} and {endDate}</p>
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Start Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">End Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Cost</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredAmcs.map(amc => (
                                    <tr key={amc.id}>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{amc.customerName}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{new Date(amc.startDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{new Date(amc.endDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{amc.status}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">₹{amc.cost}</td>
                                    </tr>
                                ))}
                                {filteredAmcs.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No AMCs expiring in this range.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;
