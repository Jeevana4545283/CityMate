import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building,
  Filter,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Bookmark,
  Calendar,
  Shield,
  X,
  Plus
} from 'lucide-react';
import { IProperty } from '../types';
import { api } from '../services/api';
import { StarRating } from '../components/common/StarRating';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useSidebar } from '../context/SidebarContext';

export const PropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const { city, area } = useLocation();
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();

  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('Any');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxRent, setMaxRent] = useState<number>(30000);
  const [roomType, setRoomType] = useState<string>('All');
  const [furnishing, setFurnishing] = useState<string>('All');
  const [availability, setAvailability] = useState<string>('All');
  const [sort, setSort] = useState<string>('recent');
  
  const [activeProperty, setActiveProperty] = useState<IProperty | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchProperties();
  }, [selectedType, maxRent, selectedGender, searchQuery, roomType, furnishing, availability, sort]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await api.getProperties({
        type: selectedType,
        maxRent,
        genderPreference: selectedGender,
        search: searchQuery,
        roomType,
        furnishing,
        availability,
        sort
      });
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((i) => i !== id));
      showToast('Property removed from saved listings');
    } else {
      setSavedIds([...savedIds, id]);
      showToast('Property saved to your wishlist!');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const propertyTypes = ['All', 'PG', 'Hostel', 'Flat', 'Single Room', 'Shared Room'];

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

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
              <Building className="w-7 h-7 text-neutral-900" />
              <span>Explore PGs & Flats in {city}</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Verified Properties and Flats around <span className="text-neutral-900 font-semibold">{area}</span>.
            </p>
          </div>

          <button 
            onClick={() => navigate('/properties/create')}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center space-x-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>List Your Property</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-5 rounded-2xl mb-8 border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-neutral-700 mr-2 flex items-center">
                <Filter className="w-3.5 h-3.5 text-neutral-900 mr-1" /> Type:
              </span>
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedType === type
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-neutral-700">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="recent">Newest</option>
                <option value="rent_asc">Rent (Low to High)</option>
                <option value="rent_desc">Rent (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                Max Monthly Rent: <span className="text-neutral-900 font-extrabold">₹{maxRent.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="5000"
                max="50000"
                step="1000"
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
                className="w-full accent-neutral-900 bg-neutral-200 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Gender Preference</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="Any">Any Gender</option>
                <option value="Male">Male Residents</option>
                <option value="Female">Female Residents</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="All">All</option>
                <option value="Available">Available</option>
                <option value="Booking Fast">Booking Fast</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Search Keywords</label>
              <input
                type="text"
                placeholder="e.g. DLF, WiFi, AC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white h-80 rounded-3xl animate-pulse border border-neutral-200" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
            <Building className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-900">No properties match your filter</h3>
            <p className="text-xs text-neutral-500 mt-1">Try adjusting your rent budget or selecting &apos;All&apos; property types.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => {
              const isSaved = savedIds.includes(prop._id);
              return (
                <div
                  key={prop._id}
                  className="glass-card rounded-3xl overflow-hidden border border-neutral-200 hover:border-neutral-400 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center space-x-1">
                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-extrabold text-neutral-900 border border-neutral-200">
                          {prop.type}
                        </span>
                        {prop.isVerified && (
                          <span className="px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center space-x-1">
                            <Shield className="w-3 h-3 fill-current" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleSave(prop._id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                          isSaved ? 'bg-neutral-900 text-white' : 'bg-white/80 text-neutral-700 hover:text-neutral-900'
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>

                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black text-neutral-900 border border-neutral-200">
                        ₹{prop.rent.toLocaleString()} <span className="text-[10px] font-normal text-neutral-500">/ mo</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-1">
                        <StarRating rating={prop.rating} count={prop.reviewCount} size={11} />
                        <span className="text-[11px] font-semibold text-neutral-500 flex items-center">
                          <MapPin className="w-3 h-3 text-neutral-900 mr-1" />
                          2.4 km away
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-1">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">{prop.address || prop.area + ', ' + prop.city}</p>

                      {/* Amenities pills */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {prop.amenities.slice(0, 4).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] font-semibold text-neutral-700"
                          >
                            ✓ {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-5 pb-5 pt-2 border-t border-neutral-100 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/properties/${prop._id}`)}
                      className="flex-1 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs font-bold text-neutral-900 transition-all text-center"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        const ownerIdStr = typeof prop.owner === 'string' ? prop.owner : (prop.owner as any)._id;
                        if (user && user._id === ownerIdStr) {
                          navigate('/messages');
                        } else {
                          navigate(`/messages?userId=${ownerIdStr}`);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center space-x-1 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contact</span>
                    </button>
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
