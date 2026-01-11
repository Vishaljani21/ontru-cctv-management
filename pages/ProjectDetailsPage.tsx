import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("ProjectDetailsPage Mounted", id);
    }, [id]);

    return (
        <div className="min-h-screen bg-white text-slate-900 p-20 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">DEBUG MODE: PAGE WORKS</h1>
            <p className="text-xl">If you can see this, the routing and basic app structure are fine.</p>
            <p className="mt-4 font-mono bg-slate-100 p-2 rounded">Project ID: {id}</p>
            <button
                onClick={() => navigate('/projects')}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Back to Projects
            </button>
        </div>
    );
};

export default ProjectDetailsPage;
