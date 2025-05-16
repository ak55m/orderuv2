'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import Orders from '@/pages/orders';

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  );
} 