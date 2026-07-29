import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { DollarSign, ShoppingBag, UtensilsCrossed, Users, TrendingUp, RefreshCw } from 'lucide-react';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/admin');
      setMetrics(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-white font-display text-lg">Loading analytics...</div>;
  }

  const cards = [
    { label: 'Total Revenue', value: `₹${metrics?.totalRevenue?.toFixed(2) || 0}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Orders', value: metrics?.totalOrders || 0, icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Active Restaurants', value: metrics?.totalActiveRestaurants || 0, icon: UtensilsCrossed, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Registered Customers', value: metrics?.totalCustomers || 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Platform Dashboard</h1>
          <p className="text-xs text-textMuted mt-1">Real-time revenue & operational insights</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-2.5 rounded-xl bg-surface hover:bg-white/10 text-white border border-white/10 flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-surface border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-textMuted font-medium">{card.label}</span>
                <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-2xl font-bold font-display text-white">{card.value}</h2>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-surface border border-white/10 rounded-2xl p-6">
        <h3 className="text-base font-bold font-display text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-primary" /> Recent Orders Pipeline
        </h3>

        {metrics?.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-textSecondary">
              <thead className="bg-elevated text-textMuted uppercase font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Restaurant</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {metrics.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5">
                    <td className="p-3 font-mono font-semibold text-white">#{order._id.toString().substring(0, 8)}</td>
                    <td className="p-3 text-white font-medium">{order.userId?.name || 'Customer'}</td>
                    <td className="p-3">{order.restaurantId?.name || 'Restaurant'}</td>
                    <td className="p-3 font-bold text-white">₹{order.totalAmount}</td>
                    <td className="p-3 font-semibold uppercase text-red-primary">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-textMuted">No orders recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
