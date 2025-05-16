import React from 'react';
import { Link } from 'react-router-dom';

const MobileFooter: React.FC = () => {
  return (
    <footer className="bg-[#202125] px-4 py-8">
      {/* Development Credit */}
      <div className="text-center mb-8">
        <p className="text-white text-sm">
          Developed by students at <span className="text-[#C75B12]">UT DALLAS</span> 🎓
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex flex-col items-center space-y-4 mb-8">
        <Link to="/language" className="text-white/80 text-sm hover:text-white">
          English
        </Link>
        <Link to="/theme" className="text-white/80 text-sm hover:text-white">
          Theme
        </Link>
        <Link to="/cookies" className="text-white/80 text-sm hover:text-white">
          Cookies
        </Link>
        <Link to="/accessibility" className="text-white/80 text-sm hover:text-white">
          Accessibility Statement
        </Link>
        <Link to="/terms" className="text-white/80 text-sm hover:text-white">
          User Terms of Service
        </Link>
        <Link to="/privacy" className="text-white/80 text-sm hover:text-white">
          Privacy Statement
        </Link>
      </div>

      {/* Copyright */}
      <div className="text-center">
        <p className="text-white/60 text-sm">
          ©️ orderU {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default MobileFooter; 