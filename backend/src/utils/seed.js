import mongoose from 'mongoose';
import { config } from '../config/env.js';
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';
import Restaurant from '../models/restaurant.model.js';
import Category from '../models/category.model.js';
import Food from '../models/food.model.js';
import DeliverySlot from '../models/deliverySlot.model.js';

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(config.mongoUri);
    }

    console.log('🌱 Checking seed data...');

    // Seed Admin if none exists
    let admin = await Admin.findOne({ email: 'admin@chronobite.com' });
    if (!admin) {
      admin = await Admin.create({
        name: 'ChronoAdmin',
        email: 'admin@chronobite.com',
        password: 'admin123password',
        role: 'admin'
      });
      console.log('✅ Default Admin created: admin@chronobite.com / admin123password');
    }

    // Seed Customer User if none exists
    let customer = await User.findOne({ email: 'customer@chronobite.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Alex Johnson',
        email: 'customer@chronobite.com',
        password: 'customer123password',
        phone: '9876543210',
        role: 'customer',
        savedAddresses: [
          {
            label: 'Home',
            street: '12th Main Road, Anna Nagar',
            city: 'Chennai',
            pincode: '600040',
            coordinates: { lat: 13.0827, lng: 80.2707 }
          }
        ]
      });
      console.log('✅ Default Customer created: customer@chronobite.com / customer123password');
    }

    // Seed Geetham Veg Restaurant if none exists
    let geetham = await Restaurant.findOne({ name: /Geetham Veg/i });
    if (!geetham) {
      geetham = await Restaurant.create({
        name: 'Geetham Veg Restaurant Navalur',
        description: 'Authentic South Indian vegetarian delicacies featuring delicious mini tiffin, ghee roast dosa, sambhar rice, paneer butter masala, and filter coffee.',
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
        openingHours: { open: '07:00', close: '02:00' },
        isActive: true,
        createdBy: admin._id
      });
      console.log('✅ Geetham Veg Restaurant Navalur created.');

      // Create Categories
      const cat1 = await Category.create({ restaurantId: geetham._id, name: 'Tamil Nadu Specials & Tiffin', isActive: true });
      const cat2 = await Category.create({ restaurantId: geetham._id, name: 'Thali & Combo Meals', isActive: true });
      const cat3 = await Category.create({ restaurantId: geetham._id, name: 'North Indian & Fried Rice', isActive: true });
      const cat4 = await Category.create({ restaurantId: geetham._id, name: 'Sweets & Filter Coffee', isActive: true });

      // Create Foods
      await Food.create([
        { restaurantId: geetham._id, categoryId: cat1._id, name: 'Ghee Roast Dosa', description: 'Crispy golden crepe roasted in pure ghee served with 3 chutneys and hot sambar.', price: 145, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800', isVeg: true, isAvailable: true },
        { restaurantId: geetham._id, categoryId: cat1._id, name: 'Mini Meals (Mini Tiffin)', description: 'Assorted breakfast platter with Mini Idli, Rava Kesari, Poori, Vadai, and Mini Masala Dosa.', price: 180, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800', isVeg: true, isAvailable: true },
        { restaurantId: geetham._id, categoryId: cat1._id, name: 'Sambar Rice Bowl', description: 'Traditional piping hot Sambar rice cooked with ghee, vegetables, and papad.', price: 120, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800', isVeg: true, isAvailable: true },
        { restaurantId: geetham._id, categoryId: cat2._id, name: 'North Indian Thali', description: 'Complete meal with Paneer Butter Masala, Dal Tadka, Jeera Rice, 2 Butter Naan, Sweet, and Salad.', price: 240, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800', isVeg: true, isAvailable: true },
        { restaurantId: geetham._id, categoryId: cat3._id, name: 'Paneer Butter Masala', description: 'Cottage cheese cubes cooked in rich tomato cashew gravy with fresh cream.', price: 220, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800', isVeg: true, isAvailable: true },
        { restaurantId: geetham._id, categoryId: cat3._id, name: 'Veg Fried Rice', description: 'Wok-tossed basmati rice with finely chopped garden vegetables and aromatic spices.', price: 170, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800', isVeg: true, isAvailable: true },
        { restaurantId: geetham._id, categoryId: cat4._id, name: 'Filter Coffee', description: 'Authentic Kumbakonam degree filter coffee brewed with fresh frothy milk.', price: 45, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800', isVeg: true, isAvailable: true },
        { restaurantId: geetham._id, categoryId: cat4._id, name: 'Ghee Assorted Sweets Box (250g)', description: 'Selection of traditional ghee Mysurpa, Laddu, and Milk Sweets.', price: 190, image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800', isVeg: true, isAvailable: true }
      ]);

      // Create Slots
      await DeliverySlot.create([
        { restaurantId: geetham._id, date: 'Today', startTime: '12:00', endTime: '13:00', maxOrders: 20 },
        { restaurantId: geetham._id, date: 'Today', startTime: '13:00', endTime: '14:00', maxOrders: 20 },
        { restaurantId: geetham._id, date: 'Today', startTime: '19:00', endTime: '20:00', maxOrders: 20 },
        { restaurantId: geetham._id, date: 'Today', startTime: '20:00', endTime: '21:00', maxOrders: 20 }
      ]);
    }
  } catch (error) {
    console.error('Seed Database Error:', error.message);
  }
};
