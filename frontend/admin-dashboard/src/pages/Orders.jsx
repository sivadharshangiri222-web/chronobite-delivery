import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { RefreshCw, ShoppingBag, Clock } from 'lucide-react';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/admin/all');
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (newStatus === 'cancelled' && !window.confirm('Cancelling order will initiate automatic 100% refund. Proceed?')) {
      return;
    }

    try {
      await api.patch(`/orders/admin/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Order Status Pipeline</h1>
          <p className="text-xs text-textMuted mt-1">Manage kitchen prep and delivery stages in real-time.</p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-surface hover:bg-white/10 border border-white/10 text-white font-semibold rounded-full text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-textMuted">Loading order pipeline...</div>
        ) : (
          <table className="w-full text-left text-xs text-textSecondary">
            <thead className="bg-elevated text-textMuted uppercase font-bold border-b border-white/5">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Restaurant</th>
                <th className="p-4">Slot</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-white/5">
                  <td className="p-4 font-mono font-bold text-white">#{o._id.toString().substring(0, 8)}</td>
                  <td className="p-4 text-white">
                    <p className="font-semibold">{o.userId?.name || 'Customer'}</p>
                    <p className="text-[10px] text-textMuted">{o.userId?.phone}</p>
                  </td>
                  <td className="p-4 font-medium">{o.restaurantId?.name}</td>
                  <td className="p-4 text-red-primary font-bold">
                    {o.deliverySlotId?.date} ({o.deliverySlotId?.startTime}-{o.deliverySlotId?.endTime})
                  </td>
                  <td className="p-4 font-bold text-white">₹{o.totalAmount}</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                      className="bg-elevated text-white border border-white/10 rounded-lg px-3 py-1.5 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="awaiting_payment" className="bg-surface">Awaiting Payment</option>
                      <option value="payment_failed" className="bg-surface">Payment Failed</option>
                      <option value="confirmed" className="bg-surface text-emerald-400">Confirmed</option>
                      <option value="preparing" className="bg-surface text-amber-400">Preparing</option>
                      <option value="out_for_delivery" className="bg-surface text-blue-400">Out for Delivery</option>
                      <option value="delivered" className="bg-surface text-purple-400">Delivered</option>
                      <option value="cancelled" className="bg-surface text-red-400">Cancelled (Refund)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
