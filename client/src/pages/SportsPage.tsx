import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Users,
  Plus,
  Calendar,
  MapPin,
  X,
  UserPlus,
  MessageSquare,
  Clock,
  Check
} from 'lucide-react';
import { IGame, IUser, SkillLevel, ConnectionStatus } from '../types';
import { api } from '../services/api';
import { calculateSmartMatch } from '../utils/matching';
import { MatchBadge } from '../components/common/MatchBadge';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useSidebar } from '../context/SidebarContext';

export const SportsPage: React.FC = () => {
  const { user } = useAuth();
  const { city, area } = useLocation();
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'partners' | 'games'>('partners');
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  
  const [allGames, setAllGames] = useState<IGame[]>([]);
  const [nearbyGames, setNearbyGames] = useState<IGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatuses, setConnectionStatuses] = useState<{ [userId: string]: { status: ConnectionStatus; connectionId: string | null } }>({});

  // Game Creation Modal State
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);
  const [gameTitle, setGameTitle] = useState('Saturday Evening Badminton Doubles');
  const [gameSport, setGameSport] = useState('Badminton');
  const [gameDate, setGameDate] = useState('2026-08-22');
  const [gameTime, setGameTime] = useState('06:00 PM');
  const [gameVenue, setGameVenue] = useState(`Smash Badminton Arena, ${area}`);
  const [gameSkill, setGameSkill] = useState<SkillLevel>('Intermediate');
  const [gameMaxPlayers, setGameMaxPlayers] = useState<number>(4);
  const [gameDesc, setGameDesc] = useState('Looking for 2 intermediate players for a fun doubles match!');
  const [toastMessage, setToastMessage] = useState('');

  const SPORTS_LIST = ['ALL', 'Badminton', 'Cricket', 'Football', 'Tennis', 'Basketball', 'Table Tennis', 'Running'];

  useEffect(() => {
    fetchData();
  }, [selectedSport, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sportParam = selectedSport === 'ALL' ? undefined : selectedSport;
      const [allData, nearbyData] = await Promise.all([
        api.getGames(sportParam),
        api.getGames(sportParam, city, area)
      ]);
      setAllGames(allData);
      setNearbyGames(nearbyData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (targetUserId: string, targetName: string) => {
    try {
      await api.sendConnectionRequest(targetUserId);
      setConnectionStatuses({
        ...connectionStatuses,
        [targetUserId]: { status: 'Pending_Sent', connectionId: null }
      });
      showToast(`Connection request sent to ${targetName}!`);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error sending request');
    }
  };

  const handleRespondRequest = async (targetUserId: string, connectionId: string, action: 'Accept' | 'Reject') => {
    try {
      await api.respondConnection(connectionId, action);
      setConnectionStatuses({
        ...connectionStatuses,
        [targetUserId]: { status: action === 'Accept' ? 'Accepted' : 'Rejected', connectionId }
      });
      showToast(action === 'Accept' ? `Connection accepted! You can now chat.` : 'Connection rejected.');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error responding to request');
    }
  };

  const handleCreateGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newGame = await api.createGame({
        title: gameTitle,
        sport: gameSport,
        date: gameDate,
        time: gameTime,
        venue: gameVenue,
        city,
        area,
        skillLevel: gameSkill,
        playingStyle: 'Doubles',
        maxPlayers: gameMaxPlayers,
        description: gameDesc
      });

      setAllGames([newGame, ...allGames]);
      setNearbyGames([newGame, ...nearbyGames]);
      setIsCreateGameModalOpen(false);
      showToast('New sports match created & published!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendSportsRequest = async (gameId: string) => {
    try {
      await api.sendSportsRequest(gameId);
      showToast('Partner request sent!');
      navigate('/sports-requests');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error sending request');
    }
  };

  const handleDeletePost = async (gameId: string) => {
    if (!window.confirm('Are you sure you want to delete this sports partner post?')) return;
    
    try {
      await api.deleteSportsPost(gameId);
      setAllGames(allGames.filter(g => g._id !== gameId));
      setNearbyGames(nearbyGames.filter(g => g._id !== gameId));
      showToast('Post deleted successfully!');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error deleting post');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
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

        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
              <Trophy className="w-7 h-7 text-neutral-900" />
              <span>Sports Partner & Match Finder</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Connect with nearby badminton players around <span className="text-neutral-900 font-semibold">{area}, {city}</span>.
            </p>
          </div>

          <button
            onClick={() => setIsCreateGameModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center space-x-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create a Game</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-3 mb-6 border-b border-neutral-200 pb-3">
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'partners'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Find Sports Partners ({allGames.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'games'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Games Near You ({nearbyGames.length})</span>
          </button>
        </div>

        {/* Sports Quick Filter */}
        <div className="bg-white p-4 rounded-2xl mb-8 border border-neutral-200 shadow-2xs flex items-center space-x-2 overflow-x-auto">
          <span className="text-xs font-bold text-neutral-500 mr-2 flex-shrink-0">Select Sport:</span>
          {SPORTS_LIST.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all ${
                selectedSport === sport
                  ? 'bg-neutral-900 text-white font-bold shadow-xs'
                  : 'bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-neutral-900'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* MAIN TABS RENDERING */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(activeTab === 'partners' ? allGames : nearbyGames).map((game) => {
            const hostId = typeof game.host === 'object' ? game.host._id : game.host;
            const hostName = typeof game.host === 'object' ? game.host.name : 'Host';
            const isHost = hostId === user?._id;
            const isJoined = game.playersJoined.some((p: any) => (p._id || p) === user?._id);
            const isFull = game.playersJoined.length >= game.maxPlayers;

            return (
              <div key={game._id} className="glass-card p-6 rounded-3xl border border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs font-bold">
                      🏸 {game.sport}
                    </span>
                    <div className="text-xs font-bold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                      👥 {game.playersJoined.length} / {game.maxPlayers} Joined
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{game.title}</h3>

                  <div className="space-y-1.5 text-xs text-neutral-700 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-neutral-900" />
                      <span>{game.date} • {game.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-neutral-900" />
                      <span>{game.venue}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">{game.description}</p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Host: <strong className="text-neutral-900">{hostName}</strong></span>

                  <div className="flex space-x-2">
                    {isHost ? (
                      <button
                        onClick={() => handleDeletePost(game._id)}
                        className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors"
                      >
                        Delete
                      </button>
                    ) : isJoined ? (
                      <div className="flex space-x-2">
                        <span className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs font-bold flex items-center justify-center">
                          Joined
                        </span>
                        <button
                          onClick={() => navigate(`/messages?userId=${hostId}`)}
                          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-xs flex items-center space-x-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> <span>Contact</span>
                        </button>
                      </div>
                    ) : isFull ? (
                      <span className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-400 text-xs font-bold flex items-center justify-center">
                        Match Full
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendSportsRequest(game._id)}
                        className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-xs"
                      >
                        Send Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {(activeTab === 'partners' ? allGames : nearbyGames).length === 0 && !loading && (
            <div className="col-span-full py-12 text-center text-neutral-500 text-sm font-semibold">
              No sports posts found.
            </div>
          )}
        </div>

        {/* Create Game Modal */}
        {isCreateGameModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setIsCreateGameModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-neutral-900 flex items-center space-x-2 mb-4">
                <Trophy className="w-5 h-5 text-neutral-900" />
                <span>Create a Sports Match</span>
              </h3>

              <form onSubmit={handleCreateGameSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Game Title</label>
                  <input
                    type="text"
                    required
                    value={gameTitle}
                    onChange={(e) => setGameTitle(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Sport</label>
                    <select
                      value={gameSport}
                      onChange={(e) => setGameSport(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                    >
                      {SPORTS_LIST.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Skill Level</label>
                    <select
                      value={gameSkill}
                      onChange={(e) => setGameSkill(e.target.value as SkillLevel)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={gameDate}
                      onChange={(e) => setGameDate(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Time</label>
                    <input
                      type="text"
                      required
                      value={gameTime}
                      onChange={(e) => setGameTime(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Court / Venue Name & Area</label>
                  <input
                    type="text"
                    required
                    value={gameVenue}
                    onChange={(e) => setGameVenue(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Max Players Needed</label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={gameMaxPlayers}
                    onChange={(e) => setGameMaxPlayers(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={gameDesc}
                    onChange={(e) => setGameDesc(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateGameModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-xs"
                  >
                    Publish Game
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
