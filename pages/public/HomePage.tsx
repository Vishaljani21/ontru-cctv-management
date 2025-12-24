
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, UsersIcon, ProjectIcon, InventoryIcon } from '../../components/icons';

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

const HomePage: React.FC = () => {
    return (
        <div>
            {/* Hero Section */}
            <div className="bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Manage your CCTV Business</span>{' '}
                                    <span className="block text-primary-600 xl:inline">Like a Pro</span>
                                </h1>
                                <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    OnTru is the all-in-one platform for CCTV dealers and technicians. Manage projects, track inventory, handle billing, and monitor site health from one dashboard.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg">
                                            Get Started
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link to="/about" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg">
                                            Learn More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-slate-100 flex items-center justify-center">
                   <div className="p-8 text-center">
                        {/* Placeholder for Hero Image */}
                        <div className="w-full h-96 bg-primary-200 rounded-lg flex items-center justify-center text-primary-500 text-xl font-bold">
                             App Dashboard Preview
                        </div>
                   </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Everything you need to scale
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
                            From project initiation to AMC renewals, we've got you covered.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            <FeatureCard 
                                title="Project Management" 
                                description="Track installations, assign technicians, and monitor progress in real-time."
                                icon={<ProjectIcon className="w-6 h-6"/>}
                            />
                            <FeatureCard 
                                title="Inventory Tracking" 
                                description="Manage stock across multiple godowns with serial number tracking."
                                icon={<InventoryIcon className="w-6 h-6"/>}
                            />
                            <FeatureCard 
                                title="Technician App" 
                                description="Dedicated portal for technicians to view jobs, mark attendance, and update status."
                                icon={<UsersIcon className="w-6 h-6"/>}
                            />
                            <FeatureCard 
                                title="Billing & Invoicing" 
                                description="Create professional GST invoices and track payments effortlessly."
                                icon={<CheckCircleIcon className="w-6 h-6"/>}
                            />
                            <FeatureCard 
                                title="AMC Management" 
                                description="Never miss a renewal with automated AMC tracking and reminders."
                                icon={<CheckCircleIcon className="w-6 h-6"/>}
                            />
                            <FeatureCard 
                                title="Site Health Monitoring" 
                                description="Remotely monitor NVR status, HDD health, and camera connectivity."
                                icon={<CheckCircleIcon className="w-6 h-6"/>}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CTA Section */}
             <div className="bg-primary-700">
                <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Ready to boost your business?</span>
                        <span className="block">Start your free trial today.</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-primary-200">
                        Join hundreds of CCTV dealers who trust OnTru for their daily operations.
                    </p>
                    <Link to="/register" className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto">
                        Sign up for free
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
