import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Plus, Search, Trophy, Music, Monitor, Activity, Palette, Mic, UserPlus, MessageSquare, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useSidebar } from '../context/SidebarContext';

export const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const { city } = useLocation();
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'browse' | 'my-events' | 'joined' | 'partner-requests'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [events, setEvents] = useState<any[]>([]);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TECH',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    city: city || 'Hyderabad',
    maxParticipants: 50
  });

  const CATEGORIES = [
    { id: 'All', label: 'All', icon: <Calendar className="w-4 h-4" /> },
    { id: 'MUSIC', label: 'Music', icon: <Music className="w-4 h-4" /> },
    { id: 'SPORTS', label: 'Sports', icon: <Trophy className="w-4 h-4" /> },
    { id: 'OPEN_MIC', label: 'Open Mic', icon: <Mic className="w-4 h-4" /> },
    { id: 'TECH', label: 'Tech', icon: <Monitor className="w-4 h-4" /> },
    { id: 'FITNESS', label: 'Fitness', icon: <Activity className="w-4 h-4" /> },
    { id: 'ART', label: 'Art', icon: <Palette className="w-4 h-4" /> }
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedCategory]);

  // Separate effect for search to avoid excessive calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'browse') fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'browse') {
        const data = await api.getEvents(selectedCategory, undefined, searchQuery);
        setEvents(data);
      } else if (activeTab === 'my-events') {
        const data = await api.getMyEvents();
        setMyEvents(data);
      } else if (activeTab === 'joined') {
        const data = await api.getJoinedEvents();
        setJoinedEvents(data);
      } else if (activeTab === 'partner-requests') {
        const data = await api.getEventPartnerRequests();
        setIncomingRequests(data.incoming);
        setSentRequests(data.sent);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createEvent(formData);
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'TECH',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        city: city || 'Hyderabad',
        maxParticipants: 50
      });
      if (activeTab === 'my-events') {
        fetchData();
      } else {
        setActiveTab('my-events');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryIcon = (cat: string) => {
    const found = CATEGORIES.find(c => c.id === cat);
    return found ? found.icon : <Calendar className="w-4 h-4" />;
  };

  const handleAcceptRequest = async (id: string) => {
    try {
      await api.acceptEventPartnerRequest(id);
      setIncomingRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'ACCEPTED' } : r));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error accepting request');
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await api.rejectEventPartnerRequest(id);
      setIncomingRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'REJECTED' } : r));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error rejecting request');
    }
  };

  const renderPartnerRequests = () => {
    return (
      <div className="col-span-full space-y-8">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Incoming Requests</h3>
          {incomingRequests.length === 0 ? (
            <p className="text-sm text-neutral-500">No incoming requests.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incomingRequests.map(r => (
                <div key={r._id} className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center font-bold">
                        {r.sender?.profilePhoto ? <img src={r.sender.profilePhoto} className="w-full h-full object-cover" /> : r.sender?.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900">{r.sender?.name}</h4>
                        <p className="text-xs text-neutral-500">{r.event?.title}</p>
                      </div>
                    </div>
                  </div>
                  {r.status === 'PENDING' ? (
                    <div className="flex space-x-2 mt-4">
                      <button onClick={() => handleAcceptRequest(r._id)} className="flex-1 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800">Accept</button>
                      <button onClick={() => handleRejectRequest(r._id)} className="flex-1 py-2 bg-neutral-100 text-neutral-900 rounded-xl text-xs font-bold hover:bg-neutral-200">Reject</button>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-col space-y-2">
                      <div className="flex items-center space-x-1 text-xs font-bold text-neutral-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600" /> <span>{r.status}</span>
                      </div>
                      {r.status === 'ACCEPTED' && (
                        <button onClick={() => navigate(`/messages?userId=${r.sender?._id}`)} className="w-full py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 flex justify-center items-center space-x-1">
                          <MessageSquare className="w-4 h-4" /> <span>Contact</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Sent Requests</h3>
          {sentRequests.length === 0 ? (
            <p className="text-sm text-neutral-500">No sent requests.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sentRequests.map(r => (
                <div key={r._id} className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center font-bold">
                        {r.receiver?.profilePhoto ? <img src={r.receiver.profilePhoto} className="w-full h-full object-cover" /> : r.receiver?.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900">{r.receiver?.name}</h4>
                        <p className="text-xs text-neutral-500">{r.event?.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col space-y-2">
                    <div className="flex items-center space-x-1 text-xs font-bold text-neutral-700">
                      {r.status === 'ACCEPTED' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <div className="w-2 h-2 rounded-full bg-neutral-400" />}
                      <span>{r.status}</span>
                    </div>
                    {r.status === 'ACCEPTED' && (
                      <button onClick={() => navigate(`/messages?userId=${r.receiver?._id}`)} className="w-full py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 flex justify-center items-center space-x-1">
                        <MessageSquare className="w-4 h-4" /> <span>Contact</span>
                      </button>
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

  const renderEventCards = (items: any[]) => {
    if (loading) return <div className="col-span-full text-center py-12 text-neutral-500">Loading events...</div>;
    if (items.length === 0) return <div className="col-span-full text-center py-12 text-neutral-500">No events found.</div>;

    return items.map(event => (
      <div key={event._id} className="glass-card p-6 rounded-3xl border border-neutral-200 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/events/${event._id}`)}>
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs font-bold flex items-center space-x-1">
              {getCategoryIcon(event.category)} <span>{event.category}</span>
            </span>
            <div className="text-xs font-bold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
              👥 {event.participants?.length || 0} / {event.maxParticipants} joined
            </div>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">{event.title}</h3>
          
          <div className="space-y-2 text-xs text-neutral-700 mb-6 bg-neutral-50 p-3 rounded-xl">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-neutral-900" />
              <span>{event.date} • {event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-neutral-900" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center text-[10px] font-bold">
              {event.organizer?.profilePhoto ? <img src={event.organizer.profilePhoto} className="w-full h-full object-cover" /> : event.organizer?.name?.charAt(0)}
            </div>
            <span className="text-xs text-neutral-600 font-medium">{event.organizer?.name}</span>
          </div>
          <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold">
            View Details
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
              <Calendar className="w-7 h-7 text-neutral-900" />
              <span>Local Events</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">Discover what's happening around you.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold shadow-xs flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('browse')} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${activeTab === 'browse' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}>
            <Search className="w-4 h-4" /> <span>Browse Events</span>
          </button>
          <button onClick={() => setActiveTab('joined')} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${activeTab === 'joined' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}>
            <Users className="w-4 h-4" /> <span>Joined Events</span>
          </button>
          <button onClick={() => setActiveTab('my-events')} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${activeTab === 'my-events' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}>
            <Calendar className="w-4 h-4" /> <span>My Events</span>
          </button>
          <button onClick={() => setActiveTab('partner-requests')} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${activeTab === 'partner-requests' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}>
            <UserPlus className="w-4 h-4" /> <span>Partner Requests</span>
          </button>
        </div>

        {activeTab === 'browse' && (
          <div className="bg-white p-4 rounded-2xl mb-6 border border-neutral-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all flex items-center space-x-1 ${
                    selectedCategory === cat.id ? 'bg-neutral-900 text-white shadow-xs' : 'bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  {cat.icon} <span>{cat.label}</span>
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-100 border-none rounded-xl text-xs focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'browse' && renderEventCards(events)}
          {activeTab === 'my-events' && renderEventCards(myEvents)}
          {activeTab === 'joined' && renderEventCards(joinedEvents)}
          {activeTab === 'partner-requests' && renderPartnerRequests()}
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Create Event</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full"><Plus className="w-5 h-5 rotate-45" /></button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Event Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900" placeholder="e.g., Tech Meetup" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900">
                  {CATEGORIES.filter(c => c.id !== 'All').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Max Participants</label>
                  <input required type="number" min="2" value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: parseInt(e.target.value)})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900" />
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
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900" placeholder="e.g., T-Hub, Madhapur" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-900" placeholder="What is this event about?"></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-neutral-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-neutral-800">
                Create Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
