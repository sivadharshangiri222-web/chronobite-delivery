import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import EmptyState from '../components/EmptyState';
import SkeletonLoader from '../components/SkeletonLoader';
import { ChevronRight, RefreshCw } from 'lucide-react';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data.data || []);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-semibold rounded-full text-[11px]">Confirmed</span>;
      case 'preparing':
        return <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 font-semibold rounded-full text-[11px]">Preparing</span>;
      case 'out_for_delivery':
        return <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 font-semibold rounded-full text-[11px]">Out for Delivery</span>;
      case 'delivered':
        return <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 font-semibold rounded-full text-[11px]">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 font-semibold rounded-full text-[11px]">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-gray-500/20 text-gray-400 font-semibold rounded-full text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-3xl mx-auto px-4 pt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#F0F0F0]">My Orders</h1>
          <p className="text-xs text-[#9A9DA6] mt-1">Track current orders & past history</p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2 rounded-full bg-[#25282E] hover:bg-white/10 text-[#9A9DA6] transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <SkeletonLoader count={4} type="card" />
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              whileHover={{ scale: 1.01 }}
              className="bg-[#1C1E22] border border-white/[0.07] hover:border-[rgba(232,119,34,0.3)] rounded-[16px] p-5 transition-all"
            >
              <div className="flex items-start justify-between pb-3 border-b border-white/[0.05]">
                <div>
                  <h3 className="text-base font-bold font-display text-[#F0F0F0]">
                    {order.restaurantId?.name || 'Restaurant'}
                  </h3>
                  <p className="text-xs text-[#55585F] mt-0.5">
                    Order #{order._id.toString().substring(0, 8)} • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Items preview */}
              <div className="py-3 text-xs text-[#9A9DA6] space-y-1">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="text-[#F0F0F0]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Total & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.05] text-xs">
                <div>
                  <span className="text-[#55585F]">Total Paid: </span>
                  <strong className="text-[#F0F0F0] font-display text-sm">₹{order.totalAmount}</strong>
                </div>

                <Link
                  to={`/order-tracking/${order._id}`}
                  className="px-4 py-2 bg-[#25282E] hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 flex items-center gap-1 transition-all"
                >
                  <span>Track / Details</span>
                  <ChevronRight className="w-4 h-4 text-[#E87722]" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          type="no_results"
          message="No order history yet."
          actionLabel="Browse Restaurants"
          onAction={() => window.location.href = '/'}
        />
      )}
    </div>
  );
};

export default Orders;
