import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // 'daily_summary', 'restaurant_sales', etc.
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    date: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
