'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import LogoutButton from '../LogoutButton';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  if (!mounted) {
    return <div className="w-64 bg-navy-900 h-screen shadow-lg" />;
  }

  return (
    <div className={`bg-navy-900 h-screen shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between">
        <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
          <h1 className="text-xl font-bold text-white">Restaurant Platform</h1>
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-navy-800 text-white"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="mt-6">
        <Link 
          href="/dashboard" 
          className={`flex items-center px-4 py-3 text-gray-300 hover:bg-navy-800 ${
            isActive('/dashboard') ? 'bg-navy-800 border-r-4 border-blue-500' : ''
          }`}
        >
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
        </Link>

        <Link 
          href="/kitchen" 
          className={`flex items-center px-4 py-3 text-gray-300 hover:bg-navy-800 ${
            isActive('/kitchen') ? 'bg-navy-800 border-r-4 border-blue-500' : ''
          }`}
        >
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Kitchen</span>
        </Link>

        <Link 
          href="/menu" 
          className={`flex items-center px-4 py-3 text-gray-300 hover:bg-navy-800 ${
            isActive('/menu') ? 'bg-navy-800 border-r-4 border-blue-500' : ''
          }`}
        >
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Menu</span>
        </Link>

        <Link 
          href="/orders" 
          className={`flex items-center px-4 py-3 text-gray-300 hover:bg-navy-800 ${
            isActive('/orders') ? 'bg-navy-800 border-r-4 border-blue-500' : ''
          }`}
        >
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Orders</span>
        </Link>


        <Link 
          href="/payments" 
          className={`flex items-center px-4 py-3 text-gray-300 hover:bg-navy-800 ${
            isActive('/payments') ? 'bg-navy-800 border-r-4 border-blue-500' : ''
          }`}
        >
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Payments</span>
        </Link>

        <Link 
          href="/reviews" 
          className={`flex items-center px-4 py-3 text-gray-300 hover:bg-navy-800 ${
            isActive('/reviews') ? 'bg-navy-800 border-r-4 border-blue-500' : ''
          }`}
        >
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Reviews</span>
        </Link>

        <Link 
          href="/promotions" 
          className={`flex items-center px-4 py-3 text-gray-300 hover:bg-navy-800 ${
            isActive('/promotions') ? 'bg-navy-800 border-r-4 border-blue-500' : ''
          }`}
        >
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Promotions</span>
        </Link>

        <Link 
          href="/settings" 
          className={`flex items-center px-4 py-3 text-gray-300 hover:bg-navy-800 ${
            isActive('/settings') ? 'bg-navy-800 border-r-4 border-blue-500' : ''
          }`}
        >
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Settings</span>
        </Link>

        <Link 
          href="/subscriptions" 
          className={`flex items-center px-4 py-3 text-gray-300 hover:bg-navy-800 ${
            isActive('/subscriptions') ? 'bg-navy-800 border-r-4 border-blue-500' : ''
          }`}
        >
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Subscriptions</span>
        </Link>


      </nav>

      <div className={`absolute bottom-0 ${isCollapsed ? 'w-20' : 'w-64'} p-4`}>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;