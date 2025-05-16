'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import Subscriptions from '@/pages/subscriptions';

export default function SubscriptionsPage() {
  return (
    <ProtectedRoute>
      <Subscriptions />
    </ProtectedRoute>
  );
} 