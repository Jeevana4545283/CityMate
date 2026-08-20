import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, UserPlus, Check } from 'lucide-react';
import { api } from '../services/api';
import { useSidebar } from '../context/SidebarContext';

export const EventPartnersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  
  const [event, setEvent] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [eventData, partnersData] = await Promise.all([
        api.getEventById(id as string),
        api.getAvailableEventPartners(id as string)
      ]);
      setEvent(eventData);
      setPartners(partnersData);
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert(err.response?.data?.message || 'You must join the event first.');
        navigate(`/events/${id}`);
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (targetId: string) => {
    try {
      await api.sendEventPartnerRequest(id as string, targetId);
      setRequestedIds(new Set([...requestedIds, targetId]));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error sending request');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center">Event not found</div>;

  return (
    <div className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(`/events/${id}`)} className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-900 mb-6 font-medium text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event</span>
        </button>

        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm mb-8">
          <h1 className="text-2xl font-black text-neutral-900 mb-2">Find Event Partners</h1>
          <p className="text-neutral-500 text-sm mb-4">Find someone from CityMate to attend <strong>{event.title}</strong> with you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partners.length === 0 ? (
            <div className="col-span-full text-center py-12 text-neutral-500 bg-white rounded-3xl border border-neutral-200">
              No available attendees found to partner with.
            </div>
          ) : (
            partners.map(partner => (
              <div key={partner._id} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center font-bold">
                    {partner.profilePhoto ? <img src={partner.profilePhoto} className="w-full h-full object-cover" /> : partner.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">{partner.name}</h3>
                    <div className="flex items-center space-x-1 text-xs text-neutral-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{partner.city || 'Nearby'}</span>
                    </div>
                  </div>
                </div>
                
                {requestedIds.has(partner._id) ? (
                  <button disabled className="px-4 py-2 bg-neutral-100 text-neutral-500 rounded-xl text-xs font-bold flex items-center space-x-1">
                    <Check className="w-4 h-4" /> <span>Request Sent</span>
                  </button>
                ) : (
                  <button onClick={() => handleSendRequest(partner._id)} className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center space-x-1">
                    <UserPlus className="w-4 h-4" /> <span>Send Request</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
