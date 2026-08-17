import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, User, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [area, setArea] = useState('Gachibowli');
  const [role, setRole] = useState<UserRole>('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in both Name and Email.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register({
        name,
        email,
        city,
        area,
        role,
        interests: ['Sports', 'Technology', 'Community', 'Food'],
        sports: [
          {
            sport: 'Badminton',
            skillLevel: 'Intermediate',
            playingStyle: 'Doubles',
            preferredTime: 'Evening',
            availableDays: ['Saturday', 'Sunday']
          }
        ]
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 text-neutral-900">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm relative">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center space-x-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center font-black text-white text-xl">
              CM
            </div>
            <span className="text-2xl font-black text-neutral-900 tracking-tight">CityMate</span>
          </Link>
          <h2 className="text-xl font-extrabold text-neutral-900">Join CityMate Today</h2>
          <p className="text-xs text-neutral-500 mt-1">No password needed. Simply enter your Name and Email.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-neutral-100 border border-neutral-300 flex items-center space-x-2 text-xs text-neutral-900 font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-neutral-900" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
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
                placeholder="rahul@gmail.com"
                className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
              >
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Area / Locality</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
              >
                <option value="Gachibowli">Gachibowli</option>
                <option value="Kondapur">Kondapur</option>
                <option value="Madhapur">Madhapur</option>
                <option value="Hitech City">Hitech City</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-2">Account Type:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('USER')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  role === 'USER'
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setRole('SERVICE_PROVIDER')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  role === 'SERVICE_PROVIDER'
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                }`}
              >
                Provider
              </button>
              <button
                type="button"
                onClick={() => setRole('PROPERTY_OWNER')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  role === 'PROPERTY_OWNER'
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                }`}
              >
                Owner
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center space-x-2 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Continue to CityMate'}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="text-neutral-900 font-bold hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
