import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Filter, MessageSquare, MapPin, Check, Heart, UserPlus, Clock, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { IUser, ConnectionStatus } from '../types';
import { api } from '../services/api';
import { calculateRoommateCompatibility } from '../utils/matching';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useSidebar } from '../context/SidebarContext';

export const RoommateFinderPage: React.FC = () => {
  const { user } = useAuth();
  const { city, area } = useLocation();
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();

  const [selectedGender, setSelectedGender] = useState('Any');
  const [roommates, setRoommates] = useState<IUser[]>([]);
  const [connectionStatuses, setConnectionStatuses] = useState<{ [userId: string]: { status: ConnectionStatus; connectionId: string | null } }>({});
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetchUsersAndConnections();
  }, [selectedGender, user]);

  // Real-Time Socket Connection Updates Listener
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('citymate_token') || '';
    const socket = io('http://localhost:5000', {
      auth: { token },
      query: { token, userId: user._id }
    });

    socketRef.current = socket;
    socket.emit('join_user', user._id);

    socket.on('connection_updated', () => {
      fetchUsersAndConnections();
    });

    socket.on('notification_received', (data: any) => {
      if (data.message) showToast(data.message);
      fetchUsersAndConnections();
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchUsersAndConnections = async () => {
    setLoading(true);
    try {
      const usersData = await api.getUsers();
      const filtered = usersData.filter((u: IUser) => u._id !== user?._id);
      setRoommates(filtered);

      const statusMap: { [userId: string]: { status: ConnectionStatus; connectionId: string | null } } = {};
      for (const u of filtered) {
        const connInfo = await api.getConnectionStatus(u._id);
        statusMap[u._id] = { status: connInfo.status, connectionId: connInfo.connectionId };
      }
      setConnectionStatuses(statusMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (targetUserId: string, targetName: string) => {
    try {
      await api.sendConnectionRequest(targetUserId);
      setConnectionStatuses((prev) => ({
        ...prev,
        [targetUserId]: { status: 'Pending_Sent', connectionId: null }
      }));
      showToast(`Connection request sent to ${targetName}!`);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error sending request');
    }
  };

  const handleRespondRequest = async (targetUserId: string, connectionId: string, action: 'Accept' | 'Reject') => {
    try {
      await api.respondConnection(connectionId, action);
      setConnectionStatuses((prev) => ({
        ...prev,
        [targetUserId]: { status: action === 'Accept' ? 'Accepted' : 'Rejected', connectionId }
      }));
      showToast(action === 'Accept' ? `Connection accepted! You can now chat.` : 'Connection rejected.');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error responding to request');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div
      className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
            <Users className="w-7 h-7 text-neutral-900" />
            <span>Find People & Roommates in {city}</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Connect with registered users in <span className="text-neutral-900 font-semibold">{area}</span>. Unlock private chat upon connection acceptance.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl mb-8 border border-neutral-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs font-bold text-neutral-800">
            <Filter className="w-4 h-4 text-neutral-900" />
            <span>Filter Gender:</span>
            {['Any', 'Male', 'Female'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-3.5 py-1.5 rounded-full border transition-all ${
                  selectedGender === g
                    ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Roommate Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white h-72 rounded-3xl animate-pulse border border-neutral-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roommates.map((rm) => {
              const comp = user ? calculateRoommateCompatibility(user, rm) : { score: 88, reasons: ['Same city', 'Nearby area'] };
              const connInfo = connectionStatuses[rm._id] || { status: 'None', connectionId: null };

              return (
                <div key={rm._id} className="glass-card rounded-3xl p-6 border border-neutral-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            rm.profilePhoto ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                          }
                          alt={rm.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-neutral-200"
                        />
                        <div>
                          <h3 className="text-base font-bold text-neutral-900 flex items-center space-x-1">
                            <span>{rm.name}</span>
                            {rm.gender && <span className="text-xs text-neutral-500 font-normal">({rm.age || 24}, {rm.gender})</span>}
                          </h3>
                          <p className="text-xs text-neutral-500 flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 text-neutral-900 mr-1" />
                            {rm.area}, {rm.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Compatibility Badge */}
                    <div className="mb-4 p-3 rounded-2xl bg-neutral-100 border border-neutral-200">
                      <div className="text-sm font-extrabold text-neutral-900 flex items-center justify-between">
                        <span>{comp.score}% Compatible</span>
                        <Heart className="w-4 h-4 fill-neutral-900 text-neutral-900" />
                      </div>
                      <div className="mt-2 space-y-1">
                        {comp.reasons.map((r, idx) => (
                          <div key={idx} className="text-[11px] text-neutral-700 flex items-center space-x-1.5">
                            <Check className="w-3 h-3 text-neutral-900 flex-shrink-0" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed mb-4 line-clamp-2">{rm.bio || 'Newcomer looking to connect and find flatmates.'}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {rm.interests.map((interest) => (
                        <span key={interest} className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] font-semibold text-neutral-700">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Connection Button States */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center space-x-2">
                    {connInfo.status === 'Accepted' ? (
                      <button
                        onClick={() => navigate(`/messages?userId=${rm._id}`)}
                        className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Message (Private Chat)</span>
                      </button>
                    ) : connInfo.status === 'Pending_Sent' ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-500 text-xs font-bold flex items-center justify-center space-x-1 cursor-not-allowed"
                      >
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <span>Request Sent</span>
                      </button>
                    ) : connInfo.status === 'Pending_Received' ? (
                      <div className="flex items-center space-x-2 w-full">
                        <button
                          onClick={() => connInfo.connectionId && handleRespondRequest(rm._id, connInfo.connectionId, 'Accept')}
                          className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                        <button
                          onClick={() => connInfo.connectionId && handleRespondRequest(rm._id, connInfo.connectionId, 'Reject')}
                          className="py-2.5 px-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 hover:bg-neutral-200 text-xs font-bold cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(rm._id, rm.name)}
                        className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Connect</span>
                      </button>
                    )}
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
