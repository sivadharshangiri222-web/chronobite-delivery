import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5005,
  nodeEnv: process.env.NODE_ENV || 'development',

  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chronobite',
  jwtSecret: process.env.JWT_SECRET || 'chronobite_jwt_super_secret_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_chronobite123',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'chronobite_razorpay_secret_key_123',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'chronobite_razorpay_webhook_secret_123',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};
