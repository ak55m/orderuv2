'use client';

import { AuthGuard } from '@/components/AuthGuard';
import Portal from '@/pages/portal';

export default function AuthPage() {
  return (
    <AuthGuard>
      <Portal />
    </AuthGuard>
  );
} 