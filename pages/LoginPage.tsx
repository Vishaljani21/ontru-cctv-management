
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { OnTruFullLogo } from '../components/icons';

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
    // FIX: Redirect user if already logged in
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
    // Mock API call to send OTP
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

    if (loginMethod === 'otp') {
      try {
        await authContext?.login(identifier, password);
      } catch (err) {
        setError('Incorrect Phone Number or OTP.');
        setIsLoading(false);
      }
    } else {
      try {
        await authContext?.login(identifier, password);
      } catch (err) {
        const message = 'Incorrect Email/Phone or Password.';
        setError(message);
        setIsLoading(false);
      }
    }
  };

  const renderFormFields = () => (
    <>
      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-slate-700">
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
          className="w-full px-3 py-2 mt-1 placeholder-slate-400 border border-slate-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder={role === 'technician' ? 'Enter Phone Number' : 'Enter Email'}
        />
      </div>
      {loginMethod === 'password' ? (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mt-1 placeholder-slate-400 border border-slate-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter Password"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="otp" className="block text-sm font-medium text-slate-700">Enter OTP</label>
          <div className="flex items-center space-x-2">
            <input
              id="otp"
              name="otp"
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 mt-1 placeholder-slate-400 border border-slate-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter 6-digit code"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isLoading || otpSent}
              className="px-4 py-2 mt-1 text-sm font-medium text-primary-700 bg-primary-100 border border-transparent rounded-md hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 whitespace-nowrap"
            >
              {otpSent ? 'Resend' : 'Send OTP'}
            </button>
          </div>
        </div>
      )}
      {role !== 'admin' && (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setLoginMethod(prev => prev === 'password' ? 'otp' : 'password')}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            {loginMethod === 'password' ? 'Use OTP' : 'Use Password'}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-primary-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50">
        {/* Centered Logo */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25 mb-4">
            <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">OnTru</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        {/* Role Tabs - Centered */}
        <div className="flex items-center justify-center p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setRole('dealer')}
            className={`flex-1 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'dealer' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Dealer
          </button>
          <button
            onClick={() => setRole('technician')}
            className={`flex-1 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'technician' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Technician
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {renderFormFields()}

          {error && <p className="text-sm text-red-600 text-center bg-red-50 py-2 rounded-lg">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center items-center gap-2 w-full px-4 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                  </svg>
                  Signing In...
                </>
              ) : (
                loginMethod === 'otp' ? 'Verify & Sign In' : 'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <button onClick={() => setRole(role === 'admin' ? 'dealer' : 'admin')} className="text-xs text-slate-400 hover:text-primary-600 transition-colors">
            {role === 'admin' ? '← Back to User Login' : 'Admin Login →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
