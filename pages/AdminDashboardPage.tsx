import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatsCard from '../components/StatsCard';
import { UsersIcon, CheckCircleIcon, KeyIcon, BillingIcon } from '../components/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DealerInfo } from '../types';
import PageHeader from '../components/PageHeader';

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
        <div className="space-y-8 animate-fade-in-up pb-10">
            <PageHeader
                title="Admin Dashboard"
                description="System-wide overview, dealer performance, and subscription metrics."
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-bold text-primary-300">₹{stats.totalRevenue.toLocaleString()}</p>
                        <p className="text-xs text-primary-200 font-bold uppercase tracking-widest mt-1">Est. Revenue</p>
                    </div>
                </div>
            </PageHeader>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Dealers"
                    value={stats.totalDealers}
                    icon={<UsersIcon />}
                    gradient="blue"
                />
                <StatsCard
                    title="Active Subscribers"
                    value={stats.activeSubscribers}
                    icon={<CheckCircleIcon />}
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
                    icon={<BillingIcon />}
                    gradient="red"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Platform Metrics</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#F1F5F9', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1E293B', fontWeight: 600 }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={50}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Registrations */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Recent Dealers</h3>
                        <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-lg">Live</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar -mr-2">
                        {recentDealers.length > 0 ? (
                            recentDealers.map((dealer, i) => (
                                <div key={i} className="flex items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                    <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold shrink-0 mr-4 text-sm border border-slate-100 dark:border-slate-600">
                                        {dealer.companyName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{dealer.companyName}</div>
                                        <div className="text-xs text-slate-500 truncate font-medium">{dealer.email}</div>
                                    </div>
                                    <div className="ml-2">
                                        <span className={`h-2.5 w-2.5 rounded-full block ${dealer.subscription.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`}></span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-400 text-sm font-medium">No recent dealers found.</div>
                        )}
                    </div>

                    <button className="mt-6 w-full py-3.5 text-sm font-bold text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-all border border-primary-100 dark:border-primary-800/30">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
