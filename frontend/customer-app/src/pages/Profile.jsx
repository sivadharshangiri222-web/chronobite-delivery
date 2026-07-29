import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MapPin, LogOut } from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, updateProfile } = useAuthStore();
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: 'Home',
    street: '',
    city: '',
    pincode: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const loadUserData = async () => {
      try {
        const payRes = await api.get('/payments/history');
        setPayments(payRes.data.data?.payments || []);

        const refRes = await api.get('/refunds/my');
        setRefunds(refRes.data.data || []);
      } catch (err) {}
    };
    loadUserData();
  }, [isAuthenticated]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const existingAddresses = user.savedAddresses || [];
      const updatedAddresses = [...existingAddresses, newAddr];
      await updateProfile({ savedAddresses: updatedAddresses });
      setShowAddressModal(false);
      setNewAddr({ label: 'Home', street: '', city: '', pincode: '' });
    } catch (err) {
      alert(err.message || 'Could not save address');
    }
  };

  if (!user) return null;


  return (
    <div className="min-h-screen pb-32 max-w-3xl mx-auto px-4 pt-4">
      {/* User Header */}
      <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[24px] p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#E87722] flex items-center justify-center font-bold text-2xl text-white shadow-[0_4px_20px_rgba(232,119,34,0.3)]">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-[#F0F0F0]">{user.name}</h1>
            <p className="text-xs text-[#9A9DA6]">{user.email} • {user.phone}</p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/auth');
          }}
          className="px-4 py-2 bg-[#25282E] hover:bg-[rgba(232,119,34,0.12)] text-[#9A9DA6] hover:text-[#E87722] border border-white/[0.07] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.07] mb-6 gap-4">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'profile' ? 'border-[#E87722] text-[#E87722]' : 'border-transparent text-[#55585F]'
          }`}
        >
          Addresses & Info
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'payments' ? 'border-[#E87722] text-[#E87722]' : 'border-transparent text-[#55585F]'
          }`}
        >
          Payments History ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('refunds')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'refunds' ? 'border-[#E87722] text-[#E87722]' : 'border-transparent text-[#55585F]'
          }`}
        >
          Refund Status ({refunds.length})
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-display text-[#F0F0F0] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E87722]" /> Saved Addresses
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-3 py-1.5 bg-[#E87722] hover:bg-[#D06A18] text-white text-xs font-semibold rounded-full shadow-[0_2px_10px_rgba(232,119,34,0.2)] transition-all"
              >
                + Add New Address
              </button>
            </div>

            {user.savedAddresses?.length > 0 ? (
              <div className="space-y-2">
                {user.savedAddresses.map((addr, idx) => (
                  <div key={idx} className="p-3 bg-[#25282E] rounded-xl border border-white/[0.05] text-xs text-[#9A9DA6]">
                    <span className="font-bold text-[#F0F0F0] block mb-0.5">{addr.label}</span>
                    <p>{addr.street}, {addr.city} - {addr.pincode}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#55585F]">No saved addresses yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[24px] p-6 w-full max-w-md animate-slide-up">
            <h3 className="text-lg font-bold font-display text-[#F0F0F0] mb-2">Add Delivery Address</h3>
            <p className="text-xs text-[#9A9DA6] mb-4">Enter your address details for scheduled food deliveries.</p>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#9A9DA6] block mb-1">Address Label</label>
                <select
                  value={newAddr.label}
                  onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                  className="w-full bg-[#25282E] border border-white/[0.07] rounded-[12px] h-10 px-3 text-xs text-white focus:outline-none focus:border-[#E87722]"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9A9DA6] block mb-1">Street / Building</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12th Main Road, Flat 4B"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full bg-[#25282E] border border-white/[0.07] rounded-[12px] h-11 px-4 text-xs text-white focus:outline-none focus:border-[#E87722]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#9A9DA6] block mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full bg-[#25282E] border border-white/[0.07] rounded-[12px] h-11 px-4 text-xs text-white focus:outline-none focus:border-[#E87722]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#9A9DA6] block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 600040"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full bg-[#25282E] border border-white/[0.07] rounded-[12px] h-11 px-4 text-xs text-white focus:outline-none focus:border-[#E87722]"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#9A9DA6] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E87722] hover:bg-[#D06A18] text-white text-xs font-semibold rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Payments History Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-3">
          {payments.length > 0 ? (
            payments.map((p) => (
              <div key={p.id} className="bg-[#1C1E22] border border-white/[0.07] rounded-xl p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#F0F0F0]">₹{p.amount.toFixed(2)}</p>
                  <p className="text-[#55585F] text-[11px] mt-0.5">{new Date(p.date).toLocaleString()} • {p.method.toUpperCase()}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${p.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {p.status.toUpperCase()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#55585F] text-center py-6">No transaction history.</p>
          )}
        </div>
      )}

      {/* Refunds History Tab */}
      {activeTab === 'refunds' && (
        <div className="space-y-3">
          {refunds.length > 0 ? (
            refunds.map((ref) => (
              <div key={ref._id} className="bg-[#1C1E22] border border-white/[0.07] rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#F0F0F0]">₹{ref.amount} Refund</span>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 font-bold rounded-full text-[10px]">
                    {ref.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-[#55585F] text-[11px]">Reason: {ref.reason.replace('_', ' ')}</p>
                <p className="text-[#9A9DA6] text-[11px]">Timeline: Refund initiated on {new Date(ref.cancelledAt).toLocaleDateString()} • Expected in 5-7 business days</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#55585F] text-center py-6">No refunds processed.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
