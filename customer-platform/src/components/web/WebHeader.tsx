import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import AuthDialog from '../auth/AuthDialog';

const WebHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<'login' | 'signup'>('login');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };
  
  const openLoginDialog = () => {
    setAuthDialogMode('login');
    setAuthDialogOpen(true);
  };
  
  const openSignupDialog = () => {
    setAuthDialogMode('signup');
    setAuthDialogOpen(true);
  };
  
  const closeAuthDialog = () => {
    setAuthDialogOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="w-[97rem] mx-auto px-4">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo and Location */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-text-dark mr-4">OrderU</span>
            </Link>
            <div className="flex items-center text-text-dark cursor-pointer">
              <MapPin size={18} className="text-primary mr-1" />
              <span className="text-sm font-medium">Current Location</span>
              <ChevronDown size={16} className="ml-1" />
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 flex justify-start md:justify-center mx-4">
            <form onSubmit={handleSearch} className="relative w-full max-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in OrderU..."
                className="w-full bg-gray-200 rounded-full py-2 pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </form>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center">
            <button 
              onClick={openLoginDialog}
              className="text-text-dark mr-4 text-sm font-medium hover:text-primary"
            >
              Log in
            </button>
            <button 
              onClick={openSignupDialog}
              className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
      
      {/* Auth Dialog */}
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={closeAuthDialog} 
        initialMode={authDialogMode} 
      />
    </header>
  );
};

export default WebHeader; 