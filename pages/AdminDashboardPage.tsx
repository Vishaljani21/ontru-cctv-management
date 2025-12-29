import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatsCard from '../components/StatsCard';
import { UserIcon, CrownIcon, KeyIcon, TrendingUpIcon } from '../components/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DealerInfo } from '../types';

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState({
        totalDealers: 0,
        activeLicenses: 0,
        activeSubscribers: 0,
        totalRevenue: 0
    });
    const [recentDealers, setRecentDealers] = useState<DealerInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, dealersData] = await Promise.all([
                    api.getAdminDashboardStats(),
                    api.getAllDealers()
                ]);
                setStats(statsData);
                setRecentDealers(dealersData.slice(0, 5)); // Top 5 recent
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartData = [
        { name: 'Dealers', value: stats.totalDealers, color: '#6366f1' },
        { name: 'Active Subs', value: stats.activeSubscribers, color: '#10b981' },
        { name: 'Available Keys', value: stats.activeLicenses, color: '#f59e0b' },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Admin Dashboard</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">System-wide overview and performance metrics.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Dealers"
                    value={stats.totalDealers}
                    icon={<UserIcon />}
                    gradient="blue"
                />
                <StatsCard
                    title="Active Subscribers"
                    value={stats.activeSubscribers}
                    icon={<CrownIcon />}
                    gradient="teal"
                />
                <StatsCard
                    title="Available Keys"
                    value={stats.activeLicenses}
                    icon={<KeyIcon />}
                    gradient="purple"
                />
                <StatsCard
                    title="Estimated Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={<TrendingUpIcon />}
                    gradient="red"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Platform Metrics</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Registrations */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Registrations</h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                        {recentDealers.length > 0 ? (
                            recentDealers.map((dealer, i) => (
                                <div key={i} className="flex items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0 mr-3">
                                        {dealer.companyName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{dealer.companyName}</div>
                                        <div className="text-xs text-slate-500 truncate">{dealer.email}</div>
                                    </div>
                                    <div className="ml-2">
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${dealer.subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {dealer.subscription.status === 'active' ? 'Active' : 'Trial'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400 text-sm">No recent dealers found.</div>
                        )}
                    </div>

                    <button className="mt-4 w-full py-2.5 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
