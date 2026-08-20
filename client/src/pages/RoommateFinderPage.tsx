import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Filter, Heart, MapPin, Check, Search, X } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useSidebar } from '../context/SidebarContext';

export const RoommateFinderPage: React.FC = () => {
  const { user } = useAuth();
  const { city, area } = useLocation();
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState('');

  // We could add complex filters here
  const [selectedGender, setSelectedGender] = useState('Any');
  const [maxBudget, setMaxBudget] = useState(20000);

  useEffect(() => {
    fetchProfiles();
  }, [selectedGender, maxBudget]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await api.client.get('/roommates/discover');
      let data = res.data;
      if (selectedGender !== 'Any') {
        data = data.filter((p: any) => p.gender === selectedGender);
      }
      if (maxBudget) {
        data = data.filter((p: any) => !p.budgetMax || p.budgetMax <= maxBudget);
      }
      setProfiles(data);
    } catch (err) {
      console.error(err);
      showToast('Error loading profiles. Have you created your profile yet?');
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = async (profileId: string) => {
    try {
      const res = await api.client.post('/roommates/interest', { toProfileId: profileId });
      showToast(res.data.message);
      if (res.data.match) {
        navigate('/my-matches');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error expressing interest');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
              <Users className="w-7 h-7 text-neutral-900" />
              <span>Find Your Perfect Roommate</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Connect with compatible roommates based on your housing and lifestyle preferences in {city}.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/my-matches')} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-colors">
              My Matches
            </button>
            <button onClick={() => navigate('/roommate-profile')} className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors">
              Edit My Profile
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-2xl mb-8 border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-neutral-900" />
              <span className="text-xs font-bold text-neutral-700">Filters:</span>
            </div>
            
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none"
            >
              <option value="Any">Any Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-600">Max Budget: ₹{maxBudget.toLocaleString()}</span>
              <input
                type="range"
                min="5000"
                max="50000"
                step="1000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-32 accent-neutral-900 bg-neutral-200 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white h-80 rounded-3xl animate-pulse border border-neutral-200" />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
            <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-900">No profiles found</h3>
            <p className="text-xs text-neutral-500 mt-1">Try relaxing your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((p) => (
              <div key={p._id} className="glass-card rounded-3xl p-6 border border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.user?.profilePhoto || 'https://via.placeholder.com/150'}
                        alt={p.user?.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-neutral-200"
                      />
                      <div>
                        <h3 className="text-base font-bold text-neutral-900 flex items-center space-x-1">
                          <span>{p.user?.name}</span>
                          {p.age && <span className="text-xs text-neutral-500 font-normal">, {p.age}</span>}
                        </h3>
                        <p className="text-xs text-neutral-500 flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 text-neutral-900 mr-1" />
                          {p.preferredLocations?.length > 0 ? p.preferredLocations[0] : 'Flexible location'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Badge */}
                  <div className="mb-4 p-3 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-between">
                    <div className="text-sm font-extrabold text-neutral-900 flex flex-col">
                      <span>{p.compatibilityScore}% Compatible</span>
                      <span className="text-[10px] font-medium text-neutral-500">Based on your preferences</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-neutral-200 shadow-sm">
                      <Heart className="w-5 h-5 text-red-500 fill-red-50" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4 text-[11px] text-neutral-700 font-semibold">
                    {p.occupation && <div className="flex justify-between"><span>Occupation</span><span className="text-neutral-900">{p.occupation}</span></div>}
                    {p.budgetMax && <div className="flex justify-between"><span>Budget</span><span className="text-neutral-900">Up to ₹{p.budgetMax}</span></div>}
                    {p.moveInDate && <div className="flex justify-between"><span>Move-in</span><span className="text-neutral-900">{new Date(p.moveInDate).toLocaleDateString()}</span></div>}
                    {p.preferredPropertyType && <div className="flex justify-between"><span>Looking for</span><span className="text-neutral-900">{p.preferredPropertyType} ({p.preferredRoomType})</span></div>}
                  </div>

                  {/* Interests pills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.interests?.slice(0, 4).map((interest: string) => (
                      <span key={interest} className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] font-semibold text-neutral-700">
                        {interest}
                      </span>
                    ))}
                    {p.interests?.length > 4 && <span className="text-[10px] text-neutral-500 ml-1">+{p.interests.length - 4} more</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center gap-2 border-t border-neutral-100 mt-2">
                  <button
                    className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 text-xs font-bold transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleInterest(p._id)}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Interested
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
