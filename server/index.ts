import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { prisma } from './db/index';
import merchantRouter from './routes/merchant';
import userRouter from './routes/user';
import stripeRoutes from './api/stripe';
import stripeWebhookHandler from './api/stripe-webhook-handler';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  process.env.CUSTOMER_PLATFORM_URL,
  process.env.RESTAURANT_PLATFORM_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Handle webhook route first, with raw body parsing
app.post('/api/sub/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  return stripeWebhookHandler(req, res);
});

// Parse JSON bodies for all other routes
app.use(express.json());

// REST API routes
app.use('/api/user', userRouter);
app.use('/api/merchant', merchantRouter);
app.use('/api/sub', stripeRoutes);

// Start server
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection established');
    
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
      console.log('🌐 Allowed CORS origins:', allowedOrigins);
    });
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err);
    process.exit(1);
  }
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
