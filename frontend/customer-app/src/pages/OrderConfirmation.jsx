import React from 'react';
import { useLocation as useRouterLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, FileText } from 'lucide-react';

export const OrderConfirmation = () => {
  const routerLocation = useRouterLocation();
  const orderId = routerLocation.state?.orderId || 'NEW_ORDER';

  return (
    <div className="min-h-screen bg-[#111214] flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full text-center space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated Green Success Circle Icon */}
        <div className="w-24 h-24 bg-emerald-500/15 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-pulse" />
        </div>

        <div>
          <h1 className="text-2xl font-bold font-display text-[#F0F0F0]">Booking Confirmed!</h1>
          <p className="text-sm text-[#9A9DA6] mt-1">Thank you for your order with ChronoBite.</p>
        </div>

        {/* Order Card */}
        <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-5 text-left text-xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/[0.05]">
            <span className="text-[#55585F]">Order ID</span>
            <span className="text-[#F0F0F0] font-mono font-bold">#{orderId.toString().substring(0, 10)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-white/[0.05]">
            <span className="text-[#55585F]">Status</span>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-semibold rounded-full">CONFIRMED</span>
          </div>
          <p className="text-[#9A9DA6] leading-relaxed pt-1">
            Your kitchen has received your order and delivery slot has been locked.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/order-tracking/${orderId}`}
            className="flex-1 py-3.5 px-4 bg-transparent border border-white/20 hover:border-white text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4" /> Check Order Status
          </Link>
          <Link
            to="/"
            className="flex-1 py-3.5 px-4 bg-[#E87722] hover:bg-[#D06A18] text-white font-semibold text-xs rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)] flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;
