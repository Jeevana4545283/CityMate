import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  User,
  Search,
  ShieldAlert,
  ArrowLeft,
  Plus,
  Check,
  CheckCheck,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { IConversation, IMessage, IUser } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

export const MessagingPage: React.FC = () => {
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const targetUserIdFromUrl = searchParams.get('userId');

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [activePartner, setActivePartner] = useState<IUser | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatError, setChatError] = useState('');

  // Real-time Socket states
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Helper to extract string ID reliably
  const getUserIdStr = (val: any): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (val._id) return val._id.toString();
    if (val.id) return val.id.toString();
    return val.toString();
  };

  // Initialize Authenticated Socket.IO Client & Event Listeners
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('citymate_token') || '';
    const socket: Socket = io('http://localhost:5000', {
      auth: { token },
      query: { token, userId: user._id }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket Client] Connected as user:', user._id);
    });

    // 1. Incoming Real-Time Message
    socket.on('receive_message', (data: any) => {
      const senderId = getUserIdStr(data.sender || data.senderId);

      if (activePartner && getUserIdStr(activePartner._id) === senderId) {
        setMessages((prev) => {
          if (prev.some((m) => getUserIdStr(m._id) === getUserIdStr(data._id))) return prev;
          return [
            ...prev,
            {
              _id: data._id || 'msg_' + Date.now(),
              sender: senderId,
              receiver: getUserIdStr(user._id),
              content: data.content || data.message,
              read: true,
              status: 'READ',
              createdAt: data.createdAt || new Date().toISOString()
            }
          ];
        });
        socket.emit('mark_read', { partnerId: senderId });
      }

      fetchConversations();
    });

    // 2. Real-Time Read Ticks Update
    socket.on('messages_read', (data: any) => {
      if (activePartner && (getUserIdStr(data.readerId) === getUserIdStr(activePartner._id) || getUserIdStr(data.partnerId) === getUserIdStr(activePartner._id))) {
        setMessages((prev) =>
          prev.map((m) => ({ ...m, read: true, status: 'READ' }))
        );
      }
    });

    // 3. Real-Time Typing Indicators
    socket.on('user_typing_start', (data: any) => {
      if (activePartner && getUserIdStr(data.userId) === getUserIdStr(activePartner._id)) {
        setIsPartnerTyping(true);
      }
    });

    socket.on('user_typing_stop', (data: any) => {
      if (activePartner && getUserIdStr(data.userId) === getUserIdStr(activePartner._id)) {
        setIsPartnerTyping(false);
      }
    });

    // 4. Real-Time Online / Offline Status
    socket.on('user_online', (data: any) => {
      if (activePartner && getUserIdStr(data.userId) === getUserIdStr(activePartner._id)) {
        setIsPartnerOnline(true);
      }
    });

    socket.on('user_offline', (data: any) => {
      if (activePartner && getUserIdStr(data.userId) === getUserIdStr(activePartner._id)) {
        setIsPartnerOnline(false);
        setIsPartnerTyping(false);
      }
    });

    socket.on('chat_error', (data: any) => {
      setChatError(data.message || 'Chat error');
    });

    return () => {
      socket.disconnect();
    };
  }, [user, activePartner]);

  // Load initial conversations list
  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle URL query parameter ?userId=... or default selection
  useEffect(() => {
    if (conversations.length > 0) {
      if (targetUserIdFromUrl) {
        const found = conversations.find((c) => getUserIdStr(c.partner._id) === targetUserIdFromUrl);
        if (found) {
          setActivePartner(found.partner);
        } else {
          api.getUsers().then((users) => {
            const u = users.find((usr: IUser) => getUserIdStr(usr._id) === targetUserIdFromUrl);
            if (u) setActivePartner(u);
          });
        }
      } else if (!activePartner && window.innerWidth >= 768) {
        setActivePartner(conversations[0].partner);
      }
    }
  }, [conversations, targetUserIdFromUrl]);

  // Handle Joining & Leaving Conversation Rooms & Fetching REST History ONCE
  useEffect(() => {
    if (activePartner && socketRef.current) {
      setIsPartnerTyping(false);
      const partnerIdStr = getUserIdStr(activePartner._id);

      socketRef.current.emit('join_conversation', { partnerId: partnerIdStr });

      socketRef.current.emit('check_online', { partnerId: partnerIdStr }, (res: any) => {
        if (res && res.isOnline !== undefined) {
          setIsPartnerOnline(res.isOnline);
        }
      });

      fetchChatHistory(partnerIdStr);

      return () => {
        socketRef.current?.emit('leave_conversation', { partnerId: partnerIdStr });
      };
    }
  }, [activePartner]);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  const fetchConversations = async () => {
    setLoadingConvs(true);
    try {
      const data = await api.getConversations();
      data.sort((a: IConversation, b: IConversation) =>
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );
      setConversations(data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoadingConvs(false);
    }
  };

  const fetchChatHistory = async (partnerId: string) => {
    setLoadingMsgs(true);
    setChatError('');
    try {
      const history = await api.getMessages(partnerId);
      setMessages(history);

      if (socketRef.current) {
        socketRef.current.emit('mark_read', { partnerId });
      }
    } catch (err: any) {
      setChatError(
        err.response?.data?.message || err.message || 'Chat access restricted to accepted connections only.'
      );
      setMessages([]);
    } finally {
      setLoadingMsgs(false);
    }
  };

  // Input Typing Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (activePartner && socketRef.current) {
      const partnerIdStr = getUserIdStr(activePartner._id);
      socketRef.current.emit('typing_start', { partnerId: partnerIdStr });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('typing_stop', { partnerId: partnerIdStr });
      }, 2000);
    }
  };

  // Real-Time Message Send Handler
  const handleSendMessage = () => {
    if (!inputText.trim() || !activePartner || !user) return;

    const content = inputText.trim();
    setInputText('');

    const partnerIdStr = getUserIdStr(activePartner._id);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketRef.current?.emit('typing_stop', { partnerId: partnerIdStr });

    if (socketRef.current) {
      socketRef.current.emit(
        'send_message',
        { receiverId: partnerIdStr, content },
        (ack: any) => {
          if (ack && ack.success && ack.message) {
            setMessages((prev) => [...prev, ack.message]);
          } else {
            api.sendMessage(partnerIdStr, content).then((created) => {
              setMessages((prev) => [...prev, created]);
            });
          }

          setConversations((prev) => {
            const updated = prev.map((c) =>
              getUserIdStr(c.partner._id) === partnerIdStr
                ? { ...c, lastMessage: content, lastMessageTime: new Date().toISOString(), unreadCount: 0 }
                : c
            );
            return updated.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
          });
        }
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const totalUnreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const filteredConversations = conversations.filter((c) =>
    c.partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentUserIdStr = getUserIdStr(user?._id || user?.id);

  return (
    <div
      className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
              <MessageSquare className="w-7 h-7 text-neutral-900" />
              <span>Messages</span>
              {totalUnreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-xs font-extrabold ml-2">
                  {totalUnreadCount}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              WhatsApp-style private messaging with your accepted connections.
            </p>
          </div>

          <button
            onClick={fetchConversations}
            className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 flex items-center space-x-1.5 text-xs font-bold transition-colors cursor-pointer"
            title="Refresh Conversations"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* WhatsApp-Style Modern Split Interface Container */}
        <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-2xs grid grid-cols-1 md:grid-cols-12 h-[660px]">
          
          {/* LEFT CONVERSATIONS PANEL */}
          <div
            className={`md:col-span-4 border-r border-neutral-200 flex flex-col bg-neutral-50/50 ${
              activePartner ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Search Bar */}
            <div className="p-4 border-b border-neutral-200 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-100 border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {loadingConvs ? (
                <div className="p-6 text-center text-xs text-neutral-400">Loading conversations...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-500 space-y-3">
                  <User className="w-8 h-8 text-neutral-300 mx-auto" />
                  <p className="font-bold text-neutral-900">No active connected chats</p>
                  <p className="text-[11px] leading-relaxed">
                    Connect with newcomers on Roommate Finder or Sports Partners to unlock private chat.
                  </p>
                  <button
                    onClick={() => navigate('/roommates')}
                    className="mt-2 px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs cursor-pointer"
                  >
                    Find People to Connect
                  </button>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const partnerIdStr = getUserIdStr(conv.partner._id);
                  const isSelected = activePartner && getUserIdStr(activePartner._id) === partnerIdStr;

                  return (
                    <button
                      key={partnerIdStr}
                      onClick={() => {
                        setActivePartner(conv.partner);
                        setSearchParams({ userId: partnerIdStr });
                      }}
                      className={`w-full p-3 rounded-2xl flex items-center space-x-3 transition-all text-left cursor-pointer group ${
                        isSelected
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'hover:bg-neutral-200/70 text-neutral-800 bg-white border border-neutral-200/60'
                      }`}
                    >
                      {/* Avatar with Online Dot */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            conv.partner.profilePhoto ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                          }
                          alt={conv.partner.name}
                          className="w-11 h-11 rounded-full object-cover border border-neutral-300"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-neutral-900 border-2 border-white" />
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-0.5">
                          {/* Person's NAME (NOT email) */}
                          <span className="text-xs font-bold truncate">{conv.partner.name}</span>
                          <span
                            className={`text-[10px] font-semibold ${
                              isSelected ? 'text-neutral-300' : 'text-neutral-400'
                            }`}
                          >
                            {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p
                            className={`text-[11px] truncate ${
                              isSelected ? 'text-neutral-300 font-normal' : 'text-neutral-500 font-normal'
                            }`}
                          >
                            {conv.lastMessage}
                          </p>
                          {conv.unreadCount > 0 && !isSelected && (
                            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-extrabold flex-shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT CHAT PANEL */}
          <div
            className={`md:col-span-8 flex flex-col justify-between bg-white relative ${
              !activePartner ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activePartner ? (
              <>
                {/* Fixed Chat Panel Header */}
                <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white z-10 shadow-2xs flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    {/* Mobile Back Button */}
                    <button
                      onClick={() => {
                        setActivePartner(null);
                        setSearchParams({});
                      }}
                      className="md:hidden p-2 rounded-xl hover:bg-neutral-100 text-neutral-700"
                      title="Back to Conversations"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <img
                      src={
                        activePartner.profilePhoto ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                      }
                      alt={activePartner.name}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                    />

                    <div>
                      {/* Person's NAME (NOT email) */}
                      <h3 className="text-sm font-bold text-neutral-900">{activePartner.name}</h3>
                      <p className="text-[11px] text-neutral-500 flex items-center">
                        {isPartnerTyping ? (
                          <span className="font-bold text-neutral-900 animate-pulse">typing...</span>
                        ) : isPartnerOnline ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-neutral-900 inline-block mr-1.5" />
                            <span>Online</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-neutral-300 inline-block mr-1.5" />
                            <span>Offline</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/people`)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold border border-neutral-200 cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Message Body */}
                <div className="p-4 sm:p-6 space-y-1 overflow-y-auto flex-1 bg-neutral-50/30">
                  {chatError ? (
                    <div className="p-6 rounded-2xl bg-white border border-neutral-200 text-center max-w-md mx-auto my-12 shadow-2xs">
                      <ShieldAlert className="w-8 h-8 text-neutral-900 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-neutral-900">Chat Restricted</h4>
                      <p className="text-xs text-neutral-600 mt-1">{chatError}</p>
                    </div>
                  ) : loadingMsgs ? (
                    <div className="text-center py-12 text-xs text-neutral-400">Loading conversation history...</div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-16 text-center text-neutral-400">
                      <MessageSquare className="w-12 h-12 text-neutral-300 mb-3" />
                      <p className="text-sm font-bold text-neutral-900">No messages yet</p>
                      <p className="text-xs text-neutral-500 mt-1">Start a conversation with {activePartner.name}</p>
                    </div>
                  ) : (
                    messages.map((m, idx) => {
                      const senderIdStr = getUserIdStr(m.sender);
                      
                      // STRICT ALIGNMENT: compare message senderId with logged-in user ID
                      const isMe = senderIdStr === currentUserIdStr;
                      const isRead = m.status === 'READ' || m.read;
                      const isDelivered = m.status === 'DELIVERED';

                      const isSameSenderAsPrev =
                        idx > 0 && getUserIdStr(messages[idx - 1].sender) === senderIdStr;

                      return (
                        <div
                          key={m._id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${
                            isSameSenderAsPrev ? 'mt-1' : 'mt-3.5'
                          }`}
                        >
                          <div
                            className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-neutral-900 text-white rounded-br-xs shadow-2xs font-normal'
                                : 'bg-neutral-100 text-neutral-900 border border-neutral-200/80 rounded-bl-xs font-normal shadow-2xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>

                            <div
                              className={`mt-1 flex items-center justify-end space-x-1 text-[10px] ${
                                isMe ? 'text-neutral-300' : 'text-neutral-400'
                              }`}
                            >
                              <span>
                                {new Date(m.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>

                              {/* WhatsApp Read Ticks for Sent Messages */}
                              {isMe && (
                                <span className="ml-1 inline-flex items-center">
                                  {isRead ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-white" />
                                  ) : isDelivered ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-neutral-400" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-neutral-400" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Typing Bubble Indicator */}
                  {isPartnerTyping && (
                    <div className="flex justify-start mt-2">
                      <div className="px-4 py-2.5 rounded-2xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-600 rounded-bl-xs shadow-2xs flex items-center space-x-1.5 animate-pulse">
                        <span className="font-bold text-neutral-900">{activePartner.name}</span>
                        <span>is typing...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Fixed WhatsApp-Style Message Input Form */}
                {!chatError && (
                  <div className="p-4 border-t border-neutral-200 bg-white flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      {/* Plus Attachment Button */}
                      <button
                        className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors flex-shrink-0 cursor-pointer"
                        title="Add attachment / share"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {/* Text Input */}
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 transition-colors"
                      />

                      {/* Send Button */}
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()}
                        className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-900 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all flex-shrink-0 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-neutral-400">
                <MessageSquare className="w-12 h-12 text-neutral-300 mb-3" />
                <h3 className="text-base font-bold text-neutral-900">Select a Conversation</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                  Choose a connected partner from the left panel to start real-time messaging.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
