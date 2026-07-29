import Food from '../models/food.model.js';
import { createFoodSchema } from '../validators/food.validators.js';
import { inMemoryFoods } from './category.controller.js';

export const getFoodsByRestaurant = async (req, res, next) => {
  try {
    try {
      const foods = await Food.find({ restaurantId: req.params.restaurantId }).populate('categoryId').lean();
      if (foods.length > 0) return res.json({ success: true, data: foods });
    } catch (dbErr) {}

    const list = inMemoryFoods.filter(
      (f) => f.restaurantId.toString() === req.params.restaurantId.toString()
    );
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

export const createFood = async (req, res, next) => {
  try {
    const validatedData = createFoodSchema.parse(req.body);
    const newFood = {
      _id: `food_${Date.now()}`,
      ...validatedData,
      isVeg: validatedData.isVeg ?? true,
      isAvailable: true,
      createdAt: new Date().toISOString()
    };

    try {
      const dbFood = await Food.create(validatedData);
      inMemoryFoods.push(dbFood.toObject());
      return res.status(201).json({ success: true, data: dbFood });
    } catch (dbErr) {
      inMemoryFoods.push(newFood);
      return res.status(201).json({ success: true, data: newFood });
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message, code: 'VALIDATION_ERROR' });
    }
    next(error);
  }
};

export const updateFood = async (req, res, next) => {
  try {
    const food = inMemoryFoods.find((f) => f._id.toString() === req.params.id);
    if (food) {
      Object.assign(food, req.body);
      return res.json({ success: true, data: food });
    }
    res.status(404).json({ message: 'Food item not found', code: 'NOT_FOUND' });
  } catch (error) {
    next(error);
  }
};

export const toggleFoodAvailability = async (req, res, next) => {
  try {
    try {
      const dbFood = await Food.findById(req.params.id);
      if (dbFood) {
        dbFood.isAvailable = !dbFood.isAvailable;
        await dbFood.save();
        return res.json({ success: true, data: dbFood });
      }
    } catch (dbErr) {}

    const food = inMemoryFoods.find((f) => f._id.toString() === req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found', code: 'NOT_FOUND' });
    }
    food.isAvailable = !food.isAvailable;
    res.json({ success: true, data: food });
  } catch (error) {
    next(error);
  }
};

export const deleteFood = async (req, res, next) => {
  try {
    const index = inMemoryFoods.findIndex((f) => f._id.toString() === req.params.id);
    if (index > -1) {
      inMemoryFoods.splice(index, 1);
    }
    res.json({ success: true, data: { message: 'Food item deleted' } });
  } catch (error) {
    next(error);
  }
};
