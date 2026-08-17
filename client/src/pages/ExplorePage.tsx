import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Compass,
  Building,
  Wrench,
  Trophy,
  Coffee,
  Hospital,
  ShoppingBag,
  Dumbbell,
  Film,
  CreditCard,
  Fuel,
  Bus,
  Search
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export const ExplorePage: React.FC = () => {
  const { city, area } = useLocation();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const categories = [
    { name: 'PGs', icon: Building, path: '/properties' },
    { name: 'Hostels', icon: Building, path: '/properties' },
    { name: 'Flats', icon: Building, path: '/properties' },
    { name: 'Roommates', icon: Building, path: '/roommates' },
    { name: 'Restaurants', icon: Coffee, path: '/essentials' },
    { name: 'Cafes', icon: Coffee, path: '/essentials' },
    { name: 'Hospitals', icon: Hospital, path: '/essentials' },
    { name: 'Pharmacies', icon: Hospital, path: '/essentials' },
    { name: 'Grocery', icon: ShoppingBag, path: '/essentials' },
    { name: 'Gyms', icon: Dumbbell, path: '/essentials' },
    { name: 'Sports Courts', icon: Trophy, path: '/sports' },
    { name: 'Entertainment', icon: Film, path: '/essentials' },
    { name: 'ATMs', icon: CreditCard, path: '/essentials' },
    { name: 'Petrol Stations', icon: Fuel, path: '/essentials' },
    { name: 'Transport', icon: Bus, path: '/essentials' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 pt-6 lg:pl-[260px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
            <Compass className="w-7 h-7 text-neutral-900" />
            <span>Explore {city}</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Discover places, PGs, handymen, sports courts, and essentials in <span className="text-neutral-900 font-semibold">{area}</span>.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="bg-white p-4 rounded-3xl mb-8 border border-neutral-200 shadow-2xs flex items-center space-x-3">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search 'PG under 10000', 'electrician near me', 'badminton players', 'hostel near Gachibowli'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-900 focus:outline-none placeholder-neutral-400"
          />
        </div>

        {/* Categories Grid */}
        <h2 className="text-lg font-bold text-neutral-900 mb-4">Explore Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={cat.path}
                className="glass-card p-5 rounded-2xl border border-neutral-200 hover:border-neutral-400 transition-all flex flex-col items-center justify-center text-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center mb-3 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
};
