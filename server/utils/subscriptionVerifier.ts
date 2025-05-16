import Stripe from 'stripe';
import { prisma } from '../db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.preview'
});

interface StripeSubscription extends Stripe.Subscription {
  current_period_end: number;
}

export interface SubscriptionStatus {
  isValid: boolean;
  isActive: boolean;
  isExpired: boolean;
  subscriptionId?: string;
  currentPeriodEnd?: Date;
  error?: string;
}

export async function verifySubscription(restaurantId: string): Promise<SubscriptionStatus> {
  try {
    // Get restaurant from database
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: {
        id: true,
        isActive: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionCurrentPeriodEnd: true,
        lastPaymentStatus: true
      },
    });

    if (!restaurant) {
      return {
        isValid: false,
        isActive: false,
        isExpired: false,
        error: 'Restaurant not found',
      };
    }

    // If no subscription found
    if (!restaurant.stripeCustomerId || !restaurant.stripeSubscriptionId) {
      return {
        isValid: false,
        isActive: false,
        isExpired: false,
        error: 'No subscription found',
      };
    }

    // Verify subscription with Stripe
    const response = await stripe.subscriptions.retrieve(restaurant.stripeSubscriptionId);
    const subscription = response as unknown as StripeSubscription;

    // Check subscription status
    const isActive = subscription.status === 'active' || subscription.status === 'trialing';
    const isExpired = new Date(subscription.current_period_end * 1000) < new Date();

    // Update database if subscription status has changed
    if (restaurant.isActive !== isActive || restaurant.subscriptionStatus !== subscription.status) {
      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          isActive,
          subscriptionStatus: subscription.status,
          subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          lastPaymentStatus: subscription.status
        },
      });
    }

    return {
      isValid: isActive && !isExpired && restaurant.lastPaymentStatus === 'succeeded',
      isActive,
      isExpired,
      subscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    };
  } catch (error) {
    console.error('Subscription verification error:', error);
    return {
      isValid: false,
      isActive: false,
      isExpired: false,
      error: 'Failed to verify subscription',
    };
  }
} 