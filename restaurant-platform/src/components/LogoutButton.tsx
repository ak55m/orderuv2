'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/authSlice';

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  );
} 