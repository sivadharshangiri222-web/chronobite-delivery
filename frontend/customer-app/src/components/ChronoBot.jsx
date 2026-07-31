import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Clock, MapPin, CreditCard, RotateCcw, AlertCircle } from 'lucide-react';
import api from '../services/api';

const QUICK_PROMPTS = [
  { label: '⭐ Recommended Restaurants', query: 'Recommend the best restaurants with high On-Time score.' },
  { label: '⏱️ Best Delivery Slot', query: 'Which delivery slot has the highest delivery confidence?' },
  { label: '📦 Track My Order', query: 'How can I track my live order status?' },
  { label: '💳 Payment Methods', query: 'What payment options are supported?' },
  { label: '❌ Cancellation Policy', query: 'What is ChronoBite cancellation policy?' }
];

export const ChronoBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'bot',
      text: "Hello! 👋 I'm ChronoBot, your AI delivery assistant for ChronoBite. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const generateBotResponse = (userQuery) => {
    const q = userQuery.toLowerCase();

    // 1. Restaurant recommendations (prioritize On-Time Score)
    if (q.includes('restaurant') || q.includes('recommend') || q.includes('food option') || q.includes('where to eat')) {
      return "🏆 Top Recommended Restaurant:\n\n📍 **Geetham Veg Restaurant Navalur**\n• On-Time Score: 98% (Guaranteed delivery!)\n• Rating: 4.1 ★ (10,424 Reviews)\n• Highlights: Ghee Roast Dosa, Mini Meals & Degree Filter Coffee.";
    }

    // 2. Delivery slot recommendations (prioritize highest delivery confidence)
    if (q.includes('slot') || q.includes('time') || q.includes('confidence') || q.includes('best time')) {
      return "⏱️ Recommended Delivery Slot:\n\n• **12:00 PM – 01:00 PM** (Delivery Confidence: **99.4%** — Optimal traffic & kitchen prep slot).\n\nSelect this slot at checkout for guaranteed on-time delivery!";
    }

    // 3. Order tracking
    if (q.includes('track') || q.includes('status') || q.includes('where is my order') || q.includes('order')) {
      return "📦 Order Tracking:\n\nYou can track your live order in real-time under the **Orders** tab! It includes live GPS driver location, kitchen prep countdown, and estimated arrival time.";
    }

    // 4. Payments
    if (q.includes('payment') || q.includes('pay') || q.includes('card') || q.includes('upi') || q.includes('razorpay')) {
      return "💳 Payment Methods:\n\nWe support UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery. All online transactions are 100% encrypted via Razorpay.";
    }

    // 5. Cancellations & Refunds
    if (q.includes('cancel') || q.includes('refund') || q.includes('cancellation')) {
      return "❌ Cancellation Policy:\n\nOrders can be canceled within **60 seconds** of placement for a 100% instant refund. If delivery is delayed beyond your chosen slot, you receive an automatic 50% refund credit!";
    }

    // 6. Food suggestions
    if (q.includes('dosa') || q.includes('tiffin') || q.includes('coffee') || q.includes('thali') || q.includes('dish') || q.includes('menu')) {
      return "🍛 Top Dish Recommendations:\n\n1. **Ghee Roast Dosa** (₹145) – Crispy golden crepe in pure ghee.\n2. **Mini Meals** (₹180) – Assorted 5-item tiffin platter.\n3. **Filter Coffee** (₹45) – Freshly brewed degree coffee.";
    }

    // 7. Unrelated Questions Policy Fallback
    return "I am ChronoBite's food delivery assistant. I can only assist with restaurant recommendations, food suggestions, delivery slots, order tracking, payments, and cancellations!";
  };

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botText = generateBotResponse(text);
      const botMsg = { id: `bot-${Date.now()}`, sender: 'bot', text: botText };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-20 right-5 sm:bottom-6 sm:right-6 z-40 bg-[#E87722] hover:bg-[#D06A18] text-white p-3.5 rounded-full shadow-[0_4px_24px_rgba(232,119,34,0.45)] border border-white/20 flex items-center justify-center transition-colors"
        aria-label="Open ChronoBot AI Assistant"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#111214]" />
      </motion.button>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:bottom-20 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] bg-[#1C1E22] border border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden selection:bg-[#E87722] selection:text-white"
          >
            {/* Drawer Header */}
            <div className="bg-[#111214] px-4 py-3.5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E87722] flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_10px_rgba(232,119,34,0.3)]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                    ChronoBot <Sparkles className="w-3.5 h-3.5 text-[#E87722]" />
                  </h3>
                  <p className="font-body text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online & Ready
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#A0A0A0] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-body text-xs leading-relaxed">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl whitespace-pre-line ${
                      m.sender === 'user'
                        ? 'bg-[#E87722] text-white rounded-br-none shadow-[0_2px_10px_rgba(232,119,34,0.25)]'
                        : 'bg-[#282B30] text-[#E0E0E0] rounded-bl-none border border-white/5'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#282B30] px-4 py-2.5 rounded-2xl rounded-bl-none text-[#A0A0A0] text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#E87722] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#E87722] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#E87722] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div className="px-3 py-2 border-t border-white/5 bg-[#17181C] flex gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.query)}
                  className="shrink-0 px-2.5 py-1 bg-white/5 hover:bg-[#E87722]/20 border border-white/10 hover:border-[#E87722]/50 text-[#C0C0C0] hover:text-[#E87722] text-[11px] font-medium rounded-full transition-colors"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-[#111214] border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask ChronoBot..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-[#1C1E22] border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-[#606060] focus:outline-none focus:border-[#E87722] transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-[#E87722] hover:bg-[#D06A18] disabled:opacity-40 disabled:pointer-events-none text-white p-2 rounded-full shadow-[0_2px_10px_rgba(232,119,34,0.3)] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChronoBot;
