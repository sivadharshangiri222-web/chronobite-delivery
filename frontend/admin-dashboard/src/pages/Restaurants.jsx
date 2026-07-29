import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit, ToggleLeft, ToggleRight, Trash2, MapPin, Search } from 'lucide-react';

export const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisineType: 'Italian, Pizza',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    street: '12th Main Road',
    city: 'Chennai',
    pincode: '600040',
    lng: 80.2707,
    lat: 13.0827
  });

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/restaurants');
      setRestaurants(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/admin/restaurants/${id}/toggle-status`);
      fetchRestaurants();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Soft delete this restaurant?')) return;
    try {
      await api.delete(`/admin/restaurants/${id}`);
      fetchRestaurants();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        cuisineType: formData.cuisineType.split(',').map((c) => c.trim()),
        image: formData.image,
        address: {
          street: formData.street,
          city: formData.city,
          pincode: formData.pincode
        },
        coordinates: {
          lng: parseFloat(formData.lng),
          lat: parseFloat(formData.lat)
        }
      };

      await api.post('/admin/restaurants', payload);
      setShowModal(false);
      fetchRestaurants();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Restaurant Management</h1>
          <p className="text-xs text-textMuted mt-1">
            Note: Restaurants are hidden from customers by default until activated & menu items exist.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-red-primary hover:bg-red-hover text-white text-xs font-bold rounded-full shadow-red-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Restaurant
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-textMuted">Loading restaurants...</div>
        ) : (
          <table className="w-full text-left text-xs text-textSecondary">
            <thead className="bg-elevated text-textMuted uppercase font-bold border-b border-white/5">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Cuisines</th>
                <th className="p-4">Location</th>
                <th className="p-4">Visibility (isActive)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {restaurants.map((r) => (
                <tr key={r._id} className="hover:bg-white/5">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <img src={r.image} alt={r.name} className="w-10 h-10 rounded-lg object-cover bg-elevated" />
                    <div>
                      <p>{r.name}</p>
                      <span className="text-[10px] text-textMuted">Rating: {r.rating || 4.5}</span>
                    </div>
                  </td>
                  <td className="p-4">{r.cuisineType?.join(', ')}</td>
                  <td className="p-4">{r.address?.city} ({r.address?.street})</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(r._id)}
                      className={`px-3 py-1 rounded-full font-bold text-[11px] flex items-center gap-1.5 transition-all ${
                        r.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {r.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{r.isActive ? 'ACTIVE' : 'INACTIVE (Hidden)'}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="p-2 bg-elevated hover:bg-red-soft text-textMuted hover:text-red-primary rounded-lg transition-colors"
                      title="Soft Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Add New Restaurant</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-textSecondary block mb-1 font-semibold">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                />
              </div>

              <div>
                <label className="text-textSecondary block mb-1 font-semibold">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-elevated border border-white/10 rounded-xl p-3 text-white h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-textSecondary block mb-1 font-semibold">Cuisines (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={formData.cuisineType}
                    onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                    className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-textSecondary block mb-1 font-semibold">Image URL</label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-textSecondary block mb-1 font-semibold">Street</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-textSecondary block mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-textSecondary block mb-1 font-semibold">Pincode</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-textSecondary block mb-1 font-semibold">Longitude (lng)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-textSecondary block mb-1 font-semibold">Latitude (lat)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-textSecondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-primary text-white text-xs font-bold rounded-full shadow-red-glow"
                >
                  Save Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
