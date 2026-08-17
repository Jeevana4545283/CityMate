import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Bell,
  MessageSquare,
  LogOut,
  ChevronDown,
  X,
  Menu,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { useNotification } from '../../context/NotificationContext';
import { useSidebar } from '../../context/SidebarContext';

interface NavbarProps {
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchChange }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { city, area, updateLocation, detectCurrentLocation, isDetecting } = useLocation();
  const { unreadCount } = useNotification();
  const { isCollapsed, isMobileOpen, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(city);
  const [selectedArea, setSelectedArea] = useState(area);
  const [searchVal, setSearchVal] = useState('');

  const HYD_AREAS = ['Gachibowli', 'Kondapur', 'Madhapur', 'Hitech City', 'Kukatpally', 'Miyapur', 'Manikonda'];

  const handleSaveLocation = () => {
    updateLocation(selectedCity, selectedArea);
    setIsLocationModalOpen(false);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  // Determine if sidebar is currently open/expanded
  const isSidebarOpen = window.innerWidth >= 1024 ? !isCollapsed : isMobileOpen;

  return (
    <>
      <header
        className={`sticky top-0 z-20 bg-white border-b border-neutral-200 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Extreme Top-Left Corner: Sidebar Toggle Button */}
            {/* When Sidebar is OPEN -> 3-LINE Icon (☰) */}
            {/* When Sidebar is CLOSED -> 3-DOT Icon (⋮) */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSidebar}
                aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-900 bg-transparent hover:bg-neutral-100 active:bg-neutral-200 transition-all duration-200 cursor-pointer flex-shrink-0 border border-transparent hover:border-neutral-200"
                title={isSidebarOpen ? 'Collapse sidebar (☰)' : 'Open sidebar (⋮)'}
              >
                {isSidebarOpen ? (
                  <Menu className="w-5 h-5 text-neutral-900 stroke-[2.2]" />
                ) : (
                  <MoreVertical className="w-5 h-5 text-neutral-900 stroke-[2.2]" />
                )}
              </button>

              {/* Location Picker */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs font-semibold text-neutral-800 transition-colors"
                title="Change Location"
              >
                <MapPin className="w-3.5 h-3.5 text-neutral-900" />
                <span className="font-bold text-neutral-900">{area}</span>
                <span className="text-neutral-500 hidden sm:inline">, {city}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400 ml-0.5" />
              </button>
            </div>

            {/* Center Header Element: Search Bar with Ctrl / Badge */}
            <div className="hidden md:flex flex-1 max-w-md mx-2">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search for places, people, services..."
                  value={searchVal}
                  onChange={handleSearchInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchVal.trim()) {
                      navigate(`/explore?q=${encodeURIComponent(searchVal)}`);
                    }
                  }}
                  className="w-full bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white border border-neutral-200 rounded-xl pl-10 pr-14 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-0.5 pointer-events-none">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold text-neutral-400 bg-white border border-neutral-200 rounded shadow-2xs">
                    Ctrl /
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right Header Elements */}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  {/* Messages */}
                  <Link
                    to="/messages"
                    className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors relative"
                    title="Messages"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Link>

                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors relative"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* User Profile Avatar & Name */}
                  <div className="flex items-center space-x-2 pl-2 border-l border-neutral-200">
                    <Link to="/profile" className="flex items-center space-x-2 group">
                      <img
                        src={user?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-200 group-hover:border-neutral-900 transition-colors"
                      />
                      <span className="hidden sm:inline text-xs font-bold text-neutral-900 group-hover:text-neutral-700">
                        {user?.name.split(' ')[0]}
                      </span>
                    </Link>

                    <button
                      onClick={logout}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 shadow-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Location Selector Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsLocationModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-1 rounded-full hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-neutral-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-neutral-900" />
              <span>Where are you currently located?</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Select your city and neighborhood to customize local handymen, PGs, and sports matches.
            </p>

            <button
              onClick={() => {
                detectCurrentLocation();
                setIsLocationModalOpen(false);
              }}
              disabled={isDetecting}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-900 text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>{isDetecting ? 'Detecting Location...' : 'Use My Current Location'}</span>
            </button>

            <div className="my-4 flex items-center space-x-2">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-[11px] text-neutral-400 uppercase font-semibold">Or Select Manually</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Select City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Select Area / Locality</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  {HYD_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLocation}
                className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-sm"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
