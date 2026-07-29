import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, User } from 'lucide-react';
import { useLocationStore } from '../store/locationStore';
import { useAuthStore } from '../store/authStore';

export const Navbar = ({ onOpenLocationModal }) => {
  const navigate = useNavigate();
  const { location } = useLocationStore();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-[#1C1E22]/90 backdrop-blur-[12px] border-b border-white/[0.07] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Branding & Location */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Link to="/home" className="flex items-center gap-2">

              <span className="w-8 h-8 rounded-lg bg-[#E87722] flex items-center justify-center font-display font-extrabold text-white text-lg shadow-[0_2px_10px_rgba(232,119,34,0.3)]">
                C
              </span>
              <span className="font-display font-bold text-xl tracking-tight text-white hidden sm:inline">
                Chrono<span className="text-[#E87722]">Bite</span>
              </span>
            </Link>
          </motion.div>

          {/* Location Selector Pill */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#25282E] hover:bg-[#2E3138] rounded-full border border-white/[0.07] text-xs transition-all max-w-[200px] truncate group"
            >
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <MapPin className="w-3.5 h-3.5 text-[#E87722] shrink-0" />
              </motion.div>
              <span className="text-[#F0F0F0] font-medium truncate">
                {location ? `${location.area}, ${location.city}` : 'Select Location'}
              </span>
            </button>
          </motion.div>
        </div>

        {/* Right: Search & Profile */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Link
            to="/restaurants"
            className="p-2.5 rounded-full bg-[#25282E] hover:bg-[#2E3138] text-[#9A9DA6] hover:text-[#E87722] transition-colors"
            title="Search Restaurants"
          >
            <Search className="w-4 h-4" />
          </Link>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-[#25282E] hover:bg-[#2E3138] border border-white/[0.07] transition-all text-xs"
            >
              <span className="text-[#F0F0F0] font-medium max-w-[80px] truncate hidden md:inline">
                {user?.name?.split(' ')[0]}
              </span>
              <div className="w-7 h-7 rounded-full bg-[#E87722] flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </Link>
          ) : (
            <motion.div
              whileHover={{ scale: 1.04, boxShadow: '0 6px 24px rgba(232,119,34,0.4)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                to="/login"
                className="px-5 py-2 bg-[#E87722] hover:bg-[#D06A18] text-white font-display font-semibold text-sm rounded-full shadow-[0_2px_10px_rgba(232,119,34,0.2)] transition-colors inline-block"
              >
                Login
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </header>
  );
};

export default Navbar;
