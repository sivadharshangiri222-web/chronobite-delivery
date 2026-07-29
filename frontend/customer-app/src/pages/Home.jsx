import React, { useEffect, useState } from 'react';
import { useLocation } from '../hooks/useLocation';
import api from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import EmptyState from '../components/EmptyState';
import SkeletonLoader from '../components/SkeletonLoader';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CUISINES = ['All', 'Italian', 'Pizza', 'Pasta', 'Indian', 'Chinese', 'Burgers', 'Desserts'];

const pageVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

export const Home = () => {
  const { location, detectLocation, setManualLocation } = useLocation();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const lat = location?.coordinates?.lat || 13.0827;
      const lng = location?.coordinates?.lng || 80.2707;

      let url = `/restaurants?lat=${lat}&lng=${lng}&radius=10`;
      if (selectedCuisine !== 'All') {
        url += `&cuisine=${selectedCuisine}`;
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

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
  }, [location, selectedCuisine, searchQuery]);

  const handleManualSearch = async (cityOrArea) => {
    try {
      const res = await api.get(`/location/search?query=${encodeURIComponent(cityOrArea)}`);
      if (res.data.data && res.data.data.length > 0) {
        const first = res.data.data[0];
        setManualLocation(first);
        setShowLocationModal(false);
      }
    } catch (err) {}
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen pb-24 max-w-7xl mx-auto px-4 pt-4"
    >
      {/* Banner / Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-[24px] overflow-hidden bg-gradient-to-r from-[#E87722] to-[#D06A18] p-6 md:p-8 shadow-[0_4px_20px_rgba(232,119,34,0.3)] mb-8 text-white"
      >
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Guaranteed Delivery Slots
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold font-display leading-tight">
            Delicious Food, Scheduled to Perfection.
          </h1>
          <p className="text-sm md:text-base text-white/90 mt-2 font-body">
            Freshly prepared meals delivered straight to your doorstep at your exact preferred slot.
          </p>

          {/* Location Banner Callouts */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 6px 24px rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.96 }}
              onClick={detectLocation}
              className="px-5 py-2.5 bg-white text-[#E87722] font-semibold text-xs rounded-full transition-all flex items-center gap-2 shadow-md"
            >
              <MapPin className="w-4 h-4 text-[#E87722]" />
              Detect My Location
            </motion.button>
            <button
              onClick={() => setShowLocationModal(true)}
              className="px-4 py-2.5 bg-black/30 hover:bg-black/40 border border-white/20 text-white font-medium text-xs rounded-full transition-all"
            >
              Change Location
            </button>
          </div>
        </div>
      </motion.div>

      {/* Location Status Bar */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-3.5 mb-6 text-xs text-[#9A9DA6]"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#E87722] shrink-0" />
          <span>
            Delivering to <strong className="text-[#F0F0F0]">{location?.area}, {location?.city}</strong>
          </span>
        </div>
        <button
          onClick={() => setShowLocationModal(true)}
          className="text-[#E87722] hover:underline font-semibold"
        >
          Change
        </button>
      </motion.div>

      {/* Search Input Bar */}
      <motion.div variants={itemVariants} className="relative mb-6">
        <Search
          className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${
            isSearchFocused ? 'text-[#E87722]' : 'text-[#55585F]'
          }`}
        />
        <input
          type="text"
          placeholder="Search restaurants, cuisines or dishes..."
          value={searchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1C1E22] border border-white/[0.07] focus:border-[rgba(232,119,34,0.5)] focus:shadow-[0_0_0_3px_rgba(232,119,34,0.12)] rounded-full h-12 pl-12 pr-4 text-sm text-[#F0F0F0] placeholder-[#55585F] focus:outline-none transition-all duration-200"
        />
      </motion.div>

      {/* Cuisine Categories (Horizontal Pill Selector) */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-lg font-bold font-display text-[#F0F0F0] mb-3 flex items-center justify-between">
          <span>Popular Cuisines</span>
          <span className="text-xs font-normal text-[#55585F]">Slide to explore</span>
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CUISINES.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCuisine === cuisine
                  ? 'bg-[#E87722] text-white font-semibold shadow-[0_4px_20px_rgba(232,119,34,0.3)] scale-105'
                  : 'bg-[#25282E] text-[#9A9DA6] hover:text-white border border-white/[0.05]'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Restaurants Section Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-[#F0F0F0]">
            Available Restaurants
          </h2>
          <p className="text-xs text-[#55585F]">Active kitchens ready for your delivery slot</p>
        </div>
      </motion.div>

      {/* Restaurant Grid / Loading / Empty States */}
      <motion.div variants={itemVariants}>
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
            type={
              location?.error === 'denied'
                ? 'location_not_set'
                : selectedCuisine !== 'All'
                ? 'no_filter_match'
                : 'no_active_restaurants'
            }
            message="No restaurants available right now. Check back later!"
            onAction={() => {
              if (selectedCuisine !== 'All') {
                setSelectedCuisine('All');
              } else {
                setShowLocationModal(true);
              }
            }}
          />
        )}
      </motion.div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[24px] p-6 w-full max-w-md animate-slide-up">
            <h3 className="text-lg font-bold font-display text-[#F0F0F0] mb-2">Select Your Location</h3>
            <p className="text-xs text-[#9A9DA6] mb-4">
              Enter your city or area to find available restaurants nearby.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleManualSearch(formData.get('city'));
              }}
              className="space-y-3"
            >
              <input
                type="text"
                name="city"
                placeholder="e.g. Chennai, Anna Nagar, Mumbai"
                required
                className="w-full bg-[#25282E] border border-white/[0.07] rounded-[12px] h-12 px-4 text-sm text-[#F0F0F0] focus:outline-none focus:border-[#E87722]"
              />

              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#9A9DA6] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E87722] hover:bg-[#D06A18] text-white text-xs font-semibold rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)]"
                >
                  Confirm Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Home;
