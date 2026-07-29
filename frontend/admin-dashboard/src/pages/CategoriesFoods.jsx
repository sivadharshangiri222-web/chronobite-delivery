import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, ToggleLeft, ToggleRight, Layers, Utensils } from 'lucide-react';

export const CategoriesFoods = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestId, setSelectedRestId] = useState('');
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState('');

  const [showFoodModal, setShowFoodModal] = useState(false);
  const [foodData, setFoodData] = useState({
    name: '',
    description: '',
    price: 299,
    categoryId: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    isVeg: true
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get('/admin/restaurants');
        const list = res.data.data || [];
        setRestaurants(list);
        if (list.length > 0) {
          setSelectedRestId(list[0]._id);
        }
      } catch (err) {}
    };
    fetchRestaurants();
  }, []);

  const loadMenuData = async (restId) => {
    if (!restId) return;
    setLoading(true);
    try {
      const catRes = await api.get(`/categories/restaurant/${restId}`);
      const foodRes = await api.get(`/foods/restaurant/${restId}`);
      setCategories(catRes.data.data || []);
      setFoods(foodRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData(selectedRestId);
  }, [selectedRestId]);

  const handleToggleCategory = async (catId) => {
    try {
      await api.patch(`/categories/${catId}/toggle-status`);
      loadMenuData(selectedRestId);
    } catch (err) {}
  };

  const handleToggleFood = async (foodId) => {
    try {
      await api.patch(`/foods/${foodId}/toggle-availability`);
      loadMenuData(selectedRestId);
    } catch (err) {}
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', {
        name: catName,
        restaurantId: selectedRestId
      });
      setShowCatModal(false);
      setCatName('');
      loadMenuData(selectedRestId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await api.post('/foods', {
        ...foodData,
        price: parseFloat(foodData.price),
        restaurantId: selectedRestId
      });
      setShowFoodModal(false);
      loadMenuData(selectedRestId);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Categories & Menu Items</h1>
          <p className="text-xs text-textMuted mt-1">
            Visibility Rule: Restaurant is visible only when active + at least 1 active category + at least 1 available food.
          </p>
        </div>

        {/* Restaurant Selector */}
        <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl px-4 py-2 text-xs">
          <span className="text-textMuted">Select Restaurant:</span>
          <select
            value={selectedRestId}
            onChange={(e) => setSelectedRestId(e.target.value)}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
          >
            {restaurants.map((r) => (
              <option key={r._id} value={r._id} className="bg-surface text-white">
                {r.name} ({r.isActive ? 'Active' : 'Inactive'})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Panel */}
        <div className="bg-surface border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-primary" /> Categories ({categories.length})
            </h3>
            <button
              onClick={() => setShowCatModal(true)}
              className="px-3 py-1.5 bg-red-primary hover:bg-red-hover text-white text-xs font-semibold rounded-full shadow-red-glow"
            >
              + Category
            </button>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat._id} className="p-3 bg-elevated rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{cat.name}</p>
                </div>
                <button
                  onClick={() => handleToggleCategory(cat._id)}
                  className={`px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                    cat.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {cat.isActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  <span>{cat.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Foods Panel */}
        <div className="lg:col-span-2 bg-surface border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-red-primary" /> Menu Foods ({foods.length})
            </h3>
            <button
              onClick={() => {
                if (categories.length === 0) {
                  alert('Please create a category first.');
                  return;
                }
                setFoodData({ ...foodData, categoryId: categories[0]._id });
                setShowFoodModal(true);
              }}
              className="px-3 py-1.5 bg-red-primary hover:bg-red-hover text-white text-xs font-semibold rounded-full shadow-red-glow"
            >
              + Add Food Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {foods.map((food) => (
              <div key={food._id} className="p-3 bg-elevated rounded-xl border border-white/5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={food.image} alt={food.name} className="w-12 h-12 rounded-lg object-cover bg-surface shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{food.name}</p>
                    <p className="text-textMuted text-[11px]">₹{food.price} • {food.isVeg ? 'Veg' : 'Non-Veg'}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleFood(food._id)}
                  className={`px-2.5 py-1 rounded-full font-bold text-[10px] shrink-0 flex items-center gap-1 ${
                    food.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {food.isAvailable ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  <span>{food.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold font-display text-white">Add Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Category Name (e.g. Starters, Main Dishes)"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="w-full bg-elevated border border-white/10 rounded-xl h-11 px-4 text-white"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowCatModal(false)} className="px-4 py-2 text-textSecondary">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-red-primary text-white font-bold rounded-full">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Food Modal */}
      {showFoodModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold font-display text-white">Add Food Item</h3>
            <form onSubmit={handleAddFood} className="space-y-3 text-xs">
              <div>
                <label className="text-textSecondary block mb-1 font-semibold">Food Name</label>
                <input
                  type="text"
                  required
                  value={foodData.name}
                  onChange={(e) => setFoodData({ ...foodData, name: e.target.value })}
                  className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                />
              </div>

              <div>
                <label className="text-textSecondary block mb-1 font-semibold">Description</label>
                <input
                  type="text"
                  required
                  value={foodData.description}
                  onChange={(e) => setFoodData({ ...foodData, description: e.target.value })}
                  className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-textSecondary block mb-1 font-semibold">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={foodData.price}
                    onChange={(e) => setFoodData({ ...foodData, price: e.target.value })}
                    className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                  />
                </div>

                <div>
                  <label className="text-textSecondary block mb-1 font-semibold">Category</label>
                  <select
                    value={foodData.categoryId}
                    onChange={(e) => setFoodData({ ...foodData, categoryId: e.target.value })}
                    className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id} className="bg-surface text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-textSecondary block mb-1 font-semibold">Image URL</label>
                <input
                  type="text"
                  required
                  value={foodData.image}
                  onChange={(e) => setFoodData({ ...foodData, image: e.target.value })}
                  className="w-full bg-elevated border border-white/10 rounded-xl h-10 px-3 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vegCheck"
                  checked={foodData.isVeg}
                  onChange={(e) => setFoodData({ ...foodData, isVeg: e.target.checked })}
                  className="accent-red-primary"
                />
                <label htmlFor="vegCheck" className="text-white">Vegetarian Item</label>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button type="button" onClick={() => setShowFoodModal(false)} className="px-4 py-2 text-textSecondary">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-red-primary text-white font-bold rounded-full">Save Food Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesFoods;
