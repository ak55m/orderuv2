import express from 'express';
import Stripe from 'stripe';
import { prisma } from '../db';
import { authGuard } from '../middleware/authGuard';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.preview'
});

const router = express.Router();

// Apply auth guard to all routes
router.use(authGuard);

// Get subscription status
router.get('/subscription', async (req, res) => {
  try {
    const restaurantId = (req as any).user.restaurantId;
    console.log('Checking subscription for restaurant:', restaurantId);

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

    console.log('Restaurant data from DB:', restaurant);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Transform the response to match the expected format
    const response = {
      isValid: restaurant.isActive && restaurant.subscriptionStatus === 'active',
      isActive: restaurant.isActive,
      isExpired: restaurant.subscriptionCurrentPeriodEnd ? new Date(restaurant.subscriptionCurrentPeriodEnd) < new Date() : true,
      subscriptionId: restaurant.stripeSubscriptionId,
      currentPeriodEnd: restaurant.subscriptionCurrentPeriodEnd,
      hasActiveSubscription: restaurant.isActive && restaurant.subscriptionStatus === 'active',
      isSubscriptionValid: restaurant.isActive && restaurant.subscriptionStatus === 'active',
      lastPaymentStatus: restaurant.lastPaymentStatus,
      lastPaymentDate: restaurant.lastPaymentDate,
      lastPaymentAmount: restaurant.lastPaymentAmount
    };

    console.log('Transformed response:', response);

    return res.json(response);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const restaurantId = (req as any).user.restaurantId;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Create or retrieve Stripe customer
    let customerId = restaurant.stripeCustomerId;
    console.log('🔍 Looking up customer for restaurant:', {
      restaurantId,
      email: restaurant.email,
      existingStripeCustomerId: customerId
    });

    if (!customerId) {
      // First, try to find an existing customer with this email
      console.log('📧 Searching Stripe for customer with email:', restaurant.email);
      const existingCustomers = await stripe.customers.list({
        email: restaurant.email,
        limit: 1
      });

      console.log('🔎 Stripe customer search results:', {
        found: existingCustomers.data.length > 0,
        totalCustomers: existingCustomers.data.length,
        customers: existingCustomers.data.map(c => ({
          id: c.id,
          email: c.email,
          name: c.name,
          metadata: c.metadata,
          defaultPaymentMethod: c.invoice_settings?.default_payment_method,
          created: new Date(c.created * 1000).toISOString()
        }))
      });

      if (existingCustomers.data.length > 0) {
        // Use the existing customer
        const existingCustomer = existingCustomers.data[0];
        customerId = existingCustomer.id;
        console.log('✅ Found existing Stripe customer:', {
          customerId,
          email: existingCustomer.email,
          name: existingCustomer.name,
          metadata: existingCustomer.metadata,
          defaultPaymentMethod: existingCustomer.invoice_settings?.default_payment_method,
          created: new Date(existingCustomer.created * 1000).toISOString()
        });
        
        // Log all payment methods
        const paymentMethods = await stripe.paymentMethods.list({
          customer: customerId,
          type: 'card'
        });
        console.log('💳 Available payment methods:', paymentMethods.data.map(pm => ({
          id: pm.id,
          last4: pm.card?.last4,
          brand: pm.card?.brand,
          expMonth: pm.card?.exp_month,
          expYear: pm.card?.exp_year,
          isDefault: pm.id === existingCustomer.invoice_settings?.default_payment_method
        })));
      } else {
        // Create a new customer if none exists
        console.log('🆕 No existing customer found, creating new Stripe customer');
        const customer = await stripe.customers.create({
          email: restaurant.email,
          metadata: {
            restaurantId,
            platform: 'OrderU'
          }
        });
        customerId = customer.id;
        console.log('✅ Created new Stripe customer:', {
          customerId,
          email: customer.email,
          metadata: customer.metadata,
          created: new Date(customer.created * 1000).toISOString()
        });
      }

      // Update restaurant with the customer ID
      console.log('📝 Updating restaurant with Stripe customer ID:', customerId);
      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: { stripeCustomerId: customerId }
      });
    } else {
      // Log payment methods for existing customer
      console.log('🔍 Retrieving existing customer details:', customerId);
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      console.log('✅ Retrieved customer details:', {
        customerId,
        email: customer.email,
        name: customer.name,
        metadata: customer.metadata,
        defaultPaymentMethod: customer.invoice_settings?.default_payment_method,
        created: customer.created ? new Date(customer.created * 1000).toISOString() : null
      });
      
      // Log all payment methods
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });
      console.log('💳 Available payment methods:', paymentMethods.data.map(pm => ({
        id: pm.id,
        last4: pm.card?.last4,
        brand: pm.card?.brand,
        expMonth: pm.card?.exp_month,
        expYear: pm.card?.exp_year,
        isDefault: pm.id === customer.invoice_settings?.default_payment_method
      })));
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

    // Create checkout session
    console.log('🛍️ Creating checkout session for customer:', customerId);
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Standard Plan',
              description: 'Monthly subscription for restaurant platform',
            },
            unit_amount: 6000, // $60.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/subscriptions`,
      cancel_url: `${baseUrl}/subscriptions`,
      metadata: {
        restaurantId,
        platform: 'OrderU'
      },
      subscription_data: {
        metadata: {
          restaurantId,
          platform: 'OrderU'
        },
      }
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      customerId: session.customer,
      subscriptionId: session.subscription,
      url: session.url
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Error creating checkout session' });
  }
});

// Create a subscription (for future use with saved payment methods)
router.post('/create-subscription', async (req, res) => {
  try {
    const { priceId, paymentMethodId } = req.body;
    const restaurantId = (req as any).user.restaurantId;

    if (!priceId || !paymentMethodId) {
      return res.status(400).json({ error: 'Price ID and payment method ID are required' });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Create or retrieve Stripe customer
    let customerId = restaurant.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: restaurant.email,
        metadata: {
          restaurantId
        }
      });
      customerId = customer.id;
      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: { stripeCustomerId: customerId }
      });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata: {
        restaurantId
      },
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    });

    // Update restaurant with subscription info
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        stripeSubscriptionId: subscription.id,
        isActive: true,
        subscriptionStatus: subscription.status,
        subscriptionCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        lastPaymentStatus: subscription.status
      }
    });

    return res.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any).payment_intent?.client_secret
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return res.status(500).json({ error: 'Error creating subscription' });
  }
});

// Create a customer portal session
router.post('/create-portal-session', async (req, res) => {
  try {
    const restaurantId = (req as any).user.restaurantId;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (!restaurant.stripeCustomerId) {
      return res.status(400).json({ error: 'No Stripe customer found' });
    }

    // Return the direct Customer Portal URL
    return res.json({ 
      url: 'https://billing.stripe.com/p/login/test_14A28r4T8b0d8I643DcQU00'
    });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return res.status(500).json({ error: 'Error creating portal session' });
  }
});

export default router; 