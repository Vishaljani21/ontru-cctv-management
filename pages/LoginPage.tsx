
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/contexts';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'dealer' | 'technician' | 'admin'>('dealer');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('password123');
  const [otp, setOtp] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authContext?.user) {
      if (authContext.user.role === 'admin') {
        navigate('/admin/license', { replace: true });
      } else {
        const homePath = authContext.user.role === 'dealer' ? '/' : '/tech/dashboard';
        navigate(homePath, { replace: true });
      }
    }
  }, [authContext, navigate]);

  useEffect(() => {
    if (role === 'admin') {
      setIdentifier('admin@ontru.com');
      setPassword('admin123');
    } else {
      setIdentifier(role === 'dealer' ? 'dealer@example.com' : '9876543210');
      setPassword('password123');
    }
    setOtp('');
    setError(null);
    setLoginMethod('password');
    setOtpSent(false);
  }, [role]);

  const handleSendOtp = async () => {
    if (!identifier) {
      setError(role === 'dealer' ? 'Please enter your email or phone.' : 'Please enter your phone number.');
      return;
    }
    setIsLoading(true);
    console.log(`Sending OTP to ${identifier}`);
    await new Promise(res => setTimeout(res, 1000));
    setOtpSent(true);
    setIsLoading(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authContext?.login(identifier, password);
    } catch (err: any) {
      console.error("Login Error:", err);
      let message = err.message || 'Incorrect credentials. Please try again.';
      // Make error message more user-friendly
      if (message.includes('fetch') || message.includes('network') || message.includes('Failed to fetch')) {
        message = `Unable to connect to ${import.meta.env.VITE_SUPABASE_URL}`;
        console.error('Connection failed to:', import.meta.env.VITE_SUPABASE_URL);
      }
      setError(`${message} (API: ${import.meta.env.VITE_SUPABASE_URL})`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Login Card */}
        <div className="bg-white/90 dark:bg-slate-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700 p-8 space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25 mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">OnTru</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your account</p>
          </div>

          {/* Role Tabs - Enhanced visibility */}
          <div className="flex items-center p-1.5 bg-slate-200 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setRole('dealer')}
              className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${role === 'dealer'
                ? 'bg-white dark:bg-teal-600 text-teal-600 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Dealer
            </button>
            <button
              onClick={() => setRole('technician')}
              className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${role === 'technician'
                ? 'bg-white dark:bg-teal-600 text-teal-600 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Technician
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email/Phone Field */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {role === 'technician' ? 'Phone Number' : 'Email'}
              </label>
              <input
                id="identifier"
                name="identifier"
                type={role === 'technician' ? 'tel' : 'email'}
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{ color: '#0f172a', backgroundColor: '#ffffff', opacity: 1 }}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                placeholder={role === 'technician' ? 'Enter Phone Number' : 'Enter Email'}
              />
            </div>

            {/* Password Field */}
            {loginMethod === 'password' ? (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ color: '#0f172a' }}
                  className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="Enter Password"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Enter OTP
                </label>
                <div className="flex gap-3">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ color: '#0f172a' }}
                    className="flex-1 px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                    placeholder="6-digit code"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading || otpSent}
                    className="px-4 py-3 text-sm font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/20 border-2 border-teal-200 dark:border-teal-500/40 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-500/30 disabled:opacity-50 whitespace-nowrap transition-all"
                  >
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
              </div>
            )}

            {/* Toggle Login Method */}
            {role !== 'admin' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setLoginMethod(prev => prev === 'password' ? 'otp' : 'password')}
                  className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                >
                  {loginMethod === 'password' ? 'Use OTP' : 'Use Password'}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/30 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 text-base font-bold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:from-teal-400 hover:to-teal-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>{loginMethod === 'otp' ? 'Verify & Sign In' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Admin Login Toggle */}
          <div className="text-center pt-2">
            <button
              onClick={() => setRole(role === 'admin' ? 'dealer' : 'admin')}
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {role === 'admin' ? '← Back to User Login' : 'Admin Login →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
