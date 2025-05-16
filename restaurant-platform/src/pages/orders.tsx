'use client';

import Sidebar from '@/components/layouts/Sidebar';

export default function Orders() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Orders</h1>



            <p className="mt-2 mb-4 text-gray-600">
              Manage and track all your restaurant orders
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center text-gray-500">
              No orders have been placed yet
            </div>
          </div>




      </div>
    </div>
  );
} 