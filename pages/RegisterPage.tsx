import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { api } from '../services/api';
import { OnTruFullLogo, EyeIcon, EyeSlashIcon, EnvelopeIcon, PhoneIcon } from '../components/icons';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // DEBUG: Check connection config on load
  useEffect(() => {
    console.log("RegisterPage mounted. Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      console.log("Attempting registration for:", email);
      const user = await api.register({ email, phone, password });
      console.log("Registration API success:", user);

      await authContext?.login(email, password);
      console.log("Login context success");

      navigate('/setup');
    } catch (err: any) {
      console.error("Registration Error Detail:", err);
      // Helpful error message if connection fails
      let errorMessage = 'Registration failed.';

      if (typeof err === 'object' && err !== null) {
        // Handle Supabase error objects or generic objects
        errorMessage = err.message || err.error_description || JSON.stringify(err);
      } else {
        errorMessage = String(err);
      }

      if (errorMessage === '{}') errorMessage = 'Unknown Network Error (Check Console)';
      if (errorMessage.includes('Failed to fetch')) errorMessage = 'Connection Refused: Cannot reach Backend.';

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const API_DEBUG = import.meta.env.VITE_SUPABASE_URL;

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - visually rich */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        {/* Abstract Background Blobs - MATCHING HOME PAGE */}
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/30 rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 p-12 text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
              <OnTruFullLogo className="h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-6">
            Join the Network
          </h1>
          <p className="text-lg text-indigo-100 max-w-md mx-auto leading-relaxed">
            Connect with thousands of CCTV professionals managing their projects, inventory, and billing on OnTru.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-xs text-indigo-200 uppercase tracking-widest mt-1">Dealers</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-white">12k+</div>
              <div className="text-xs text-indigo-200 uppercase tracking-widest mt-1">Cameras</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
            <p className="mt-2 text-sm text-slate-500">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in-up">
                <p className="text-sm text-red-700 font-medium">{error}</p>
                {/* Debug help for Failed to fetch */}
                {error.includes('Connection') && (
                  <p className="text-xs text-red-500 mt-1">API: {import.meta.env.VITE_SUPABASE_URL}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium sm:text-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium sm:text-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="block w-full px-3 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="block w-full px-3 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/30 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647h0z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            <p className="text-xs text-center text-slate-400 mt-6 px-4">
              By joining, you agree to our <a href="#" className="underline hover:text-slate-600">Terms</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
