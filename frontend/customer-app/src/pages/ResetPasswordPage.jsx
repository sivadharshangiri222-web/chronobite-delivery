import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import ChronoBiteLogo from '../components/ChronoBiteLogo';
import api from '../services/api';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await api.post('/auth/reset-password', { password });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Could not reset password');
    } finally {
      setLoading(false);
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
          Set New Password
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-body text-sm text-[#9A9DA6] text-center mt-1 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
        >
          Create a strong password for your ChronoBite account
        </motion.p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1C1E22] border border-white/[0.07] rounded-[16px] p-6 text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-[rgba(232,119,34,0.12)] flex items-center justify-center mx-auto text-[#E87722]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-display text-[#F0F0F0]">Password Reset Complete!</h3>
            <p className="text-xs font-body text-[#9A9DA6] leading-relaxed">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E87722] hover:bg-[#D06A18] text-white text-xs font-semibold rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)] transition-all"
            >
              Sign In Now →
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
            >
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-[18px] h-[18px] text-[#55585F] pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="New Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[52px] bg-[#1C1E22] border border-white/[0.07] rounded-[12px] pl-[48px] pr-4 text-[15px] font-body text-[#F0F0F0] placeholder-[#55585F] focus:outline-none focus:border-[#E87722] transition-colors duration-200"
                />
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4, ease: 'easeOut' }}
            >
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-[18px] h-[18px] text-[#55585F] pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-[52px] bg-[#1C1E22] border border-white/[0.07] rounded-[12px] pl-[48px] pr-4 text-[15px] font-body text-[#F0F0F0] placeholder-[#55585F] focus:outline-none focus:border-[#E87722] transition-colors duration-200"
                />
              </div>
            </motion.div>

            {/* Inline Error */}
            <AnimatePresence>
              {errorMsg && (
                <p className="text-xs text-[#E8192C] text-center font-medium">{errorMsg}</p>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-[#E87722] hover:bg-[#D06A18] active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none text-white font-display font-semibold text-[16px] rounded-full shadow-[0_4px_20px_rgba(232,119,34,0.3)] hover:shadow-[0_6px_24px_rgba(232,119,34,0.5)] transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          </form>
        )}

        {/* Back to Login */}
        {!submitted && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Link
              to="/login"
              className="text-xs font-body font-semibold text-[#9A9DA6] hover:text-[#E87722] inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
