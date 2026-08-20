import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowLeft, Trash2, Edit2, CheckCircle2, Plus } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const data = await api.getEventById(id as string);
      setEvent(data);
      setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        maxParticipants: data.maxParticipants
      });
    } catch (err) {
      console.error(err);
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      await api.joinEvent(id as string);
      fetchEvent();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error joining event');
    }
  };

  const handleLeave = async () => {
    try {
      await api.leaveEvent(id as string);
      fetchEvent();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error leaving event');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      await api.deleteEvent(id as string);
      navigate('/events');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting event');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateEvent(id as string, formData);
      setIsEditModalOpen(false);
      fetchEvent();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating event');
    }
  };

  if (loading || !event) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const isOrganizer = user?._id === event.organizer._id;
  const isJoined = event.participants.some((p: any) => p._id === user?._id);
  const isFull = event.participants.length >= event.maxParticipants;

  return (
    <div className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/events')} className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-900 mb-6 font-medium text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </button>

        <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-neutral-100 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 relative z-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs font-bold mb-4">
                {event.category}
              </span>
              <h1 className="text-3xl font-black text-neutral-900 mb-4 leading-tight">{event.title}</h1>
              
              <div className="flex flex-col gap-3 text-sm text-neutral-600 mb-8 bg-neutral-50 p-4 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-neutral-900" />
                  <span className="font-medium">{event.date} • {event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-neutral-900" />
                  <span className="font-medium">{event.location}, {event.city}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-neutral-900" />
                  <span className="font-medium">{event.participants.length} / {event.maxParticipants} joined</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-neutral-900 mb-3">About this Event</h3>
                <p className="text-neutral-600 whitespace-pre-wrap leading-relaxed">{event.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Organizer</h3>
                <div className="flex items-center space-x-3 bg-neutral-50 p-3 rounded-2xl w-max pr-6">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center font-bold">
                    {event.organizer.profilePhoto ? <img src={event.organizer.profilePhoto} className="w-full h-full object-cover" /> : event.organizer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 text-sm">{event.organizer.name}</div>
                    <div className="text-xs text-neutral-500">Event Creator</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              {isOrganizer ? (
                <>
                  <button onClick={() => setIsEditModalOpen(true)} className="w-full py-3 bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-xl text-sm font-bold flex justify-center items-center space-x-2 hover:bg-neutral-200 transition-colors">
                    <Edit2 className="w-4 h-4" /> <span>Edit Event</span>
                  </button>
                  <button onClick={handleDelete} className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold flex justify-center items-center space-x-2 hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" /> <span>Delete Event</span>
                  </button>
                </>
              ) : (
                <>
                  {isJoined ? (
                    <>
                      <div className="w-full py-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold flex justify-center items-center space-x-2 border border-green-200">
                        <CheckCircle2 className="w-4 h-4" /> <span>Joined ✓</span>
                      </div>
                      <button onClick={handleLeave} className="w-full py-3 bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-xl text-sm font-bold hover:bg-neutral-200 transition-colors">
                        Leave Event
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleJoin} 
                      disabled={isFull}
                      className={`w-full py-3 rounded-xl text-sm font-bold shadow-md transition-all ${isFull ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                    >
                      {isFull ? 'Event Full' : 'Join Event'}
                    </button>
                  )}
                  {isJoined && (
                    <button onClick={() => navigate(`/events/${event._id}/partners`)} className="w-full mt-2 py-3 bg-white text-neutral-900 border border-neutral-200 rounded-xl text-sm font-bold shadow-sm hover:bg-neutral-50 transition-colors">
                      Find Event Partners
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-neutral-100">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Participants ({event.participants.length})</h3>
            <div className="flex flex-wrap gap-2">
              {event.participants.map((p: any) => (
                <div key={p._id} className="flex items-center space-x-2 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-full">
                  <div className="w-5 h-5 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center text-[10px] font-bold">
                    {p.profilePhoto ? <img src={p.profilePhoto} className="w-full h-full object-cover" /> : p.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-neutral-700">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Edit Event</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full"><Plus className="w-5 h-5 rotate-45" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Event Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900">
                  <option value="MUSIC">Music</option>
                  <option value="SPORTS">Sports</option>
                  <option value="OPEN_MIC">Open Mic</option>
                  <option value="TECH">Tech</option>
                  <option value="FITNESS">Fitness</option>
                  <option value="ART">Art</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Max Participants</label>
                  <input required type="number" min={event.participants.length} value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: parseInt(e.target.value)})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Start Time</label>
                  <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">End Time</label>
                  <input required type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Location / Venue</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900"></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-neutral-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-neutral-800">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
