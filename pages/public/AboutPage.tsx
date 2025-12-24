
import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl md:text-6xl">About OnTru</h1>
                <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
                    Empowering CCTV Businesses with Technology.
                </p>
            </div>
            
            <div className="mt-16 prose prose-lg mx-auto text-slate-500">
                <p>
                    OnTru was founded with a simple mission: to simplify the complex operations of CCTV dealers and system integrators. We understand that managing inventory, technicians, projects, and customer relationships can be overwhelming using traditional methods like paper and spreadsheets.
                </p>
                <p>
                    Our platform is built specifically for the security surveillance industry. We combine project management, CRM, inventory tracking, and billing into a single, cohesive ecosystem. This allows business owners to focus on growth rather than getting bogged down in administrative tasks.
                </p>
                <h3>Our Vision</h3>
                <p>
                    To be the leading operational backbone for security system integrators globally, fostering efficiency and transparency in the industry.
                </p>
                <h3>Why Choose Us?</h3>
                <ul>
                    <li>Industry-specific features designed for CCTV businesses.</li>
                    <li>User-friendly interface for both dealers and technicians.</li>
                    <li>Robust reporting and analytics to drive better decisions.</li>
                    <li>Dedicated support and continuous innovation.</li>
                </ul>
            </div>
        </div>
    );
};

export default AboutPage;
