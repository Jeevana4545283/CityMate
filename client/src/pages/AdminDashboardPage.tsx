import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { MOCK_SERVICE_PROVIDERS } from '../services/mockData';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalUsers: 172,
    serviceProviders: 28,
    totalProperties: 48,
    totalBookings: 195,
    totalGames: 74,
    totalCommunities: 16,
    pendingVerifications: 3,
    activeUsers: 142
  });

  const [providers, setProviders] = useState(MOCK_SERVICE_PROVIDERS);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const verifyProvider = (id: string) => {
    setProviders(
      providers.map((p) => (p._id === id ? { ...p, verificationStatus: 'Verified' as const } : p))
    );
    showToast('Handyman / Provider account verified!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 pt-6 lg:pl-[260px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Dashboard Banner */}
        <div className="bg-white p-6 rounded-3xl mb-8 border border-neutral-200 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">CityMate Platform Admin</h1>
              <p className="text-xs text-neutral-500 mt-0.5">Platform overview, provider verifications, and content moderation.</p>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500">Total Users</span>
            <div className="text-2xl font-black text-neutral-900 mt-1">{stats.totalUsers}</div>
            <span className="text-[10px] text-neutral-500 font-semibold">{stats.activeUsers} Active This Week</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500">Service Providers</span>
            <div className="text-2xl font-black text-neutral-900 mt-1">{stats.serviceProviders}</div>
            <span className="text-[10px] text-neutral-500">{stats.pendingVerifications} Pending Verification</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500">Properties Listed</span>
            <div className="text-2xl font-black text-neutral-900 mt-1">{stats.totalProperties}</div>
            <span className="text-[10px] text-neutral-500">PGs, Hostels & Flats</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500">Total Bookings</span>
            <div className="text-2xl font-black text-neutral-900 mt-1">{stats.totalBookings}</div>
            <span className="text-[10px] text-neutral-500">Handyman Jobs Completed</span>
          </div>
        </div>

        {/* Verification Controls Table */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs">
          <h3 className="text-base font-bold text-neutral-900 mb-4 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-neutral-900" />
            <span>Manage Service Provider Verifications</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 text-neutral-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Business Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-neutral-800">
                {providers.map((p) => (
                  <tr key={p._id} className="hover:bg-neutral-50">
                    <td className="p-3 font-bold text-neutral-900">{p.businessName}</td>
                    <td className="p-3 font-semibold text-neutral-700">{p.category}</td>
                    <td className="p-3">{p.area}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          p.verificationStatus === 'Verified'
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {p.verificationStatus !== 'Verified' ? (
                        <button
                          onClick={() => verifyProvider(p._id)}
                          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[11px] shadow-xs"
                        >
                          Approve Verification
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 font-semibold">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
