import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useSidebar } from '../context/SidebarContext';
import { Building, MapPin, Edit2, Trash2, Plus } from 'lucide-react';
import { IProperty } from '../types';

export const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const data = await api.getMyListings();
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this property?');
    if (!confirmDelete) return;

    try {
      await api.deleteProperty(id);
      setProperties(properties.filter(p => p._id !== id));
    } catch (error) {
      console.error(error);
      alert('Error deleting property');
    }
  };

  return (
    <div className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
              <Building className="w-7 h-7 text-neutral-900" />
              <span>My Listings</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">Properties you have posted for rent.</p>
          </div>
          
          <button 
            onClick={() => navigate('/properties/create')}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center space-x-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Property</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="bg-white h-64 rounded-3xl animate-pulse border border-neutral-200" />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
            <Building className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-900">You haven't listed any properties yet</h3>
            <button onClick={() => navigate('/properties/create')} className="mt-4 px-4 py-2 text-sm font-bold text-neutral-900 bg-neutral-100 rounded-xl hover:bg-neutral-200">
              Post Your First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(prop => (
              <div key={prop._id} className="glass-card rounded-3xl overflow-hidden border border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="relative h-40 overflow-hidden">
                    <img src={prop.images[0] || 'https://via.placeholder.com/400'} alt={prop.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-neutral-900 border border-neutral-200">
                      {prop.availability}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-neutral-900 line-clamp-1">{prop.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" /> {prop.area}, {prop.city}
                    </p>
                    <p className="text-sm font-black text-neutral-900 mt-2">₹{prop.rent.toLocaleString()} <span className="text-[10px] font-normal text-neutral-500">/ mo</span></p>
                  </div>
                </div>
                <div className="px-5 pb-5 flex gap-2">
                  <button onClick={() => navigate(`/properties/${prop._id}`)} className="flex-1 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs font-bold text-neutral-900">
                    View
                  </button>
                  <button onClick={() => navigate(`/properties/${prop._id}/edit`)} className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-900">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(prop._id)} className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 text-red-600">
                    <Trash2 className="w-4 h-4" />
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
