import mongoose from 'mongoose';
import { verifyToken } from '../utils/jwt.js';
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';
import { inMemoryAdmins } from '../controllers/admin.controller.js';
import { inMemoryUsers } from '../controllers/auth.controller.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication token missing or invalid',
        code: 'UNAUTHORIZED'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      console.error('JWT Verification Error:', err.message);
      return res.status(401).json({
        message: 'Invalid or expired token',
        code: 'UNAUTHORIZED'
      });
    }


    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: 'Invalid token payload',
        code: 'UNAUTHORIZED'
      });
    }

    if (decoded.role === 'admin') {
      let admin = null;
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(decoded.id)) {
        try {
          admin = await Admin.findById(decoded.id).select('-password').lean();
        } catch (dbErr) {}
      }

      if (!admin) {
        admin = inMemoryAdmins.find((a) => a._id.toString() === decoded.id.toString()) || {
          _id: decoded.id,
          name: 'ChronoAdmin',
          email: 'admin@chronobite.com',
          role: 'admin'
        };
      }

      req.user = { id: admin._id, name: admin.name, email: admin.email, role: 'admin' };
    } else {
      let user = null;
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(decoded.id)) {
        try {
          user = await User.findById(decoded.id).select('-password').lean();
        } catch (dbErr) {}
      }

      if (!user) {
        user = inMemoryUsers.find((u) => u._id.toString() === decoded.id.toString()) || {
          _id: decoded.id,
          name: 'Customer',
          email: 'customer@chronobite.com',
          role: 'customer'
        };
      }

      req.user = { id: user._id, name: user.name, email: user.email, phone: user.phone, role: 'customer' };
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token',
      code: 'UNAUTHORIZED'
    });
  }
};
