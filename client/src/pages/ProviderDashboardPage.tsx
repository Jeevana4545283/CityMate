import React, { useState, useEffect } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react';
import { IServiceBooking, BookingStatus } from '../types';
import { api } from '../services/api';
import { VisualProgressTracker } from '../components/common/VisualProgressTracker';

export const ProviderDashboardPage: React.FC = () => {
  const [availabilityStatus, setAvailabilityStatus] = useState<'Available' | 'Busy' | 'Offline'>('Available');
  const [bookings, setBookings] = useState<IServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, nextStatus: BookingStatus) => {
    try {
      const updated = await api.updateBookingStatus(bookingId, nextStatus, 'Ravi Kumar', '+91 98765 43210');
      setBookings(bookings.map((b) => (b._id === bookingId ? { ...b, status: nextStatus } : b)));
      showToast(`Booking updated to '${nextStatus}'!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAvailability = async (newStatus: 'Available' | 'Busy' | 'Offline') => {
    setAvailabilityStatus(newStatus);
    await api.updateProviderStatus(newStatus);
    showToast(`Status set to ${newStatus}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const totalEarnings = bookings.reduce((sum, b) => (b.status === 'Completed' ? sum + b.estimatedCost : sum), 1250);

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 pt-6 lg:pl-[260px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs">
          <div>
            <span className="text-[10px] font-extrabold text-neutral-900 uppercase tracking-widest bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
              Handyman & Service Provider Control Panel
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1 flex items-center space-x-2">
              <Wrench className="w-7 h-7 text-neutral-900" />
              <span>Ravi Electrical Services</span>
            </h1>
            <p className="text-xs text-neutral-500 mt-1">Manage incoming repair jobs, update status, and track earnings.</p>
          </div>

          {/* Availability Status Switcher */}
          <div className="flex items-center space-x-2 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
            <span className="text-xs font-bold text-neutral-600 px-2">Status:</span>
            {(['Available', 'Busy', 'Offline'] as const).map((st) => (
              <button
                key={st}
                onClick={() => handleToggleAvailability(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  availabilityStatus === st
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500">Total Earnings</span>
            <div className="text-2xl font-black text-neutral-900 mt-1">₹{totalEarnings.toLocaleString()}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500">Active Jobs</span>
            <div className="text-2xl font-black text-neutral-900 mt-1">
              {bookings.filter((b) => b.status !== 'Completed' && b.status !== 'Cancelled').length}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500">Completed Jobs</span>
            <div className="text-2xl font-black text-neutral-900 mt-1">142</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500">Overall Rating</span>
            <div className="text-2xl font-black text-neutral-900 mt-1">⭐ 4.9</div>
          </div>
        </div>

        {/* Incoming & Active Booking Requests */}
        <h2 className="text-lg font-bold text-neutral-900 mb-4">Job Requests & Live Actions</h2>

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
            <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-neutral-900">No active job requests right now</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-neutral-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
                        {b.serviceCategory}
                      </span>
                      <span className="text-xs text-neutral-500">Scheduled: {b.bookingDate} at {b.bookingTimeSlot}</span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 mt-1">&quot;{b.problemDescription}&quot;</h3>
                    <p className="text-xs text-neutral-600 flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-900 mr-1" />
                      {b.locationAddress}
                    </p>
                  </div>

                  {/* Provider Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {b.status === 'Requested' && (
                      <button
                        onClick={() => handleStatusChange(b._id, 'Accepted')}
                        className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs"
                      >
                        Accept Job Request
                      </button>
                    )}

                    {b.status === 'Accepted' && (
                      <button
                        onClick={() => handleStatusChange(b._id, 'Worker Assigned')}
                        className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs"
                      >
                        Assign Handyman
                      </button>
                    )}

                    {b.status === 'Worker Assigned' && (
                      <button
                        onClick={() => handleStatusChange(b._id, 'On The Way')}
                        className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs"
                      >
                        Set &apos;On The Way&apos;
                      </button>
                    )}

                    {b.status === 'On The Way' && (
                      <button
                        onClick={() => handleStatusChange(b._id, 'Service Started')}
                        className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs"
                      >
                        Start Service
                      </button>
                    )}

                    {b.status === 'Service Started' && (
                      <button
                        onClick={() => handleStatusChange(b._id, 'Completed')}
                        className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>

                <VisualProgressTracker status={b.status} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
