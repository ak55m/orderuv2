import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../db';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.preview'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

interface StripeSubscription extends Stripe.Subscription {
  current_period_end: number;
}

interface StripeInvoice extends Stripe.Invoice {
  subscription: string;
}

// Helper function to safely convert Unix timestamp to Date
function safelyConvertTimestampToDate(timestamp: number | null | undefined): Date | null {
  if (!timestamp) return null;
  
  try {
    // Stripe timestamps are in seconds, JavaScript expects milliseconds
    const date = new Date(timestamp * 1000);
    
    // Validate the date is within reasonable range
    if (isNaN(date.getTime())) {
      console.warn(`⚠️ Invalid timestamp: ${timestamp}`);
      return null;
    }
    
    return date;
  } catch (error) {
    console.error(`❌ Error converting timestamp ${timestamp} to Date:`, error);
    return null;
  }
}

export default async function handler(req: Request, res: Response) {
  console.log('🔔 Webhook received');
  console.log('Headers:', req.headers);
  console.log('Body type:', typeof req.body);
  console.log('Body length:', req.body?.length);

  if (!webhookSecret) {
    console.error('❌ Missing STRIPE_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const sig = req.headers['stripe-signature'];
  console.log('Signature:', sig);

  if (!sig) {
    console.error('❌ No signature found in headers');
    return res.status(400).json({ error: 'No signature found' });
  }

  let event: Stripe.Event;

  try {
    console.log('🔍 Constructing Stripe event...');
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
    console.log('✅ Event constructed successfully');
    console.log('Event type:', event.type);
    console.log('Event data:', JSON.stringify(event.data.object, null, 2));
  } catch (err: any) {
    console.error('❌ Webhook Error:', err.message);
    console.error('Error details:', err);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    console.log('🔄 Processing event:', event.type);
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        console.log('📝 Processing subscription created/updated event');
        const subscription = event.data.object as StripeSubscription;
        const restaurantId = subscription.metadata.restaurantId;
        console.log('Restaurant ID:', restaurantId);
        console.log('Subscription status:', subscription.status);

        if (!restaurantId) {
          console.error('❌ No restaurantId in subscription metadata');
          throw new Error('No restaurantId in subscription metadata');
        }

        const isActive = subscription.status === 'active' || subscription.status === 'trialing';
        const currentPeriodEnd = subscription.items.data[0]?.current_period_end 
          ? safelyConvertTimestampToDate(subscription.items.data[0].current_period_end)
          : null;
        console.log('Is active:', isActive);
        
        if (currentPeriodEnd) {
          console.log('Current period end:', currentPeriodEnd.toISOString());
        } else {
          console.log('Current period end: Invalid or missing timestamp');
        }

        // If this is a new subscription or reactivation, fetch the invoice for payment details
        let paymentData = {};
        
        if ((subscription.status === 'active' || subscription.status === 'trialing') && 
            subscription.latest_invoice) {
          try {
            console.log('🔍 Fetching latest invoice:', subscription.latest_invoice);
            const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
            console.log('📄 Latest invoice status:', invoice.status);
            
            if (invoice.status === 'paid') {
              paymentData = {
                lastPaymentStatus: 'succeeded',
                lastPaymentDate: invoice.status_transitions?.paid_at 
                  ? new Date(invoice.status_transitions.paid_at * 1000) 
                  : new Date(invoice.created * 1000),
                lastPaymentAmount: invoice.amount_paid / 100 // Convert from cents to dollars
              };
              console.log('💰 Payment data from invoice:', paymentData);
            } else if (subscription.status === 'trialing') {
              paymentData = {
                lastPaymentStatus: 'trial',
                lastPaymentAmount: 0
              };
              console.log('📄 Trial subscription - no payment data');
            }
          } catch (error) {
            console.error('❌ Error fetching invoice:', error);
            paymentData = {
              lastPaymentStatus: subscription.status === 'active' ? 'succeeded' : subscription.status
            };
            console.log('📄 Using fallback payment data:', paymentData);
          }
        }

        await prisma.restaurant.update({
          where: { id: restaurantId },
          data: {
            isActive,
            subscriptionStatus: subscription.status,
            subscriptionCurrentPeriodEnd: currentPeriodEnd,
            stripeSubscriptionId: subscription.id,
            ...paymentData // Spread the payment data we collected
          }
        });
        console.log('✅ Restaurant subscription updated successfully');
        break;
      }

      case 'customer.subscription.deleted': {
        console.log('🗑️ Processing subscription deleted event');
        const subscription = event.data.object as StripeSubscription;
        const restaurantId = subscription.metadata.restaurantId;
        console.log('Restaurant ID:', restaurantId);

        if (!restaurantId) {
          console.error('❌ No restaurantId in subscription metadata');
          throw new Error('No restaurantId in subscription metadata');
        }

        await prisma.restaurant.update({
          where: { id: restaurantId },
          data: {
            isActive: false,
            subscriptionStatus: 'canceled',
            subscriptionCurrentPeriodEnd: null,
            stripeSubscriptionId: null
          }
        });
        console.log('✅ Restaurant subscription cancelled successfully');
        break;
      }

      case 'invoice.payment_succeeded': {
        console.log('💰 Processing successful payment event');
        const invoice = event.data.object as StripeInvoice;
        const subscriptionId = invoice.subscription;
        console.log('Subscription ID:', subscriptionId);
        
        if (!subscriptionId) {
          console.error('❌ No subscription ID in invoice');
          throw new Error('No subscription ID in invoice');
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const restaurantId = subscription.metadata.restaurantId;
        console.log('Restaurant ID:', restaurantId);

        if (!restaurantId) {
          console.error('❌ No restaurantId in subscription metadata');
          throw new Error('No restaurantId in subscription metadata');
        }

        // Extract payment details from the invoice
        const paymentAmount = invoice.amount_paid / 100; // Convert from cents to dollars
        const paymentDate = new Date(invoice.status_transitions?.paid_at 
          ? invoice.status_transitions.paid_at * 1000 
          : Date.now());
        console.log('💰 Payment amount:', paymentAmount);
        console.log('📅 Payment date:', paymentDate);

        await prisma.restaurant.update({
          where: { id: restaurantId },
          data: {
            isActive: true,
            subscriptionStatus: subscription.status,
            lastPaymentStatus: 'succeeded',
            lastPaymentDate: paymentDate,
            lastPaymentAmount: paymentAmount
          }
        });
        console.log('✅ Restaurant payment status updated successfully');
        break;
      }

      case 'invoice.payment_failed': {
        console.log('❌ Processing failed payment event');
        const invoice = event.data.object as StripeInvoice;
        const subscriptionId = invoice.subscription;
        console.log('Subscription ID:', subscriptionId);
        
        if (!subscriptionId) {
          console.error('❌ No subscription ID in invoice');
          throw new Error('No subscription ID in invoice');
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const restaurantId = subscription.metadata.restaurantId;
        console.log('Restaurant ID:', restaurantId);

        if (!restaurantId) {
          console.error('❌ No restaurantId in subscription metadata');
          throw new Error('No restaurantId in subscription metadata');
        }

        // For failed payments, we keep the previous payment amount and date
        await prisma.restaurant.update({
          where: { id: restaurantId },
          data: {
            isActive: false,
            subscriptionStatus: 'past_due',
            lastPaymentStatus: 'failed'
            // Don't update lastPaymentAmount or lastPaymentDate to preserve the last successful payment
          }
        });
        console.log('✅ Restaurant payment failure recorded');
        break;
      }

      case 'customer.subscription.trial_will_end': {
        console.log('⚠️ Processing trial ending soon event');
        const subscription = event.data.object as StripeSubscription;
        const restaurantId = subscription.metadata.restaurantId;
        console.log('Restaurant ID:', restaurantId);

        if (!restaurantId) {
          console.error('❌ No restaurantId in subscription metadata');
          throw new Error('No restaurantId in subscription metadata');
        }

        console.log(`⚠️ Trial ending soon for restaurant ${restaurantId}`);
        break;
      }

      default: {
        console.log('ℹ️ Unhandled event type:', event.type);
      }
    }

    console.log('✅ Webhook processed successfully');
    return res.json({ received: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    console.error('Error details:', error);
    return res.status(500).json({ error: 'Error processing webhook' });
  }
}