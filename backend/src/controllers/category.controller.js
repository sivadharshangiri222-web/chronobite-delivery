import Category from '../models/category.model.js';
import { createCategorySchema } from '../validators/food.validators.js';

export const inMemoryCategories = [
  {
    _id: 'cat_geetham_1',
    restaurantId: 'rest_geetham_navalur',
    name: 'Tamil Nadu Specials & Tiffin',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'cat_geetham_2',
    restaurantId: 'rest_geetham_navalur',
    name: 'Thali & Combo Meals',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'cat_geetham_3',
    restaurantId: 'rest_geetham_navalur',
    name: 'North Indian & Fried Rice',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'cat_geetham_4',
    restaurantId: 'rest_geetham_navalur',
    name: 'Sweets & Filter Coffee',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export const inMemoryFoods = [
  {
    _id: 'food_geetham_1',
    restaurantId: 'rest_geetham_navalur',
    categoryId: 'cat_geetham_1',
    name: 'Ghee Roast Dosa',
    description: 'Crispy golden crepe roasted in pure ghee served with 3 varieties of chutneys and hot sambar.',
    price: 145,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800',
    isVeg: true,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'food_geetham_2',
    restaurantId: 'rest_geetham_navalur',
    categoryId: 'cat_geetham_1',
    name: 'Mini Meals (Mini Tiffin)',
    description: 'Assorted breakfast platter with Mini Idli, Rava Kesari, Poori, Vadai, and Mini Masala Dosa.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800',
    isVeg: true,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'food_geetham_3',
    restaurantId: 'rest_geetham_navalur',
    categoryId: 'cat_geetham_1',
    name: 'Sambar Rice Bowl',
    description: 'Traditional piping hot Sambar rice cooked with ghee, vegetables, and papad.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
    isVeg: true,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'food_geetham_4',
    restaurantId: 'rest_geetham_navalur',
    categoryId: 'cat_geetham_2',
    name: 'North Indian Thali',
    description: 'Complete meal with Paneer Butter Masala, Dal Tadka, Jeera Rice, 2 Butter Naan, Sweet, and Salad.',
    price: 240,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800',
    isVeg: true,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'food_geetham_5',
    restaurantId: 'rest_geetham_navalur',
    categoryId: 'cat_geetham_3',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes cooked in rich tomato cashew gravy with fresh cream.',
    price: 220,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800',
    isVeg: true,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'food_geetham_6',
    restaurantId: 'rest_geetham_navalur',
    categoryId: 'cat_geetham_3',
    name: 'Veg Fried Rice',
    description: 'Wok-tossed basmati rice with finely chopped garden vegetables and aromatic spices.',
    price: 170,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
    isVeg: true,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'food_geetham_7',
    restaurantId: 'rest_geetham_navalur',
    categoryId: 'cat_geetham_4',
    name: 'Filter Coffee',
    description: 'Authentic Kumbakonam degree filter coffee brewed with fresh frothy milk.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
    isVeg: true,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'food_geetham_8',
    restaurantId: 'rest_geetham_navalur',
    categoryId: 'cat_geetham_4',
    name: 'Ghee Assorted Sweets Box (250g)',
    description: 'Selection of traditional ghee Mysurpa, Laddu, and Milk Sweets.',
    price: 190,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800',
    isVeg: true,
    isAvailable: true,
    createdAt: new Date().toISOString()
  }
];

export const getCategoriesByRestaurant = async (req, res, next) => {
  try {
    try {
      const categories = await Category.find({ restaurantId: req.params.restaurantId }).lean();
      if (categories.length > 0) return res.json({ success: true, data: categories });
    } catch (dbErr) {}

    const list = inMemoryCategories.filter(
      (c) => c.restaurantId.toString() === req.params.restaurantId.toString()
    );
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const newCat = {
      _id: `cat_${Date.now()}`,
      ...validatedData,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    try {
      const dbCat = await Category.create(validatedData);
      inMemoryCategories.push(dbCat.toObject());
      return res.status(201).json({ success: true, data: dbCat });
    } catch (dbErr) {
      inMemoryCategories.push(newCat);
      return res.status(201).json({ success: true, data: newCat });
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message, code: 'VALIDATION_ERROR' });
    }
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const cat = inMemoryCategories.find((c) => c._id.toString() === req.params.id);
    if (cat) {
      Object.assign(cat, req.body);
      return res.json({ success: true, data: cat });
    }
    res.status(404).json({ message: 'Category not found', code: 'NOT_FOUND' });
  } catch (error) {
    next(error);
  }
};

export const toggleCategoryStatus = async (req, res, next) => {
  try {
    try {
      const dbCat = await Category.findById(req.params.id);
      if (dbCat) {
        dbCat.isActive = !dbCat.isActive;
        await dbCat.save();
        return res.json({ success: true, data: dbCat });
      }
    } catch (dbErr) {}

    const cat = inMemoryCategories.find((c) => c._id.toString() === req.params.id);
    if (!cat) {
      return res.status(404).json({ message: 'Category not found', code: 'NOT_FOUND' });
    }
    cat.isActive = !cat.isActive;
    res.json({ success: true, data: cat });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const index = inMemoryCategories.findIndex((c) => c._id.toString() === req.params.id);
    if (index > -1) {
      inMemoryCategories.splice(index, 1);
    }
    res.json({ success: true, data: { message: 'Category deleted' } });
  } catch (error) {
    next(error);
  }
};
