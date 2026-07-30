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

// Single Unified Web App Production Build Serving
const customerDist = [
  path.join(__dirname, '../frontend/customer-app/dist'),
  path.join(process.cwd(), 'frontend/customer-app/dist'),
  path.join(process.cwd(), '../frontend/customer-app/dist'),
  path.resolve(__dirname, '../frontend/customer-app/dist')
].find((p) => fs.existsSync(p));

const adminDist = [
  path.join(__dirname, '../frontend/admin-dashboard/dist'),
  path.join(process.cwd(), 'frontend/admin-dashboard/dist'),
  path.join(process.cwd(), '../frontend/admin-dashboard/dist'),
  path.resolve(__dirname, '../frontend/admin-dashboard/dist')
].find((p) => fs.existsSync(p));

console.log('📦 Resolved Customer App Static Directory:', customerDist || 'NOT FOUND');
console.log('📦 Resolved Admin Dashboard Static Directory:', adminDist || 'NOT FOUND');

if (adminDist) {
  app.use('/admin', express.static(adminDist));
}

if (customerDist) {
  app.use(express.static(customerDist));
}

// Route Fallbacks for Single Page Applications (SPA) — Express 5 Compatible
app.use('/admin', (req, res, next) => {
  if (req.method !== 'GET') return next();
  if (adminDist && fs.existsSync(path.join(adminDist, 'index.html'))) {
    return res.sendFile(path.join(adminDist, 'index.html'));
  }
  if (customerDist && fs.existsSync(path.join(customerDist, 'admin/index.html'))) {
    return res.sendFile(path.join(customerDist, 'admin/index.html'));
  }
  next();
});

app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api') || req.path.startsWith('/invoices')) {
    return res.status(404).json({ message: 'API Route Not Found', code: 'NOT_FOUND' });
  }
  if (customerDist && fs.existsSync(path.join(customerDist, 'index.html'))) {
    return res.sendFile(path.join(customerDist, 'index.html'));
  }
  next();
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
