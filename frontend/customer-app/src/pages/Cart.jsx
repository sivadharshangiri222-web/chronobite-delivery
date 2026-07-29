import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import QuantityStepper from '../components/QuantityStepper';
import api from '../services/api';
import { Trash2, Clock, ArrowRight, ShoppingBag } from 'lucide-react';

export const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, clearCart, fetchCart } = useCartStore();
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [comment, setComment] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart.restaurantId) {
      const loadSlots = async () => {
        setLoadingSlots(true);
        try {
          const restId = cart.restaurantId._id || cart.restaurantId;
          const res = await api.get(`/slots?restaurantId=${restId}`);
          const fetchedSlots = res.data.data || [];
          setSlots(fetchedSlots);
          if (fetchedSlots.length > 0) {
            setSelectedSlotId(fetchedSlots[0]._id);
          }
        } catch (err) {
          setSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      };
      loadSlots();
    }
  }, [cart.restaurantId]);

  const items = cart.items || [];
  const totalAmount = cart.totalAmount || 0;
  const gst = totalAmount * 0.05;
  const grandTotal = totalAmount + gst;

  if (items.length === 0) {
    return (
      <div className="min-h-screen max-w-2xl mx-auto p-6 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-[#25282E] rounded-full flex items-center justify-center mb-4 border border-white/[0.07]">
          <ShoppingBag className="w-10 h-10 text-[#55585F]" />
        </div>
        <h2 className="text-xl font-bold font-display text-[#F0F0F0]">Your Cart is Empty</h2>
        <p className="text-xs text-[#9A9DA6] mt-1 mb-6">Explore our top restaurants and add delicious meals to your cart.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-[#E87722] hover:bg-[#D06A18] text-white text-xs font-semibold rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)] transition-all"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    if (!selectedSlotId) {
      alert('Please select a delivery slot to proceed.');
      return;
    }
    navigate('/checkout', {
      state: {
        selectedSlotId,
        comment
      }
    });
  };

  return (
    <div className="min-h-screen pb-32 max-w-3xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.07]">
        <h1 className="text-2xl font-bold font-display text-[#F0F0F0]">My Cart</h1>
        <button
          onClick={clearCart}
          className="text-xs text-[#E87722] hover:underline flex items-center gap-1 font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      {/* Item List */}
      <div className="space-y-3 mb-6">
        {items.map((item, idx) => {
          const foodId = item.foodId._id || item.foodId;
          return (
            <div
              key={idx}
              className="bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold font-display text-[#F0F0F0] truncate">
                  {item.name}
                </h4>
                <p className="text-xs text-[#9A9DA6] mt-0.5">
                  ₹{item.price} × {item.quantity} = <strong className="text-[#F0F0F0]">₹{item.price * item.quantity}</strong>
                </p>
              </div>

              <QuantityStepper
                quantity={item.quantity}
                onIncrease={() => updateQuantity(foodId, item.quantity + 1)}
                onDecrease={() => updateQuantity(foodId, item.quantity - 1)}
              />
            </div>
          );
        })}
      </div>

      {/* Select Delivery Slot */}
      <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-5 mb-6">
        <h3 className="text-sm font-bold font-display text-[#F0F0F0] mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#E87722]" /> Select Delivery Time Slot
        </h3>

        {loadingSlots ? (
          <div className="h-10 bg-[#25282E] rounded-lg animate-pulse" />
        ) : slots.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {slots.map((slot) => (
              <button
                key={slot._id}
                onClick={() => setSelectedSlotId(slot._id)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex flex-col items-center ${
                  selectedSlotId === slot._id
                    ? 'border-[#E87722] bg-[rgba(232,119,34,0.12)] text-white shadow-[0_4px_20px_rgba(232,119,34,0.3)]'
                    : 'border-white/[0.07] bg-[#25282E] text-[#9A9DA6] hover:text-white'
                }`}
              >
                <span>{slot.date}</span>
                <span className="text-[11px] text-[#E87722] font-bold">{slot.startTime} - {slot.endTime}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#55585F]">No delivery slots available for this restaurant today.</p>
        )}
      </div>

      {/* Special Cooking Comment */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Your comment (e.g. Extra spicy, no cutlery)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-[#25282E] border border-white/[0.07] rounded-[12px] h-12 px-4 text-sm text-[#F0F0F0] placeholder-[#55585F] focus:outline-none focus:border-[#E87722]"
        />
      </div>

      {/* Order Bill Summary */}
      <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-5 space-y-2 text-xs mb-8">
        <div className="flex justify-between text-[#9A9DA6]">
          <span>Items Subtotal</span>
          <span className="text-[#F0F0F0] font-medium">₹{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[#9A9DA6]">
          <span>GST Taxes (5%)</span>
          <span className="text-[#F0F0F0] font-medium">₹{gst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[#9A9DA6]">
          <span>Delivery Fee</span>
          <span className="text-emerald-400 font-semibold">FREE</span>
        </div>
        <div className="border-t border-white/[0.07] pt-3 flex justify-between text-sm font-bold text-[#F0F0F0]">
          <span>To Pay</span>
          <span className="text-[#E87722] font-display text-base">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Fixed Checkout CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleProceedToCheckout}
        disabled={!selectedSlotId}
        className="w-full h-14 bg-[#E87722] hover:bg-[#D06A18] disabled:bg-slate-700 text-white font-bold font-display text-base rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)] flex items-center justify-center gap-2 transition-all"
      >
        <span>Check Order & Checkout</span>
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default Cart;
