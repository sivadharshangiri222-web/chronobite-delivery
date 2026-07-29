import React from 'react';
import { motion } from 'framer-motion';
import QuantityStepper from './QuantityStepper';

export const FoodCard = ({ food, quantity = 0, onAdd, onDecrease, onIncrease }) => {
  const { name, description, price, image, isVeg, isAvailable } = food;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      className="bg-[#1C1E22] border border-white/[0.07] hover:border-[rgba(232,119,34,0.3)] rounded-[12px] p-3.5 flex gap-3.5 items-center transition-colors duration-200"
    >
      {/* Image */}
      <div className="relative w-24 h-24 rounded-[12px] overflow-hidden shrink-0 bg-[#25282E]">
        <img
          src={image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
          }}
        />
        {/* Veg/Non-Veg Badge */}
        <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-sm p-1 rounded border border-white/10">
          <span className={`block w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
        <div>
          <h4 className="text-sm font-semibold font-display text-[#F0F0F0] truncate">
            {name}
          </h4>
          <p className="text-xs text-[#55585F] line-clamp-2 mt-0.5 leading-tight">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.05]">
          <span className="text-sm font-bold text-[#F0F0F0] font-display">
            ₹{price}
          </span>

          {isAvailable ? (
            <QuantityStepper
              quantity={quantity}
              onAdd={onAdd}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
            />
          ) : (
            <span className="text-[11px] font-medium text-[#55585F] bg-[#25282E] px-2 py-1 rounded-full">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
