'use client';

import Sidebar from '@/components/layouts/Sidebar';

export default function Menu() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Menu Management</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Menu Categories */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
              <div className="space-y-4">
                <p className="text-gray-600">No categories added yet</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Menu Items</h2>
              <div className="space-y-4">
                <p className="text-gray-600">No menu items added yet</p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
} 