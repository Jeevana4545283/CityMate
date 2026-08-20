import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSidebar } from '../context/SidebarContext';
import { ClipboardList, CheckCircle, XCircle } from 'lucide-react';

export const BookingRequestsPage: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await api.getBookingRequests();
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await api.acceptBooking(id);
      } else {
        await api.rejectBooking(id);
      }
      
      // Update local state: mark the processed one, and if accepted, reject others for same property
      const processedRequest = requests.find(r => r._id === id);
      if (!processedRequest) return;

      setRequests(prev => prev.map(req => {
        if (req._id === id) {
          return { ...req, status: action === 'accept' ? 'ACCEPTED' : 'REJECTED' };
        }
        if (action === 'accept' && req.property?._id === processedRequest.property?._id && req.status === 'PENDING') {
          return { ...req, status: 'REJECTED' };
        }
        return req;
      }));

    } catch (error: any) {
      alert(error.response?.data?.message || `Error ${action}ing booking`);
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
            <ClipboardList className="w-7 h-7 text-neutral-900" />
            <span>Booking Requests</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">Manage incoming booking requests for your properties.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="bg-white h-24 rounded-2xl animate-pulse border border-neutral-200" />)}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
            <ClipboardList className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-900">No booking requests yet</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req._id} className="bg-white rounded-2xl p-5 border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-start gap-4">
                  <img src={req.requester?.profilePhoto || 'https://via.placeholder.com/100'} className="w-12 h-12 rounded-full object-cover border border-neutral-200" />
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">{req.requester?.name || 'User'} <span className="font-medium text-neutral-500">requested</span> {req.property?.title || 'Unknown Property'}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Date: {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                  
                  {req.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAction(req._id, 'accept')}
                        className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-bold flex items-center hover:bg-neutral-800"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
                      </button>
                      <button 
                        onClick={() => handleAction(req._id, 'reject')}
                        className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center border border-red-100 hover:bg-red-100"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
