import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChronoBiteLogo from '../components/ChronoBiteLogo';

export const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0D0D] flex flex-col items-center justify-center overflow-hidden">
      {/* Top-Right Skip Link */}
      <button
        onClick={() => navigate('/login')}
        className="absolute top-6 right-6 text-xs font-body font-semibold text-[#A0A0A0] hover:text-white px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10"
      >
        Skip →
      </button>

      {/* Container with fade-out animation at 2.5s */}
      <motion.div
        className="flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: [1, 1, 0], scale: [1, 1, 0.92] }}
        transition={{
          duration: 3.0,
          times: [0, 0.833, 1],
          ease: 'easeInOut'
        }}
      >

        {/* Animated ChronoBite SVG Logo */}
        <ChronoBiteLogo animated={true} width={260} />

        {/* Tagline: "Order on time. Every time." */}
        <motion.p
          className="font-body text-sm font-medium tracking-[0.08em] text-[#A0A0A0] mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5, ease: 'easeOut' }}
        >
          Order on time. Every time.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
