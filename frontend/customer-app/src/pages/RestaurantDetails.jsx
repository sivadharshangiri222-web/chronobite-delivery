import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import FoodCard from '../components/FoodCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useCartStore } from '../store/cartStore';
import { ArrowLeft, Star, Clock, MapPin, ShoppingBag } from 'lucide-react';

export const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const { cart, addItem, updateQuantity } = useCartStore();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/restaurants/${id}`);
        setData(res.data.data);
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="h-60 bg-[#1C1E22] rounded-[24px] skeleton-shimmer" />
        <SkeletonLoader count={4} type="list" />
      </div>
    );
  }

  if (!data || !data.restaurant) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-[#F0F0F0] font-display">Restaurant unavailable</h2>
        <Link to="/" className="text-[#E87722] text-sm mt-2 inline-block font-semibold">Back to home</Link>
      </div>
    );
  }

  const { restaurant, categories = [], foods = [] } = data;

  const filteredFoods = activeCategory === 'all'
    ? foods
    : foods.filter((f) => f.categoryId === activeCategory || f.categoryId?._id === activeCategory);

  const getFoodQuantityInCart = (foodId) => {
    const item = cart?.items?.find((i) => (i.foodId._id || i.foodId) === foodId);
    return item ? item.quantity : 0;
  };

  const totalCartCount = cart?.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
  const totalCartAmount = cart?.totalAmount || 0;

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Image Section */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-[#25282E]">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111214] via-[#111214]/40 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Info Header */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-[#1C1E22] border border-white/[0.07] rounded-[24px] p-6 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-display text-[#F0F0F0]">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-[#9A9DA6] mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#E87722] shrink-0" />
                <span>{restaurant.address?.street}, {restaurant.address?.city}</span>
              </div>
            </div>

            <div className="bg-[rgba(232,119,34,0.12)] px-3 py-1.5 rounded-full border border-[rgba(232,119,34,0.3)] flex items-center gap-1.5 text-xs font-bold text-[#E87722]">
              <Star className="w-4 h-4 fill-[#E87722] text-[#E87722]" />
              <span>{restaurant.rating || 4.5}</span>
            </div>
          </div>

          <p className="text-xs text-[#55585F] mt-3 leading-relaxed">
            {restaurant.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/[0.05] text-xs">
            <span className="text-[#55585F] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#E87722]" /> Hours: {restaurant.openingHours?.open} - {restaurant.openingHours?.close}
            </span>
            <div className="flex gap-1.5 ml-auto">
              {restaurant.cuisineType?.map((c, i) => (
                <span key={i} className="px-2.5 py-0.5 bg-[#25282E] text-[#9A9DA6] rounded-full text-[11px]">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Category Tabs Scrollbar */}
        <div className="mt-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.05]">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#E87722] text-white shadow-[0_4px_20px_rgba(232,119,34,0.3)]'
                  : 'bg-[#25282E] text-[#9A9DA6] hover:text-white'
              }`}
            >
              All Items ({foods.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat._id
                    ? 'bg-[#E87722] text-white shadow-[0_4px_20px_rgba(232,119,34,0.3)]'
                    : 'bg-[#25282E] text-[#9A9DA6] hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Food List */}
        <div className="mt-6 space-y-3">
          {filteredFoods.map((food) => {
            const qty = getFoodQuantityInCart(food._id);
            return (
              <FoodCard
                key={food._id}
                food={food}
                quantity={qty}
                onAdd={() => addItem(food, restaurant._id)}
                onIncrease={() => updateQuantity(food._id, qty + 1)}
                onDecrease={() => updateQuantity(food._id, qty - 1)}
              />
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 z-40 max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#E87722] text-white p-4 rounded-[20px] shadow-[0_6px_28px_rgba(232,119,34,0.45)] flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/90">{totalCartCount} items in cart</p>
                <p className="text-base font-extrabold font-display">₹{totalCartAmount}</p>
              </div>
            </div>

            <Link
              to="/cart"
              className="px-6 py-2.5 bg-white text-[#E87722] font-bold text-xs rounded-full hover:bg-slate-100 transition-all shadow-md"
            >
              View Cart →
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
