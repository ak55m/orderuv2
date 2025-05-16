'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('LocalStorage:', {
      user: localStorage.getItem('user'),
      token: localStorage.getItem('token')
    });
    console.log('Redux State:', {
      isAuthenticated,
      token
    });

    // If user is authenticated, redirect to dashboard
    if (isAuthenticated && token) {
      router.replace('/dashboard');
    } else {
      // If not authenticated, allow access to auth pages
      setIsLoading(false);
    }
  }, [isAuthenticated, token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show the auth pages
  if (!isAuthenticated || !token) {
    return <>{children}</>;
  }

  // If authenticated, don't render anything (will be redirected to dashboard)
  return null;
} 