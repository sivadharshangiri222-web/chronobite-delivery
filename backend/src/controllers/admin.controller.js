import Admin from '../models/admin.model.js';
import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { adminLoginSchema } from '../validators/auth.validators.js';

// In-Memory Fallback Admins Store
export const inMemoryAdmins = [
  {
    _id: 'admin_seeded_123',
    name: 'ChronoAdmin',
    email: 'admin@chronobite.com',
    password: 'admin123password',
    role: 'admin'
  }
];

// POST /api/admin/login
export const adminLogin = async (req, res, next) => {
  try {
    const validatedData = adminLoginSchema.parse(req.body);

    try {
      // First check if email belongs to a customer in DB
      const userCustomer = await User.findOne({ email: validatedData.email });
      if (userCustomer) {
        return res.status(403).json({
          message: 'Forbidden. Customer accounts cannot access the admin portal.',
          code: 'FORBIDDEN'
        });
      }

      const admin = await Admin.findOne({ email: validatedData.email });
      if (admin) {
        const isMatch = await admin.comparePassword(validatedData.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid admin credentials', code: 'INVALID_CREDENTIALS' });
        }

        const token = generateAccessToken({ id: admin._id, role: 'admin' });
        const refreshToken = generateRefreshToken({ id: admin._id, role: 'admin' });

        return res.json({
          success: true,
          data: {
            token,
            refreshToken,
            admin: {
              id: admin._id,
              name: admin.name,
              email: admin.email,
              role: admin.role
            }
          }
        });
      }
    } catch (dbErr) {
      // Mongoose / DB offline fallback
    }

    // In-memory fallback check
    if (validatedData.email === 'customer@chronobite.com') {
      return res.status(403).json({
        message: 'Forbidden. Customer accounts cannot access the admin portal.',
        code: 'FORBIDDEN'
      });
    }

    const fallbackAdmin = inMemoryAdmins.find(
      (a) => a.email.toLowerCase() === validatedData.email.toLowerCase()
    );

    if (fallbackAdmin && fallbackAdmin.password === validatedData.password) {
      const token = generateAccessToken({ id: fallbackAdmin._id, role: 'admin' });
      const refreshToken = generateRefreshToken({ id: fallbackAdmin._id, role: 'admin' });

      return res.json({
        success: true,
        data: {
          token,
          refreshToken,
          admin: {
            id: fallbackAdmin._id,
            name: fallbackAdmin.name,
            email: fallbackAdmin.email,
            role: fallbackAdmin.role
          }
        }
      });
    }

    return res.status(401).json({ message: 'Invalid admin credentials', code: 'INVALID_CREDENTIALS' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message, code: 'VALIDATION_ERROR' });
    }
    next(error);
  }
};

// POST /api/admin/logout
export const adminLogout = async (req, res) => {
  res.json({ success: true, data: { message: 'Admin logged out successfully' } });
};

// GET /api/admin/profile
export const getAdminProfile = async (req, res, next) => {
  try {
    try {
      const admin = await Admin.findById(req.user.id).select('-password');
      if (admin) return res.json({ success: true, data: admin });
    } catch (dbErr) {}

    const fallbackAdmin = inMemoryAdmins.find((a) => a._id === req.user.id);
    if (fallbackAdmin) {
      const { password, ...adminData } = fallbackAdmin;
      return res.json({ success: true, data: adminData });
    }

    res.status(404).json({ message: 'Admin not found', code: 'NOT_FOUND' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/profile
export const updateAdminProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    try {
      const admin = await Admin.findByIdAndUpdate(req.user.id, { name }, { new: true }).select('-password');
      if (admin) return res.json({ success: true, data: admin });
    } catch (dbErr) {}

    const fallbackAdmin = inMemoryAdmins.find((a) => a._id === req.user.id);
    if (fallbackAdmin) {
      fallbackAdmin.name = name || fallbackAdmin.name;
      const { password, ...adminData } = fallbackAdmin;
      return res.json({ success: true, data: adminData });
    }

    res.status(404).json({ message: 'Admin not found', code: 'NOT_FOUND' });
  } catch (error) {
    next(error);
  }
};
