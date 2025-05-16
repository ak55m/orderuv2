import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthDialog: React.FC<AuthDialogProps> = ({ 
  isOpen, 
  onClose,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: ''
  });

  // Update mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log(mode === 'login' ? 'Logging in with:' : 'Signing up with:', formData);
    // For demonstration purposes only
    alert(`${mode === 'login' ? 'Login' : 'Signup'} successful!`);
    onClose();
  };

  const handleGoogleAuth = () => {
    console.log('Authenticating with Google');
    // Implement Google auth logic
  };

  const handleAppleAuth = () => {
    console.log('Authenticating with Apple');
    // Implement Apple auth logic
  };

  const handleFacebookAuth = () => {
    console.log('Authenticating with Facebook');
    // Implement Facebook auth logic
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl dialog-animation-enter">
        {/* Header with close button */}
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
          
          <h2 className="text-center py-6 text-xl font-semibold text-text-dark">
            {mode === 'login' ? 'Create an account or log in' : 'Create an account'}
          </h2>
        </div>
        
        {/* Info text */}
        <div className="px-8 pb-4 text-sm text-center text-gray-600">
          {mode === 'login' 
            ? 'Log in below or create a new OrderU account.' 
            : 'Sign up for OrderU to order food and more.'}
        </div>

        {/* Social login buttons */}
        <div className="px-8 space-y-3">
          <button 
            onClick={handleGoogleAuth}
            className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {mode === 'login' ? 'Log in with Google' : 'Sign up with Google'}
          </button>
          
          <button 
            onClick={handleAppleAuth}
            className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-black text-white"
          >
            <svg className="w-5 h-5 mr-2" fill="white" viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.066 1.013 1.458 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zm3.47-3.345c.843-1.04 1.415-2.48 1.258-3.93-1.213.052-2.682.817-3.55 1.845-.78.909-1.462 2.35-1.28 3.74 1.354.104 2.728-.7 3.572-1.655z"></path>
            </svg>
            {mode === 'login' ? 'Log in with Apple' : 'Sign up with Apple'}
          </button>
          
          <button 
            onClick={handleFacebookAuth}
            className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-[#1877F2] text-white"
          >
            <svg className="w-5 h-5 mr-2" fill="white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            {mode === 'login' ? 'Log in with Facebook' : 'Sign up with Facebook'}
          </button>
        </div>
        
        {/* Divider */}
        <div className="flex items-center px-8 my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">or continue with email</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Your full name"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Your username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            {mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>
        
        {/* Terms and privacy */}
        <div className="px-8 pb-6 text-xs text-gray-500 text-center">
          By continuing, you agree to OrderU's{' '}
          <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default AuthDialog; 