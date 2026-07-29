import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

export const DeliverySlots = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestId, setSelectedRestId] = useState('');
  const [slots, setSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [slotData, setSlotData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '12:00',
    endTime: '13:00',
    maxOrders: 10
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get('/admin/restaurants');
        const list = res.data.data || [];
        setRestaurants(list);
        if (list.length > 0) setSelectedRestId(list[0]._id);
      } catch (err) {}
    };
    fetchRestaurants();
  }, []);

  const fetchSlots = async () => {
    if (!selectedRestId) return;
    try {
      const res = await api.get(`/slots/admin/${selectedRestId}`);
      setSlots(res.data.data || []);
    } catch (err) {}
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedRestId]);

  const handleToggle = async (id) => {
    try {
      await api.patch(`/slots/admin/${id}/toggle`);
      fetchSlots();
    } catch (err) {}
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await api.post('/slots/admin', {
        ...slotData,
        restaurantId: selectedRestId,
        maxOrders: parseInt(slotData.maxOrders)
      });
      setShowModal(false);
      fetchSlots();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Delivery Slots Management</h1>
          <p className="text-xs text-textMuted mt-1">Configure timed capacity slots for orders.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedRestId}
            onChange={(e) => setSelectedRestId(e.target.value)}
            className="bg-surface border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-bold"
          >
            {restaurants.map((r) => (
              <option key={r._id} value={r._id} className="bg-surface text-white">
                {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-red-primary text-white text-xs font-bold rounded-full shadow-red-glow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Slot
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <div key={slot._id} className="bg-surface border border-white/10 rounded-2xl p-5 space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-white text-sm">{slot.date}</p>
                <p className="text-red-primary font-bold text-base mt-0.5">{slot.startTime} - {slot.endTime}</p>
              </div>
              <button
                onClick={() => handleToggle(slot._id)}
                className={`px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                  slot.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}
              >
                {slot.isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                <span>{slot.isAvailable ? 'OPEN' : 'CLOSED'}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-between text-textSecondary">
              <span>Orders Booked:</span>
              <strong className="text-white">{slot.currentOrders} / {slot.maxOrders}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold font-display text-white">Create Delivery Slot</h3>
            <form onSubmit={handleCreateSlot} className="space-y-3 text-xs">
              <div>
                <label className="text-textSecondary block mb-1 font-semibold">Date</label>
                <input
                  type="date"
                  required
                  value={slotData.date}
                  onChange={(e) => setSlotData({ ...slotData, date: e.target.value })}
                  className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-textSecondary block mb-1 font-semibold">Start Time (HH:mm)</label>
                  <input
                    type="time"
                    required
                    value={slotData.startTime}
                    onChange={(e) => setSlotData({ ...slotData, startTime: e.target.value })}
                    className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-textSecondary block mb-1 font-semibold">End Time (HH:mm)</label>
                  <input
                    type="time"
                    required
                    value={slotData.endTime}
                    onChange={(e) => setSlotData({ ...slotData, endTime: e.target.value })}
                    className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-textSecondary block mb-1 font-semibold">Max Orders Capacity</label>
                <input
                  type="number"
                  required
                  value={slotData.maxOrders}
                  onChange={(e) => setSlotData({ ...slotData, maxOrders: e.target.value })}
                  className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-textSecondary">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-red-primary text-white font-bold rounded-full">Save Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverySlots;
