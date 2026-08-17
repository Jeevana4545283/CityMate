import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, MapPin, Tag, MessageSquare, X } from 'lucide-react';
import { IMarketplaceItem } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

export const MarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const { city, area } = useLocation();

  const [items, setItems] = useState<IMarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sell Item Modal State
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(1500);
  const [category, setCategory] = useState<'Furniture' | 'Electronics' | 'Appliances' | 'Bicycles' | 'Books' | 'Other'>('Furniture');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await api.getMarketplaceItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newItem = await api.createMarketplaceItem({
        title,
        description,
        price,
        category,
        city,
        area
      });
      setItems([newItem, ...items]);
      setIsSellModalOpen(false);
      setTitle('');
      setDescription('');
      showToast('Item listed in local marketplace!');
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const categories = ['All', 'Furniture', 'Electronics', 'Appliances', 'Bicycles', 'Books', 'Other'];

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 pt-6 lg:pl-[260px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 flex items-center space-x-2">
              <ShoppingBag className="w-7 h-7 text-neutral-900" />
              <span>Local Marketplace</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Buy and sell pre-loved study tables, mattresses, chairs, appliances, and bikes around <span className="text-neutral-900 font-semibold">{area}, {city}</span>.
            </p>
          </div>

          <button
            onClick={() => setIsSellModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center space-x-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Sell Pre-loved Item</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="bg-white p-4 rounded-2xl mb-8 border border-neutral-200 shadow-2xs flex items-center space-x-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Item Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="glass-card rounded-3xl overflow-hidden border border-neutral-200 flex flex-col justify-between group">
              <div>
                <div className="h-48 relative overflow-hidden">
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-[10px] font-bold text-neutral-900 border border-neutral-200">
                    {item.category}
                  </span>
                  <div className="absolute bottom-3 right-3 bg-neutral-900 text-white px-3 py-1 rounded-xl text-xs font-extrabold shadow-sm">
                    ₹{item.price.toLocaleString()}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors">{item.title}</h3>
                  <p className="text-xs text-neutral-500 mt-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-neutral-900 mr-1" />
                    {item.area}, {item.city} ({item.distance || 1.8} km)
                  </p>
                  <p className="text-xs text-neutral-600 mt-3 line-clamp-2">{item.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => showToast(`Seller contact initiated!`)}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Contact Seller</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sell Item Modal */}
        {isSellModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
              <button onClick={() => setIsSellModalOpen(false)} className="absolute top-4 right-4 text-neutral-400">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-neutral-900 flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-neutral-900" />
                <span>Sell a Pre-loved Item</span>
              </h3>

              <form onSubmit={handleSellSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Item Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Study Table + Mesh Chair"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
                    >
                      <option value="Furniture">Furniture</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Appliances">Appliances</option>
                      <option value="Bicycles">Bicycles</option>
                      <option value="Books">Books</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Item Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Condition, age of item, move-in reasons..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button type="button" onClick={() => setIsSellModalOpen(false)} className="px-4 py-2 text-xs font-bold text-neutral-600">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-xs">
                    Post Item
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
