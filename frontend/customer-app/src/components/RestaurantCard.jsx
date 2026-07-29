import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';

export const RestaurantCard = ({ restaurant }) => {
  const {
    _id,
    name,
    description,
    cuisineType = [],
    image,
    address,
    rating = 4.5
  } = restaurant;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <Link
        to={`/restaurant/${_id}`}
        className="group bg-[#1C1E22] hover:bg-[#25282E] border border-white/[0.07] hover:border-[rgba(232,119,34,0.3)] rounded-[16px] overflow-hidden transition-all duration-200 hover:shadow-[0_4px_20px_rgba(232,119,34,0.1)] flex flex-col h-full"
      >
        {/* Hero Image */}
        <div className="relative h-44 w-full overflow-hidden bg-[#25282E]">
          <img
            src={image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E22] via-transparent to-transparent opacity-80" />

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-[rgba(232,119,34,0.12)] backdrop-blur-md px-2.5 py-1 rounded-full border border-[rgba(232,119,34,0.3)] flex items-center gap-1 text-xs font-semibold text-[#E87722]">
            <Star className="w-3.5 h-3.5 fill-[#E87722] text-[#E87722]" />
            <span>{rating}</span>
          </div>

          {/* Delivery Time Badge */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1 border border-white/10">
            <Clock className="w-3 h-3 text-[#E87722]" />
            <span>25-35 min</span>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-[#F0F0F0] group-hover:text-[#E87722] transition-colors line-clamp-1">
              {name}
            </h3>

            <div className="flex items-center gap-1 text-xs text-[#9A9DA6] mt-1">
              <MapPin className="w-3 h-3 text-[#55585F] shrink-0" />
              <span className="truncate">{address?.street || address?.city || 'Nearby'}</span>
            </div>

            <p className="text-xs text-[#55585F] mt-2 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Cuisine Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/[0.07]">
            {cuisineType.slice(0, 3).map((cuisine, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-[#25282E] text-[#9A9DA6] text-[11px] font-medium rounded-full border border-white/[0.05]"
              >
                {cuisine}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RestaurantCard;
