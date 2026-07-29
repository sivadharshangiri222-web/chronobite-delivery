import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { ArrowRight, Lock, Mail, User, Phone } from 'lucide-react';
import ChronoBiteLogo from '../components/ChronoBiteLogo';

export const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const { login, register, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#111214] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-[#1C1E22] border border-white/[0.07] rounded-[24px] p-6 sm:p-8 shadow-2xl"
      >
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <ChronoBiteLogo animated={false} width={120} />
          </div>
          <h1 className="text-2xl font-bold font-display text-[#F0F0F0]">
            {isRegister ? 'Create ChronoBite Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-[#9A9DA6] mt-1">
            {isRegister ? 'Join for timed food delivery slots' : 'Sign in to manage your orders'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-200 p-3 rounded-xl text-xs mb-6 text-center font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="text-xs font-semibold text-[#9A9DA6] block mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#55585F]" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Johnson"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#25282E] border border-white/[0.07] rounded-[12px] h-11 pl-10 pr-4 text-sm text-[#F0F0F0] focus:outline-none focus:border-[#E87722]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#9A9DA6] block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#55585F]" />
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#25282E] border border-white/[0.07] rounded-[12px] h-11 pl-10 pr-4 text-sm text-[#F0F0F0] focus:outline-none focus:border-[#E87722]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-[#9A9DA6] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#55585F]" />
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#25282E] border border-white/[0.07] rounded-[12px] h-11 pl-10 pr-4 text-sm text-[#F0F0F0] focus:outline-none focus:border-[#E87722]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#9A9DA6] block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#55585F]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#25282E] border border-white/[0.07] rounded-[12px] h-11 pl-10 pr-4 text-sm text-[#F0F0F0] focus:outline-none focus:border-[#E87722]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#E87722] hover:bg-[#D06A18] disabled:bg-slate-700 text-white font-bold font-display text-sm rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)] flex items-center justify-center gap-2 transition-all mt-6"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg(null);
            }}
            className="text-xs text-[#9A9DA6] hover:text-white transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
