import express from 'express';
import { prisma } from '../../db';
import { authGuard } from '../../middleware/authGuard';
import { subscriptionGuard } from '../../middleware/subscriptionGuard';

const router = express.Router();

// Apply auth guard to all routes
router.use(authGuard);

// Apply subscription guard to all routes except settings and subscription
router.use((req, res, next) => {
  if (req.path === '/settings' || req.path === '/subscription') {
    next();
  } else {
    subscriptionGuard(req, res, next);
  }
});


// Get subscription status
router.get('/subscription', async (req, res) => {
  try {
    const restaurantId = (req as any).user.restaurantId;
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: {
        isActive: true,
        subscriptionStatus: true,
        subscriptionCurrentPeriodEnd: true,
        lastPaymentStatus: true,
        lastPaymentDate: true,
        lastPaymentAmount: true,
        stripeSubscriptionId: true
      }
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Validate subscription status
    const isSubscriptionValid = 
      restaurant.isActive && 
      restaurant.subscriptionStatus === 'active' &&
      restaurant.subscriptionCurrentPeriodEnd && 
      new Date(restaurant.subscriptionCurrentPeriodEnd) > new Date() &&
      restaurant.lastPaymentStatus === 'succeeded';

    return res.json({
      ...restaurant,
      isSubscriptionValid,
      hasActiveSubscription: isSubscriptionValid
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 