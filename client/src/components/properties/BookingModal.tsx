import React, { useState } from 'react';
import { X, Calendar, CheckCircle2 } from 'lucide-react';
import { IProperty } from '../../types';
import { api } from '../../services/api';

interface BookingModalProps {
  property: IProperty;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ property, isOpen, onClose, onSuccess }) => {
  const [moveInDate, setMoveInDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!moveInDate) {
      setError('Please select a move-in date');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.createPropertyBooking({
        propertyId: property._id,
        moveInDate,
        rentAgreed: property.rent,
        depositAgreed: property.deposit
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-neutral-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-neutral-100">
          <h2 className="text-lg font-black text-neutral-900">Book Property</h2>
          <button onClick={onClose} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors">
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Property Info */}
          <div className="flex items-start gap-4">
            <img src={property.images[0]} alt={property.title} className="w-16 h-16 rounded-xl object-cover" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900 line-clamp-1">{property.title}</h3>
              <p className="text-xs text-neutral-500 mt-1">{property.area}, {property.city}</p>
            </div>
          </div>

          <hr className="border-neutral-100" />

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2">Select Move-in Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:border-neutral-900"
              />
            </div>
            {error && <p className="text-[10px] text-red-600 font-semibold mt-1">{error}</p>}
          </div>

          <hr className="border-neutral-100" />

          {/* Pricing Breakdown */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 mb-1">Pricing Breakdown</h4>
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Monthly Rent</span>
              <span className="font-semibold text-neutral-900">₹{property.rent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Security Deposit</span>
              <span className="font-semibold text-neutral-900">₹{property.deposit.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-neutral-200 flex justify-between text-sm font-black text-neutral-900">
              <span>Total to Pay (Later)</span>
              <span>₹{(property.rent + property.deposit).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-100">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <p className="text-[10px] font-semibold leading-relaxed">
              No payment is required now. Submitting this request notifies the owner to review your application.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-neutral-100 bg-neutral-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-neutral-900 rounded-xl text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? 'Submitting...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};
