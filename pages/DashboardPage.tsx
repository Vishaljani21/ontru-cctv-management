import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { DashboardSummary, Visit, Technician, JobCardStatus } from '../types';
import { api } from '../services/api';
import { ProjectIcon, UsersIcon, BoxIcon, CurrencyRupeeIcon, TrophyIcon, DocumentTextIcon } from '../components/icons';

const cardColors = {
    red: 'bg-card-red',
    teal: 'bg-card-teal',
    orange: 'bg-card-orange',
    purple: 'bg-card-purple',
    blue: 'bg-card-blue',
};

const DashboardCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; color: keyof typeof cardColors }> = ({ title, value, icon, color }) => (
    <div className={`${cardColors[color]} text-white p-5 rounded-xl shadow-md flex items-center space-x-4 relative overflow-hidden`}>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-white bg-opacity-20 rounded-lg">
            <div className="text-white w-8 h-8">{icon}</div>
        </div>
        <div className="relative z-10">
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm font-medium opacity-90">{title}</p>
        </div>
    </div>
);

const ChartCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 h-full flex flex-col">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
        <div className="flex-grow flex items-center justify-center">
            {children}
        </div>
    </div>
);

const PieChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) return <div className="text-slate-500">No data available</div>;
    
    let cumulative = 0;
    const segments = data.map(item => {
        const percentage = item.value / total;
        const startAngle = (cumulative / total) * 360;
        cumulative += item.value;
        const endAngle = (cumulative / total) * 360;
        return { ...item, percentage, startAngle, endAngle };
    });

    const getArcPath = (start: number, end: number, r = 40) => {
        const startRad = (start * Math.PI) / 180;
        const endRad = (end * Math.PI) / 180;
        const x1 = 50 + r * Math.cos(startRad);
        const y1 = 50 + r * Math.sin(startRad);
        const x2 = 50 + r * Math.cos(endRad);
        const y2 = 50 + r * Math.sin(endRad);
        const largeArcFlag = end - start > 180 ? 1 : 0;
        return `M 50 50 L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    };

    return (
        <div className="w-full flex flex-col md:flex-row items-center justify-around">
            <svg viewBox="0 0 100 100" className="w-40 h-40">
                {segments.map(s => (
                    <path key={s.label} d={getArcPath(s.startAngle, s.endAngle)} fill={s.color} />
                ))}
            </svg>
            <div className="mt-4 md:mt-0 md:ml-6 space-y-2">
                {segments.map(s => (
                    <div key={s.label} className="flex items-center text-sm">
                        <span className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: s.color }}></span>
                        <span className="font-medium text-slate-700 capitalize">{s.label.replace('_', ' ')}:</span>
                        <span className="ml-1 text-slate-500">{s.value} ({(s.percentage * 100).toFixed(0)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BarChart: React.FC<{ data: { label: string, value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="w-full h-64 flex items-end justify-around gap-2 px-4 pt-4 border-t border-slate-200">
            {data.map(item => (
                <div key={item.label} className="flex-1 flex flex-col items-center justify-end">
                    <div 
                        className="w-full bg-primary-400 hover:bg-primary-500 rounded-t-md"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                        title={`${item.label}: ${item.value} projects`}
                    ></div>
                    <span className="text-xs font-medium text-slate-500 mt-1">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

const statusColors: Record<JobCardStatus, string> = {
    scheduled: '#60a5fa', // blue-400
    in_progress: '#f97316', // orange-500
    completed: '#22c55e', // green-500
    cancelled: '#ef4444' // red-500
};

const DashboardPage: React.FC = () => {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryData, visitsData, techniciansData] = await Promise.all([
                    api.getDashboardSummary(),
                    api.getVisits(),
                    api.getTechnicians(),
                ]);
                setSummary(summaryData);
                setVisits(visitsData);
                setTechnicians(techniciansData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const projectStatusData = useMemo(() => {
        const counts = visits.reduce((acc, visit) => {
            acc[visit.status] = (acc[visit.status] || 0) + 1;
            return acc;
        }, {} as Record<JobCardStatus, number>);
        
        return (Object.keys(counts) as JobCardStatus[]).map(status => ({
            label: status,
            value: counts[status],
            color: statusColors[status] || '#a8a29e'
        }));
    }, [visits]);

    const monthlyCompletionsData = useMemo(() => {
        const monthMap = new Map<string, number>();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        for (let i = 0; i < 6; i++) {
            const date = new Date(sixMonthsAgo);
            date.setMonth(date.getMonth() + i);
            const monthKey = date.toLocaleString('default', { month: 'short' });
            monthMap.set(monthKey, 0);
        }

        visits.forEach(visit => {
            const visitDate = new Date(visit.scheduledAt);
            if (visit.status === 'completed' && visitDate >= sixMonthsAgo) {
                const monthKey = visitDate.toLocaleString('default', { month: 'short' });
                monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
            }
        });
        
        return Array.from(monthMap, ([label, value]) => ({ label, value }));
    }, [visits]);
    
    // FIX: Refactored to use a Map for better type safety with numeric keys, resolving the arithmetic operation type error during sorting.
    const technicianPerformance = useMemo(() => {
        const performance = new Map<number, number>();
        visits
            .filter(v => v.status === 'completed')
            .flatMap(v => v.technicianIds)
            .forEach(techId => {
                performance.set(techId, (performance.get(techId) || 0) + 1);
            });
            
        return Array.from(performance.entries())
            .map(([techId, count]) => ({
                id: techId,
                name: technicians.find(t => t.id === techId)?.name || 'Unknown',
                completed: count
            }))
            .sort((a, b) => b.completed - a.completed)
            .slice(0, 5);
    }, [visits, technicians]);


    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
                <Link to="/projects" className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Create Project
                </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Total Projects" value={summary?.projects || 0} icon={<ProjectIcon />} color="red" />
                <DashboardCard title="Pending Invoices" value={summary?.pendingInvoicesCount || 0} icon={<DocumentTextIcon />} color="blue" />
                <DashboardCard title="Pending Payments" value={`₹${(summary?.pendingPayments || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} icon={<CurrencyRupeeIcon />} color="purple" />
                <DashboardCard title="Technicians" value={summary?.technicians || 0} icon={<UsersIcon />} color="teal" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <ChartCard title="Project Status Overview">
                        <PieChart data={projectStatusData} />
                    </ChartCard>
                </div>
                <div className="lg:col-span-3">
                    <ChartCard title="Monthly Project Completions (Last 6 Months)">
                        <BarChart data={monthlyCompletionsData} />
                    </ChartCard>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    <h3 className="p-6 text-lg font-semibold text-slate-800 border-b border-slate-200">Recent Activity</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {visits.slice(0, 5).map(visit => (
                                    <tr key={visit.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{visit.projectName || `Project #${visit.id}`}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(visit.scheduledAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize`} style={{backgroundColor: `${statusColors[visit.status]}20`, color: statusColors[visit.status] }}>
                                                {visit.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                     <h3 className="p-6 text-lg font-semibold text-slate-800 border-b border-slate-200 flex items-center">
                        <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500"/>
                        Top Technicians
                     </h3>
                     <div className="p-4 space-y-3">
                        {technicianPerformance.map((tech, index) => (
                            <div key={tech.id} className="flex items-center">
                                <span className="text-lg font-bold text-slate-400 w-8">{index + 1}.</span>
                                <div className="flex-grow">
                                    <p className="font-semibold text-slate-700">{tech.name}</p>
                                    <p className="text-sm text-slate-500">{tech.completed} Projects Completed</p>
                                </div>
                            </div>
                        ))}
                        {technicianPerformance.length === 0 && <p className="text-center text-slate-500 py-4">No completed projects yet.</p>}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;