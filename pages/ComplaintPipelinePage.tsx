import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Complaint } from '../types';
import PageHeader from '../components/PageHeader';
import ComplaintKanbanBoard from '../components/ComplaintKanbanBoard';

const ComplaintPipelinePage: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await api.getComplaints();
            setComplaints(data);
        } catch (error) {
            console.error("Failed to load complaints", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)]">
            <div className="shrink-0 mb-6">
                <PageHeader
                    title="Complaint Pipeline"
                    description="Visual overview of all service tickets by status."
                />
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center text-slate-400">Loading pipeline...</div>
            ) : (
                <div className="flex-1 overflow-hidden">
                    <ComplaintKanbanBoard
                        complaints={complaints}
                        onComplaintUpdate={loadData}
                    />
                </div>
            )}
        </div>
    );
};

export default ComplaintPipelinePage;
