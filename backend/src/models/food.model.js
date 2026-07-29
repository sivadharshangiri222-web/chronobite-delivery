import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Food = mongoose.model('Food', foodSchema);
export default Food;
