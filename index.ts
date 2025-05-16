import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { prisma } from './db/index';
import merchantRouter from './routes/merchant';
import userRouter from './routes/user';
import stripeRoutes from './routes/api/stripe';
import stripeWebhookHandler from './routes/api/stripe-webhook-handler';
import authRouter from './routes/auth';



// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// 1. Handle webhook route first, with broader content type matching
app.post('/api/sub/stripe-webhook', express.raw({ type: '*/*' }), (req, res, next) => {
  
  // Add debug logging
  console.log('Webhook endpoint hit');
  console.log('Content-Type:', req.headers['content-type']);
  
  // Pass to the handler
  return stripeWebhookHandler(req, res);
});


app.use(cors());
// Handle JSON bodies for all other routes
app.use(express.json());


// REST API routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/merchant', merchantRouter);
app.use('/api/sub', stripeRoutes);


// GraphQL setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  try {
    // ✅ Test DB connection
    await prisma.$connect();
    console.log('✅ Database connection established');
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err);
    process.exit(1); // Exit if DB is not connected
  }

  await server.start();

  // Apply GraphQL middleware
  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        prisma,
        token: req.headers.authorization,
      }),
    })
  );

  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`🔗 GraphQL endpoint: http://localhost:${port}/graphql`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
