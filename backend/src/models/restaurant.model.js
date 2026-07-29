import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    cuisineType: [{ type: String, required: true }],
    image: { type: String, default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude] — GeoJSON format
        required: true
      }
    },
    openingHours: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
      days: [{ type: String, default: 'Mon-Sun' }]
    },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 },
    totalReviews: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

// Create 2dsphere index for geolocation distance queries
restaurantSchema.index({ coordinates: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
