'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import SubscriptionDialog from './SubscriptionDialog';
import { restaurantApi } from '@/api/restaurantApi';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (!isAuthenticated) {
          router.push('/auth');
          return;
        }

        // Check subscription status
        const response = await restaurantApi.checkSubscription();
        console.log('Subscription check response:', response);

        // Check if subscription is valid
        const isSubscriptionValid = 
          response.isActive && 
          response.subscriptionStatus === 'active' &&
          new Date(response.subscriptionCurrentPeriodEnd) > new Date() &&
          response.lastPaymentStatus === 'succeeded';

        console.log('Subscription validation:', {
          isActive: response.isActive,
          subscriptionStatus: response.subscriptionStatus,
          currentPeriodEnd: response.subscriptionCurrentPeriodEnd,
          isFutureDate: new Date(response.subscriptionCurrentPeriodEnd) > new Date(),
          lastPaymentStatus: response.lastPaymentStatus,
          finalResult: isSubscriptionValid
        });

        if (!isSubscriptionValid) {
          console.log('Subscription is not valid, showing dialog');
          setShowSubscriptionDialog(true);
        } else {
          console.log('Subscription is valid, not showing dialog');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {children}
      <SubscriptionDialog 
        isOpen={showSubscriptionDialog} 
        onClose={() => setShowSubscriptionDialog(false)} 
      />
    </>
  );
} 