import React, { useState } from 'react';
import { Compass, MapPin, Search, Star, Clock, Ticket } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useSidebar } from '../context/SidebarContext';

export const TouristPlacesPage: React.FC = () => {
  const { city } = useLocation();
  const { isCollapsed } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy tourist places data
  const touristPlaces = {
    Hyderabad: [
      {
        id: 1,
        name: 'Charminar',
        description: 'An iconic monument and mosque built in 1591, known as the symbol of Hyderabad.',
        image: 'https://images.unsplash.com/photo-1626210086202-a8d67f70b4c3?auto=format&fit=crop&q=80&w=600',
        rating: 4.8,
        timing: '9:30 AM - 5:30 PM',
        entryFee: '₹25 for Indians, ₹300 for Foreigners',
        category: 'Monument'
      },
      {
        id: 2,
        name: 'Golconda Fort',
        description: 'A historic fortress and ruined city built on a granite hill. Famous for its acoustics.',
        image: 'https://images.unsplash.com/photo-1600078772320-b4d06a928236?auto=format&fit=crop&q=80&w=600',
        rating: 4.7,
        timing: '9:00 AM - 5:00 PM',
        entryFee: '₹25 for Indians, ₹300 for Foreigners',
        category: 'Fort'
      },
      {
        id: 3,
        name: 'Ramoji Film City',
        description: 'One of the largest integrated film cities in the world. Offers thematic tours and rides.',
        image: 'https://images.unsplash.com/photo-1594532688000-8c292023fcba?auto=format&fit=crop&q=80&w=600',
        rating: 4.5,
        timing: '9:00 AM - 5:30 PM',
        entryFee: 'Starting at ₹1,150',
        category: 'Entertainment'
      },
      {
        id: 4,
        name: 'Hussain Sagar Lake',
        description: 'A heart-shaped lake built in 1563, featuring a large monolithic statue of Gautama Buddha.',
        image: 'https://images.unsplash.com/photo-1574526618485-eb9eb879d724?auto=format&fit=crop&q=80&w=600',
        rating: 4.6,
        timing: '8:00 AM - 10:00 PM',
        entryFee: 'Free (Boating extra)',
        category: 'Lake / Park'
      }
    ],
    Bangalore: [
      {
        id: 5,
        name: 'Lalbagh Botanical Garden',
        description: 'A globally renowned botanical garden famous for its glass house and extensive floral species.',
        image: 'https://images.unsplash.com/photo-1588616422312-dcb41fc65134?auto=format&fit=crop&q=80&w=600',
        rating: 4.6,
        timing: '6:00 AM - 7:00 PM',
        entryFee: '₹25',
        category: 'Nature'
      },
      {
        id: 6,
        name: 'Bangalore Palace',
        description: 'A stunning royal palace built in Tudor Revival style architecture.',
        image: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&q=80&w=600',
        rating: 4.5,
        timing: '10:00 AM - 5:30 PM',
        entryFee: '₹230 for Indians',
        category: 'Palace'
      }
    ]
  };

  const getPlaces = () => {
    return touristPlaces[city as keyof typeof touristPlaces] || touristPlaces['Hyderabad'];
  };

  const places = getPlaces().filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
            <Compass className="w-7 h-7 text-indigo-500" />
            <span>Tourist Places in {city}</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Explore famous landmarks, monuments, and popular attractions in your city.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-3xl mb-8 border border-neutral-200 shadow-sm flex items-center space-x-3">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder={`Search places in ${city}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-900 focus:outline-none placeholder-neutral-400 font-medium"
          />
        </div>

        {/* Places Grid */}
        {places.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
            <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-900">No places found</h3>
            <p className="text-xs text-neutral-500 mt-1">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {places.map((place) => (
              <div key={place.id} className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-neutral-900 flex items-center shadow-sm">
                    {place.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-neutral-900 flex items-center shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" />
                    {place.rating}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{place.name}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed mb-4 flex-1">
                    {place.description}
                  </p>
                  
                  <div className="space-y-2 pt-4 border-t border-neutral-100">
                    <div className="flex items-center text-[11px] text-neutral-600 font-medium">
                      <Clock className="w-3.5 h-3.5 mr-2 text-neutral-400" />
                      {place.timing}
                    </div>
                    <div className="flex items-center text-[11px] text-neutral-600 font-medium">
                      <Ticket className="w-3.5 h-3.5 mr-2 text-neutral-400" />
                      {place.entryFee}
                    </div>
                  </div>
                  
                  <button className="mt-5 w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition-colors">
                    Get Directions
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
