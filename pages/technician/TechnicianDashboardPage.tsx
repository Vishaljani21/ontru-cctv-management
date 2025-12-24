import React, { useEffect, useState } from 'react';
import type { TechnicianDashboardSummary } from '../../types';
import { api } from '../../services/api';
import { VisitsIcon, CheckCircleIcon, CurrencyRupeeIcon } from '../../components/icons';

const cardColors = {
    teal: 'bg-card-teal',
    green: 'bg-green-500',
    purple: 'bg-card-purple',
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


const TechnicianDashboardPage: React.FC = () => {
    const [summary, setSummary] = useState<TechnicianDashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const summaryData = await api.getTechnicianDashboardSummary();
                setSummary(summaryData);
            } catch (error) {
                console.error("Failed to fetch technician dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">My Dashboard</h2>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DashboardCard title="Assigned Visits" value={summary?.assignedVisits || 0} icon={<VisitsIcon />} color="teal" />
                <DashboardCard title="Completed Today" value={summary?.completedToday || 0} icon={<CheckCircleIcon />} color="green" />
                <DashboardCard title="Pending Payments" value={summary?.pendingPayments || 0} icon={<CurrencyRupeeIcon />} color="purple" />
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
                 <h3 className="text-lg font-semibold text-slate-800 mb-2">Welcome!</h3>
                 <p className="text-slate-600">Here you can see a summary of your work. Check the "My Visits" page for details on your upcoming jobs.</p>
            </div>
        </div>
    );
};

export default TechnicianDashboardPage;