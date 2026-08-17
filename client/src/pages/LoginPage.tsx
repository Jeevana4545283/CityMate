import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, User, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(name, email);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoName: string, demoEmail: string) => {
    setName(demoName);
    setEmail(demoEmail);
    login(demoName, demoEmail).then(() => navigate('/dashboard'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 text-neutral-900">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm relative">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center font-black text-white text-xl">
              CM
            </div>
            <span className="text-2xl font-black text-neutral-900 tracking-tight">CityMate</span>
          </Link>
          <h2 className="text-xl font-extrabold text-neutral-900">Welcome to CityMate 👋</h2>
          <p className="text-xs text-neutral-500 mt-1">
            No password needed. Enter your Name and Email to log in or create your account.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-neutral-100 border border-neutral-300 flex items-center space-x-2 text-xs text-neutral-900 font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-neutral-900" />
            <span>{error}</span>
          </div>
        )}

        {/* Passwordless Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul"
                className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@gmail.com"
                className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 rounded-xl text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Logging in...' : 'Continue to CityMate'}</span>
          </button>
        </form>

        {/* Quick Demo One-Click Accounts */}
        <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
          <p className="text-[11px] text-neutral-400 font-semibold mb-3 flex items-center justify-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            <span>One-Click Login as Demo User:</span>
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('Rahul', 'rahul@gmail.com')}
              className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-900 border border-neutral-200 transition-all text-left"
            >
              <div>Rahul</div>
              <div className="text-[10px] text-neutral-400 font-normal">rahul@gmail.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('Priya', 'priya@gmail.com')}
              className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-900 border border-neutral-200 transition-all text-left"
            >
              <div>Priya</div>
              <div className="text-[10px] text-neutral-400 font-normal">priya@gmail.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('Arjun', 'arjun@gmail.com')}
              className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-900 border border-neutral-200 transition-all text-left"
            >
              <div>Arjun</div>
              <div className="text-[10px] text-neutral-400 font-normal">arjun@gmail.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('Sneha', 'sneha@gmail.com')}
              className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-900 border border-neutral-200 transition-all text-left"
            >
              <div>Sneha</div>
              <div className="text-[10px] text-neutral-400 font-normal">sneha@gmail.com</div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-500">
          Want custom options?{' '}
          <Link to="/register" className="text-neutral-900 font-bold hover:underline">
            Register with Details
          </Link>
        </div>
      </div>
    </div>
  );
};
