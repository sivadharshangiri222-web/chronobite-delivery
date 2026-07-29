import React, { useState } from 'react';
import { useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useLocationStore } from '../store/locationStore';
import api from '../services/api';
import { ShieldCheck, CreditCard, MapPin, AlertCircle } from 'lucide-react';

export const Checkout = () => {
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const { cart, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { location } = useLocationStore();

  const selectedSlotId = routerLocation.state?.selectedSlotId;
  const comment = routerLocation.state?.comment;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showRetryModal, setShowRetryModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  const items = cart.items || [];
  const totalAmount = cart.totalAmount || 0;
  const grandTotal = totalAmount * 1.05;

  const deliveryAddress = {
    street: location?.area || '12th Main Road',
    city: location?.city || 'Chennai',
    pincode: location?.pincode || '600040'
  };

  const handleInitiatePayment = async () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/cart' } });
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.post('/orders/initiate', {
        restaurantId: cart.restaurantId._id || cart.restaurantId,
        items: items.map((i) => ({
          foodId: i.foodId._id || i.foodId,
          name: i.name,
          quantity: i.quantity,
          price: i.price
        })),
        totalAmount: grandTotal,
        deliveryAddress,
        deliverySlotId: selectedSlotId
      });

      const { orderId, razorpayOrderId, amountInPaise, currency } = res.data.data;
      setCreatedOrderId(orderId);

      const options = {
        key: 'rzp_test_chronobite123',
        amount: amountInPaise,
        currency: currency || 'INR',
        name: 'ChronoBite Food Delivery',
        description: `Payment for Order #${orderId.toString().substring(0, 8)}`,
        order_id: razorpayOrderId,
        prefill: {
          name: user?.name || 'Customer',
          email: user?.email || 'customer@chronobite.com',
          contact: user?.phone || '9876543210'
        },
        theme: {
          color: '#E87722'
        },
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            await clearCart();
            navigate('/order-confirmation', {
              state: {
                orderId: verifyRes.data.data.orderId,
                status: 'confirmed'
              }
            });
          } catch (verifyErr) {
            setErrorMsg('Payment verification failed. Please try retrying.');
            setShowRetryModal(true);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: async () => {
            await api.post('/payments/failed', { orderId, reason: 'User closed payment window' });
            setErrorMsg('Payment was not completed. You can retry payment below.');
            setShowRetryModal(true);
            setLoading(false);
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const mockPaymentId = `pay_mock_${Date.now()}`;
        const mockSignature = `sig_mock_${Date.now()}`;

        const verifyRes = await api.post('/payments/verify', {
          orderId,
          razorpayOrderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: mockSignature
        });

        await clearCart();
        navigate('/order-confirmation', {
          state: {
            orderId: verifyRes.data.data.orderId,
            status: 'confirmed'
          }
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not initiate order. Please try again.');
      setLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!createdOrderId) return;
    setLoading(true);
    setShowRetryModal(false);

    try {
      const res = await api.get(`/payments/retry/${createdOrderId}`);
      const { razorpayOrderId } = res.data.data;

      const verifyRes = await api.post('/payments/verify', {
        orderId: createdOrderId,
        razorpayOrderId,
        razorpayPaymentId: `pay_retry_${Date.now()}`,
        razorpaySignature: `sig_retry_${Date.now()}`
      });

      await clearCart();
      navigate('/order-confirmation', {
        state: { orderId: createdOrderId, status: 'confirmed' }
      });
    } catch (err) {
      setErrorMsg(err.message || 'Retry failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 max-w-2xl mx-auto px-4 pt-4">
      <h1 className="text-2xl font-bold font-display text-[#F0F0F0] mb-6">Checkout</h1>

      {errorMsg && (
        <div className="bg-red-500/15 border border-red-500/30 text-red-200 p-4 rounded-xl text-xs mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="font-semibold">{errorMsg}</p>
            {showRetryModal && (
              <button
                onClick={handleRetryPayment}
                className="mt-2 px-4 py-1.5 bg-[#E87722] text-white font-bold rounded-full text-xs shadow-md"
              >
                Retry Payment Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delivery Info */}
      <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-5 mb-4">
        <h3 className="text-sm font-bold font-display text-[#F0F0F0] mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#E87722]" /> Delivery Address
        </h3>
        <p className="text-xs text-[#F0F0F0] font-medium">{deliveryAddress.street}</p>
        <p className="text-xs text-[#9A9DA6]">{deliveryAddress.city} - {deliveryAddress.pincode}</p>
      </div>

      {/* Payment Options */}
      <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-5 mb-6">
        <h3 className="text-sm font-bold font-display text-[#F0F0F0] mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#E87722]" /> Payment Options
        </h3>
        <div className="p-3 bg-[rgba(232,119,34,0.12)] border border-[rgba(232,119,34,0.3)] rounded-xl flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E87722]" />
            <span className="font-semibold">Razorpay Secure Online Checkout</span>
          </div>
          <span className="text-[10px] bg-[#E87722] px-2 py-0.5 rounded text-white font-bold">UPI / Card / Netbanking</span>
        </div>
        <p className="text-[11px] text-[#55585F] mt-2">
          * Note: Online payment is mandatory before slot confirmation. Cash on Delivery is disabled.
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-5 mb-8">
        <h3 className="text-sm font-bold font-display text-[#F0F0F0] mb-3">Order Items ({items.length})</h3>
        <div className="space-y-2 text-xs">
          {items.map((i, idx) => (
            <div key={idx} className="flex justify-between text-[#9A9DA6]">
              <span>{i.name} × {i.quantity}</span>
              <span className="text-[#F0F0F0] font-medium">₹{i.price * i.quantity}</span>
            </div>
          ))}
          <div className="border-t border-white/[0.07] pt-3 flex justify-between text-sm font-bold text-[#F0F0F0]">
            <span>Total Payable</span>
            <span className="text-[#E87722] font-display text-base">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleInitiatePayment}
        disabled={loading}
        className="w-full h-14 bg-[#E87722] hover:bg-[#D06A18] disabled:bg-slate-700 text-white font-bold font-display text-base rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)] flex items-center justify-center gap-2 transition-all"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing Payment...
          </span>
        ) : (
          `Pay ₹${grandTotal.toFixed(2)} & Place Order`
        )}
      </motion.button>
    </div>
  );
};

export default Checkout;
