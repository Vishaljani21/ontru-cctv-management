import React, { useEffect, useState, useContext } from 'react';
import type { TechnicianDashboardSummary, Visit, TechnicianAvailability } from '../../types';
import { api } from '../../services/api';
import { AuthContext } from '../../App';
import { VisitsIcon, CheckCircleIcon, CurrencyRupeeIcon, ProjectIcon } from '../../components/icons';
import StatsCard from '../../components/StatsCard';
import CustomSelect from '../../components/CustomSelect';

const availabilityOptions = [
    { value: 'available', label: 'Available', color: 'bg-green-500' },
    { value: 'busy', label: 'Busy', color: 'bg-red-500' },
    { value: 'on_leave', label: 'On Leave', color: 'bg-yellow-500' },
    { value: 'offline', label: 'Offline', color: 'bg-slate-500' },
];

const TechnicianDashboardPage: React.FC = () => {
    const [summary, setSummary] = useState<TechnicianDashboardSummary | null>(null);
    const [upcomingVisits, setUpcomingVisits] = useState<Visit[]>([]);
    const [availability, setAvailability] = useState<TechnicianAvailability>('offline');
    const [loading, setLoading] = useState(true);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            if (!authContext?.user?.id) return;

            try {
                // Fetch summary
                const summaryData = await api.getTechnicianDashboardSummary();
                setSummary(summaryData);

                // Fetch upcoming visits for preview (limit 3 manually since API returns all)
                const allVisits = await api.getMyVisits(authContext.user.id);
                const upcoming = allVisits
                    .filter(v => v.status === 'scheduled' || v.status === 'in_progress')
                    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                    .slice(0, 3);

                setUpcomingVisits(upcoming);

                // Fetch Availability
                const currentStatus = await api.getTechnicianAvailability();
                setAvailability(currentStatus);

            } catch (error) {
                console.error("Failed to fetch technician dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [authContext?.user?.id]);

    const handleAvailabilityChange = async (newStatus: string) => {
        const status = newStatus as TechnicianAvailability;
        // Optimistic update
        const oldStatus = availability;
        setAvailability(status);
        try {
            await api.updateTechnicianAvailability(status);
        } catch (error) {
            console.error("Failed to update status", error);
            setAvailability(oldStatus); // Revert on fail
            alert("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-indigo-700 shadow-2xl ring-1 ring-white/10">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

                <div className="relative p-8 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2 drop-shadow-md">
                            Welcome back, {authContext?.user?.name?.split(' ')[0]}!
                        </h2>
                        <p className="text-primary-100 text-lg max-w-2xl font-medium">
                            Here's what's happening today. You have <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg">{summary?.assignedVisits || 0}</span> active assignments.
                        </p>
                    </div>

                    {/* Status Toggle - Improved Layout with CustomSelect */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 pl-4 flex items-center gap-3 border border-white/20 shadow-lg min-w-[200px]">
                        <span className="text-white font-bold text-sm tracking-wide">Status:</span>
                        <div className="flex-1">
                            <CustomSelect
                                options={availabilityOptions}
                                value={availability}
                                onChange={handleAvailabilityChange}
                                className="w-full min-w-[140px]"
                                placeholder="Select Status"
                            // We override styles for this specific context since it's dark
                            />
                        </div>
                    </div>
                </div>

                {/* Decorative Bottom Wave/Border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatsCard
                    title="Assigned Visits"
                    value={summary?.assignedVisits || 0}
                    icon={<VisitsIcon />}
                    gradient="teal"
                />
                <StatsCard
                    title="Completed Today"
                    value={summary?.completedToday || 0}
                    icon={<CheckCircleIcon />}
                    gradient="blue"
                />
                <StatsCard
                    title="Pending Payments"
                    value={summary?.pendingPayments || 0}
                    icon={<CurrencyRupeeIcon />}
                    gradient="purple"
                />
            </div>

            {/* Recent / Upcoming Activity */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        Upcoming Visits
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full border border-primary-100 dark:border-primary-800">
                        Next 3
                    </span>
                </div>

                {upcomingVisits.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {upcomingVisits.map((visit) => (
                            <div key={visit.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${visit.status === 'in_progress' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                            <ProjectIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                Project #{visit.id}
                                            </h4>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 line-clamp-1">{visit.address}</p>
                                            <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                    {new Date(visit.scheduledAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-slate-300">•</span>
                                                <span className={`${visit.status === 'in_progress' ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'} uppercase tracking-wide`}>
                                                    {visit.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-700">
                            <VisitsIcon className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                        </div>
                        <p className="font-medium">No upcoming visits scheduled.</p>
                        <p className="text-xs mt-1 text-slate-400">Enjoy your free time!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicianDashboardPage;