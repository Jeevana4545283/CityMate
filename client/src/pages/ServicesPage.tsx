import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Zap,
  Fan,
  Wind,
  Car,
  Hammer,
  Sparkles,
  Lock,
  Tv,
  Smartphone,
  CheckCircle2,
  Clock,
  MapPin,
  X,
  Phone
} from 'lucide-react';
import { IServiceProvider, IServiceBooking, ServiceCategory } from '../types';
import { api } from '../services/api';
import { StarRating } from '../components/common/StarRating';
import { VisualProgressTracker } from '../components/common/VisualProgressTracker';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

export const ServicesPage: React.FC = () => {
  const { user } = useAuth();
  const { city, area } = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [providers, setProviders] = useState<IServiceProvider[]>([]);
  const [bookings, setBookings] = useState<IServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [activeProvider, setActiveProvider] = useState<IServiceProvider | null>(null);
  const [problemDescription, setProblemDescription] = useState('Fan is making a loud noise and stops after 10 minutes.');
  const [bookingDate, setBookingDate] = useState('2026-08-22');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('06:00 PM');
  const [locationAddress, setLocationAddress] = useState(`Flat 302, Stanza Living, DLF Cyber City Road, ${area}`);
  const [toastMessage, setToastMessage] = useState('');

  const serviceCategories: { name: ServiceCategory; icon: React.ComponentType<{ className?: string }> }[] = [
    { name: 'Electrician', icon: Zap },
    { name: 'Fan Repair', icon: Fan },
    { name: 'Plumber', icon: Wrench },
    { name: 'AC Technician', icon: Wind },
    { name: 'Mechanic', icon: Car },
    { name: 'Carpenter', icon: Hammer },
    { name: 'Cleaner', icon: Sparkles },
    { name: 'Locksmith', icon: Lock },
    { name: 'Appliance Repair', icon: Tv },
    { name: 'Mobile Repair', icon: Smartphone }
  ];

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [provData, bookData] = await Promise.all([
        api.getServiceProviders(selectedCategory, city),
        api.getBookings()
      ]);
      setProviders(provData);
      setBookings(bookData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProvider) return;

    try {
      const newBooking = await api.createBooking({
        providerId: activeProvider._id,
        serviceCategory: activeProvider.category,
        problemDescription,
        bookingDate,
        bookingTimeSlot,
        locationAddress,
        area,
        city,
        estimatedCost: activeProvider.baseFee + 100
      });

      setBookings([newBooking, ...bookings]);
      setActiveProvider(null);
      showToast(`Service booking requested with ${activeProvider.businessName}!`);
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 pt-6 lg:pl-[260px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
            <Wrench className="w-7 h-7 text-neutral-900" />
            <span>Need Help? Local Handymen in {city}</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Book verified electricians, plumbers, fan repairers, and AC technicians in <span className="text-neutral-900 font-semibold">{area}</span>.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="bg-white p-4 rounded-2xl mb-8 border border-neutral-200 shadow-2xs">
          <h3 className="text-xs font-bold text-neutral-700 mb-3 uppercase tracking-wider">Service Categories</h3>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 transition-all ${
                selectedCategory === 'All'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-neutral-900'
              }`}
            >
              <span>All Services</span>
            </button>

            {serviceCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 flex-shrink-0 transition-all ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Bookings Tracker Section */}
        {bookings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-neutral-900" />
              <span>Your Service Bookings & Status</span>
            </h2>

            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b._id} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
                          {b.serviceCategory}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {b.bookingDate} at {b.bookingTimeSlot}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-neutral-900 mt-1">
                        {typeof b.provider === 'object' ? b.provider.businessName : 'Service Provider'}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-0.5">&quot;{b.problemDescription}&quot;</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-neutral-400">Est. Cost</div>
                      <div className="text-lg font-black text-neutral-900">₹{b.estimatedCost}</div>
                    </div>
                  </div>

                  {/* Visual Tracker */}
                  <VisualProgressTracker status={b.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Provider List */}
        <h2 className="text-lg font-bold text-neutral-900 mb-4">Nearby Verified Handymen</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white h-64 rounded-3xl animate-pulse border border-neutral-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {providers.map((prov) => (
              <div
                key={prov._id}
                className="glass-card p-6 rounded-3xl border border-neutral-200 hover:border-neutral-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-neutral-200">
                        {prov.category}
                      </span>
                      <h3 className="text-base font-bold text-neutral-900 mt-1.5 group-hover:text-neutral-700 transition-colors">
                        {prov.businessName}
                      </h3>
                    </div>
                    {prov.verificationStatus === 'Verified' && (
                      <span className="px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 mb-3">
                    <StarRating rating={prov.rating} count={prov.reviewCount} size={13} />
                    <span className="text-xs text-neutral-500 font-medium">• {prov.experienceYears} yrs experience</span>
                  </div>

                  <p className="text-xs text-neutral-600 mb-3">{prov.bio}</p>

                  <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 mb-4 space-y-1 text-xs">
                    <div className="flex justify-between text-neutral-500">
                      <span>Inspection Fee:</span>
                      <span className="text-neutral-900 font-bold">₹{prov.baseFee}</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>Distance:</span>
                      <span className="text-neutral-800">2.1 km away ({prov.area})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {prov.services.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] font-semibold text-neutral-700">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center space-x-2">
                  <button
                    onClick={() => setActiveProvider(prov)}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-xs"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Book Service</span>
                  </button>
                  <button
                    onClick={() => showToast(`Direct call triggered for ${prov.businessName}!`)}
                    className="p-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-neutral-900"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service Booking Request Modal */}
        {activeProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setActiveProvider(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Book {activeProvider.businessName}</h3>
                  <p className="text-xs text-neutral-500">{activeProvider.category} Service in {area}</p>
                </div>
              </div>

              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Service Category</label>
                  <input
                    type="text"
                    readOnly
                    value={activeProvider.category}
                    className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Describe the Problem</label>
                  <textarea
                    required
                    rows={3}
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="e.g. Ceiling fan is making loud noise..."
                    className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Time Slot</label>
                    <select
                      value={bookingTimeSlot}
                      onChange={(e) => setBookingTimeSlot(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                    >
                      <option value="09:00 AM">Morning (09:00 AM)</option>
                      <option value="02:00 PM">Afternoon (02:00 PM)</option>
                      <option value="06:00 PM">Evening (06:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Service Address / Location</label>
                  <input
                    type="text"
                    required
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Estimated Inspection Fee:</span>
                  <span className="text-neutral-900 font-extrabold">₹{activeProvider.baseFee}</span>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveProvider(null)}
                    className="px-4 py-2 text-xs font-bold text-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-xs"
                  >
                    Confirm & Request Service
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
