import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { Building, MapPin, CheckCircle2, Shield, Edit2, Trash2, Calendar, Phone } from 'lucide-react';
import { IProperty } from '../types';
import { BookingModal } from '../components/properties/BookingModal';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();

  const [property, setProperty] = useState<IProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      if (!id) return;
      const data = await api.getPropertyById(id);
      setProperty(data);
    } catch (error) {
      console.error(error);
      setToastMessage('Error fetching property details');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };


  const handleDelete = async () => {
    if (!property) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this property?');
    if (!confirmDelete) return;

    try {
      await api.deleteProperty(property._id);
      navigate('/my-listings');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error deleting property');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-neutral-50 flex justify-center pt-20 ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
        <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className={`min-h-screen bg-neutral-50 pt-20 text-center ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
        <h2 className="text-xl font-bold">Property not found</h2>
        <button onClick={() => navigate('/properties')} className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-xl">Go Back</button>
      </div>
    );
  }

  const isOwner = user?._id === (typeof property.owner === 'string' ? property.owner : property.owner?._id);

  return (
    <div className={`min-h-screen bg-neutral-50 pb-24 pt-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-sm font-bold text-neutral-600 hover:text-neutral-900">
            &larr; Back
          </button>
          
          {isOwner && (
            <div className="flex gap-2">
              <button 
                onClick={() => navigate(`/properties/${property._id}/edit`)}
                className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-bold flex items-center"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold flex items-center"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Images & Details) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-2 shadow-xs border border-neutral-200">
              <img 
                src={property.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80'} 
                alt={property.title}
                className="w-full h-80 object-cover rounded-2xl"
              />
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-neutral-100 text-neutral-800 text-[11px] font-bold rounded-lg border border-neutral-200">{property.type}</span>
                <span className={`px-3 py-1 text-[11px] font-bold rounded-lg border ${property.availability === 'Available' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {property.availability}
                </span>
              </div>
              <h1 className="text-2xl font-black text-neutral-900 mb-2">{property.title}</h1>
              <p className="text-sm font-medium text-neutral-500 flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> {property.address || `${property.area}, ${property.city}`}
              </p>

              <hr className="my-6 border-neutral-100" />

              <h3 className="text-lg font-bold text-neutral-900 mb-3">Description</h3>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">{property.description}</p>
              
              <hr className="my-6 border-neutral-100" />

              <h3 className="text-lg font-bold text-neutral-900 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map(item => (
                  <span key={item} className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-neutral-900" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Pricing & Action Card) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-200 sticky top-24">
              <div className="text-3xl font-black text-neutral-900 mb-1">
                ₹{property.rent.toLocaleString()} <span className="text-sm font-medium text-neutral-500">/ month</span>
              </div>
              <p className="text-xs font-semibold text-neutral-500 mb-6">Deposit: ₹{property.deposit.toLocaleString()}</p>

              {!isOwner ? (
                property.availability === 'Available' ? (
                  <button 
                    onClick={() => setIsVisitModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all flex justify-center items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Now
                  </button>
                ) : (
                  <button disabled className="w-full py-3 rounded-xl bg-neutral-200 text-neutral-500 font-bold text-sm flex justify-center items-center cursor-not-allowed">
                    Currently Occupied
                  </button>
                )
              ) : (
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-center">
                  <p className="text-xs font-bold text-neutral-700">This is your listing.</p>
                  <p className="text-[11px] text-neutral-500 mt-1">Manage requests from your dashboard.</p>
                  <button onClick={() => navigate('/booking-requests')} className="mt-3 w-full py-2 bg-white border border-neutral-300 rounded-lg text-xs font-bold hover:bg-neutral-100">
                    View Requests
                  </button>
                </div>
              )}

              <hr className="my-6 border-neutral-100" />
              
              <div className="flex items-center gap-3">
                <img 
                  src={(property.owner as any)?.profilePhoto || 'https://via.placeholder.com/40'} 
                  alt="Owner" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-neutral-900">Listed by {(property.owner as any)?.name || 'Owner'}</p>
                  <p className="text-[10px] text-neutral-500 flex items-center mt-0.5">
                    <Shield className="w-3 h-3 mr-1" /> Verified Owner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {property && (
        <BookingModal
          property={property}
          isOpen={isVisitModalOpen}
          onClose={() => setIsVisitModalOpen(false)}
          onSuccess={() => {
            setIsVisitModalOpen(false);
            showToast('Booking request sent successfully!');
            navigate('/my-bookings');
          }}
        />
      )}
    </div>
  );
};
