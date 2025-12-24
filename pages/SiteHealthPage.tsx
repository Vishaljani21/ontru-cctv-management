import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { SiteHealth, HDDStatus, RecordingStatus } from '../types';

const HealthStatusIndicator: React.FC<{ status: boolean | HDDStatus | RecordingStatus }> = ({ status }) => {
    let styles = { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-400', label: 'Unknown' };

    switch (status) {
        case true:
        case 'Healthy':
        case 'OK':
            styles = { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: typeof status === 'boolean' ? 'Online' : status };
            break;
        case false:
        case 'Error':
        case 'Stopped':
            styles = { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: typeof status === 'boolean' ? 'Offline' : status };
            break;
        case 'Not Found':
        case 'No HDD':
            styles = { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', label: status };
            break;
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
            <span className={`w-2 h-2 mr-1.5 rounded-full ${styles.dot}`}></span>
            {styles.label}
        </span>
    );
};

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void; disabled?: boolean }> = ({ enabled, onChange, disabled }) => {
    return (
        <button
            role="switch"
            aria-checked={enabled}
            onClick={onChange}
            disabled={disabled}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${
                enabled ? 'bg-primary-500' : 'bg-slate-300'
            }`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
        </button>
    );
};


const DiagnosticsModal: React.FC<{ site: SiteHealth; onClose: () => void }> = ({ site, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800">Diagnostics for {site.customerName}</h3>
                <p className="text-sm text-slate-500 mb-4">Last checked: {new Date(site.lastChecked).toLocaleString()}</p>
                
                <div className="space-y-3">
                    <p><strong>Status:</strong> <HealthStatusIndicator status={site.isOnline} /></p>
                    <p><strong>HDD Health:</strong> <HealthStatusIndicator status={site.hddStatus} /></p>
                    <p><strong>Recording:</strong> <HealthStatusIndicator status={site.recordingStatus} /></p>
                    <p><strong>Cameras:</strong> {site.camerasOnline} / {site.totalCameras} online</p>
                </div>

                <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-slate-700 mb-2">Troubleshooting Steps:</h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                        {!site.isOnline && <li>Check if the NVR is powered on and connected to the internet router. Ask the customer to restart the router.</li>}
                        {site.hddStatus === 'Error' && <li>The Hard Disk may be failing. A site visit is likely required to check or replace the HDD.</li>}
                        {site.recordingStatus === 'Stopped' && <li>Ask the customer to restart the NVR. If the problem persists, guide them to check recording settings or schedule a visit.</li>}
                        {site.camerasOnline < site.totalCameras && <li>Check power supply for the offline cameras. It might be a faulty adapter or cable connection.</li>}
                        {site.isOnline && site.hddStatus === 'Healthy' && site.recordingStatus === 'OK' && <li>System appears to be functioning correctly. Ask customer for specific details about the issue.</li>}
                    </ul>
                </div>

                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">Close</button>
                </div>
            </div>
        </div>
    );
};

const SiteHealthPage: React.FC = () => {
    const [sites, setSites] = useState<SiteHealth[]>([]);
    const [loading, setLoading] = useState(true);
    const [diagnosingSite, setDiagnosingSite] = useState<SiteHealth | null>(null);
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
            setDiagnosingSite(updatedSite);
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


    if (loading) {
        return <div>Loading site health data...</div>;
    }

    return (
        <div className="space-y-8">
            {diagnosingSite && <DiagnosticsModal site={diagnosingSite} onClose={() => setDiagnosingSite(null)} />}
            <h2 className="text-3xl font-bold text-slate-800">Smart Site Health Monitoring</h2>
            
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Site</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">NVR Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">HDD Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Recording</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cameras</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Monitoring</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {sites.map(site => (
                                <tr key={site.customerId} className={`hover:bg-slate-50 transition-opacity ${!site.isMonitoringEnabled ? 'opacity-60 bg-slate-50' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{site.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><HealthStatusIndicator status={site.isOnline} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><HealthStatusIndicator status={site.hddStatus} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><HealthStatusIndicator status={site.recordingStatus} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{site.camerasOnline} / {site.totalCameras}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <ToggleSwitch 
                                            enabled={site.isMonitoringEnabled}
                                            onChange={() => handleToggleMonitoring(site.customerId)}
                                            disabled={updatingMonitoringId === site.customerId}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleRunDiagnostics(site.customerId)}
                                            disabled={runningDiagFor === site.customerId || !site.isMonitoringEnabled}
                                            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                                        >
                                            {runningDiagFor === site.customerId ? 'Checking...' : 'Run Diagnostics'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SiteHealthPage;