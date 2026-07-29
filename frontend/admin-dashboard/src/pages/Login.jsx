import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { Lock, Mail, ShieldAlert, ArrowRight, Eye, EyeOff, Sparkles, Zap } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const { login, isLoading } = useAdminAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Admin authentication failed');
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@chronobite.com');
    setPassword('admin123password');
    setErrorMsg(null);
    try {
      await login('admin@chronobite.com', 'admin123password');
      navigate('/');
    } catch (err) {
      setErrorMsg('Demo login failed. Make sure backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-[#111214] flex items-center justify-center p-4 selection:bg-[#E87722] selection:text-white">
      <motion.div
        className="max-w-[430px] w-full bg-[#1C1E22] border border-white/[0.07] rounded-[24px] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {/* Subtly Glowing Orange Background Accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E87722]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Branding Header */}
        <div className="text-center mb-8">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-[#E87722] flex items-center justify-center font-display font-extrabold text-white text-3xl mx-auto mb-4 shadow-[0_4px_20px_rgba(232,119,34,0.35)]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: 'backOut' }}
          >
            C
          </motion.div>
          <h1 className="text-2xl font-bold font-display text-[#F0F0F0] tracking-tight">
            Chrono<span className="text-[#E87722]">Bite</span> Admin Portal
          </h1>
          <p className="text-xs text-[#9A9DA6] mt-1 font-body">
            Authorized restaurant managers & system administrators
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-[#E8192C]/15 border border-[#E8192C]/30 text-[#F0F0F0] p-3.5 rounded-xl text-xs mb-6 flex items-center gap-2.5"
            >
              <ShieldAlert className="w-4 h-4 text-[#E8192C] shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#9A9DA6] block mb-1.5 font-body">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#55585F] pointer-events-none" />
              <input
                type="email"
                required
                placeholder="admin@chronobite.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#25282E] border border-white/[0.07] rounded-[12px] h-12 pl-11 pr-4 text-sm text-[#F0F0F0] placeholder-[#55585F] focus:outline-none focus:border-[#E87722] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#9A9DA6] block mb-1.5 font-body">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#55585F] pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#25282E] border border-white/[0.07] rounded-[12px] h-12 pl-11 pr-11 text-sm text-[#F0F0F0] placeholder-[#55585F] focus:outline-none focus:border-[#E87722] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#55585F] hover:text-[#F0F0F0] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Log In CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 6px 24px rgba(232,119,34,0.45)' }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#E87722] hover:bg-[#D06A18] disabled:bg-slate-700 text-white font-bold font-display text-sm rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)] flex items-center justify-center gap-2 transition-all mt-6"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Log In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Quick Demo Login CTA */}
        <div className="mt-5 pt-4 border-t border-white/[0.05] flex flex-col gap-3 items-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleQuickDemoLogin}
            type="button"
            className="w-full py-2.5 bg-[#25282E] hover:bg-[rgba(232,119,34,0.12)] border border-[rgba(232,119,34,0.3)] text-[#E87722] font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-[#E87722]" /> ⚡ Quick Demo Login (Admin)
          </motion.button>

          <p className="text-[11px] text-[#9A9DA6] text-center font-body">
            Default credentials: <strong className="text-white">admin@chronobite.com</strong> / <strong className="text-white">admin123password</strong>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
