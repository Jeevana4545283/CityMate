import React, { useState } from 'react';
import { MapPin, Phone, Hospital, Pill, ShieldAlert, CreditCard, Fuel, ShoppingCart } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export const EssentialsPage: React.FC = () => {
  const { city, area } = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { name: 'All', icon: MapPin },
    { name: 'Hospital', icon: Hospital },
    { name: 'Pharmacy', icon: Pill },
    { name: 'Police Station', icon: ShieldAlert },
    { name: 'ATM', icon: CreditCard },
    { name: 'Petrol Station', icon: Fuel },
    { name: 'Grocery', icon: ShoppingCart }
  ];

  const essentialsList = [
    {
      name: 'Continental Emergency Hospital',
      category: 'Hospital',
      distance: '1.2 km',
      address: 'Financial District, Gachibowli, Hyderabad',
      phone: '+91 40 6700 0000',
      open: 'Open 24/7'
    },
    {
      name: 'Apollo Pharmacy 24x7',
      category: 'Pharmacy',
      distance: '0.6 km',
      address: 'DLF Cyber City Road, Gachibowli',
      phone: '+91 40 2345 6789',
      open: 'Open 24 Hours'
    },
    {
      name: 'Gachibowli Police Station',
      category: 'Police Station',
      distance: '2.1 km',
      address: 'ORR Junction, Gachibowli',
      phone: '100 / +91 40 2785 2400',
      open: 'Open 24/7'
    },
    {
      name: 'HDFC Bank ATM 24x7',
      category: 'ATM',
      distance: '0.4 km',
      address: 'IIIT Junction, Gachibowli',
      phone: 'N/A',
      open: '24/7 Cash Available'
    },
    {
      name: 'Indian Oil Petrol Pump',
      category: 'Petrol Station',
      distance: '1.5 km',
      address: 'Gachibowli Main Road, Kondapur',
      phone: 'N/A',
      open: 'Open 24 Hours'
    },
    {
      name: 'Ratnadeep Supermarket & Grocery',
      category: 'Grocery',
      distance: '0.8 km',
      address: 'Botanical Garden Road, Kondapur',
      phone: '+91 40 4455 6677',
      open: '08:00 AM - 10:30 PM'
    }
  ];

  const filtered = selectedCategory === 'All' ? essentialsList : essentialsList.filter(e => e.category === selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 pt-6 lg:pl-[260px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
            <MapPin className="w-7 h-7 text-neutral-900" />
            <span>Nearby Emergency & Essential Services</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Instant 24/7 access to hospitals, pharmacies, police stations, ATMs, and groceries around <span className="text-neutral-900 font-semibold">{area}, {city}</span>.
          </p>
        </div>

        {/* Category Pills */}
        <div className="bg-white p-4 rounded-2xl mb-8 border border-neutral-200 shadow-2xs flex items-center space-x-2 overflow-x-auto">
          {categories.map((cat) => {
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

        {/* Essentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-neutral-200">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-neutral-900">{item.open}</span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 mb-1">{item.name}</h3>
                <p className="text-xs text-neutral-500 mb-3">{item.address}</p>

                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                  <div className="flex justify-between text-neutral-500">
                    <span>Approx Distance:</span>
                    <span className="text-neutral-900 font-bold">{item.distance}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Contact Number:</span>
                    <span className="text-neutral-900 font-bold">{item.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 mt-4 flex items-center space-x-2">
                <a
                  href={`tel:${item.phone}`}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-white flex items-center justify-center space-x-1 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Emergency</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
