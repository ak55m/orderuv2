'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import Menu from '@/pages/menu';

export default function MenuPage() {
  return (
    <ProtectedRoute>
      <Menu />
    </ProtectedRoute>
  );
} 