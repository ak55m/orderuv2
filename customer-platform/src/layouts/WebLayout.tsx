import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ClipboardList, UtensilsCrossed } from 'lucide-react';
import WebHeader from '../components/web/WebHeader';
import WebFooter from '../components/web/WebFooter';

interface WebLayoutProps {
  children: ReactNode;
}

const WebLayout: React.FC<WebLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="web-layout min-h-screen flex flex-col bg-white">
      <WebHeader />
      
      {/* Navigation buttons below header - centered regardless of container width */}
      <div className="flex justify-center py-5 mt-4 bg-white">
        <div className="flex space-x-4">
          <Link 
            to="/" 
            className={`px-3 py-1.5 font-medium text-sm rounded-full transition-colors flex items-center ${
              location.pathname === '/' ? 
                'bg-[#009DE0] text-white' : 
                'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
          >
            <Compass 
              size={16} 
              className={`mr-1 ${location.pathname === '/' ? 'text-white' : 'text-gray-500'}`} 
            />
            Explore
          </Link>
          <Link 
            to="/orders" 
            className={`px-3 py-1.5 font-medium text-sm rounded-full transition-colors flex items-center ${
              location.pathname === '/orders' ? 
                'bg-[#009DE0] text-white' : 
                'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
          >
            <ClipboardList 
              size={16} 
              className={`mr-1 ${location.pathname === '/orders' ? 'text-white' : 'text-gray-500'}`} 
            />
            Orders
          </Link>
          <Link 
            to="/restaurants" 
            className={`px-3 py-1.5 font-medium text-sm rounded-full transition-colors flex items-center ${
              location.pathname === '/restaurants' ? 
                'bg-[#009DE0] text-white' : 
                'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
          >
            <UtensilsCrossed 
              size={16} 
              className={`mr-1 ${location.pathname === '/restaurants' ? 'text-white' : 'text-gray-500'}`} 
            />
            Restaurants
          </Link>
        </div>
      </div>
      
      <div className="flex-grow mt-6">
        <main className="w-[97rem] mx-auto px-4">
          {children}
        </main>
      </div>
      
      <WebFooter />
    </div>
  );
};

export default WebLayout; 