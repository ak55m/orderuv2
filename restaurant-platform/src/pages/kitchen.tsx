'use client';

import Sidebar from '@/components/layouts/Sidebar';

export default function Kitchen() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Kitchen Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Active Orders Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Orders</h2>
              <div className="space-y-4">
                {/* Placeholder for active orders */}
                <p className="text-gray-600">No active orders</p>
              </div>
            </div>

            {/* Preparation Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">In Preparation</h2>
              <div className="space-y-4">
                {/* Placeholder for items in preparation */}
                <p className="text-gray-600">No items in preparation</p>
              </div>
            </div>

            {/* Ready for Pickup Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ready for Pickup</h2>
              <div className="space-y-4">
                {/* Placeholder for ready items */}
                <p className="text-gray-600">No items ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 