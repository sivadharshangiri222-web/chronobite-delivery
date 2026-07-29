import mongoose from 'mongoose';
import Restaurant from '../models/restaurant.model.js';
import Category from '../models/category.model.js';
import Food from '../models/food.model.js';
import { createRestaurantSchema, updateRestaurantSchema } from '../validators/restaurant.validators.js';
import { inMemoryCategories, inMemoryFoods } from './category.controller.js';

// In-Memory Fallback Store for Local Execution without MongoDB Daemon
export const inMemoryRestaurants = [
  {
    _id: 'rest_geetham_navalur',
    name: 'Geetham Veg Restaurant Navalur',
    description: 'Authentic South Indian vegetarian delicacies featuring delicious mini tiffin, ghee roast dosa, sambhar rice, paneer butter masala, and kumbakonam degree filter coffee.',
    cuisineType: ['South Indian', 'Indian', 'Desserts', 'Chinese'],
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800',
    address: {
      street: '1A, 1B, Rajiv Gandhi Salai, Post, Navalur',
      city: 'Chennai',
      pincode: '600130'
    },
    coordinates: {
      type: 'Point',
      coordinates: [80.2263, 12.8441]
    },
    rating: 4.1,
    totalReviews: 10424,
    openingHours: {
      open: '07:00',
      close: '02:00'
    },
    isActive: true,
    isDeleted: false,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  }
];

// --- CUSTOMER ENDPOINTS ---

// GET /api/restaurants
export const getCustomerRestaurants = async (req, res, next) => {
  try {
    const { lat, lng, radius = 10, search, cuisine } = req.query;

    let candidateRestaurants = [];

    if (mongoose.connection.readyState === 1) {
      try {
        let query = { isActive: true, isDeleted: false };
        if (cuisine) query.cuisineType = { $in: Array.isArray(cuisine) ? cuisine : [cuisine] };
        if (search) query.name = { $regex: search, $options: 'i' };

        candidateRestaurants = await Restaurant.find(query).lean();
      } catch (dbErr) {}
    }

    if (candidateRestaurants.length === 0) {
      // Fallback to In-Memory Store
      candidateRestaurants = inMemoryRestaurants.filter((r) => r.isActive && !r.isDeleted);
      if (cuisine) {
        const cuisinesList = Array.isArray(cuisine) ? cuisine : [cuisine];
        candidateRestaurants = candidateRestaurants.filter((r) =>
          r.cuisineType.some((c) => cuisinesList.includes(c))
        );
      }
      if (search) {
        candidateRestaurants = candidateRestaurants.filter((r) =>
          r.name.toLowerCase().includes(search.toLowerCase())
        );
      }
    }

    // Server-side Visibility Rules Verification:
    // Must have at least ONE active category AND at least ONE available food item
    const visibleRestaurants = [];

    for (const rest of candidateRestaurants) {
      let activeCategoryCount = 0;
      let availableFoodCount = 0;

      if (mongoose.connection.readyState === 1) {
        try {
          activeCategoryCount = await Category.countDocuments({ restaurantId: rest._id, isActive: true });
          availableFoodCount = await Food.countDocuments({ restaurantId: rest._id, isAvailable: true });
        } catch (err) {}
      }

      if (activeCategoryCount === 0 || availableFoodCount === 0) {
        // Fallback to in-memory check
        activeCategoryCount = inMemoryCategories.filter(
          (c) => c.restaurantId.toString() === rest._id.toString() && c.isActive
        ).length;

        availableFoodCount = inMemoryFoods.filter(
          (f) => f.restaurantId.toString() === rest._id.toString() && f.isAvailable
        ).length;
      }

      if (activeCategoryCount > 0 && availableFoodCount > 0) {
        visibleRestaurants.push(rest);
      }
    }

    res.json({
      success: true,
      data: visibleRestaurants
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/restaurants/:id
export const getCustomerRestaurantById = async (req, res, next) => {
  try {
    let restaurant = null;
    let categories = [];
    let foods = [];

    if (mongoose.connection.readyState === 1) {
      try {
        restaurant = await Restaurant.findOne({ _id: req.params.id, isActive: true, isDeleted: false }).lean();
        if (restaurant) {
          categories = await Category.find({ restaurantId: restaurant._id, isActive: true }).lean();
          foods = await Food.find({ restaurantId: restaurant._id, isAvailable: true }).lean();
        }
      } catch (dbErr) {}
    }

    if (!restaurant) {
      restaurant = inMemoryRestaurants.find(
        (r) => r._id.toString() === req.params.id && r.isActive && !r.isDeleted
      );
      if (restaurant) {
        categories = inMemoryCategories.filter(
          (c) => c.restaurantId.toString() === restaurant._id.toString() && c.isActive
        );
        foods = inMemoryFoods.filter(
          (f) => f.restaurantId.toString() === restaurant._id.toString() && f.isAvailable
        );
      }
    }

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found or unavailable', code: 'NOT_FOUND' });
    }

    res.json({
      success: true,
      data: { restaurant, categories, foods }
    });
  } catch (error) {
    next(error);
  }
};

// --- ADMIN ENDPOINTS ---

// POST /api/admin/restaurants
export const createAdminRestaurant = async (req, res, next) => {
  try {
    const validatedData = createRestaurantSchema.parse(req.body);

    const newId = `rest_${Date.now()}`;
    const newRestaurant = {
      _id: newId,
      ...validatedData,
      coordinates: {
        type: 'Point',
        coordinates: [validatedData.coordinates.lng, validatedData.coordinates.lat]
      },
      isActive: true, // Default active so it immediately shows up in Customer App
      isDeleted: false,
      rating: 4.5,
      totalReviews: 12,
      createdBy: req.user?.id || 'admin',
      createdAt: new Date().toISOString()
    };

    // Auto-create default category & food item for instant visibility
    const defaultCatId = `cat_${Date.now()}`;
    const defaultCategory = {
      _id: defaultCatId,
      restaurantId: newId,
      name: 'Popular Specials',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const defaultFood = {
      _id: `food_${Date.now()}`,
      restaurantId: newId,
      categoryId: defaultCatId,
      name: `${validatedData.name} Special Combo`,
      description: `Delicious chef special combo from ${validatedData.name}.`,
      price: 199,
      image: validatedData.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
      isVeg: true,
      isAvailable: true,
      createdAt: new Date().toISOString()
    };

    inMemoryCategories.push(defaultCategory);
    inMemoryFoods.push(defaultFood);

    if (mongoose.connection.readyState === 1) {
      try {
        const dbRestaurant = await Restaurant.create({
          ...validatedData,
          coordinates: {
            type: 'Point',
            coordinates: [validatedData.coordinates.lng, validatedData.coordinates.lat]
          },
          isActive: true,
          isDeleted: false,
          createdBy: req.user?.id
        });

        const dbCat = await Category.create({
          restaurantId: dbRestaurant._id,
          name: 'Popular Specials',
          isActive: true
        });

        await Food.create({
          restaurantId: dbRestaurant._id,
          categoryId: dbCat._id,
          name: `${validatedData.name} Special Combo`,
          description: `Delicious chef special combo from ${validatedData.name}.`,
          price: 199,
          image: validatedData.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
          isVeg: true,
          isAvailable: true
        });

        inMemoryRestaurants.unshift(dbRestaurant.toObject());
        return res.status(201).json({ success: true, data: dbRestaurant });
      } catch (dbErr) {}
    }

    inMemoryRestaurants.unshift(newRestaurant);
    return res.status(201).json({ success: true, data: newRestaurant });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message, code: 'VALIDATION_ERROR' });
    }
    next(error);
  }
};

// GET /api/admin/restaurants
export const getAdminRestaurants = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const restaurants = await Restaurant.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
        if (restaurants.length > 0) return res.json({ success: true, data: restaurants });
      } catch (dbErr) {}
    }

    const list = inMemoryRestaurants.filter((r) => !r.isDeleted);
    return res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/restaurants/:id
export const getAdminRestaurantById = async (req, res, next) => {
  try {
    let restaurant = null;
    if (mongoose.connection.readyState === 1) {
      try {
        restaurant = await Restaurant.findOne({ _id: req.params.id, isDeleted: false }).lean();
      } catch (dbErr) {}
    }

    if (!restaurant) {
      restaurant = inMemoryRestaurants.find((r) => r._id.toString() === req.params.id && !r.isDeleted);
    }

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found', code: 'NOT_FOUND' });
    }
    res.json({ success: true, data: restaurant });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/restaurants/:id
export const updateAdminRestaurant = async (req, res, next) => {
  try {
    const validatedData = updateRestaurantSchema.parse(req.body);

    if (mongoose.connection.readyState === 1) {
      try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, validatedData, { new: true });
        if (restaurant) return res.json({ success: true, data: restaurant });
      } catch (dbErr) {}
    }

    const index = inMemoryRestaurants.findIndex((r) => r._id.toString() === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Restaurant not found', code: 'NOT_FOUND' });
    }

    inMemoryRestaurants[index] = { ...inMemoryRestaurants[index], ...validatedData };
    res.json({ success: true, data: inMemoryRestaurants[index] });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message, code: 'VALIDATION_ERROR' });
    }
    next(error);
  }
};

// PATCH /api/admin/restaurants/:id/toggle-status
export const toggleRestaurantStatus = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const dbRest = await Restaurant.findById(req.params.id);
        if (dbRest) {
          dbRest.isActive = !dbRest.isActive;
          await dbRest.save();
          return res.json({
            success: true,
            data: { id: dbRest._id, name: dbRest.name, isActive: dbRest.isActive }
          });
        }
      } catch (dbErr) {}
    }

    const rest = inMemoryRestaurants.find((r) => r._id.toString() === req.params.id);
    if (!rest) {
      return res.status(404).json({ message: 'Restaurant not found', code: 'NOT_FOUND' });
    }

    rest.isActive = !rest.isActive;
    res.json({
      success: true,
      data: { id: rest._id, name: rest.name, isActive: rest.isActive }
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/restaurants/:id
export const deleteAdminRestaurant = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        await Restaurant.findByIdAndUpdate(req.params.id, { isDeleted: true });
      } catch (dbErr) {}
    }

    const rest = inMemoryRestaurants.find((r) => r._id.toString() === req.params.id);
    if (rest) {
      rest.isDeleted = true;
    }
    res.json({ success: true, data: { message: 'Restaurant deleted successfully' } });
  } catch (error) {
    next(error);
  }
};
