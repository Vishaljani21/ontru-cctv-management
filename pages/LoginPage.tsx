
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/contexts';
import { handleError } from '../utils/errorHandler';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'dealer' | 'technician' | 'admin'>('dealer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    // Clear form on role change
    setIdentifier('');
    setPassword('');
    setError(null);
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authContext?.login(identifier, password);
    } catch (err: any) {
      // Use friendly error handler - no technical details shown to user
      const friendlyMessage = handleError(err, 'Login');
      setError(friendlyMessage);
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

          {/* Role Tabs */}
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
                style={{ color: '#0f172a', backgroundColor: '#ffffff', opacity: 1 }}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                placeholder="Enter Password"
              />
            </div>

            {/* Error Message - User Friendly */}
            {error && (
              <div className="p-4 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
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
                <span>Sign In</span>
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
