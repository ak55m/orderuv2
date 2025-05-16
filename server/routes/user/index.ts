import express from 'express';
import { prisma } from '../../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';


const router = express.Router();

// Check if email exists
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    return res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Merchant Register
router.post('/merchant-register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if merchant already exists
    const existingMerchant = await prisma.user.findUnique({
      where: { email }
    });

    if (existingMerchant) {
      return res.status(400).json({ message: 'Merchant already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user, restaurant, and merchant in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create user first
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'MERCHANT'
        }
      });

      // Create restaurant
      const restaurant = await tx.restaurant.create({
        data: {
          email,
          isActive: false,
          subscriptionStatus: 'none'
        }
      });

      // Create merchant relation
      const merchant = await tx.merchant.create({
        data: {
          userId: user.id,
          restaurantId: restaurant.id,
          role: 'OWNER'
        }
      });

      return { user, restaurant, merchant };
    });

    // Generate token
    const token = jwt.sign(
      {
        userId: result.user.id,
        restaurantId: result.restaurant.id
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        restaurantId: result.restaurant.id
      }
    });
  } catch (error) {
    console.error('Error registering merchant:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Merchant Login
router.post('/merchant-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find merchant with restaurant
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        merchant: {
          include: {
            restaurant: true
          }
        }
      }
    });

    if (
      !user ||
      user.role !== 'MERCHANT' ||
      !user.merchant ||
      !user.merchant.restaurant
    ) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        restaurantId: user.merchant.restaurant.id
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        restaurantId: user.merchant.restaurant.id
      }
    });
  } catch (error) {
    console.error('Error logging in merchant:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Delete account
router.delete('/delete-account', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const restaurantId = decoded.restaurantId;
    const userId = decoded.userId;

    // Delete the restaurant and all related data
    await prisma.restaurant.delete({
      where: { id: restaurantId }
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    return res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ error: 'Error deleting account' });
  }
});

export default router; 