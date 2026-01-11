import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { SiteHealth, HDDStatus, RecordingStatus } from '../types';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, VideoCameraIcon, ServerIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; // Adjust imports if needed

// --- Helper Components ---

const StatusBadge: React.FC<{ status: boolean | string; type: 'online' | 'hdd' | 'rec' }> = ({ status, type }) => {
    let color = 'bg-slate-100 text-slate-500';
    let icon = <div className="w-2 h-2 rounded-full bg-slate-400" />;
    let label = String(status);

    // Logic for styling based on type and status value
    if (status === true || status === 'Healthy' || status === 'OK') {
        color = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
        icon = <CheckCircleIcon className="w-3.5 h-3.5" />;
        label = status === true ? 'Online' : String(status);
    } else if (status === false || status === 'Error' || status === 'Stopped' || status === 'Offline') {
        color = 'bg-red-50 text-red-600 border border-red-100';
        icon = <XCircleIcon className="w-3.5 h-3.5" />;
        label = status === false ? 'Offline' : String(status);
    } else if (status === 'No HDD' || status === 'Not Found') {
        color = 'bg-amber-50 text-amber-600 border border-amber-100';
        icon = <ExclamationCircleIcon className="w-3.5 h-3.5" />;
    }

    return (
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${color}`}>
            {icon}
            <span>{label}</span>
        </span>
    );
};

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void; disabled?: boolean }> = ({ enabled, onChange, disabled }) => (
    <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${enabled ? 'bg-primary-500' : 'bg-slate-300'
            }`}
    >
        <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-4.5' : 'translate-x-1'}`} style={{ transform: enabled ? 'translateX(18px)' : 'translateX(2px)' }} />
    </button>
);

// --- Main Page Component ---

const SiteHealthPage: React.FC = () => {
    const [sites, setSites] = useState<SiteHealth[]>([]);
    const [loading, setLoading] = useState(true);
    const [runningDiagFor, setRunningDiagFor] = useState<number | null>(null);
    const [updatingMonitoringId, setUpdatingMonitoringId] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getSiteHealths();
            setSites(data);
        } catch (error) {
            console.error("Failed to fetch site health data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRunDiagnostics = async (customerId: number) => {
        setRunningDiagFor(customerId);
        try {
            const updatedSite = await api.runDiagnostics(customerId);
            setSites(prev => prev.map(s => s.customerId === customerId ? updatedSite : s));
        } catch (error) {
            console.error("Failed to run diagnostics", error);
            alert("Could not run diagnostics for this site.");
        } finally {
            setRunningDiagFor(null);
        }
    };

    const handleToggleMonitoring = async (customerId: number) => {
        setUpdatingMonitoringId(customerId);
        try {
            const updatedSite = await api.toggleSiteMonitoring(customerId);
            setSites(prev => prev.map(s => s.customerId === customerId ? updatedSite : s));
        } catch (error) {
            console.error("Failed to toggle monitoring", error);
            alert("Could not update monitoring status.");
        } finally {
            setUpdatingMonitoringId(null);
        }
    };

    // Derived Stats
    const totalSites = sites.length;
    const onlineSites = sites.filter(s => s.isOnline).length;
    const criticalIssues = sites.filter(s => s.hddStatus === 'Error' || s.recordingStatus === 'Stopped').length;

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-black min-h-screen pb-20">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shrink-0 shadow-lg z-10 sticky top-0">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-start gap-6">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <span className="bg-white/20 p-1.5 rounded-lg"><ServerIcon className="w-5 h-5 text-white" /></span>
                                Smart Site Health
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">Real-time NVR and camera connectivity monitoring.</p>
                        </div>
                        <button onClick={fetchData} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white" title="Refresh Data">
                            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><CheckCircleIcon className="w-6 h-6" /></div>
                            <div>
                                <p className="text-2xl font-bold">{onlineSites}</p>
                                <p className="text-xs text-slate-400 font-bold uppercase">Online Sites</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/20 rounded-lg text-red-400"><XCircleIcon className="w-6 h-6" /></div>
                            <div>
                                <p className="text-2xl font-bold">{totalSites - onlineSites}</p>
                                <p className="text-xs text-slate-400 font-bold uppercase">Offline</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400"><ExclamationCircleIcon className="w-6 h-6" /></div>
                            <div>
                                <p className="text-2xl font-bold">{criticalIssues}</p>
                                <p className="text-xs text-slate-400 font-bold uppercase">Critical Issues</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="max-w-7xl mx-auto px-6 py-8 w-full">
                {loading && sites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
                        <p className="text-slate-400 mt-4 font-medium">Scanning sites...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sites.map(site => (
                            <div key={site.customerId} className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all hover:shadow-lg relative overflow-hidden group ${!site.isMonitoringEnabled ? 'border-slate-200 dark:border-slate-800 opacity-75 grayscale-[0.5]' :
                                    !site.isOnline ? 'border-red-200 dark:border-red-900/50 shadow-red-100 dark:shadow-none' :
                                        'border-slate-200 dark:border-slate-800 shadow-sm'
                                }`}>
                                {/* Status Indicator Strip */}
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${!site.isMonitoringEnabled ? 'bg-slate-300' :
                                        !site.isOnline ? 'bg-red-500' :
                                            site.hddStatus !== 'Healthy' ? 'bg-amber-500' :
                                                'bg-emerald-500'
                                    }`}></div>

                                <div className="p-5 pl-7">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1" title={site.customerName}>{site.customerName}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                                <ClockIcon className="w-3.5 h-3.5" />
                                                <span>{new Date(site.lastChecked).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                            </div>
                                        </div>
                                        <ToggleSwitch
                                            enabled={site.isMonitoringEnabled}
                                            onChange={() => handleToggleMonitoring(site.customerId)}
                                            disabled={updatingMonitoringId === site.customerId}
                                        />
                                    </div>

                                    {/* Grid of Statuses */}
                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Connection</p>
                                            <StatusBadge status={site.isOnline} type="online" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">HDD</p>
                                            <StatusBadge status={site.hddStatus} type="hdd" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recording</p>
                                            <StatusBadge status={site.recordingStatus} type="rec" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cameras</p>
                                            <span className={`inline-flex items-center text-sm font-bold ${site.camerasOnline < site.totalCameras ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300'
                                                }`}>
                                                <VideoCameraIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                                                {site.camerasOnline}/{site.totalCameras}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    {site.isMonitoringEnabled && (
                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                            <button
                                                onClick={() => handleRunDiagnostics(site.customerId)}
                                                disabled={runningDiagFor === site.customerId}
                                                className={`text-sm font-bold flex items-center gap-2 transition-colors ${runningDiagFor === site.customerId ? 'text-primary-400' : 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'
                                                    }`}
                                            >
                                                <ArrowPathIcon className={`w-4 h-4 ${runningDiagFor === site.customerId ? 'animate-spin' : ''}`} />
                                                {runningDiagFor === site.customerId ? 'Running...' : 'Run Diagnostics'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SiteHealthPage;