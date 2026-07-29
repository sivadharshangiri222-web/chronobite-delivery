import React from 'react';
import { motion } from 'framer-motion';
import { MapPinOff, SearchX, UtensilsCrossed, AlertCircle, RefreshCw, MapPin } from 'lucide-react';

export const EmptyState = ({
  type = 'location_not_set',
  message,
  actionLabel,
  onAction
}) => {
  const getIcon = () => {
    switch (type) {
      case 'location_not_set':
        return <MapPinOff className="w-12 h-12 text-[#E87722]" />;
      case 'no_restaurants_db':
      case 'no_active_restaurants':
        return <UtensilsCrossed className="w-12 h-12 text-[#E87722]" />;
      case 'outside_radius':
        return <MapPinOff className="w-12 h-12 text-[#E87722]" />;
      case 'no_filter_match':
        return <SearchX className="w-12 h-12 text-[#E87722]" />;
      default:
        return <AlertCircle className="w-12 h-12 text-[#E87722]" />;
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'location_not_set':
        return 'Set your location to find restaurants near you';
      case 'no_restaurants_db':
        return "We're not in your area yet. Check back soon!";
      case 'no_active_restaurants':
        return 'No restaurants available right now. Check back later.';
      case 'outside_radius':
        return 'No restaurants found nearby. Try expanding your search area.';
      case 'no_filter_match':
        return 'No restaurants match your filters. Try removing some filters.';
      default:
        return 'No results found.';
    }
  };

  const getDefaultActionLabel = () => {
    switch (type) {
      case 'location_not_set':
      case 'outside_radius':
        return 'Change location';
      case 'no_filter_match':
        return 'Remove filters';
      case 'no_active_restaurants':
      case 'no_restaurants_db':
        return 'Notify me when available';
      default:
        return 'Refresh';
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 text-center bg-[#1C1E22] border border-white/[0.07] rounded-[16px] my-6"
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35, duration: 0.55, ease: 'easeOut' }}
    >
      {/* Icon Circle */}
      <motion.div
        className="w-20 h-20 rounded-full bg-[rgba(232,119,34,0.12)] flex items-center justify-center mb-5 border border-[rgba(232,119,34,0.25)] shadow-inner"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: 1,
          scale: [1, 1.06, 1]
        }}
        transition={{
          opacity: { delay: 0.55, duration: 0.4 },
          scale: { delay: 0.9, duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        {getIcon()}
      </motion.div>

      {/* Heading */}
      <motion.h3
        className="text-[18px] font-bold font-display text-[#F0F0F0] mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {message || getDefaultMessage()}
      </motion.h3>

      {/* Subtext */}
      <motion.p
        className="text-sm font-body text-[#9A9DA6] mb-6 max-w-sm"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        Explore options nearby or change your location parameters to continue.
      </motion.p>

      {/* Action Button */}
      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <motion.button
            onClick={onAction}
            whileHover={{ scale: 1.04, boxShadow: '0 6px 28px rgba(232,119,34,0.45)' }}
            whileTap={{ scale: 0.96 }}
            className="px-[28px] py-[12px] bg-[#E87722] hover:bg-[#D06A18] text-white font-display font-semibold text-[15px] rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)] transition-colors flex items-center gap-2 group"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <RefreshCw className="w-4 h-4 text-white" />
            </motion.div>
            <span>{actionLabel || getDefaultActionLabel()}</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
