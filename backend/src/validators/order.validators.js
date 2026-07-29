import { z } from 'zod';

export const initiateOrderSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  items: z.array(
    z.object({
      foodId: z.string(),
      name: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive()
    })
  ).nonempty('Cart cannot be empty'),
  totalAmount: z.number().positive(),
  deliveryAddress: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    pincode: z.string().min(1, 'Pincode is required')
  }),
  deliverySlotId: z.string().min(1, 'Delivery slot is required')
});
