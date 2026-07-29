import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import ChronoBiteLogo from '../components/ChronoBiteLogo';
import { useAuthStore } from '../store/authStore';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      await register({ name, email, phone, password });
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#111214] flex items-center justify-center p-4 selection:bg-[#E87722] selection:text-white">
      <div className="w-full max-w-[430px] mx-auto py-8 px-4 flex flex-col justify-center">
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
        >
          <ChronoBiteLogo animated={false} width={120} />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="font-display text-[28px] font-bold text-[#F0F0F0] text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
        >
          Create Account
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-body text-sm text-[#9A9DA6] text-center mt-1 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
        >
          Join ChronoBite for scheduled delivery slots
        </motion.p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' }}
          >
            <div className="relative flex items-center">
              <User className="absolute left-4 w-[18px] h-[18px] text-[#55585F] pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[52px] bg-[#1C1E22] border border-white/[0.07] rounded-[12px] pl-[48px] pr-4 text-[15px] font-body text-[#F0F0F0] placeholder-[#55585F] focus:outline-none focus:border-[#E87722] transition-colors duration-200"
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
          >
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-[18px] h-[18px] text-[#55585F] pointer-events-none" />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[52px] bg-[#1C1E22] border border-white/[0.07] rounded-[12px] pl-[48px] pr-4 text-[15px] font-body text-[#F0F0F0] placeholder-[#55585F] focus:outline-none focus:border-[#E87722] transition-colors duration-200"
              />
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4, ease: 'easeOut' }}
          >
            <div className="relative flex items-center">
              <Phone className="absolute left-4 w-[18px] h-[18px] text-[#55585F] pointer-events-none" />
              <input
                type="tel"
                required
                placeholder="Phone number (10 digits)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-[52px] bg-[#1C1E22] border border-white/[0.07] rounded-[12px] pl-[48px] pr-4 text-[15px] font-body text-[#F0F0F0] placeholder-[#55585F] focus:outline-none focus:border-[#E87722] transition-colors duration-200"
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
          >
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-[18px] h-[18px] text-[#55585F] pointer-events-none" />
              <input
                type="password"
                required
                placeholder="Create Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[52px] bg-[#1C1E22] border border-white/[0.07] rounded-[12px] pl-[48px] pr-4 text-[15px] font-body text-[#F0F0F0] placeholder-[#55585F] focus:outline-none focus:border-[#E87722] transition-colors duration-200"
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] bg-[#E87722] hover:bg-[#D06A18] active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none text-white font-display font-semibold text-[16px] rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)] hover:shadow-[0_6px_24px_rgba(232,119,34,0.5)] transition-all duration-200 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>

          {/* Inline Error */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center justify-center gap-1.5 text-[13px] font-body text-[#E8192C] mt-2 text-center"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Footer Link */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <p className="text-xs font-body text-[#9A9DA6]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#E87722] hover:underline ml-1"
            >
              Sign In →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
