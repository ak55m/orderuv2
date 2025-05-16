'use client';

import { useRouter } from 'next/navigation';

interface SubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionDialog({ isOpen, onClose }: SubscriptionDialogProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Required</h2>
        <p className="text-gray-600 mb-6">
          Please subscribe to access the full features of the platform.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
          <button
            onClick={() => router.push('/subscriptions')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
} 