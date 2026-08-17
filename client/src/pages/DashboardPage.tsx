import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Wrench,
  Trophy,
  Users,
  Compass,
  HeartHandshake,
  HelpCircle,
  ShoppingBag,
  Shield,
  ArrowRight,
  Sun,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useSidebar } from '../context/SidebarContext';
import { MOCK_PROPERTIES, MOCK_SERVICE_PROVIDERS, MOCK_USERS, MOCK_COMMUNITIES } from '../services/mockData';
import { StarRating } from '../components/common/StarRating';
import { MatchBadge } from '../components/common/MatchBadge';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { city, area } = useLocation();
  const { isCollapsed } = useSidebar();

  const firstName = user?.name.split(' ')[0] || 'Aarav';

  const quickActionCards = [
    {
      title: 'Find a Place',
      subtitle: 'PGs, Hostels, Flats & Roommates',
      icon: Building,
      path: '/properties',
      badge: '12+ PGs Nearby'
    },
    {
      title: 'Need a Service',
      subtitle: 'Electricians, Plumbers & Technicians',
      icon: Wrench,
      path: '/services',
      badge: 'Handymen Available'
    },
    {
      title: 'Find Sports Partners',
      subtitle: 'Badminton, Cricket & More',
      icon: Trophy,
      path: '/sports',
      badge: '94% Match'
    },
    {
      title: 'Find People',
      subtitle: 'Discover Flatmates & Friends',
      icon: Users,
      path: '/people',
      badge: 'Newcomers'
    },
    {
      title: 'Explore Nearby',
      subtitle: 'Cafes, Hospitals & Essentials',
      icon: Compass,
      path: '/explore',
      badge: 'Locality Guide'
    },
    {
      title: 'Join Communities',
      subtitle: 'Hyderabad Expats & Tech Groups',
      icon: HeartHandshake,
      path: '/communities',
      badge: '5 Active Groups'
    },
    {
      title: 'Ask Your City',
      subtitle: 'Local Q&A, Forums & Tips',
      icon: HelpCircle,
      path: '/communities?tab=qa',
      badge: 'City Q&A'
    },
    {
      title: 'Marketplace',
      subtitle: 'Pre-loved Tables, Chairs & Appliances',
      icon: ShoppingBag,
      path: '/marketplace',
      badge: 'Local Deals'
    }
  ];

  return (
    <div
      className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3. Dashboard Hero Card */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 mb-6 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Good Morning
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-1">
                Hi, {firstName}! 👋
              </h1>
              <p className="text-sm font-medium text-neutral-600 mt-1">
                Ready to explore and connect in your city?
              </p>
            </div>

            {/* Right side Info Cards: Weather & Location */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-neutral-100 border border-neutral-200 p-3.5 rounded-2xl flex items-center space-x-3 min-w-[140px]">
                <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">Weather</div>
                  <div className="text-xs font-extrabold text-neutral-900">28°C • Sunny</div>
                </div>
              </div>

              <div className="bg-neutral-100 border border-neutral-200 p-3.5 rounded-2xl flex items-center space-x-3 min-w-[180px]">
                <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">Current Location</div>
                  <div className="text-xs font-extrabold text-neutral-900">{area}, {city}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Safety Tip Banner */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 mb-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-neutral-900 mr-1.5">CityMate Safety Tip:</span>
              <span className="text-neutral-600">Meet new people in public places, verify service providers and never share sensitive personal information.</span>
            </div>
          </div>
          <button className="text-xs font-bold text-neutral-900 hover:text-neutral-600 flex items-center space-x-1 flex-shrink-0">
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {/* 5. Quick Actions Section */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActionCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  to={card.path}
                  className="glass-card p-5 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-400 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">{card.subtitle}</p>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-bold text-neutral-900 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 7. Recommended for You Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900">Recommended for You</h2>
            <Link to="/explore" className="text-xs font-bold text-neutral-900 hover:underline flex items-center">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Recommended Property */}
            <div className="glass-card p-4 rounded-2xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <img
                  src={MOCK_PROPERTIES[0].images[0]}
                  alt="Sunrise PG"
                  className="w-full h-36 rounded-xl object-cover mb-3"
                />
                <span className="text-[10px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md uppercase">
                  PG Accommodation
                </span>
                <h4 className="text-sm font-bold text-neutral-900 mt-1">Sunrise PG for Men</h4>
                <p className="text-xs text-neutral-500">{area}, {city}</p>
                <div className="mt-2 flex items-center justify-between">
                  <StarRating rating={4.6} count={32} size={11} />
                  <span className="text-xs font-bold text-neutral-900">₹7,500 <span className="text-[10px] font-normal text-neutral-500">/ mo</span></span>
                </div>
              </div>
              <Link to="/properties" className="mt-3 block text-center py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-900 transition-colors">
                View Property
              </Link>
            </div>

            {/* Recommended Service Provider */}
            <div className="glass-card p-4 rounded-2xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-900 font-bold flex items-center justify-center border border-neutral-200">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Ravi Electrical Services</h4>
                    <span className="text-xs font-semibold text-neutral-500">Electrician • 1.8 km</span>
                  </div>
                </div>
                <StarRating rating={4.8} count={128} size={11} />
                <p className="text-xs text-neutral-600 mt-2">Certified electrician prompt on-time service for home repairs.</p>
                <div className="mt-3 text-xs font-bold text-neutral-900">Starts at ₹200</div>
              </div>
              <Link to="/services" className="mt-3 block text-center py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-white transition-colors">
                Book Service
              </Link>
            </div>

            {/* Recommended Sports Partner */}
            <div className="glass-card p-4 rounded-2xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={MOCK_USERS[2].profilePhoto}
                    alt="Vikram"
                    className="w-12 h-12 rounded-full object-cover border border-neutral-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Vikram</h4>
                    <span className="text-xs text-neutral-500">Badminton • Intermediate</span>
                  </div>
                </div>
                <MatchBadge score={94} showDetails={false} />
                <p className="text-xs text-neutral-600 mt-2">Looking for doubles partner for weekend evening matches.</p>
              </div>
              <Link to="/sports" className="mt-3 block text-center py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-900 transition-colors">
                Connect
              </Link>
            </div>

            {/* Recommended Community */}
            <div className="glass-card p-4 rounded-2xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <img
                  src={MOCK_COMMUNITIES[0].image}
                  alt="Hyderabad Newcomers"
                  className="w-full h-28 rounded-xl object-cover mb-3"
                />
                <h4 className="text-sm font-bold text-neutral-900">Hyderabad Newcomers</h4>
                <p className="text-xs text-neutral-500 mt-0.5">2.3K Members • Active Community</p>
              </div>
              <Link to="/communities" className="mt-3 block text-center py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-white transition-colors">
                Join Group
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
