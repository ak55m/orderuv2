'use client';

import Sidebar from '@/components/layouts/Sidebar';

export default function Settings() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>

          <p className="mt-2 mb-4 text-gray-600">
            Manage your restaurant settings and preferences
          </p>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center text-gray-500">
              Settings configuration coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 