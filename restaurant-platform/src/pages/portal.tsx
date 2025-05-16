'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { restaurantApi } from '@/api/restaurantApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    restaurantId: string;
  };
}

export default function Portal() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { exists } = await restaurantApi.checkEmail(email);
      setIsExistingUser(exists);
      setShowPassword(true);
    } catch (err: any) {
      setError(err?.message || 'An error occurred');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = isExistingUser
        ? await restaurantApi.merchantLogin(email, password)
        : await restaurantApi.merchantRegister(email, password);

      dispatch(setCredentials({ user: data.user, token: data.token }));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'An error occurred');
    }
  };

  const handleBack = () => {
    setShowPassword(false);
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isExistingUser ? 'Welcome back!' : 'Create your account'}
          </h2>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {!showPassword ? (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                />
              </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                ← Back to email
              </button>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isExistingUser ? 'Sign in' : 'Create account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 