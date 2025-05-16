'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import Settings from '@/pages/settings';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  );
} 