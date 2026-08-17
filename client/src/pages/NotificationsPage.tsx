import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Trophy, Wrench, UserPlus, Check, X, MessageSquare } from 'lucide-react';
import { INotification } from '../types';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useSidebar } from '../context/SidebarContext';

export const NotificationsPage: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const { markAllAsRead, fetchNotifications } = useNotification();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchData();
    // Mark notifications as read when opening notifications page
    markAllAsRead();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [notifsData, pendingData] = await Promise.all([
        api.getNotifications(),
        api.getPendingRequests()
      ]);
      setNotifications(notifsData);
      setPendingRequests(pendingData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondRequest = async (connectionId: string, action: 'Accept' | 'Reject', senderId?: string) => {
    try {
      await api.respondConnection(connectionId, action);
      setPendingRequests(pendingRequests.filter((req) => req._id !== connectionId));
      showToast(action === 'Accept' ? 'Connection Accepted! You can now message each other.' : 'Connection Request Rejected.');
      
      // Refresh notifications context & badge
      fetchNotifications();

      if (action === 'Accept' && senderId) {
        setTimeout(() => navigate(`/messages?userId=${senderId}`), 1000);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error responding to request');
    }
  };

  const handleMarkRead = async (id: string, link?: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map((n) => (n._id === id ? { ...n, read: true } : n)));
      if (link) {
        navigate(link);
      }
    } catch (err) {
      console.error(err);
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
            <Bell className="w-7 h-7 text-neutral-900" />
            <span>Notifications Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Real-time updates on connection requests, messages, and handyman bookings.
          </p>
        </div>

        {/* PENDING CONNECTION REQUESTS APPROVAL BANNER / BOX */}
        {pendingRequests.length > 0 && (
          <div className="mb-8 p-5 bg-white rounded-3xl border-2 border-neutral-900 shadow-sm">
            <h3 className="text-sm font-extrabold text-neutral-900 flex items-center space-x-2 mb-3">
              <UserPlus className="w-5 h-5 text-neutral-900" />
              <span>Pending Connection Requests ({pendingRequests.length})</span>
            </h3>

            <div className="space-y-3">
              {pendingRequests.map((req) => {
                const senderName = typeof req.sender === 'object' ? req.sender.name : 'A CityMate User';
                const senderPhoto = typeof req.sender === 'object' ? req.sender.profilePhoto : '';
                const senderArea = typeof req.sender === 'object' ? req.sender.area : 'Gachibowli';
                const senderId = typeof req.sender === 'object' ? req.sender._id : req.sender;

                return (
                  <div
                    key={req._id}
                    className="p-4 rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          senderPhoto ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                        }
                        alt={senderName}
                        className="w-11 h-11 rounded-full object-cover border border-neutral-300"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">{senderName}</h4>
                        <p className="text-[11px] text-neutral-500">
                          Wants to connect with you • <span className="font-semibold text-neutral-800">{senderArea}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRespondRequest(req._id, 'Accept', senderId)}
                        className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center space-x-1 shadow-xs cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleRespondRequest(req._id, 'Reject')}
                        className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs cursor-pointer flex items-center space-x-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS LIST */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white h-20 rounded-2xl animate-pulse border border-neutral-200" />
            ))}
          </div>
        ) : notifications.length === 0 && pendingRequests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
            <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-neutral-900">No notifications yet</h3>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleMarkRead(n._id, n.link)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  n.read
                    ? 'bg-white border-neutral-200 text-neutral-600'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-900 font-semibold shadow-2xs'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 flex-shrink-0">
                    {n.type === 'ConnectionRequest' ? (
                      <UserPlus className="w-5 h-5 text-neutral-900" />
                    ) : n.type === 'ConnectionAccepted' ? (
                      <Check className="w-5 h-5 text-neutral-900" />
                    ) : n.type === 'Message' ? (
                      <MessageSquare className="w-5 h-5 text-neutral-900" />
                    ) : n.type === 'BookingUpdate' ? (
                      <Wrench className="w-5 h-5 text-neutral-900" />
                    ) : (
                      <Trophy className="w-5 h-5 text-neutral-900" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs">{n.message}</p>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 flex-shrink-0" />}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
