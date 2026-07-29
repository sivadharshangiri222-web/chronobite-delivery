import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { ArrowLeft, Download, CheckCircle, XCircle, Star } from 'lucide-react';


export const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canCancel, setCanCancel] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancellationNotice, setCancellationNotice] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      const fetchedOrder = res.data.data;
      setOrder(fetchedOrder);

      if (fetchedOrder && fetchedOrder.status === 'confirmed') {
        const slot = fetchedOrder.deliverySlotId;
        if (slot && slot.date && slot.startTime) {
          const slotDateTime = new Date(`${slot.date}T${slot.startTime}:00`);
          const now = new Date();
          const diffMins = (slotDateTime.getTime() - now.getTime()) / (1000 * 60);
          setCanCancel(diffMins >= 30);
        } else {
          setCanCancel(true);
        }
      } else {
        setCanCancel(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? 100% refund will be processed.')) return;

    setCancelLoading(true);
    try {
      const res = await api.post(`/orders/${id}/cancel`);
      setCancellationNotice(
        `Order cancelled. ₹${order.totalAmount} will be refunded to your original payment method within 5–7 business days.`
      );
      fetchOrderDetails();
    } catch (err) {
      alert(err.message || 'Could not cancel order.');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <div className="h-40 bg-[#1C1E22] rounded-[16px] skeleton-shimmer" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-[#F0F0F0] font-display">Order not found</h2>
        <Link to="/orders" className="text-[#E87722] text-sm mt-2 inline-block font-semibold">Back to orders</Link>
      </div>
    );
  }

  const pipeline = [
    { key: 'confirmed', label: 'Order Confirmed' },
    { key: 'preparing', label: 'Kitchen Preparing' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const currentIdx = pipeline.findIndex((p) => p.key === order.status);

  return (
    <div className="min-h-screen pb-32 max-w-2xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-[#1C1E22] border border-white/10 flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-display text-[#F0F0F0]">Order Tracking</h1>
          <p className="text-xs text-[#55585F]">#{order._id.toString().substring(0, 10)}</p>
        </div>
      </div>

      {/* Cancellation Notice Banner */}
      {cancellationNotice && (
        <div className="bg-red-500/15 border border-red-500/30 text-white p-4 rounded-[16px] text-xs mb-6 animate-slide-up">
          <p className="font-bold text-red-500 mb-1">Order Cancelled</p>
          <p>{cancellationNotice}</p>
        </div>
      )}

      {/* Status Timeline */}
      {order.status !== 'cancelled' ? (
        <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-6 mb-6">
          <h3 className="text-sm font-bold font-display text-[#F0F0F0] mb-6">Delivery Pipeline Status</h3>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            {pipeline.map((step, idx) => {
              const isPassed = currentIdx >= idx;
              const isCurrent = currentIdx === idx;
              return (
                <div key={step.key} className="relative flex items-center gap-4">
                  <div
                    className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                      isPassed
                        ? 'bg-[#E87722] border-[#E87722] text-white shadow-[0_2px_10px_rgba(232,119,34,0.3)]'
                        : 'bg-[#111214] border-white/20 text-transparent'
                    }`}
                  >
                    {isPassed && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isPassed ? 'text-[#F0F0F0]' : 'text-[#55585F]'}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] text-[#E87722] font-bold animate-pulse">In Progress...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-red-500/10 border border-red-500/30 rounded-[16px] p-6 text-center mb-6">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white font-display">This Order Has Been Cancelled</h3>
          <p className="text-xs text-[#9A9DA6] mt-1">Full refund initiated to original payment method.</p>
        </div>
      )}

      {/* Order Info & Delivery Slot */}
      <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-5 mb-6 text-xs space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-white/[0.05]">
          <span className="text-[#55585F]">Restaurant</span>
          <span className="text-[#F0F0F0] font-bold">{order.restaurantId?.name}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-white/[0.05]">
          <span className="text-[#55585F]">Delivery Slot</span>
          <span className="text-[#E87722] font-bold">
            {order.deliverySlotId?.date} ({order.deliverySlotId?.startTime} - {order.deliverySlotId?.endTime})
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#55585F]">Address</span>
          <span className="text-[#F0F0F0]">{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</span>
        </div>
      </div>

      {/* Download Invoice & Cancel Order Actions */}
      <div className="space-y-3">
        {order.paymentId && (
          <a
            href={`/api/payments/${order.paymentId._id || order.paymentId}/invoice`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 bg-[#25282E] hover:bg-white/10 text-white font-semibold text-xs rounded-full border border-white/10 flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-[#E87722]" /> Download PDF Tax Invoice
          </a>
        )}

        {/* Leave Review Section when Delivered */}
        {order.status === 'delivered' && (
          <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-5 space-y-3">
            <h4 className="text-sm font-bold font-display text-[#F0F0F0]">Rate Your Experience</h4>
            <p className="text-xs text-[#9A9DA6]">How was your food from {order.restaurantId?.name}?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => alert(`Thank you for rating ${star} stars!`)}
                  className="p-2 rounded-lg bg-[#25282E] hover:bg-[#E87722]/20 text-[#E87722] transition-colors"
                >
                  <Star className="w-5 h-5 fill-[#E87722]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {canCancel && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelLoading}
            className="w-full py-3.5 bg-red-500/10 hover:bg-red-500 border border-red-500/40 text-red-400 hover:text-white font-semibold text-xs rounded-full transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {cancelLoading ? 'Cancelling...' : 'Cancel Order (100% Refund)'}
          </button>
        )}
      </div>

    </div>
  );
};

export default OrderTracking;
