import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useSidebar } from '../context/SidebarContext';
import { Building, MapPin, IndianRupee } from 'lucide-react';

export const CreatePropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PG',
    city: 'Hyderabad',
    area: '',
    address: '',
    rent: '',
    deposit: '',
    amenities: '',
    genderPreference: 'Any'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const amenitiesArray = formData.amenities.split(',').map(item => item.trim()).filter(Boolean);
      await api.createProperty({
        ...formData,
        rent: Number(formData.rent),
        deposit: Number(formData.deposit),
        amenities: amenitiesArray.length > 0 ? amenitiesArray : ['WiFi', 'Water'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80']
      });
      navigate('/my-listings');
    } catch (error) {
      console.error(error);
      alert('Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-neutral-900">Post a Property</h1>
            <p className="text-xs text-neutral-500 mt-1">List your PG, Flat, or Room to find tenants.</p>
          </div>
          <button onClick={() => navigate(-1)} className="text-sm font-bold text-neutral-600 hover:text-neutral-900">Cancel</button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-200 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Luxury 2BHK in Gachibowli" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Property Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900">
                  <option value="PG">PG</option>
                  <option value="Flat">Flat</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Single Room">Single Room</option>
                  <option value="Shared Room">Shared Room</option>
                  <option value="Roommate">Roommate Needed</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Gender Preference</label>
                <select name="genderPreference" value={formData.genderPreference} onChange={handleChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900">
                  <option value="Any">Any</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Area / Locality</label>
                <input required name="area" value={formData.area} onChange={handleChange} placeholder="e.g. Madhapur" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">City</label>
                <input required name="city" value={formData.city} onChange={handleChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Full Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Monthly Rent (₹)</label>
                <input required type="number" name="rent" value={formData.rent} onChange={handleChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Security Deposit (₹)</label>
                <input required type="number" name="deposit" value={formData.deposit} onChange={handleChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Description</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Amenities (comma separated)</label>
              <input name="amenities" value={formData.amenities} onChange={handleChange} placeholder="WiFi, AC, Geyser, Washing Machine" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all">
            {loading ? 'Posting...' : 'Post Property'}
          </button>
        </form>
      </div>
    </div>
  );
};
