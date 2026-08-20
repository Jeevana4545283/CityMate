import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Briefcase, IndianRupee, Home, Calendar, Coffee, Cigarette, Wine, Moon, Sparkles, Heart } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

export const RoommateProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { city } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [profile, setProfile] = useState<any>({
    age: '',
    gender: '',
    occupation: '',
    budgetMin: '',
    budgetMax: '',
    preferredPropertyType: '',
    preferredRoomType: '',
    moveInDate: '',
    preferredLocations: [],
    foodPreference: '',
    smokingPreference: '',
    drinkingPreference: '',
    sleepSchedule: '',
    cleanlinessPreference: '',
    petsPreference: '',
    interests: [],
    bio: ''
  });

  const [locationInput, setLocationInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await api.getRoommateProfile();
      if (data) {
        setProfile({
          ...data,
          moveInDate: data.moveInDate ? new Date(data.moveInDate).toISOString().split('T')[0] : ''
        });
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        showToast('Error loading profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...profile,
        age: Number(profile.age),
        budgetMin: Number(profile.budgetMin),
        budgetMax: Number(profile.budgetMax)
      };
      await api.saveRoommateProfile(dataToSave);
      showToast('Profile saved successfully!');
      setTimeout(() => navigate('/find-partner'), 1500);
    } catch (err) {
      showToast('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const addLocation = () => {
    if (locationInput && !profile.preferredLocations.includes(locationInput)) {
      setProfile({ ...profile, preferredLocations: [...profile.preferredLocations, locationInput] });
      setLocationInput('');
    }
  };

  const removeLocation = (loc: string) => {
    setProfile({ ...profile, preferredLocations: profile.preferredLocations.filter((l: string) => l !== loc) });
  };

  const addInterest = () => {
    if (interestInput && !profile.interests.includes(interestInput)) {
      setProfile({ ...profile, interests: [...profile.interests, interestInput] });
      setInterestInput('');
    }
  };

  const removeInterest = (int: string) => {
    setProfile({ ...profile, interests: profile.interests.filter((i: string) => i !== int) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex justify-center pt-20">
        <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 pt-6 lg:pl-[260px] transition-all duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
            <User className="w-7 h-7 text-neutral-900" />
            <span>Roommate Profile</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Complete your profile to find the perfect roommate in {city}.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-200 space-y-8">
          
          {/* Basic Info */}
          <section>
            <h2 className="text-sm font-bold text-neutral-900 mb-4 flex items-center"><User className="w-4 h-4 mr-2" /> Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Age</label>
                <input type="number" value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Gender</label>
                <select value={profile.gender} onChange={e => setProfile({...profile, gender: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Occupation</label>
                <select value={profile.occupation} onChange={e => setProfile({...profile, occupation: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900">
                  <option value="">Select...</option>
                  <option value="Student">Student</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>

          <hr className="border-neutral-100" />

          {/* Housing Preferences */}
          <section>
            <h2 className="text-sm font-bold text-neutral-900 mb-4 flex items-center"><Home className="w-4 h-4 mr-2" /> Housing Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Min Budget (₹)</label>
                  <input type="number" value={profile.budgetMin} onChange={e => setProfile({...profile, budgetMin: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900" />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Max Budget (₹)</label>
                  <input type="number" value={profile.budgetMax} onChange={e => setProfile({...profile, budgetMax: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Move-in Date</label>
                <input type="date" value={profile.moveInDate} onChange={e => setProfile({...profile, moveInDate: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Property Type</label>
                <select value={profile.preferredPropertyType} onChange={e => setProfile({...profile, preferredPropertyType: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900">
                  <option value="">Any</option>
                  <option value="PG">PG</option>
                  <option value="Flat">Flat</option>
                  <option value="Hostel">Hostel</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Room Type</label>
                <select value={profile.preferredRoomType} onChange={e => setProfile({...profile, preferredRoomType: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900">
                  <option value="">Any</option>
                  <option value="Single Room">Single Room</option>
                  <option value="Shared Room">Shared Room</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Preferred Areas in {city}</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={locationInput} onChange={e => setLocationInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addLocation()} placeholder="e.g. Gachibowli" className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900" />
                <button onClick={addLocation} className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.preferredLocations.map((loc: string) => (
                  <span key={loc} className="px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold flex items-center">
                    {loc} <button onClick={() => removeLocation(loc)} className="ml-2 text-neutral-400 hover:text-neutral-700">×</button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <hr className="border-neutral-100" />

          {/* Lifestyle */}
          <section>
            <h2 className="text-sm font-bold text-neutral-900 mb-4 flex items-center"><Sparkles className="w-4 h-4 mr-2" /> Lifestyle</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Food</label>
                <select value={profile.foodPreference} onChange={e => setProfile({...profile, foodPreference: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900">
                  <option value="">Any</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Smoking</label>
                <select value={profile.smokingPreference} onChange={e => setProfile({...profile, smokingPreference: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900">
                  <option value="">Any</option>
                  <option value="Non-Smoker">Non-Smoker</option>
                  <option value="Smoker">Smoker</option>
                  <option value="Outside Only">Outside Only</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Drinking</label>
                <select value={profile.drinkingPreference} onChange={e => setProfile({...profile, drinkingPreference: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900">
                  <option value="">Any</option>
                  <option value="Non-Drinker">Non-Drinker</option>
                  <option value="Occasional">Occasional</option>
                  <option value="Regular">Regular</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Sleep Schedule</label>
                <select value={profile.sleepSchedule} onChange={e => setProfile({...profile, sleepSchedule: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900">
                  <option value="">Any</option>
                  <option value="Early Bird">Early Bird</option>
                  <option value="Night Owl">Night Owl</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Cleanliness</label>
                <select value={profile.cleanlinessPreference} onChange={e => setProfile({...profile, cleanlinessPreference: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900">
                  <option value="">Any</option>
                  <option value="Very Clean">Very Clean</option>
                  <option value="Average">Average</option>
                  <option value="Messy">Messy</option>
                </select>
              </div>
            </div>
          </section>
          
          <hr className="border-neutral-100" />

          {/* Interests & Bio */}
          <section>
            <h2 className="text-sm font-bold text-neutral-900 mb-4 flex items-center"><Heart className="w-4 h-4 mr-2" /> About You</h2>
            
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Interests & Hobbies</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={interestInput} onChange={e => setInterestInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addInterest()} placeholder="e.g. Gaming, Badminton, Coding" className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900" />
                <button onClick={addInterest} className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((int: string) => (
                  <span key={int} className="px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold flex items-center">
                    {int} <button onClick={() => removeInterest(int)} className="ml-2 text-neutral-400 hover:text-neutral-700">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Short Bio</label>
              <textarea 
                rows={4}
                value={profile.bio} 
                onChange={e => setProfile({...profile, bio: e.target.value})} 
                placeholder="Tell potential roommates a bit about yourself..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900 resize-none" 
              />
            </div>
          </section>

          {/* Actions */}
          <div className="pt-4 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-70 transition-all"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
