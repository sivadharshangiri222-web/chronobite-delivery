import Order from '../models/order.model.js';
import Restaurant from '../models/restaurant.model.js';
import User from '../models/user.model.js';
import Payment from '../models/payment.model.js';

export const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalActiveRestaurants = await Restaurant.countDocuments({ isActive: true, isDeleted: false });
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    const revenueResult = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);

    const totalRevenuePaise = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const totalRevenue = totalRevenuePaise / 100;

    const recentOrders = await Order.find()
      .populate('userId', 'name')
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalActiveRestaurants,
        totalCustomers,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};
