'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import Kitchen from '@/pages/kitchen';

export default function KitchenPage() {
  return (
    <ProtectedRoute>
      <Kitchen />
    </ProtectedRoute>
  );
} 