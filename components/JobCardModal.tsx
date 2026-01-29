import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { api } from '../services/api';
import type { JobCard } from '../types';

interface JobCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    complaintId: number;
    dealerInfo?: {
        companyName: string;
        address: string;
        mobile?: string;
        logoUrl?: string;
    };
}

const JobCardModal: React.FC<JobCardModalProps> = ({ isOpen, onClose, complaintId, dealerInfo }) => {
    const [jobCard, setJobCard] = useState<JobCard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && complaintId) {
            fetchJobCard();
        }
    }, [isOpen, complaintId]);

    const fetchJobCard = async () => {
        setLoading(true);
        setError(null);
        try {
            let jc = await api.getJobCardByComplaint(complaintId);
            if (!jc) {
                await api.createJobCard(complaintId);
                jc = await api.getJobCardByComplaint(complaintId);
            }
            setJobCard(jc);
        } catch (err: any) {
            setError(err.message || 'Failed to load job card');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const companyName = dealerInfo?.companyName || 'Service Provider';
        const companyAddress = dealerInfo?.address || '';
        const companyPhone = dealerInfo?.mobile || '';

        printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <title>Job Card - ${jobCard?.jobCardNumber}</title>
    <style>
        @page { size: A4; margin: 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            font-size: 11px;
            color: #1a1a1a;
            line-height: 1.4;
        }
        .job-card { 
            max-width: 100%;
            border: 2px solid #0d9488;
            border-radius: 8px;
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
            color: white;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .company-info { flex: 1; }
        .company-name { font-size: 18px; font-weight: bold; margin-bottom: 4px; }
        .company-details { font-size: 10px; opacity: 0.9; }
        .job-number-box { 
            text-align: right;
        }
        .job-number { 
            background: white;
            color: #0d9488;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 14px;
            display: inline-block;
        }
        .job-date { font-size: 10px; margin-top: 4px; opacity: 0.9; }
        .content { padding: 16px 20px; }
        .section { margin-bottom: 16px; }
        .section-title { 
            font-weight: bold; 
            color: #0d9488; 
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 6px;
            margin-bottom: 10px;
        }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }
        .field { margin-bottom: 6px; }
        .field-label { font-size: 9px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px; }
        .field-value { font-weight: 600; font-size: 11px; }
        .field-value-large { font-weight: 600; font-size: 13px; }
        .text-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 10px;
            border-radius: 4px;
            min-height: 50px;
            font-size: 11px;
        }
        .divider { height: 1px; background: #e5e7eb; margin: 12px 0; }
        .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 2px dashed #d1d5db;
        }
        .signature-box { text-align: center; }
        .signature-line {
            border-bottom: 1px solid #374151;
            height: 40px;
            margin-bottom: 8px;
        }
        .signature-label { font-size: 10px; color: #6b7280; }
        .footer {
            text-align: center;
            padding: 10px;
            background: #f1f5f9;
            font-size: 9px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-draft { background: #fef3c7; color: #d97706; }
        .status-completed { background: #d1fae5; color: #059669; }
        .highlight-box {
            background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
            border: 1px solid #99f6e4;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 16px;
        }
    </style>
</head>
<body>
    <div class="job-card">
        <div class="header">
            <div class="company-info">
                <div class="company-name">${companyName}</div>
                <div class="company-details">
                    ${companyAddress}${companyPhone ? ` | Tel: ${companyPhone}` : ''}
                </div>
            </div>
            <div class="job-number-box">
                <div class="job-number">${jobCard?.jobCardNumber || 'N/A'}</div>
                <div class="job-date">SERVICE JOB CARD</div>
            </div>
        </div>
        
        <div class="content">
            <!-- Customer Details -->
            <div class="highlight-box">
                <div class="grid-2">
                    <div>
                        <div class="field">
                            <div class="field-label">Customer Name</div>
                            <div class="field-value-large">${jobCard?.customerName || 'N/A'}</div>
                        </div>
                        <div class="field">
                            <div class="field-label">Phone</div>
                            <div class="field-value">${jobCard?.customerPhone || 'N/A'}</div>
                        </div>
                    </div>
                    <div>
                        <div class="field">
                            <div class="field-label">Service Address</div>
                            <div class="field-value">${jobCard?.customerAddress || 'N/A'}${jobCard?.customerCity ? `, ${jobCard.customerCity}` : ''}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Service Information -->
            <div class="section">
                <div class="section-title">Service Information</div>
                <div class="grid-4">
                    <div class="field">
                        <div class="field-label">Service Date</div>
                        <div class="field-value">${jobCard?.serviceDate ? new Date(jobCard.serviceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Category</div>
                        <div class="field-value">${jobCard?.complaintCategory || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Technician</div>
                        <div class="field-value">${jobCard?.technicianName || 'Not Assigned'}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Status</div>
                        <div class="field-value"><span class="status-badge status-${jobCard?.status || 'draft'}">${jobCard?.status || 'Draft'}</span></div>
                    </div>
                </div>
            </div>

            <div class="divider"></div>

            <!-- Complaint Details -->
            <div class="section">
                <div class="section-title">Complaint Details</div>
                <div class="field">
                    <div class="field-label">Issue/Complaint</div>
                    <div class="text-box">${jobCard?.complaintTitle || 'N/A'}</div>
                </div>
            </div>

            <!-- Work Performed -->
            <div class="section">
                <div class="section-title">Work Performed</div>
                <div class="text-box">${jobCard?.workDone || 'Work details to be filled by technician.'}</div>
            </div>

            <!-- Parts/Materials Used -->
            <div class="section">
                <div class="section-title">Parts / Materials Used</div>
                <div class="text-box">${jobCard?.partsUsed || 'No parts used or to be filled.'}</div>
            </div>

            <!-- Resolution Notes -->
            ${jobCard?.resolutionNotes ? `
            <div class="section">
                <div class="section-title">Resolution Notes</div>
                <div class="text-box">${jobCard.resolutionNotes}</div>
            </div>
            ` : ''}

            <!-- Signatures -->
            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-label">Technician Signature</div>
                    <div style="font-size: 10px; margin-top: 4px; font-weight: 600;">${jobCard?.technicianName || ''}</div>
                </div>
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-label">Customer Signature</div>
                    <div style="font-size: 10px; margin-top: 4px; font-weight: 600;">${jobCard?.customerName || ''}</div>
                </div>
            </div>
        </div>

        <div class="footer">
            Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} | Powered by OnTru CCTV Management
        </div>
    </div>
</body>
</html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 300);
    };

    if (!isOpen) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'signed':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'draft':
            default:
                return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Service Job Card" maxWidth="max-w-4xl">
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">❌</span>
                    </div>
                    <p className="text-red-500 font-medium">{error}</p>
                    <button onClick={fetchJobCard} className="mt-4 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
                        Retry
                    </button>
                </div>
            ) : jobCard ? (
                <div ref={printRef}>
                    {/* Print Button */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{jobCard.jobCardNumber}</h2>
                            <p className="text-sm text-slate-500">Service Date: {new Date(jobCard.serviceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                <rect x="6" y="14" width="12" height="8"></rect>
                            </svg>
                            Print Job Card
                        </button>
                    </div>

                    {/* Company Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-5 rounded-t-2xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold">{dealerInfo?.companyName || 'Service Provider'}</h3>
                                <p className="text-sm opacity-90 mt-1">
                                    {dealerInfo?.address || 'Address not available'}
                                    {dealerInfo?.mobile && ` | Tel: ${dealerInfo.mobile}`}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="bg-white text-primary-600 px-4 py-2 rounded-lg font-bold text-lg">
                                    {jobCard.jobCardNumber}
                                </div>
                                <p className="text-xs mt-2 opacity-80">SERVICE JOB CARD</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="border-2 border-t-0 border-primary-200 dark:border-primary-800 rounded-b-2xl bg-white dark:bg-slate-900">
                        {/* Customer Info */}
                        <div className="p-5 bg-gradient-to-r from-primary-50 to-teal-50 dark:from-primary-900/20 dark:to-teal-900/20 border-b border-primary-100 dark:border-primary-800">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Customer Name</p>
                                    <p className="text-lg font-bold text-slate-800 dark:text-white">{jobCard.customerName}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{jobCard.customerPhone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Service Address</p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {jobCard.customerAddress}
                                        {jobCard.customerCity && `, ${jobCard.customerCity}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Service Details */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-4">Service Information</h4>
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">Service Date</p>
                                    <p className="font-semibold text-slate-800 dark:text-white">
                                        {new Date(jobCard.serviceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">Category</p>
                                    <p className="font-semibold text-slate-800 dark:text-white">{jobCard.complaintCategory}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">Technician</p>
                                    <p className="font-semibold text-slate-800 dark:text-white">{jobCard.technicianName || 'Not Assigned'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">Status</p>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(jobCard.status)}`}>
                                        {jobCard.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Complaint */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">Complaint Details</h4>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                <p className="text-slate-700 dark:text-slate-300 font-medium">{jobCard.complaintTitle}</p>
                            </div>
                        </div>

                        {/* Work Performed */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">Work Performed</h4>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl min-h-[60px]">
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {jobCard.workDone || 'Work details to be filled by technician.'}
                                </p>
                            </div>
                        </div>

                        {/* Parts Used */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">Parts / Materials Used</h4>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl min-h-[40px]">
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {jobCard.partsUsed || 'No parts used or to be filled.'}
                                </p>
                            </div>
                        </div>

                        {/* Resolution Notes */}
                        {jobCard.resolutionNotes && (
                            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                                <h4 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">Resolution Notes</h4>
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{jobCard.resolutionNotes}</p>
                                </div>
                            </div>
                        )}

                        {/* Signatures */}
                        <div className="p-5">
                            <div className="grid grid-cols-2 gap-10 pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-700">
                                <div className="text-center">
                                    <div className="h-12 border-b-2 border-slate-400 dark:border-slate-600 mb-2"></div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Technician Signature</p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">{jobCard.technicianName || ''}</p>
                                </div>
                                <div className="text-center">
                                    <div className="h-12 border-b-2 border-slate-400 dark:border-slate-600 mb-2"></div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Customer Signature</p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">{jobCard.customerName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 text-center py-3 px-5 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-700 rounded-b-2xl">
                            Generated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} | Powered by OnTru
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-slate-500">
                    No job card found.
                </div>
            )}
        </Modal>
    );
};

export default JobCardModal;
