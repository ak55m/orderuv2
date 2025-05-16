'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { useRouter } from 'next/navigation';
import { restaurantApi } from '@/api/restaurantApi';

export default function Subscriptions() {
  const router = useRouter();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await restaurantApi.checkSubscription();
      setHasActiveSubscription(response.isActive && response.subscriptionStatus === 'active');
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await restaurantApi.createCheckoutSession();
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await restaurantApi.createCustomerPortalSession();
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Error creating customer portal session:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await restaurantApi.deleteAccount();
      // Clear local storage and redirect to auth page
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/auth');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscriptions</h1>

          <p className="mt-2 mb-4 text-gray-600">
            View and manage your subscription plans
          </p>

          <div className="bg-white rounded-lg shadow p-6">
            {hasActiveSubscription ? (
              <div className="text-center">
                <p className="text-green-600 mb-6">You have an active subscription</p>
                <button 
                  onClick={handleManageSubscription}
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage Subscription
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="mt-4 inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 mb-6">No active subscription</p>
                <button 
                  onClick={handleSubscribe}
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Subscribe Today
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="mt-4 inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 