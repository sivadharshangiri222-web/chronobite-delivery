import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import ChronoBiteLogo from '../components/ChronoBiteLogo';
import { useAuthStore } from '../store/authStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      await login(email, password);
      navigate('/home');

    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4 selection:bg-[#E87722] selection:text-white">
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
          className="font-display text-[28px] font-bold text-white text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
        >
          Welcome back
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-body text-sm text-[#A0A0A0] text-center mt-1 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
        >
          Sign in to continue
        </motion.p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
          >
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-[18px] h-[18px] text-[#5A5A5A] pointer-events-none" />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[52px] bg-[#1A1A1A] border border-white/5 rounded-[12px] pl-[48px] pr-4 text-[15px] font-body text-white placeholder-[#5A5A5A] focus:outline-none focus:border-[#E87722] transition-colors duration-200"
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
          >
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-[18px] h-[18px] text-[#5A5A5A] pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[52px] bg-[#1A1A1A] border border-white/5 rounded-[12px] pl-[48px] pr-[48px] text-[15px] font-body text-white placeholder-[#5A5A5A] focus:outline-none focus:border-[#E87722] transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#5A5A5A] hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-[18px] h-[18px]" />
                ) : (
                  <Eye className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end mt-2">
              <Link
                to="/forgot-password"
                className="text-[13px] font-body font-medium text-[#E87722] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </motion.div>

          {/* Sign In Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] bg-[#E87722] hover:bg-[#D06A18] active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none text-white font-display font-semibold text-[16px] rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)] hover:shadow-[0_6px_24px_rgba(232,119,34,0.5)] transition-all duration-200 flex items-center justify-center mt-2"
            >

              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </motion.div>

          {/* Demo Fill & Guest Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  setEmail('customer@chronobite.com');
                  setPassword('customer123password');
                  await login('customer@chronobite.com', 'customer123password');
                  navigate('/home');

                } catch (err) {
                  // Fallback guest login token for instant UI demo
                  localStorage.setItem('chronobite_token', 'demo_customer_token_2026');
                  localStorage.setItem(
                    'chronobite_user',
                    JSON.stringify({
                      name: 'Alex Johnson',
                      email: 'customer@chronobite.com',
                      phone: '9876543210',
                      role: 'customer'
                    })
                  );
                  navigate('/home');

                  window.location.reload();
                }
              }}
              className="w-full py-2.5 bg-[#232323] hover:bg-white/10 text-white font-body font-medium text-xs rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-1.5"
            >
              ⚡ Quick Demo Login (Customer)
            </button>
          </div>

          {/* Inline Error Message */}
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

        {/* Divider & Links */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4, ease: 'easeOut' }}
        >
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0D0D0D] px-4 text-xs font-body text-[#5A5A5A] absolute">
              or
            </span>
          </div>

          <div className="flex flex-col gap-3 items-center">
            <Link
              to="/home"
              className="text-sm font-body font-semibold text-white hover:text-[#E87722] underline decoration-dotted transition-colors"
            >
              Continue as Guest →
            </Link>


            <p className="text-xs font-body text-[#A0A0A0]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#E87722] hover:underline inline-flex items-center gap-0.5 ml-1"
              >
                Create one →
              </Link>
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default LoginPage;
