'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import Reviews from '@/pages/reviews';

export default function ReviewsPage() {
  return (
    <ProtectedRoute>
      <Reviews />
    </ProtectedRoute>
  );
} 