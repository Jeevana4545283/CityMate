import React, { useState } from 'react';
import { Trophy, MapPin, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SkillLevel, PlayingStyle, PreferredTime } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Aarav Sharma');
  const [bio, setBio] = useState(user?.bio || 'CS student at IIIT Hyderabad who just moved to Gachibowli!');
  const [city, setCity] = useState(user?.city || 'Hyderabad');
  const [area, setArea] = useState(user?.area || 'Gachibowli');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(user?.sports?.[0]?.skillLevel || 'Intermediate');
  const [playingStyle, setPlayingStyle] = useState<PlayingStyle>(user?.sports?.[0]?.playingStyle || 'Doubles');
  const [preferredTime, setPreferredTime] = useState<PreferredTime>(user?.sports?.[0]?.preferredTime || 'Evening');
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name,
      bio,
      city,
      area,
      sports: [
        {
          sport: 'Badminton',
          skillLevel,
          playingStyle,
          preferredTime,
          availableDays: ['Saturday', 'Sunday', 'Wednesday']
        }
      ]
    });
    showToast('Profile updated successfully!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 pt-6 lg:pl-[260px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={user?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border border-neutral-300"
            />
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{name}</h1>
              <p className="text-xs text-neutral-500 flex items-center mt-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-900 mr-1" />
                {area}, {city} • Role: <strong className="text-neutral-900 ml-1">{user?.role}</strong>
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">City & Area</label>
                <input
                  type="text"
                  value={`${area}, ${city}`}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Bio / About Me</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900"
              />
            </div>

            {/* Sports Preferences */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center space-x-2 mb-3">
                <Trophy className="w-4 h-4 text-neutral-900" />
                <span>Badminton & Sports Profile</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-600 mb-1">Skill Level</label>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-600 mb-1">Playing Style</label>
                  <select
                    value={playingStyle}
                    onChange={(e) => setPlayingStyle(e.target.value as PlayingStyle)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                  >
                    <option value="Singles">Singles</option>
                    <option value="Doubles">Doubles</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-600 mb-1">Preferred Time</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value as PreferredTime)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
