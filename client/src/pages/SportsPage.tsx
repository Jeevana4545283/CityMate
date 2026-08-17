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
  const [selectedSport, setSelectedSport] = useState<string>('Badminton');
  
  const [games, setGames] = useState<IGame[]>([]);
  const [partners, setPartners] = useState<IUser[]>([]);
  const [connectionStatuses, setConnectionStatuses] = useState<{ [userId: string]: { status: ConnectionStatus; connectionId: string | null } }>({});
  const [loading, setLoading] = useState(true);

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

  const SPORTS_LIST = ['Badminton', 'Cricket', 'Football', 'Tennis', 'Basketball', 'Table Tennis', 'Running'];

  useEffect(() => {
    fetchData();
  }, [selectedSport, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gamesData, usersData] = await Promise.all([
        api.getGames(selectedSport),
        api.getUsers({ sport: selectedSport })
      ]);
      setGames(gamesData);
      const filtered = usersData.filter((u: IUser) => u._id !== user?._id);
      setPartners(filtered);

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

      setGames([newGame, ...games]);
      setIsCreateGameModalOpen(false);
      showToast('New sports match created & published!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinGame = async (gameId: string) => {
    try {
      const updated = await api.joinGame(gameId);
      setGames(games.map((g) => (g._id === gameId ? updated : g)));
      showToast('You joined the game!');
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Smart player matching computation
  const playerMatches = partners.map((otherUser) => {
    const matchData = user ? calculateSmartMatch(user, otherUser, selectedSport) : { score: 92, reasons: ['Same sport', 'Nearby'] };
    return {
      user: otherUser,
      score: matchData.score,
      reasons: matchData.reasons
    };
  }).sort((a, b) => b.score - a.score);

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
            <span>Find Sports Partners</span>
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
            <span>Games Near You ({games.length})</span>
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

        {/* TAB 1: SPORTS PARTNERS WITH SMART MATCH SCORE & CONNECTION BUTTONS */}
        {activeTab === 'partners' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playerMatches.map(({ user: player, score, reasons }) => {
              const connInfo = connectionStatuses[player._id] || { status: 'None', connectionId: null };

              return (
                <div key={player._id} className="glass-card rounded-3xl p-6 border border-neutral-200 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={player.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                          alt={player.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-neutral-200"
                        />
                        <div>
                          <h3 className="text-base font-bold text-neutral-900">{player.name}</h3>
                          <p className="text-xs text-neutral-500 flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 text-neutral-900 mr-1" />
                            {player.area}, {player.city} (2.1 km)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Smart Match Breakdown Card */}
                    <div className="mb-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <MatchBadge score={score} reasons={reasons} showDetails={true} />
                    </div>

                    <p className="text-xs text-neutral-600 mb-4 line-clamp-2">{player.bio}</p>

                    <div className="p-3 rounded-2xl bg-neutral-100 border border-neutral-200 mb-4 text-xs space-y-1">
                      <div className="flex justify-between text-neutral-500">
                        <span>Primary Sport:</span>
                        <span className="text-neutral-900 font-bold">{selectedSport}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Skill Level:</span>
                        <span className="text-neutral-900 font-bold">
                          {player.sports?.[0]?.skillLevel || 'Intermediate'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Connection Button States */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center space-x-2">
                    {connInfo.status === 'Accepted' ? (
                      <button
                        onClick={() => navigate(`/messages?userId=${player._id}`)}
                        className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-xs"
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
                          onClick={() => connInfo.connectionId && handleRespondRequest(player._id, connInfo.connectionId, 'Accept')}
                          className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => connInfo.connectionId && handleRespondRequest(player._id, connInfo.connectionId, 'Reject')}
                          className="py-2.5 px-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 hover:bg-neutral-200 text-xs font-bold"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(player._id, player.name)}
                        className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-xs"
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

        {/* TAB 2: GAMES NEAR YOU */}
        {activeTab === 'games' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => {
              const hostName = typeof game.host === 'object' ? game.host.name : 'Host';
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

                    {isJoined ? (
                      <span className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs font-bold">
                        ✓ Joined Match
                      </span>
                    ) : isFull ? (
                      <span className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-400 text-xs font-bold">
                        Match Full
                      </span>
                    ) : (
                      <button
                        onClick={() => handleJoinGame(game._id)}
                        className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-xs"
                      >
                        Join Game
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
