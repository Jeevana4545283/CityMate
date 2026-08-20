import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Trophy, Check, X, MessageSquare, Clock, MapPin, Calendar, Trash2 } from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

export const SportsRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'my-posts'>('received');
  
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'received') {
        const data = await api.getReceivedSportsRequests();
        setReceivedRequests(data);
      } else if (activeTab === 'sent') {
        const data = await api.getMySportsRequests();
        setSentRequests(data);
      } else if (activeTab === 'my-posts') {
        const data = await api.getMySportsPosts();
        setMyPosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await api.acceptSportsRequest(id);
      setReceivedRequests(prev => prev.map(req => req._id === id ? { ...req, status: 'ACCEPTED' } : req));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.rejectSportsRequest(id);
      setReceivedRequests(prev => prev.map(req => req._id === id ? { ...req, status: 'REJECTED' } : req));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.cancelSportsRequest(id);
      setSentRequests(prev => prev.map(req => req._id === id ? { ...req, status: 'CANCELLED' } : req));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await api.deleteSportsPost(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">Pending</span>;
      case 'ACCEPTED':
        return <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">Accepted</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">Rejected</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 rounded-full bg-neutral-200 text-neutral-800 text-xs font-bold">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
              <Trophy className="w-7 h-7 text-neutral-900" />
              <span>Sports Partner Requests</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">Manage your sports partner connections.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
             <button
              onClick={() => navigate('/sports')}
              className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 text-xs font-bold shadow-xs"
            >
              Find Partners
            </button>
          </div>
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 whitespace-nowrap rounded-xl text-xs font-bold transition-all ${
              activeTab === 'received' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Received Requests
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 whitespace-nowrap rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sent' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Sent Requests
          </button>
          <button
            onClick={() => setActiveTab('my-posts')}
            className={`px-4 py-2 whitespace-nowrap rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my-posts' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            My Sports Posts
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {activeTab === 'received' && receivedRequests.length === 0 && (
              <div className="col-span-full text-center py-12 text-neutral-500 text-sm">No received requests.</div>
            )}
            {activeTab === 'received' && receivedRequests.map((req) => (
              <div key={req._id} className="glass-card p-6 rounded-3xl border border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <img src={req.sender.profilePhoto || 'https://via.placeholder.com/150'} alt={req.sender.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">{req.sender.name}</h4>
                        <span className="text-xs text-neutral-500">{renderStatusBadge(req.status)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-xl mb-4 border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-900 mb-1">Requested to play {req.post?.sport}</p>
                    <div className="flex items-center space-x-2 text-xs text-neutral-600">
                      <Calendar className="w-3 h-3" /> <span>{req.post?.date} at {req.post?.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-neutral-600 mt-1">
                      <MapPin className="w-3 h-3" /> <span>{req.post?.venue}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {req.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleAccept(req._id)} className="flex-1 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold">Accept</button>
                      <button onClick={() => handleReject(req._id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100">Reject</button>
                    </>
                  )}
                  {req.status === 'ACCEPTED' && (
                    <button onClick={() => navigate(`/messages?userId=${req.sender._id}`)} className="w-full py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
                      <MessageSquare className="w-4 h-4" /> <span>Contact</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {activeTab === 'sent' && sentRequests.length === 0 && (
              <div className="col-span-full text-center py-12 text-neutral-500 text-sm">No sent requests.</div>
            )}
            {activeTab === 'sent' && sentRequests.map((req) => (
              <div key={req._id} className="glass-card p-6 rounded-3xl border border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <img src={req.receiver.profilePhoto || 'https://via.placeholder.com/150'} alt={req.receiver.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">{req.receiver.name}'s Post</h4>
                        <span className="text-xs text-neutral-500">{renderStatusBadge(req.status)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-xl mb-4 border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-900 mb-1">{req.post?.sport} Partner Request</p>
                    <div className="flex items-center space-x-2 text-xs text-neutral-600">
                      <Calendar className="w-3 h-3" /> <span>{req.post?.date} at {req.post?.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {req.status === 'PENDING' && (
                    <button onClick={() => handleCancel(req._id)} className="w-full py-2 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-200">Cancel Request</button>
                  )}
                  {req.status === 'ACCEPTED' && (
                    <button onClick={() => navigate(`/messages?userId=${req.receiver._id}`)} className="w-full py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
                      <MessageSquare className="w-4 h-4" /> <span>Contact</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {activeTab === 'my-posts' && myPosts.length === 0 && (
              <div className="col-span-full text-center py-12 text-neutral-500 text-sm">You haven't created any sports posts.</div>
            )}
            {activeTab === 'my-posts' && myPosts.map((post) => (
              <div key={post._id} className="glass-card p-6 rounded-3xl border border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                     <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs font-bold">
                        🏸 {post.sport}
                     </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-2">{post.title}</h3>
                  <div className="space-y-1.5 text-xs text-neutral-700 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-neutral-900" />
                      <span>{post.date} • {post.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-neutral-900" />
                      <span>{post.venue}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleDeletePost(post._id)} className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 flex items-center justify-center space-x-1">
                    <Trash2 className="w-3.5 h-3.5" /> <span>Delete Post</span>
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default SportsRequestsPage;
