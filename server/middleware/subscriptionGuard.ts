import { Request, Response, NextFunction } from 'express';
import { verifySubscription } from '../utils/subscriptionVerifier';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    restaurantId: string;
  };
}

// List of paths that don't require subscription
const ALLOWED_PATHS = [
  '/subscription',
  '/check-email',
  '/merchant-register',
  '/merchant-login'
];

export const subscriptionGuard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check if the current path is in the allowed paths
    const isAllowedPath = ALLOWED_PATHS.some(path => req.path.endsWith(path));
    
    if (isAllowedPath) {
      return next();
    }

    if (!req.user?.restaurantId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify subscription status with Stripe
    const subscriptionStatus = await verifySubscription(req.user.restaurantId);
    
    if (!subscriptionStatus.isValid) {
      return res.status(403).json({
        message: subscriptionStatus.error || 'Subscription required',
        subscriptionRequired: true,
        isNewAccount: true,
        redirectTo: '/subscription'
      });
    }
    
    if (!subscriptionStatus.isActive) {
      return res.status(403).json({
        message: 'Subscription inactive',
        subscriptionRequired: true,
        isNewAccount: false,
        redirectTo: '/subscription'
      });
    }
    
    if (subscriptionStatus.isExpired) {
      return res.status(403).json({
        message: 'Subscription expired',
        subscriptionRequired: true,
        isNewAccount: false,
        redirectTo: '/subscription'
      });
    }
    
    // All checks passed, proceed
    return next();
  } catch (error) {
    console.error('Subscription guard error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};