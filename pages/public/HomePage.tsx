import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, UsersIcon, ProjectIcon, InventoryIcon } from '../../components/icons';

const StatsCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex flex-col items-center p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-slate-200/60 shadow-sm animate-fade-in-up">
        <dt className="order-2 mt-2 text-sm font-medium leading-6 text-slate-500">{label}</dt>
        <dd className="order-1 text-3xl font-extrabold text-primary-600">{value}</dd>
    </div>
);

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
);

const HomePage: React.FC = () => {
    return (
        <div className="overflow-hidden">
            {/* Hero Section with Gradient */}
            <div className="relative bg-slate-50 pt-16 pb-32 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-6">
                        🚀 The #1 Platform for CCTV Professionals
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
                        Manage your CCTV Business <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                            Like a Pro
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-slate-600 mb-10">
                        OnTru is the all-in-one operating system for CCTV dealers. Track projects, inventory, AMCs, and payments seamlessly from one intuitive dashboard.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/register" className="px-8 py-4 text-lg font-bold rounded-full text-white bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-primary-500/30 transition-all transform hover:-translate-y-0.5">
                            Start Free Trial
                        </Link>
                        <Link to="/about" className="px-8 py-4 text-lg font-medium rounded-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all">
                            Learn More
                        </Link>
                    </div>

                    {/* Stats */}
                    <dl className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 w-full max-w-4xl">
                        <StatsCard label="Active Projects" value="500+" />
                        <StatsCard label="CCTV Cameras Managed" value="12k+" />
                        <StatsCard label="Dealers Trusted" value="150+" />
                        <StatsCard label="Uptime Guaranteed" value="99.9%" />
                    </dl>

                    {/* Hero Image Mockup (Stylized) */}
                    <div className="mt-20 relative w-full max-w-5xl">
                        <div className="relative rounded-2xl bg-slate-900 p-2 shadow-2xl ring-1 ring-slate-900/10">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-1.5 bg-slate-700 rounded-full"></div>
                            <div className="rounded-xl overflow-hidden bg-white aspect-[16/9] flex items-center justify-center border border-slate-800">
                                {/* Placeholder for actual dashboard screenshot */}
                                <div className="text-center p-10">
                                    <h3 className="text-primary-600 font-bold text-2xl mb-2">OnTru Dashboard</h3>
                                    <p className="text-slate-500">Comprehensive analytics at a glance</p>
                                    <div className="mt-6 flex justify-center space-x-4 opacity-50">
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg"></div>
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg"></div>
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Everything you need to scale
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            title="Project Management"
                            description="Track installations, assign technicians, and monitor progress in real-time with Kanban boards and timelines."
                            icon={<ProjectIcon className="w-6 h-6" />}
                        />
                        <FeatureCard
                            title="Inventory Tracking"
                            description="Manage stock across multiple godowns with precise serial number tracking and low-stock alerts."
                            icon={<InventoryIcon className="w-6 h-6" />}
                        />
                        <FeatureCard
                            title="Technician App"
                            description="Dedicated mobile-friendly portal for technicians to view jobs, mark attendance, and upload site photos."
                            icon={<UsersIcon className="w-6 h-6" />}
                        />
                        <FeatureCard
                            title="Billing & Invoicing"
                            description="Create professional GST invoices, track payments, and generate financial reports instantly."
                            icon={<CheckCircleIcon className="w-6 h-6" />}
                        />
                        <FeatureCard
                            title="AMC Management"
                            description="Never miss a renewal. Automated AMC tracking sends reminders to you and your clients."
                            icon={<CheckCircleIcon className="w-6 h-6" />}
                        />
                        <FeatureCard
                            title="Site Health Monitoring"
                            description="Proactively monitor NVR status (Ping/HTTP) and camera connectivity to prevent downtime."
                            icon={<CheckCircleIcon className="w-6 h-6" />}
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary-900 relative isolate overflow-hidden">
                <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),theme(colors.primary.900))]"></div>
                <div className="max-w-3xl mx-auto text-center py-24 px-6 lg:px-8 z-10">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        Ready to modernize your CCTV business?
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-primary-200 max-w-xl mx-auto">
                        Join hundreds of dealers boosting their efficiency with OnTru.
                    </p>
                    <div className="mt-10 flex justify-center gap-x-6">
                        <Link to="/register" className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-primary-900 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                            Get Started Free
                        </Link>
                        <Link to="/contact" className="text-sm font-semibold leading-6 text-white flex items-center">
                            Contact Sales <span aria-hidden="true" className="ml-2">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
