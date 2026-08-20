import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useSidebar } from '../context/SidebarContext';

export const EditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
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

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      if (!id) return;
      const data = await api.getPropertyById(id);
      setFormData({
        title: data.title,
        description: data.description,
        type: data.type,
        city: data.city,
        area: data.area,
        address: data.address,
        rent: data.rent.toString(),
        deposit: data.deposit.toString(),
        amenities: data.amenities.join(', '),
        genderPreference: data.genderPreference
      });
    } catch (error) {
      console.error(error);
      alert('Error fetching property data');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      const amenitiesArray = formData.amenities.split(',').map(item => item.trim()).filter(Boolean);
      await api.updateProperty(id, {
        ...formData,
        rent: Number(formData.rent),
        deposit: Number(formData.deposit),
        amenities: amenitiesArray.length > 0 ? amenitiesArray : ['WiFi']
      });
      navigate(`/properties/${id}`);
    } catch (error) {
      console.error(error);
      alert('Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={`min-h-screen bg-neutral-50 flex justify-center pt-20 ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}><div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-neutral-900">Edit Property</h1>
            <p className="text-xs text-neutral-500 mt-1">Update the details of your listing.</p>
          </div>
          <button onClick={() => navigate(-1)} className="text-sm font-bold text-neutral-600 hover:text-neutral-900">Cancel</button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-200 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" />
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
                <input required name="area" value={formData.area} onChange={handleChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" />
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
              <input name="amenities" value={formData.amenities} onChange={handleChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
