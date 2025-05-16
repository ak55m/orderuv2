'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import Payments from '@/pages/payments';

export default function PaymentsPage() {
  return (
    <ProtectedRoute>
      <Payments />
    </ProtectedRoute>
  );
} 