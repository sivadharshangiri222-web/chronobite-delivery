import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  restaurantId: z.string().min(1, 'Restaurant ID is required')
});

export const createFoodSchema = z.object({
  name: z.string().min(1, 'Food name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  image: z.string().optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true)
});
