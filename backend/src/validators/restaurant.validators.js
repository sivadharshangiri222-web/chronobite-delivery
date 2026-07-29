import { z } from 'zod';

export const createRestaurantSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(5, 'Description is required'),
  cuisineType: z.array(z.string()).nonempty('At least one cuisine type is required'),
  image: z.string().url().optional(),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    pincode: z.string().min(1, 'Pincode is required')
  }),
  coordinates: z.object({
    lng: z.number(),
    lat: z.number()
  }),
  openingHours: z.object({
    open: z.string().default('09:00'),
    close: z.string().default('22:00'),
    days: z.array(z.string()).optional()
  }).optional()
});

export const updateRestaurantSchema = createRestaurantSchema.partial();
