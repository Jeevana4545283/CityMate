import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, Shield, X, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

export const MyMatchesPage: React.FC = () => {
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await api.getMatches();
      setMatches(data);
    } catch (err) {
      showToast('Error loading matches');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (matchId: string) => {
    const confirm = window.confirm('Are you sure you want to remove this match?');
    if (!confirm) return;
    setMatches(matches.filter((m) => m._id !== matchId));
    showToast('Match removed');
  };

  const handleReport = async (userId: string) => {
    try {
      await api.reportOrBlockRoommate({ reportedUser: userId, type: 'REPORT' });
      showToast('User reported to admins');
    } catch (err) {
      showToast('Error reporting user');
    }
  };

  const handleBlock = async (userId: string) => {
    const confirm = window.confirm('Are you sure you want to block this user? They will disappear from your matches.');
    if (!confirm) return;
    try {
      await api.reportOrBlockRoommate({ reportedUser: userId, type: 'BLOCK' });
      showToast('User blocked');
      fetchMatches();
    } catch (err) {
      showToast('Error blocking user');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
              <Heart className="w-7 h-7 text-red-500 fill-red-50" />
              <span>My Matches</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              People who have mutually expressed interest in being roommates with you.
            </p>
          </div>
          <button onClick={() => navigate('/find-partner')} className="mt-4 md:mt-0 px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors">
            Discover More
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white h-48 rounded-3xl animate-pulse border border-neutral-200" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
            <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-900">No matches yet</h3>
            <p className="text-xs text-neutral-500 mt-1">Keep expressing interest in profiles to find a match!</p>
            <button onClick={() => navigate('/find-partner')} className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl">
              Go Discover
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              // Determine which user is the 'other' user
              const otherUser = match.userA._id === user?._id ? match.userB : match.userA;
              
              return (
                <div key={match._id} className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={otherUser.profilePhoto || 'https://via.placeholder.com/150'}
                          alt={otherUser.name}
                          className="w-12 h-12 rounded-full object-cover border border-neutral-200"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-neutral-900">{otherUser.name}</h3>
                          <p className="text-[11px] text-neutral-500 flex items-center">
                            <MapPin className="w-3 h-3 text-neutral-900 mr-1" />
                            {otherUser.area || 'No location specified'}
                          </p>
                        </div>
                      </div>
                      
                      <button onClick={() => handleRemove(match._id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] font-bold text-neutral-500 mb-1">Mutual Match</div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4 pt-4 border-t border-neutral-100">
                    <button
                      onClick={() => navigate(`/messages?userId=${otherUser._id}`)}
                      className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Start Conversation</span>
                    </button>
                    
                    <div className="flex gap-2">
                      <button onClick={() => handleReport(otherUser._id)} className="flex-1 py-2 text-[10px] font-semibold text-neutral-500 hover:text-neutral-800 bg-neutral-50 rounded-lg flex items-center justify-center">
                        <Shield className="w-3 h-3 mr-1" /> Report
                      </button>
                      <button onClick={() => handleBlock(otherUser._id)} className="flex-1 py-2 text-[10px] font-semibold text-red-500 hover:text-red-700 bg-red-50 rounded-lg flex items-center justify-center">
                        <X className="w-3 h-3 mr-1" /> Block
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
