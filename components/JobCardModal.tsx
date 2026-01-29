import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { api } from '../services/api';
import type { JobCard } from '../types';
import { PrinterIcon, CheckCircleIcon, ClockIcon, MapPinIcon, PhoneIcon, UserIcon } from './icons';

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
                // Create job card if not exists
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

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Job Card - ${jobCard?.jobCardNumber}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Arial, sans-serif; 
                        padding: 20px; 
                        color: #1a1a1a;
                        font-size: 12px;
                    }
                    .job-card { 
                        max-width: 800px; 
                        margin: 0 auto; 
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
                    .company-name { font-size: 20px; font-weight: bold; }
                    .company-address { font-size: 11px; opacity: 0.9; margin-top: 4px; }
                    .job-number { 
                        background: white;
                        color: #0d9488;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-weight: bold;
                        font-size: 14px;
                    }
                    .content { padding: 20px; }
                    .section { margin-bottom: 16px; }
                    .section-title { 
                        font-weight: bold; 
                        color: #0d9488; 
                        font-size: 13px;
                        border-bottom: 1px solid #e5e7eb;
                        padding-bottom: 6px;
                        margin-bottom: 10px;
                    }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                    .field { margin-bottom: 8px; }
                    .field-label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
                    .field-value { font-weight: 500; margin-top: 2px; }
                    .full-width { grid-column: span 2; }
                    .work-box {
                        background: #f3f4f6;
                        padding: 12px;
                        border-radius: 6px;
                        min-height: 60px;
                        white-space: pre-wrap;
                    }
                    .signature-section {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 40px;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px dashed #d1d5db;
                    }
                    .signature-box {
                        text-align: center;
                    }
                    .signature-line {
                        border-top: 1px solid #1a1a1a;
                        margin-top: 50px;
                        padding-top: 8px;
                        font-size: 11px;
                    }
                    .footer {
                        text-align: center;
                        padding: 10px;
                        background: #f9fafb;
                        font-size: 10px;
                        color: #6b7280;
                    }
                    @media print {
                        body { padding: 0; }
                        .job-card { border-width: 1px; }
                    }
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Job Card" maxWidth="max-w-3xl">
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-red-500">{error}</p>
                    <button onClick={fetchJobCard} className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg">
                        Retry
                    </button>
                </div>
            ) : jobCard ? (
                <div>
                    {/* Print Button */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                        >
                            <PrinterIcon className="w-5 h-5" />
                            Print Job Card
                        </button>
                    </div>

                    {/* Printable Content */}
                    <div ref={printRef}>
                        <div className="job-card border-2 border-primary-500 rounded-xl overflow-hidden">
                            {/* Header */}
                            <div className="header bg-gradient-to-r from-primary-600 to-primary-500 text-white p-5 flex justify-between items-center">
                                <div>
                                    <div className="company-name text-xl font-bold">
                                        {dealerInfo?.companyName || 'Service Provider'}
                                    </div>
                                    <div className="company-address text-sm opacity-90">
                                        {dealerInfo?.address || ''}
                                        {dealerInfo?.mobile && ` | ${dealerInfo.mobile}`}
                                    </div>
                                </div>
                                <div className="job-number bg-white text-primary-600 px-4 py-2 rounded-lg font-bold">
                                    {jobCard.jobCardNumber}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="content p-5 space-y-5">
                                {/* Customer Details */}
                                <div className="section">
                                    <div className="section-title text-primary-600 font-bold border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                                        <UserIcon className="w-4 h-4" />
                                        Customer Details
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="field">
                                            <div className="field-label text-xs text-slate-500 uppercase">Customer Name</div>
                                            <div className="field-value font-medium">{jobCard.customerName}</div>
                                        </div>
                                        <div className="field">
                                            <div className="field-label text-xs text-slate-500 uppercase">Phone</div>
                                            <div className="field-value font-medium">{jobCard.customerPhone}</div>
                                        </div>
                                        <div className="field col-span-2">
                                            <div className="field-label text-xs text-slate-500 uppercase">Address</div>
                                            <div className="field-value font-medium">
                                                {jobCard.customerAddress}
                                                {jobCard.customerCity && `, ${jobCard.customerCity}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Service Details */}
                                <div className="section">
                                    <div className="section-title text-primary-600 font-bold border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                                        <ClockIcon className="w-4 h-4" />
                                        Service Details
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="field">
                                            <div className="field-label text-xs text-slate-500 uppercase">Service Date</div>
                                            <div className="field-value font-medium">
                                                {new Date(jobCard.serviceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div className="field">
                                            <div className="field-label text-xs text-slate-500 uppercase">Category</div>
                                            <div className="field-value font-medium">{jobCard.complaintCategory}</div>
                                        </div>
                                        <div className="field">
                                            <div className="field-label text-xs text-slate-500 uppercase">Technician</div>
                                            <div className="field-value font-medium">{jobCard.technicianName || 'Not Assigned'}</div>
                                        </div>
                                        <div className="field">
                                            <div className="field-label text-xs text-slate-500 uppercase">Status</div>
                                            <div className="field-value font-medium capitalize">{jobCard.status}</div>
                                        </div>
                                        <div className="field col-span-2">
                                            <div className="field-label text-xs text-slate-500 uppercase">Complaint</div>
                                            <div className="field-value font-medium">{jobCard.complaintTitle}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Work Done */}
                                <div className="section">
                                    <div className="section-title text-primary-600 font-bold border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Work Performed
                                    </div>
                                    <div className="work-box bg-slate-50 p-4 rounded-lg min-h-[80px] whitespace-pre-wrap">
                                        {jobCard.workDone || 'Work details not yet provided.'}
                                    </div>
                                </div>

                                {/* Parts Used */}
                                {jobCard.partsUsed && (
                                    <div className="section">
                                        <div className="section-title text-primary-600 font-bold border-b border-slate-200 pb-2 mb-3">
                                            Parts / Materials Used
                                        </div>
                                        <div className="work-box bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">
                                            {jobCard.partsUsed}
                                        </div>
                                    </div>
                                )}

                                {/* Resolution Notes */}
                                {jobCard.resolutionNotes && (
                                    <div className="section">
                                        <div className="section-title text-primary-600 font-bold border-b border-slate-200 pb-2 mb-3">
                                            Resolution Notes
                                        </div>
                                        <div className="work-box bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">
                                            {jobCard.resolutionNotes}
                                        </div>
                                    </div>
                                )}

                                {/* Signatures */}
                                <div className="signature-section grid grid-cols-2 gap-10 mt-8 pt-6 border-t border-dashed border-slate-300">
                                    <div className="signature-box text-center">
                                        <div className="h-16 border-b border-slate-800"></div>
                                        <div className="mt-2 text-sm text-slate-600">Technician Signature</div>
                                    </div>
                                    <div className="signature-box text-center">
                                        <div className="h-16 border-b border-slate-800"></div>
                                        <div className="mt-2 text-sm text-slate-600">Customer Signature</div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="footer bg-slate-50 text-center py-3 text-xs text-slate-500">
                                Generated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                {' '} | Powered by Ontru
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-slate-500">
                    No job card found.
                </div>
            )}
        </Modal>
    );
};

export default JobCardModal;
