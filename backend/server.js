import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import { errorHandler } from './src/middleware/errorHandler.middleware.js';

// Import Routes
import authRoutes from './src/routes/auth.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import locationRoutes from './src/routes/location.routes.js';
import restaurantRoutes from './src/routes/restaurant.routes.js';
import adminRestaurantRoutes from './src/routes/admin.restaurant.routes.js';
import categoryRoutes from './src/routes/category.routes.js';
import foodRoutes from './src/routes/food.routes.js';
import slotRoutes from './src/routes/slot.routes.js';
import cartRoutes from './src/routes/cart.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import refundRoutes from './src/routes/refund.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false
  })
);
app.use(
  cors({
    origin: '*',
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve generated invoices statically
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/restaurants', adminRestaurantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/refunds', refundRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ChronoBite API Server is healthy' });
});

// Dynamic Multi-Path Static File Resolution Middleware
const findDist = (subpath) => {
  const candidates = [
    path.join(__dirname, subpath),
    path.join(process.cwd(), subpath.replace('../', '')),
    path.join(process.cwd(), subpath),
    path.resolve(__dirname, subpath)
  ];
  return candidates.find((p) => fs.existsSync(p));
};

// Admin Dashboard Static Middleware
app.use('/admin', (req, res, next) => {
  const adminPath = findDist('../frontend/admin-dashboard/dist') || findDist('../frontend/customer-app/dist/admin');
  if (adminPath) {
    return express.static(adminPath)(req, res, next);
  }
  next();
});

app.get(/^\/admin\/.*/, (req, res, next) => {
  const adminPath = findDist('../frontend/admin-dashboard/dist') || findDist('../frontend/customer-app/dist/admin');
  if (adminPath) {
    const indexPath = path.join(adminPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  next();
});

// Customer App Static Middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/invoices') || req.path.startsWith('/admin')) {
    return next();
  }
  const customerPath = findDist('../frontend/customer-app/dist');
  if (customerPath) {
    return express.static(customerPath)(req, res, next);
  }
  next();
});

app.get(/^(?!\/api|\/invoices|\/admin).*/, (req, res, next) => {
  const customerPath = findDist('../frontend/customer-app/dist');
  if (customerPath) {
    const indexPath = path.join(customerPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  res.status(404).send('ChronoBite Application is starting up. Please refresh in a moment.');
});

// Global Error Handler
app.use(errorHandler);

const PORT = config.port;

const startServer = async () => {
  await connectDB();
  if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
      console.log(`🚀 ChronoBite Server running on http://localhost:${PORT}`);
    });
  }
};

startServer();

export default app;
