import React from 'react';
import { Link } from 'react-router-dom';

const WebFooter: React.FC = () => {
  return (
    <footer className="bg-[#141414] text-white py-6">
      <div className="w-[97rem] mx-auto px-4 text-center">
        <p className="mb-3">Developed by students at UT Dallas 🎓</p>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-3 text-sm text-gray-300">
          <Link to="/language" className="hover:text-white">English</Link>
          <Link to="/theme" className="hover:text-white">Theme</Link>
          <Link to="/cookies" className="hover:text-white">Cookies</Link>
          <Link to="/accessibility" className="hover:text-white">Accessibility Statement</Link>
          <Link to="/terms" className="hover:text-white">User Terms of Service</Link>
          <Link to="/privacy" className="hover:text-white">Privacy Statement</Link>
        </div>
        
        <p>©️ orderU 2025</p>
      </div>
    </footer>
  );
};

export default WebFooter; 