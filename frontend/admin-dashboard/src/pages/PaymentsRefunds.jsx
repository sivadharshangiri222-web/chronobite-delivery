import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CreditCard, RefreshCw, CheckCircle } from 'lucide-react';

export const PaymentsRefunds = () => {
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payments');

  const fetchData = async () => {
    setLoading(true);
    try {
      const payRes = await api.get('/payments/admin/all');
      setPayments(payRes.data.data || []);

      const refRes = await api.get('/refunds/admin/all');
      setRefunds(refRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveRefund = async (id) => {
    try {
      await api.post(`/refunds/admin/${id}/approve`);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Payments & Refunds Audit</h1>
          <p className="text-xs text-textMuted mt-1">Razorpay transactions and refund processing ledger.</p>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2 bg-surface hover:bg-white/10 border border-white/10 text-white font-semibold rounded-full text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-4">
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'payments' ? 'border-red-primary text-red-primary' : 'border-transparent text-textMuted'
          }`}
        >
          Transactions ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('refunds')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'refunds' ? 'border-red-primary text-red-primary' : 'border-transparent text-textMuted'
          }`}
        >
          Refund Requests ({refunds.length})
        </button>
      </div>

      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-textMuted">Loading ledger data...</div>
        ) : activeTab === 'payments' ? (
          <table className="w-full text-left text-xs text-textSecondary">
            <thead className="bg-elevated text-textMuted uppercase font-bold border-b border-white/5">
              <tr>
                <th className="p-4">Razorpay Order ID</th>
                <th className="p-4">Payment ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-white/5">
                  <td className="p-4 font-mono">{p.razorpayOrderId}</td>
                  <td className="p-4 font-mono font-semibold text-white">{p.razorpayPaymentId || 'N/A'}</td>
                  <td className="p-4 text-white font-medium">{p.userId?.name} ({p.userId?.email})</td>
                  <td className="p-4 font-bold text-white">₹{(p.amount / 100).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      p.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-textMuted">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-xs text-textSecondary">
            <thead className="bg-elevated text-textMuted uppercase font-bold border-b border-white/5">
              <tr>
                <th className="p-4">Refund ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {refunds.map((r) => (
                <tr key={r._id} className="hover:bg-white/5">
                  <td className="p-4 font-mono text-white">#{r._id.toString().substring(0, 8)}</td>
                  <td className="p-4 text-white font-medium">{r.userId?.name} ({r.userId?.email})</td>
                  <td className="p-4 font-bold text-white">₹{r.amount}</td>
                  <td className="p-4 font-medium text-amber-400">{r.reason.replace('_', ' ')}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      r.status === 'processed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {r.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {r.status !== 'processed' ? (
                      <button
                        onClick={() => handleApproveRefund(r._id)}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full text-[11px] flex items-center gap-1 ml-auto"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Process Refund
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-semibold">Completed</span>
                    )}
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

export default PaymentsRefunds;
