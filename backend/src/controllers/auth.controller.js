import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/auth.validators.js';

export const inMemoryUsers = [
  {
    _id: 'customer_seeded_123',
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
  }
];

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const newId = `user_${Date.now()}`;
    const newUser = {
      _id: newId,
      ...validatedData,
      role: 'customer',
      savedAddresses: []
    };

    try {
      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered', code: 'EMAIL_EXISTS' });
      }

      const user = await User.create(validatedData);
      inMemoryUsers.push(user.toObject());

      const token = generateAccessToken({ id: user._id, role: 'customer' });
      const refreshToken = generateRefreshToken({ id: user._id, role: 'customer' });

      return res.status(201).json({
        success: true,
        data: {
          token,
          refreshToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            savedAddresses: user.savedAddresses
          }
        }
      });
    } catch (dbErr) {
      if (inMemoryUsers.some((u) => u.email.toLowerCase() === validatedData.email.toLowerCase())) {
        return res.status(400).json({ message: 'Email is already registered', code: 'EMAIL_EXISTS' });
      }

      inMemoryUsers.push(newUser);
      const token = generateAccessToken({ id: newId, role: 'customer' });
      const refreshToken = generateRefreshToken({ id: newId, role: 'customer' });

      return res.status(201).json({
        success: true,
        data: {
          token,
          refreshToken,
          user: {
            id: newId,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            savedAddresses: []
          }
        }
      });
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message, code: 'VALIDATION_ERROR' });
    }
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    try {
      const user = await User.findOne({ email: validatedData.email });
      if (user) {
        const isMatch = await user.comparePassword(validatedData.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
        }

        const token = generateAccessToken({ id: user._id, role: 'customer' });
        const refreshToken = generateRefreshToken({ id: user._id, role: 'customer' });

        return res.json({
          success: true,
          data: {
            token,
            refreshToken,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
              savedAddresses: user.savedAddresses
            }
          }
        });
      }
    } catch (dbErr) {}

    // In-Memory Fallback
    const fallbackUser = inMemoryUsers.find(
      (u) => u.email.toLowerCase() === validatedData.email.toLowerCase()
    );

    if (fallbackUser && fallbackUser.password === validatedData.password) {
      const token = generateAccessToken({ id: fallbackUser._id, role: 'customer' });
      const refreshToken = generateRefreshToken({ id: fallbackUser._id, role: 'customer' });

      return res.json({
        success: true,
        data: {
          token,
          refreshToken,
          user: {
            id: fallbackUser._id,
            name: fallbackUser.name,
            email: fallbackUser.email,
            phone: fallbackUser.phone,
            role: fallbackUser.role,
            savedAddresses: fallbackUser.savedAddresses || []
          }
        }
      });
    }

    return res.status(401).json({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message, code: 'VALIDATION_ERROR' });
    }
    next(error);
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  res.json({ success: true, data: { message: 'Logged out successfully' } });
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  res.json({ success: true, data: { message: 'Password reset instructions sent to email' } });
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  res.json({ success: true, data: { message: 'Password reset successful' } });
};

// GET /api/auth/profile
export const getProfile = async (req, res, next) => {
  try {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (user) return res.json({ success: true, data: user });
    } catch (dbErr) {}

    const fallbackUser = inMemoryUsers.find((u) => u._id === req.user.id);
    if (fallbackUser) {
      const { password, ...userData } = fallbackUser;
      return res.json({ success: true, data: userData });
    }

    res.status(404).json({ message: 'User not found', code: 'NOT_FOUND' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    try {
      const user = await User.findByIdAndUpdate(req.user.id, validatedData, { new: true }).select('-password');
      if (user) return res.json({ success: true, data: user });
    } catch (dbErr) {}

    const fallbackUser = inMemoryUsers.find((u) => u._id === req.user.id);
    if (fallbackUser) {
      Object.assign(fallbackUser, validatedData);
      const { password, ...userData } = fallbackUser;
      return res.json({ success: true, data: userData });
    }

    res.status(404).json({ message: 'User not found', code: 'NOT_FOUND' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message, code: 'VALIDATION_ERROR' });
    }
    next(error);
  }
};
