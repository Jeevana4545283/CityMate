import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useSidebar } from '../context/SidebarContext';
import { Calendar, Building, XCircle } from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await api.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking request?');
    if (!confirmCancel) return;

    try {
      await api.cancelBooking(id);
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error cancelling booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'ACCEPTED': return 'bg-green-50 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
      case 'CANCELLED': return 'bg-neutral-100 text-neutral-600 border-neutral-300';
      default: return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
            <Calendar className="w-7 h-7 text-neutral-900" />
            <span>My Bookings</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">Properties you have requested to book.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="bg-white h-24 rounded-2xl animate-pulse border border-neutral-200" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
            <Building className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-900">No bookings found</h3>
            <button onClick={() => navigate('/properties')} className="mt-4 px-4 py-2 text-sm font-bold text-neutral-900 bg-neutral-100 rounded-xl hover:bg-neutral-200">
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking._id} className="bg-white rounded-2xl p-5 border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img src={booking.property?.images?.[0] || 'https://via.placeholder.com/100'} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">{booking.property?.title || 'Unknown Property'}</h3>
                    <p className="text-xs text-neutral-500">Requested on: {new Date(booking.createdAt).toLocaleDateString()}</p>
                    <p className="text-[11px] font-medium mt-1">Owner: {booking.owner?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/properties/${booking.property?._id}`)} className="px-3 py-1.5 bg-neutral-100 rounded-lg text-xs font-bold hover:bg-neutral-200">View</button>
                    {booking.status === 'PENDING' && (
                      <button onClick={() => handleCancel(booking._id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center hover:bg-red-100">
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
