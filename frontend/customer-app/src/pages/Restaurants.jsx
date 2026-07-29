import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import EmptyState from '../components/EmptyState';
import SkeletonLoader from '../components/SkeletonLoader';
import { Search, Filter } from 'lucide-react';

export const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState(10);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      let url = `/restaurants?radius=${radius}`;
      if (query) url += `&search=${encodeURIComponent(query)}`;

      const res = await api.get(url);
      setRestaurants(res.data.data || []);
    } catch (err) {
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [query, radius]);

  return (
    <div className="min-h-screen pb-24 max-w-7xl mx-auto px-4 pt-4">
      {/* Page Heading */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
      >
        <h1 className="text-[28px] font-bold font-display text-[#F0F0F0]">Search Restaurants</h1>
        <p className="text-sm font-body text-[#9A9DA6] mt-1">Discover kitchens delivering near your current radius.</p>
      </motion.div>

      {/* Controls: Search Bar + Radius Dropdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          className="relative md:col-span-3"
          initial={{ opacity: 0, y: 14, scaleX: 0.97 }}
          animate={{ opacity: 1, y: 0, scaleX: 1 }}
          transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
        >
          <Search
            className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${
              isSearchFocused ? 'text-[#E87722]' : 'text-[#55585F]'
            }`}
          />
          <input
            type="text"
            placeholder="Search by restaurant name or cuisine..."
            value={query}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#1C1E22] border border-white/[0.07] focus:border-[rgba(232,119,34,0.5)] focus:shadow-[0_0_0_3px_rgba(232,119,34,0.12)] rounded-full h-12 pl-12 pr-4 text-sm text-[#F0F0F0] placeholder-[#55585F] focus:outline-none transition-all duration-200"
          />
        </motion.div>

        {/* Radius Filter Dropdown */}
        <motion.div
          className="flex items-center gap-2 bg-[#1C1E22] border border-white/[0.07] focus-within:border-[rgba(232,119,34,0.5)] rounded-full px-4 h-12 text-xs text-[#9A9DA6]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Filter className="w-4 h-4 text-[#E87722]" />
          <span>Radius:</span>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="bg-transparent text-[#F0F0F0] font-semibold focus:outline-none cursor-pointer"
          >
            <option value={5} className="bg-[#1C1E22]">5 km</option>
            <option value={10} className="bg-[#1C1E22]">10 km</option>
            <option value={20} className="bg-[#1C1E22]">20 km</option>
          </select>
        </motion.div>
      </div>

      {/* Grid / Skeletons / Empty State */}
      {loading ? (
        <SkeletonLoader count={4} type="card" />
      ) : restaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <EmptyState
          type={query ? 'no_filter_match' : 'outside_radius'}
          onAction={() => {
            setQuery('');
            setRadius(20);
          }}
        />
      )}
    </div>
  );
};

export default Restaurants;
