
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
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg relative">
        <div className="text-center">
          <OnTruFullLogo />
        </div>

        <div className="flex items-center p-1 bg-slate-200 rounded-lg">
          <button
            onClick={() => setRole('dealer')}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${role === 'dealer' ? 'bg-white text-primary-600 shadow' : 'text-slate-600'}`}
          >
            Dealer
          </button>
          <button
            onClick={() => setRole('technician')}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${role === 'technician' ? 'bg-white text-primary-600 shadow' : 'text-slate-600'}`}
          >
            Technician
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {renderFormFields()}

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-primary-500 border border-transparent rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
            >
              {isLoading ? 'Signing In...' : (loginMethod === 'otp' ? 'Verify & Sign In' : 'Sign In')}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <button onClick={() => setRole(role === 'admin' ? 'dealer' : 'admin')} className="text-xs text-slate-400 hover:text-slate-600">
            {role === 'admin' ? 'Back to User Login' : 'Admin Login'}
          </button>
        </div>
      </div>
    </div>
      
       {/* Debug Info Overlay */ }
  <div className="fixed bottom-2 right-2 bg-gray-100 p-2 text-xs text-gray-500 rounded border border-gray-300 z-50 opacity-75 hover:opacity-100">
    API Target: {import.meta.env.VITE_SUPABASE_URL || 'UNDEFINED'}
  </div>
    </div >
  );
};

export default LoginPage;
