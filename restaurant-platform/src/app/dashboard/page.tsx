'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import Dashboard from '@/pages/dashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
} 