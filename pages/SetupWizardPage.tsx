
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/contexts';
import { api } from '../services/api';
import { OnTruFullLogo } from '../components/icons';

const SetupWizardPage: React.FC = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form Fields
    const [name, setName] = useState(''); // Personal Name
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [gstin, setGstin] = useState('');

    // Derived from auth context, but editable
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');

    useEffect(() => {
        if (authContext?.user) {
            setEmail(authContext.user.email || '');
            setMobile(authContext.user.phone || '');
            if (authContext.user.isSetupComplete) {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [authContext, navigate]);

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("handleComplete called");
        if (!authContext?.user) {
            console.error("No user in authContext");
            return;
        }

        setIsLoading(true);

        // Timeout safety
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out - Server not responding")), 10000)
        );

        try {
            console.log("Calling api.completeSetup with user:", authContext.user.id);

            // Race between API call and timeout
            const updatedUser = await Promise.race([
                api.completeSetup(authContext.user.id, {
                    name,
                    companyName,
                    address,
                    gstin,
                    email,
                    mobile
                }),
                timeoutPromise
            ]);

            console.log("Setup complete. API returned:", updatedUser);

            // Update context AND localStorage via the new method
            console.log("Updating AuthContext...");
            // @ts-ignore
            authContext.updateUser(updatedUser);

            console.log("Redirecting to dashboard...");
            window.location.href = '/dashboard';
        } catch (error: any) {
            console.error("Setup failed:", error);
            alert(`Setup Failed: ${error.message || error}. Please try again.`);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center"><OnTruFullLogo /></div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Welcome to OnTru
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Let's get your dealer profile set up in just a few steps.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleComplete}>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Your Full Name</label>
                            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-3 px-4 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-base font-medium" placeholder="Enter your full name" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Company Name</label>
                            <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-3 px-4 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-base font-medium" placeholder="Enter company name" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">GSTIN (Optional)</label>
                            <input type="text" value={gstin} onChange={e => setGstin(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-3 px-4 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-base font-medium" placeholder="Enter GSTIN number" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Business Address</label>
                            <textarea required value={address} onChange={e => setAddress(e.target.value)} rows={3} className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-3 px-4 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-base font-medium" placeholder="Enter business address" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-3 px-4 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-base font-medium" placeholder="email@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Mobile</label>
                                <input type="tel" required value={mobile} onChange={e => setMobile(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-3 px-4 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-base font-medium" placeholder="+91 98765 43210" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400">
                                {isLoading ? 'Setting up...' : 'Complete Setup & Go to Dashboard'}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    By completing this setup, you agree to our Terms of Service and Privacy Policy.
                    Dealer and Engineer portals will be automatically configured.
                </p>
            </div>
        </div>
    );
};

export default SetupWizardPage;
