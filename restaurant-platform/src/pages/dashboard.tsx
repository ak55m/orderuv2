'use client';

import Sidebar from '@/components/layouts/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.email}
          </h1>
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <p className="mt-2 text-gray-600">
              This is a protected page. Only authenticated users can see this.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 