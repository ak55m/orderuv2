import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ClipboardList, UtensilsCrossed, MapPin } from 'lucide-react';
import MobileFooter from '../components/mobile/MobileFooter';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [showLocationRow, setShowLocationRow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Check if we're on a restaurant details page
  const isRestaurantDetails = location.pathname.match(/^\/restaurants\/[^/]+$/);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;
      
      // Only handle location row visibility for non-restaurant-details pages
      if (!isRestaurantDetails) {
        if (isScrollingUp) {
          setShowLocationRow(true);
        } else {
          setShowLocationRow(currentScrollY < 60);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll event for better performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [lastScrollY, isRestaurantDetails]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Conditional Header based on route */}
      {!isRestaurantDetails && (
        <nav className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-sm${!showLocationRow ? ' border-b border-gray-300' : ''}`}>
          {/* Top Row: Logo, Search, Profile */}
          <div className="flex items-center h-16 px-4">
            <span className="text-xl font-bold text-black mr-2">orderu</span>
            <div className="flex-1 flex items-center relative mx-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder-gray-400"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-2-2"/></svg>
              </span>
            </div>
            <button className="ml-3 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.2 3.6-4 8-4s8 1.8 8 4"/></svg>
            </button>
          </div>
          {/* Second Row: Location */}
          {showLocationRow && (
            <div className="flex items-center px-3 py-2 border-b border-gray-300">
              <MapPin size={18} className="text-[#009DE0] mr-1" />
              <span className="text-sm font-medium text-[#009DE0]">Current Location</span>
            </div>
          )}
        </nav>
      )}

      {/* Main Content with conditional padding */}
      <main className={`flex-1 ${isRestaurantDetails ? '' : 'pt-[4.5rem] mx-4'}`}>
        {children}
      </main>

      {/* Remove the mb-20 div wrapper */}
      {!isRestaurantDetails && <MobileFooter />}

      {/* Bottom Mobile Nav Bar - only show on non-restaurant-details pages */}
      {!isRestaurantDetails && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 h-20 flex items-center justify-around">
          <Link
            to="/"
            className="flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-colors"
          >
            <Compass size={20} className={`mb-0.5 ${location.pathname === '/' ? 'text-[#009DE0]' : 'text-gray-500'}`} />
            <span className={location.pathname === '/' ? 'text-[#009DE0] font-semibold' : 'text-gray-500'}>Explore</span>
          </Link>
          <Link
            to="/orders"
            className="flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-colors"
          >
            <ClipboardList size={20} className={`mb-0.5 ${location.pathname === '/orders' ? 'text-[#009DE0]' : 'text-gray-500'}`} />
            <span className={location.pathname === '/orders' ? 'text-[#009DE0] font-semibold' : 'text-gray-500'}>Orders</span>
          </Link>
          <Link
            to="/restaurants"
            className="flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-colors"
          >
            <UtensilsCrossed size={20} className={`mb-0.5 ${location.pathname === '/restaurants' ? 'text-[#009DE0]' : 'text-gray-500'}`} />
            <span className={location.pathname === '/restaurants' ? 'text-[#009DE0] font-semibold' : 'text-gray-500'}>Restaurants</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

export default MobileLayout; 