'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import Promotions from '@/pages/promotions';

export default function PromotionsPage() {
  return (
    <ProtectedRoute>
      <Promotions />
    </ProtectedRoute>
  );
} 