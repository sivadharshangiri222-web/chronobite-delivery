import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

export const QuantityStepper = ({ quantity = 0, onAdd, onDecrease, onIncrease }) => {
  if (quantity === 0) {
    return (
      <motion.button
        onClick={onAdd}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-1.5 bg-[rgba(232,119,34,0.12)] hover:bg-[#E87722] border border-[rgba(232,119,34,0.4)] hover:border-[#E87722] text-[#E87722] hover:text-white text-xs font-semibold rounded-full transition-colors duration-200 shadow-sm"
      >
        ADD +
      </motion.button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-[#25282E] border border-white/[0.07] rounded-full px-2 py-1">
      <motion.button
        onClick={onDecrease}
        whileTap={{ scale: 0.85 }}
        className="w-6 h-6 rounded-full bg-[#1C1E22] hover:bg-[rgba(232,119,34,0.2)] flex items-center justify-center text-white transition-colors"
      >
        <Minus className="w-3 h-3 text-[#E87722]" />
      </motion.button>
      <span className="text-xs font-bold text-white px-1 min-w-[16px] text-center">
        {quantity}
      </span>
      <motion.button
        onClick={onIncrease}
        whileTap={{ scale: 0.85 }}
        className="w-6 h-6 rounded-full bg-[#E87722] hover:bg-[#D06A18] flex items-center justify-center text-white transition-colors"
      >
        <Plus className="w-3 h-3 text-white" />
      </motion.button>
    </div>
  );
};

export default QuantityStepper;
