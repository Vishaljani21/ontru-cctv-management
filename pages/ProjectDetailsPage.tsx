import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Visit } from '../types';

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Visit | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                console.log("Fetching project", id);
                if (!id) throw new Error("No ID");
                const data = await api.getVisitById(Number(id));
                console.log("Data received", data);
                setProject(data);
            } catch (err: any) {
                console.error("Error", err);
                setError(err.message || String(err));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <div className="p-10 text-xl">Loading Data...</div>;
    if (error) return <div className="p-10 text-red-500 text-xl font-bold">Error Loading Data: {error}</div>;

    return (
        <div className="min-h-screen bg-white text-slate-900 p-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-green-600">✅ Data Fetching Verified</h1>
                <button
                    onClick={() => navigate('/projects')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Back to Projects
                </button>
            </div>

            <p className="mb-4">The raw data below confirms the API is working. The crash was in the UI layout.</p>

            <pre className="bg-slate-100 p-4 border border-slate-300 rounded overflow-auto max-h-[600px] text-xs font-mono shadow-inner">
                {JSON.stringify(project, null, 2)}
            </pre>
        </div>
    );
};

export default ProjectDetailsPage;
